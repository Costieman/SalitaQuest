import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "artifacts");
const ignored = new Set([".git", "node_modules", ".venv", "venv", "dist", "build", ".cache", "coverage", "artifacts"]);
const textExtensions = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".css", ".json", ".md", ".yml", ".yaml", ".txt", ".py", ".sh", ".toml", ".xml", ".webmanifest"]);
const needles = process.argv.slice(2).length ? process.argv.slice(2) : ["rare-animals-set2-sprite.png"];

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.isFile() && textExtensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
  }
  return files;
}

const results = {};
for (const needle of needles) results[needle] = [];
for (const absolute of walk(root)) {
  const relative = path.relative(root, absolute).split(path.sep).join("/");
  const lines = fs.readFileSync(absolute, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const needle of needles) {
      if (!line.includes(needle)) continue;
      results[needle].push({file: relative, line: index + 1, text: line.trim()});
    }
  });
}

fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(path.join(outputDir, "repository-reference-sources.json"), `${JSON.stringify(results, null, 2)}\n`);
for (const [needle, matches] of Object.entries(results)) {
  console.log(`\n${needle}: ${matches.length} matching lines`);
  matches.forEach(match => console.log(`- ${match.file}:${match.line} ${match.text}`));
}
