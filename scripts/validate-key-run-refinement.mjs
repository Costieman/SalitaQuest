import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

for (const file of [
  "daily-goal-refinement.js",
  "key-run-refinement.js",
  "even-progress-rail.js",
  "profile-emblem-control.js",
  "service-worker.js"
]) {
  new vm.Script(read(file), {filename:file});
}

const goals = read("daily-goal-refinement.js");
for (const marker of [
  "Finish one Daily Session",
  "Get 15 answers right",
  "Complete 15 Quick Review items",
  "quickReviewItems",
  "dailySessions",
  'session?.mode === "quick"',
  'session?.mode === "daily"',
  "recordDailyAnswerWithQuickItemTracking",
  "baseRecordDailyAnswer.apply(this, arguments)",
  "questProgress(quest) >= quest.target"
]) {
  if (!goals.includes(marker)) fail(`Missing harder Daily Quest marker: ${marker}`);
}
if (goals.includes("checkAnswerWithQuickItemTracking") || goals.includes("after - before")) {
  fail("Quick Review items must be counted through recordDailyAnswer, not the stale checkAnswer wrapper.");
}

const keyRun = read("key-run-refinement.js");
for (const marker of [
  "__salitaQuestWeeklyAvatarPolishInstalled = true",
  "const KEY_TARGET = 6",
  "function currentRunDates()",
  "dayDistance(latest, todayDateKey()) > 1",
  "keyRunClaims",
  "Six-key chest ready!",
  "Six Daily Keys in a row collected",
  "Missing a day resets the current run",
  'data-key-run-action="open"',
  "claimKeyRunChest",
  "pendingKeyAwards",
  "keys in a row",
  "Share social card",
  "navigator.share"
]) {
  if (!keyRun.includes(marker)) fail(`Missing six-key run marker: ${marker}`);
}
if (keyRun.includes("this week") || keyRun.includes("currentWeekKey")) {
  fail("The new key-run layer must not use calendar-week language or grouping.");
}

const rail = read("even-progress-rail.js");
for (const marker of [
  "renderMasteryRailWithEvenMilestones",
  "(index + 1) / count * 100",
  "visualProgress(points, milestones)",
  "previousUnlock",
  "nextUnlock",
  "progress-complete",
  "progress-approaching",
  "progress-future",
  "dot.textContent = String(number)",
  'host.dataset.evenSpacing = "true"'
]) {
  if (!rail.includes(marker)) fail(`Missing evenly-spaced rail marker: ${marker}`);
}

const emblem = read("profile-emblem-control.js");
for (const marker of [
  ".sq-profile-control",
  ".sidebar .brand-mark",
  ".mobile-brand-mark",
  "sq-profile-emblem-trigger",
  "originalButton.click()",
  "positionMenu(anchor)",
  "Open learner menu"
]) {
  if (!emblem.includes(marker)) fail(`Missing profile-emblem marker: ${marker}`);
}

const emblemCss = read("profile-emblem-control.css");
for (const marker of [
  ".sq-profile-control > .sq-profile-button",
  "display: none !important",
  ".sq-profile-control > .sq-profile-menu",
  "position: fixed !important",
  ".sq-profile-emblem-trigger img",
  ".sidebar .brand-mark.sq-profile-emblem-trigger",
  ".mobile-brand-mark.sq-profile-emblem-trigger"
]) {
  if (!emblemCss.includes(marker)) fail(`Missing profile-emblem style: ${marker}`);
}

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  for (const asset of [
    "profile-emblem-control.css?v=5.4.21",
    "daily-goal-refinement.js?v=5.4.21",
    "key-run-refinement.js?v=5.4.21",
    "even-progress-rail.js?v=5.4.21",
    "profile-emblem-control.js?v=5.4.21"
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
  const dailyIndex = html.indexOf("daily-goal-refinement.js?v=5.4.21");
  const chestIndex = html.indexOf("weekly-avatar-chest.js?v=5.4.21");
  const keyRunIndex = html.indexOf("key-run-refinement.js?v=5.4.21");
  const oldPolishIndex = html.indexOf("weekly-avatar-polish.js?v=5.4.21");
  if (!(dailyIndex >= 0 && dailyIndex < chestIndex && chestIndex < keyRunIndex && keyRunIndex < oldPolishIndex)) {
    fail(`${htmlFile} must install harder goals before the chest and the key-run layer before the retired weekly animation layer`);
  }
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  '"./daily-goal-refinement.js"',
  '"./key-run-refinement.js"',
  '"./even-progress-rail.js"',
  '"./profile-emblem-control.js"',
  '"./profile-emblem-control.css"'
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes("salita-quest-v5-4-progression-scenarios-r34")) {
  fail("Service-worker cache was not bumped for the progression and scenario release");
}

console.log("Validated learner-avatar emblem menus, evenly spaced mastery nodes with threshold-based movement, repaired cumulative Quick Review item counting, harder Daily Quests, six consecutive Daily Keys, social avatar rewards, both language loaders and offline assets.");
