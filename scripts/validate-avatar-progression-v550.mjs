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
  "scripts/validate-avatar-release-v550.mjs",
  "scripts/validate-stage1-popup-governance-v553.mjs",
  "scripts/validate-avatar-artwork-v554.mjs"
];

for (const validator of validators) {
  const absolute = path.join(root, validator);
  if (!fs.existsSync(absolute)) fail(`Missing validator: ${validator}`);
  const run = spawnSync(process.execPath, [absolute], {cwd:root, encoding:"utf8", stdio:"pipe"});
  process.stdout.write(run.stdout || "");
  process.stderr.write(run.stderr || "");
  if (run.status !== 0) fail(`${validator} failed with exit code ${run.status}`);
}

const runtimeFiles = [
  "avatar-catalogue-v1.js",
  "avatar-artwork-registry-v554.js",
  "avatar-progression-hotfix-v551.js",
  "profile-app.js",
  "popup-governor-v1.js",
  "profile-emblem-control.js",
  "avatar-collection-screen-v1.js",
  "weekly-avatar-shard-rewards-v1.js",
  "level-avatar-rewards-v1.js",
  "level-progression-v2.js",
  "level-up-mobile-safety-v552.js",
  "avatar-unlock-celebration-v1.js",
  "achievement-sharing-avatar-bridge-v1.js",
  "avatar-progression-migration-v1.js",
  "service-worker.js"
];
for (const file of runtimeFiles) new vm.Script(read(file), {filename:file});

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(read("avatar-catalogue-v1.js"), sandbox, {filename:"avatar-catalogue-v1.js"});
const model = sandbox.SalitaAvatarModel;
if (!model || model.catalogue.length !== 48) fail("The integrated catalogue must contain exactly 48 avatars");

const seenAssets = new Set();
for (const avatar of model.catalogue) {
  const asset = String(avatar.image || avatar.asset128 || "").replace(/^\.\//, "");
  if (!asset) fail(`Avatar ${avatar.id} has no asset path`);
  const absolute = path.join(root, asset);
  if (!fs.existsSync(absolute)) fail(`Missing catalogue asset: ${asset}`);
  if (fs.statSync(absolute).size < 40) fail(`Catalogue asset is unexpectedly small: ${asset}`);
  seenAssets.add(asset);
}

const loader = read("profile-emblem-control.js");
const orderedTokens = [
  'await loadScript("catalogue"',
  'await loadScript("artwork-runtime"',
  'await loadScript("hotfix-runtime"',
  "await window.SalitaAvatarHotfixReady",
  "await window.SalitaAvatarArtworkReady",
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
  if (index < 0 || index <= lastIndex) fail(`Shared loader order is incorrect at ${token}`);
  lastIndex = index;
}
if (!loader.includes('const RELEASE_VERSION = "5.5.4"')) fail("Shared loader is not cache-busted to 5.5.4");

const serviceWorker = read("service-worker.js");
if (!serviceWorker.includes("salita-quest-v5-5-4-avatar-artwork-r47")) fail("Service worker cache version is not 5.5.4 r47");
for (const asset of seenAssets) {
  if (!serviceWorker.includes(asset)) fail(`Service worker does not cache ${asset}`);
}
for (const asset of [
  "popup-governor-v1.js",
  "avatar-artwork-registry-v554.js",
  "avatar-progression-hotfix-v551.js",
  "level-up-mobile-safety-v552.js",
  "level-avatar-rewards-v1.js",
  "avatar-unlock-celebration-v1.js",
  "mobile-refresh.html"
]) {
  if (!serviceWorker.includes(asset)) fail(`Service worker does not cache ${asset}`);
}

for (const [file, markers] of [
  ["docs/releases/5.5.0-avatar-progression.md", ["48", "Golden Salita Crest"]],
  ["docs/releases/5.5.1-avatar-hotfix.md", ["Collections", "Level milestone safety"]],
  ["docs/releases/5.5.2-mobile-level-up-hotfix.md", ["Mobile level-up safety", "mobile-refresh.html"]],
  ["docs/releases/5.5.3-stage-1-popup-governance.md", ["single popup governor", "acknowledgement-before-render", "r46"]],
  ["docs/releases/5.5.4-avatar-artwork-governance.md", ["canonical artwork registry", "48 avatars", "r47"]]
]) {
  const source = read(file).toLowerCase();
  for (const marker of markers) if (!source.includes(marker.toLowerCase())) fail(`${file} is missing ${marker}`);
}

console.log(`Avatar Progression 5.5.4 integration validation passed: ${model.catalogue.length} avatars, ${seenAssets.size} cached assets, seven component validators, governed popups and canonical artwork.`);
