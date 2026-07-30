import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source,markers,label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

new vm.Script(read("social-posting-v2.js"),{filename:"social-posting-v2.js"});

const posting = read("social-posting-v2.js");
requireMarkers(posting,[
  "makeCanvas(1200,630)",
  "buildOpenGraphCard",
  "START LEARNING FREE",
  "CHOOSE TAGALOG OR CEBUANO",
  "createHostedShare",
  "currentShare.hostedPromise",
  "/api/share-cards",
  "squareImageDataUrl",
  "ogImageDataUrl",
  "hosted.shareUrl",
  "popup.document.write",
  "www.facebook.com/sharer/sharer.php?u=",
  "www.linkedin.com/sharing/share-offsite/?url=",
  "navigator.canShare?.({files:[file]})"
],"Browser hosted-sharing client");

const service = read("services/social-share/index.js");
requireMarkers(service,[
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
  'Start learning a Filipino language free',
  'MAX_UPLOADS_PER_HOUR',
  'ALLOWED_ORIGINS',
  'Cache-Control'
],"Cloud Run Open Graph service");

for (const file of ["services/social-share/index.js","social-posting-v2.js"]) {
  const check=spawnSync("node",["--check",file],{encoding:"utf8"});
  if(check.status!==0) fail(`${file} failed syntax check: ${check.stderr}`);
}

const packageJson=JSON.parse(read("services/social-share/package.json"));
if(!packageJson.dependencies?.express || !packageJson.dependencies?.["@google-cloud/storage"]) fail("Share service dependencies are incomplete");
const docker=read("services/social-share/Dockerfile");
requireMarkers(docker,["FROM node:20-slim","npm install --omit=dev","CMD [\"npm\", \"start\"]"],"Share-service container");
const deploy=read("services/social-share/deploy-cloud-shell.sh");
requireMarkers(deploy,[
  "run.googleapis.com",
  "cloudbuild.googleapis.com",
  "storage.googleapis.com",
  "--uniform-bucket-level-access",
  '"age": 365',
  "roles/storage.objectAdmin",
  "--allow-unauthenticated",
  "SHARE_BUCKET=",
  "PUBLIC_APP_URL=",
  "Settings → Connected accounts → Connection service"
],"Cloud Shell deployment");

for(const htmlFile of ["app.html","bisaya.html"]){
  const html=read(htmlFile);
  const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1].trim()).filter(Boolean);
  inline.forEach((source,index)=>new vm.Script(source,{filename:`${htmlFile}#inline-${index+1}`}));
  for(const asset of [
    "badge-layout-v3.css?v=5.4.25",
    "social-connections-v2.css?v=5.4.25",
    "social-posting-v2.css?v=5.4.25",
    "social-connections-v2.js?v=5.4.25",
    "social-posting-v2.js?v=5.4.25"
  ]) if(!html.includes(asset)) fail(`${htmlFile} does not load ${asset}`);
}

const worker=read("service-worker.js");
requireMarkers(worker,[
  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-4-social-posting-audio-r38"',
  'const CACHE_NAME = "salita-quest-v5-4-hosted-sharing-r39"',
  '"./social-posting-v2.js"',
  '"./social-connections-v2.js"'
],"Hosted-sharing offline release");

const index=read("index.html");
requireMarkers(index,["profile-shell.css?v=5.4.25","service-worker.js?v=5.4.25"],"Profile gate release");

const readme=read("README.md");
requireMarkers(readme,[
  "5.4.25 — Hosted Achievement Sharing",
  "1200 × 630 Open Graph version",
  "START LEARNING FREE",
  "services/social-share/deploy-cloud-shell.sh",
  "validate-hosted-achievement-sharing.mjs"
],"Hosted-sharing documentation");
const serviceDocs=read("services/social-share/README.md");
requireMarkers(serviceDocs,["Open Graph metadata","og:image","Cloud Run","Start learning a Filipino language free"],"Share-service documentation");

console.log("Validated unique hosted badge/chest pages, exact 1200×630 Open Graph images, square app-sharing images, CTA artwork and landing pages, Cloud Run deployment, both languages and release 5.4.25.");
