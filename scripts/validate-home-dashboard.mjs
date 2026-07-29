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
  'function saveState()'
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
  'animateDailyKeyAward'
]) {
  if (!polishRuntime.includes(marker)) fail(`Missing daily-key polish marker: ${marker}`);
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
    'compact-home-dashboard.css?v=5.4.15',
    'weekly-avatar-chest.css?v=5.4.15',
    'clean-topbar.css?v=5.4.15',
    'ui-quality-fixes.js?v=5.4.15',
    'weekly-avatar-chest.js?v=5.4.15',
    'weekly-avatar-polish.js?v=5.4.15',
    'clean-topbar.js?v=5.4.15'
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
}

const appHtml = read("app.html");
if (!appHtml.includes('profile-app.js?v=5.4.15')) {
  fail("Tagalog loader does not load the reliable autosave profile layer");
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  '"./clean-topbar.js"',
  '"./clean-topbar.css"',
  '"./profile-app.js"'
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes('salita-quest-v5-4-layout-autosave-r28')) {
  fail("Service-worker cache name was not bumped for the layout/autosave release");
}

console.log("Validated non-overlapping mastery structure, improved light-mode separation, segmented stats, focused Home content, 15-second forced autosave, immediate mirroring, saves before learner/course transitions, both language loaders, and offline assets.");
