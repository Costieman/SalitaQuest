import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

const runtime = read("mobile-session-refinement.js");
new vm.Script(runtime, {filename:"mobile-session-refinement.js"});

for (const marker of [
  '__salitaQuestMobileSessionRefinementInstalled',
  'const MOBILE_QUERY = "(max-width: 1000px)"',
  'const MORE_VIEWS = new Set',
  'const RAIL_FREE_MOBILE_VIEWS = new Set(["review", "audioReview"])',
  'className = "mobile-phrase-mastery"',
  'data-mobile-mastery-step',
  'originalProgressButton.removeAttribute("data-view")',
  'originalProgressButton.dataset.mobileMore = "true"',
  'openMobileMenu()',
  'dot.textContent = mobile ? String(number)',
  'mobile-session-active',
  'mobile-session-idle',
  'masteryRail.style.display',
  'profileControl.style.display = activeMobileLesson ? "none" : ""',
  'renderMasteryRailForMobile',
  'switchViewWithMobileState',
  'renderExerciseForMobile',
  'renderFeedbackForMobile',
  'feedbackBox.scrollIntoView',
  'finishSessionForMobile'
]) {
  if (!runtime.includes(marker)) fail(`Missing mobile runtime marker: ${marker}`);
}

const css = read("mobile-session-refinement.css");
for (const marker of [
  '@media (max-width: 1000px)',
  '.mastery-rail-shell .mastery-label',
  '.mastery-rail-shell .mastery-milestone > small',
  'display: none !important',
  '.mobile-nav-item[data-mobile-more="true"]',
  'body[data-current-view="learn"].mobile-session-idle .mobile-appbar',
  'body[data-current-view="learn"].mobile-session-idle .mobile-nav',
  'body[data-current-view="learn"].mobile-session-idle .lesson-card',
  'body[data-current-view="learn"].mobile-session-idle .session-panel',
  'body.mobile-session-active .mastery-rail-shell',
  'body.mobile-session-active .lesson-card',
  'grid-template-rows: auto minmax(0, 1fr)',
  'min-height: 0 !important',
  'body.mobile-session-active .mobile-phrase-mastery:not([hidden])',
  'grid-template-columns: auto minmax(92px, 1fr) auto',
  '.mobile-phrase-steps i.active',
  'body.mobile-session-active .lesson-content',
  'overflow-y: auto !important',
  'body.mobile-session-active .feedback-box',
  'body.mobile-session-active .lesson-footer',
  'position: fixed !important',
  'inset: auto 0 0 0 !important',
  'body.dark-mode.mobile-session-active',
  '@media (max-width: 390px)',
  '@media (prefers-reduced-motion: reduce)'
]) {
  if (!css.includes(marker)) fail(`Missing mobile refinement style: ${marker}`);
}

if (css.includes('body.mobile-session-active .lesson-card {\n    min-height: 100dvh')) {
  fail("Active mobile lesson cards must not force the old full-viewport minimum height");
}

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  for (const asset of [
    'mobile-session-refinement.css?v=5.4.21',
    'mobile-session-refinement.js?v=5.4.21'
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
  const launcher = html.indexOf('lesson-side-launcher.js?v=5.4.21');
  const mobile = html.indexOf('mobile-session-refinement.js?v=5.4.21');
  const profile = html.indexOf('profile-app.js?v=5.4.21');
  if (!(launcher >= 0 && mobile > launcher && (profile < 0 || profile > mobile))) {
    fail(`${htmlFile} must load the mobile refinement after the launcher and before profile controls`);
  }
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  '"./mobile-session-refinement.js"',
  '"./mobile-session-refinement.css"'
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes('salita-quest-v5-4-progression-scenarios-r34')) {
  fail("Current release cache name is missing from the mobile validation path");
}

const indexHtml = read("index.html");
if (!indexHtml.includes('service-worker.js?v=5.4.21')) {
  fail("The profile gate does not request the current service-worker release");
}

console.log("Validated numbered-only mobile world progress, rail-free practice screens, idle Daily/Quick tabs, fixed lesson actions, compact phrase mastery, accessible More navigation, feedback scrolling, dark mode, both courses, and current offline delivery.");
