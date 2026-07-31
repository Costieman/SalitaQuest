import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const catalogueSource = read("avatar-catalogue-v1.js");
const migrationSource = read("avatar-progression-migration-v1.js");
const loaderSource = read("profile-emblem-control.js");
const workerSource = read("service-worker.js");
const releaseNotes = read("docs/releases/5.5.0-avatar-progression.md");

new vm.Script(migrationSource, {filename:"avatar-progression-migration-v1.js"});
new vm.Script(loaderSource, {filename:"profile-emblem-control.js"});
new vm.Script(workerSource, {filename:"service-worker.js"});

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(catalogueSource, sandbox, {filename:"avatar-catalogue-v1.js"});
vm.runInContext(migrationSource, sandbox, {filename:"avatar-progression-migration-v1.js"});

const model = sandbox.SalitaAvatarModel;
const migration = sandbox.SalitaAvatarProgressionMigration;
if (!model || model.catalogue.length !== 48) fail("The release requires all 48 catalogue avatars");
if (!migration || migration.version !== 1) fail("Avatar migration v1 did not initialise");

class MemoryStorage {
  constructor(entries = {}) { this.values = new Map(Object.entries(entries)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const profileStoreKey = "salitaQuestLocalProfilesV1";
const profileId = "learner-1";
const tagalogKey = `salitaQuestProgress.profile.${profileId}.tagalog`;
const legacyKey = `salitaQuestProgress.profile.${profileId}`;
const cebuanoKey = `salitaQuestProgress.profile.${profileId}.cebuano`;
const now = "2026-07-31T02:45:00.000Z";

const tagalogProgress = {
  weeklyAvatarChest:{
    keyDates:["2026-07-20", "2026-07-21", "2026-07-22"],
    claims:{
      "2026-07-20":{
        rewardId:"tarsier-sunrise",
        claimedAt:"2026-07-26T00:00:00.000Z",
        keyDates:["2026-07-20", "2026-07-21"]
      }
    },
    unlockedRewards:["tamaraw-midnight"]
  }
};
const cebuanoProgress = {
  weeklyAvatarChest:{
    keyDates:["2026-07-23", "2026-07-24"],
    claims:{
      "2026-07-27":{
        rewardId:"eagle-islands",
        claimedAt:"2026-07-27T00:00:00.000Z",
        keyDates:["2026-07-23", "2026-07-24"]
      }
    }
  }
};

const storage = new MemoryStorage({
  [profileStoreKey]:JSON.stringify({
    schemaVersion:1,
    profiles:[{id:profileId, name:"Test learner", avatarId:"orchid"}]
  }),
  [tagalogKey]:JSON.stringify(tagalogProgress),
  [legacyKey]:JSON.stringify(tagalogProgress),
  [cebuanoKey]:JSON.stringify(cebuanoProgress)
});

const first = migration.migrateStorage(storage, model, now);
if (!first.changed || first.profilesMigrated !== 1) fail("The legacy profile was not migrated");
const migratedStore = JSON.parse(storage.getItem(profileStoreKey));
const profile = migratedStore.profiles[0];

if (profile.avatarCollection.equippedAvatarId !== "orchid") fail("Existing equipped avatar was not preserved");
for (const avatarId of ["orchid", "tarsier", "tamaraw", "eagle"]) {
  if (!profile.avatarCollection.ownedAvatarIds.includes(avatarId)) fail(`Legacy ownership was not preserved for ${avatarId}`);
}
for (const avatarId of ["tarsier", "tamaraw", "eagle"]) {
  if (profile.avatarCollection.shards[avatarId] !== 100) fail(`Legacy avatar ${avatarId} must be complete`);
}
if (Object.keys(profile.avatarWeeklyRewards.claims).length !== 2) fail("Legacy weekly claims were not merged account-wide");
if (profile.avatarWeeklyRewards.keyDates.length !== 5) fail("Tagalog and Cebuano key histories were not merged");
if (!profile.avatarWeeklyRewards.claims["2026-07-20"].migratedLegacy) fail("Migrated claims must be marked legacy");
if (profile.avatarProgressionMigration.version !== 1) fail("Migration metadata was not recorded");
if (!profile.avatarProgressionMigration.sourceStatesPreserved) fail("Migration must declare that source states remain preserved");

if (storage.getItem(tagalogKey) !== JSON.stringify(tagalogProgress)) fail("Tagalog source progress was modified");
if (storage.getItem(legacyKey) !== JSON.stringify(tagalogProgress)) fail("Legacy Tagalog source progress was modified");
if (storage.getItem(cebuanoKey) !== JSON.stringify(cebuanoProgress)) fail("Cebuano source progress was modified");

const snapshot = storage.getItem(profileStoreKey);
const repeated = migration.migrateStorage(storage, model, now);
if (repeated.changed || storage.getItem(profileStoreKey) !== snapshot) fail("Migration must be idempotent");

const migrationIndex = loaderSource.indexOf("loadAvatarMigrationAssets();");
const collectionIndex = loaderSource.indexOf("loadAvatarCollectionAssets();");
const weeklyIndex = loaderSource.indexOf("loadWeeklyAvatarRewardAssets();");
if (migrationIndex < 0 || migrationIndex > collectionIndex || migrationIndex > weeklyIndex) {
  fail("Migration must load before collection and weekly reward runtimes");
}
if (!loaderSource.includes("script.async = false")) fail("Avatar release scripts must preserve loading order");
if (!loaderSource.includes('Version 5.5.0 · Avatar Progression')) fail("Tagalog release label is missing");
if (!loaderSource.includes('Avatar Collection 5.5')) fail("Bisaya release label is missing");

if (!workerSource.includes('salita-quest-v5-5-avatar-progression-r43')) fail("Service-worker cache version is incorrect");
if (!workerSource.includes('caches.match(event.request, {ignoreSearch:true})')) fail("Offline matching must ignore release query strings");
for (const file of [
  "avatar-catalogue-v1.js",
  "avatar-progression-migration-v1.js",
  "avatar-collection-screen-v1.js",
  "weekly-avatar-shard-rewards-v1.js",
  "level-avatar-rewards-v1.js",
  "avatar-unlock-celebration-v1.js",
  "achievement-sharing-avatar-bridge-v1.js",
  "avatars/rare-animals-set2-sprite.png"
]) {
  if (!workerSource.includes(`./${file}`)) fail(`Offline cache is missing ${file}`);
}
for (const avatar of model.catalogue) {
  if (!workerSource.includes(`./${avatar.image}`)) fail(`Offline cache is missing ${avatar.image}`);
}

for (const required of [
  "Salita Quest 5.5.0 — Avatar Progression",
  "No avatar is assigned randomly",
  "never deletes or rewrites the original course-progress JSON",
  "salita-quest-v5-5-avatar-progression-r43"
]) {
  if (!releaseNotes.includes(required)) fail(`Release notes are missing: ${required}`);
}

console.log("Salita Quest 5.5.0 release validation passed: additive migration, preserved legacy rewards, deterministic loading, complete offline avatar cache and release metadata.");
