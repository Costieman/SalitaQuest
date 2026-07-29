import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

for (const file of ["weekly-avatar-chest.js", "weekly-avatar-polish.js", "service-worker.js"]) {
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
    'compact-home-dashboard.css?v=5.4.13',
    'weekly-avatar-chest.css?v=5.4.13',
    'ui-quality-fixes.js?v=5.4.13',
    'weekly-avatar-chest.js?v=5.4.13',
    'weekly-avatar-polish.js?v=5.4.13'
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
  const qualityIndex = html.indexOf('ui-quality-fixes.js?v=5.4.13');
  const chestIndex = html.indexOf('weekly-avatar-chest.js?v=5.4.13');
  const polishIndex = html.indexOf('weekly-avatar-polish.js?v=5.4.13');
  if (!(qualityIndex >= 0 && qualityIndex < chestIndex && chestIndex < polishIndex)) {
    fail(`${htmlFile} must load quick-review quests before the weekly chest and its polish layer`);
  }
}

const indexHtml = read("index.html");
if (!indexHtml.includes('profile-shell.css?v=5.4.13') || !indexHtml.includes('service-worker.js?v=5.4.13')) {
  fail("Profile shell and service worker were not bumped to version 5.4.13");
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  '"./compact-home-dashboard.css"',
  '"./weekly-avatar-chest.js"',
  '"./weekly-avatar-polish.js"',
  '"./weekly-avatar-chest.css"'
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes('salita-quest-v5-4-weekly-avatar-r26')) {
  fail("Service-worker cache name was not bumped for the weekly-avatar release");
}

console.log("Validated hero removal, Daily Quests first, responsive nine-card home grid, four small wins, one key per fully completed day, six-key weekly chest, random collectible avatars, animated key delivery, privacy-safe social sharing, both language loaders, and offline assets.");
