import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

for (const file of ["weekly-avatar-chest.js", "weekly-avatar-polish.js", "clean-topbar.js", "service-worker.js"]) {
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
  '.top-stats',
  'grid-template-columns: auto auto minmax(138px, auto)',
  '.top-stats > * + *',
  'border-left: 1px solid var(--line)',
  '.mastery-rail-shell',
  'grid-template-columns: 170px minmax(520px, 1fr) 200px',
  '.mastery-rail-heading',
  'display: contents',
  '.mastery-next-copy',
  '#homeView > .journey-section',
  '#homeView > .conversation-spotlight',
  '#homeView > .home-topic-review',
  '#homeView > .dashboard-grid',
  '#homeView > .achievement-panel',
  'display: none !important',
  '@media (max-width: 1000px)'
]) {
  if (!topbarCss.includes(marker)) fail(`Missing clean-topbar style: ${marker}`);
}

const topbarRuntime = read("clean-topbar.js");
for (const marker of [
  '__salitaQuestCleanTopbarInstalled',
  'renderMasteryRailWithCompactCopy',
  'World Progress · ${points} MP',
  'Next: ${regionName}',
  '${remaining} MP to go',
  'All regions unlocked',
  'Keep building durable recall'
]) {
  if (!topbarRuntime.includes(marker)) fail(`Missing clean-topbar runtime marker: ${marker}`);
}

const appRuntime = read("app.js");
for (const marker of [
  'function renderJourney()',
  'function renderTopicReview()',
  'function renderProgress()',
  'function updateBoss()'
]) {
  if (!appRuntime.includes(marker)) fail(`Dedicated destination is missing from app.js: ${marker}`);
}

const chestRuntime = read("weekly-avatar-chest.js");
for (const marker of [
  'const KEY_TARGET = 6',
  'const AVATARS = [',
  '{id:"tarsier"',
  '{id:"eagle"',
  '{id:"tamaraw"',
  '{id:"peacock"',
  '{id:"orchid"',
  '{id:"jade"',
  '{id:"rafflesia"',
  '{id:"anahaw"',
  '{id:"sunrise"',
  '{id:"islands"',
  '{id:"midnight"',
  'REWARDS = AVATARS.flatMap',
  'weekly.keyDates',
  'weekly.claims',
  'weekly.unlockedRewards',
  'grantDailyKey',
  'chooseWeeklyReward',
  'claimWeeklyChest',
  'Six Daily Keys collected',
  'navigator.share',
  'navigator.canShare',
  'canvas.toBlob',
  'Share social card',
  'Nothing is posted automatically'
]) {
  if (!chestRuntime.includes(marker)) fail(`Missing weekly-chest runtime marker: ${marker}`);
}

const polishRuntime = read("weekly-avatar-polish.js");
for (const marker of [
  'DAILY_QUESTS.length === 4',
  'heading.textContent = "4 small wins"',
  'allFourWinsComplete',
  'removePrematureTodayKey',
  'animateDailyKeyAward',
  'daily-key-award',
  'key-arrival',
  'after > before',
  'renderDailyQuestsWithFourWinsHeading'
]) {
  if (!polishRuntime.includes(marker)) fail(`Missing daily-key polish marker: ${marker}`);
}

const chestCss = read("weekly-avatar-chest.css");
for (const marker of [
  '.weekly-key-meter',
  'grid-template-columns:repeat(6',
  '.daily-key-award',
  '.daily-key-award::after',
  '.weekly-key-slot.key-arrival',
  '.quest-chest.weekly-ready',
  '.weekly-avatar-modal',
  '.weekly-avatar-preview',
  '@keyframes weeklyChestReady',
  '@keyframes keySlotArrival',
  '@media(prefers-reduced-motion:reduce)'
]) {
  if (!chestCss.includes(marker)) fail(`Missing weekly-chest style: ${marker}`);
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
    'compact-home-dashboard.css?v=5.4.14',
    'weekly-avatar-chest.css?v=5.4.14',
    'clean-topbar.css?v=5.4.14',
    'ui-quality-fixes.js?v=5.4.14',
    'weekly-avatar-chest.js?v=5.4.14',
    'weekly-avatar-polish.js?v=5.4.14',
    'clean-topbar.js?v=5.4.14'
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
  const qualityIndex = html.indexOf('ui-quality-fixes.js?v=5.4.14');
  const chestIndex = html.indexOf('weekly-avatar-chest.js?v=5.4.14');
  const polishIndex = html.indexOf('weekly-avatar-polish.js?v=5.4.14');
  const topbarIndex = html.indexOf('clean-topbar.js?v=5.4.14');
  if (!(qualityIndex >= 0 && qualityIndex < chestIndex && chestIndex < polishIndex && polishIndex < topbarIndex)) {
    fail(`${htmlFile} must load quick-review quests, weekly rewards, and the clean topbar in dependency order`);
  }
}

const indexHtml = read("index.html");
if (!indexHtml.includes('profile-shell.css?v=5.4.14') || !indexHtml.includes('service-worker.js?v=5.4.14')) {
  fail("Profile shell and service worker were not bumped to version 5.4.14");
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  '"./compact-home-dashboard.css"',
  '"./weekly-avatar-chest.js"',
  '"./weekly-avatar-polish.js"',
  '"./weekly-avatar-chest.css"',
  '"./clean-topbar.js"',
  '"./clean-topbar.css"'
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes('salita-quest-v5-4-clean-topbar-r27')) {
  fail("Service-worker cache name was not bumped for the clean-topbar release");
}

console.log("Validated segmented stats, compact single-row world progress, focused Home content, dedicated map/review/conversation/progress destinations, four small wins, weekly avatar rewards, both language loaders, and offline assets.");
