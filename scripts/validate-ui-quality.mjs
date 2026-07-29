import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

for (const file of ["ui-quality-fixes.js", "service-worker.js"]) {
  new vm.Script(read(file), {filename:file});
}

for (const htmlFile of ["index.html", "app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1].trim())
    .filter(Boolean);
  scripts.forEach((source, index) => new vm.Script(source, {filename:`${htmlFile}#inline-${index + 1}`}));
}

const runtime = read("ui-quality-fixes.js");
for (const marker of [
  'id: "quick_twice"',
  "quickReviews",
  "showAnswerPopWithLightFlash",
  "renderFeedbackWithWordBreakdown",
  "correct-word-breakdown",
  "Direct translation"
]) {
  if (!runtime.includes(marker)) fail(`Missing shared UI runtime marker: ${marker}`);
}

const qualityCss = read("ui-quality-fixes.css");
for (const marker of [
  "body.dark-mode .structure-box",
  "body.dark-mode .gloss-pair",
  ".choice-btn.selected",
  ".lesson-card.correct-pulse::after",
  ".answer-correct-flash"
]) {
  if (!qualityCss.includes(marker)) fail(`Missing contrast or feedback style: ${marker}`);
}

const breakdownCss = read("ui-answer-breakdown.css");
for (const marker of [
  ".correct-word-breakdown",
  ".correct-word-grid",
  ".correct-word-pair",
  "prefers-reduced-motion"
]) {
  if (!breakdownCss.includes(marker)) fail(`Missing word-breakdown style: ${marker}`);
}

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  for (const asset of ["ui-quality-fixes.js", "ui-quality-fixes.css", "ui-answer-breakdown.css"]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
}

const serviceWorker = read("service-worker.js");
for (const asset of ["./ui-quality-fixes.js", "./ui-quality-fixes.css", "./ui-answer-breakdown.css"]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}

console.log("Validated dark-mode contrast, vivid answer selection, correct-answer flash, two Quick Review daily quest, and word-by-word feedback assets.");
