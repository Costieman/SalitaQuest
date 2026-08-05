const CACHE_PREFIX = "salita-quest-sandbox-";
const CACHE_NAME = `${CACHE_PREFIX}runtime-deletion-pass-2`;
const CORE_FILES = [
  "./", "./index.html", "./app.html", "./bisaya.html", "./mobile-refresh.html",
  "./style.css", "./app.js", "./profile-shell.css",
  "./profile-install-prompt.css", "./profile-install-prompt.js",
  "./src/config/course-manifest.js", "./src/app/course-bootstrap.js",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png",
  "./audio/audio_manifest.json",
  "./languages/cebuano/course.json", "./languages/cebuano/modules/manifest.json",
  "./languages/cebuano/modules/introductions.json", "./languages/cebuano/modules/origin.json",
  "./languages/cebuano/modules/wellbeing.json", "./languages/cebuano/modules/questions.json",
  "./languages/cebuano/modules/food.json", "./languages/cebuano/modules/grammar.json",
  "./languages/cebuano/modules/verbs.json", "./languages/cebuano/modules/spanish.json",
  "./languages/cebuano/modules/code-switching.json",
  "./bisaya-review-regions.js", "./exercise-fixes.js"
];

function isAudio(url) {
  return url.origin === self.location.origin && /\.(?:mp3|m4a|ogg|wav)$/i.test(url.pathname);
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
  const match = /^bytes=(\d*)-(\d*)$/.exec(value || "");
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
  if (!range) return new Response(null, {status: 416, headers: {"Content-Range": `bytes */${buffer.byteLength}`}});
  const headers = new Headers(response.headers);
  headers.delete("Content-Encoding");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${buffer.byteLength}`);
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
