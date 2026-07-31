import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), "utf8");
const fail = message => { throw new Error(message); };

const source = read("weekly-avatar-shard-rewards-v1.js");
const css = read("weekly-avatar-shard-rewards-v1.css");
const loader = read("profile-emblem-control.js");

new vm.Script(source, {filename:"weekly-avatar-shard-rewards-v1.js"});
new vm.Script(loader, {filename:"profile-emblem-control.js"});

for (const required of [
  "const KEY_TARGET = 6",
  'new Set(["common", "uncommon", "rare"])',
  "model.weeklyShardAward(item.rarity)",
  "data-weekly-avatar-target",
  "No avatar is selected randomly",
  "weekly.claims[weekKey]",
  "profile.avatarWeeklyRewards",
  "collection.pendingUnlocks.push",
  "salita:avatar-collection-changed",
  "stopImmediatePropagation",
  "migratedLegacy:true"
]) {
  if (!source.includes(required)) fail(`Weekly reward runtime is missing ${required}`);
}

if (/Math\.random|randomIndex|chooseWeeklyReward/.test(source)) {
  fail("Weekly avatar rewards must not use random assignment");
}

for (const required of [
  "Common</strong> +100 · 1 week",
  "Uncommon</strong> +50 · 2 weeks",
  "Rare</strong> +25 · 4 weeks",
  "Complete all four Daily Quests",
  "account-wide key"
]) {
  if (!source.includes(required)) fail(`Weekly reward copy is missing ${required}`);
}

for (const required of [
  ".weekly-avatar-target-grid",
  ".weekly-avatar-target-grey",
  "filter:grayscale(1)",
  "clip-path:inset(var(--weekly-mask-top,100%) 0 0 0)",
  "@media(max-width:700px)"
]) {
  if (!css.includes(required)) fail(`Weekly reward styles are missing ${required}`);
}

if (!loader.includes("weekly-avatar-shard-rewards-v1.css?v=5.5.0")) {
  fail("Shared profile runtime does not load weekly shard reward styles");
}
if (!loader.includes("weekly-avatar-shard-rewards-v1.js?v=5.5.0")) {
  fail("Shared profile runtime does not load weekly shard reward logic");
}

console.log("Weekly avatar reward validation passed: six account-wide keys, free target choice, 100/50/25 shards, no randomness and safe legacy migration.");
