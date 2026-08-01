import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "artifacts");
const ignored = new Set([".git", "node_modules", ".venv", "venv", "dist", "build", ".cache", "coverage", "artifacts"]);
const textExtensions = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".css", ".json", ".md", ".yml", ".yaml", ".txt", ".py", ".sh", ".toml", ".xml", ".webmanifest", ".csv"]);
const maintenanceExtensions = new Set([".mjs", ".py", ".sh"]);
const documentationExtensions = new Set([".md", ".json", ".csv", ".html"]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function occurrences(text, needle) {
  if (!needle) return 0;
  let count = 0;
  let cursor = 0;
  while ((cursor = text.indexOf(needle, cursor)) >= 0) {
    count += 1;
    cursor += Math.max(needle.length, 1);
  }
  return count;
}

const files = walk(root).map(absolute => {
  const relative = toPosix(path.relative(root, absolute));
  const extension = path.extname(relative).toLowerCase();
  let text = null;
  if (textExtensions.has(extension)) {
    try {
      const value = fs.readFileSync(absolute, "utf8");
      if (!value.includes("\u0000")) text = value;
    } catch {}
  }
  return {absolute, path:relative, basename:path.basename(relative), extension, size:fs.statSync(absolute).size, text};
});

const textFiles = files.filter(file => file.text !== null);
function referencingFiles(target) {
  const forms = [target.path, `./${target.path}`, `/${target.path}`, target.basename];
  return textFiles
    .filter(file => file.path !== target.path)
    .map(file => ({
      file:file.path,
      count:forms.reduce((sum, form) => sum + occurrences(file.text, form), 0)
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
}

const maintenance = files
  .filter(file => file.path.startsWith("scripts/") && maintenanceExtensions.has(file.extension))
  .filter(file => !file.path.startsWith("scripts/audit-"))
  .map(file => ({...file, referencedBy:referencingFiles(file)}));

const unreferencedMaintenance = maintenance
  .filter(file => file.referencedBy.length === 0)
  .map(file => ({path:file.path, size:file.size}));

const lightlyReferencedMaintenance = maintenance
  .filter(file => file.referencedBy.length > 0 && file.referencedBy.length <= 2)
  .map(file => ({path:file.path, size:file.size, referencedBy:file.referencedBy}));

const documentation = files
  .filter(file => file.path.startsWith("docs/") && documentationExtensions.has(file.extension))
  .map(file => ({...file, referencedBy:referencingFiles(file)}));

const unreferencedGeneratedDocs = documentation
  .filter(file => file.referencedBy.length === 0)
  .filter(file => /(?:report|inventory|contact-sheet|checklist|baseline|audit|validation)/i.test(file.path))
  .map(file => ({path:file.path, size:file.size}));

const rootVersionedFiles = files
  .filter(file => !file.path.includes("/") && [".js", ".css"].includes(file.extension))
  .filter(file => /(?:[-_.]v\d|[-_.]r\d)/i.test(file.path))
  .map(file => ({path:file.path, size:file.size, referencedBy:referencingFiles(file)}));

const report = {
  generatedAt:new Date().toISOString(),
  summary:{
    maintenanceScripts:maintenance.length,
    unreferencedMaintenanceScripts:unreferencedMaintenance.length,
    lightlyReferencedMaintenanceScripts:lightlyReferencedMaintenance.length,
    unreferencedGeneratedDocs:unreferencedGeneratedDocs.length,
    rootVersionedRuntimeFiles:rootVersionedFiles.length
  },
  unreferencedMaintenanceScripts:unreferencedMaintenance,
  lightlyReferencedMaintenanceScripts:lightlyReferencedMaintenance,
  unreferencedGeneratedDocs,
  rootVersionedRuntimeFiles:rootVersionedFiles
};

fs.mkdirSync(outputDir, {recursive:true});
fs.writeFileSync(path.join(outputDir, "repository-maintenance-audit.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report.summary, null, 2));
console.log("\nUnreferenced maintenance scripts:");
unreferencedMaintenance.forEach(item => console.log(`- ${item.path} (${item.size} bytes)`));
console.log("\nLightly referenced maintenance scripts:");
lightlyReferencedMaintenance.forEach(item => console.log(`- ${item.path} -> ${item.referencedBy.map(ref => ref.file).join(", ")}`));
console.log("\nUnreferenced generated documentation:");
unreferencedGeneratedDocs.forEach(item => console.log(`- ${item.path} (${item.size} bytes)`));
