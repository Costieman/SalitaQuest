import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

const css = read("compact-home-dashboard.css");
for (const marker of [
  '@media (min-width: 1001px)',
  '#homeView.view.active',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  '@media (min-width: 1320px)',
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
  '#homeView > .game-dashboard',
  'display: contents',
  '#homeView > .hero-card .hero-actions',
  '#homeView > .hero-card .hero-visual',
  'display: none !important',
  '#homeView > .daily-quests-card',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  '@media (max-width: 1000px)',
  'display: block'
]) {
  if (!css.includes(marker)) fail(`Missing compact-home marker: ${marker}`);
}

for (const htmlFile of ["index.html", "app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1].trim())
    .filter(Boolean);
  scripts.forEach((source, index) => new vm.Script(source, {filename:`${htmlFile}#inline-${index + 1}`}));
}

for (const htmlFile of ["app.html", "bisaya.html"]) {
  if (!read(htmlFile).includes("compact-home-dashboard.css?v=5.4.12")) {
    fail(`${htmlFile} does not load compact-home-dashboard.css version 5.4.12`);
  }
}

const serviceWorker = read("service-worker.js");
if (!serviceWorker.includes('"./compact-home-dashboard.css"')) {
  fail("Offline cache is missing compact-home-dashboard.css");
}
if (!serviceWorker.includes('salita-quest-v5-4-compact-home-r25')) {
  fail("Service-worker cache name was not bumped for compact home release");
}

console.log("Validated compact hero, responsive three/two/one-column home dashboard, compact activity tiles, summary-card grid, mobile restoration, loaders, and offline cache.");
