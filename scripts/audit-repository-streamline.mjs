import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const outputDir = path.join(root, "artifacts");
const ignoredDirectories = new Set([
  ".git", "node_modules", ".venv", "venv", "dist", "build", ".cache", "coverage", "artifacts"
]);
const textExtensions = new Set([
  ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".css", ".json",
  ".md", ".yml", ".yaml", ".txt", ".py", ".sh", ".toml", ".xml", ".webmanifest"
]);
const mediaExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico", ".avif",
  ".mp3", ".wav", ".ogg", ".m4a", ".mp4", ".webm", ".woff", ".woff2", ".ttf"
]);
const executableExtensions = new Set([".js", ".mjs", ".cjs", ".css"]);
const protectedRuntimeFiles = new Set([
  "index.html", "app.html", "bisaya.html", "service-worker.js", "manifest.webmanifest",
  "package.json", "package-lock.json", "README.md"
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function safeReadText(file) {
  try {
    const value = fs.readFileSync(file, "utf8");
    if (value.includes("\u0000")) return null;
    return value;
  } catch {
    return null;
  }
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let cursor = 0;
  while ((cursor = haystack.indexOf(needle, cursor)) >= 0) {
    count += 1;
    cursor += Math.max(1, needle.length);
  }
  return count;
}

function normalizedVersionStem(relativePath) {
  const extension = path.extname(relativePath);
  const withoutExtension = relativePath.slice(0, -extension.length);
  return withoutExtension
    .replace(/(?:[-_.](?:v|r)\d+(?:[-_.]\d+)*)$/i, "")
    .replace(/(?:[-_.](?:old|legacy|backup|copy|temp|tmp|deprecated|unused))$/i, "");
}

const absoluteFiles = walk(root);
const records = absoluteFiles.map(absolute => {
  const relative = toPosix(path.relative(root, absolute));
  const extension = path.extname(relative).toLowerCase();
  const buffer = fs.readFileSync(absolute);
  const text = textExtensions.has(extension) ? safeReadText(absolute) : null;
  return {
    absolute,
    path: relative,
    basename: path.basename(relative),
    extension,
    size: buffer.length,
    sha256: sha256(buffer),
    text
  };
});

const textRecords = records.filter(record => record.text !== null);
const allText = textRecords.map(record => `\n/* FILE:${record.path} */\n${record.text}`).join("\n");

for (const record of records) {
  const otherText = record.text === null
    ? allText
    : allText.replace(`\n/* FILE:${record.path} */\n${record.text}`, "");
  const pathForms = new Set([
    record.path,
    `./${record.path}`,
    `/${record.path}`,
    record.basename
  ]);
  let references = 0;
  for (const form of pathForms) references += countOccurrences(otherText, form);
  record.referenceCount = references;
}

const duplicateGroups = [];
const byHash = new Map();
for (const record of records) {
  const key = `${record.sha256}:${record.size}`;
  const group = byHash.get(key) || [];
  group.push(record.path);
  byHash.set(key, group);
}
for (const [key, files] of byHash) {
  if (files.length < 2) continue;
  duplicateGroups.push({
    sha256: key.split(":")[0],
    size: Number(key.split(":")[1]),
    files: files.sort()
  });
}
duplicateGroups.sort((a, b) => (b.size * b.files.length) - (a.size * a.files.length));

const unreferencedMedia = records
  .filter(record => mediaExtensions.has(record.extension) && record.referenceCount === 0)
  .filter(record => !record.path.startsWith("avatars/canonical/"))
  .map(record => ({path: record.path, size: record.size, sha256: record.sha256}));

const unreferencedCode = records
  .filter(record => executableExtensions.has(record.extension) && record.referenceCount === 0)
  .filter(record => !protectedRuntimeFiles.has(record.path))
  .filter(record => !record.path.startsWith("scripts/"))
  .filter(record => !record.path.startsWith(".github/"))
  .map(record => ({path: record.path, size: record.size, sha256: record.sha256}));

const suspiciousNames = records
  .filter(record => /(?:^|[-_.\/])(old|legacy|backup|copy|temp|tmp|deprecated|unused|sprite)(?:[-_.\/]|$)/i.test(record.path))
  .map(record => ({path: record.path, size: record.size, referenceCount: record.referenceCount}));

const versionGroupsMap = new Map();
for (const record of records.filter(item => executableExtensions.has(item.extension))) {
  const stem = normalizedVersionStem(record.path);
  const group = versionGroupsMap.get(stem) || [];
  group.push({path: record.path, size: record.size, referenceCount: record.referenceCount});
  versionGroupsMap.set(stem, group);
}
const versionGroups = [...versionGroupsMap.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([stem, files]) => ({stem, files: files.sort((a, b) => a.path.localeCompare(b.path))}));

const largestFiles = [...records]
  .sort((a, b) => b.size - a.size)
  .slice(0, 100)
  .map(record => ({path: record.path, size: record.size, extension: record.extension, referenceCount: record.referenceCount}));

const extensionTotals = {};
for (const record of records) {
  const key = record.extension || "[no extension]";
  extensionTotals[key] ||= {files: 0, bytes: 0};
  extensionTotals[key].files += 1;
  extensionTotals[key].bytes += record.size;
}

const report = {
  generatedAt: new Date().toISOString(),
  branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || "local",
  commit: process.env.GITHUB_SHA || "local",
  summary: {
    files: records.length,
    bytes: records.reduce((sum, record) => sum + record.size, 0),
    textFiles: textRecords.length,
    mediaFiles: records.filter(record => mediaExtensions.has(record.extension)).length,
    exactDuplicateGroups: duplicateGroups.length,
    unreferencedMediaCandidates: unreferencedMedia.length,
    unreferencedCodeCandidates: unreferencedCode.length,
    suspiciousNameCandidates: suspiciousNames.length,
    versionedModuleGroups: versionGroups.length
  },
  extensionTotals,
  exactDuplicateGroups: duplicateGroups,
  unreferencedMediaCandidates: unreferencedMedia,
  unreferencedCodeCandidates: unreferencedCode,
  suspiciousNameCandidates: suspiciousNames,
  versionedModuleGroups: versionGroups,
  largestFiles
};

fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(path.join(outputDir, "repository-streamline-audit.json"), `${JSON.stringify(report, null, 2)}\n`);

const markdown = [
  "# Repository streamlining audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  "## Summary",
  "",
  `- Files: ${report.summary.files}`,
  `- Repository bytes scanned: ${report.summary.bytes}`,
  `- Media files: ${report.summary.mediaFiles}`,
  `- Exact duplicate groups: ${report.summary.exactDuplicateGroups}`,
  `- Unreferenced media candidates: ${report.summary.unreferencedMediaCandidates}`,
  `- Unreferenced code candidates: ${report.summary.unreferencedCodeCandidates}`,
  `- Suspicious legacy/temp names: ${report.summary.suspiciousNameCandidates}`,
  `- Versioned module groups: ${report.summary.versionedModuleGroups}`,
  "",
  "## Exact duplicate groups",
  "",
  ...duplicateGroups.slice(0, 100).flatMap(group => [
    `### ${group.sha256.slice(0, 12)} — ${group.size} bytes each`,
    ...group.files.map(file => `- ${file}`),
    ""
  ]),
  "## Unreferenced media candidates",
  "",
  ...unreferencedMedia.map(item => `- ${item.path} (${item.size} bytes)`),
  "",
  "## Unreferenced code candidates",
  "",
  ...unreferencedCode.map(item => `- ${item.path} (${item.size} bytes)`),
  "",
  "## Suspicious legacy/temp names",
  "",
  ...suspiciousNames.map(item => `- ${item.path} (${item.size} bytes; references: ${item.referenceCount})`),
  "",
  "## Versioned module groups",
  "",
  ...versionGroups.flatMap(group => [
    `### ${group.stem}`,
    ...group.files.map(file => `- ${file.path} (${file.size} bytes; references: ${file.referenceCount})`),
    ""
  ])
].join("\n");
fs.writeFileSync(path.join(outputDir, "repository-streamline-audit.md"), `${markdown}\n`);

console.log(JSON.stringify(report.summary, null, 2));
console.log("\nTop unreferenced media candidates:");
unreferencedMedia.slice(0, 80).forEach(item => console.log(`- ${item.path} (${item.size} bytes)`));
console.log("\nTop unreferenced code candidates:");
unreferencedCode.slice(0, 80).forEach(item => console.log(`- ${item.path} (${item.size} bytes)`));
console.log("\nTop exact duplicate groups:");
duplicateGroups.slice(0, 40).forEach(group => console.log(`- ${group.size} bytes: ${group.files.join(" | ")}`));
