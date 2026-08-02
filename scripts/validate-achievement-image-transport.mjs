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
  'const RELEASE = "5.5.13-facebook-link-card"',
  'modes:Object.freeze(["feed_link","app_link","private_link","download_file"])',
  'data-sq-share-feed="facebook"',
  'data-sq-share-app',
  'data-sq-share-private',
  'data-sq-hosted-action',
  'Preparing the card and playable link…',
  'setHostedActionsReady(true)',
  'ensureHostedShare().catch(() => {})',
  'if (provider === "facebook" && hasMobileNativeShare())',
  'await navigator.share(nativeLinkPayload(hosted))',
  'Choose Facebook, then Feed',
  'https://www.facebook.com/sharer/sharer.php?u=',
  'https://www.linkedin.com/sharing/share-offsite/?url=',
  'https://twitter.com/intent/tweet?text=',
  'https://wa.me/?text=',
  'POST WITH A CARD + PLAY LINK',
  'Choose Messenger or another messaging app',
  'document.addEventListener("click",handleClick,true)',
  'document.addEventListener("salita:achievement-share-prepared"'
],"Facebook link-card sharing router");

if (/navigator\.share\(\{[^}]*files:/.test(router)) fail("No feed or private route may degrade into an image-only attachment.");
if (!router.includes('data-sq-share-download')) fail("The explicit non-clickable image download must remain available.");

const facebookFunction = router.match(/async function openPublicComposer\(provider\)([\s\S]*?)\n  async function sharePlayablePost/);
if (!facebookFunction) fail("Facebook public composer function could not be located.");
const mobileBranch = facebookFunction[1].indexOf('provider === "facebook" && hasMobileNativeShare()');
const nativeShare = facebookFunction[1].indexOf('navigator.share(nativeLinkPayload(hosted))');
const legacyComposer = facebookFunction[1].indexOf('facebook.com/sharer/sharer.php');
if (mobileBranch < 0 || nativeShare <= mobileBranch) fail("Mobile Facebook must use the hosted link-only native share payload.");
if (legacyComposer <= nativeShare) fail("The legacy Facebook web composer must remain desktop fallback only.");
if (!facebookFunction[1].includes("const hosted = requireHosted();")) fail("Facebook posting must use an already-prepared hosted link without an upload after the tap.");

const preparedHandler = router.match(/document\.addEventListener\("salita:achievement-share-prepared"([\s\S]*?)\n  \}\);/);
if (!preparedHandler || !preparedHandler[1].includes("ensureHostedShare().catch")) fail("The hosted card must prewarm when the share window opens.");
if (!preparedHandler[1].includes("setHostedActionsReady(false)")) fail("Hosted actions must remain disabled until the card link is ready.");

requireMarkers(routerCss,[
  ".achievement-share-router-v2",
  ".achievement-share-mode-group",
  ".achievement-share-mode-actions{",
  ".achievement-share-mode-actions.image-actions",
  ".achievement-share-secondary[hidden]"
],"Sharing router styles");

requireMarkers(loader,[
  'const SHARING_VERSION = "5.5.13.1"',
  'addStylesheet("sharing-router-css"',
  '`./achievement-sharing-router-v2.css?v=${SHARING_VERSION}`',
  '"achievement-sharing-router"',
  '`./achievement-sharing-router-v2.js?v=${SHARING_VERSION}`',
  '`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`',
  'sharingVersion:SHARING_VERSION'
],"Facebook link-card loader");

const routerLoadIndex = loader.indexOf('"achievement-sharing-router"');
const bridgeLoadIndex = loader.indexOf('"sharing"',routerLoadIndex + 1);
if (routerLoadIndex < 0 || bridgeLoadIndex < 0 || routerLoadIndex >= bridgeLoadIndex) fail("The sharing router must load before the compatibility bridge.");

requireMarkers(worker,[
  '"./achievement-sharing-router-v2.js"',
  '"./achievement-sharing-router-v2.css"',
  '"./profile-emblem-control.js"',
  'self.skipWaiting()',
  'self.clients.claim()'
],"Installed-app sharing delivery");

requireMarkers(bridge,[
  'openAvatarCase(...args)',
  'compatibilityOnly:true, transportOwner:false'
],"Compatibility-only avatar bridge");
if (bridge.includes('document.addEventListener("click"')) fail("The avatar bridge must not intercept sharing actions.");

console.log("Validated Facebook acquisition posts: hosted card prewarms before the tap, mobile Facebook receives a link-only native payload, desktop retains a link composer fallback, Messenger remains available, and image-only behavior is restricted to download.");