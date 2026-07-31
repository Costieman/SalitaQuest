import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fail = message => { throw new Error(message); };
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const validators = [
  "scripts/validate-avatar-catalogue.mjs",
  "scripts/validate-avatar-onboarding.mjs",
  "scripts/validate-avatar-collection-screen.mjs",
  "scripts/validate-weekly-avatar-shards.mjs",
  "scripts/validate-level-avatar-rewards.mjs",
  "scripts/validate-avatar-unlock-sharing.mjs",
  "scripts/validate-avatar-release-v550.mjs",
  "scripts/validate-avatar-hotfix-v551.mjs",
  "scripts/validate-mobile-level-up-hotfix-v552.mjs"
];

for (const validator of validators) {
  const absolute = path.join(root, validator);
  if (!fs.existsSync(absolute)) fail(`Missing validator: ${validator}`);
  const run = spawnSync(process.execPath, [absolute], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe"
  });
  process.stdout.write(run.stdout || "");
  process.stderr.write(run.stderr || "");
  if (run.status !== 0) fail(`${validator} failed with exit code ${run.status}`);
}

const runtimeFiles = [
  "avatar-catalogue-v1.js",
  "avatar-progression-hotfix-v551.js",
  "profile-app.js",
  "profile-emblem-control.js",
  "avatar-collection-screen-v1.js",
  "weekly-avatar-shard-rewards-v1.js",
  "level-avatar-rewards-v1.js",
  "level-up-mobile-safety-v552.js",
  "avatar-unlock-celebration-v1.js",
  "achievement-sharing-avatar-bridge-v1.js",
  "avatar-progression-migration-v1.js",
  "service-worker.js"
];
for (const file of runtimeFiles) {
  new vm.Script(read(file), {filename:file});
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(read("avatar-catalogue-v1.js"), sandbox, {filename:"avatar-catalogue-v1.js"});
const model = sandbox.SalitaAvatarModel;
if (!model || model.catalogue.length !== 48) fail("The integrated catalogue must contain exactly 48 avatars");

const seenAssets = new Set();
for (const avatar of model.catalogue) {
  const asset = String(avatar.image || avatar.asset128 || "").replace(/^\.\//, "");
  if (!asset) fail(`Avatar ${avatar.id} has no 128px asset path`);
  const absolute = path.join(root, asset);
  if (!fs.existsSync(absolute)) fail(`Missing catalogue asset: ${asset}`);
  if (fs.statSync(absolute).size < 40) fail(`Catalogue asset is unexpectedly small: ${asset}`);
  seenAssets.add(asset);

  const buffer = fs.readFileSync(absolute);
  const extension = path.extname(asset).toLowerCase();
  if (extension === ".png") {
    if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") fail(`Invalid PNG signature: ${asset}`);
  } else if (extension === ".webp") {
    if (buffer.subarray(0, 4).toString() !== "RIFF" || buffer.subarray(8, 12).toString() !== "WEBP") fail(`Invalid WebP signature: ${asset}`);
  } else if (extension === ".svg") {
    const text = buffer.toString("utf8", 0, Math.min(buffer.length, 2000));
    if (!/<svg[\s>]/i.test(text)) fail(`Invalid SVG document: ${asset}`);
  } else {
    fail(`Unsupported catalogue asset format: ${asset}`);
  }
}
if (seenAssets.size < 41) fail("Catalogue assets are unexpectedly over-shared; verify individual avatar paths");

const loader = read("profile-emblem-control.js");
const orderedTokens = [
  "await window.SalitaAvatarHotfixReady",
  'await loadScript("migration"',
  'await loadScript("collection"',
  'await loadScript("weekly"',
  'await loadScript("level"',
  'await loadScript("unlock"',
  'await loadScript("sharing"'
];
let lastIndex = -1;
for (const token of orderedTokens) {
  const index = loader.indexOf(token);
  if (index < 0) fail(`Shared loader is missing ${token}`);
  if (index <= lastIndex) fail(`Shared loader order is incorrect at ${token}`);
  lastIndex = index;
}

const serviceWorker = read("service-worker.js");
if (!serviceWorker.includes("salita-quest-v5-5-2-mobile-level-safety-r45")) fail("Service worker cache version is not 5.5.2 r45");
for (const asset of seenAssets) {
  if (!serviceWorker.includes(asset)) fail(`Service worker does not cache ${asset}`);
}
for (const asset of [
  "avatar-progression-hotfix-v551.js",
  "avatar-progression-hotfix-v551.css",
  "level-up-mobile-safety-v552.js",
  "mobile-refresh.html"
]) {
  if (!serviceWorker.includes(asset)) fail(`Service worker does not cache ${asset}`);
}

const readme = read("README.md");
if (!readme.includes("5.5.0 — Avatar Progression")) fail("README does not identify the Avatar Progression release");
if (/unlock a random collectible avatar reward/i.test(readme)) fail("README still describes the retired random weekly reward");
if (!readme.includes("validate-avatar-progression-v550.mjs")) fail("README does not document the integrated avatar validator");

const releaseNotes = read("docs/releases/5.5.0-avatar-progression.md");
for (const required of ["48", "Golden Salita Crest", "No avatar is assigned randomly", "salita-quest-v5-5-avatar-progression-r43"]) {
  if (!releaseNotes.includes(required)) fail(`Release notes are missing ${required}`);
}
const hotfixNotes = read("docs/releases/5.5.1-avatar-hotfix.md");
for (const required of ["Collections", "Starter avatars", "Level milestone safety", "salita-quest-v5-5-1-avatar-hotfix-r44"]) {
  if (!hotfixNotes.includes(required)) fail(`Hotfix release notes are missing ${required}`);
}
const mobileHotfixNotes = read("docs/releases/5.5.2-mobile-level-up-hotfix.md");
for (const required of ["Mobile level-up safety", "mobile-refresh.html", "localStorage", "salita-quest-v5-5-2-mobile-level-safety-r45"]) {
  if (!mobileHotfixNotes.includes(required)) fail(`Mobile hotfix release notes are missing ${required}`);
}

console.log(`Avatar Progression 5.5.2 integration validation passed: ${model.catalogue.length} avatars, ${seenAssets.size} cached source assets, nine component validators and mobile level-up safety.`);
