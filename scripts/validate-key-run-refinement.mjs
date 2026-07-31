import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source, markers, label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

for (const file of [
  "daily-goal-refinement.js",
  "key-run-refinement.js",
  "even-progress-rail.js",
  "profile-emblem-control.js",
  "service-worker.js"
]) new vm.Script(read(file), {filename:file});

const goals = read("daily-goal-refinement.js");
requireMarkers(goals, [
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
], "Daily Quest refinement");
if (goals.includes("checkAnswerWithQuickItemTracking") || goals.includes("after - before")) {
  fail("Quick Review items must be counted through recordDailyAnswer, not the stale checkAnswer wrapper.");
}

const keyRun = read("key-run-refinement.js");
requireMarkers(keyRun, [
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
], "Six-key run");
if (keyRun.includes("this week") || keyRun.includes("currentWeekKey")) {
  fail("The key-run layer must not use calendar-week language or grouping.");
}

const rail = read("even-progress-rail.js");
requireMarkers(rail, [
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
], "World Progress rail");

const emblem = read("profile-emblem-control.js");
requireMarkers(emblem, [
  ".sq-profile-control",
  ".sidebar .brand-mark",
  ".mobile-brand-mark",
  "sq-profile-emblem-trigger",
  "originalButton.click()",
  "positionMenu(anchor)",
  "Open learner menu"
], "Profile emblem control");

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  requireMarkers(html, [
    "daily-goal-refinement.js?v=5.4.21",
    "key-run-refinement.js?v=5.4.21",
    "even-progress-rail.js?v=5.4.21"
  ], `${htmlFile} key-run assets`);
  if (!/profile-emblem-control\.css\?v=(?:5\.4\.21|5\.5\.2|5\.5\.3|5\.5\.4)/.test(html)) {
    fail(`${htmlFile} key-run assets is missing the profile emblem styles.`);
  }
  if (!/profile-emblem-control\.js\?v=(?:5\.4\.21|5\.5\.2|5\.5\.3|5\.5\.4)/.test(html)) {
    fail(`${htmlFile} key-run assets is missing the profile emblem runtime.`);
  }
  const dailyIndex = html.indexOf("daily-goal-refinement.js?v=5.4.21");
  const chestIndex = html.indexOf("weekly-avatar-chest.js?v=5.4.21");
  const keyRunIndex = html.indexOf("key-run-refinement.js?v=5.4.21");
  const polishIndex = html.indexOf("weekly-avatar-polish.js?v=5.4.21");
  if (!(dailyIndex >= 0 && dailyIndex < chestIndex && chestIndex < keyRunIndex && keyRunIndex < polishIndex)) {
    fail(`${htmlFile} has an invalid Daily Quest → chest → key-run → animation order.`);
  }
}

const serviceWorker = read("service-worker.js");
requireMarkers(serviceWorker, [
  'const CACHE_NAME = "salita-quest-',
  '"./daily-goal-refinement.js"',
  '"./key-run-refinement.js"',
  '"./even-progress-rail.js"',
  '"./profile-emblem-control.js"'
], "Key-run offline release");

console.log("Validated repaired cumulative Quick Review counting, harder Daily Quests, six consecutive Daily Keys, learner-avatar menus, even mastery nodes, both course loaders, and offline assets.");
