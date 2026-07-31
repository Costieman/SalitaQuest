const PREVIOUS_CACHE_NAME = "salita-quest-v5-5-avatar-progression-r43";
const CACHE_NAME = "salita-quest-v5-5-1-avatar-hotfix-r44";
// Compatibility marker for release-5.5 validation: const CACHE_NAME = "salita-quest-v5-5-avatar-progression-r43";

const CORE_FILES = [
  "./",
  "./index.html",
  "./app.html",
  "./bisaya.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./profile-shell.css",
  "./profile-app.js",
  "./profile-emblem-control.js",
  "./profile-emblem-control.css"
];

const APP_ENHANCEMENTS = [
  "./bisaya-app-loader.js",
  "./bisaya-review-regions.js",
  "./bisaya-review-regions.css",
  "./ui-quality-fixes.js",
  "./ui-quality-fixes.css",
  "./ui-answer-breakdown.css",
  "./incorrect-order-feedback.js",
  "./incorrect-order-feedback.css",
  "./compact-desktop-layout.js",
  "./compact-desktop-layout.css",
  "./compact-home-dashboard.css",
  "./weekly-avatar-chest.js",
  "./weekly-avatar-polish.js",
  "./weekly-avatar-chest.css",
  "./daily-goal-refinement.js",
  "./key-run-refinement.js",
  "./even-progress-rail.js",
  "./world-progress-status.css",
  "./clean-topbar.js",
  "./clean-topbar.css",
  "./mastery-feedback.js",
  "./mastery-feedback.css",
  "./mastery-console-overrides.css",
  "./lesson-side-launcher.js",
  "./lesson-side-launcher.css",
  "./mobile-session-refinement.js",
  "./mobile-session-refinement.css",
  "./level-progression-v2.js",
  "./level-progression-v2.css",
  "./fluid-desktop-app.css",
  "./adaptive-scenarios.js",
  "./adaptive-scenarios.css",
  "./desktop-navigation-refinement.js",
  "./desktop-navigation-refinement.css",
  "./pronunciation-release-control.js",
  "./home-reward-coordinator.js",
  "./badge-catalogue-v2.js",
  "./badge-catalogue-v2.css",
  "./badge-layout-v3.css",
  "./badge-chest-v2.js",
  "./badge-chest-v2.css",
  "./placement-onboarding-v1.js",
  "./placement-onboarding-v1.css",
  "./social-connections-v2.js",
  "./social-connections-v2.css",
  "./achievement-sharing-v4.js",
  "./achievement-sharing-v4.css",
  "./progression-v54.js",
  "./exercise-fixes-v545.js"
];

const AVATAR_PROGRESSION_FILES = [
  "./avatar-catalogue-v1.js",
  "./avatar-progression-hotfix-v551.js",
  "./avatar-progression-hotfix-v551.css",
  "./avatar-progression-migration-v1.js",
  "./avatar-collection-screen-v1.js",
  "./avatar-collection-screen-v1.css",
  "./weekly-avatar-shard-rewards-v1.js",
  "./weekly-avatar-shard-rewards-v1.css",
  "./level-avatar-rewards-v1.js",
  "./avatar-unlock-celebration-v1.js",
  "./avatar-unlock-celebration-v1.css",
  "./achievement-sharing-avatar-bridge-v1.js"
];

const COURSE_FILES = [
  "./languages/cebuano/course.json",
  "./languages/cebuano/README.md",
  "./languages/cebuano/modules/manifest.json",
  "./languages/cebuano/modules/introductions.json",
  "./languages/cebuano/modules/origin.json",
  "./languages/cebuano/modules/wellbeing.json",
  "./languages/cebuano/modules/questions.json",
  "./languages/cebuano/modules/food.json",
  "./languages/cebuano/modules/grammar.json",
  "./languages/cebuano/modules/verbs.json",
  "./languages/cebuano/modules/spanish.json",
  "./languages/cebuano/modules/code-switching.json"
];

const AVATAR_FILES = [
  "./avatars/eagle.png",
  "./avatars/tamaraw.png",
  "./avatars/anahaw.png",
  "./avatars/peacock.png",
  "./avatars/orchid.png",
  "./avatars/jade.png",
  "./avatars/rafflesia.png",
  "./avatars/tarsier.png",
  "./avatars/narra.png",
  "./avatars/nipa.png",
  "./avatars/buri.png",
  "./avatars/almaciga.png",
  "./avatars/pandan.png",
  "./avatars/bakawan.png",
  "./avatars/kawayang-tinik.png",
  "./avatars/pili.png",
  "./avatars/katmon.png",
  "./avatars/medinilla.png",
  "./avatars/philippine-teak.png",
  "./avatars/banaba.png",
  "./avatars/mangkono.png",
  "./avatars/attenborough-pitcher.png",
  "./avatars/slipper-orchid.png",
  "./avatars/philippine-hoya.png",
  "./avatars/parol.svg",
  "./avatars/vinta.svg",
  "./avatars/kulintang.svg",
  "./avatars/bangka.svg",
  "./avatars/jeepney.svg",
  "./avatars/bahay-kubo.svg",
  "./avatars/sarimanok.svg",
  "./avatars/golden-salita-crest.svg",
  "./avatars/philippine-pangolin.webp",
  "./avatars/visayan-spotted-deer.webp",
  "./avatars/visayan-warty-pig.webp",
  "./avatars/philippine-crocodile.webp",
  "./avatars/philippine-forest-turtle.webp",
  "./avatars/philippine-sailfin-lizard.webp",
  "./avatars/golden-crowned-flying-fox.webp",
  "./avatars/philippine-colugo.webp",
  "./avatars/rare-animals-set2-sprite.png",
  "./avatars/philippine-cockatoo.svg",
  "./avatars/rufous-hornbill.svg",
  "./avatars/luzon-bleeding-heart-dove.svg",
  "./avatars/cebu-flowerpecker.svg",
  "./avatars/philippine-eagle-owl.svg",
  "./avatars/whale-shark-butanding.svg",
  "./avatars/dugong.svg",
  "./avatars/hawksbill-sea-turtle.svg"
];

const STATIC_FILES = [
  ...CORE_FILES,
  ...APP_ENHANCEMENTS,
  ...AVATAR_PROGRESSION_FILES,
  ...COURSE_FILES,
  ...AVATAR_FILES
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(STATIC_FILES.map(file => cache.add(file))))
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
        const cached = await caches.match(event.request, {ignoreSearch:true});
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