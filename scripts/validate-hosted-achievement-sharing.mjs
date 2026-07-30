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

for (const file of ["achievement-sharing-v4.js", "social-connections-v2.js"]) {
  new vm.Script(read(file), {filename: file});
}

const sharing = read("achievement-sharing-v4.js");
requireMarkers(sharing, [
  "buildBadgeCard",
  "buildChestCard",
  "buildLevelCard",
  "buildOpenGraphCard",
  "START LEARNING FREE",
  "CHOOSE TAGALOG OR CEBUANO",
  "createHostedShare",
  "activeShare.hostedPromise",
  "/api/share-cards",
  "squareImageDataUrl",
  "ogImageDataUrl",
  "hosted.shareUrl",
  "popup.document.write",
  "www.facebook.com/sharer/sharer.php?u=",
  "www.linkedin.com/sharing/share-offsite/?url=",
  "navigator.canShare?.({files: [file]})",
  "SalitaQuestBadgeChest",
  "SalitaQuestAchievementSharing"
], "Consolidated browser hosted-sharing client");

const connections = read("social-connections-v2.js");
requireMarkers(connections, [
  'const DEFAULT_API_BASE = "https://salita-quest-social-share-zvxenj6xcq-as.a.run.app"',
  'fetch(`${base}/health`',
  "Progress sharing is ready.",
  "No account setup required.",
  "Choose a platform when you share a badge",
  "data-open-badges",
  "developerMode()",
  'if(!developerMode()) return ""',
  "oauthAvailable"
], "Seamless hosted-sharing settings");
if (connections.includes("/healthz")) fail("The browser must not use Cloud Run's reserved health path");
if (connections.includes("Share service not configured")) fail("Learners must not see a missing-service configuration state");
if (connections.includes("Deploy the Salita Quest share service")) fail("Learners must not receive infrastructure setup instructions");

const connectionCss = read("social-connections-v2.css");
requireMarkers(connectionCss, [
  ".social-sharing-state.ready",
  ".social-share-launcher",
  ".social-destination-list",
  ".social-future-note",
  ".social-service-setup"
], "Compact seamless-sharing styles");

const service = read("services/social-share/index.js");
requireMarkers(service, [
  'app.get("/health"',
  'app.post("/api/share-cards"',
  'decodePngDataUrl(req.body.squareImageDataUrl, "squareImageDataUrl", 1080, 1080)',
  'decodePngDataUrl(req.body.ogImageDataUrl, "ogImageDataUrl", 1200, 630)',
  'crypto.randomBytes(18).toString("base64url")',
  'saveObject(`images/${id}-square.png`',
  'saveObject(`images/${id}-og.png`',
  'app.get("/media/:id/:variant.png"',
  'app.get("/share/:id"',
  '<meta property="og:image" content="${image}">',
  '<meta property="og:image:secure_url" content="${image}">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta name="twitter:card" content="summary_large_image">',
  "Start learning a Filipino language free",
  "MAX_UPLOADS_PER_HOUR",
  "ALLOWED_ORIGINS",
  "Cache-Control"
], "Cloud Run Open Graph service");
if (service.includes('app.get("/healthz"')) fail("The service must avoid Cloud Run's reserved health path");

for (const file of ["services/social-share/index.js", "social-connections-v2.js", "achievement-sharing-v4.js"]) {
  const check = spawnSync("node", ["--check", file], {encoding: "utf8"});
  if (check.status !== 0) fail(`${file} failed syntax check: ${check.stderr}`);
}

const packageJson = JSON.parse(read("services/social-share/package.json"));
if (!packageJson.dependencies?.express || !packageJson.dependencies?.["@google-cloud/storage"]) {
  fail("Share service dependencies are incomplete");
}
const docker = read("services/social-share/Dockerfile");
requireMarkers(docker, ["FROM node:20-slim", "npm install --omit=dev", 'CMD ["npm", "start"]'], "Share-service container");
const deploy = read("services/social-share/deploy-cloud-shell.sh");
requireMarkers(deploy, [
  "run.googleapis.com",
  "cloudbuild.googleapis.com",
  "storage.googleapis.com",
  "--uniform-bucket-level-access",
  '"age": 365',
  "roles/storage.objectAdmin",
  "roles/run.builder",
  "--allow-unauthenticated",
  "--default-url",
  "--ingress=all",
  '"${candidate}/health"',
  "SHARE_BUCKET=",
  "PUBLIC_APP_URL="
], "Cloud Shell deployment");
if (deploy.includes("/healthz")) fail("The deployment script must not test the reserved health path");

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
}

const worker = read("service-worker.js");
requireMarkers(worker, [
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-4-achievement-sharing-r41"',
  'const CACHE_NAME = "salita-quest-v5-4-badge-stability-r42"',
  '"./social-connections-v2.js"',
  '"./badge-chest-v2.js"',
  '"./achievement-sharing-v4.js"',
  '"./achievement-sharing-v4.css"'
], "Stable achievement-sharing offline release");

const index = read("index.html");
requireMarkers(index, ["profile-shell.css?v=5.4.25", "service-worker.js?v=5.4.29"], "Profile gate release");

const readme = read("README.md");
requireMarkers(readme, [
  "Hosted achievement sharing",
  "1200 × 630 Open Graph version",
  "START LEARNING FREE",
  "services/social-share/deploy-cloud-shell.sh",
  "validate-hosted-achievement-sharing.mjs"
], "Hosted-sharing documentation");
const serviceDocs = read("services/social-share/README.md");
requireMarkers(serviceDocs, ["Open Graph metadata", "og:image", "Cloud Run", "Start learning a Filipino language free"], "Share-service documentation");

console.log("Validated built-in progress sharing, one badge/chest/level card owner, exact Open Graph images, Cloud Run deployment, both language loaders and release 5.4.29.");
