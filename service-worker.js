const PREVIOUS_CACHE_NAME = "salita-quest-v5-5-4-avatar-artwork-r47";
const CACHE_NAME = "salita-quest-v5-5-6-canonical-avatars-r48";

const CORE_FILES = [
  "./", "./index.html", "./app.html", "./bisaya.html", "./mobile-refresh.html",
  "./style.css", "./app.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png",
  "./profile-shell.css", "./profile-app.js", "./profile-emblem-control.js", "./profile-emblem-control.css"
];

const APP_ENHANCEMENTS = [
  "./bisaya-app-loader.js", "./bisaya-review-regions.js", "./bisaya-review-regions.css",
  "./ui-quality-fixes.js", "./ui-quality-fixes.css", "./ui-answer-breakdown.css",
  "./incorrect-order-feedback.js", "./incorrect-order-feedback.css", "./compact-desktop-layout.js",
  "./compact-desktop-layout.css", "./compact-home-dashboard.css", "./weekly-avatar-chest.js",
  "./weekly-avatar-polish.js", "./weekly-avatar-chest.css", "./daily-goal-refinement.js",
  "./key-run-refinement.js", "./even-progress-rail.js", "./world-progress-status.css",
  "./clean-topbar.js", "./clean-topbar.css", "./mastery-feedback.js", "./mastery-feedback.css",
  "./mastery-console-overrides.css", "./lesson-side-launcher.js", "./lesson-side-launcher.css",
  "./mobile-session-refinement.js", "./mobile-session-refinement.css", "./popup-governor-v1.js",
  "./level-progression-v2.js", "./level-progression-v2.css", "./level-up-mobile-safety-v552.js",
  "./fluid-desktop-app.css", "./adaptive-scenarios.js", "./adaptive-scenarios.css",
  "./desktop-navigation-refinement.js", "./desktop-navigation-refinement.css",
  "./pronunciation-release-control.js", "./home-reward-coordinator.js", "./badge-catalogue-v2.js",
  "./badge-catalogue-v2.css", "./badge-layout-v3.css", "./badge-chest-v2.js", "./badge-chest-v2.css",
  "./placement-onboarding-v1.js", "./placement-onboarding-v1.css", "./social-connections-v2.js",
  "./social-connections-v2.css", "./achievement-sharing-v4.js", "./achievement-sharing-v4.css",
  "./progression-v54.js", "./exercise-fixes-v545.js"
];

const AVATAR_PROGRESSION_FILES = [
  "./avatars/canonical/manifest.json", "./avatar-catalogue-v1.js", "./avatar-artwork-registry-v554.js",
  "./avatar-progression-hotfix-v551.js", "./avatar-progression-hotfix-v551.css",
  "./avatar-progression-migration-v1.js", "./avatar-collection-screen-v1.js", "./avatar-collection-screen-v1.css",
  "./weekly-avatar-shard-rewards-v1.js", "./weekly-avatar-shard-rewards-v1.css",
  "./level-avatar-rewards-v1.js", "./avatar-unlock-celebration-v1.js", "./avatar-unlock-celebration-v1.css",
  "./achievement-sharing-avatar-bridge-v1.js"
];

const COURSE_FILES = [
  "./languages/cebuano/course.json", "./languages/cebuano/README.md", "./languages/cebuano/modules/manifest.json",
  "./languages/cebuano/modules/introductions.json", "./languages/cebuano/modules/origin.json",
  "./languages/cebuano/modules/wellbeing.json", "./languages/cebuano/modules/questions.json",
  "./languages/cebuano/modules/food.json", "./languages/cebuano/modules/grammar.json",
  "./languages/cebuano/modules/verbs.json", "./languages/cebuano/modules/spanish.json",
  "./languages/cebuano/modules/code-switching.json"
];

const AVATAR_FILES = [
  "./avatars/canonical/eagle.png",
  "./avatars/canonical/tamaraw.png",
  "./avatars/canonical/anahaw.png",
  "./avatars/canonical/peacock.png",
  "./avatars/canonical/orchid.png",
  "./avatars/canonical/jade.png",
  "./avatars/canonical/rafflesia.png",
  "./avatars/canonical/tarsier.png",
  "./avatars/canonical/narra.png",
  "./avatars/canonical/nipa_palm.png",
  "./avatars/canonical/buri_palm.png",
  "./avatars/canonical/almaciga.png",
  "./avatars/canonical/pandan.png",
  "./avatars/canonical/bakawan_mangrove.png",
  "./avatars/canonical/kawayang_tinik.png",
  "./avatars/canonical/pili.png",
  "./avatars/canonical/katmon.png",
  "./avatars/canonical/medinilla.png",
  "./avatars/canonical/philippine_teak.png",
  "./avatars/canonical/banaba.png",
  "./avatars/canonical/mangkono.png",
  "./avatars/canonical/attenborough_pitcher.png",
  "./avatars/canonical/slipper_orchid.png",
  "./avatars/canonical/philippine_hoya.png",
  "./avatars/canonical/parol.png",
  "./avatars/canonical/vinta.png",
  "./avatars/canonical/kulintang.png",
  "./avatars/canonical/bangka.png",
  "./avatars/canonical/jeepney.png",
  "./avatars/canonical/bahay_kubo.png",
  "./avatars/canonical/sarimanok.png",
  "./avatars/canonical/golden_salita_crest.png",
  "./avatars/canonical/philippine_pangolin.png",
  "./avatars/canonical/visayan_spotted_deer.png",
  "./avatars/canonical/visayan_warty_pig.png",
  "./avatars/canonical/philippine_crocodile.png",
  "./avatars/canonical/philippine_forest_turtle.png",
  "./avatars/canonical/philippine_sailfin_lizard.png",
  "./avatars/canonical/golden_crowned_flying_fox.png",
  "./avatars/canonical/philippine_colugo.png",
  "./avatars/canonical/philippine_cockatoo.png",
  "./avatars/canonical/rufous_hornbill.png",
  "./avatars/canonical/luzon_bleeding_heart_dove.png",
  "./avatars/canonical/cebu_flowerpecker.png",
  "./avatars/canonical/philippine_eagle_owl.png",
  "./avatars/canonical/whale_shark_butanding.png",
  "./avatars/canonical/dugong.png",
  "./avatars/canonical/hawksbill_sea_turtle.png"
];

const STATIC_FILES = [...CORE_FILES, ...APP_ENHANCEMENTS, ...AVATAR_PROGRESSION_FILES, ...COURSE_FILES, ...AVATAR_FILES];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(STATIC_FILES.map(file => cache.add(file)))));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/")) return;
  const networkRequest = url.origin === self.location.origin
    ? new Request(event.request, {cache:"reload"})
    : event.request;
  event.respondWith(fetch(networkRequest)
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
        if (url.pathname.endsWith("/mobile-refresh.html")) return caches.match("./mobile-refresh.html");
        return caches.match("./index.html");
      }
      return Response.error();
    }));
});
