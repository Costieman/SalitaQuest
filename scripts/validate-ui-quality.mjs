import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };

for (const file of ["ui-quality-fixes.js", "incorrect-order-feedback.js", "compact-desktop-layout.js", "mastery-feedback.js", "lesson-side-launcher.js", "mobile-session-refinement.js", "service-worker.js"]) {
  new vm.Script(read(file), {filename:file});
}

for (const htmlFile of ["index.html", "app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1].trim())
    .filter(Boolean);
  scripts.forEach((source, index) => new vm.Script(source, {filename:`${htmlFile}#inline-${index + 1}`}));
}

const runtime = read("ui-quality-fixes.js");
for (const marker of [
  'id: "quick_twice"',
  "quickReviews",
  "showAnswerPopWithLightFlash",
  "renderFeedbackWithWordBreakdown",
  "correct-word-breakdown",
  "Direct translation"
]) {
  if (!runtime.includes(marker)) fail(`Missing shared UI runtime marker: ${marker}`);
}

const qualityCss = read("ui-quality-fixes.css");
for (const marker of [
  "body.dark-mode .structure-box",
  "body.dark-mode .gloss-pair",
  ".choice-btn.selected",
  ".lesson-card.correct-pulse::after",
  ".answer-correct-flash"
]) {
  if (!qualityCss.includes(marker)) fail(`Missing contrast or feedback style: ${marker}`);
}

const breakdownCss = read("ui-answer-breakdown.css");
for (const marker of [
  ".correct-word-breakdown",
  ".correct-word-grid",
  ".correct-word-pair",
  "prefers-reduced-motion"
]) {
  if (!breakdownCss.includes(marker)) fail(`Missing word-breakdown style: ${marker}`);
}

const incorrectOrderRuntime = read("incorrect-order-feedback.js");
for (const marker of [
  "correctTargetTokens",
  "correctTileIds",
  "match.used = true",
  "captureSelectedTilePositions",
  "animateCorrectSentenceOrder",
  "sentenceBuilderState.selected = orderedIds",
  "tile.animate",
  "renderFeedbackWithCorrectSentenceOrder",
  "if (correct || !sentenceBuilderIsVisible()) return",
  '"Correct order"'
]) {
  if (!incorrectOrderRuntime.includes(marker)) fail(`Missing incorrect-order runtime marker: ${marker}`);
}

const incorrectOrderCss = read("incorrect-order-feedback.css");
for (const marker of [
  ".built-sentence.incorrect-order-correcting",
  ".built-sentence.correct-order-revealed",
  "data-correct-order-label",
  ".correct-order-revealed .selected-word-tile",
  "body.dark-mode .built-sentence.correct-order-revealed",
  "@keyframes incorrect-order-depart",
  "prefers-reduced-motion"
]) {
  if (!incorrectOrderCss.includes(marker)) fail(`Missing incorrect-order feedback style: ${marker}`);
}

const compactRuntime = read("compact-desktop-layout.js");
for (const marker of [
  "desktop-session-console",
  "lessonTopline.insertAdjacentElement",
  "sessionPanel.insertBefore",
  "matchMedia",
  "lesson-topline-home",
  "session-panel-home"
]) {
  if (!compactRuntime.includes(marker)) fail(`Missing desktop-console runtime marker: ${marker}`);
}

const compactCss = read("compact-desktop-layout.css");
for (const marker of [
  'body[data-current-view="learn"] .topbar',
  'body[data-current-view="learn"] .mastery-rail-shell',
  'body[data-current-view="learn"] .learn-layout',
  "grid-template-columns: minmax(0, 1fr) minmax(270px, 315px)",
  'body[data-current-view="learn"] .desktop-session-console',
  "height: 100dvh",
  "overflow: hidden",
  "position: static",
  "max-height: 800px"
]) {
  if (!compactCss.includes(marker)) fail(`Missing single-screen lesson style: ${marker}`);
}

const masteryRuntime = read("mastery-feedback.js");
for (const marker of [
  "MIN_DURABLE_GAP_MS = 3 * 24 * 60 * 60 * 1000",
  "longTermMastery",
  "longTermRecalls",
  "retentionGainForGap",
  "mastery-stage-bar",
  "long-term-mastery-card",
  "renderFeedbackWithMasteryProgress",
  "Built only by correct recall after 3+ days away."
]) {
  if (!masteryRuntime.includes(marker)) fail(`Missing mastery-feedback runtime marker: ${marker}`);
}
if (masteryRuntime.includes("12+ hours") || masteryRuntime.includes("12 hours away")) {
  fail("Long-term mastery must require a three-day gap, not twelve hours.");
}

const masteryCss = read("mastery-feedback.css");
for (const marker of [
  ".mastery-stage-bar",
  "grid-template-columns: repeat(5",
  "justify-content: center",
  ".mastery-stage-bar > span.active",
  ".mastery-stage-arrive",
  ".long-term-mastery-track",
  ".long-term-mastery-fill",
  ".long-term-mastery-card.true-mastery",
  "prefers-reduced-motion"
]) {
  if (!masteryCss.includes(marker)) fail(`Missing mastery-feedback style: ${marker}`);
}

const masteryConsoleCss = read("mastery-console-overrides.css");
for (const marker of [
  '.desktop-session-console .mastery-stage-bar',
  "grid-template-columns: repeat(5",
  ".mastery-stage-bar > span:last-child",
  "grid-column: auto !important",
  "align-items: center",
  "justify-content: center",
  ".mastery-stage-bar > span.active"
]) {
  if (!masteryConsoleCss.includes(marker)) fail(`Missing mastery-console centring style: ${marker}`);
}

const launcherRuntime = read("lesson-side-launcher.js");
for (const marker of [
  "__salitaQuestLessonSideLauncherInstalled",
  'className = "lesson-mode-launcher"',
  'data-launch-tab="daily"',
  'data-launch-tab="quick"',
  'data-start-mode="daily"',
  'data-start-mode="quick"',
  'startSession("quick", false, {length})',
  'startSession("daily")',
  'function activeSession()',
  'session-console-active',
  'session-console-idle',
  'function phraseForCurrentExercise()',
  'currentExercise?.audio || item.example || item.term',
  'longTerm.insertAdjacentElement("afterend", audioButton)',
  'renderFeedbackWithPersistentPronunciation',
  'switchViewWithLessonLauncher'
]) {
  if (!launcherRuntime.includes(marker)) fail(`Missing contextual lesson-console marker: ${marker}`);
}

const launcherCss = read("lesson-side-launcher.css");
for (const marker of [
  ".lesson-mode-launcher",
  ".lesson-launcher-tabs",
  ".lesson-launcher-tab.active",
  ".lesson-launcher-panel",
  ".lesson-empty-state",
  ".session-console-active > .session-console-heading",
  ".session-console-active > .session-score",
  ".session-console-idle > :not(.lesson-mode-launcher)",
  ".lesson-session-idle .lesson-content > :not(.lesson-empty-state)",
  ".audio-btn.lesson-audio-square:not(.hidden)",
  "width: 156px",
  "height: 156px",
  'content: "Hear pronunciation"',
  "max-height: 800px",
  "prefers-reduced-motion"
]) {
  if (!launcherCss.includes(marker)) fail(`Missing contextual lesson-console style: ${marker}`);
}

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  for (const asset of [
    "ui-quality-fixes.js",
    "ui-quality-fixes.css",
    "ui-answer-breakdown.css",
    "incorrect-order-feedback.js",
    "incorrect-order-feedback.css",
    "compact-desktop-layout.js",
    "compact-desktop-layout.css",
    "mastery-feedback.js",
    "mastery-feedback.css",
    "mastery-console-overrides.css",
    "lesson-side-launcher.js?v=5.4.19",
    "lesson-side-launcher.css?v=5.4.19",
    "mobile-session-refinement.js?v=5.4.19",
    "mobile-session-refinement.css?v=5.4.19"
  ]) {
    if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  }
  const masteryIndex = html.indexOf("mastery-feedback.js?v=5.4.19");
  const launcherIndex = html.indexOf("lesson-side-launcher.js?v=5.4.19");
  const mobileIndex = html.indexOf("mobile-session-refinement.js?v=5.4.19");
  if (!(masteryIndex >= 0 && launcherIndex > masteryIndex && mobileIndex > launcherIndex)) {
    fail(`${htmlFile} must load mastery feedback, lesson launcher and mobile refinement in dependency order`);
  }
}

const serviceWorker = read("service-worker.js");
for (const asset of [
  "./ui-quality-fixes.js",
  "./ui-quality-fixes.css",
  "./ui-answer-breakdown.css",
  "./incorrect-order-feedback.js",
  "./incorrect-order-feedback.css",
  "./compact-desktop-layout.js",
  "./compact-desktop-layout.css",
  "./mastery-feedback.js",
  "./mastery-feedback.css",
  "./mastery-console-overrides.css",
  "./lesson-side-launcher.js",
  "./lesson-side-launcher.css",
  "./mobile-session-refinement.js",
  "./mobile-session-refinement.css"
]) {
  if (!serviceWorker.includes(asset)) fail(`Offline cache is missing ${asset}`);
}
if (!serviceWorker.includes("salita-quest-v5-4-mobile-refinement-r32")) {
  fail("Service-worker cache was not bumped for the mobile refinement release");
}

console.log("Validated dark-mode contrast, answer feedback, daily reviews, word breakdowns, failed-sentence correction, desktop lesson fitting, contextual Daily Session and Quick Review tabs, persistent square pronunciation, item mastery transitions, three-day durable recall, mobile refinement load order, both language loaders, and offline assets.");
