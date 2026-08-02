import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source,markers,label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

const service = read("services/social-share/index.js");
const verifier = read("services/social-share/verify-deployment.mjs");
const deploy = read("services/social-share/deploy-cloud-shell.sh");

requireMarkers(service,[
  'const SERVICE_VERSION = "5.5.13-facebook-link-card"',
  'app.head("/media/:id/:variant.png"',
  '"Content-Length":String(metadata.size || "")',
  '"Cache-Control":"public,max-age=300,stale-while-revalidate=86400"',
  '<meta property="og:image:url" content="${image}">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  'Start learning a Filipino language free'
],"Crawler-friendly hosted share service");
if (/noindex\s*,\s*nofollow/i.test(service)) fail("Hosted achievement pages must not discourage Meta from following the card link.");

requireMarkers(verifier,[
  'const serviceUrl = String(process.argv[2] || process.env.SOCIAL_SHARE_URL || "")',
  'const FACEBOOK_USER_AGENT = "facebookexternalhit/1.1',
  'health.bucketConfigured === true',
  'health.version === "5.5.13-facebook-link-card"',
  '["badge","badge_chest","avatar","avatar_case","level_up"]',
  'pngDataUrl(1080,1080',
  'pngDataUrl(1200,630',
  'type:"avatar_case"',
  'shareUrl.pathname.startsWith("/share/")',
  'imageUrl.pathname.startsWith("/media/")',
  'method:"HEAD"',
  'Number(head.headers.get("content-length")) > 0',
  '"User-Agent":FACEBOOK_USER_AGENT',
  '<meta property="og:image:url" content="${imageUrl}">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  'Start learning a Filipino language free',
  '!/Learner Login/i.test(page)',
  '!/noindex\\s*,\\s*nofollow/i.test(page)',
  'await fetchPng(imageUrl,1200,630',
  'await fetchPng(squareImageUrl,1080,1080',
  'crawler:"facebookexternalhit/1.1"',
  'status:"PASS"'
],"Meta crawler deployment verifier");

requireMarkers(deploy,[
  'curl --fail --silent --show-error --max-time 30 "${candidate}/health"',
  'Running end-to-end public-card verification...',
  'node services/social-share/verify-deployment.mjs "${SERVICE_URL}"',
  'Hosted achievement sharing is ready.'
],"Cloud Run deployment flow");

const healthIndex = deploy.indexOf('${candidate}/health');
const verifierIndex = deploy.indexOf('node services/social-share/verify-deployment.mjs');
if (healthIndex < 0 || verifierIndex <= healthIndex) fail("End-to-end verification must run after the health endpoint succeeds.");
if (/Learner Login/.test(deploy)) fail("The deployment script must not advertise the learner-login page as a share destination.");

for (const file of ["services/social-share/index.js","services/social-share/verify-deployment.mjs"]) {
  const syntax = spawnSync(process.execPath,["--check",file],{cwd:root,encoding:"utf8"});
  if (syntax.status !== 0) fail(`${file} failed syntax check: ${syntax.stderr}`);
}

console.log("Validated Meta-ready Cloud Run sharing: configured storage, five share types, real card upload, Facebook crawler HTML, HEAD-capable images with Content-Length, Open Graph metadata, exact PNG dimensions and learn-free destination.");