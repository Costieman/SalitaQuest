import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source, markers, label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

const files = [
  "avatar-progression-hotfix-v551.js",
  "profile-emblem-control.js",
  "level-avatar-rewards-v1.js",
  "avatar-unlock-celebration-v1.js",
  "service-worker.js"
];
for (const file of files) new vm.Script(read(file), {filename:file});

const hotfix = read("avatar-progression-hotfix-v551.js");
requireMarkers(hotfix, [
  'const RELEASE = "5.5.1"',
  "createImageBitmap",
  'canvas.toDataURL("image/png")',
  'const SPRITE_PATH = "avatars/rare-animals-set2-sprite.png"',
  "philippine_cockatoo:[0,0]",
  "hawksbill_sea_turtle:[3,1]",
  'rarity:starter ? "common" : source.rarity',
  'weeklyRarity:starter ? "common"',
  'collectionGroups:starter ? Object.freeze(["starter","common"])',
  'unlockSource:starter ? "starter_or_weekly"',
  "shardRequirement:starter ? 100",
  'if (key === "rarity" && value === "starter")',
  'navButton.dataset.view = "collections"',
  "Badges",
  "Avatars",
  "SalitaAvatarHotfixReady"
], "Avatar hotfix runtime");

const pngPathCount = (hotfix.match(/avatars\/[a-z0-9-]+\.png/g) || []).length;
if (pngPathCount < 17) fail(`Expected the common/uncommon artwork and sprite paths; found ${pngPathCount}`);
const spriteCellCount = (hotfix.match(/:\[[0-3],[01]\]/g) || []).length;
if (spriteCellCount !== 8) fail(`Expected eight sprite cells; found ${spriteCellCount}`);

const css = read("avatar-progression-hotfix-v551.css");
requireMarkers(css, [
  "minmax(min(172px,100%),1fr)",
  ".sq-avatar-card{min-width:0;overflow:hidden",
  "-webkit-line-clamp:2",
  ".collections-choice-grid",
  ".collections-choice-card"
], "Avatar hotfix styles");

const loader = read("profile-emblem-control.js");
requireMarkers(loader, [
  'const RELEASE_VERSION = "5.5.1"',
  "avatar-progression-hotfix-v551.css",
  "avatar-progression-hotfix-v551.js",
  "await window.SalitaAvatarHotfixReady",
  "await loadScript(\"migration\"",
  "await loadScript(\"collection\"",
  "await loadScript(\"weekly\"",
  "await loadScript(\"level\"",
  "await loadScript(\"unlock\"",
  "await loadScript(\"sharing\"",
  "Version 5.5.1 · Avatar Progression fixes"
], "Ordered avatar loader");
const loaderOrder = [
  "await window.SalitaAvatarHotfixReady",
  'await loadScript("migration"',
  'await loadScript("collection"',
  'await loadScript("weekly"',
  'await loadScript("level"',
  'await loadScript("unlock"',
  'await loadScript("sharing"'
].map(marker => loader.indexOf(marker));
if (loaderOrder.some(index => index < 0) || loaderOrder.some((index, position) => position && index <= loaderOrder[position - 1])) {
  fail("Avatar hotfix, migration and feature runtimes are not loaded in a deterministic order");
}

const levelSource = read("level-avatar-rewards-v1.js");
requireMarkers(levelSource, [
  "repairFutureMilestones",
  "falseLevels",
  "repairedFutureLevels",
  "weeklyEvidence",
  "!window.__salitaQuestLevelProgressionV2Installed",
  "initial_safe_sync",
  "placement_complete",
  "__salitaQuestLevelAvatarRewardsV2Installed"
], "Safe level milestone runtime");

const unlockSource = read("avatar-unlock-celebration-v1.js");
requireMarkers(unlockSource, [
  "let finishing = false",
  "if (!playing || finishing) return",
  "saveCompletion(pendingEntry,item)",
  "if (useFlight) await flyToCollection(item)",
  "entryKey",
  "profile.avatarUnlockHistory.some",
  "__salitaQuestAvatarUnlockCelebrationV2Installed"
], "Once-only unlock runtime");
if (unlockSource.indexOf("saveCompletion(pendingEntry,item)") > unlockSource.indexOf("if (useFlight) await flyToCollection(item)")) {
  fail("Unlock completion must persist before the collection flight begins");
}

const worker = read("service-worker.js");
requireMarkers(worker, [
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-5-avatar-progression-r43"',
  'const CACHE_NAME = "salita-quest-v5-5-1-avatar-hotfix-r44"',
  '"./avatar-progression-hotfix-v551.js"',
  '"./avatar-progression-hotfix-v551.css"',
  'caches.match(event.request, {ignoreSearch:true})'
], "5.5.1 offline release");

const catalogueSource = read("avatar-catalogue-v1.js");
const levelSandbox = {};
vm.createContext(levelSandbox);
vm.runInContext(catalogueSource, levelSandbox, {filename:"avatar-catalogue-v1.js"});
vm.runInContext(levelSource, levelSandbox, {filename:"level-avatar-rewards-v1.js"});
const model = levelSandbox.SalitaAvatarModel;
const levelLogic = levelSandbox.SalitaLevelAvatarRewardLogic;
if (!model || levelLogic?.version !== 2) fail("Level reward logic v2 did not initialise");
if (levelLogic.applyMilestoneRewards(9, {}, model).awarded.length !== 0) fail("Level 9 must not award a milestone avatar");
const levelTen = levelLogic.applyMilestoneRewards(10, {}, model);
if (levelTen.awarded.length !== 1 || levelTen.awarded[0].avatarId !== "narra") fail("Level 10 must award Narra exactly once");
const falseProfile = {
  avatarId:"anahaw",
  avatarCollection:{
    equippedAvatarId:"anahaw",
    ownedAvatarIds:["anahaw","narra","nipa_palm"],
    shards:{narra:100,nipa_palm:100},
    levelRewardsClaimed:[10,20],
    pendingUnlocks:[
      {avatarId:"narra",source:"level_milestone",level:10},
      {avatarId:"nipa_palm",source:"level_milestone",level:20}
    ]
  },
  avatarMilestoneRewards:{claims:{10:{avatarId:"narra"},20:{avatarId:"nipa_palm"}}}
};
const repaired = levelLogic.repairFutureMilestones(falseProfile, 1, model);
if (!repaired.changed || falseProfile.avatarCollection.levelRewardsClaimed.length !== 0) fail("Premature milestone claims were not repaired");
if (falseProfile.avatarCollection.ownedAvatarIds.includes("narra") || falseProfile.avatarCollection.ownedAvatarIds.includes("nipa_palm")) {
  fail("Falsely awarded future avatars were not removed");
}

const unlockSandbox = {};
vm.createContext(unlockSandbox);
vm.runInContext(catalogueSource, unlockSandbox, {filename:"avatar-catalogue-v1.js"});
vm.runInContext(unlockSource, unlockSandbox, {filename:"avatar-unlock-celebration-v1.js"});
const unlockLogic = unlockSandbox.SalitaAvatarUnlockCelebrationLogic;
if (unlockLogic?.version !== 2) fail("Unlock celebration logic v2 did not initialise");
const duplicatePending = {
  equippedAvatarId:"anahaw",
  ownedAvatarIds:["anahaw","narra"],
  shards:{narra:100},
  pendingUnlocks:[
    {avatarId:"narra",source:"level_milestone",level:10,animationSeen:false},
    {avatarId:"narra",source:"level_milestone",level:10,animationSeen:false}
  ]
};
const first = unlockLogic.nextPending(duplicatePending, unlockSandbox.SalitaAvatarModel);
const consumed = unlockLogic.consumePending(duplicatePending, first, unlockSandbox.SalitaAvatarModel);
if (!consumed.consumed || consumed.collection.pendingUnlocks.length !== 0) fail("Duplicate unlock entries were not consumed together");

console.log("Avatar Progression 5.5.1 hotfix validation passed: artwork recovery, stable cards, Collections navigation, collectible starters, safe level rewards and once-only unlocks.");