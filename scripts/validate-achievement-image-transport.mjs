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

new vm.Script(transport, {filename:"achievement-sharing-image-transport-v1.js"});
new vm.Script(bridge, {filename:"achievement-sharing-avatar-bridge-v1.js"});

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

console.log("Validated image-first mobile achievement sharing: PNG attachment, no competing URL preview, prewarmed file payload, and compatibility-only loading.");
