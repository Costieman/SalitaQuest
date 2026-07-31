import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "avatars/canonical");
const MANIFEST_PATH = path.join(ASSETS, "manifest.json");
const errors = [];
const checks = [];
const check = (condition, message) => {
  checks.push({message, passed:Boolean(condition)});
  if (!condition) errors.push(message);
};
const read = relative => fs.readFileSync(path.join(ROOT, relative), "utf8");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const catalogueSource = read("avatar-catalogue-v1.js");
const artworkSource = read("avatar-artwork-registry-v554.js");
const hotfixSource = read("avatar-progression-hotfix-v551.js");
const emblemSource = read("profile-emblem-control.js");
const serviceWorkerSource = read("service-worker.js");
const refreshSource = read("mobile-refresh.html");
const cssSource = read("profile-emblem-control.css");
const collectionSource = read("avatar-collection-screen-v1.js");
const weeklySource = read("weekly-avatar-shard-rewards-v1.js");
const levelSource = read("level-avatar-rewards-v1.js");
const unlockSource = read("avatar-unlock-celebration-v1.js");
const sharingSource = read("achievement-sharing-avatar-bridge-v1.js");
const profileSource = read("profile-app.js");

for (const [name, source] of Object.entries({
  "avatar-catalogue-v1.js":catalogueSource,
  "avatar-artwork-registry-v554.js":artworkSource,
  "avatar-progression-hotfix-v551.js":hotfixSource,
  "profile-emblem-control.js":emblemSource,
  "service-worker.js":serviceWorkerSource,
  "avatar-collection-screen-v1.js":collectionSource,
  "weekly-avatar-shard-rewards-v1.js":weeklySource,
  "level-avatar-rewards-v1.js":levelSource,
  "avatar-unlock-celebration-v1.js":unlockSource,
  "achievement-sharing-avatar-bridge-v1.js":sharingSource,
  "profile-app.js":profileSource
})) {
  try { new vm.Script(source, {filename:name}); check(true, `${name} parses`); }
  catch (error) { check(false, `${name} parses: ${error.message}`); }
}

const sandbox = {
  console,
  Object,
  Array,
  Set,
  Map,
  Date,
  Math,
  Number,
  String,
  Boolean,
  JSON,
  Promise,
  CustomEvent:class CustomEvent { constructor(type, init={}) { this.type=type; this.detail=init.detail; } },
  document:{
    dispatchEvent() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
    createElement() { return {}; },
    documentElement:{},
  },
  setTimeout() { return 0; },
  clearTimeout() {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
new vm.Script(catalogueSource, {filename:"avatar-catalogue-v1.js"}).runInContext(sandbox);
check(sandbox.SalitaAvatarModel?.catalogue?.length === 48, "Base catalogue contains 48 avatars");
check(sandbox.SalitaAvatarModel?.manifestPath === "avatars/canonical/manifest.json", "Catalogue declares the canonical manifest");

new vm.Script(hotfixSource, {filename:"avatar-progression-hotfix-v551.js"}).runInContext(sandbox);
await sandbox.SalitaAvatarHotfixReady;
const model = sandbox.SalitaAvatarModel;
check(model.catalogue.length === 48, "Progression-compatible catalogue contains 48 avatars");
check(new Set(model.catalogue.map(item => item.id)).size === 48, "All stable IDs remain unique");
check(new Set(model.catalogue.map(item => item.image)).size === 48, "All canonical image paths remain unique");
check(model.catalogue.every(item => item.image === `avatars/canonical/${item.id}.png`), "Every catalogue image is a direct canonical PNG path");
check(model.get("philippine_eagle")?.id === "eagle", "Historical eagle alias resolves");
check(model.get("luzon_bleeding_heart")?.id === "luzon_bleeding_heart_dove", "Historical dove alias resolves");
check(model.list({rarity:"starter"}).length === 4, "The four starter identities remain available");

const representative = {
  equippedAvatarId:"luzon_bleeding_heart",
  ownedAvatarIds:["anahaw", "philippine_eagle", "luzon_bleeding_heart"],
  shards:{philippine_eagle:67, dugong:44},
  pendingUnlocks:[{avatarId:"dugong", source:"weekly", seen:false}],
  levelRewardsClaimed:[10,20,20],
  needsStarterChoice:false
};
const normalized = model.normaliseCollectionState(representative, "anahaw");
check(normalized.equippedAvatarId === "luzon_bleeding_heart_dove", "Equipped historical alias is preserved as canonical ID");
check(normalized.ownedAvatarIds.includes("eagle"), "Owned historical eagle is preserved");
check(normalized.ownedAvatarIds.includes("luzon_bleeding_heart_dove"), "Owned historical dove is preserved");
check(normalized.shards.dugong === 44, "Partial shard totals are preserved");
check(normalized.pendingUnlocks[0]?.avatarId === "dugong", "Pending unlocks are preserved");
check(normalized.levelRewardsClaimed.join(",") === "10,20", "Level reward claims remain deduplicated and preserved");

const prohibited = [
  ["MutationObserver", artworkSource + hotfixSource, "No avatar source MutationObserver remains"],
  ["createElement(\"canvas\")", artworkSource + hotfixSource, "No runtime avatar canvas extraction remains"],
  ["createImageBitmap", artworkSource + hotfixSource, "No runtime avatar bitmap conversion remains"],
  ["raw.githubusercontent.com", artworkSource + hotfixSource, "No raw GitHub avatar fallback remains"],
  ["rare-animals-set2-sprite", artworkSource + hotfixSource + serviceWorkerSource, "No active rare-animal sprite remains"],
  ["PATH_BY_ID", artworkSource + hotfixSource, "No duplicate artwork path registry remains outside the catalogue"]
];
for (const [needle, source, message] of prohibited) check(!source.includes(needle), message);
check(!emblemSource.includes("repair(document)"), "No document-wide avatar repair pass remains");
check(emblemSource.includes('RELEASE_VERSION = "5.5.6"'), "Profile runtime uses release 5.5.6");
check(refreshSource.includes('RELEASE = "5.5.6"'), "Recovery page uses release 5.5.6");
check(cssSource.includes("image-rendering:auto!important"), "High-resolution avatar downscaling uses normal rendering");

for (const [name, source] of Object.entries({
  profile:profileSource,
  collection:collectionSource,
  weekly:weeklySource,
  level:levelSource,
  unlock:unlockSource,
  sharing:sharingSource
})) {
  check(source.includes("item.image") || source.includes("getAvatarImagePath") || source.includes("SalitaAvatarArtwork"), `${name} consumer resolves canonical artwork`);
}
check(profileSource.includes("data-sq-avatar-id"), "Profile images carry stable avatar IDs");
check(collectionSource.includes("data-sq-avatar-id"), "Collection images carry stable avatar IDs");

const manifestPaths = manifest.avatars.map(item => `./${item.canonicalPath}`);
const cachedCanonical = [...serviceWorkerSource.matchAll(/"\.\/avatars\/canonical\/[^"]+\.png"/g)].map(match => match[0].slice(1,-1));
check(cachedCanonical.length === 48, "Service worker lists exactly 48 canonical PNGs");
check(new Set(cachedCanonical).size === 48, "Service-worker canonical PNG paths are unique");
check(manifestPaths.every(file => cachedCanonical.includes(file)), "Service worker precaches every manifest image");
check(!/"\.\/avatars\/(?!canonical\/)/.test(serviceWorkerSource), "Service worker no longer precaches legacy avatar artwork");
check(serviceWorkerSource.includes('CACHE_NAME = "salita-quest-v5-5-6-canonical-avatars-r48"'), "Service-worker cache revision is updated");

function pngMetadata(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  if (buffer.length < 26 || !buffer.subarray(0,8).equals(signature)) return null;
  return {
    width:buffer.readUInt32BE(16),
    height:buffer.readUInt32BE(20),
    colorType:buffer[25]
  };
}
check(manifest.avatars.length === 48, "Manifest contains 48 avatar identities");
for (const item of manifest.avatars) {
  const file = path.join(ASSETS, `${item.id}.png`);
  check(fs.existsSync(file), `${item.id} canonical file exists`);
  if (!fs.existsSync(file)) continue;
  const metadata = pngMetadata(file);
  check(metadata?.width === 512 && metadata?.height === 512, `${item.id} is a valid 512 × 512 PNG`);
  check(metadata?.colorType === 4 || metadata?.colorType === 6, `${item.id} PNG preserves an alpha channel`);
}

const report = {
  status:errors.length ? "FAIL" : "PASS",
  release:"5.5.6",
  canonicalAvatarCount:model.catalogue.length,
  serviceWorkerCanonicalAssets:cachedCanonical.length,
  checksPassed:checks.filter(item => item.passed).length,
  checksFailed:checks.filter(item => !item.passed).length,
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
