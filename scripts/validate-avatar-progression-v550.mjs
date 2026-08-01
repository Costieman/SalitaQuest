import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fail = message => { throw new Error(message); };
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const validators = [
  {file:"scripts/validate-canonical-avatar-mapping.mjs", args:["--require-assets"]},
  {file:"scripts/validate-avatar-catalogue.mjs", args:[]},
  {file:"scripts/validate-avatar-onboarding.mjs", args:[]},
  {file:"scripts/validate-avatar-collection-screen.mjs", args:[]},
  {file:"scripts/validate-weekly-avatar-shards.mjs", args:[]},
  {file:"scripts/validate-stage1-popup-governance-v553.mjs", args:[]},
  {file:"scripts/validate-avatar-runtime-v556.mjs", args:[]}
];

for (const validator of validators) {
  const absolute = path.join(root, validator.file);
  if (!fs.existsSync(absolute)) fail(`Missing validator: ${validator.file}`);
  const run = spawnSync(process.execPath, [absolute, ...validator.args], {cwd:root, encoding:"utf8", stdio:"pipe"});
  process.stdout.write(run.stdout || "");
  process.stderr.write(run.stderr || "");
  if (run.status !== 0) fail(`${validator.file} failed with exit code ${run.status}`);
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
if (model.manifestPath !== "avatars/canonical/manifest.json") fail("The integrated catalogue must declare the canonical manifest");
if (!model.catalogue.every(item => item.image === `avatars/canonical/${item.id}.png`)) {
  fail("Every integrated avatar must resolve to its direct canonical PNG path");
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
if (!loader.includes('const RELEASE_VERSION = "5.5.6"')) fail("Shared loader is not cache-busted to 5.5.6");
if (loader.includes("repair(document)")) fail("Shared loader must not run a document-wide avatar repair pass");

const artwork = read("avatar-artwork-registry-v554.js");
const compatibility = read("avatar-progression-hotfix-v551.js");
const combinedArtworkRuntime = artwork + compatibility;
for (const prohibited of [
  "raw.githubusercontent.com",
  "rare-animals-set2-sprite",
  "createImageBitmap",
  'createElement("canvas")',
  "PATH_BY_ID"
]) {
  if (combinedArtworkRuntime.includes(prohibited)) fail(`Prohibited avatar mechanism remains active: ${prohibited}`);
}
if (artwork.includes("MutationObserver") || compatibility.includes("MutationObserver")) {
  fail("Avatar artwork runtimes must not install a source mutation observer");
}

const serviceWorker = read("service-worker.js");
if (!serviceWorker.includes("salita-quest-v5-5-6-canonical-avatars-r48")) fail("Service worker cache version is not 5.5.6 r48");
const cachedCanonical = [...serviceWorker.matchAll(/"\.\/avatars\/canonical\/[^"]+\.png"/g)];
if (cachedCanonical.length !== 48) fail(`Service worker must cache exactly 48 canonical PNGs, found ${cachedCanonical.length}`);
if (/"\.\/avatars\/(?!canonical\/)/.test(serviceWorker)) fail("Service worker still caches legacy avatar artwork");

const refresh = read("mobile-refresh.html");
if (!refresh.includes('const RELEASE = "5.5.6"')) fail("Mobile refresh is not aligned to 5.5.6");
if (/localStorage\.(?:clear|removeItem)\(/.test(refresh)) fail("Mobile refresh must not remove learner local-storage data");

const releaseNotes = read("docs/releases/5.5.6-canonical-avatar-runtime.md");
for (const marker of [
  "48 direct canonical PNGs",
  "no runtime sprite extraction",
  "no canvas artwork conversion",
  "no raw GitHub artwork fallback",
  "learner state preservation",
  "not merged to main"
]) {
  if (!releaseNotes.toLowerCase().includes(marker.toLowerCase())) fail(`5.5.6 release notes are missing ${marker}`);
}

console.log(`Avatar Progression 5.5.6 integration validation passed: ${model.catalogue.length} direct canonical avatars, seven component validators, preserved learner state, governed rewards and no competing artwork runtime.`);
