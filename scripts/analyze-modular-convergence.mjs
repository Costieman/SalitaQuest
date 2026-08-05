#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DEFAULT_BASELINE = '1f954fec0af3e8dd3fecf699565aae94d4b0df75';
const DEFAULT_REPORT = 'docs/MODULAR_CONVERGENCE_CHECKPOINT.md';
const DEFAULT_JSON = 'docs/MODULAR_CONVERGENCE_CHECKPOINT.json';
const MAX_BUFFER = 64 * 1024 * 1024;

const EXCLUDED_PREFIXES = [
  '.github/',
  'docs/',
  'scripts/',
  'tests/',
  'test/',
  'tools/',
  'node_modules/',
  'cloud-run/',
  'services/',
  'server/'
];

const WRAPPED_ENGINE_TARGETS = [
  'switchView',
  'saveState',
  'renderBadges',
  'recordDailyAnswer',
  'recordDailySession',
  'finishSession',
  'renderExercise',
  'loadBossExercise',
  'updateBoss'
];

const ENGINE_TOKENS = [
  'state',
  'session',
  'ITEMS',
  'MODULES',
  'BADGES',
  'saveState',
  'switchView',
  'toast',
  'renderBadges',
  'renderExercise',
  'finishSession',
  'levelInfo',
  'currentExercise',
  'selectedChoice',
  'loadBossExercise',
  'updateBoss'
];

function argument(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`);
  return value;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  }).trimEnd();
}

function resolveRef(ref) {
  return git(['rev-parse', `${ref}^{commit}`]).trim();
}

function listFiles(ref) {
  const output = git(['ls-tree', '-r', '--name-only', ref]);
  return output ? output.split('\n').filter(Boolean) : [];
}

function readAt(ref, file) {
  try {
    return git(['show', `${ref}:${file}`]);
  } catch {
    return null;
  }
}

function isRuntimeJavaScript(file) {
  if (!file.endsWith('.js')) return false;
  if (EXCLUDED_PREFIXES.some(prefix => file.startsWith(prefix))) return false;
  if (file.endsWith('.config.js')) return false;
  return true;
}

function categoryFor(file, content, bytes) {
  if (file.startsWith('src/adapters/')) return 'adapter';
  if (file.startsWith('src/features/')) return 'feature';
  if (file.startsWith('src/core/')) return 'core';
  if (file.startsWith('src/data/')) return 'data';
  if (file.startsWith('src/config/')) return 'config';
  if (!file.includes('/') && isCompatibilityCoordinator(content, bytes)) return 'compatibility-coordinator';
  if (!file.includes('/')) return 'root-runtime';
  if (file.startsWith('src/')) return 'other-src';
  return 'other-runtime';
}

function isCompatibilityCoordinator(content, bytes) {
  if (bytes > 9000) return false;
  const referencesModulePath = /src\/(?:features|adapters|core)\/[A-Za-z0-9_./-]+\.js/.test(content);
  const loadsScripts = /createElement\(\s*['"]script['"]\s*\)|appendChild\(|document\.write\(/.test(content);
  const ownsStorage = /\b(?:localStorage|sessionStorage)\s*\./.test(content);
  const ownsNetwork = /\bfetch\s*\(/.test(content);
  return referencesModulePath && loadsScripts && !ownsStorage && !ownsNetwork;
}

function stripCommentsAndStrings(source) {
  let output = '';
  let index = 0;
  let mode = 'code';
  let quote = '';
  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1] || '';
    if (mode === 'code') {
      if (char === '/' && next === '/') {
        output += '  ';
        index += 2;
        mode = 'line-comment';
        continue;
      }
      if (char === '/' && next === '*') {
        output += '  ';
        index += 2;
        mode = 'block-comment';
        continue;
      }
      if (char === '"' || char === "'" || char === '`') {
        quote = char;
        output += ' ';
        index += 1;
        mode = 'string';
        continue;
      }
      output += char;
      index += 1;
      continue;
    }
    if (mode === 'line-comment') {
      if (char === '\n') {
        output += '\n';
        mode = 'code';
      } else {
        output += ' ';
      }
      index += 1;
      continue;
    }
    if (mode === 'block-comment') {
      if (char === '*' && next === '/') {
        output += '  ';
        index += 2;
        mode = 'code';
      } else {
        output += char === '\n' ? '\n' : ' ';
        index += 1;
      }
      continue;
    }
    if (mode === 'string') {
      if (char === '\\') {
        output += '  ';
        index += 2;
        continue;
      }
      if (char === quote) {
        output += ' ';
        index += 1;
        mode = 'code';
      } else {
        output += char === '\n' ? '\n' : ' ';
        index += 1;
      }
    }
  }
  return output;
}

function countMatches(source, regex) {
  return [...source.matchAll(regex)].length;
}

function countBy(values) {
  const result = {};
  for (const value of values) result[value] = (result[value] || 0) + 1;
  return result;
}

function sortedUnique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function manifestMetrics(ref) {
  const generated = readAt(ref, 'src/config/module-contracts.generated.json');
  if (generated) {
    try {
      const parsed = JSON.parse(generated);
      const seeds = parsed.courseSeeds || {};
      return {
        source: 'module-contracts.generated.json',
        tagalogEntries: Array.isArray(seeds.tagalog) ? seeds.tagalog.length : null,
        cebuanoEntries: Array.isArray(seeds.cebuano) ? seeds.cebuano.length : null,
        uniqueEntries: sortedUnique(Object.values(seeds).flat().filter(value => typeof value === 'string')).length
      };
    } catch {
      // Fall through to the manifest string scan.
    }
  }
  const manifest = readAt(ref, 'src/config/course-manifest.js');
  if (!manifest) {
    return { source: 'unavailable', tagalogEntries: null, cebuanoEntries: null, uniqueEntries: null };
  }
  const entries = [...manifest.matchAll(/['"]([^'"]+\.js(?:\?[^'"]*)?)['"]/g)].map(match => match[1]);
  return {
    source: 'course-manifest string scan',
    tagalogEntries: null,
    cebuanoEntries: null,
    uniqueEntries: sortedUnique(entries).length
  };
}

function analyzeRef(ref) {
  const sha = resolveRef(ref);
  const files = listFiles(sha).filter(isRuntimeJavaScript);
  const categories = [];
  const records = [];
  const storageKeys = new Map();
  const appWindowSymbols = new Set();
  const customEvents = new Set();
  const engineTokenFiles = new Map(ENGINE_TOKENS.map(token => [token, new Set()]));
  const wrapperTargetFiles = new Map(WRAPPED_ENGINE_TARGETS.map(token => [token, new Set()]));

  let totalBytes = 0;
  let totalLines = 0;
  let storageCallSites = 0;
  let storageFiles = 0;
  let storageFilesOutsideAdapters = 0;
  let rootStorageFiles = 0;
  let switchViewCallSites = 0;
  let switchViewFilesOutsideAdapters = 0;
  let addEventListenerSites = 0;
  let fetchSites = 0;

  for (const file of files) {
    const content = readAt(sha, file) || '';
    const bytes = Buffer.byteLength(content, 'utf8');
    const lines = content === '' ? 0 : content.split('\n').length;
    const category = categoryFor(file, content, bytes);
    const stripped = stripCommentsAndStrings(content);
    const storageMatches = [...content.matchAll(/\b(localStorage|sessionStorage)\s*\.\s*(getItem|setItem|removeItem|clear)\s*\(/g)];
    const storageKeyMatches = [...content.matchAll(/\b(localStorage|sessionStorage)\s*\.\s*(getItem|setItem|removeItem)\s*\(\s*(['"])([^'"]+)\3/g)];
    const switchCalls = countMatches(stripped, /\bswitchView\s*\(/g);
    const appSymbols = [...content.matchAll(/\bwindow\.(Salita[A-Za-z0-9_$]+|__salita[A-Za-z0-9_$]+|SALITA_[A-Za-z0-9_$]+)/g)].map(match => match[1]);
    const events = [...content.matchAll(/['"](salita:[^'"]+)['"]/g)].map(match => match[1]);

    totalBytes += bytes;
    totalLines += lines;
    categories.push(category);
    storageCallSites += storageMatches.length;
    switchViewCallSites += switchCalls;
    addEventListenerSites += countMatches(stripped, /\.addEventListener\s*\(/g);
    fetchSites += countMatches(stripped, /\bfetch\s*\(/g);

    if (storageMatches.length > 0) {
      storageFiles += 1;
      if (category !== 'adapter') storageFilesOutsideAdapters += 1;
      if (category === 'root-runtime') rootStorageFiles += 1;
    }
    if (switchCalls > 0 && category !== 'adapter') switchViewFilesOutsideAdapters += 1;

    for (const match of storageKeyMatches) {
      const key = `${match[1]}:${match[4]}`;
      if (!storageKeys.has(key)) storageKeys.set(key, new Set());
      storageKeys.get(key).add(file);
    }
    for (const symbol of appSymbols) appWindowSymbols.add(symbol);
    for (const event of events) customEvents.add(event);

    for (const token of ENGINE_TOKENS) {
      const regex = new RegExp(`(^|[^.\\w$])${token.replace('$', '\\$')}\\b`, 'm');
      if (regex.test(stripped)) engineTokenFiles.get(token).add(file);
    }
    for (const target of WRAPPED_ENGINE_TARGETS) {
      const assignment = new RegExp(`(^|[^.\\w$])${target}\\s*=`, 'm');
      if (assignment.test(stripped)) wrapperTargetFiles.get(target).add(file);
    }

    records.push({
      file,
      category,
      bytes,
      lines,
      storageCallSites: storageMatches.length,
      switchViewCallSites: switchCalls,
      activeProfileKeys: [
        content.includes('salitaQuestLocalProfilesV1') ? 'profiles' : null,
        content.includes('salitaQuestActiveProfileId') ? 'active-id' : null
      ].filter(Boolean)
    });
  }

  const categoryCounts = countBy(categories);
  const coordinatorRecords = records.filter(record => record.category === 'compatibility-coordinator');
  const activeProfileReaders = records
    .filter(record => record.activeProfileKeys.includes('profiles') && record.activeProfileKeys.includes('active-id'))
    .map(record => record.file)
    .sort();
  const duplicatedStorageKeys = [...storageKeys.entries()]
    .map(([key, owners]) => ({ key, owners: [...owners].sort(), ownerCount: owners.size }))
    .filter(record => record.ownerCount > 1)
    .sort((a, b) => b.ownerCount - a.ownerCount || a.key.localeCompare(b.key));
  const wrapperHotspots = [...wrapperTargetFiles.entries()]
    .map(([target, owners]) => ({ target, owners: [...owners].sort(), ownerCount: owners.size }))
    .filter(record => record.ownerCount > 0)
    .sort((a, b) => b.ownerCount - a.ownerCount || a.target.localeCompare(b.target));
  const engineTokenHotspots = [...engineTokenFiles.entries()]
    .map(([token, owners]) => ({ token, ownerCount: owners.size, owners: [...owners].sort() }))
    .sort((a, b) => b.ownerCount - a.ownerCount || a.token.localeCompare(b.token));

  return {
    ref,
    sha,
    runtime: {
      files: files.length,
      bytes: totalBytes,
      lines: totalLines,
      categories: categoryCounts,
      rootFiles: records.filter(record => record.category === 'root-runtime').length,
      compatibilityCoordinators: coordinatorRecords.length,
      compatibilityCoordinatorBytes: coordinatorRecords.reduce((sum, record) => sum + record.bytes, 0),
      compatibilityCoordinatorFiles: coordinatorRecords.map(record => record.file).sort()
    },
    boundaries: {
      storageCallSites,
      storageFiles,
      storageFilesOutsideAdapters,
      rootStorageFiles,
      activeProfileReaderCount: activeProfileReaders.length,
      activeProfileReaders,
      duplicatedStorageKeys,
      switchViewCallSites,
      switchViewFilesOutsideAdapters,
      wrapperHotspots,
      engineTokenHotspots,
      appWindowSymbolCount: appWindowSymbols.size,
      customEventCount: customEvents.size,
      addEventListenerSites,
      fetchSites
    },
    manifest: manifestMetrics(sha),
    records
  };
}

function delta(current, baseline) {
  if (current == null || baseline == null) return null;
  return current - baseline;
}

function signed(value) {
  if (value == null) return 'n/a';
  return value > 0 ? `+${value}` : String(value);
}

function number(value) {
  return value == null ? 'n/a' : value.toLocaleString('en-US');
}

function percent(numerator, denominator) {
  if (!denominator) return '0.0%';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function tableRow(label, baseline, current) {
  return `| ${label} | ${number(baseline)} | ${number(current)} | ${signed(delta(current, baseline))} |`;
}

function topList(values, limit = 12) {
  return values.slice(0, limit);
}

function buildDecision(baseline, current) {
  const storageOutsideDelta = delta(current.boundaries.storageFilesOutsideAdapters, baseline.boundaries.storageFilesOutsideAdapters);
  const rootStorageDelta = delta(current.boundaries.rootStorageFiles, baseline.boundaries.rootStorageFiles);
  const runtimeFileDelta = delta(current.runtime.files, baseline.runtime.files);
  const coordinatorCount = current.runtime.compatibilityCoordinators;
  const activeReaders = current.boundaries.activeProfileReaderCount;
  const tagalogDelta = delta(current.manifest.tagalogEntries, baseline.manifest.tagalogEntries);
  const cebuanoDelta = delta(current.manifest.cebuanoEntries, baseline.manifest.cebuanoEntries);

  const meaningfulBoundaryImprovement = storageOutsideDelta < 0 || rootStorageDelta < 0;
  const structuralOverhead = runtimeFileDelta > 0 || coordinatorCount > 0;
  const verdict = meaningfulBoundaryImprovement
    ? structuralOverhead
      ? 'Meaningful architectural streamlining with temporary migration overhead.'
      : 'Meaningful architectural streamlining without material structural overhead.'
    : structuralOverhead
      ? 'Structural complexity has increased without enough measured ownership reduction; pause extraction and consolidate.'
      : 'No material architectural change was measured.';

  const actions = [];
  if (activeReaders >= 4) {
    actions.push(`Consolidate active-profile lookup: ${activeReaders} runtime files currently contain both profile-store keys.`);
  }
  if (coordinatorCount >= 8) {
    actions.push(`Create a retirement plan for ${coordinatorCount} compatibility coordinators; do not add coordinators without an explicit removal condition.`);
  }
  if ((tagalogDelta ?? 0) >= 8 || (cebuanoDelta ?? 0) >= 8) {
    actions.push('Run a browser startup/network performance smoke test before any merge because course startup entries have materially increased.');
  }
  actions.push('Do not extract Badge Chest until shared profile access and wrapper ownership have been reviewed against this report.');
  actions.push('Approve future extraction only when it removes duplicate storage/global ownership, not merely when it relocates code.');

  return {
    verdict,
    meaningfulBoundaryImprovement,
    structuralOverhead,
    actions
  };
}

function buildMarkdown(baseline, current, decision) {
  const currentCoordinatorShare = percent(current.runtime.compatibilityCoordinatorBytes, current.runtime.bytes);
  const duplicatedKeys = topList(current.boundaries.duplicatedStorageKeys, 10);
  const wrappers = topList(current.boundaries.wrapperHotspots, 10);
  const engineTokens = topList(current.boundaries.engineTokenHotspots, 10);

  const lines = [
    '# Modular convergence checkpoint',
    '',
    `Baseline: \`${baseline.sha}\``,
    '',
    `Current stacked head: \`${current.sha}\``,
    '',
    '## Verdict',
    '',
    `**${decision.verdict}**`,
    '',
    'The refactor should now move into a convergence phase: continue only where a boundary removes duplicate ownership, consolidate repeated profile access, and treat compatibility loaders as temporary migration infrastructure.',
    '',
    '## Measured architecture',
    '',
    '| Metric | Pre-refactor | Current | Change |',
    '|---|---:|---:|---:|',
    tableRow('Runtime JavaScript files', baseline.runtime.files, current.runtime.files),
    tableRow('Runtime JavaScript bytes', baseline.runtime.bytes, current.runtime.bytes),
    tableRow('Root behavioral runtime files', baseline.runtime.rootFiles, current.runtime.rootFiles),
    tableRow('Feature modules', baseline.runtime.categories.feature || 0, current.runtime.categories.feature || 0),
    tableRow('Adapter modules', baseline.runtime.categories.adapter || 0, current.runtime.categories.adapter || 0),
    tableRow('Compatibility coordinators', baseline.runtime.compatibilityCoordinators, current.runtime.compatibilityCoordinators),
    tableRow('Direct storage call sites', baseline.boundaries.storageCallSites, current.boundaries.storageCallSites),
    tableRow('Files with direct storage', baseline.boundaries.storageFiles, current.boundaries.storageFiles),
    tableRow('Direct-storage files outside adapters', baseline.boundaries.storageFilesOutsideAdapters, current.boundaries.storageFilesOutsideAdapters),
    tableRow('Root files with direct storage', baseline.boundaries.rootStorageFiles, current.boundaries.rootStorageFiles),
    tableRow('Files implementing active-profile lookup', baseline.boundaries.activeProfileReaderCount, current.boundaries.activeProfileReaderCount),
    tableRow('Direct switchView call sites', baseline.boundaries.switchViewCallSites, current.boundaries.switchViewCallSites),
    tableRow('Non-adapter files calling switchView', baseline.boundaries.switchViewFilesOutsideAdapters, current.boundaries.switchViewFilesOutsideAdapters),
    tableRow('Application window symbols', baseline.boundaries.appWindowSymbolCount, current.boundaries.appWindowSymbolCount),
    tableRow('Custom Salita events', baseline.boundaries.customEventCount, current.boundaries.customEventCount),
    tableRow('Event-listener call sites', baseline.boundaries.addEventListenerSites, current.boundaries.addEventListenerSites),
    tableRow('Network fetch call sites', baseline.boundaries.fetchSites, current.boundaries.fetchSites),
    tableRow('Tagalog startup entries', baseline.manifest.tagalogEntries, current.manifest.tagalogEntries),
    tableRow('Cebuano startup entries', baseline.manifest.cebuanoEntries, current.manifest.cebuanoEntries),
    '',
    '## What has genuinely improved',
    '',
    `- Direct-storage ownership outside adapters changed by **${signed(delta(current.boundaries.storageFilesOutsideAdapters, baseline.boundaries.storageFilesOutsideAdapters))} files**.`,
    `- Root-level storage owners changed by **${signed(delta(current.boundaries.rootStorageFiles, baseline.boundaries.rootStorageFiles))} files**.`,
    `- The codebase now has **${number(current.runtime.categories.feature || 0)} explicit feature modules** and **${number(current.runtime.categories.adapter || 0)} explicit adapters**, making ownership testable.`,
    '- Existing public APIs and historical URLs remain available while implementation ownership moves behind named boundaries.',
    '',
    '## Cost and over-modularisation risk',
    '',
    `- Runtime JavaScript file count changed by **${signed(delta(current.runtime.files, baseline.runtime.files))}**.`,
    `- There are **${current.runtime.compatibilityCoordinators} compatibility coordinators**, totalling **${number(current.runtime.compatibilityCoordinatorBytes)} bytes** (${currentCoordinatorShare} of scanned runtime JavaScript).`,
    `- **${current.boundaries.activeProfileReaderCount} files** still implement active-profile lookup using both profile-store keys. This is the clearest current duplication hotspot.`,
    '- More modules and startup entries improve separation but can increase loader fragility and browser-request overhead if they are not later bundled or consolidated.',
    '',
    '## Active-profile lookup owners',
    '',
    ...(current.boundaries.activeProfileReaders.length
      ? current.boundaries.activeProfileReaders.map(file => `- \`${file}\``)
      : ['- None detected.']),
    '',
    '## Most duplicated direct storage keys',
    '',
    ...(duplicatedKeys.length
      ? duplicatedKeys.flatMap(record => [
          `### \`${record.key}\` — ${record.ownerCount} owners`,
          '',
          ...record.owners.map(file => `- \`${file}\``),
          ''
        ])
      : ['No duplicated direct storage keys were detected.', '']),
    '## Engine wrapper/replacement hotspots',
    '',
    ...(wrappers.length
      ? wrappers.map(record => `- \`${record.target}\`: ${record.ownerCount} file(s) — ${record.owners.map(file => `\`${file}\``).join(', ')}`)
      : ['- None detected.']),
    '',
    '## Broad engine-token reference hotspots',
    '',
    'These are lexical references, not proof that every occurrence is a global. They identify areas that need manual boundary review.',
    '',
    ...(engineTokens.length
      ? engineTokens.map(record => `- \`${record.token}\`: ${record.ownerCount} runtime file(s)`)
      : ['- None detected.']),
    '',
    '## Compatibility coordinators',
    '',
    ...(current.runtime.compatibilityCoordinatorFiles.length
      ? current.runtime.compatibilityCoordinatorFiles.map(file => `- \`${file}\``)
      : ['- None detected.']),
    '',
    '## Required convergence actions',
    '',
    ...decision.actions.map((action, index) => `${index + 1}. ${action}`),
    '',
    '## Decision rubric for the remaining refactor',
    '',
    'A proposed extraction should proceed only when all of the following are true:',
    '',
    '1. It removes direct storage, navigation or engine-global ownership from at least one feature.',
    '2. It does not duplicate an adapter capability that already exists.',
    '3. Its compatibility coordinator has a documented retirement condition.',
    '4. It preserves startup order and receives a targeted behavioral simulation.',
    '5. It leaves the stacked branch one commit ahead and zero behind its exact parent.',
    '',
    'A consolidation should take priority when any of the following are true:',
    '',
    '1. Four or more modules independently implement the same profile lookup.',
    '2. Multiple adapters expose substantially overlapping storage methods.',
    '3. A wrapper target has more than one active replacement owner.',
    '4. Compatibility coordinators exceed eight without a retirement plan.',
    '5. Startup entries increase materially without a browser performance checkpoint.',
    '',
    '## Method',
    '',
    '- Scans browser-runtime `.js` files while excluding workflows, documentation, validators, tests, tools and backend-service directories.',
    '- Compares the permanent pre-refactor rollback commit with the exact stacked head.',
    '- Counts direct browser-storage calls, known profile-key ownership, navigation calls, wrapper assignments, compatibility-loader heuristics, manifest entries, events and application globals.',
    '- Treats engine-token counts as review signals rather than definitive scope analysis.',
    ''
  ];
  return `${lines.join('\n')}\n`;
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeOrCheck(file, content, check) {
  if (check) {
    const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (existing !== content) {
      console.error(`${file} is out of date. Run analyze-modular-convergence.mjs without --check.`);
      process.exitCode = 1;
    }
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

const baselineRef = argument('--baseline', DEFAULT_BASELINE);
const currentRef = argument('--current', 'HEAD');
const reportPath = argument('--report', DEFAULT_REPORT);
const jsonPath = argument('--json', DEFAULT_JSON);
const check = hasFlag('--check');

const baseline = analyzeRef(baselineRef);
const current = analyzeRef(currentRef);
const decision = buildDecision(baseline, current);
const result = {
  schemaVersion: 1,
  baseline,
  current,
  comparison: {
    runtimeFileDelta: delta(current.runtime.files, baseline.runtime.files),
    runtimeByteDelta: delta(current.runtime.bytes, baseline.runtime.bytes),
    storageCallSiteDelta: delta(current.boundaries.storageCallSites, baseline.boundaries.storageCallSites),
    storageFilesOutsideAdaptersDelta: delta(current.boundaries.storageFilesOutsideAdapters, baseline.boundaries.storageFilesOutsideAdapters),
    rootStorageFilesDelta: delta(current.boundaries.rootStorageFiles, baseline.boundaries.rootStorageFiles),
    activeProfileReaderDelta: delta(current.boundaries.activeProfileReaderCount, baseline.boundaries.activeProfileReaderCount),
    tagalogStartupEntryDelta: delta(current.manifest.tagalogEntries, baseline.manifest.tagalogEntries),
    cebuanoStartupEntryDelta: delta(current.manifest.cebuanoEntries, baseline.manifest.cebuanoEntries)
  },
  decision
};

writeOrCheck(reportPath, buildMarkdown(baseline, current, decision), check);
writeOrCheck(jsonPath, stableJson(result), check);

if (process.exitCode) process.exit(process.exitCode);
console.log(JSON.stringify({
  baseline: baseline.sha,
  current: current.sha,
  verdict: decision.verdict,
  runtimeFiles: { baseline: baseline.runtime.files, current: current.runtime.files },
  storageFilesOutsideAdapters: {
    baseline: baseline.boundaries.storageFilesOutsideAdapters,
    current: current.boundaries.storageFilesOutsideAdapters
  },
  activeProfileReaders: current.boundaries.activeProfileReaderCount,
  compatibilityCoordinators: current.runtime.compatibilityCoordinators
}, null, 2));
