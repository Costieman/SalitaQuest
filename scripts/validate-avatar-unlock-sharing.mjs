import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const catalogueSource = read("avatar-catalogue-v1.js");
const unlockSource = read("avatar-unlock-celebration-v1.js");
const unlockCss = read("avatar-unlock-celebration-v1.css");
const bridgeSource = read("achievement-sharing-avatar-bridge-v1.js");
const loaderSource = read("profile-emblem-control.js");

new vm.Script(unlockSource, {filename:"avatar-unlock-celebration-v1.js"});
new vm.Script(bridgeSource, {filename:"achievement-sharing-avatar-bridge-v1.js"});
new vm.Script(loaderSource, {filename:"profile-emblem-control.js"});

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(catalogueSource, sandbox, {filename:"avatar-catalogue-v1.js"});
vm.runInContext(unlockSource, sandbox, {filename:"avatar-unlock-celebration-v1.js"});

const model = sandbox.SalitaAvatarModel;
const logic = sandbox.SalitaAvatarUnlockCelebrationLogic;
if (!model || !logic) fail("Unlock celebration logic did not initialise");

const pending = {
  equippedAvatarId:"anahaw",
  ownedAvatarIds:["anahaw", "narra", "katmon"],
  shards:{narra:100, katmon:100},
  pendingUnlocks:[
    {avatarId:"narra", source:"level_milestone", level:10, unlockedAt:"2026-01-01T00:00:00.000Z", animationSeen:false},
    {avatarId:"katmon", source:"weekly_reward", weekKey:"2026-01-05", unlockedAt:"2026-01-08T00:00:00.000Z", animationSeen:false}
  ]
};

const first = logic.nextPending(pending, model);
if (first?.avatarId !== "narra") fail("The first unseen owned unlock must be selected");
const consumed = logic.consumePending(pending, first, model, "2026-01-10T00:00:00.000Z");
if (consumed.consumed?.avatarId !== "narra" || consumed.consumed.animationSeen !== true) {
  fail("Consumed unlock must be marked as seen");
}
if (consumed.collection.pendingUnlocks.length !== 1 || consumed.collection.pendingUnlocks[0].avatarId !== "katmon") {
  fail("Only the played unlock should leave the pending queue");
}
if (logic.nextPending(consumed.collection, model)?.avatarId !== "katmon") {
  fail("The next queued unlock must remain available");
}
const seenOnly = logic.nextPending({
  ownedAvatarIds:["narra"],
  pendingUnlocks:[{avatarId:"narra", source:"level_milestone", animationSeen:true}]
}, model);
if (seenOnly) fail("Seen unlocks must never replay");

for (const required of [
  "sq-avatar-unlock-layer",
  "Add to collection",
  "window.SalitaAvatarCollectionScreen",
  "salita:open-avatar-collection",
  "data-avatar-card",
  "scrollIntoView",
  "flyer.animate",
  "avatarUnlockHistory",
  "salita:avatar-unlock-animation-started",
  "salita:avatar-unlock-animation-finished"
]) {
  if (!unlockSource.includes(required)) fail(`Unlock runtime is missing ${required}`);
}

for (const required of [
  ".sq-avatar-unlock-layer",
  ".sq-avatar-unlock-flyer",
  ".sq-avatar-unlock-arrived",
  "@media(prefers-reduced-motion:reduce)"
]) {
  if (!unlockCss.includes(required)) fail(`Unlock styles are missing ${required}`);
}

for (const required of [
  "avatarCollection?.equippedAvatarId",
  "window.SalitaAvatarModel?.get",
  "LEGACY_AVATAR_PATTERN",
  "RedirectedImage",
  "stampAvatar",
  "HTMLCanvasElement.prototype.toBlob",
  "stampBadge:method === \"openBadge\"",
  '"openBadge", "openChest", "openLevel"',
  "document.addEventListener(\"click\", interceptSharingClicks, true)"
]) {
  if (!bridgeSource.includes(required)) fail(`Achievement avatar bridge is missing ${required}`);
}

if (!loaderSource.includes('const RELEASE_VERSION = "5.5.0"')) fail("Shared profile runtime release version is not 5.5.0");
for (const required of [
  "avatar-unlock-celebration-v1.css",
  "avatar-unlock-celebration-v1.js",
  "achievement-sharing-avatar-bridge-v1.js",
  "loadAvatarUnlockCelebrationAssets();",
  "loadAchievementAvatarBridgeAssets();"
]) {
  if (!loaderSource.includes(required)) fail(`Shared loader is missing ${required}`);
}

console.log("Avatar unlock and sharing validation passed: queued once-only reveals, flight into the collection, reduced-motion fallback and equipped-avatar badge/chest/level cards.");
