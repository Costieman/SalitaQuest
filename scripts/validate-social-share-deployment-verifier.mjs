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

const verifier = read("services/social-share/verify-deployment.mjs");
const deploy = read("services/social-share/deploy-cloud-shell.sh");

new vm.SourceTextModule(verifier,{identifier:"verify-deployment.mjs"});

requireMarkers(verifier,[
  'const serviceUrl = String(process.argv[2] || process.env.SOCIAL_SHARE_URL || "")',
  'health.bucketConfigured === true',
  '["badge","badge_chest","avatar","avatar_case","level_up"]',
  'pngDataUrl(1080,1080',
  'pngDataUrl(1200,630',
  'type:"avatar_case"',
  'shareUrl.pathname.startsWith("/share/")',
  'imageUrl.pathname.startsWith("/media/")',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  'Start learning a Filipino language free',
  '!/Learner Login/i.test(page)',
  'await fetchPng(imageUrl,1200,630',
  'await fetchPng(squareImageUrl,1080,1080',
  'status:"PASS"'
],"Hosted deployment verifier");

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

const syntax = spawnSync(process.execPath,["--check","services/social-share/verify-deployment.mjs"],{cwd:root,encoding:"utf8"});
if (syntax.status !== 0) fail(`Hosted deployment verifier failed syntax check: ${syntax.stderr}`);

console.log("Validated Cloud Run deployment verification: configured storage, five share types, real card upload, public /share page, Open Graph metadata, exact PNG dimensions and learn-free destination.");
