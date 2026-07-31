import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const catalogueSource = read("avatar-catalogue-v1.js");
const screenSource = read("avatar-collection-screen-v1.js");
const screenCss = read("avatar-collection-screen-v1.css");
const emblemSource = read("profile-emblem-control.js");

new vm.Script(screenSource, {filename:"avatar-collection-screen-v1.js"});
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
  "collection.ownedAvatarIds.includes",
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

if (!emblemSource.includes("avatar-collection-screen-v1.css?v=5.5.0")) fail("Collection CSS is not loaded by the shared profile runtime");
if (!emblemSource.includes("avatar-collection-screen-v1.js?v=5.5.0")) fail("Collection JavaScript is not loaded by the shared profile runtime");
if (!emblemSource.includes("loadAvatarCollectionAssets();")) fail("Collection loader is not started");

console.log("Avatar collection screen validation passed: all avatars, locked greyscale, 25/50/75% reveal, details and owned-only equipping.");
