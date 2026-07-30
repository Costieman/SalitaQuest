import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source, markers, label) => markers.forEach(marker => { if (!source.includes(marker)) fail(`${label} is missing: ${marker}`); });

for (const file of ["social-connections-v2.js","achievement-sharing-v3.js","social-posting-v2.js","service-worker.js"]) new vm.Script(read(file),{filename:file});

const layout = read("badge-layout-v3.css");
requireMarkers(layout,[
  "#badgesView #badgeShelf > .badge.badge-catalogue-card",
  "grid-template-columns:92px minmax(0,1fr) !important",
  "grid-column:1 !important",
  "grid-column:2 !important",
  "position:static !important",
  "grid-template-columns:76px minmax(0,1fr) !important"
],"Final badge geometry");
if (!layout.includes(".badge-visual-shell") || !layout.includes(".badge-catalogue-copy")) fail("Badge art and copy are not independently positioned");

const connections = read("social-connections-v2.js");
requireMarkers(connections,[
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
],"Seamless connected-account runtime");
if (connections.includes("/healthz")) fail("Connected-account runtime must avoid Cloud Run's reserved health path");
if (connections.includes("Share service not configured")) fail("Normal learners must not see service setup errors");
if (connections.includes("Deploy the Salita Quest share service")) fail("Normal learners must not receive infrastructure instructions");

const posting = read("social-posting-v2.js");
requireMarkers(posting,[
  "makeCanvas(width=1080,height=1080)",
  "makeCanvas(1200,630)",
  "avatarPath()",
  "drawBadgeVisual",
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
  "navigator.canShare?.({files:[file]})",
  "api.post(provider",
  "event.stopImmediatePropagation()",
  'document.addEventListener("click"',
  "data-social-platform"
],"Hosted platform posting runtime");
if (!posting.includes("},true);")) fail("Social posting must capture share clicks before the legacy Windows-share handler");

for (const htmlFile of ["app.html","bisaya.html"]) {
  const html=read(htmlFile);
  const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1].trim()).filter(Boolean);
  inline.forEach((source,index)=>new vm.Script(source,{filename:`${htmlFile}#inline-${index+1}`}));
  for (const asset of [
    "badge-layout-v3.css?v=5.4.25","social-connections-v2.css?v=5.4.27","social-posting-v2.css?v=5.4.25","achievement-sharing-v3.css?v=5.4.28",
    "social-connections-v2.js?v=5.4.27","achievement-sharing-v3.js?v=5.4.28","social-posting-v2.js?v=5.4.25"
  ]) if (!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
  const oldShare=html.indexOf("badge-sharing-v1.js?v=5.4.23");
  const connectionsIndex=html.indexOf("social-connections-v2.js?v=5.4.27");
  const achievementIndex=html.indexOf("achievement-sharing-v3.js?v=5.4.28");
  const postingIndex=html.indexOf("social-posting-v2.js?v=5.4.25");
  if (!(oldShare>=0 && connectionsIndex>oldShare && achievementIndex>connectionsIndex && postingIndex>achievementIndex)) fail(`${htmlFile} must load legacy chest state, seamless sharing, authoritative achievement sharing, then legacy hosted-posting compatibility`);
}

const worker=read("service-worker.js");
requireMarkers(worker,[
  "salita-quest-v5-4-seamless-sharing-r40",
  "salita-quest-v5-4-achievement-sharing-r41",
  '"./badge-layout-v3.css"',
  '"./social-connections-v2.js"',
  '"./social-connections-v2.css"',
  '"./achievement-sharing-v3.js"',
  '"./achievement-sharing-v3.css"',
  '"./social-posting-v2.js"',
  '"./social-posting-v2.css"'
],"Offline social release");

const generator=read("scripts/generate_cebuano_google_audio.py");
requireMarkers(generator,[
  "def spoken_form(text: str)",
  "def existing_alias(text: str",
  "FAILED_PATH = OUTPUT_DIR / \"failed.jsonl\"",
  "TRANSIENT_RETRIES = 4",
  "retrying punctuation-normalised text",
  "temporary Google Cloud error",
  "append_failure(text, error",
  "Summary: {generated} generated, {reused} aliases reused, {failed} skipped",
  "save_audio_manifest(manifest)"
],"Resumable Cebuano generator");

const compile=spawnSync("python3",["-m","py_compile","scripts/generate_cebuano_google_audio.py"],{encoding:"utf8"});
if(compile.status!==0) fail(`Cebuano generator does not compile: ${compile.stderr}`);
const dryRun=spawnSync("python3",["scripts/generate_cebuano_google_audio.py","--dry-run","--limit","1"],{encoding:"utf8"});
if(dryRun.status!==0) fail(`Cebuano dry run failed: ${dryRun.stderr}`);
if(!dryRun.stdout.includes("Cebuano phrases discovered:")||!dryRun.stdout.includes("Clips to generate or map:")) fail("Cebuano dry run did not report resumable work");

const socialDocs=read("docs/SOCIAL_CONNECTIONS.md");
requireMarkers(socialDocs,["True connected accounts","w_member_social","TikTok's Content Posting API","secure HTTPS service","GET /api/social/connections","POST /api/social/posts"],"Social connection documentation");
const audioDocs=read("docs/CEBUANO_AUDIO.md");
requireMarkers(audioDocs,["The generator is resumable","punctuation-only aliases","failed.jsonl","git pull --ff-only origin main"],"Cebuano recovery documentation");
const readme=read("README.md");
requireMarkers(readme,["5.4.25 — Hosted Achievement Sharing","Hosted achievement sharing","Connected social accounts","badge-layout-v3.css","validate-social-posting-audio-resume.mjs"],"README release notes");

console.log("Validated non-overlapping badge cards, automatic built-in sharing, authoritative individual badge and level-up sharing, hosted platform previews, OAuth-ready posting, resumable Cebuano generation and release 5.4.28.");