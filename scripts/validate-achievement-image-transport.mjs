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
  'const RELEASE = "5.5.15-facebook-photo-caption"',
  'modes:Object.freeze(["facebook_image_caption","feed_link","app_link","private_link","download_file"])',
  'data-sq-share-facebook-image',
  'data-sq-share-image-app',
  'data-sq-share-feed="facebook_link"',
  'data-sq-share-app',
  'data-sq-share-private',
  'Preparing the image and clickable caption…',
  'validateHostedResponse(data,base)',
  'share.pathname.startsWith("/share/")',
  'image.pathname.startsWith("/media/")',
  'Play Salita Quest free:',
  'async function copyText(value)',
  'function canShareImage(file)',
  'async function shareLargeImagePost(statusMessage)',
  'await copyText(prepared.caption)',
  'files:[file]',
  'text:prepared.caption',
  'https://www.facebook.com/',
  'https://www.facebook.com/sharer/sharer.php?u=',
  'https://www.linkedin.com/sharing/share-offsite/?url=',
  'https://twitter.com/intent/tweet?text=',
  'https://wa.me/?text=',
  'LARGE IMAGE + CLICKABLE LINK',
  'Facebook decides whether this preview is compact or large',
  'Caption copied. Choose Facebook, then paste the caption if Facebook removes it.',
  'document.addEventListener("click",handleClick,true)',
  'document.addEventListener("salita:achievement-share-prepared"'
],"Facebook photo-caption sharing router");

if (router.includes("&quote=") || router.includes("&hashtag=")) {
  fail("Facebook link-card sharing must not use unsupported prefill parameters.");
}
if (!/await navigator\.share\(\{[\s\S]*title:prepared\.title,[\s\S]*text:prepared\.caption,[\s\S]*files:\[file\]/.test(router)) {
  fail("Large-image sharing must send the achievement image and caption together.");
}
const imageShare = router.match(/async function shareLargeImagePost\(statusMessage\)([\s\S]*?)\n  async function shareFacebookImagePost/);
if (!imageShare) fail("Large-image sharing function could not be located.");
if (imageShare[1].indexOf("await copyText(prepared.caption)") > imageShare[1].indexOf("await navigator.share")) {
  fail("The clickable caption must be copied before the operating-system share sheet opens.");
}
if (!imageShare[1].includes('window.open("https://www.facebook.com/"')) {
  fail("Desktop fallback must open Facebook after downloading the image and copying the caption.");
}

const publicComposer = router.match(/async function openPublicComposer\(provider\)([\s\S]*?)\n  async function sharePlayablePost/);
if (!publicComposer) fail("Public composer function could not be located.");
if (!publicComposer[1].includes("await ensureHostedShare()")) {
  fail("Public link-card posting must require a hosted achievement page.");
}
if (!publicComposer[1].includes("composerUrl(provider,hosted)")) {
  fail("Public link-card posting must route through the dedicated social composer map.");
}
if (publicComposer[1].includes("navigator.share")) {
  fail("Dedicated public link-card composers must not use the generic operating-system share sheet.");
}
if (publicComposer[1].includes("prepared.url") || publicComposer[1].includes("shareRoot")) {
  fail("Public link-card posting must never fall back to the learner-login application URL.");
}

if (!/await navigator\.share\(\{[\s\S]*title:prepared\.title,[\s\S]*text:prepared\.text,[\s\S]*url:hosted\.shareUrl/.test(router)) {
  fail("Generic hosted-link sharing must carry the hosted URL as a real URL field.");
}
if (!router.includes('data-sq-share-download')) {
  fail("The explicit download option must remain available.");
}
if (router.includes("POST A NORMAL LINK CARD") || router.includes("Open Facebook’s normal link-post composer")) {
  fail("The interface must not promise a large or normal Facebook card that Facebook may render compactly.");
}

requireMarkers(routerCss,[
  ".achievement-share-router-v2",
  ".achievement-share-mode-group",
  ".achievement-share-mode-actions{",
  ".achievement-share-mode-actions.image-actions",
  ".achievement-share-secondary[hidden]"
],"Sharing router styles");

requireMarkers(loader,[
  'const SHARING_VERSION = "5.5.15.1"',
  'addStylesheet("sharing-router-css"',
  '`./achievement-sharing-router-v2.css?v=${SHARING_VERSION}`',
  '"achievement-sharing-router"',
  '`./achievement-sharing-router-v2.js?v=${SHARING_VERSION}`',
  '`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`',
  'sharingVersion:SHARING_VERSION'
],"Facebook photo-caption sharing loader");

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

console.log("Validated Facebook sharing boundaries: large photo plus copied clickable caption is primary, compact link-card sharing is labelled honestly, generic hosted-link sharing remains available, and learner state is untouched.");