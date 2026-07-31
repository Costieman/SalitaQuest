import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const level = read("level-progression-v2.js");
const unlock = read("avatar-unlock-celebration-v1.js");
const safety = read("level-up-mobile-safety-v552.js");
const loader = read("profile-emblem-control.js");
const app = read("app.html");
const bisaya = read("bisaya.html");
const refresh = read("mobile-refresh.html");
const worker = read("service-worker.js");
const css = read("level-run-once-v553.css");

for (const [name, source] of [
  ["level progression", level],
  ["avatar unlock", unlock],
  ["run-once safety", safety],
  ["profile loader", loader],
  ["service worker", worker]
]) {
  new vm.Script(source, {filename:name});
}

for (const required of [
  'const RUN_ONCE_RELEASE = "5.5.3"',
  "celebratedLevels",
  "milestoneAnimationsSeen",
  "rewardForLevel",
  "Reward:",
  "level-up-reward-label",
  "before_animation_dom",
  "lastCelebrationAcknowledgedBy",
  "salita:level-up-acknowledged"
]) {
  if (!level.includes(required)) fail(`Level progression is missing ${required}`);
}
const acknowledgementIndex = level.indexOf('markCelebrated(pending, reward, "before_animation_dom")');
const levelDomIndex = level.indexOf('document.createElement("div")', acknowledgementIndex);
if (acknowledgementIndex < 0 || levelDomIndex <= acknowledgementIndex) {
  fail("Level-up acknowledgement must be persisted before creating the animation DOM");
}

for (const required of [
  'const RUN_ONCE_RELEASE = "5.5.3"',
  "avatarUnlockRunOnce",
  "acknowledgedBeforeAnimation:true",
  'saveCompletion(pendingEntry,item,"before_animation_dom")',
  "pruneSeenPending",
  "milestoneAnimationsSeen",
  "data-unlock-add",
  "data-unlock-skip"
]) {
  if (!unlock.includes(required)) fail(`Avatar unlock runtime is missing ${required}`);
}
const unlockSaveIndex = unlock.indexOf('saveCompletion(pendingEntry,item,"before_animation_dom")');
const unlockDomIndex = unlock.indexOf("buildLayer(item,pendingEntry)", unlockSaveIndex);
if (unlockSaveIndex < 0 || unlockDomIndex <= unlockSaveIndex) {
  fail("Avatar reward acknowledgement must be saved before the reward popup is built");
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(unlock, sandbox, {filename:"avatar-unlock-celebration-v1.js"});
const logic = sandbox.SalitaAvatarUnlockCelebrationLogic;
if (!logic || logic.version !== 3) fail("Avatar unlock run-once logic v3 did not initialise");
const model = {
  normaliseCollectionState(value = {}) {
    return {
      ownedAvatarIds:[...(value.ownedAvatarIds || [])],
      pendingUnlocks:[...(value.pendingUnlocks || [])]
    };
  },
  get(id) { return id === "narra" ? {id:"narra"} : null; }
};
const pending = {avatarId:"narra",source:"level_milestone",level:10,animationSeen:false};
const collection = {ownedAvatarIds:["narra"],pendingUnlocks:[pending,{...pending}]};
if (logic.nextPending(collection, model, [{...pending, animationSeenAt:"now"}]) !== null) {
  fail("External unlock history must block replay");
}
const consumed = logic.consumePending(collection, pending, model, "now");
if (!consumed.consumed || consumed.collection.pendingUnlocks.length !== 0) {
  fail("Consuming one reward must remove all duplicate pending entries");
}

for (const required of [
  'const ACTIVE_RELEASE = "5.5.3"',
  ".level-up-celebration",
  ".sq-avatar-unlock-layer",
  "acknowledgeAvatarLayer",
  "decorateLevelReward",
  "celebration_dom_inserted",
  "avatar_dom_inserted",
  "SalitaLevelUpRunOnceSafety"
]) {
  if (!safety.includes(required)) fail(`Run-once safety is missing ${required}`);
}

for (const [name, source] of [["Tagalog", app], ["Bisaya", bisaya]]) {
  for (const required of [
    "profile-emblem-control.js?v=5.5.3",
    "level-progression-v2.js?v=5.5.3",
    "level-up-mobile-safety-v552.js?v=5.5.3",
    "level-run-once-v553.css?v=5.5.3"
  ]) {
    if (!source.includes(required)) fail(`${name} loader is missing ${required}`);
  }
  const levelIndex = source.indexOf("level-progression-v2.js?v=5.5.3");
  const safetyIndex = source.indexOf("level-up-mobile-safety-v552.js?v=5.5.3");
  if (levelIndex < 0 || safetyIndex <= levelIndex) fail(`${name} must load run-once safety after level progression`);
}

if (!loader.includes('const ACTIVE_RELEASE_VERSION = "5.5.3"')) fail("Avatar loader does not use release 5.5.3");
if (!loader.includes("avatar-unlock-celebration-v1.js?v=${ACTIVE_RELEASE_VERSION}")) {
  fail("Avatar unlock runtime is not cache-busted by the active release");
}

for (const required of [
  'const ACTIVE_RELEASE = "5.5.3"',
  "level-progression-v2.js",
  "avatar-unlock-celebration-v1.js",
  "caches.delete(key)",
  "registration.unregister()"
]) {
  if (!refresh.includes(required)) fail(`Device refresh page is missing ${required}`);
}
if (/localStorage\.(?:clear|removeItem)/.test(refresh)) fail("Device refresh must not remove learner storage");

for (const required of [
  "salita-quest-v5-5-3-level-run-once-r46",
  '"./level-run-once-v553.css"',
  '"./avatar-unlock-celebration-v1.js"',
  'new Request(event.request, {cache:"reload"})'
]) {
  if (!worker.includes(required)) fail(`Service worker is missing ${required}`);
}
for (const required of [".level-up-reward-label", ".level-up-reward-safety-label", "@media (max-width: 760px)"]) {
  if (!css.includes(required)) fail(`Run-once reward styles are missing ${required}`);
}

console.log("Level Run-Once 5.5.3 validation passed: acknowledgements precede DOM, duplicate queues are consumed, reward artwork is shown, and phone/desktop loaders are cache-busted.");
