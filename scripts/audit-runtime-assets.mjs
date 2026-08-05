import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENTRY_POINTS = ["index.html", "app.html", "bisaya.html"];
const COURSE_SHELL_ASSETS = ["app.js", "style.css"];
const REPORT_DIR = path.join(ROOT, "audit");
const ASSET_EXTENSIONS = new Set([
  ".js", ".css", ".html", ".json", ".webmanifest", ".png", ".jpg", ".jpeg",
  ".webp", ".svg", ".mp3", ".m4a", ".ogg", ".wav"
]);
const AUDITED_CODE_EXTENSIONS = new Set([".js", ".css"]);
const SKIP_PREFIXES = [".git/", ".github/", "audit/", "scripts/", "services/"];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function walk(directory = ROOT) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else files.push(toPosix(path.relative(ROOT, absolute)));
  }
  return files;
}

function stripQuery(value) {
  return value.split("#", 1)[0].split("?", 1)[0];
}

function isRemote(value) {
  return /^(?:[a-z]+:)?\/\//i.test(value)
    || /^(?:data|blob|mailto|tel|javascript):/i.test(value);
}

function looksLikeAsset(value) {
  const clean = stripQuery(value.trim());
  return ASSET_EXTENSIONS.has(path.posix.extname(clean).toLowerCase());
}

function resolveReference(fromFile, rawValue) {
  const value = rawValue.trim();
  if (!value || isRemote(value) || value.includes("${")) return null;
  const clean = stripQuery(value).replace(/^\.\//, "");
  if (!looksLikeAsset(clean)) return null;
  const resolved = value.startsWith("/")
    ? clean.replace(/^\/+/, "")
    : path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), clean));
  if (resolved.startsWith("../")) return null;
  return resolved;
}

function extractAssetReferences(source) {
  const values = new Set();
  const literalPattern = /["'`]([^"'`\n\r]+?\.(?:js|css|html|json|webmanifest|png|jpe?g|webp|svg|mp3|m4a|ogg|wav)(?:\?[^"'`\s<>]*)?)["'`]/gi;
  for (const match of source.matchAll(literalPattern)) values.add(match[1]);

  const htmlAttributePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  for (const match of source.matchAll(htmlAttributePattern)) values.add(match[1]);

  const cssUrlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of source.matchAll(cssUrlPattern)) values.add(match[1]);
  return [...values];
}

function isScannable(file) {
  const extension = path.posix.extname(file).toLowerCase();
  return [".js", ".css", ".html", ".json", ".webmanifest"].includes(extension);
}

const allFiles = walk();
const allFileSet = new Set(allFiles);
const reachable = new Set();
const reasons = new Map();
const missing = new Map();
const queue = [];

function addReachable(file, reason) {
  if (!allFileSet.has(file) || reachable.has(file)) return;
  reachable.add(file);
  reasons.set(file, reason);
  queue.push(file);
}

for (const entry of [...ENTRY_POINTS, ...COURSE_SHELL_ASSETS]) {
  if (exists(entry)) addReachable(entry, ENTRY_POINTS.includes(entry) ? "entry point" : "course shell dependency");
}

while (queue.length) {
  const file = queue.shift();
  if (!isScannable(file)) continue;

  // The service worker's precache list is audited separately. It is not allowed to
  // make dead application files look reachable merely because they were once cached.
  if (file === "service-worker.js") continue;

  const source = read(file);
  for (const rawReference of extractAssetReferences(source)) {
    const target = resolveReference(file, rawReference);
    if (!target) continue;
    if (allFileSet.has(target)) {
      addReachable(target, `${file} -> ${rawReference}`);
    } else {
      const key = `${file} -> ${rawReference}`;
      missing.set(key, target);
    }
  }
}

// Registration is inline in index.html and can be easy to miss when changing the
// scanner. Keep this explicit so the worker itself remains part of the runtime graph.
if (exists("service-worker.js")) addReachable("service-worker.js", "registered by index.html");

const codeCandidates = allFiles.filter(file => {
  const extension = path.posix.extname(file).toLowerCase();
  return AUDITED_CODE_EXTENSIONS.has(extension)
    && !SKIP_PREFIXES.some(prefix => file.startsWith(prefix));
});
const unreachableCode = codeCandidates.filter(file => !reachable.has(file)).sort();

const workerSource = exists("service-worker.js") ? read("service-worker.js") : "";
const workerReferences = new Set(
  extractAssetReferences(workerSource)
    .map(value => resolveReference("service-worker.js", value))
    .filter(Boolean)
);
const precacheOnly = [...workerReferences]
  .filter(file => allFileSet.has(file) && !reachable.has(file))
  .sort();
const reachableMissingFromPrecache = [...reachable]
  .filter(file => {
    const extension = path.posix.extname(file).toLowerCase();
    return [".js", ".css", ".html", ".json", ".webmanifest"].includes(extension)
      && file !== "service-worker.js"
      && !workerReferences.has(file);
  })
  .sort();

const versionPattern = /(?:^|[-_])v\d+(?:[-_.]?\d+)*(?=\.(?:js|css)$)/i;
const phaseVersionPattern = /(?:^|[-_])phase\d+(?:[-_]\d+)*(?:[-_]v\d+)?(?=\.(?:js|css)$)/i;
const versionedReachable = [...reachable]
  .filter(file => versionPattern.test(path.posix.basename(file)) || phaseVersionPattern.test(path.posix.basename(file)))
  .sort();

const smallRootWrappers = unreachableCode.filter(file => {
  if (file.includes("/")) return false;
  const size = fs.statSync(path.join(ROOT, file)).size;
  const basename = path.posix.basename(file).replace(/(?:-v\d+(?:[-_.]?\d+)*|-phase\d+(?:[-_]\d+)*(?:-v\d+)?)?(?=\.(?:js|css)$)/i, "");
  return size <= 3500 && codeCandidates.some(candidate => candidate.includes("/") && path.posix.basename(candidate).startsWith(basename));
});

const report = {
  generatedAt: new Date().toISOString(),
  entryPoints: ENTRY_POINTS,
  courseShellAssets: COURSE_SHELL_ASSETS,
  counts: {
    repositoryFiles: allFiles.length,
    reachableFiles: reachable.size,
    auditedCodeFiles: codeCandidates.length,
    unreachableCodeFiles: unreachableCode.length,
    versionedReachableFiles: versionedReachable.length,
    precacheOnlyFiles: precacheOnly.length,
    missingReferences: missing.size
  },
  directEntryDependencies: Object.fromEntries(ENTRY_POINTS.map(entry => [
    entry,
    extractAssetReferences(read(entry))
      .map(value => resolveReference(entry, value))
      .filter(Boolean)
  ])),
  reachable: [...reachable].sort().map(file => ({file, reason: reasons.get(file)})),
  unreachableCode,
  smallRootWrappers,
  versionedReachable,
  precacheOnly,
  reachableMissingFromPrecache,
  missingReferences: [...missing].map(([source, target]) => ({source, target}))
};

fs.mkdirSync(REPORT_DIR, {recursive: true});
fs.writeFileSync(path.join(REPORT_DIR, "runtime-assets.json"), `${JSON.stringify(report, null, 2)}\n`);

const markdown = [
  "# Runtime asset audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  "## Counts",
  "",
  ...Object.entries(report.counts).map(([key, value]) => `- **${key}:** ${value}`),
  "",
  "## Direct entry-point dependencies",
  "",
  ...Object.entries(report.directEntryDependencies).flatMap(([entry, files]) => [
    `### ${entry}`,
    ...files.map(file => `- \`${file}\``),
    ""
  ]),
  "## Reachable files with versioned names",
  "",
  ...(versionedReachable.length ? versionedReachable.map(file => `- \`${file}\``) : ["None."]),
  "",
  "## Unreachable browser JS/CSS",
  "",
  ...(unreachableCode.length ? unreachableCode.map(file => `- \`${file}\``) : ["None."]),
  "",
  "## Likely forwarding wrappers",
  "",
  ...(smallRootWrappers.length ? smallRootWrappers.map(file => `- \`${file}\``) : ["None."]),
  "",
  "## Service-worker precache entries with no runtime path",
  "",
  ...(precacheOnly.length ? precacheOnly.map(file => `- \`${file}\``) : ["None."]),
  "",
  "## Missing local references",
  "",
  ...(report.missingReferences.length
    ? report.missingReferences.map(item => `- \`${item.source}\` resolves to missing \`${item.target}\``)
    : ["None."]),
  ""
].join("\n");

fs.writeFileSync(path.join(REPORT_DIR, "runtime-assets.md"), markdown);
console.log(markdown);

if (process.argv.includes("--strict") && missing.size) process.exitCode = 1;
