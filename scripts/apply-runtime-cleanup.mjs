import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const absolute = value => path.join(ROOT, value);

const RENAMES = new Map([
  ["achievement-sharing-v4.css", "achievement-sharing.css"],
  ["achievement-sharing-v4.js", "achievement-sharing.js"],
  ["avatar-card-actions-v1.js", "avatar-card-actions.js"],
  ["avatar-case-page-tab-v1.css", "avatar-case-page-tab.css"],
  ["avatar-case-page-tab-v1.js", "avatar-case-page-tab.js"],
  ["avatar-collection-page-v2.css", "avatar-collection-page.css"],
  ["avatar-collection-page-v2.js", "avatar-collection-page.js"],
  ["badge-catalogue-v2.css", "badge-catalogue.css"],
  ["badge-catalogue-v2.js", "badge-catalogue.js"],
  ["badge-chest-v2.css", "badge-chest.css"],
  ["badge-chest-v2.js", "badge-chest.js"],
  ["badge-layout-v3.css", "badge-layout.css"],
  ["daily-key-weekday-reconciliation-v1.js", "daily-key-weekday-reconciliation.js"],
  ["exercise-fixes-v545.js", "exercise-fixes.js"],
  ["level-progression-v2.css", "level-progression.css"],
  ["level-progression-v2.js", "level-progression.js"],
  ["mystery-rarity-roll-v1.js", "mystery-rarity-roll.js"],
  ["placement-onboarding-v1.css", "placement-onboarding.css"],
  ["placement-onboarding-v1.js", "placement-onboarding.js"],
  ["profile-install-prompt-v1.css", "profile-install-prompt.css"],
  ["profile-install-prompt-v1.js", "profile-install-prompt.js"],
  ["progression-v54.js", "progression.js"],
  ["social-connections-v2.css", "social-connections.css"],
  ["social-connections-v2.js", "social-connections.js"],
  ["topbar-world-progress-hotfix.css", "topbar-world-progress.css"],
  ["universal-share-simplifier-v1.css", "universal-share-simplifier.css"],
  ["universal-share-simplifier-v1.js", "universal-share-simplifier.js"],
  ["weekly-avatar-projected-unlock-fix-v1.js", "weekly-avatar-projected-unlock.js"],
  ["src/adapters/exercise/incorrect-order-feedback-runtime-v1.js", "src/adapters/exercise/incorrect-order-feedback-runtime.js"],
  ["src/features/avatar/avatar-catalogue-v1.js", "src/features/avatar/avatar-catalogue.js"],
  ["src/features/interface/collection-key-translation-hotfix.js", "src/features/interface/collection-key-translation.js"],
  ["src/features/interface/level-up-mobile-safety-v552.js", "src/features/interface/level-up-mobile-safety.js"],
  ["src/features/interface/popup-governor-v1.js", "src/features/interface/popup-governor.js"]
]);

const DELETE_FILES = [
  "achievement-sharing-avatar-bridge-v1.js",
  "achievement-sharing-image-transport-v1.js",
  "achievement-sharing-router-v2.css",
  "achievement-sharing-router-v2.js",
  "achievement-sharing-router-v3.js",
  "avatar-artwork-registry-v554.js",
  "avatar-case-mobile-flow-hotfix-v1.css",
  "avatar-case-v1.css",
  "avatar-case-v1.js",
  "avatar-catalogue-v1.js",
  "avatar-collection-rarity-fill-v1.css",
  "avatar-collection-screen-v1.css",
  "avatar-collection-screen-v1.js",
  "avatar-collection-summary-v1.css",
  "avatar-collection-summary-v1.js",
  "avatar-collection-tabs-phase6-1-v1.css",
  "avatar-collection-tabs-phase6-1-v1.js",
  "avatar-progression-hotfix-v551.css",
  "avatar-progression-hotfix-v551.js",
  "avatar-progression-migration-v1.js",
  "avatar-unlock-celebration-v1.css",
  "avatar-unlock-celebration-v1.js",
  "clean-topbar.js",
  "coin-avatar-reveal-rarity-v1.css",
  "coin-avatar-shard-shop-v1.css",
  "coin-avatar-shard-shop-v1.js",
  "coin-avatar-shop-badges-v1.js",
  "coin-avatar-shop-reveal-v1.css",
  "coin-avatar-shop-reveal-v1.js",
  "coin-avatar-shop-topbar-v1.css",
  "coin-avatar-shop-topbar-v1.js",
  "coin-testing-grant-100k-v1.js",
  "coin-testing-grant-50k-phase5-v1.js",
  "collection-key-translation-hotfix.js",
  "compact-desktop-layout.js",
  "economy-tracking-phase6-v1.css",
  "economy-tracking-phase6-v1.js",
  "even-progress-rail.js",
  "facebook-share-link-v1.js",
  "home-reward-coordinator.js",
  "level-avatar-rewards-v1.js",
  "level-up-mobile-safety-v552.js",
  "long-term-badges-v1.js",
  "popup-governor-v1.js",
  "profile-shell.js",
  "pronunciation-release-control.js",
  "src/adapters/avatar/avatar-case-profile-runtime-v1.js",
  "src/adapters/badges/badge-catalogue-runtime-v1.js",
  "src/adapters/badges/coin-shop-badge-runtime-v1.js",
  "src/adapters/navigation/avatar-collections-navigation-v551.js",
  "src/features/avatar/avatar-artwork-registry-v554.js",
  "src/features/avatar/avatar-case-v1.js",
  "src/features/avatar/avatar-collection-summary-v1.js",
  "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
  "src/features/avatar/avatar-progression-migration-v1.js",
  "src/features/avatar/avatar-progression-model-v551.js",
  "src/features/avatar/level-avatar-rewards-v1.js",
  "src/features/badges/long-term-badges-v1.js",
  "src/features/economy/coin-avatar-shop-badges-v1.js",
  "src/features/economy/economy-tracking-phase6-v1.js",
  "src/features/sharing/achievement-sharing-router-v3.js",
  "src/features/sharing/facebook-share-link-v1.js",
  "weekly-avatar-shard-rewards-v1.css",
  "weekly-avatar-shard-rewards-v1.js"
];

const TEXT_EXTENSIONS = new Set([
  ".css", ".html", ".js", ".json", ".md", ".mjs", ".txt", ".webmanifest", ".yaml", ".yml"
]);

function walk(directory = ROOT) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "audit") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target));
    else files.push(path.relative(ROOT, target).split(path.sep).join("/"));
  }
  return files;
}

function renameRuntimeFiles() {
  for (const [from, to] of RENAMES) {
    const source = absolute(from);
    const destination = absolute(to);
    if (!fs.existsSync(source)) {
      if (!fs.existsSync(destination)) throw new Error(`Missing rename source and destination: ${from}`);
      continue;
    }
    if (fs.existsSync(destination)) throw new Error(`Rename destination already exists: ${to}`);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.renameSync(source, destination);
  }
}

function deleteDeadFiles() {
  for (const file of DELETE_FILES) {
    const target = absolute(file);
    if (fs.existsSync(target)) fs.rmSync(target);
  }
}

function replaceRuntimeReferences() {
  for (const file of walk()) {
    if (file === "scripts/apply-runtime-cleanup.mjs") continue;
    if (!TEXT_EXTENSIONS.has(path.posix.extname(file).toLowerCase())) continue;
    let source = fs.readFileSync(absolute(file), "utf8");
    let changed = false;
    for (const [from, to] of RENAMES) {
      const replacements = [[from, to]];
      const oldName = path.posix.basename(from);
      const newName = path.posix.basename(to);
      if (oldName !== from || newName !== to) replacements.push([oldName, newName]);
      for (const [oldValue, newValue] of replacements) {
        if (!source.includes(oldValue)) continue;
        source = source.split(oldValue).join(newValue);
        changed = true;
      }
    }
    const revised = source.replace(/\?v=[0-9]+(?:\.[0-9]+)*(?:[-._a-z0-9]*)?/gi, "?v=sandbox-deletion-pass-1");
    if (revised !== source) {
      source = revised;
      changed = true;
    }
    if (changed) fs.writeFileSync(absolute(file), source);
  }
}

function updateAuditRoots() {
  const file = "scripts/audit-runtime-assets.mjs";
  let source = fs.readFileSync(absolute(file), "utf8");
  source = source.replace(
    'const COURSE_SHELL_ASSETS = ["app.js", "style.css"];',
    'const COURSE_SHELL_ASSETS = ["app.js", "style.css", "mobile-refresh.html", "profile-install-prompt.js", "profile-install-prompt.css"];'
  );
  fs.writeFileSync(absolute(file), source);
}

function writeServiceWorker() {
  const source = `const CACHE_PREFIX = "salita-quest-sandbox-";
const CACHE_NAME = \`${'${CACHE_PREFIX}'}runtime-deletion-pass-1\`;
const CORE_FILES = [
  "./", "./index.html", "./app.html", "./bisaya.html", "./mobile-refresh.html",
  "./style.css", "./app.js", "./profile-shell.css",
  "./profile-install-prompt.css", "./profile-install-prompt.js",
  "./src/config/course-manifest.js", "./src/app/course-bootstrap.js",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png",
  "./audio/audio_manifest.json"
];

function isAudio(url) {
  return url.origin === self.location.origin && /\\.(?:mp3|m4a|ogg|wav)$/i.test(url.pathname);
}

function isProfileNavigation(request, url) {
  if (request.mode !== "navigate" || url.origin !== self.location.origin) return false;
  return url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
}

async function withInstallControl(response) {
  if (!response || !response.ok || !String(response.headers.get("content-type") || "").includes("text/html")) return response;
  const html = await response.text();
  if (html.includes("profile-install-prompt.js")) return new Response(html, {
    status: response.status, statusText: response.statusText, headers: response.headers
  });
  const enhanced = html
    .replace("</head>", '<link rel="stylesheet" href="./profile-install-prompt.css?v=sandbox-deletion-pass-1"></head>')
    .replace("</body>", '<script src="./profile-install-prompt.js?v=sandbox-deletion-pass-1"></script></body>');
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(enhanced, {status: response.status, statusText: response.statusText, headers});
}

function parseRange(value, length) {
  const match = /^bytes=(\\d*)-(\\d*)$/.exec(value || "");
  if (!match) return null;
  let start = match[1] === "" ? null : Number(match[1]);
  let end = match[2] === "" ? null : Number(match[2]);
  if (start === null) {
    const suffix = end;
    if (!Number.isInteger(suffix) || suffix <= 0) return null;
    start = Math.max(0, length - suffix);
    end = length - 1;
  } else {
    if (!Number.isInteger(start) || start < 0 || start >= length) return null;
    if (end === null || end >= length) end = length - 1;
    if (!Number.isInteger(end) || end < start) return null;
  }
  return {start, end};
}

async function ranged(response, header) {
  const buffer = await response.arrayBuffer();
  const range = parseRange(header, buffer.byteLength);
  if (!range) return new Response(null, {status: 416, headers: {"Content-Range": \`bytes */${'${buffer.byteLength}'}\`}});
  const headers = new Headers(response.headers);
  headers.delete("Content-Encoding");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", \`bytes ${'${range.start}'}-${'${range.end}'}/${'${buffer.byteLength}'}\`);
  headers.set("Content-Length", String(range.end - range.start + 1));
  return new Response(buffer.slice(range.start, range.end + 1), {status: 206, statusText: "Partial Content", headers});
}

async function audioCacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const key = new Request(request.url, {method: "GET", credentials: "same-origin"});
  let response = await cache.match(key, {ignoreSearch: true});
  if (!response) {
    const headers = new Headers(request.headers);
    headers.delete("Range");
    response = await fetch(new Request(request.url, {
      method: "GET", headers, credentials: request.credentials, mode: "same-origin", cache: "reload", redirect: "follow"
    }));
    if (response.ok && response.status === 200) await cache.put(key, response.clone());
  }
  const rangeHeader = request.headers.get("Range");
  return rangeHeader && response.status === 200 ? ranged(response, rangeHeader) : response;
}

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(CORE_FILES.map(file => cache.add(file)))));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) return;

  if (isAudio(url)) {
    event.respondWith(audioCacheFirst(request).catch(async () =>
      (await caches.match(request, {ignoreSearch: true})) || Response.error()
    ));
    return;
  }

  const networkRequest = url.origin === self.location.origin ? new Request(request, {cache: "reload"}) : request;
  event.respondWith(fetch(networkRequest)
    .then(async response => {
      const delivered = isProfileNavigation(request, url) ? await withInstallControl(response) : response;
      if (delivered.ok || delivered.type === "opaque") {
        const copy = delivered.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return delivered;
    })
    .catch(async () => {
      let cached = await caches.match(request, {ignoreSearch: true});
      if (cached && isProfileNavigation(request, url)) cached = await withInstallControl(cached);
      if (cached) return cached;
      if (request.mode !== "navigate") return Response.error();
      if (url.pathname.endsWith("/bisaya.html")) return caches.match("./bisaya.html");
      if (url.pathname.endsWith("/app.html")) return caches.match("./app.html");
      if (url.pathname.endsWith("/mobile-refresh.html")) return caches.match("./mobile-refresh.html");
      const profile = await caches.match("./index.html");
      return profile ? withInstallControl(profile) : Response.error();
    }));
});
`;
  fs.writeFileSync(absolute("service-worker.js"), source);
}

function writeReport() {
  const report = [
    "# Runtime deletion pass",
    "",
    "This sandbox branch follows the browser runtime graph rooted at `index.html`, `app.html`, and `bisaya.html`, including manifest-injected and service-worker-injected dependencies.",
    "",
    `- Deleted unreachable browser JS/CSS: ${DELETE_FILES.length}`,
    `- Renamed live components to stable filenames: ${RENAMES.size}`,
    "- Replaced the historical service-worker precache inventory with a small core cache plus cache-on-use.",
    "- Sandbox cache deletion is restricted to cache names beginning with `salita-quest-sandbox-`.",
    "",
    "Git history now carries component evolution; filenames describe components rather than release stages.",
    ""
  ].join("\n");
  fs.mkdirSync(absolute("docs"), {recursive: true});
  fs.writeFileSync(absolute("docs/runtime-deletion-pass.md"), report);
}

renameRuntimeFiles();
deleteDeadFiles();
replaceRuntimeReferences();
updateAuditRoots();
writeServiceWorker();
writeReport();

console.log(`Deleted ${DELETE_FILES.length} unreachable files and normalized ${RENAMES.size} live component filenames.`);
