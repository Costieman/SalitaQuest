const CACHE_NAME = "salita-quest-v5-4-clean-topbar-r27";
const STATIC_FILES = [
  "./", "./index.html", "./app.html", "./bisaya.html", "./bisaya-app-loader.js", "./bisaya-review-regions.js", "./bisaya-review-regions.css", "./ui-quality-fixes.js", "./ui-quality-fixes.css", "./ui-answer-breakdown.css", "./incorrect-order-feedback.js", "./incorrect-order-feedback.css", "./compact-desktop-layout.js", "./compact-desktop-layout.css", "./compact-home-dashboard.css", "./weekly-avatar-chest.js", "./weekly-avatar-polish.js", "./weekly-avatar-chest.css", "./clean-topbar.js", "./clean-topbar.css", "./mastery-feedback.js", "./mastery-feedback.css", "./mastery-console-overrides.css", "./profile-shell.css", "./profile-app.js", "./progression-v54.js", "./exercise-fixes-v545.js",
  "./style.css", "./app.js", "./languages/cebuano/course.json", "./languages/cebuano/README.md", "./languages/cebuano/modules/manifest.json", "./languages/cebuano/modules/introductions.json", "./languages/cebuano/modules/origin.json", "./languages/cebuano/modules/wellbeing.json", "./languages/cebuano/modules/questions.json", "./languages/cebuano/modules/food.json", "./languages/cebuano/modules/grammar.json", "./languages/cebuano/modules/verbs.json", "./languages/cebuano/modules/spanish.json", "./languages/cebuano/modules/code-switching.json", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png",
  "./avatars/tarsier.png", "./avatars/eagle.png", "./avatars/tamaraw.png", "./avatars/peacock.png",
  "./avatars/orchid.png", "./avatars/jade.png", "./avatars/rafflesia.png", "./avatars/anahaw.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(STATIC_FILES.map(file => cache.add(file)))
    )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok || response.type === "opaque") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          if (url.pathname.endsWith("/bisaya.html")) return caches.match("./bisaya.html");
          if (url.pathname.endsWith("/app.html")) return caches.match("./app.html");
          return caches.match("./index.html");
        }
        return Response.error();
      })
  );
});