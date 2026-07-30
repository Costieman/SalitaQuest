import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const spriteFiles = [
  "avatar-sprite-data-01.js",
  "avatar-sprite-data-02-03.js",
  "avatar-sprite-data-04-05.js",
  "avatar-sprite-data-06-07.js",
  "avatar-sprite-data-08-09.js",
  "avatar-sprite-data-10-11.js",
  "avatar-sprite-data-12-13.js"
];
const runtimeFiles = [1,2,3,4,5].map(index => `avatar-collection-data-${String(index).padStart(2,"0")}.js`);

const sandbox = {window:{}};
vm.createContext(sandbox);
for (const file of spriteFiles) vm.runInContext(read(file), sandbox);
vm.runInContext(read("avatar-assets-v1.js"), sandbox);
const catalogue = sandbox.window.SalitaAvatarCatalogue;
if (!Array.isArray(catalogue)) fail("Avatar catalogue was not created");
if (catalogue.length !== 48) fail(`Expected 48 avatars, found ${catalogue.length}`);
if (new Set(catalogue.map(item => item.id)).size !== catalogue.length) fail("Avatar IDs must be unique");
if (catalogue.filter(item => item.rarity === "starter").length !== 4) fail("Exactly four starter avatars are required");
if (catalogue.filter(item => item.rarity === "rare").some(item => item.category !== "animal")) fail("Rare avatars must be animals");
for (const level of [10,20,30,40,50,60,70,80,90,99]) {
  if (!catalogue.some(item => item.levelReward === level)) fail(`Missing level ${level} avatar reward`);
}
if (catalogue.find(item => item.levelReward === 99)?.id !== "golden_salita_crest") fail("Level 99 must award the Golden Salita Crest");

const spriteChunks = sandbox.window.__SalitaAvatarSpriteChunks;
if (!Array.isArray(spriteChunks) || spriteChunks.length !== 13 || spriteChunks.some(chunk => !chunk)) fail("Avatar sprite chunks are incomplete");
const sprite = Buffer.from(spriteChunks.join(""), "base64");
if (sprite.length < 70000 || sprite.subarray(0,4).toString("ascii") !== "RIFF" || sprite.subarray(8,12).toString("ascii") !== "WEBP") fail("Avatar sprite is not a valid WebP payload");
const assembler = read("avatar-sprite-assembler-v1.js");
if (!assembler.includes("128") || !assembler.includes("__SalitaAvatarAssetRecords")) fail("Avatar sprite assembler is incomplete");

const runtimeSandbox = {window:{}};
vm.createContext(runtimeSandbox);
for (const file of runtimeFiles) vm.runInContext(read(file), runtimeSandbox);
const runtimeChunks = runtimeSandbox.window.__SalitaAvatarRuntimeChunks;
if (!Array.isArray(runtimeChunks) || runtimeChunks.length !== 5 || runtimeChunks.some(chunk => !chunk)) fail("Avatar runtime chunks are incomplete");
const runtime = Buffer.from(runtimeChunks.join(""), "base64").toString("utf8");
new vm.Script(runtime, {filename:"avatar-collection.decoded.js"});
for (const requirement of [
  "WEEKLY_SHARDS = {common:100,uncommon:50,rare:25}",
  "levelRewardsClaimed",
  "pendingUnlocks",
  "data-avatar-reward-choice",
  "--avatar-fill",
  "needsStarterChoice"
]) {
  if (!runtime.includes(requirement)) fail(`Avatar runtime is missing ${requirement}`);
}

for (const file of ["app.html","bisaya.html"]) {
  const html = read(file);
  for (const required of [...spriteFiles,"avatar-sprite-assembler-v1.js","avatar-assets-v1.js","avatar-image-shim-v1.js",...runtimeFiles,"avatar-collection-v1.js","avatar-collection-v1.css"]) {
    if (!html.includes(required)) fail(`${file} does not load ${required}`);
  }
}
const profileShell = read("index.html");
if (!profileShell.includes('item.rarity==="starter"')) fail("Profile creation must be restricted to starter avatars");
if (!profileShell.includes("avatarCollection")) fail("New profiles must initialise avatar collection data");
const serviceWorker = read("service-worker.js");
for (const required of [...spriteFiles,"avatar-sprite-assembler-v1.js","avatar-assets-v1.js","avatar-image-shim-v1.js",...runtimeFiles,"avatar-collection-v1.js","avatar-collection-v1.css"]) {
  if (!serviceWorker.includes(required)) fail(`Service worker does not cache ${required}`);
}
if (!serviceWorker.includes("salita-quest-v5-5-avatar-collection-r43")) fail("Service worker cache version was not advanced");

console.log("Avatar collection validation passed: 48 avatars, four starters, milestone rewards, user-selected weekly shards and offline artwork.");
