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
  "weekly-avatar-chest.js",
  "weekly-avatar-polish.js",
  "clean-topbar.js",
  "profile-app.js",
  "mobile-session-refinement.js",
  "service-worker.js"
]) new vm.Script(read(file), {filename:file});

const homeCss = read("compact-home-dashboard.css");
requireMarkers(homeCss, [
  '#homeView > .hero-card',
  'display: none !important',
  '#homeView.view.active',
  '#homeView > .daily-quests-card',
  '#homeView > .activity-hub',
  '#homeView > .game-dashboard',
  '#homeView .daily-quest-list',
  '@media (max-width: 1000px)'
], "Compact Home dashboard");

const topbarCss = read("clean-topbar.css");
requireMarkers(topbarCss, [
  'body:not(.dark-mode)',
  '.top-stats',
  '.mastery-rail-shell[data-compact-mastery="true"]',
  '.mastery-summary-compact',
  '#homeView > .journey-section',
  'display: none !important'
], "Top bar and focused Home styling");

const topbar = read("clean-topbar.js");
requireMarkers(topbar, [
  'function structureMasteryShell()',
  'summary.classList.add("mastery-summary-compact")',
  'shell.dataset.compactMastery = "true"',
  'World Progress · ${points} MP',
  'Next: ${regionName}',
  '${remaining} MP to go'
], "Top bar runtime");

const profile = read("profile-app.js");
requireMarkers(profile, [
  'const MIRROR_INTERVAL_MS = 1000',
  'const AUTOSAVE_INTERVAL_MS = 15000',
  'function flushCourseState(reason = "periodic")',
  'flushCourseState("learner switch")',
  'flushCourseState("course switch")',
  'beforeunload',
  'pagehide',
  'visibilitychange'
], "Profile autosave");

const keyAnimation = read("weekly-avatar-polish.js");
requireMarkers(keyAnimation, [
  'DAILY_QUESTS.length === 4',
  'function playPendingAwardOnHome()',
  'if (view === "home") schedulePendingPlayback',
  'Daily Key earned!',
  'daily-key-award-grand',
  'duration:2350'
], "Home-only Daily Key celebration");

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  requireMarkers(html, [
    'compact-home-dashboard.css?v=5.4.21',
    'weekly-avatar-chest.css?v=5.4.21',
    'clean-topbar.css?v=5.4.21',
    'weekly-avatar-polish.js?v=5.4.21'
  ], `${htmlFile} Home release assets`);
}
if (!/profile-app\.js\?v=(?:5\.4\.21|5\.5\.2|5\.5\.3)/.test(read("app.html"))) {
  fail("Tagalog does not load the shared profile runtime directly.");
}
if (!read("bisaya-app-loader.js").includes('loadScript("./profile-app.js')) fail("Bisaya does not load the shared profile runtime through its course loader.");

const index = read("index.html");
requireMarkers(index, [
  'profile-shell.css?v=5.4.25',
  'service-worker.js?v=5.4.29'
], "Profile gate release");

const serviceWorker = read("service-worker.js");
requireMarkers(serviceWorker, [
  'const CACHE_NAME = "salita-quest-',
  '"./weekly-avatar-polish.js"',
  '"./weekly-avatar-chest.css"',
  '"./clean-topbar.js"',
  '"./profile-app.js"'
], "Home offline release");

console.log("Validated the focused Home dashboard, compact World Progress header, reliable profile autosave in both course architectures, Home-only Daily Key celebration, and current offline release.");
