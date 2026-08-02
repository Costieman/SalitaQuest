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
  'const RELEASE = "5.5.14-direct-social-link-posts"',
  'modes:Object.freeze(["feed_link","app_link","private_link","download_file"])',
  'data-sq-share-feed="facebook"',
  'data-sq-share-app',
  'data-sq-share-private',
  'Preparing the normal link post…',
  'validateHostedResponse(data,base)',
  'share.pathname.startsWith("/share/")',
  'image.pathname.startsWith("/media/")',
  'Play Salita Quest free:',
  'function composerUrl(provider,hosted)',
  'https://www.facebook.com/sharer/sharer.php?u=',
  'https://www.linkedin.com/sharing/share-offsite/?url=',
  'https://twitter.com/intent/tweet?text=',
  'https://wa.me/?text=',
  'POST A NORMAL LINK CARD',
  'Open Facebook’s normal link-post composer',
  'ensureHostedShare().catch(() => {})',
  'document.addEventListener("click",handleClick,true)',
  'document.addEventListener("salita:achievement-share-prepared"'
],"Direct social-link sharing router");

if (router.includes("mobileShareAvailable") || router.includes("hasMobileNativeShare")) {
  fail("Facebook must not switch to the generic operating-system share sheet on mobile.");
}
if (router.includes("&quote=") || router.includes("&hashtag=")) {
  fail("Facebook sharing must use the simple URL-post endpoint without unsupported prefill parameters.");
}
if (/provider\s*===\s*"facebook"[\s\S]{0,500}navigator\.share/.test(router)) {
  fail("The Facebook feed action must not call navigator.share.");
}
if (/navigator\.share\(\{[^}]*files:/.test(router)) {
  fail("No social-post route may degrade into an image-only attachment.");
}
if (!/await navigator\.share\(\{[\s\S]*title:prepared\.title,[\s\S]*text:prepared\.text,[\s\S]*url:hosted\.shareUrl/.test(router)) {
  fail("Generic app sharing must carry the hosted URL as a real URL field.");
}
if (!router.includes('data-sq-share-download')) {
  fail("The explicit non-clickable image download must remain available.");
}

const publicComposer = router.match(/async function openPublicComposer\(provider\)([\s\S]*?)\n  async function sharePlayablePost/);
if (!publicComposer) fail("Public composer function could not be located.");
if (!publicComposer[1].includes("await ensureHostedShare()")) {
  fail("Public feed posting must require a hosted achievement page.");
}
if (!publicComposer[1].includes("composerUrl(provider,hosted)")) {
  fail("Public feed posting must route through the dedicated social composer map.");
}
if (publicComposer[1].includes("prepared.url") || publicComposer[1].includes("shareRoot")) {
  fail("Public feed posting must never fall back to the learner-login application URL.");
}

requireMarkers(routerCss,[
  ".achievement-share-router-v2",
  ".achievement-share-mode-group",
  ".achievement-share-mode-actions{",
  ".achievement-share-mode-actions.image-actions",
  ".achievement-share-secondary[hidden]"
],"Sharing router styles");

requireMarkers(loader,[
  'const SHARING_VERSION = "5.5.14.1"',
  'addStylesheet("sharing-router-css"',
  '`./achievement-sharing-router-v2.css?v=${SHARING_VERSION}`',
  '"achievement-sharing-router"',
  '`./achievement-sharing-router-v2.js?v=${SHARING_VERSION}`',
  '`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`',
  'sharingVersion:SHARING_VERSION'
],"Direct social-link sharing loader");

const routerLoadIndex = loader.indexOf('"achievement-sharing-router"');
const bridgeLoadIndex = loader.indexOf('"sharing"',routerLoadIndex + 1);
if (routerLoadIndex < 0 || bridgeLoadIndex < 0 || routerLoadIndex >= bridgeLoadIndex) {
  fail("The sharing router must load before the compatibility bridge.");
}

requireMarkers(worker,[
  '"./achievement-sharing-router-v2.js"',
  '"./achievement-sharing-router-v2.css"',
  '"./profile-emblem-control.js"',
  "self.skipWaiting()",
  "self.clients.claim()"
],"Installed-app sharing delivery");

requireMarkers(bridge,[
  "openAvatarCase(...args)",
  "compatibilityOnly:true, transportOwner:false"
],"Compatibility-only avatar bridge");
if (bridge.includes('document.addEventListener("click"')) {
  fail("The avatar bridge must not intercept sharing actions.");
}

console.log("Validated direct social-link sharing: Facebook always uses its URL-post composer, LinkedIn and X use dedicated link composers, generic app sharing carries a URL field, and image-only behavior remains download-only.");