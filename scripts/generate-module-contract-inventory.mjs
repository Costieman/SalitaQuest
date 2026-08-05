import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const MANIFEST_FILE = "src/config/course-manifest.js";
const JSON_OUTPUT = "src/config/module-contracts.generated.json";
const MARKDOWN_OUTPUT = "docs/MODULE_CONTRACT_INVENTORY.md";
const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check");

const browserWindowMembers = new Set([
  "addEventListener","alert","atob","btoa","clearInterval","clearTimeout","confirm","console",
  "crypto","devicePixelRatio","dispatchEvent","document","fetch","history","innerHeight","innerWidth",
  "location","matchMedia","navigator","open","performance","removeEventListener","requestAnimationFrame",
  "scrollTo","sessionStorage","setInterval","setTimeout","speechSynthesis","URL","URLSearchParams"
]);

const sorted = values => [...new Set(values)].sort((a, b) => a.localeCompare(b));
const read = relative => fs.readFileSync(path.join(ROOT, relative), "utf8");
const exists = relative => fs.existsSync(path.join(ROOT, relative));
const cleanAsset = value => String(value || "").split(/[?#]/, 1)[0].replace(/^\.\//, "");
const md = value => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");

function loadManifest() {
  const context = {window:{}};
  vm.createContext(context);
  new vm.Script(read(MANIFEST_FILE), {filename:MANIFEST_FILE}).runInContext(context);
  const manifest = context.window.SalitaQuestCourseManifest;
  if (!manifest?.courses) throw new Error("Course manifest could not be evaluated.");
  return manifest;
}

function constantStrings(source) {
  const values = new Map();
  const pattern = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(["'`])([^\n"'`]+)\2/g;
  for (const match of source.matchAll(pattern)) values.set(match[1], match[3]);
  return values;
}

function discoverScriptRefs(source, owner) {
  const refs = [];
  const pattern = /["'`](\.?\/?[A-Za-z0-9_./-]+\.js)(?:\?[^"'`]*)?["'`]/g;
  for (const match of source.matchAll(pattern)) {
    const raw = match[1];
    if (/^(?:https?:|data:|blob:)/i.test(raw)) continue;
    const relative = raw.startsWith("./") || raw.startsWith("../")
      ? path.posix.normalize(path.posix.join(path.posix.dirname(owner), raw))
      : path.posix.normalize(raw);
    if (relative.startsWith("../") || !exists(relative)) continue;
    refs.push(relative);
  }
  return sorted(refs);
}

function extractDeclarations(source, topLevelOnly = false) {
  const names = [];
  const pattern = topLevelOnly
    ? /^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm
    : /\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of source.matchAll(pattern)) names.push(match[1]);
  return sorted(names);
}

function extractWindowContracts(source, constants) {
  const provides = [];
  const all = [];
  for (const match of source.matchAll(/\bwindow\.([A-Za-z_$][\w$]*)/g)) all.push(match[1]);
  for (const match of source.matchAll(/\bwindow\.([A-Za-z_$][\w$]*)\s*(?:=|\|\|=|\?\?=)/g)) provides.push(match[1]);
  for (const match of source.matchAll(/\bwindow\[(["'])([^"']+)\1\]\s*(?:=|\|\|=|\?\?=)/g)) provides.push(match[2]);
  for (const match of source.matchAll(/\bwindow\[([A-Za-z_$][\w$]*)\]\s*(?:=|\|\|=|\?\?=)/g)) {
    if (constants.has(match[1])) provides.push(constants.get(match[1]));
  }
  const provided = new Set(provides);
  const consumes = all.filter(name => !provided.has(name) && !browserWindowMembers.has(name));
  return {provides:sorted(provides), consumes:sorted(consumes)};
}

function resolveArgument(raw, constants) {
  const value = String(raw || "").trim();
  const literal = value.match(/^(["'`])([\s\S]*?)\1$/);
  if (literal) return literal[2];
  if (/^[A-Za-z_$][\w$]*$/.test(value) && constants.has(value)) return constants.get(value);
  return value.replace(/\s+/g, " ").slice(0, 180);
}

function extractStorage(source, constants) {
  const operations = [];
  const pattern = /\b(localStorage|sessionStorage)\.(getItem|setItem|removeItem)\(\s*([^,\)]+)/g;
  for (const match of source.matchAll(pattern)) {
    operations.push({store:match[1], operation:match[2], key:resolveArgument(match[3], constants)});
  }
  const candidateKeys = [];
  for (const match of source.matchAll(/["'`](salitaQuest[A-Za-z0-9._:${}-]*)["'`]/g)) candidateKeys.push(match[1]);
  return {operations, candidateKeys:sorted(candidateKeys)};
}

function extractDom(source) {
  const ids = [];
  const selectors = [];
  const datasets = [];
  for (const match of source.matchAll(/\.getElementById\(\s*(["'])([^"']+)\1\s*\)/g)) ids.push(match[2]);
  for (const match of source.matchAll(/\.(?:querySelector|querySelectorAll|closest|matches)\(\s*(["'])([^"']+)\1\s*\)/g)) selectors.push(match[2]);
  for (const match of source.matchAll(/\.dataset\.([A-Za-z_$][\w$]*)/g)) datasets.push(match[1]);
  return {ids:sorted(ids), selectors:sorted(selectors), datasets:sorted(datasets)};
}

function extractEvents(source) {
  const listens = [];
  const dispatches = [];
  for (const match of source.matchAll(/\.addEventListener\(\s*(["'])([^"']+)\1/g)) listens.push(match[2]);
  for (const match of source.matchAll(/new\s+(?:CustomEvent|Event)\(\s*(["'])([^"']+)\1/g)) dispatches.push(match[2]);
  return {listens:sorted(listens), dispatches:sorted(dispatches)};
}

function classify(file, record) {
  if (file === "app.js") return "core-engine";
  if (file === MANIFEST_FILE) return "course-config";
  if (file === "src/app/course-bootstrap.js") return "course-bootstrap";
  if (file === "service-worker.js") return "offline-runtime";
  if (record.dynamicScripts.length) return "runtime-loader";
  if (file.includes("avatar") || file.includes("badge") || file.includes("achievement") || file.includes("coin")) return "collection-and-rewards";
  if (file.includes("profile") || file.includes("placement")) return "profile-and-onboarding";
  if (file.includes("audio") || file.includes("pronunciation")) return "audio";
  if (file.includes("progress") || file.includes("mastery") || file.includes("daily") || file.includes("weekly") || file.includes("key-run")) return "progression";
  if (file.includes("navigation") || file.includes("layout") || file.includes("topbar") || file.includes("mobile") || file.includes("ui-")) return "interface";
  return "feature-extension";
}

function readiness(record) {
  const writes = record.storage.operations.filter(item => item.operation !== "getItem").length;
  const coupling = record.coreGlobals.length + record.window.consumes.length;
  const dom = record.dom.ids.length + record.dom.selectors.length;
  if (record.file === "app.js" || record.classification === "runtime-loader") return "hold";
  if (coupling > 12 || writes > 4 || dom > 24) return "high-coupling";
  if (coupling > 5 || writes > 1 || dom > 10) return "prepare-adapter";
  return "extraction-candidate";
}

function riskScore(record) {
  const writes = record.storage.operations.filter(item => item.operation !== "getItem").length;
  return record.coreGlobals.length * 3
    + record.window.consumes.length * 2
    + record.window.provides.length * 2
    + writes * 4
    + record.storage.operations.length
    + record.dom.ids.length
    + Math.ceil(record.dom.selectors.length / 2)
    + record.events.dispatches.length * 2
    + record.dynamicScripts.length * 5;
}

function buildInventory() {
  const manifest = loadManifest();
  const courseSeeds = {};
  for (const [courseId, course] of Object.entries(manifest.courses)) {
    courseSeeds[courseId] = sorted(["app.js", ...course.scripts.map(cleanAsset)]).filter(exists);
  }
  const reach = new Map();
  const queue = [];
  const enqueue = (file, course) => {
    if (!exists(file)) return;
    if (!reach.has(file)) reach.set(file, new Set());
    const courses = reach.get(file);
    const before = courses.size;
    courses.add(course);
    if (courses.size !== before) queue.push({file, course});
  };
  for (const [course, files] of Object.entries(courseSeeds)) files.forEach(file => enqueue(file, course));
  enqueue(MANIFEST_FILE, "bootstrap");
  enqueue("src/app/course-bootstrap.js", "bootstrap");

  const sources = new Map();
  while (queue.length) {
    const {file, course} = queue.shift();
    if (!sources.has(file)) sources.set(file, read(file));
    for (const ref of discoverScriptRefs(sources.get(file), file)) enqueue(ref, course);
  }

  const coreGlobals = new Set(extractDeclarations(sources.get("app.js") || read("app.js"), true));
  const modules = [];
  for (const file of sorted(sources.keys())) {
    const source = sources.get(file);
    const constants = constantStrings(source);
    const localDeclarations = new Set(extractDeclarations(source));
    const coreRefs = file === "app.js" ? [] : [...coreGlobals].filter(name => {
      if (localDeclarations.has(name)) return false;
      return new RegExp(`\\b${name.replace(/[$]/g, "\\$")}\\b`).test(source);
    });
    const record = {
      file,
      bytes:Buffer.byteLength(source),
      courses:sorted(reach.get(file) || []),
      dynamicScripts:discoverScriptRefs(source, file),
      topLevelDeclarations:extractDeclarations(source, true),
      coreGlobals:sorted(coreRefs),
      window:extractWindowContracts(source, constants),
      storage:extractStorage(source, constants),
      dom:extractDom(source),
      events:extractEvents(source)
    };
    record.classification = classify(file, record);
    record.readiness = readiness(record);
    record.riskScore = riskScore(record);
    modules.push(record);
  }

  const providerMap = new Map();
  for (const module of modules) {
    for (const symbol of module.window.provides) {
      if (!providerMap.has(symbol)) providerMap.set(symbol, []);
      providerMap.get(symbol).push(module.file);
    }
  }
  const edges = [];
  for (const module of modules) {
    module.dynamicScripts.forEach(target => edges.push({from:module.file, to:target, type:"loads"}));
    if (module.coreGlobals.length) edges.push({from:module.file, to:"app.js", type:"core-globals", symbols:module.coreGlobals});
    for (const symbol of module.window.consumes) {
      for (const provider of providerMap.get(symbol) || []) {
        if (provider !== module.file) edges.push({from:module.file, to:provider, type:"window-api", symbols:[symbol]});
      }
    }
  }

  const storageMap = new Map();
  for (const module of modules) {
    for (const operation of module.storage.operations) {
      const id = `${operation.store}:${operation.key}`;
      if (!storageMap.has(id)) storageMap.set(id, {store:operation.store,key:operation.key,readers:[],writers:[],removers:[]});
      const item = storageMap.get(id);
      if (operation.operation === "getItem") item.readers.push(module.file);
      if (operation.operation === "setItem") item.writers.push(module.file);
      if (operation.operation === "removeItem") item.removers.push(module.file);
    }
  }
  const storage = [...storageMap.values()].map(item => ({
    ...item,
    readers:sorted(item.readers),
    writers:sorted(item.writers),
    removers:sorted(item.removers)
  })).sort((a,b) => `${a.store}:${a.key}`.localeCompare(`${b.store}:${b.key}`));

  const eventsMap = new Map();
  for (const module of modules) {
    for (const name of module.events.listens) {
      if (!eventsMap.has(name)) eventsMap.set(name,{name,listeners:[],dispatchers:[]});
      eventsMap.get(name).listeners.push(module.file);
    }
    for (const name of module.events.dispatches) {
      if (!eventsMap.has(name)) eventsMap.set(name,{name,listeners:[],dispatchers:[]});
      eventsMap.get(name).dispatchers.push(module.file);
    }
  }
  const events = [...eventsMap.values()].map(item => ({...item,listeners:sorted(item.listeners),dispatchers:sorted(item.dispatchers)})).sort((a,b)=>a.name.localeCompare(b.name));

  const sourceCommit = String(manifest.sourceDocument).match(/\/([0-9a-f]{40})\/index\.html$/)?.[1] || null;
  return {
    schemaVersion:1,
    manifestFile:MANIFEST_FILE,
    sourceDocument:manifest.sourceDocument,
    sourceDocumentCommit:sourceCommit,
    courseSeeds,
    summary:{
      modules:modules.length,
      dependencyEdges:edges.length,
      storageContracts:storage.length,
      customEvents:events.filter(item => item.name.startsWith("salita:")).length,
      extractionCandidates:modules.filter(item => item.readiness === "extraction-candidate").length,
      highCoupling:modules.filter(item => item.readiness === "high-coupling").length,
      held:modules.filter(item => item.readiness === "hold").length
    },
    modules,
    edges,
    storage,
    events,
    windowApis:[...providerMap.entries()].map(([symbol,providers])=>({symbol,providers:sorted(providers)})).sort((a,b)=>a.symbol.localeCompare(b.symbol))
  };
}

function renderMarkdown(inventory) {
  const modulesByRisk = [...inventory.modules].sort((a,b) => b.riskScore - a.riskScore || a.file.localeCompare(b.file));
  const candidates = inventory.modules.filter(item => item.readiness === "extraction-candidate").sort((a,b)=>a.riskScore-b.riskScore || a.file.localeCompare(b.file));
  const adapters = inventory.modules.filter(item => item.readiness === "prepare-adapter").sort((a,b)=>a.riskScore-b.riskScore || a.file.localeCompare(b.file));
  const held = inventory.modules.filter(item => item.readiness === "hold" || item.readiness === "high-coupling").sort((a,b)=>b.riskScore-a.riskScore || a.file.localeCompare(b.file));
  const customEvents = inventory.events.filter(item => item.name.startsWith("salita:"));
  const sharedDomIds = new Map();
  for (const module of inventory.modules) for (const id of module.dom.ids) {
    if (!sharedDomIds.has(id)) sharedDomIds.set(id, []);
    sharedDomIds.get(id).push(module.file);
  }
  const sharedIds = [...sharedDomIds.entries()].filter(([,files])=>new Set(files).size>1).sort((a,b)=>b[1].length-a[1].length || a[0].localeCompare(b[0]));

  const lines = [
    "# Module Contract Inventory",
    "",
    "> Generated by `scripts/generate-module-contract-inventory.mjs`. Do not edit the tables manually.",
    "",
    "## Purpose",
    "",
    "This inventory defines the current compatibility surface before root-level feature files are moved into modules. It identifies the browser globals, shared engine symbols, storage operations, DOM hooks, custom events, and dynamic script-loading relationships that must remain stable during extraction.",
    "",
    "The analysis is intentionally conservative. It is based on static source inspection and therefore treats unresolved computed keys or selectors as migration risks rather than assuming that they are harmless.",
    "",
    "## Current scope",
    "",
    `- Runtime JavaScript files discovered: **${inventory.summary.modules}**`,
    `- Dependency edges recorded: **${inventory.summary.dependencyEdges}**`,
    `- Storage contracts recorded: **${inventory.summary.storageContracts}**`,
    `- Salita custom events recorded: **${inventory.summary.customEvents}**`,
    `- Immediate extraction candidates: **${inventory.summary.extractionCandidates}**`,
    `- High-coupling modules: **${inventory.summary.highCoupling}**`,
    `- Core or loader files held in place: **${inventory.summary.held}**`,
    `- Pinned source-document commit: \`${inventory.sourceDocumentCommit || "unresolved"}\``,
    "",
    "## Course entry chains",
    ""
  ];
  for (const [course, files] of Object.entries(inventory.courseSeeds)) {
    lines.push(`### ${course[0].toUpperCase()}${course.slice(1)}`, "", files.map(file=>`- \`${file}\``).join("\n"), "");
  }

  lines.push(
    "## Recommended extraction sequence",
    "",
    "### Phase A — low-coupling candidates",
    "",
    "Move these files first, one functional family at a time. Preserve their filenames through manifest aliases until all validators and installed-app upgrades pass.",
    "",
    candidates.length ? candidates.slice(0,30).map(item=>`- \`${item.file}\` — risk ${item.riskScore}; ${item.coreGlobals.length} shared engine symbols; ${item.storage.operations.length} storage operations.`).join("\n") : "- No low-coupling candidates were detected.",
    "",
    "### Phase B — add adapters before moving",
    "",
    adapters.length ? adapters.slice(0,30).map(item=>`- \`${item.file}\` — expose explicit inputs for ${item.coreGlobals.length} engine symbols and retain ${item.window.provides.length} browser API exports.`).join("\n") : "- No adapter-stage modules were detected.",
    "",
    "### Phase C — hold until the engine boundary is formalized",
    "",
    held.length ? held.slice(0,30).map(item=>`- \`${item.file}\` — ${item.readiness}; risk ${item.riskScore}; ${item.dynamicScripts.length} dynamic script loads.`).join("\n") : "- No held modules were detected.",
    "",
    "## Highest-coupling files",
    "",
    "| File | Role | Courses | Risk | Engine globals | Window APIs consumed/provided | Storage ops | DOM hooks | Dynamic loads |",
    "|---|---|---:|---:|---:|---:|---:|---:|---:|"
  );
  for (const item of modulesByRisk.slice(0,35)) {
    lines.push(`| \`${md(item.file)}\` | ${md(item.classification)} | ${item.courses.length} | ${item.riskScore} | ${item.coreGlobals.length} | ${item.window.consumes.length}/${item.window.provides.length} | ${item.storage.operations.length} | ${item.dom.ids.length + item.dom.selectors.length} | ${item.dynamicScripts.length} |`);
  }

  lines.push("", "## Storage compatibility contracts", "", "| Store and key | Readers | Writers | Removers |", "|---|---|---|---|");
  for (const item of inventory.storage.slice(0,80)) {
    lines.push(`| \`${md(item.store)}:${md(item.key)}\` | ${md(item.readers.join(", ") || "—")} | ${md(item.writers.join(", ") || "—")} | ${md(item.removers.join(", ") || "—")} |`);
  }

  lines.push("", "## Browser API ownership", "", "| Window symbol | Provider files |", "|---|---|");
  for (const item of inventory.windowApis.filter(item=>item.symbol.startsWith("Salita") || item.symbol.startsWith("__salita")).slice(0,80)) {
    lines.push(`| \`${md(item.symbol)}\` | ${md(item.providers.join(", "))} |`);
  }

  lines.push("", "## Custom event contracts", "", "| Event | Dispatchers | Listeners |", "|---|---|---|");
  for (const item of customEvents.slice(0,100)) {
    lines.push(`| \`${md(item.name)}\` | ${md(item.dispatchers.join(", ") || "—")} | ${md(item.listeners.join(", ") || "—")} |`);
  }

  lines.push("", "## Shared DOM IDs", "", "These IDs are referenced by more than one runtime file and should be treated as interface contracts during file relocation.", "", "| DOM ID | Files |", "|---|---|");
  for (const [id, files] of sharedIds.slice(0,80)) lines.push(`| \`${md(id)}\` | ${md(sorted(files).join(", "))} |`);

  lines.push(
    "",
    "## Migration rules derived from the inventory",
    "",
    "1. Do not rename a storage key, custom event, DOM ID, or exported `window` API during a physical file move.",
    "2. Replace direct access to `app.js` declarations with an explicit engine adapter before extracting any high-coupling file.",
    "3. Keep dynamic loaders and their targets in the same release until load order is represented as data rather than script-side injection.",
    "4. Move one functional family per pull request and run the complete Tagalog, Bisaya, avatar, economy, and offline validation suites.",
    "5. Retain root-level compatibility shims for at least one installed-app cache release after each move.",
    "",
    "The complete machine-readable inventory is stored in `src/config/module-contracts.generated.json`."
  );
  return `${lines.join("\n")}\n`;
}

function writeOrCheck(relative, content) {
  const absolute = path.join(ROOT, relative);
  if (CHECK) {
    if (!fs.existsSync(absolute) || fs.readFileSync(absolute, "utf8") !== content) {
      throw new Error(`${relative} is stale. Run node scripts/generate-module-contract-inventory.mjs --write`);
    }
    return;
  }
  if (WRITE) {
    fs.mkdirSync(path.dirname(absolute), {recursive:true});
    fs.writeFileSync(absolute, content);
  }
}

const inventory = buildInventory();
const json = `${JSON.stringify(inventory, null, 2)}\n`;
const markdown = renderMarkdown(inventory);
writeOrCheck(JSON_OUTPUT, json);
writeOrCheck(MARKDOWN_OUTPUT, markdown);
console.log(JSON.stringify(inventory.summary, null, 2));
