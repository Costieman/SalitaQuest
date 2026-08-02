import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source,markers,label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

const verifier = read("services/social-share/verify-deployment.mjs");
const deploy = read("services/social-share/deploy-cloud-shell.sh");
const service = read("services/social-share/index-v2.js");
const packageJson = JSON.parse(read("services/social-share/package.json"));

requireMarkers(verifier,[
  'const serviceUrl = String(process.argv[2] || process.env.SOCIAL_SHARE_URL || "")',
  'facebookexternalhit/1.1',
  'meta-externalagent/1.1',
  'health.bucketConfigured === true',
  'health.crawlerPreview === true',
  '["badge","badge_chest","avatar","avatar_case","level_up"]',
  'pngDataUrl(1080,1080',
  'pngDataUrl(1200,630',
  'type:"avatar_case"',
  'shareUrl.pathname.startsWith("/share/")',
  'imageUrl.pathname.startsWith("/media/")',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  'verifyCrawlerPage',
  'verifyHeadAndRange',
  'Range:"bytes=0-1023"',
  'range.status === 206',
  'Start learning a Filipino language free',
  '!/Learner Login/i.test(page)',
  'status:"PASS"'
],"Hosted deployment verifier");

requireMarkers(service,[
  'const SERVICE_VERSION = "5.5.11.2-meta-crawler-preview"',
  'crawlerPreview:true',
  '"X-Robots-Tag":"all"',
  '<meta name="robots" content="index,follow,max-image-preview:large">',
  '<link rel="image_src" href="${image}">',
  '<meta property="og:image:url" content="${image}">',
  '"Content-Length":String(buffer.length)',
  '"Accept-Ranges":"bytes"',
  'res.status(206)'
],"Crawler-compatible service");
if (/noindex|nofollow/.test(service)) fail("Crawler-compatible service must not block Meta indexing.");
if (packageJson.scripts?.start !== "node index-v2.js") fail("Cloud Run does not start the crawler-compatible service.");

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

for (const file of ["services/social-share/index-v2.js","services/social-share/verify-deployment.mjs"]) {
  const syntax = spawnSync(process.execPath,["--check",file],{cwd:root,encoding:"utf8"});
  if (syntax.status !== 0) fail(`${file} failed syntax check: ${syntax.stderr}`);
}

console.log("Validated Cloud Run deployment verification: configured storage, five share types, real card upload, crawlable public /share page, Open Graph metadata, Meta crawler user agents, HEAD and byte ranges, exact PNG dimensions and learn-free destination.");
