import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const fail = message => { throw new Error(message); };
const requireText = (source, token, label) => {
  if (!source.includes(token)) fail(`${label} is missing ${token}`);
};

const registry = read("avatar-artwork-registry-v554.js");
new vm.Script(registry, {filename:"avatar-artwork-registry-v554.js"});

const catalogueSandbox = {};
vm.createContext(catalogueSandbox);
vm.runInContext(read("avatar-catalogue-v1.js"), catalogueSandbox, {filename:"avatar-catalogue-v1.js"});
const model = catalogueSandbox.SalitaAvatarModel;
if (!model || model.catalogue.length !== 48) fail("Avatar artwork validation requires the complete 48-avatar catalogue");

for (const item of model.catalogue) {
  requireText(registry, `${item.id}:`, `Canonical artwork map for ${item.id}`);
}

const spriteIds = [
  "philippine_cockatoo",
  "rufous_hornbill",
  "luzon_bleeding_heart_dove",
  "cebu_flowerpecker",
  "philippine_eagle_owl",
  "whale_shark_butanding",
  "dugong",
  "hawksbill_sea_turtle"
];
for (const id of spriteIds) requireText(registry, `${id}:[`, `Sprite crop map for ${id}`);
for (const token of [
  'const RELEASE = "5.5.5"',
  "setFallbackChain",
  "cropSprite",
  "getAvatarImagePath",
  "repairScope",
  '"salita:avatar-equipped"',
  '"salita:avatar-model-hotfixed"',
  "syncEquipped",
  "verifyAll",
  "data:image/svg+xml"
]) requireText(registry, token, "Avatar artwork registry");

for (const forbidden of [
  "installObserver",
  "observer.observe(document.documentElement",
  'window.addEventListener("error"',
  "window.setTimeout(() => verifyAll"
]) {
  if (registry.includes(forbidden)) fail(`Avatar artwork registry must not contain runaway global watcher: ${forbidden}`);
}

const profileLoader = read("profile-emblem-control.js");
new vm.Script(profileLoader, {filename:"profile-emblem-control.js"});
const orderedLoaderTokens = [
  'loadScript("catalogue"',
  'loadScript("artwork-runtime"',
  'loadScript("hotfix-runtime"',
  "await window.SalitaAvatarHotfixReady",
  "await window.SalitaAvatarArtworkReady",
  'loadScript("migration"',
  'loadScript("collection"'
];
let previous = -1;
for (const token of orderedLoaderTokens) {
  const current = profileLoader.indexOf(token);
  if (current < 0 || current <= previous) fail(`Avatar loader order is incorrect at ${token}`);
  previous = current;
}
for (const token of [
  'const RELEASE_VERSION = "5.5.5"',
  "avatar-artwork-registry-v554.js",
  "SalitaAvatarArtwork?.repair",
  "SalitaAvatarArtwork?.syncEquipped"
]) requireText(profileLoader, token, "Profile emblem loader");

const profileApp = read("profile-app.js");
new vm.Script(profileApp, {filename:"profile-app.js"});
for (const token of [
  "finalAvatarModel",
  "await window.SalitaAvatarHotfixReady",
  "await window.SalitaAvatarArtworkReady",
  "window.SalitaAvatarModel || baseModel",
  'data-sq-avatar-id="${initialAvatar.id}"',
  "SalitaAvatarArtwork.bind",
  "SalitaAvatarArtwork?.repair(control)"
]) requireText(profileApp, token, "Profile app");

const collection = read("avatar-collection-screen-v1.js");
new vm.Script(collection, {filename:"avatar-collection-screen-v1.js"});
for (const token of [
  'data-sq-avatar-id="${item.id}"',
  "SalitaAvatarArtwork?.repair(root)",
  "SalitaAvatarArtwork.bind(image,item.id",
  "SalitaAvatarArtwork?.repair(detail)"
]) requireText(collection, token, "Avatar collection");

const unlock = read("avatar-unlock-celebration-v1.js");
new vm.Script(unlock, {filename:"avatar-unlock-celebration-v1.js"});
for (const token of ["SalitaAvatarArtwork?.getAvatarImagePath", "SalitaAvatarArtwork.bind", 'data-sq-avatar-id="${item.id}"']) {
  requireText(unlock, token, "Avatar unlock popup");
}

const worker = read("service-worker.js");
new vm.Script(worker, {filename:"service-worker.js"});
for (const token of ["salita-quest-v5-5-4-avatar-artwork-r47", "avatar-artwork-registry-v554.js", "rare-animals-set2-sprite.png"]) {
  requireText(worker, token, "Service worker");
}

const refresh = read("mobile-refresh.html");
for (const token of ['const RELEASE = "5.5.5"', "avatar-artwork-registry-v554.js", "profile-emblem-control.js"]) {
  requireText(refresh, token, "Recovery refresh page");
}

console.log(`Avatar artwork 5.5.5 crash validation passed: ${model.catalogue.length} canonical entries, ${spriteIds.length} sprite crops, explicit bindings, no competing global image observers and a cache-reset recovery page.`);
