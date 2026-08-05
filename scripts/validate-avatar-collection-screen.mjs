import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const catalogueSource = read("src/features/avatar/avatar-catalogue-v1.js");
const compatibilitySource = read("avatar-collection-screen-v1.js");
const runtimeSource = read("src/adapters/avatar/avatar-collection-profile-runtime-v1.js");
const screenSource = read("src/features/avatar/avatar-collection-screen-v1.js");
const pageSource = read("avatar-collection-page-v2.js");
const screenCss = read("avatar-collection-screen-v1.css");
const hotfixCss = read("avatar-progression-hotfix-v551.css");
const emblemSource = read("profile-emblem-control.js");

new vm.Script(compatibilitySource, {filename:"avatar-collection-screen-v1.js"});
new vm.Script(runtimeSource, {filename:"avatar-collection-profile-runtime-v1.js"});
new vm.Script(screenSource, {filename:"src/features/avatar/avatar-collection-screen-v1.js"});
new vm.Script(pageSource, {filename:"avatar-collection-page-v2.js"});
new vm.Script(emblemSource, {filename:"profile-emblem-control.js"});

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(catalogueSource, sandbox, {filename:"avatar-catalogue-v1.js"});
const model = sandbox.SalitaAvatarModel;
if (!model || model.catalogue.length !== 48) fail("The collection screen requires the complete 48-avatar catalogue");

for (const [amount, expected] of [[25,25],[50,50],[75,75]]) {
  const result = model.progress("philippine_pangolin", {shards:{philippine_pangolin:amount}});
  if (result.percent !== expected || result.owned) fail(`Expected partial progress at ${expected}%`);
}
const owned = model.progress("philippine_pangolin", {ownedAvatarIds:["philippine_pangolin"]});
if (!owned.owned || owned.percent !== 100) fail("Owned avatars must render at full colour");

for (const required of [
  'RARITY_ORDER = ["starter", "common", "uncommon", "rare", "special"]',
  "Math.floor(percent / 25) * 25",
  "sq-avatar-grey",
  "sq-avatar-colour",
  "data-avatar-action",
  "data-avatar-detail",
  "salita:avatar-equipped",
  "Avatar collection",
  "Unlock:"
]) {
  if (!screenSource.includes(required)) fail(`Collection runtime is missing ${required}`);
}

for (const required of [
  "filter:grayscale(1)",
  "clip-path:inset(var(--avatar-mask-top,100%) 0 0 0)",
  "--avatar-progress",
  ".sq-avatar-grid-full",
  "@media(max-width:650px)"
]) {
  if (!screenCss.includes(required)) fail(`Collection styles are missing ${required}`);
}
for (const required of [
  "minmax(min(172px,100%),1fr)",
  ".sq-avatar-card{min-width:0;overflow:hidden",
  "-webkit-line-clamp:2"
]) {
  if (!hotfixCss.includes(required)) fail(`Collection hotfix styles are missing ${required}`);
}

if (!emblemSource.includes('const RELEASE_VERSION = "5.5.6"')) fail("Shared profile runtime release version is not 5.5.6");
if (!emblemSource.includes("avatar-collection-screen-v1.css") || !emblemSource.includes("addStylesheet")) {
  fail("Collection CSS is not loaded by the shared profile runtime");
}
if (!emblemSource.includes("src/adapters/avatar/avatar-collection-profile-runtime-v1.js") || !emblemSource.includes("src/features/avatar/avatar-collection-screen-v1.js") || !emblemSource.includes('loadScript("collection"')) {
  fail("Collection adapter/feature/coordinator order is not loaded by the shared profile runtime");
}
if (/localStorage|sessionStorage/.test(screenSource + pageSource)) fail("Collection UI still owns profile storage");
if (!runtimeSource.includes("SalitaAvatarCollectionProfileRuntimeV1")) fail("Collection profile runtime API is missing");
if (!runtimeSource.includes("collection.ownedAvatarIds.includes")) fail("Owned-only equipping is not owned by the collection profile adapter");
if (!compatibilitySource.includes("document.write") || !compatibilitySource.includes("script.async = false")) fail("Historical collection URL is not a compatibility coordinator");
if (!emblemSource.includes("await window.SalitaAvatarHotfixReady")) fail("Collection starts before canonical progression data is ready");

console.log("Avatar collection screen validation passed: all avatars, locked greyscale, 25/50/75% reveal, stable cards and owned-only equipping.");
