import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => { throw new Error(message); };
const requireMarkers = (source, markers, label) => markers.forEach(marker => {
  if (!source.includes(marker)) fail(`${label} is missing: ${marker}`);
});

const transport = read("achievement-sharing-image-transport-v1.js");
const bridge = read("achievement-sharing-avatar-bridge-v1.js");
const profileLoader = read("profile-emblem-control.js");
const serviceWorker = read("service-worker.js");

for (const [file, source] of [
  ["achievement-sharing-image-transport-v1.js", transport],
  ["achievement-sharing-avatar-bridge-v1.js", bridge],
  ["profile-emblem-control.js", profileLoader],
  ["service-worker.js", serviceWorker]
]) new vm.Script(source, {filename:file});

requireMarkers(transport, [
  'const RELEASE = "5.5.10-facebook-card-image"',
  'document.addEventListener("click", handleCapturedClick, true)',
  'document.addEventListener("salita:achievement-share-prepared"',
  'navigator.canShare?.({files:[file]})',
  'result = navigator.share(payload)',
  'files:[preparedFile]',
  'title:currentTitle()',
  'text:currentText()',
  'provider === "facebook" && isPhoneLike()',
  'provider === "instagram" || provider === "tiktok"',
  'The image is still finishing. Tap the share button again in a moment.',
  'Deliberately omit a URL when a PNG is attached',
  'fileOnlyPayload:true'
], "Image-first achievement transport");

const payloadMatch = transport.match(/const payload\s*=\s*\{([\s\S]*?)\n\s*\};/);
if (!payloadMatch) fail("The image transport payload could not be located.");
if (!/files\s*:\s*\[preparedFile\]/.test(payloadMatch[1])) fail("The native payload does not attach the prepared PNG.");
if (/\burl\s*:/.test(payloadMatch[1])) fail("The native image payload must not include a competing URL preview.");

requireMarkers(profileLoader, [
  'const SHARING_VERSION = "5.5.10.4"',
  '"achievement-image-transport"',
  '`./achievement-sharing-image-transport-v1.js?v=${SHARING_VERSION}`',
  '`./achievement-sharing-avatar-bridge-v1.js?v=${SHARING_VERSION}`',
  'sharingVersion:SHARING_VERSION'
], "Direct profile sharing delivery");

const transportLoadIndex = profileLoader.indexOf('"achievement-image-transport"');
const bridgeLoadIndex = profileLoader.indexOf('"sharing"', transportLoadIndex + 1);
if (transportLoadIndex < 0 || bridgeLoadIndex < 0 || transportLoadIndex >= bridgeLoadIndex) {
  fail("The image transport must load directly before the compatibility bridge.");
}

requireMarkers(serviceWorker, [
  'const SHARE_IMAGE_TRANSPORT_DELIVERY = "2026-08-02-direct-loader-1"',
  '"./profile-emblem-control.js"',
  '"./achievement-sharing-image-transport-v1.js"',
  '"./achievement-sharing-avatar-bridge-v1.js"',
  'self.skipWaiting()',
  'self.clients.claim()'
], "Installed-app sharing delivery");

requireMarkers(bridge, [
  'const IMAGE_TRANSPORT_SRC = "./achievement-sharing-image-transport-v1.js?v=5.5.10.2"',
  'function loadImageTransport()',
  'script.dataset.sqAchievementImageTransport = "v1"',
  'loadImageTransport()',
  'compatibilityOnly:true, imageTransport:true'
], "Achievement sharing compatibility loader");

if (bridge.includes('document.addEventListener("click"')) {
  fail("The avatar compatibility bridge must not intercept sharing clicks; the dedicated image transport owns that narrow responsibility.");
}
if (bridge.includes("window.SalitaQuestAchievementSharing =")) {
  fail("The compatibility bridge must not replace the unified achievement-sharing controller.");
}

console.log("Validated image-first mobile achievement sharing and installed-app delivery: PNG attachment, no competing URL preview, direct versioned loading, service-worker precaching, and compatibility-only fallback.");