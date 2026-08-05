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
const CODE_EXTENSIONS = new Set([".js", ".css"]);
const SKIP_PREFIXES = [".git/", ".github/", "audit/", "scripts/", "services/"];

const posix = value => value.split(path.sep).join("/");
const absolute = relative => path.join(ROOT, relative);
const read = relative => fs.readFileSync(absolute(relative), "utf8");

function walk(directory = ROOT) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target));
    else files.push(posix(path.relative(ROOT, target)));
  }
  return files;
}

function cleanReference(value) {
  return String(value || "").trim().split("#", 1)[0].split("?", 1)[0];
}

function isRemote(value) {
  return /^(?:[a-z]+:)?\/\//i.test(value)
    || /^(?:data|blob|mailto|tel|javascript):/i.test(value);
}

function looksLikeAsset(value) {
  return ASSET_EXTENSIONS.has(path.posix.extname(cleanReference(value)).toLowerCase());
}

function extractReferences(source) {
  const references = new Set();
  const literal = /["'`]([^"'`\n\r]+?\.(?:js|css|html|json|webmanifest|png|jpe?g|webp|svg|mp3|m4a|ogg|wav)(?:\?[^"'`\s<>]*)?)["'`]/gi;
  const attribute = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  const cssUrl = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const pattern of [literal, attribute, cssUrl]) {
    for (const match of source.matchAll(pattern)) references.add(match[1]);
  }
  return [...references];
}

const allFiles = walk();
const allFileSet = new Set(allFiles);

function referenceCandidates(fromFile, rawValue) {
  const value = String(rawValue || "").trim();
  if (!value || isRemote(value) || value.includes("${") || !looksLikeAsset(value)) return [];
  const clean = cleanReference(value).replace(/^\.\//, "");
  const rootRelative = clean.replace(/^\/+/, "");
  const sourceRelative = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), rootRelative));
  const candidates = value.startsWith("/")
    ? [rootRelative]
    : [sourceRelative, rootRelative];
  return [...new Set(candidates)].filter(candidate => !candidate.startsWith("../"));
}

function resolveReference(fromFile, rawValue) {
  const candidates = referenceCandidates(fromFile, rawValue);
  return candidates.find(candidate => allFileSet.has(candidate)) || null;
}

function unresolvedGuess(fromFile, rawValue) {
  return referenceCandidates(fromFile, rawValue)[0] || null;
}

function isScannable(file) {
  return [".js", ".css", ".html", ".json", ".webmanifest"]
    .includes(path.posix.extname(file).toLowerCase());
}

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

for (const file of [...ENTRY_POINTS, ...COURSE_SHELL_ASSETS]) {
  addReachable(file, ENTRY_POINTS.includes(file) ? "entry point" : "course shell dependency");
}
addReachable("service-worker.js", "registered by index.html");

while (queue.length) {
  const file = queue.shift();
  if (!isScannable(file) || file === "service-worker.js") continue;
  for (const rawReference of extractReferences(read(file))) {
    const target = resolveReference(file, rawReference);
    if (target) {
      addReachable(target, `${file} -> ${rawReference}`);
    } else {
      const guess = unresolvedGuess(file, rawReference);
      if (guess) missing.set(`${file} -> ${rawReference}`, guess);
    }
  }
}

const codeCandidates = allFiles.filter(file =>
  CODE_EXTENSIONS.has(path.posix.extname(file).toLowerCase())
  && !SKIP_PREFIXES.some(prefix => file.startsWith(prefix))
);
const unreachableCode = codeCandidates.filter(file => !reachable.has(file)).sort();

const workerReferences = new Set(
  allFileSet.has("service-worker.js")
    ? extractReferences(read("service-worker.js"))
        .map(value => resolveReference("service-worker.js", value))
        .filter(Boolean)
    : []
);
const precacheOnly = [...workerReferences]
  .filter(file => !reachable.has(file))
  .sort();
const reachableMissingFromPrecache = [...reachable]
  .filter(file => {
    const extension = path.posix.extname(file).toLowerCase();
    return [".js", ".css", ".html", ".json", ".webmanifest"].includes(extension)
      && file !== "service-worker.js"
      && !workerReferences.has(file);
  })
  .sort();

const versionedName = /(?:^|[-_])(?:v\d+(?:[-_.]?\d+)*|phase\d+(?:[-_]\d+)*(?:[-_]v\d+)?)(?=\.(?:js|css)$)/i;
const versionedReachable = [...reachable]
  .filter(file => versionedName.test(path.posix.basename(file)))
  .sort();
const smallRootWrappers = unreachableCode.filter(file => {
  if (file.includes("/") || fs.statSync(absolute(file)).size > 3500) return false;
  const stableStem = path.posix.basename(file)
    .replace(/(?:-v\d+(?:[-_.]?\d+)*|-phase\d+(?:[-_]\d+)*(?:-v\d+)?)?(?=\.(?:js|css)$)/i, "");
  return codeCandidates.some(candidate =>
    candidate.includes("/") && path.posix.basename(candidate).startsWith(stableStem)
  );
});

const directEntryDependencies = Object.fromEntries(ENTRY_POINTS.map(entry => [
  entry,
  extractReferences(read(entry)).map(value => resolveReference(entry, value)).filter(Boolean)
]));

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
  directEntryDependencies,
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

const section = (title, values) => [
  `## ${title}`, "", ...(values.length ? values.map(value => `- \`${value}\``) : ["None."]), ""
];
const markdown = [
  "# Runtime asset audit", "", `Generated: ${report.generatedAt}`, "",
  "## Counts", "", ...Object.entries(report.counts).map(([key, value]) => `- **${key}:** ${value}`), "",
  "## Direct entry-point dependencies", "",
  ...Object.entries(directEntryDependencies).flatMap(([entry, files]) => [
    `### ${entry}`, ...files.map(file => `- \`${file}\``), ""
  ]),
  ...section("Reachable files with versioned names", versionedReachable),
  ...section("Unreachable browser JS/CSS", unreachableCode),
  ...section("Likely forwarding wrappers", smallRootWrappers),
  ...section("Service-worker precache entries with no runtime path", precacheOnly),
  "## Missing local references", "",
  ...(report.missingReferences.length
    ? report.missingReferences.map(item => `- \`${item.source}\` resolves to missing \`${item.target}\``)
    : ["None."]), ""
].join("\n");

fs.writeFileSync(path.join(REPORT_DIR, "runtime-assets.md"), markdown);
console.log(markdown);
if (process.argv.includes("--strict") && missing.size) process.exitCode = 1;
