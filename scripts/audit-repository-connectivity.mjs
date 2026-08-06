import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root = process.cwd();
const reportDir = path.join(root, "reports");
fs.mkdirSync(reportDir, {recursive:true});

const files = execFileSync("git", ["ls-files"], {encoding:"utf8"})
  .split(/\r?\n/).filter(Boolean).sort();
const fileSet = new Set(files);
const textExtensions = new Set([".html",".js",".mjs",".css",".json",".webmanifest",".md",".yml",".yaml",".txt",".py",".sh"]);
const codeExtensions = new Set([".html",".js",".mjs",".css",".json",".webmanifest",".py",".sh"]);
const runtimeSeeds = ["index.html","app.html","manifest.webmanifest","service-worker.js"].filter(file => fileSet.has(file));
const workflowSeeds = files.filter(file => file.startsWith(".github/workflows/") && /\.ya?ml$/i.test(file));
const docs = files.filter(file => /(^|\/)(readme[^/]*|.*(?:notes|research|checklist|migration|transfer|changelog|upgrade).*?)\.md$/i.test(file));
const sourceText = new Map();

for (const file of files) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  try { sourceText.set(file, fs.readFileSync(path.join(root, file), "utf8")); }
  catch {}
}

const normalize = value => value
  .replace(/[?#].*$/, "")
  .replace(/^https?:\/\/[^/]+\//, "")
  .replace(/^\.\//, "")
  .replace(/^\//, "")
  .replace(/\\/g, "/");

function resolveCandidate(fromFile, raw) {
  const clean = normalize(String(raw || "").trim().replace(/^['"]|['"]$/g, ""));
  if (!clean || clean.startsWith("data:") || clean.startsWith("javascript:") || clean.includes("${")) return null;
  const candidates = [
    clean,
    path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), clean))
  ];
  for (const candidate of candidates) if (fileSet.has(candidate)) return candidate;
  return null;
}

const refs = new Map(files.map(file => [file, new Set()]));
const reverse = new Map(files.map(file => [file, new Set()]));
const addRef = (from, raw) => {
  const target = resolveCandidate(from, raw);
  if (!target || target === from) return;
  refs.get(from).add(target);
  reverse.get(target).add(from);
};

const quotedPathPattern = /["']((?:\.\.?\/|\/)?[A-Za-z0-9_@.-]+(?:\/[A-Za-z0-9_@.()\[\]-]+)*\.(?:js|mjs|css|html|json|webmanifest|png|jpg|jpeg|svg|webp|mp3|wav|ogg|woff2?|ttf|py|sh))["']/gi;
const htmlPattern = /(?:src|href|content)\s*=\s*["']([^"']+)["']/gi;
const loaderPattern = /(?:import\s+(?:[^"']+?\s+from\s+)?|import\s*\(|require\s*\(|loadScript\s*\(|fetch\s*\(|new\s+Worker\s*\(|register\s*\()["']([^"']+)["']/gi;
const workflowCommandPattern = /(?:^|[\s;|&])(?:node|python3?|bash|sh)\s+([^\s"']+\.(?:mjs|js|py|sh))(?=\s|$)/gmi;
const shellPathPattern = /(?:^|[\s;|&])(?:\.\/)?((?:scripts|tools|tests?)\/[A-Za-z0-9_@.()\[\]\/-]+\.(?:mjs|js|py|sh))(?=\s|$)/gmi;

for (const [file, text] of sourceText) {
  for (const pattern of [htmlPattern, loaderPattern, quotedPathPattern, workflowCommandPattern, shellPathPattern]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) addRef(file, match[1]);
  }

  if (/\.(?:json|webmanifest)$/i.test(file)) {
    for (const candidate of files) {
      if (candidate === file) continue;
      const relative = path.posix.relative(path.posix.dirname(file), candidate);
      const base = path.posix.basename(candidate);
      if (text.includes(candidate) || text.includes(`./${candidate}`) || text.includes(relative) || text.includes(base)) {
        addRef(file, candidate);
      }
    }
  }
}

function traverse(seeds) {
  const seen = new Set();
  const queue = [...seeds];
  while (queue.length) {
    const file = queue.shift();
    if (!fileSet.has(file) || seen.has(file)) continue;
    seen.add(file);
    for (const target of refs.get(file) || []) queue.push(target);
  }
  return seen;
}

const runtime = traverse(runtimeSeeds);
const development = traverse(workflowSeeds);
for (const file of workflowSeeds) development.add(file);

const serviceWorkerText = sourceText.get("service-worker.js") || "";
const cacheMentioned = new Set();
for (const file of files) if (serviceWorkerText.includes(file) || serviceWorkerText.includes(`./${file}`)) cacheMentioned.add(file);

const categories = new Map();
const reasons = new Map();
function classify(file, category, reason) { categories.set(file, category); reasons.set(file, reason); }

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (runtime.has(file)) classify(file, "runtime-active", "Reachable from a deployed entry point through a static, loader, manifest, or cache reference chain.");
  else if (development.has(file)) classify(file, "development-active", "Reachable from a GitHub Actions workflow, command, validator, or tooling chain.");
  else if (docs.includes(file)) classify(file, "documentation-or-history", "Documentation, migration, research, checklist, or changelog material; not part of the deployed runtime.");
  else if (/^(audio|assets|images|icons|languages)\//.test(file) && !codeExtensions.has(ext)) {
    if ((reverse.get(file)?.size || 0) > 0 || cacheMentioned.has(file)) classify(file, "runtime-asset", "Referenced by code/data, a manifest, or explicitly cached.");
    else classify(file, "unverified-asset", "Media/static asset with no detected inbound reference; may still be selected through generated names.");
  } else if (/^(scripts|tools|tests?|reports)\//.test(file)) classify(file, "unwired-development", "Development-oriented file not reachable from current workflows or tooling chains.");
  else if (/^\.github\/workflows\//.test(file)) classify(file, "development-active", "GitHub Actions workflow.");
  else if ((reverse.get(file)?.size || 0) === 0) classify(file, "disconnected-candidate", "No detected inbound reference and not an entry point, workflow dependency, documentation, or known asset class.");
  else classify(file, "indirect-or-dynamic", "Has inbound references but is not reachable from identified deployment or workflow seeds.");
}

const versionFamilies = new Map();
for (const file of files) {
  const base = path.basename(file).replace(/(?:[-_.]v?\d+(?:[-_.]\d+)*)+(?=\.[^.]+$)/i, "");
  const key = `${path.dirname(file)}/${base}${path.extname(file)}`;
  if (!versionFamilies.has(key)) versionFamilies.set(key, []);
  versionFamilies.get(key).push(file);
}
const overlappingFamilies = [...versionFamilies.values()].filter(group => group.length > 1).sort((a,b) => b.length-a.length);

const counts = {};
for (const category of categories.values()) counts[category] = (counts[category] || 0) + 1;
const rows = files.map(file => ({
  file,
  bytes: fs.statSync(path.join(root,file)).size,
  category: categories.get(file),
  reason: reasons.get(file),
  inbound: [...(reverse.get(file) || [])].sort(),
  outbound: [...(refs.get(file) || [])].sort()
}));

const candidates = rows.filter(row => ["disconnected-candidate","unwired-development","indirect-or-dynamic","unverified-asset"].includes(row.category));
const json = {
  generatedAt: new Date().toISOString(),
  commit: execFileSync("git", ["rev-parse","HEAD"], {encoding:"utf8"}).trim(),
  limitations: [
    "This remains static reachability analysis; computed filenames, server-side routes, browser storage keys, and runtime-generated URLs can evade detection.",
    "A disconnected candidate is not automatically safe to delete. It requires targeted runtime and historical review.",
    "Large media libraries may be addressed through generated hashes; those assets remain unverified until manifest coverage is checked."
  ],
  seeds: {runtime:runtimeSeeds, workflows:workflowSeeds},
  counts,
  overlappingVersionFamilies: overlappingFamilies,
  candidates,
  files: rows
};
fs.writeFileSync(path.join(reportDir,"repository-connectivity-audit.json"), JSON.stringify(json,null,2));

const md = [];
md.push("# Repository connectivity audit", "", `Commit: \`${json.commit}\``, "");
md.push("## Classification summary", "", "| Category | Files |", "|---|---:|");
for (const [category,count] of Object.entries(counts).sort()) md.push(`| ${category} | ${count} |`);
md.push("", "## Highest-priority review groups", "");
for (const category of ["disconnected-candidate","unwired-development","indirect-or-dynamic","unverified-asset"]) {
  const group = candidates.filter(row => row.category === category);
  md.push(`### ${category} (${group.length})`, "");
  if (!group.length) md.push("None.", "");
  else for (const row of group) md.push(`- \`${row.file}\` — ${row.reason}${row.inbound.length ? ` Inbound: ${row.inbound.map(x=>`\`${x}\``).join(", ")}.` : ""}`);
  md.push("");
}
md.push("## Versioned or overlapping filename families", "");
for (const group of overlappingFamilies) md.push(`- ${group.map(file => `\`${file}\``).join(", ")}`);
md.push("", "## Method and cautions", "");
for (const limitation of json.limitations) md.push(`- ${limitation}`);
fs.writeFileSync(path.join(reportDir,"repository-connectivity-audit.md"), md.join("\n"));

console.log(`Audited ${files.length} tracked files. ${candidates.length} require manual review. Reports written to reports/.`);
