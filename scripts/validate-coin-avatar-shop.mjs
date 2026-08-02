import fs from "node:fs";
import vm from "node:vm";

const read = path => fs.readFileSync(path,"utf8");
const shop = read("coin-avatar-shard-shop-v1.js");
const badges = read("coin-avatar-shop-badges-v1.js");
const loader = read("profile-emblem-control.js");
const weekly = read("weekly-avatar-shard-rewards-v1.js");

for (const [name,source] of [["shop",shop],["badges",badges],["loader",loader]]) {
  new vm.Script(source,{filename:name});
}

const required = [
  [shop,"common:{cost:1000"],[shop,"uncommon:{cost:2000"],[shop,"rare:{cost:4000"],
  [shop,"const SHARDS_PER_PACK = 25"],[shop,"Math.floor(Math.random() * pool.length)"],
  [shop,"!account.collection.ownedAvatarIds.includes(item.id)"],
  [loader,"coin-avatar-shard-shop-v1.js"],[loader,"coin-avatar-shop-badges-v1.js"],
  [badges,"lt_coins_500000"],[badges,"lt_coins_1000000"],
  [badges,"chain(\"coins_spent\""],[badges,"chain(\"packs\""],
  [badges,"chain(\"common_owned\""],[badges,"chain(\"uncommon_owned\""],[badges,"chain(\"rare_owned\""]
];
for (const [source,token] of required) if (!source.includes(token)) throw new Error(`Missing required token: ${token}`);

if (!weekly.includes("const KEY_TARGET = 6")) throw new Error("Weekly key target changed");
if (!weekly.includes("Rewards are never assigned randomly")) throw new Error("Weekly targeted-choice rule changed");
if (!weekly.includes("model.weeklyShardAward")) throw new Error("Weekly rarity award logic changed");
if (shop.includes("avatarWeeklyRewards") || shop.includes("KEY_TARGET")) throw new Error("Coin shop must not mutate weekly key rewards");

console.log("Coin avatar shard shop validation passed.");