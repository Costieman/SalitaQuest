import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source,markers,label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

const router = read("achievement-sharing-router-v2.js");
const routerCss = read("achievement-sharing-router-v2.css");
const bridge = read("achievement-sharing-avatar-bridge-v1.js");
const loader = read("profile-emblem-control.js");
const worker = read("service-worker.js");

for (const [file,source] of [
  ["achievement-sharing-router-v2.js",router],
  ["achievement-sharing-avatar-bridge-v1.js",bridge],
  ["profile-emblem-control.js",loader],
  ["service-worker.js",worker]
]) new vm.Script(source,{filename:file});

requireMarkers(router,[
  'const RELEASE = "5.5.11-explicit-sharing-router"',
  'modes:Object.freeze(["feed_link","private_link","image_file"])',
  'data-sq-share-feed="facebook"',
  'data-sq-share-private',
  'data-sq-share-image',
  'Creating your public achievement post…',
  'validateHostedResponse(data,base)',
  'share.pathname.startsWith("/share/")',
  'image.pathname.startsWith("/media/")',
  'https://www.facebook.com/sharer/sharer.php?u=',
  'https://www.linkedin.com/sharing/share-offsite/?url=',
  'https://twitter.com/intent/tweet?text=',
  'https://wa.me/?text=',
  'Use Share image instead or try again.',
  'document.addEventListener("click",handleClick,true)',
  'document.addEventListener("salita:achievement-share-prepared"'
],"Explicit sharing router");

const privatePayload = router.match(/await navigator\.share\(\{\s*title:prepared\.title,\s*text:prepared\.text,\s*url:hosted\.shareUrl\s*\}\);/s);
if (!privatePayload) fail("Private sharing must send title, caption and hosted share URL.");
const imagePayload = router.match(/await navigator\.share\(\{([^}]+)\}\);\s*setStatus\("The achievement image/s);
if (!imagePayload) fail("Image-only sharing payload could not be located.");
if (!/files:\[file\]/.test(imagePayload[1])) fail("Image sharing must attach the PNG file.");
if (/\burl\s*:/.test(imagePayload[1])) fail("Image sharing must not include a competing URL preview.");
if (/files\s*:/.test(privatePayload[0])) fail("Private link sharing must not attach the PNG.");

const facebookFunction = router.match(/async function openPublicComposer\(provider\)([\s\S]*?)\n  async function sendPrivately/);
if (!facebookFunction) fail("Public composer function could not be located.");
if (facebookFunction[1].includes("prepared.url") || facebookFunction[1].includes("shareRoot")) {
  fail("Public feed posting must never fall back to the learner-login application URL.");
}
if (!facebookFunction[1].includes("await ensureHostedShare()")) {
  fail("Public feed posting must require a hosted achievement page.");
}

requireMarkers(routerCss,[
  ".achievement-share-router-v2",
  ".achievement-share-mode-group",
  ".achievement-share-mode-actions.public-actions",
  ".achievement-share-mode-actions.image-actions",
  ".achievement-share-secondary[hidden]"
],"Explicit sharing router styles");

requireMarkers(loader,[
  'const SHARING_VERSION = "5.5.11.1"',
  'addStylesheet("sharing-router-css"',
  '`./achievement-sharing-router-v2.css?v=${SHARING_VERSION}`',
  '"achievement-sharing-router"',
  '`./achievement-sharing-router-v2.js?v=${SHARING_VERSION}`',
  '`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`',
  'sharingVersion:SHARING_VERSION'
],"Primary sharing-router loader");
const routerLoadIndex = loader.indexOf('"achievement-sharing-router"');
const bridgeLoadIndex = loader.indexOf('"sharing"',routerLoadIndex + 1);
if (routerLoadIndex < 0 || bridgeLoadIndex < 0 || routerLoadIndex >= bridgeLoadIndex) {
  fail("The explicit sharing router must load before the compatibility bridge.");
}
if (loader.includes("achievement-sharing-image-transport-v1.js")) {
  fail("The primary loader must not load the retired automatic image transport.");
}

requireMarkers(worker,[
  'const EXPLICIT_SHARING_ROUTER_DELIVERY = "2026-08-02-feed-private-image-router-1"',
  '"./achievement-sharing-router-v2.js"',
  '"./achievement-sharing-router-v2.css"',
  '"./profile-emblem-control.js"',
  '"./achievement-sharing-avatar-bridge-v1.js"',
  'self.skipWaiting()',
  'self.clients.claim()'
],"Installed-app sharing-router delivery");

requireMarkers(bridge,[
  'const RELEASE = "5.5.11-explicit-sharing-router"',
  'openAvatarCase(...args)',
  'compatibilityOnly:true, transportOwner:false'
],"Compatibility-only avatar bridge");
if (bridge.includes('document.addEventListener("click"')) fail("The avatar bridge must not intercept sharing actions.");
if (bridge.includes("window.SalitaQuestAchievementSharing =")) fail("The avatar bridge must not replace the unified card controller.");
if (bridge.includes("achievement-sharing-image-transport-v1.js")) fail("The avatar bridge must not load the retired automatic transport.");

console.log("Validated explicit sharing modes: hosted-only public feed posts, link-only private sharing, PNG-only image sharing, no learner-login fallback, compatibility-only avatar bridge, and PWA delivery.");
