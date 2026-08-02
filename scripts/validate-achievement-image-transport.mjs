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
const facebookFeed = read("facebook-feed-link-share-v1.js");
const bridge = read("achievement-sharing-avatar-bridge-v1.js");
const loader = read("profile-emblem-control.js");
const worker = read("service-worker.js");
const service = read("services/social-share/index-v2.js");
const servicePackage = JSON.parse(read("services/social-share/package.json"));

for (const [file,source] of [
  ["achievement-sharing-router-v2.js",router],
  ["facebook-feed-link-share-v1.js",facebookFeed],
  ["achievement-sharing-avatar-bridge-v1.js",bridge],
  ["profile-emblem-control.js",loader],
  ["service-worker.js",worker],
  ["services/social-share/index-v2.js",service]
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

requireMarkers(facebookFeed,[
  'const RELEASE = "5.5.11.2-facebook-feed-link"',
  'data-sq-share-feed="facebook"',
  'window.matchMedia?.("(pointer: coarse)")',
  'await router.ensureHostedShare()',
  'const shareText = `${description()}\\n\\n${shareUrl}`',
  'await navigator.share({',
  'text:shareText',
  'url:shareUrl',
  'Choose Facebook, then Feed.',
  'document.addEventListener("click", handleClick, true)'
],"Mobile Facebook feed transport");
if (/files\s*:/.test(facebookFeed)) fail("Mobile Facebook Feed must not attach the image file.");
if (!facebookFeed.includes("event.stopImmediatePropagation?.()")) fail("Mobile Facebook Feed must own its phone click before the desktop composer.");

const facebookFunction = router.match(/async function openPublicComposer\(provider\)([\s\S]*?)\n  async function sendPrivately/);
if (!facebookFunction) fail("Public composer function could not be located.");
if (facebookFunction[1].includes("prepared.url") || facebookFunction[1].includes("shareRoot")) {
  fail("Public feed posting must never fall back to the learner-login application URL.");
}
if (!facebookFunction[1].includes("await ensureHostedShare()")) fail("Public feed posting must require a hosted achievement page.");

requireMarkers(routerCss,[
  ".achievement-share-router-v2",
  ".achievement-share-mode-group",
  ".achievement-share-mode-actions{",
  ".achievement-share-mode-actions.image-actions",
  ".achievement-share-secondary[hidden]"
],"Explicit sharing router styles");
requireMarkers(router,[
  'class="achievement-share-mode-actions public-actions"',
  'class="achievement-share-mode-actions private-actions"',
  'class="achievement-share-mode-actions image-actions"'
],"Explicit sharing action groups");

requireMarkers(loader,[
  'const SHARING_VERSION = "5.5.11.2"',
  'addStylesheet("sharing-router-css"',
  '`./achievement-sharing-router-v2.css?v=${SHARING_VERSION}`',
  '"facebook-feed-link-share"',
  '`./facebook-feed-link-share-v1.js?v=${SHARING_VERSION}`',
  '"achievement-sharing-router"',
  '`./achievement-sharing-router-v2.js?v=${SHARING_VERSION}`',
  '`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`',
  'sharingVersion:SHARING_VERSION'
],"Primary sharing-router loader");
const feedLoadIndex = loader.indexOf('"facebook-feed-link-share"');
const routerLoadIndex = loader.indexOf('"achievement-sharing-router"');
const bridgeLoadIndex = loader.indexOf('"sharing"',routerLoadIndex + 1);
if (feedLoadIndex < 0 || routerLoadIndex < 0 || bridgeLoadIndex < 0 || !(feedLoadIndex < routerLoadIndex && routerLoadIndex < bridgeLoadIndex)) {
  fail("Mobile Facebook Feed must load before the shared router, which must load before the compatibility bridge.");
}
if (loader.includes("achievement-sharing-image-transport-v1.js")) fail("The primary loader must not load the retired automatic image transport.");

requireMarkers(worker,[
  'const FACEBOOK_FEED_LINK_DELIVERY = "2026-08-02-mobile-link-preview-1"',
  '"./facebook-feed-link-share-v1.js"',
  '"./achievement-sharing-router-v2.js"',
  '"./achievement-sharing-router-v2.css"',
  '"./profile-emblem-control.js"',
  '"./achievement-sharing-avatar-bridge-v1.js"',
  'self.skipWaiting()',
  'self.clients.claim()'
],"Installed-app sharing delivery");

requireMarkers(service,[
  'const SERVICE_VERSION = "5.5.11.2-meta-crawler-preview"',
  'crawlerPreview:true',
  '"X-Robots-Tag":"all"',
  '<meta name="robots" content="index,follow,max-image-preview:large">',
  '<link rel="image_src" href="${image}">',
  '<meta property="og:image:url" content="${image}">',
  '"Content-Length":String(buffer.length)',
  '"Accept-Ranges":"bytes"',
  '"Cross-Origin-Resource-Policy":"cross-origin"',
  'res.status(206)',
  'req.method === "HEAD"'
],"Meta crawler compatible service");
if (/noindex|nofollow/.test(service)) fail("Hosted achievement pages must not block Meta's crawler.");
if (servicePackage.scripts?.start !== "node index-v2.js" || servicePackage.scripts?.check !== "node --check index-v2.js") {
  fail("Cloud Run must start and syntax-check the crawler-compatible service entry point.");
}

requireMarkers(bridge,[
  'const RELEASE = "5.5.11-explicit-sharing-router"',
  'openAvatarCase(...args)',
  'compatibilityOnly:true, transportOwner:false'
],"Compatibility-only avatar bridge");
if (bridge.includes('document.addEventListener("click"')) fail("The avatar bridge must not intercept sharing actions.");
if (bridge.includes("window.SalitaQuestAchievementSharing =")) fail("The avatar bridge must not replace the unified card controller.");

console.log("Validated sharing release: Android Facebook Feed receives a hosted URL without an image attachment, desktop composers remain hosted-only, private sharing remains link-only, image sharing remains PNG-only, Meta crawler responses are indexable and range-capable, and PWA delivery is versioned.");
