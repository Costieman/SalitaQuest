import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };

for (const file of [
  "placement-onboarding-v1.js",
  "badge-sharing-v1.js",
  "social-links-v1.js",
  "service-worker.js"
]) new vm.Script(read(file),{filename:file});

const placement = read("placement-onboarding-v1.js");
for (const marker of [
  "const TEST_LENGTH = 20",
  '"A1","A2","A3","B1","B2","B3"',
  "basic:12,intermediate:6,advanced:2",
  "basic:2,intermediate:6,advanced:12",
  "No XP or mastery is awarded during placement",
  "Earlier regions remain available",
  "data.accessPoints = moduleAccessFor(level)",
  "Math.max(actual,access)",
  "state.settings.beginnerMode = level === \"beginner\"",
  "if (!event.target.checked) openModal({retake:true})",
  "initialiseExistingLearner",
  "existing-progress"
]) if (!placement.includes(marker)) fail(`Missing placement marker: ${marker}`);
if (/state\.xp\s*[+\-]?=/.test(placement)) fail("Placement runtime must not award or rewrite XP");
if (/mastery\s*:/.test(placement) || /itemState\[[^\]]+\]\s*=/.test(placement)) fail("Placement runtime must not manufacture item mastery");

const placementCss = read("placement-onboarding-v1.css");
for (const marker of [".placement-modal",".placement-level-grid",".placement-answer-grid",".placement-settings-card","@media (max-width:700px)"]) if (!placementCss.includes(marker)) fail(`Missing placement style: ${marker}`);

const badgeCss = read("badge-catalogue-v2.css");
for (const marker of ["#badgesView {","overflow-x:hidden","badge-catalogue-grid","badge-catalogue-card"]) if (!badgeCss.includes(marker)) fail(`Missing badge catalogue marker: ${marker}`);

const sharing = read("badge-sharing-v1.js");
for (const marker of [
  "const MAX_CHEST_BADGES = 6","data.chestIds","Share Badge Chest","Add to chest","Share badge",
  "buildBadgeCard","buildChestCard","canvas.toBlob","learn Filipino languages for free with Salita Quest",
  'url.searchParams.set("ref", campaign)',"badge-chest"
]) if (!sharing.includes(marker)) fail(`Missing badge-sharing marker: ${marker}`);

const sharingCss = read("badge-sharing-v1.css");
for (const marker of [".badge-chest-panel",".badge-chest-grid","repeat(3,minmax(0,1fr))","repeat(2,minmax(0,1fr))",".badge-card-share-actions"]) if (!sharingCss.includes(marker)) fail(`Missing Badge Chest style: ${marker}`);

const socials = read("social-links-v1.js");
for (const marker of ["salitaQuestLocalProfilesV1","Facebook","Instagram","TikTok","YouTube","LinkedIn","SalitaQuestSocialProfile"]) if (!socials.includes(marker)) fail(`Missing legacy social-profile marker: ${marker}`);

for (const htmlFile of ["app.html","bisaya.html"]) {
  const html = read(htmlFile);
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1].trim()).filter(Boolean);
  scripts.forEach((source,index)=>new vm.Script(source,{filename:`${htmlFile}#inline-${index+1}`}));
  for (const asset of [
    "badge-catalogue-v2.css?v=5.4.23","badge-sharing-v1.css?v=5.4.23","placement-onboarding-v1.css?v=5.4.23","social-links-v1.css?v=5.4.23",
    "badge-catalogue-v2.js?v=5.4.23","social-links-v1.js?v=5.4.23","badge-sharing-v1.js?v=5.4.23","placement-onboarding-v1.js?v=5.4.23"
  ]) if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  const catalogue = html.indexOf("badge-catalogue-v2.js?v=5.4.23");
  const socialsIndex = html.indexOf("social-links-v1.js?v=5.4.23");
  const chest = html.indexOf("badge-sharing-v1.js?v=5.4.23");
  const placementIndex = html.indexOf("placement-onboarding-v1.js?v=5.4.23");
  if (!(catalogue >= 0 && catalogue < socialsIndex && socialsIndex < chest && chest < placementIndex)) fail(`${htmlFile} must preserve catalogue, legacy social links, Badge Chest and placement dependency order`);
}

const worker = read("service-worker.js");
for (const asset of ['"./badge-sharing-v1.js"','"./badge-sharing-v1.css"','"./placement-onboarding-v1.js"','"./placement-onboarding-v1.css"','"./social-links-v1.js"','"./social-links-v1.css"']) if (!worker.includes(asset)) fail(`Offline cache is missing ${asset}`);
if (!worker.includes("salita-quest-v5-4-hosted-sharing-r39")) fail("Current service-worker cache is missing");

const index = read("index.html");
if (!index.includes("profile-shell.css?v=5.4.25") || !index.includes("service-worker.js?v=5.4.25")) fail("Profile gate was not advanced to 5.4.25");

const readme = read("README.md");
for (const marker of ["5.4.25 — Hosted Achievement Sharing","20-question placement check","content access only","Badge Chest","Start learning a Filipino language free","Connected social accounts","validate-placement-sharing.mjs"]) if (!readme.includes(marker)) fail(`README is missing: ${marker}`);

console.log("Validated 20-question placement, beginner-mode retake, non-destructive content access, ordered Badge Chest state, legacy compatibility, both language loaders and current offline release.");
