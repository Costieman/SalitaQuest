import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source, markers, label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

for (const file of ["social-connections-v2.js", "achievement-sharing-v4.js", "service-worker.js"]) {
  new vm.Script(read(file), {filename: file});
}

const layout = read("badge-layout-v3.css");
requireMarkers(layout, [
  "#badgesView #badgeShelf > .badge.badge-catalogue-card",
  "grid-template-columns:92px minmax(0,1fr) !important",
  "grid-column:1 !important",
  "grid-column:2 !important",
  "position:static !important",
  "grid-template-columns:76px minmax(0,1fr) !important"
], "Final badge geometry");
if (!layout.includes(".badge-visual-shell") || !layout.includes(".badge-catalogue-copy")) {
  fail("Badge art and copy are not independently positioned");
}

const connections = read("social-connections-v2.js");
requireMarkers(connections, [
  "salitaQuestSocialApiBase",
  "SALITA_SOCIAL_API_BASE",
  "DEFAULT_API_BASE",
  'fetch(`${base}/health`',
  "No account setup required.",
  "Progress sharing is ready.",
  "data-open-badges",
  "developerMode()",
  "/api/social/connections?profileId=",
  "/oauth/${encodeURIComponent(provider)}/start",
  "/api/social/posts",
  'credentials:"include"',
  "event.origin!==origin",
  "salita-social-oauth",
  "SalitaQuestSocialConnections"
], "Seamless connected-account runtime");
if (connections.includes("/healthz")) fail("Connected-account runtime must avoid Cloud Run's reserved health path");
if (connections.includes("Share service not configured")) fail("Normal learners must not see service setup errors");
if (connections.includes("Deploy the Salita Quest share service")) fail("Normal learners must not receive infrastructure instructions");

const sharing = read("achievement-sharing-v4.js");
requireMarkers(sharing, [
  "makeCanvas(width = 1080, height = 1080)",
  "makeCanvas(1200, 630)",
  "avatarPath()",
  "drawBadgeVisual",
  "buildBadgeCard",
  "buildChestCard",
  "buildLevelCard",
  "buildOpenGraphCard",
  "START LEARNING FREE",
  "CHOOSE TAGALOG OR CEBUANO",
  "createHostedShare",
  "/api/share-cards",
  "squareImageDataUrl",
  "ogImageDataUrl",
  "www.facebook.com/sharer/sharer.php",
  "twitter.com/intent/tweet",
  "www.linkedin.com/sharing/share-offsite",
  "https://wa.me/",
  "navigator.canShare?.({files: [file]})",
  "data-share-badge-chest",
  "data-share-badge",
  "data-share-level-v4",
  "SalitaQuestAchievementSharing"
], "Consolidated achievement-sharing runtime");

for (const htmlFile of ["app.html", "bisaya.html"]) {
  const html = read(htmlFile);
  const inline = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1].trim()).filter(Boolean);
  inline.forEach((source, index) => new vm.Script(source, {filename: `${htmlFile}#inline-${index + 1}`}));
  for (const asset of [
    "badge-layout-v3.css?v=5.4.25",
    "badge-chest-v2.css?v=5.4.29",
    "social-connections-v2.css?v=5.4.27",
    "achievement-sharing-v4.css?v=5.4.29",
    "badge-chest-v2.js?v=5.4.29",
    "social-connections-v2.js?v=5.4.27",
    "achievement-sharing-v4.js?v=5.4.29"
  ]) if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  const chestIndex = html.indexOf("badge-chest-v2.js?v=5.4.29");
  const connectionsIndex = html.indexOf("social-connections-v2.js?v=5.4.27");
  const sharingIndex = html.indexOf("achievement-sharing-v4.js?v=5.4.29");
  if (!(chestIndex >= 0 && connectionsIndex > chestIndex && sharingIndex > connectionsIndex)) {
    fail(`${htmlFile} must load chest state, sharing service and final achievement sharing in that order`);
  }
  for (const obsolete of ["badge-sharing-v1", "social-posting-v2", "achievement-sharing-v3", "social-links-v1"]) {
    if (html.includes(obsolete)) fail(`${htmlFile} still loads obsolete ${obsolete}`);
  }
}

const worker = read("service-worker.js");
requireMarkers(worker, [
  "salita-quest-v5-5-avatar-progression-r43",
  '"./badge-layout-v3.css"',
  '"./badge-chest-v2.js"',
  '"./badge-chest-v2.css"',
  '"./social-connections-v2.js"',
  '"./social-connections-v2.css"',
  '"./achievement-sharing-v4.js"',
  '"./achievement-sharing-v4.css"'
], "Offline social release");

const generator = read("scripts/generate_cebuano_google_audio.py");
requireMarkers(generator, [
  "def spoken_form(text: str)",
  "def existing_alias(text: str",
  'FAILED_PATH = OUTPUT_DIR / "failed.jsonl"',
  "TRANSIENT_RETRIES = 4",
  "retrying punctuation-normalised text",
  "temporary Google Cloud error",
  "append_failure(text, error",
  "Summary: {generated} generated, {reused} aliases reused, {failed} skipped",
  "save_audio_manifest(manifest)"
], "Resumable Cebuano generator");

const compile = spawnSync("python3", ["-m", "py_compile", "scripts/generate_cebuano_google_audio.py"], {encoding: "utf8"});
if (compile.status !== 0) fail(`Cebuano generator does not compile: ${compile.stderr}`);
const dryRun = spawnSync("python3", ["scripts/generate_cebuano_google_audio.py", "--dry-run", "--limit", "1"], {encoding: "utf8"});
if (dryRun.status !== 0) fail(`Cebuano dry run failed: ${dryRun.stderr}`);
if (!dryRun.stdout.includes("Cebuano phrases discovered:") || !dryRun.stdout.includes("Clips to generate or map:")) {
  fail("Cebuano dry run did not report resumable work");
}

const socialDocs = read("docs/SOCIAL_CONNECTIONS.md");
requireMarkers(socialDocs, ["True connected accounts", "w_member_social", "TikTok's Content Posting API", "secure HTTPS service", "GET /api/social/connections", "POST /api/social/posts"], "Social connection documentation");
const audioDocs = read("docs/CEBUANO_AUDIO.md");
requireMarkers(audioDocs, ["The generator is resumable", "punctuation-only aliases", "failed.jsonl", "git pull --ff-only origin main"], "Cebuano recovery documentation");
const audit = read("docs/CODE_AUDIT_2026-07-30.md");
requireMarkers(audit, ["Self-triggering Badge Chest observer", "Three modules competing", "Pinned source document plus string injection", "No full browser interaction suite"], "Code audit");

console.log("Validated non-overlapping badge cards, built-in sharing status, one achievement-sharing owner, hosted platform hand-off, resumable Cebuano generation and the documented stability audit.");
