import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const readJson = relative => JSON.parse(read(relative));
const fail = message => {
  throw new Error(message);
};

for (const file of ["bisaya-app-loader.js", "profile-app.js", "service-worker.js"]) {
  new vm.Script(read(file), {filename:file});
}

const course = readJson("languages/cebuano/course.json");
const manifest = readJson("languages/cebuano/modules/manifest.json");
const packs = manifest.packs.map(name => readJson(`languages/cebuano/modules/${name}`));

if (course.courseId !== "cebuano") fail("courseId must be cebuano");
if (!Array.isArray(course.map) || course.map.length !== 13) fail("The Bisaya map must contain exactly 13 locations");

const mapIds = course.map.map(place => place.id);
if (new Set(mapIds).size !== mapIds.length) fail("Duplicate map IDs found");

const moduleIds = course.modules.map(module => module.id);
if (new Set(moduleIds).size !== moduleIds.length) fail("Duplicate module IDs found");
const moduleSet = new Set(moduleIds);

for (const pack of packs) {
  if (!moduleSet.has(pack.moduleId)) fail(`Unknown module pack: ${pack.moduleId}`);
  if (!Array.isArray(pack.items)) fail(`Module ${pack.moduleId} has no items array`);
}

const items = [...course.items, ...packs.flatMap(pack => pack.items)];
const itemIds = items.map(item => item.id);
if (new Set(itemIds).size !== itemIds.length) fail("Duplicate Cebuano item IDs found");

for (const item of items) {
  if (!item.id?.startsWith("ceb_")) fail(`Cebuano item ID must start with ceb_: ${item.id}`);
  if (!moduleSet.has(item.module)) fail(`Item ${item.id} references unknown module ${item.module}`);
  if (!item.meaning) fail(`Item ${item.id} has no English meaning`);
  if (!(item.term || item.root)) fail(`Item ${item.id} has no term or root`);
}

const exerciseGroups = [course.starterExercises || [], ...packs.map(pack => pack.starterExercises || [])];
for (const exercise of exerciseGroups.flat()) {
  if (exercise.type === "sentence-builder") {
    if (!Array.isArray(exercise.wordBank) || exercise.wordBank.length !== 6) {
      fail(`Sentence builder ${exercise.id} must contain exactly six word-bank tokens`);
    }
    if (!Array.isArray(exercise.answerTokens) || exercise.answerTokens.length < 1) {
      fail(`Sentence builder ${exercise.id} has no answer token sequence`);
    }
  }
  for (const itemId of exercise.itemIds || []) {
    if (!itemIds.includes(itemId)) fail(`Exercise ${exercise.id} references unknown item ${itemId}`);
  }
}

const engine = read("app.js");
for (const marker of [
  "const MODULES =",
  "const MODULE_META =",
  "const ITEMS =",
  "const DIALOGUES =",
  "const BOSS_ITEMS =",
  "const BADGES =",
  "async function handsFreeSpeak",
  "async function speakFilipino",
  "async function checkVoiceService"
]) {
  if (!engine.includes(marker)) fail(`Shared engine marker missing: ${marker}`);
}

const loader = read("bisaya-app-loader.js");
if (loader.includes('/api/speech')) fail("Bisaya loader must not call the Tagalog speech endpoint");
if (!loader.includes('"ceb-PH"')) fail("Bisaya loader must specify the Cebuano language tag");

console.log(`Validated ${course.map.length} locations, ${course.modules.length} modules, ${items.length} items, and ${exerciseGroups.flat().length} starter exercises.`);
