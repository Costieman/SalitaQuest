import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

for (const file of ["weekly-avatar-chest.js", "weekly-avatar-polish.js", "clean-topbar.js", "profile-app.js", "service-worker.js"]) {
  new vm.Script(read(file), {filename:file});
}

const css = read("compact-home-dashboard.css");
for (const marker of [
  '#homeView > .hero-card',
  'display: none !important',
  '@media (min-width: 1001px)',
  '#homeView.view.active',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  '#homeView > .daily-quests-card',
  'order: 1',
  'grid-column: 1 / -1',
  '#homeView > .activity-hub',
  '#homeView > .game-dashboard',
  'display: contents',
  '#homeView .player-card',
  '#homeView .week-card',
  'order: 2',
  '@media (min-width: 1320px)',
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
  '#homeView .daily-quest-list',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  '@media (max-width: 1000px)',
  'flex-direction: column'
]) {
  if (!css.includes(marker)) fail(`Missing home-grid marker: ${marker}`);
}

const topbarCss = read("clean-topbar.css");
for (const marker of [
  'body:not(.dark-mode)',
  'background: #eef4f3',
  'body:not(.dark-mode) .mastery-rail-shell',
  'body:not(.dark-mode) #homeView > .daily-quests-card',
  'body:not(.dark-mode) #homeView .activity-tile',
  '.top-stats',
  'grid-template-columns: auto auto minmax(138px, auto)',
  '.top-stats > * + *',
  'border-left: 1px solid var(--line)',
  '.mastery-rail-shell[data-compact-mastery="true"]',
  'grid-template-columns: 190px minmax(0, 1fr) 205px',
  '.mastery-summary-compact',
  '> .mastery-milestones',
  '> .mastery-next-copy',
  '@media (min-width: 1001px) and (max-width: 1279px)',
  'grid-template-rows: auto 61px',
  '#homeView > .journey-section',
  '#homeView > .conversation-spotlight',
  '#homeView > .home-topic-review',
  '#homeView > .dashboard-grid',
  '#homeView > .achievement-panel',
  'display: none !important'
]) {
  if (!topbarCss.includes(marker)) fail(`Missing robust topbar/light-theme style: ${marker}`);
}
if (topbarCss.includes('.mastery-rail-heading {\n    display: contents')) {
  fail("The fragile display:contents mastery layout must not return");
}

const topbarRuntime = read("clean-topbar.js");
for (const marker of [
  '__salitaQuestCleanTopbarInstalled',
  'function structureMasteryShell()',
  'summary.classList.add("mastery-summary-compact")',
  'shell.insertBefore(summary, milestones)',
  'shell.insertBefore(nextCopy, milestones.nextSibling)',
  'heading.remove()',
  'shell.dataset.compactMastery = "true"',
  'renderMasteryRailWithCompactCopy',
  'World Progress · ${points} MP',
  'Next: ${regionName}',
  '${remaining} MP to go'
]) {
  if (!topbarRuntime.includes(marker)) fail(`Missing robust topbar runtime marker: ${marker}`);
}

const profileRuntime = read("profile-app.js");
for (const marker of [
  'const MIRROR_INTERVAL_MS = 1000',
  'const AUTOSAVE_INTERVAL_MS = 15000',
  'function flushCourseState(reason = "periodic")',
  'if (typeof saveState === "function") saveState()',
  'syncProgress(true)',
  'flushCourseState("learner switch")',
  'flushCourseState("course switch")',
  'window.setInterval(syncProgress, MIRROR_INTERVAL_MS)',
  'flushCourseState("periodic autosave")',
  'beforeunload',
  'pagehide',
  'visibilitychange',
  'Progress autosaves every 15 seconds and before switching.'
]) {
  if (!profileRuntime.includes(marker)) fail(`Missing reliable autosave marker: ${marker}`);
}

const appRuntime = read("app.js");
for (const marker of [
  'function renderJourney()',
  'function renderTopicReview()',
  'function renderProgress()',
  'function updateBoss()',
  'function saveState()',
  'function switchView(view)'
]) {
  if (!appRuntime.includes(marker)) fail(`Required app destination/state function is missing: ${marker}`);
}

const chestRuntime = read("weekly-avatar-chest.js");
for (const marker of [
  'const KEY_TARGET = 6',
  'REWARDS = AVATARS.flatMap',
  'claimWeeklyChest',
  'navigator.share',
  'Nothing is posted automatically'
]) {
  if (!chestRuntime.includes(marker)) fail(`Missing weekly-chest runtime marker: ${marker}`);
}

const polishRuntime = read("weekly-avatar-polish.js");
for (const marker of [
  'DAILY_QUESTS.length === 4',
  'heading.textContent = "4 small wins"',
  'weekly.pendingKeyAwards',
  'weekly.animatedKeyDates',
  'function queuePendingKeyAward',
  'function recoverMissedTodayAnimation',
  'function isHomeActive()',
  'function playPendingAwardOnHome()',
  'switchViewWithPendingKeyAward',
  'if (view === "home") schedulePendingPlayback',
  'target.classList.add("pending-key-arrival")',
  'target.textContent = ""',
  'markAwardPlayed(award)',
  'function playDailyKeyChime()',
  'window.AudioContext || window.webkitAudioContext',
  'const notes = [659.25, 783.99, 1046.5]',
  'function createCelebrationLayer(count)',
  'Daily Key earned!',
  'for (let index = 0; index < 22; index += 1)',
  'function burstImpact(target)',
  'daily-key-award-grand',
  'layer.classList.add("key-in-flight")',
  'duration:2350',
  'meter?.classList.add("key-meter-impact")',
  'chest?.classList.add("key-chest-impact")',
  'animateDailyKeyAward'
]) {
  if (!polishRuntime.includes(marker)) fail(`Missing grand Daily Key marker: ${marker}`);
}

const chestCss = read("weekly-avatar-chest.css");
for (const marker of [
  '.weekly-key-slot.pending-key-arrival',
  '@keyframes pendingKeySlot',
  '.dark-mode .weekly-key-slot.pending-key-arrival',
  '.daily-key-celebration',
  '.daily-key-celebration-banner',
  '.daily-key-spark-field',
  '.daily-key-award-grand',
  '.daily-key-impact-burst',
  '.weekly-key-meter.key-meter-impact',
  '.quest-chest.key-chest-impact',
  '@keyframes dailyKeyBanner',
  '@keyframes dailyKeySpark',
  '@keyframes dailyKeyGlow',
  '@keyframes dailyKeyImpactRing',
  '@keyframes keyMeterImpact',
  '@media(prefers-reduced-motion:reduce)'
]) {
  if (!chestCss.includes(marker)) fail(`Missing grand key celebration style: ${marker}`);
}

for (const htmlFile of ["index.html", "app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1].trim())
    .filter(Boolean);
  scripts.forEach((source, index) => new vm.Script(source, {filename:`${htmlFile}#inline-${index + 1}`}));
}

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  for (const asset of [
    'compact-home-dashboard.css?v=5.4.17',
    'weekly-avatar-chest.css?v=5.4.17',
    'clean-topbar.css?v=5.4.17',
    'ui-quality-fixes.js?v=5.4.17',
    'weekly-avatar-chest.js?v=5.4.17',
    'weekly-avatar-polish.js?v=5.4.17',
    'clean-topbar.js?v=5.4.17'
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
}

const appHtml = read("app.html");
if (!appHtml.includes('profile-app.js?v=5.4.17')) {
  fail("Tagalog loader does not load the current reliable autosave profile layer");
}

const indexHtml = read("index.html");
if (!indexHtml.includes('profile-shell.css?v=5.4.17') || !indexHtml.includes('service-worker.js?v=5.4.17')) {
  fail("Profile shell and service worker were not bumped for the grand key release");
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  '"./weekly-avatar-polish.js"',
  '"./weekly-avatar-chest.css"',
  '"./clean-topbar.js"',
  '"./clean-topbar.css"',
  '"./profile-app.js"'
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes('salita-quest-v5-4-grand-key-r30')) {
  fail("Service-worker cache name was not bumped for the grand Daily Key release");
}

console.log("Validated a grand Home-only Daily Key celebration with banner, centre-stage key, particles, chime, impact response, reduced-motion fallback, pending persistence and recovery, both language loaders, reliable autosave, and offline assets.");
