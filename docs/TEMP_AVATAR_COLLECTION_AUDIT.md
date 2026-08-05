# Avatar Collection screen audit

- Base commit: `2793bc413bfe655cbb695a3323140a13810c44fa`
- Target: `avatar-collection-screen-v1.js`

## Target source facts
```text
13858 avatar-collection-screen-v1.js
7:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
8:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
31:    if (window.SalitaAvatarModel) return Promise.resolve(window.SalitaAvatarModel);
34:      const timer = window.setInterval(() => {
36:        if (window.SalitaAvatarModel) {
37:          window.clearInterval(timer);
38:          resolve(window.SalitaAvatarModel);
40:          window.clearInterval(timer);
49:      const value = JSON.parse(localStorage.getItem(PROFILE_STORE) || "null");
56:  function writeStore() {
60:    localStorage.setItem(PROFILE_STORE, JSON.stringify(store));
63:  function refreshProfile() {
65:    const activeId = sessionStorage.getItem(ACTIVE_PROFILE);
71:    writeStore();
135:    if (!root || !refreshProfile()) return;
156:    window.SalitaAvatarArtwork?.repair(root);
162:      if (window.SalitaAvatarArtwork) {
163:        window.SalitaAvatarArtwork.bind(image,item.id,{alt:item.name});
174:  function equipAvatar(id) {
175:    if (!refreshProfile()) return false;
181:    writeStore();
183:    document.dispatchEvent(new CustomEvent("salita:avatar-equipped", {detail:{avatarId:item.id, avatar:item}}));
184:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {detail:{avatarId:item.id}}));
186:    if (detail && !detail.hidden) openDetail(item.id);
190:  function openDetail(id) {
191:    if (!refreshProfile()) return;
211:    window.SalitaAvatarArtwork?.repair(detail);
259:    root.addEventListener("click", event => {
267:        if (item && stateFor(item).owned) equipAvatar(item.id);
268:        else if (item) openDetail(item.id);
272:      if (info) openDetail(info.dataset.avatarDetail);
275:    detail.addEventListener("click", event => {
278:      if (equip && !equip.disabled) equipAvatar(equip.dataset.detailEquip);
281:    document.addEventListener("keydown", event => {
287:    document.addEventListener("salita:avatar-collection-changed", render);
288:    document.addEventListener("salita:open-avatar-collection", open);
291:  function installLauncher() {
301:      button.addEventListener("click", event => {
311:    const observer = new MutationObserver(() => {
320:    installLauncher();
321:    window.SalitaAvatarCollectionScreen = Object.freeze({open, close, render, equip:equipAvatar});
```

## Direct path references
```text
./README.md:158:- `avatar-collection-screen-v1.js` — collection and equip controls
./profile-emblem-control.js:64:      await loadScript("collection", `./avatar-collection-screen-v1.js?v=${RELEASE_VERSION}`, "Avatar collection screen could not be loaded.");
./service-worker.js:55:  "./avatar-progression-migration-v1.js", "./src/features/avatar/avatar-progression-migration-v1.js", "./avatar-collection-screen-v1.js", "./avatar-collection-screen-v1.css",
./scripts/validate-avatar-runtime-v556.mjs:25:  collection:read("avatar-collection-screen-v1.js"),
./docs/MODULE_CONTRACT_INVENTORY.md:126:- `avatar-collection-screen-v1.js` — 0 engine globals; 2 exported browser APIs; 12 DOM hooks.
./docs/MODULE_CONTRACT_INVENTORY.md:196:| `avatar-collection-screen-v1.js` | collection-and-rewards | 2 | 29 | 0 | 4/2 | 3 | 12 | 0 |
./docs/MODULE_CONTRACT_INVENTORY.md:225:| `localStorage:salitaQuestLocalProfilesV1` | achievement-sharing-avatar-bridge-v1.js, achievement-sharing-v4.js, avatar-collection-screen-v1.js, avatar-unlock-celebration-v1.js, coin-avatar-shard-shop-v1.js, coin-avatar-shop-reveal-v1.js, desktop-navigation-refinement.js, profile-app.js, social-connections-v2.js, src/adapters/avatar/avatar-case-profile-runtime-v1.js, src/adapters/badges/badge-catalogue-runtime-v1.js, src/adapters/badges/coin-shop-badge-runtime-v1.js, src/features/avatar/avatar-artwork-registry-v554.js, src/features/avatar/avatar-collection-summary-v1.js, src/features/avatar/level-avatar-rewards-v1.js, weekly-avatar-shard-rewards-v1.js | avatar-collection-screen-v1.js, avatar-unlock-celebration-v1.js, coin-avatar-shard-shop-v1.js, coin-avatar-shop-reveal-v1.js, profile-app.js, src/adapters/avatar/avatar-case-profile-runtime-v1.js, src/features/avatar/level-avatar-rewards-v1.js, weekly-avatar-shard-rewards-v1.js | — |
./docs/MODULE_CONTRACT_INVENTORY.md:232:| `sessionStorage:salitaQuestActiveProfileId` | achievement-sharing-avatar-bridge-v1.js, achievement-sharing-v4.js, avatar-collection-screen-v1.js, avatar-unlock-celebration-v1.js, coin-avatar-shard-shop-v1.js, coin-avatar-shop-reveal-v1.js, desktop-navigation-refinement.js, level-progression-v2.js, profile-app.js, social-connections-v2.js, src/adapters/avatar/avatar-case-profile-runtime-v1.js, src/adapters/badges/badge-catalogue-runtime-v1.js, src/adapters/badges/coin-shop-badge-runtime-v1.js, src/features/avatar/avatar-artwork-registry-v554.js, src/features/avatar/avatar-collection-summary-v1.js, src/features/avatar/level-avatar-rewards-v1.js, weekly-avatar-shard-rewards-v1.js | — | profile-app.js |
./docs/MODULE_CONTRACT_INVENTORY.md:241:| `__salitaAvatarCollectionScreenInstalled` | avatar-collection-screen-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:300:| `SalitaAvatarCollectionScreen` | avatar-collection-screen-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:339:| `salita:avatar-collection-changed` | avatar-collection-screen-v1.js, coin-avatar-shard-shop-v1.js, coin-avatar-shop-reveal-v1.js, src/features/avatar/level-avatar-rewards-v1.js, weekly-avatar-shard-rewards-v1.js | achievement-sharing-avatar-bridge-v1.js, achievement-sharing-v4.js, avatar-collection-screen-v1.js, avatar-unlock-celebration-v1.js, src/features/avatar/avatar-artwork-registry-v554.js, src/features/avatar/avatar-case-v1.js, src/features/avatar/avatar-collection-summary-v1.js, weekly-avatar-shard-rewards-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:341:| `salita:avatar-equipped` | avatar-collection-screen-v1.js, profile-app.js | desktop-navigation-refinement.js, profile-emblem-control.js, src/features/avatar/avatar-artwork-registry-v554.js, weekly-avatar-shard-rewards-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:364:| `salita:open-avatar-collection` | avatar-unlock-celebration-v1.js, desktop-navigation-refinement.js, src/adapters/navigation/avatar-collections-navigation-v551.js, weekly-avatar-shard-rewards-v1.js | avatar-collection-screen-v1.js, src/features/avatar/avatar-case-v1.js, src/features/avatar/avatar-collection-summary-v1.js |
./scripts/validate-avatar-progression-v550.mjs:44:  "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:677:      "file": "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:2547:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:2572:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:2719:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:4964:      "from": "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:4972:      "from": "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:4980:      "from": "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:5061:      "to": "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:5618:      "to": "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6380:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6396:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6492:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6569:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6646:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6756:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6764:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6787:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:6967:        "avatar-collection-screen-v1.js",
./src/config/module-contracts.generated.json:7052:        "avatar-collection-screen-v1.js"
./src/config/module-contracts.generated.json:7415:        "avatar-collection-screen-v1.js"
./scripts/validate-avatar-collection-screen.mjs:9:const screenSource = read("avatar-collection-screen-v1.js");
./scripts/validate-avatar-collection-screen.mjs:14:new vm.Script(screenSource, {filename:"avatar-collection-screen-v1.js"});
./scripts/validate-avatar-collection-screen.mjs:66:if (!emblemSource.includes("avatar-collection-screen-v1.js") || !emblemSource.includes('loadScript("collection"')) {
./mobile-refresh.html:49:      `./avatar-collection-screen-v1.js?v=${RELEASE}`,
```

## Public API consumers
```text
./weekly-avatar-shard-rewards-v1.js:430:      document.dispatchEvent(new CustomEvent("salita:open-avatar-collection"));
./weekly-avatar-shard-rewards-v1.js:496:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {
./weekly-avatar-shard-rewards-v1.js:583:    document.addEventListener("salita:avatar-equipped", preserveRewardStateAfterExternalWrite);
./weekly-avatar-shard-rewards-v1.js:584:    document.addEventListener("salita:avatar-collection-changed", event => {
./avatar-card-actions-v1.js:160:  document.addEventListener("salita:avatar-collection-changed", () => window.setTimeout(patchAll, 0));
./coin-avatar-shop-reveal-v1.js:192:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {detail:{avatarId:item.id,source:"coin_mystery_pack"}}));
./achievement-sharing-v4.js:873:    document.addEventListener("salita:avatar-collection-changed",() => window.setTimeout(() => decorateAvatarDetails(),40));
./achievement-sharing-avatar-bridge-v1.js:100:  document.addEventListener("salita:avatar-collection-changed", () => {
./profile-emblem-control.js:199:    document.addEventListener("salita:avatar-equipped", event => {
./coin-avatar-shard-shop-v1.js:151:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed",{detail:{avatarId:item.id,source:"coin_shard_pack"}}));
./avatar-collection-page-v2.js:149:    document.dispatchEvent(new CustomEvent("salita:avatar-equipped", {detail:{avatarId:item.id, avatar:item}}));
./avatar-collection-page-v2.js:150:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {detail:{avatarId:item.id, source:"avatar-page-v2"}}));
./avatar-collection-page-v2.js:268:    document.addEventListener("salita:open-avatar-collection", interceptLegacyOpen, true);
./avatar-collection-page-v2.js:269:    document.addEventListener("salita:avatar-collection-changed", render);
./avatar-collection-page-v2.js:270:    document.addEventListener("salita:avatar-equipped", () => { updateEmblem(); render(); });
./avatar-unlock-celebration-v1.js:180:          if (window.SalitaAvatarCollectionScreen?.open) window.SalitaAvatarCollectionScreen.open();
./avatar-unlock-celebration-v1.js:181:          else document.dispatchEvent(new CustomEvent("salita:open-avatar-collection"));
./avatar-unlock-celebration-v1.js:234:    document.addEventListener("salita:avatar-collection-changed", () => schedule(350));
./weekly-avatar-projected-unlock-fix-v1.js:135:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {
./src/features/economy/economy-tracking-phase6-v1.js:69:  ["salita:open-avatar-collection","salita:coin-balance-changed","salita:coin-shard-pack-purchased","salita:avatar-collection-changed","salita:avatar-collection-tabs-ready"].forEach(name => document.addEventListener(name,scheduleRender));
./src/features/avatar/avatar-case-v1.js:256:      document.addEventListener("salita:avatar-collection-changed",render);
./src/features/avatar/avatar-case-v1.js:257:      document.addEventListener("salita:open-avatar-collection",() => window.setTimeout(render,0));
./src/features/avatar/avatar-collection-summary-v1.js:71:  document.addEventListener("salita:open-avatar-collection", () => window.setTimeout(render, 80));
./src/features/avatar/avatar-collection-summary-v1.js:72:  document.addEventListener("salita:avatar-collection-changed", scheduleRender);
./profile-app.js:244:      document.dispatchEvent(new CustomEvent("salita:avatar-equipped", {
./src/features/avatar/level-avatar-rewards-v1.js:225:        document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {
./src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:122:    "salita:open-avatar-collection",
./src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:124:    "salita:avatar-collection-changed",
./desktop-navigation-refinement.js:203:    document.dispatchEvent(new CustomEvent("salita:open-avatar-collection",{
./desktop-navigation-refinement.js:220:    document.dispatchEvent(new CustomEvent("salita:open-avatar-collection",{
./desktop-navigation-refinement.js:292:    document.addEventListener("salita:avatar-equipped",event=>updateAvatarNavigation(event.detail?.avatarId||event.detail?.avatar?.id||""));
./src/features/avatar/avatar-artwork-registry-v554.js:153:    document.addEventListener("salita:avatar-equipped", event => {
./src/features/avatar/avatar-artwork-registry-v554.js:156:    document.addEventListener("salita:avatar-collection-changed", () => syncEquipped());
./docs/MODULE_CONTRACT_INVENTORY.md:300:| `SalitaAvatarCollectionScreen` | avatar-collection-screen-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:339:| `salita:avatar-collection-changed` | avatar-collection-screen-v1.js, coin-avatar-shard-shop-v1.js, coin-avatar-shop-reveal-v1.js, src/features/avatar/level-avatar-rewards-v1.js, weekly-avatar-shard-rewards-v1.js | achievement-sharing-avatar-bridge-v1.js, achievement-sharing-v4.js, avatar-collection-screen-v1.js, avatar-unlock-celebration-v1.js, src/features/avatar/avatar-artwork-registry-v554.js, src/features/avatar/avatar-case-v1.js, src/features/avatar/avatar-collection-summary-v1.js, weekly-avatar-shard-rewards-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:341:| `salita:avatar-equipped` | avatar-collection-screen-v1.js, profile-app.js | desktop-navigation-refinement.js, profile-emblem-control.js, src/features/avatar/avatar-artwork-registry-v554.js, weekly-avatar-shard-rewards-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:364:| `salita:open-avatar-collection` | avatar-unlock-celebration-v1.js, desktop-navigation-refinement.js, src/adapters/navigation/avatar-collections-navigation-v551.js, weekly-avatar-shard-rewards-v1.js | avatar-collection-screen-v1.js, src/features/avatar/avatar-case-v1.js, src/features/avatar/avatar-collection-summary-v1.js |
./src/adapters/navigation/avatar-collections-navigation-v551.js:82:      document.dispatchEvent(new CustomEvent("salita:open-avatar-collection"));
./src/config/module-contracts.generated.json:145:          "salita:avatar-collection-changed"
./src/config/module-contracts.generated.json:283:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:695:          "SalitaAvatarCollectionScreen"
./src/config/module-contracts.generated.json:750:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:751:          "salita:open-avatar-collection"
./src/config/module-contracts.generated.json:754:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:755:          "salita:avatar-equipped"
./src/config/module-contracts.generated.json:837:          "SalitaAvatarCollectionScreen",
./src/config/module-contracts.generated.json:883:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:892:          "salita:open-avatar-collection"
./src/config/module-contracts.generated.json:1260:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:1413:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:1743:          "salita:avatar-equipped",
./src/config/module-contracts.generated.json:1747:          "salita:open-avatar-collection",
./src/config/module-contracts.generated.json:2525:          "salita:avatar-equipped"
./src/config/module-contracts.generated.json:2636:          "salita:avatar-equipped"
./src/config/module-contracts.generated.json:3174:          "salita:open-avatar-collection"
./src/config/module-contracts.generated.json:3466:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:3467:          "salita:avatar-equipped"
./src/config/module-contracts.generated.json:3531:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:3532:          "salita:open-avatar-collection"
./src/config/module-contracts.generated.json:3628:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:3631:          "salita:open-avatar-collection"
./src/config/module-contracts.generated.json:3841:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:4749:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:4750:          "salita:avatar-equipped"
./src/config/module-contracts.generated.json:4753:          "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:4754:          "salita:open-avatar-collection",
./src/config/module-contracts.generated.json:5064:        "SalitaAvatarCollectionScreen"
./src/config/module-contracts.generated.json:6752:      "name": "salita:avatar-collection-changed",
./src/config/module-contracts.generated.json:6779:      "name": "salita:avatar-equipped",
./src/config/module-contracts.generated.json:6965:      "name": "salita:open-avatar-collection",
./src/config/module-contracts.generated.json:7413:      "symbol": "SalitaAvatarCollectionScreen",
./scripts/validate-level-avatar-rewards-module-extraction.mjs:22:for (const marker of ['const PROFILE_STORE = "salitaQuestLocalProfilesV1"','const ACTIVE_PROFILE = "salitaQuestActiveProfileId"','const ACTIVE_COURSE = "salitaQuestActiveCourse"','const INSTALL_FLAG = "__salitaQuestLevelAvatarRewardsV3Installed"','const RELEASE = "5.5.3"','Object.freeze([10,20,30,40,50,60,70,80,90,99])',"repairFutureMilestones","root.SalitaLevelAvatarRewardLogic = Object.freeze","window.SalitaLevelAvatarRewards = Object.freeze",'new CustomEvent("salita:avatar-milestones-awarded"','new CustomEvent("salita:avatar-milestones-repaired"','new CustomEvent("salita:avatar-collection-changed"'])
./scripts/validate-level-avatar-rewards-module-extraction.mjs:67:if (events.map(event=>event.type).join("|")!=="salita:avatar-collection-changed|salita:avatar-milestones-awarded") fail("Award event order changed");
./scripts/validate-persistent-navigation-ci.mjs:29:  "salita:open-avatar-collection",
./scripts/validate-avatar-unlock-sharing.mjs:72:  "window.SalitaAvatarCollectionScreen",
./scripts/validate-avatar-unlock-sharing.mjs:73:  "salita:open-avatar-collection",
./scripts/validate-avatar-unlock-sharing.mjs:123:  'document.addEventListener("salita:avatar-collection-changed"',
./scripts/validate-avatar-onboarding.mjs:42:if (!profileApp.includes('new CustomEvent("salita:avatar-equipped"')) {
./scripts/validate-avatar-collection-tabs-module-extraction.mjs:29:  "salita:open-avatar-collection",
./scripts/validate-avatar-collection-tabs-module-extraction.mjs:31:  "salita:avatar-collection-changed",
./scripts/validate-progression-scenarios-navigation.mjs:154:  'new CustomEvent("salita:open-avatar-collection"',
./scripts/validate-avatar-collection-summary-module-extraction.mjs:29:  "salita:open-avatar-collection",
./scripts/validate-avatar-collection-summary-module-extraction.mjs:30:  "salita:avatar-collection-changed",
./scripts/validate-avatar-hotfix-adapters-extraction.mjs:52:  "renderBadges", 'new CustomEvent("salita:open-avatar-collection"',
./scripts/validate-avatar-hotfix-adapters-extraction.mjs:214:if (dom.document.events.at(-1)?.type !== "salita:open-avatar-collection") fail("Avatar collection action changed");
./scripts/validate-avatar-collection-screen.mjs:38:  "salita:avatar-equipped",
./scripts/validate-level-avatar-rewards.mjs:114:  "salita:avatar-collection-changed",
./scripts/validate-economy-tracking-module-extraction.mjs:29:  "salita:open-avatar-collection",
./scripts/validate-economy-tracking-module-extraction.mjs:32:  "salita:avatar-collection-changed",
./scripts/validate-weekly-avatar-shards.mjs:28:  "salita:avatar-collection-changed",
./scripts/validate-avatar-artwork-registry-module-extraction.mjs:54:  'document.addEventListener("salita:avatar-equipped"',
./scripts/validate-avatar-artwork-registry-module-extraction.mjs:55:  'document.addEventListener("salita:avatar-collection-changed"',
./scripts/validate-avatar-artwork-registry-module-extraction.mjs:171:if (listeners.map(item => item.name).join(",") !== "salita:avatar-equipped,salita:avatar-collection-changed") fail("Artwork listener ownership changed");
./scripts/validate-persistent-navigation.mjs:32:  "salita:open-avatar-collection",
```

## Shared profile and avatar ownership
```text
weekly-avatar-projected-unlock-fix-v1.js:7:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
weekly-avatar-projected-unlock-fix-v1.js:8:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
weekly-avatar-projected-unlock-fix-v1.js:31:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
weekly-avatar-projected-unlock-fix-v1.js:57:    account.profile.avatarCollection = account.collection;
weekly-avatar-projected-unlock-fix-v1.js:59:    if (account.collection.equippedAvatarId) account.profile.avatarId = account.collection.equippedAvatarId;
weekly-avatar-projected-unlock-fix-v1.js:74:        avatarId:item.id,
weekly-avatar-projected-unlock-fix-v1.js:109:      if (!collection.pendingUnlocks.some(entry => entry.avatarId === item.id && entry.seen !== true)) {
weekly-avatar-projected-unlock-fix-v1.js:111:          avatarId:item.id,
weekly-avatar-projected-unlock-fix-v1.js:120:      avatarId:item.id,
weekly-avatar-projected-unlock-fix-v1.js:136:      detail:{avatarId:item.id, source:"weekly_keys", unlocked, shardsAwarded:award}
profile-app.js:4:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
profile-app.js:5:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
profile-app.js:141:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
profile-app.js:142:    profile.avatarCollection = collection;
profile-app.js:143:    if (collection.equippedAvatarId) profile.avatarId = collection.equippedAvatarId;
profile-app.js:147:    const currentAvatar = () => getAvatar(profile.avatarCollection.equippedAvatarId || profile.avatarId);
profile-app.js:207:      const equipped = profile.avatarCollection.equippedAvatarId;
profile-app.js:208:      const owned = profile.avatarCollection.ownedAvatarIds
profile-app.js:238:      if (!item || !profile.avatarCollection.ownedAvatarIds.includes(item.id)) return;
profile-app.js:239:      profile.avatarCollection.equippedAvatarId = item.id;
profile-app.js:240:      profile.avatarId = item.id;
profile-app.js:245:        detail:{avatarId:item.id, avatar:item}
level-progression-v2.js:155:    return `${sessionStorage.getItem("salitaQuestActiveProfileId")||"anonymous"}:${document.body.dataset.course||sessionStorage.getItem("salitaQuestActiveCourse")||"tagalog"}`;
weekly-avatar-shard-rewards-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
weekly-avatar-shard-rewards-v1.js:6:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
weekly-avatar-shard-rewards-v1.js:100:        const item = model.get(claim.avatarId);
weekly-avatar-shard-rewards-v1.js:103:          avatarId:item.id,
weekly-avatar-shard-rewards-v1.js:120:    if (model.get(claim.avatarId)) return model.get(claim.avatarId).id;
weekly-avatar-shard-rewards-v1.js:145:        const avatarId = legacyAvatarId(claim);
weekly-avatar-shard-rewards-v1.js:146:        const item = model.get(avatarId);
weekly-avatar-shard-rewards-v1.js:153:          avatarId:item.id,
weekly-avatar-shard-rewards-v1.js:175:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
weekly-avatar-shard-rewards-v1.js:179:    profile.avatarCollection = collection;
weekly-avatar-shard-rewards-v1.js:181:    if (collection.equippedAvatarId) profile.avatarId = collection.equippedAvatarId;
weekly-avatar-shard-rewards-v1.js:196:    const latest = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
weekly-avatar-shard-rewards-v1.js:204:      if (!pending.some(existing => existing.avatarId === entry.avatarId && !existing.seen)) pending.push(entry);
weekly-avatar-shard-rewards-v1.js:209:      equippedAvatarId:latest.equippedAvatarId || canonicalCollection.equippedAvatarId,
weekly-avatar-shard-rewards-v1.js:217:    }, latest.equippedAvatarId || profile.avatarId);
weekly-avatar-shard-rewards-v1.js:219:    profile.avatarCollection = merged;
weekly-avatar-shard-rewards-v1.js:221:    if (merged.equippedAvatarId) profile.avatarId = merged.equippedAvatarId;
weekly-avatar-shard-rewards-v1.js:254:    const item = claim ? model.get(claim.avatarId) : null;
weekly-avatar-shard-rewards-v1.js:408:    const item = model.get(claim.avatarId);
weekly-avatar-shard-rewards-v1.js:452:      if (!collection.pendingUnlocks.some(entry => entry.avatarId === item.id && !entry.seen)) {
weekly-avatar-shard-rewards-v1.js:454:          avatarId:item.id,
weekly-avatar-shard-rewards-v1.js:463:      avatarId:item.id,
weekly-avatar-shard-rewards-v1.js:474:    profile.avatarCollection = collection;
weekly-avatar-shard-rewards-v1.js:486:      avatarId:item.id,
weekly-avatar-shard-rewards-v1.js:497:      detail:{avatarId:item.id, source:"weekly_keys", unlocked, shardsAwarded:award}
coin-avatar-shard-shop-v1.js:7:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
coin-avatar-shard-shop-v1.js:8:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
coin-avatar-shard-shop-v1.js:91:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
coin-avatar-shard-shop-v1.js:97:    account.profile.avatarCollection = account.collection;
coin-avatar-shard-shop-v1.js:98:    if (account.collection.equippedAvatarId) account.profile.avatarId = account.collection.equippedAvatarId;
coin-avatar-shard-shop-v1.js:138:      account.collection.pendingUnlocks.push({avatarId:item.id,source:"coin_shard_pack",unlockedAt:new Date().toISOString(),seen:false});
coin-avatar-shard-shop-v1.js:146:    data.purchaseHistory.push({rarity,avatarId:item.id,cost:pack.cost,shards:SHARDS_PER_PACK,before,after,unlocked,purchasedAt:new Date().toISOString()});
coin-avatar-shard-shop-v1.js:151:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed",{detail:{avatarId:item.id,source:"coin_shard_pack"}}));
profile-emblem-control.js:145:    const avatarId = originalImage?.dataset.sqAvatarId || originalImage?.dataset.avatarId || "anahaw";
profile-emblem-control.js:146:    const item = window.SalitaAvatarModel?.get?.(avatarId);
profile-emblem-control.js:147:    const imageSource = window.SalitaAvatarArtwork?.getAvatarImagePath?.(avatarId)
profile-emblem-control.js:169:      anchor.innerHTML = `<img src="${imageSource}" alt="" aria-hidden="true" data-sq-avatar-id="${avatarId}">`;
profile-emblem-control.js:200:      const id = event.detail?.avatarId || event.detail?.avatar?.id;
avatar-collection-page-v2.js:8:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
avatar-collection-page-v2.js:9:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
avatar-collection-page-v2.js:37:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
avatar-collection-page-v2.js:38:      profile.avatarCollection = collection;
avatar-collection-page-v2.js:39:      if (collection.equippedAvatarId) profile.avatarId = collection.equippedAvatarId;
avatar-collection-page-v2.js:49:    context.profile.avatarCollection = context.collection;
avatar-collection-page-v2.js:50:    if (context.collection.equippedAvatarId) context.profile.avatarId = context.collection.equippedAvatarId;
avatar-collection-page-v2.js:63:    const equipped = owned && collection.equippedAvatarId === item.id;
avatar-collection-page-v2.js:120:    const equipped = model.get(collection.equippedAvatarId);
avatar-collection-page-v2.js:147:    context.collection.equippedAvatarId = item.id;
avatar-collection-page-v2.js:149:    document.dispatchEvent(new CustomEvent("salita:avatar-equipped", {detail:{avatarId:item.id, avatar:item}}));
avatar-collection-page-v2.js:150:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {detail:{avatarId:item.id, source:"avatar-page-v2"}}));
avatar-collection-page-v2.js:231:    const item = context ? model.get(context.collection.equippedAvatarId) : null;
key-run-refinement.js:28:    avatarId:avatar.id,
avatar-card-actions-v1.js:56:      const store = JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1") || "null");
avatar-card-actions-v1.js:57:      const activeId = sessionStorage.getItem("salitaQuestActiveProfileId");
avatar-card-actions-v1.js:59:      const collection = window.SalitaAvatarModel?.normaliseCollectionState?.(profile?.avatarCollection, profile?.avatarId);
avatar-card-actions-v1.js:90:    document.dispatchEvent(new CustomEvent("salita:open-avatar-share", {detail:{avatarId:item.id}}));
daily-key-weekday-reconciliation-v1.js:25:      const store = JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1") || "null");
daily-key-weekday-reconciliation-v1.js:26:      const activeId = sessionStorage.getItem("salitaQuestActiveProfileId");
achievement-sharing-v4.js:6:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
achievement-sharing-v4.js:7:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
achievement-sharing-v4.js:82:      return avatarModel()?.normaliseCollectionState?.(profile.avatarCollection, profile.avatarId) || profile.avatarCollection || null;
achievement-sharing-v4.js:84:      return profile.avatarCollection || null;
achievement-sharing-v4.js:94:    if (profile.avatarId) owned.add(profile.avatarId);
achievement-sharing-v4.js:113:    return avatarItem(collection?.equippedAvatarId || profile?.avatarId) || avatarItem("tarsier") || {
achievement-sharing-v4.js:797:  function decorateUnlockLayer(avatarId) {
achievement-sharing-v4.js:806:      button.dataset.shareAvatar = avatarId;
achievement-sharing-v4.js:872:    document.addEventListener("salita:avatar-unlock-animation-started",event => decorateUnlockLayer(event.detail?.avatarId || ""));
achievement-sharing-avatar-bridge-v1.js:16:      const profileStore = JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1") || "null");
achievement-sharing-avatar-bridge-v1.js:17:      const profileId = sessionStorage.getItem("salitaQuestActiveProfileId");
achievement-sharing-avatar-bridge-v1.js:26:    const id = profile?.avatarCollection?.equippedAvatarId || profile?.avatarId || "anahaw";
achievement-sharing-avatar-bridge-v1.js:35:      const state = window.SalitaAvatarModel?.normaliseCollectionState?.(profile.avatarCollection, profile.avatarId) || profile.avatarCollection || {};
achievement-sharing-avatar-bridge-v1.js:37:      if (profile.avatarId) owned.add(profile.avatarId);
avatar-collection-screen-v1.js:7:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
avatar-collection-screen-v1.js:8:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
avatar-collection-screen-v1.js:68:    collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
avatar-collection-screen-v1.js:69:    profile.avatarCollection = collection;
avatar-collection-screen-v1.js:70:    if (collection.equippedAvatarId) profile.avatarId = collection.equippedAvatarId;
avatar-collection-screen-v1.js:100:    const equipped = owned && collection.equippedAvatarId === item.id;
avatar-collection-screen-v1.js:145:      <span class="sq-avatar-summary-pill">Equipped: ${esc(model.get(collection.equippedAvatarId)?.name || "None")}</span>`;
avatar-collection-screen-v1.js:178:    collection.equippedAvatarId = item.id;
avatar-collection-screen-v1.js:179:    profile.avatarCollection = collection;
avatar-collection-screen-v1.js:180:    profile.avatarId = item.id;
avatar-collection-screen-v1.js:183:    document.dispatchEvent(new CustomEvent("salita:avatar-equipped", {detail:{avatarId:item.id, avatar:item}}));
avatar-collection-screen-v1.js:184:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {detail:{avatarId:item.id}}));
avatar-collection-screen-v1.js:299:      button.dataset.avatarCollection = "true";
coin-avatar-shop-reveal-v1.js:10:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
coin-avatar-shop-reveal-v1.js:11:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
coin-avatar-shop-reveal-v1.js:67:      return Object.freeze({avatarId:item.id, owned, shards, required, percent});
coin-avatar-shop-reveal-v1.js:125:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
coin-avatar-shop-reveal-v1.js:131:    account.profile.avatarCollection = account.collection;
coin-avatar-shop-reveal-v1.js:132:    if (account.collection.equippedAvatarId) account.profile.avatarId = account.collection.equippedAvatarId;
coin-avatar-shop-reveal-v1.js:175:      account.collection.pendingUnlocks.push({avatarId:item.id,source:"coin_mystery_pack",unlockedAt:new Date().toISOString(),seen:false});
coin-avatar-shop-reveal-v1.js:185:    economy.purchaseHistory.push({rarity:actualRarity,requestedRarity:"mystery",mystery:true,avatarId:item.id,cost:MYSTERY_COST,shards:SHARDS_PER_PACK,before,after,unlocked,purchasedAt:new Date().toISOString()});
coin-avatar-shop-reveal-v1.js:192:    document.dispatchEvent(new CustomEvent("salita:avatar-collection-changed", {detail:{avatarId:item.id,source:"coin_mystery_pack"}}));
avatar-unlock-celebration-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
avatar-unlock-celebration-v1.js:6:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
avatar-unlock-celebration-v1.js:15:    return [entry.avatarId || "", entry.source || "unknown", entry.level || "", entry.weekKey || ""].join("|");
avatar-unlock-celebration-v1.js:26:      const item = avatarModel.get(entry?.avatarId);
avatar-unlock-celebration-v1.js:37:        entry?.avatarId === pendingEntry?.avatarId &&
avatar-unlock-celebration-v1.js:153:    const result = consumePending(profile.avatarCollection, pendingEntry, model);
avatar-unlock-celebration-v1.js:154:    profile.avatarCollection = result.collection;
avatar-unlock-celebration-v1.js:157:      avatarId:item.id,
avatar-unlock-celebration-v1.js:168:    document.dispatchEvent(new CustomEvent("salita:avatar-unlock-acknowledged", {detail:{avatarId:item.id, source:pendingEntry.source || "unknown", release:RELEASE}}));
avatar-unlock-celebration-v1.js:183:        document.dispatchEvent(new CustomEvent("salita:avatar-unlock-animation-finished", {detail:{avatarId:item.id, source:pendingEntry.source || "unknown", release:RELEASE}}));
avatar-unlock-celebration-v1.js:186:      document.dispatchEvent(new CustomEvent("salita:avatar-unlock-animation-started", {detail:{avatarId:item.id, source:pendingEntry.source || "unknown", release:RELEASE}}));
avatar-unlock-celebration-v1.js:204:    const pendingEntry = nextPending(profile.avatarCollection, model, profile.avatarUnlockHistory);
avatar-unlock-celebration-v1.js:206:    const item = model.get(pendingEntry.avatarId);
scripts/validate-long-term-badges.mjs:77:  ["salitaQuestActiveProfileId","test-profile"],
scripts/validate-long-term-badges.mjs:78:  ["salitaQuestLocalProfilesV1",JSON.stringify({profiles:[{id:"test-profile",avatarCollection:{ownedIds:["a","b","c","d","e","f","g","h","i","j"]}}]})]
scripts/validate-avatar-artwork-registry-module-extraction.mjs:42:  'const PROFILE_STORE = "salitaQuestLocalProfilesV1"',
scripts/validate-avatar-artwork-registry-module-extraction.mjs:43:  'const ACTIVE_PROFILE = "salitaQuestActiveProfileId"',
scripts/validate-avatar-artwork-registry-module-extraction.mjs:139:      if (key !== "salitaQuestLocalProfilesV1") return null;
scripts/validate-avatar-artwork-registry-module-extraction.mjs:140:      return JSON.stringify({profiles:[{id:"active",avatarCollection:{equippedAvatarId:"anahaw"}}]});
scripts/validate-avatar-artwork-registry-module-extraction.mjs:146:      return key === "salitaQuestActiveProfileId" ? "active" : null;
weekly-avatar-chest.js:27:    avatarId: avatar.id,
scripts/validate-avatar-case-profile-adapter-extraction.mjs:24:for (const forbidden of ["salitaQuestLocalProfilesV1","salitaQuestActiveProfileId","localStorage","sessionStorage","sq-avatar-case-panel","SalitaQuestAvatarCase ="]) {
scripts/validate-avatar-case-profile-adapter-extraction.mjs:27:requireMarkers(adapter,["salitaQuestLocalProfilesV1","salitaQuestActiveProfileId","profile.avatarCaseIds = cleaned","caseAvatarIds","normaliseCollectionState","localStorage.setItem","SalitaAvatarCaseProfileRuntimeV1"],"profile adapter");
scripts/validate-avatar-case-profile-adapter-extraction.mjs:32:for (const forbidden of ["salitaQuestLocalProfilesV1","salitaQuestActiveProfileId","localStorage","sessionStorage","caseAvatarIds"]) {
scripts/validate-avatar-case-profile-adapter-extraction.mjs:54:let stored = JSON.stringify({schemaVersion:1,profiles:[{id:"p1",avatarId:"a",avatarCollection:{equippedAvatarId:"a",ownedAvatarIds:["a","b","c","d","e"],shards:{},caseAvatarIds:["a","a","locked","b","c","d","e"]}}]});
scripts/validate-avatar-case-profile-adapter-extraction.mjs:66:  localStorage:{getItem:key=>key==="salitaQuestLocalProfilesV1"?stored:null,setItem:(key,value)=>{if(key==="salitaQuestLocalProfilesV1"){stored=value;writes+=1;}},length:0,key(){return null;}},
scripts/validate-avatar-case-profile-adapter-extraction.mjs:67:  sessionStorage:{getItem:key=>key==="salitaQuestActiveProfileId"?"p1":null},
scripts/validate-avatar-case-profile-adapter-extraction.mjs:73:context.SalitaAvatarModel={get:id=>byId[String(id||"").toLowerCase()]||null,normaliseCollectionState:(input,fallback)=>({equippedAvatarId:input?.equippedAvatarId||fallback||null,ownedAvatarIds:[...(input?.ownedAvatarIds||[])],shards:{...(input?.shards||{})}})};
scripts/validate-avatar-case-profile-adapter-extraction.mjs:85:if(profile.avatarId!=="a"||profile.avatarCollection.equippedAvatarId!=="a")fail("Avatar Case changed equipped avatar");
scripts/validate-avatar-case-profile-adapter-extraction.mjs:86:if(Object.hasOwn(profile.avatarCollection,"caseAvatarIds"))fail("Legacy caseAvatarIds was not removed");
scripts/validate-phase6-1-tabs-case.mjs:14:  'dataset.avatarCollectionPane = "statistics"',
scripts/validate-phase6-1-tabs-case.mjs:15:  'dataset.avatarCollectionPane = "collection"',
desktop-navigation-refinement.js:35:      const store=JSON.parse(localStorage.getItem("salitaQuestLocalProfilesV1")||"null");
desktop-navigation-refinement.js:36:      const id=sessionStorage.getItem("salitaQuestActiveProfileId");
desktop-navigation-refinement.js:45:    const requestedId=profile?.avatarCollection?.equippedAvatarId||profile?.avatarId||"anahaw";
desktop-navigation-refinement.js:164:  function updateAvatarNavigation(avatarId="") {
desktop-navigation-refinement.js:166:    const item=window.SalitaAvatarModel?.get?.(avatarId)||window.SalitaAvatarModel?.get?.(current.id)||current;
desktop-navigation-refinement.js:292:    document.addEventListener("salita:avatar-equipped",event=>updateAvatarNavigation(event.detail?.avatarId||event.detail?.avatar?.id||""));
scripts/validate-coin-shop-badge-adapter-extraction.mjs:34:  'const PROFILE_STORE = "salitaQuestLocalProfilesV1"',
scripts/validate-coin-shop-badge-adapter-extraction.mjs:35:  'const ACTIVE_PROFILE = "salitaQuestActiveProfileId"',
scripts/validate-coin-shop-badge-adapter-extraction.mjs:112:  localStorage:{getItem(key){ return key === "salitaQuestLocalProfilesV1" ? JSON.stringify({profiles:[{id:"p1",avatarCollection:{ownedAvatarIds:["r1","c1"]}}]}) : null; }},
scripts/validate-coin-shop-badge-adapter-extraction.mjs:113:  sessionStorage:{getItem(key){ return key === "salitaQuestActiveProfileId" ? "p1" : null; }},
scripts/validate-level-avatar-rewards-module-extraction.mjs:22:for (const marker of ['const PROFILE_STORE = "salitaQuestLocalProfilesV1"','const ACTIVE_PROFILE = "salitaQuestActiveProfileId"','const ACTIVE_COURSE = "salitaQuestActiveCourse"','const INSTALL_FLAG = "__salitaQuestLevelAvatarRewardsV3Installed"','const RELEASE = "5.5.3"','Object.freeze([10,20,30,40,50,60,70,80,90,99])',"repairFutureMilestones","root.SalitaLevelAvatarRewardLogic = Object.freeze","window.SalitaLevelAvatarRewards = Object.freeze",'new CustomEvent("salita:avatar-milestones-awarded"','new CustomEvent("salita:avatar-milestones-repaired"','new CustomEvent("salita:avatar-collection-changed"'])
scripts/validate-level-avatar-rewards-module-extraction.mjs:45:values.set("salitaQuestLocalProfilesV1",JSON.stringify({schemaVersion:1,profiles:[{id:"p1",avatarId:"anahaw",avatarCollection:{equippedAvatarId:"anahaw",ownedAvatarIds:["anahaw"],shards:{},levelRewardsClaimed:[],pendingUnlocks:[]}}]}));
scripts/validate-level-avatar-rewards-module-extraction.mjs:47:const sessionStorage = {getItem:key=>key==="salitaQuestActiveProfileId"?"p1":key==="salitaQuestActiveCourse"?"tagalog":null};
scripts/validate-level-avatar-rewards-module-extraction.mjs:64:const saved=JSON.parse(values.get("salitaQuestLocalProfilesV1")).profiles[0];
scripts/validate-level-avatar-rewards-module-extraction.mjs:65:if (saved.avatarCollection.levelRewardsClaimed.join(",")!=="10,20" || !saved.avatarCollection.ownedAvatarIds.includes("narra") || !saved.avatarCollection.ownedAvatarIds.includes("nipa_palm")) fail("Milestone ownership persistence changed");
scripts/validate-level-avatar-rewards-module-extraction.mjs:66:if (saved.avatarMilestoneRewards.acknowledgedLevels.join(",")!=="10,20" || saved.avatarMilestoneRewards.claims["20"]?.avatarId!=="nipa_palm") fail("Milestone metadata persistence changed");
scripts/validate-level-avatar-rewards-module-extraction.mjs:76:const weekly={avatarId:"anahaw",avatarCollection:{equippedAvatarId:"anahaw",ownedAvatarIds:["anahaw","nipa_palm"],shards:{nipa_palm:100},levelRewardsClaimed:[20],pendingUnlocks:[{avatarId:"nipa_palm",source:"level_milestone",level:20}]},avatarMilestoneRewards:{version:3,claims:{20:{avatarId:"nipa_palm"}},acknowledgedLevels:[20]},avatarWeeklyRewards:{claims:{week:{avatarId:"nipa_palm",after:100,unlocked:true}}}};
scripts/validate-level-avatar-rewards-module-extraction.mjs:78:if (!repaired.changed || weekly.avatarCollection.levelRewardsClaimed.includes(20) || !weekly.avatarCollection.ownedAvatarIds.includes("nipa_palm") || weekly.avatarCollection.shards.nipa_palm!==100) fail("Weekly evidence repair behavior changed");
.github/workflows/inspect-avatar-collection-screen.yml:52:            rg -n --glob '!docs/TEMP_AVATAR_COLLECTION_AUDIT.md' 'salitaQuestLocalProfilesV1|salitaQuestActiveProfileId|avatarCollection|equippedAvatarId|avatarId' src *.js scripts .github/workflows 2>/dev/null || true
scripts/validate-avatar-collection-summary-module-extraction.mjs:36:  'const PROFILE_STORE = "salitaQuestLocalProfilesV1"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:37:  'const ACTIVE_PROFILE = "salitaQuestActiveProfileId"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:41:  "model.normaliseCollectionState(profile.avatarCollection, profile.avatarId)",
scripts/validate-avatar-collection-summary-module-extraction.mjs:90:const profileStore = {profiles:[{id:"profile-1",avatarId:"a",avatarCollection:{ownedAvatarIds:["a","c"]}}]};
scripts/validate-avatar-collection-summary-module-extraction.mjs:91:const localStorage = {getItem(key){ return key === "salitaQuestLocalProfilesV1" ? JSON.stringify(profileStore) : null; }};
scripts/validate-avatar-collection-summary-module-extraction.mjs:92:const sessionStorage = {getItem(key){ return key === "salitaQuestActiveProfileId" ? "profile-1" : null; }};
scripts/validate_modular_bootstrap.py:79:        "salitaQuestLocalProfilesV1",
scripts/validate_modular_bootstrap.py:80:        "salitaQuestActiveProfileId",
social-connections-v2.js:6:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
social-connections-v2.js:7:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
scripts/validate-avatar-runtime-v556.mjs:70:  equippedAvatarId:"luzon_bleeding_heart",
scripts/validate-avatar-runtime-v556.mjs:73:  pendingUnlocks:[{avatarId:"dugong",source:"weekly",seen:false}],
scripts/validate-avatar-runtime-v556.mjs:77:check(representative.equippedAvatarId === "luzon_bleeding_heart_dove", "Equipped historical alias is preserved");
scripts/validate-avatar-runtime-v556.mjs:81:check(representative.pendingUnlocks[0]?.avatarId === "dugong", "Pending unlocks are preserved");
scripts/validate-avatar-runtime-v556.mjs:103:check(!/profile\.avatarId\s*=|equippedAvatarId\s*=/.test(sources.avatarCase + sources.avatarCaseProfile), "Avatar Case does not change the equipped avatar");
scripts/validate-avatar-runtime-v556.mjs:105:check(sources.level.includes("avatar:item") && sources.level.includes("avatarId:item.id"), "Level rewards hand the canonical avatar record to the unlock renderer");
profile-shell.js:4:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
profile-shell.js:5:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
profile-shell.js:151:            const selectedAvatar = avatar(profile.avatarId);
profile-shell.js:171:    const selectedAvatar = avatar(profile.avatarId);
profile-shell.js:306:        avatarId: document.querySelector('input[name="avatar"]:checked').value,
scripts/validate-avatar-progression-v550.mjs:140:if (/profile\.avatarId\s*=|equippedAvatarId\s*=/.test(avatarCase + avatarCaseProfile)) fail("Avatar Case must not change the equipped avatar");
scripts/validate-avatar-hotfix-adapters-extraction.mjs:196:  equippedAvatarId:"philippine_eagle",
scripts/validate-avatar-hotfix-adapters-extraction.mjs:199:  pendingUnlocks:[{avatarId:"dugong",source:"weekly"},{avatarId:"dugong",source:"weekly"}],
scripts/validate-avatar-hotfix-adapters-extraction.mjs:202:if (state.equippedAvatarId !== "eagle" || !state.ownedAvatarIds.includes("eagle") || state.shards.dugong !== 100) fail("Collection normalization changed");
scripts/validate-avatar-unlock-sharing.mjs:28:  equippedAvatarId:"anahaw",
scripts/validate-avatar-unlock-sharing.mjs:32:    {avatarId:"narra", source:"level_milestone", level:10, unlockedAt:"2026-01-01T00:00:00.000Z", animationSeen:false},
scripts/validate-avatar-unlock-sharing.mjs:33:    {avatarId:"katmon", source:"weekly_reward", weekKey:"2026-01-05", unlockedAt:"2026-01-08T00:00:00.000Z", animationSeen:false}
scripts/validate-avatar-unlock-sharing.mjs:38:if (first?.avatarId !== "narra") fail("The first unseen owned unlock must be selected");
scripts/validate-avatar-unlock-sharing.mjs:40:if (consumed.consumed?.avatarId !== "narra" || consumed.consumed.animationSeen !== true) {
scripts/validate-avatar-unlock-sharing.mjs:43:if (consumed.collection.pendingUnlocks.length !== 1 || consumed.collection.pendingUnlocks[0].avatarId !== "katmon") {
scripts/validate-avatar-unlock-sharing.mjs:46:if (logic.nextPending(consumed.collection, model)?.avatarId !== "katmon") {
scripts/validate-avatar-unlock-sharing.mjs:50:  equippedAvatarId:"anahaw",
scripts/validate-avatar-unlock-sharing.mjs:54:    {avatarId:"narra",source:"level_milestone",level:10,animationSeen:false},
scripts/validate-avatar-unlock-sharing.mjs:55:    {avatarId:"narra",source:"level_milestone",level:10,animationSeen:false}
scripts/validate-avatar-unlock-sharing.mjs:65:  pendingUnlocks:[{avatarId:"narra", source:"level_milestone", animationSeen:true}]
scripts/validate-avatar-unlock-sharing.mjs:108:  "profile?.avatarCollection?.equippedAvatarId",
scripts/validate-avatar-onboarding.mjs:23:if (!index.includes("avatarCollection")) {
scripts/validate-avatar-onboarding.mjs:26:if (!index.includes("model.normaliseCollectionState(profile.avatarCollection, profile.avatarId)")) {
scripts/validate-level-avatar-rewards.mjs:41:for (const [level, avatarId] of Object.entries(expected)) {
scripts/validate-level-avatar-rewards.mjs:42:  if (model.levelRewards[level] !== avatarId) fail(`Level ${level} must award ${avatarId}`);
scripts/validate-level-avatar-rewards.mjs:43:  const item = model.get(avatarId);
scripts/validate-level-avatar-rewards.mjs:54:  equippedAvatarId:"eagle",
scripts/validate-level-avatar-rewards.mjs:58:if (levelFifty.collection.equippedAvatarId !== "eagle") fail("Existing equipped avatar was not preserved");
scripts/validate-level-avatar-rewards.mjs:64:  if (!levelFifty.collection.ownedAvatarIds.includes(reward.avatarId)) fail(`Missing owned avatar ${reward.avatarId}`);
scripts/validate-level-avatar-rewards.mjs:65:  if (reward.avatar.shardRequirement && levelFifty.collection.shards[reward.avatarId] !== 100) fail(`Missing full shards for ${reward.avatarId}`);
scripts/validate-level-avatar-rewards.mjs:66:  const pending = levelFifty.collection.pendingUnlocks.find(entry => entry.avatarId === reward.avatarId);
scripts/validate-level-avatar-rewards.mjs:67:  if (!pending || pending.source !== "level_milestone" || pending.level !== reward.level) fail(`Missing pending unlock for ${reward.avatarId}`);
scripts/validate-level-avatar-rewards.mjs:74:  equippedAvatarId:"narra",
scripts/validate-level-avatar-rewards.mjs:90:  avatarId:"anahaw",
scripts/validate-level-avatar-rewards.mjs:91:  avatarCollection:{
scripts/validate-level-avatar-rewards.mjs:92:    equippedAvatarId:"anahaw",
scripts/validate-level-avatar-rewards.mjs:97:      {avatarId:"narra",source:"level_milestone",level:10},
scripts/validate-level-avatar-rewards.mjs:98:      {avatarId:"nipa_palm",source:"level_milestone",level:20}
scripts/validate-level-avatar-rewards.mjs:101:  avatarMilestoneRewards:{claims:{10:{avatarId:"narra"},20:{avatarId:"nipa_palm"}}}
scripts/validate-level-avatar-rewards.mjs:104:if (!repaired.changed || corrupted.avatarCollection.levelRewardsClaimed.length) fail("Future milestone claims were not repaired");
scripts/validate-level-avatar-rewards.mjs:105:if (corrupted.avatarCollection.ownedAvatarIds.includes("narra") || corrupted.avatarCollection.ownedAvatarIds.includes("nipa_palm")) {
scripts/validate-level-avatar-rewards.mjs:110:  "salitaQuestLocalProfilesV1",
scripts/validate-targeted-hotfix.mjs:19:requireCheck(start.includes("salitaQuestLocalProfilesV1"), "Restore must recognise the local profile store");
scripts/validate-avatar-case.mjs:40:  'const PROFILE_STORE = "salitaQuestLocalProfilesV1"',
scripts/validate-avatar-case.mjs:41:  'const ACTIVE_PROFILE = "salitaQuestActiveProfileId"',
scripts/validate-avatar-case.mjs:69:if (/profile\.avatarId\s*=/.test(runtime)) fail("Avatar Case must not change the equipped profile avatar");
scripts/validate-avatar-case.mjs:70:if (/equippedAvatarId\s*=/.test(runtime)) fail("Avatar Case must not change equippedAvatarId");
scripts/validate-avatar-case.mjs:203:    avatarId:"a",
scripts/validate-avatar-case.mjs:204:    avatarCollection:{equippedAvatarId:"a",ownedAvatarIds:["a","b","c","d","e"],shards:{}},
scripts/validate-avatar-case.mjs:221:  localStorage:{getItem:key => key === "salitaQuestLocalProfilesV1" ? stored : null,setItem:(key,value)=>{if(key === "salitaQuestLocalProfilesV1")stored=value;}},
scripts/validate-avatar-case.mjs:222:  sessionStorage:{getItem:key => key === "salitaQuestActiveProfileId" ? "profile-1" : null},
scripts/validate-avatar-case.mjs:236:    equippedAvatarId:input?.equippedAvatarId||fallback||null,
scripts/validate-avatar-case.mjs:262:if(finalProfile.avatarId!=="a"||finalProfile.avatarCollection.equippedAvatarId!=="a")fail("Avatar Case changed the equipped avatar");
scripts/validate-avatar-data-migration-module-extraction.mjs:66:  'const PROFILE_STORE = "salitaQuestLocalProfilesV1"',
scripts/validate-avatar-data-migration-module-extraction.mjs:91:  profiles:[{id:"p1", avatarId:"anahaw", avatarCollection:{ownedAvatarIds:["anahaw"]}}]
scripts/validate-avatar-data-migration-module-extraction.mjs:94:  ["salitaQuestLocalProfilesV1", JSON.stringify(store)],
scripts/validate-avatar-data-migration-module-extraction.mjs:104:const migratedStore = JSON.parse(values.get("salitaQuestLocalProfilesV1"));
scripts/validate-avatar-data-migration-module-extraction.mjs:105:if (!migratedStore.profiles[0].avatarCollection.ownedAvatarIds.includes("eagle")) fail("Legacy avatar ownership was not preserved");
scripts/validate-avatar-catalogue.mjs:55:if (migrated.equippedAvatarId !== "eagle") fail("Existing equipped avatar was not preserved");
scripts/validate-avatar-catalogue.mjs:62:if (!newLearner.needsStarterChoice || newLearner.equippedAvatarId !== null) fail("A new learner must require a starter choice");
src/config/course-manifest.js:100:      profileStore: "salitaQuestLocalProfilesV1",
src/config/course-manifest.js:101:      activeProfile: "salitaQuestActiveProfileId",
src/features/badges/long-term-badges-v1.js:30:    const collection = profile?.avatarCollection || {};
src/features/badges/long-term-badges-v1.js:33:      size(profile?.ownedAvatarIds), size(appState()?.avatarCollection?.ownedIds)
src/config/module-contracts.generated.json:120:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:125:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:241:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:246:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:708:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:713:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:718:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:740:          "avatarCollection",
src/config/module-contracts.generated.json:847:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:852:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:857:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:862:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:1220:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:1225:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:1230:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:1369:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:1374:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:1379:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:1699:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:1704:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:2054:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:2387:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:2392:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:2397:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:2437:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:2620:          "avatarId",
src/config/module-contracts.generated.json:2851:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:2856:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:2935:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:2940:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:2945:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:2996:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:3001:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:3051:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:3056:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:3442:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:3447:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:3609:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:3614:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:3678:          "avatarCollectionPane",
src/config/module-contracts.generated.json:3679:          "avatarCollectionTab"
src/config/module-contracts.generated.json:3808:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:3813:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:3823:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:4706:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:4711:          "key": "salitaQuestLocalProfilesV1"
src/config/module-contracts.generated.json:4716:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:4721:          "key": "salitaQuestActiveProfileId"
src/config/module-contracts.generated.json:6376:      "key": "salitaQuestLocalProfilesV1",
src/config/module-contracts.generated.json:6488:      "key": "salitaQuestActiveProfileId",
src/features/interface/collection-key-translation-hotfix.js:176:    const selector = ".sq-avatar-case-picker, .avatar-collection-modal, [data-avatar-collection-modal], #avatarCollectionModal";
src/features/interface/popup-governor-v1.js:164:  function getAvatarImagePath(avatarId) {
src/features/interface/popup-governor-v1.js:165:    try { return String(window.SalitaAvatarModel?.get?.(avatarId)?.image || ""); }
src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:14:  // dataset.avatarCollectionPane = "collection"
src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:15:  // dataset.avatarCollectionPane = "statistics"
src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:32:        if (button) setActive(button.dataset.avatarCollectionTab);
src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:48:    pane.dataset.avatarCollectionPane = tab;
src/features/avatar/avatar-collection-tabs-phase6-1-v1.js:85:      const selected = button.dataset.avatarCollectionTab === activeTab;
src/adapters/badges/badge-catalogue-runtime-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/adapters/badges/badge-catalogue-runtime-v1.js:6:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
src/features/avatar/avatar-catalogue-v1.js:131:    const fallback = normaliseId(source.equippedAvatarId || fallbackAvatarId);
src/features/avatar/avatar-catalogue-v1.js:141:    const equippedAvatarId = fallback && byId[fallback] ? fallback : null;
src/features/avatar/avatar-catalogue-v1.js:144:      equippedAvatarId,
src/features/avatar/avatar-catalogue-v1.js:148:        ? source.pendingUnlocks.filter(entry => get(entry?.avatarId)).map(entry => ({...entry, avatarId:normaliseId(entry.avatarId)}))
src/features/avatar/avatar-catalogue-v1.js:152:      needsStarterChoice:source.needsStarterChoice == null ? !equippedAvatarId : Boolean(source.needsStarterChoice)
src/features/avatar/avatar-catalogue-v1.js:165:    return Object.freeze({avatarId:item.id, owned, shards, required:item.shardRequirement, percent});
src/features/avatar/avatar-artwork-registry-v554.js:8:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/features/avatar/avatar-artwork-registry-v554.js:9:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
src/features/avatar/avatar-artwork-registry-v554.js:45:    const direct = image?.dataset?.avatarId || image?.dataset?.sqAvatarId;
src/features/avatar/avatar-artwork-registry-v554.js:87:      return normaliseId(profile?.avatarCollection?.equippedAvatarId || profile?.avatarId || "");
src/features/avatar/avatar-artwork-registry-v554.js:154:      syncEquipped(event.detail?.avatarId || event.detail?.avatar?.id);
src/adapters/badges/coin-shop-badge-runtime-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/adapters/badges/coin-shop-badge-runtime-v1.js:6:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
src/adapters/badges/coin-shop-badge-runtime-v1.js:32:      const owned = new Set(activeProfile()?.avatarCollection?.ownedAvatarIds || []);
src/features/avatar/avatar-case-v1.js:43:        detail:{avatarIds:[...cleaned],avatars:cleaned.map(id => model()?.get?.(id)).filter(Boolean),release:RELEASE}
src/features/avatar/avatar-progression-model-v551.js:61:        const avatarId = normaliseId(entry?.avatarId);
src/features/avatar/avatar-progression-model-v551.js:62:        if (!byId[avatarId] || entry?.animationSeen === true) return;
src/features/avatar/avatar-progression-model-v551.js:63:        const clean = {...entry, avatarId};
src/features/avatar/avatar-progression-model-v551.js:64:        const key = [avatarId, clean.source || "", clean.level || "", clean.weekKey || ""].join("|");
src/features/avatar/avatar-progression-model-v551.js:73:      const fallback = normaliseId(source.equippedAvatarId || fallbackAvatarId);
src/features/avatar/avatar-progression-model-v551.js:83:        equippedAvatarId:fallback && byId[fallback] ? fallback : null,
src/features/avatar/avatar-progression-model-v551.js:101:      return Object.freeze({avatarId:item.id, owned, shards, required:item.shardRequirement, percent});
src/adapters/avatar/avatar-case-profile-runtime-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/adapters/avatar/avatar-case-profile-runtime-v1.js:6:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
src/adapters/avatar/avatar-case-profile-runtime-v1.js:31:    const collection = model().normaliseCollectionState(profile.avatarCollection, profile.avatarId);
src/adapters/avatar/avatar-case-profile-runtime-v1.js:50:    const legacy = profile.avatarCollection?.caseAvatarIds;
src/adapters/avatar/avatar-case-profile-runtime-v1.js:64:    if (profile.avatarCollection && Object.hasOwn(profile.avatarCollection,"caseAvatarIds")) {
src/adapters/avatar/avatar-case-profile-runtime-v1.js:65:      delete profile.avatarCollection.caseAvatarIds;
src/features/avatar/avatar-collection-summary-v1.js:7:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/features/avatar/avatar-collection-summary-v1.js:8:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
src/features/avatar/avatar-collection-summary-v1.js:18:      return {model, collection:model.normaliseCollectionState(profile.avatarCollection, profile.avatarId)};
src/features/avatar/level-avatar-rewards-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/features/avatar/level-avatar-rewards-v1.js:6:  const ACTIVE_PROFILE = "salitaQuestActiveProfileId";
src/features/avatar/level-avatar-rewards-v1.js:13:    return [entry.avatarId || "", entry.source || "level_milestone", Number(entry.level) || ""].join("|");
src/features/avatar/level-avatar-rewards-v1.js:39:      processed.push({level:milestone, avatarId:item.id});
src/features/avatar/level-avatar-rewards-v1.js:45:        avatarId:item.id, source:"level_milestone", level:milestone, course,
src/features/avatar/level-avatar-rewards-v1.js:50:      awarded.push({level:milestone, avatarId:item.id, avatar:item});
src/features/avatar/level-avatar-rewards-v1.js:66:  function weeklyEvidence(profile, avatarId, requirement = 100) {
src/features/avatar/level-avatar-rewards-v1.js:70:      if (claim?.avatarId !== avatarId) return;
src/features/avatar/level-avatar-rewards-v1.js:76:  function nonLevelEvidence(profile, avatarId) {
src/features/avatar/level-avatar-rewards-v1.js:78:      .some(entry => entry?.avatarId === avatarId && entry?.source && entry.source !== "level_milestone");
src/features/avatar/level-avatar-rewards-v1.js:83:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
src/features/avatar/level-avatar-rewards-v1.js:107:      removed.push({level:milestone, avatarId:item.id});
src/features/avatar/level-avatar-rewards-v1.js:109:      const preserve = collection.equippedAvatarId === item.id || weekly.unlocked || nonLevelEvidence(profile, item.id);
src/features/avatar/level-avatar-rewards-v1.js:127:    profile.avatarCollection = model.normaliseCollectionState(collection, profile.avatarId);
src/features/avatar/level-avatar-rewards-v1.js:196:      const result = applyMilestoneRewards(safeLevel, profile.avatarCollection, model, {
src/features/avatar/level-avatar-rewards-v1.js:202:      profile.avatarCollection = result.collection;
src/features/avatar/level-avatar-rewards-v1.js:203:      if (result.collection.equippedAvatarId) profile.avatarId = result.collection.equippedAvatarId;
src/features/avatar/level-avatar-rewards-v1.js:212:          avatarId:reward.avatarId, course:activeCourse(), claimedAt:new Date().toISOString(), reason
src/features/avatar/avatar-progression-migration-v1.js:5:  const PROFILE_STORE = "salitaQuestLocalProfilesV1";
src/features/avatar/avatar-progression-migration-v1.js:33:    const direct = model.get(value.avatarId || value.id || value.rewardId);
src/features/avatar/avatar-progression-migration-v1.js:45:        const avatarId = resolveLegacyAvatarId(claim, model);
src/features/avatar/avatar-progression-migration-v1.js:46:        const item = model.get(avatarId);
src/features/avatar/avatar-progression-migration-v1.js:49:          avatarId:item.id,
src/features/avatar/avatar-progression-migration-v1.js:76:    const preserveAvatar = avatarId => {
src/features/avatar/avatar-progression-migration-v1.js:77:      const item = model.get(avatarId);
src/features/avatar/avatar-progression-migration-v1.js:90:        const avatarId = resolveLegacyAvatarId(claim, model);
src/features/avatar/avatar-progression-migration-v1.js:91:        const item = model.get(avatarId);
src/features/avatar/avatar-progression-migration-v1.js:98:          avatarId:item.id,
src/features/avatar/avatar-progression-migration-v1.js:114:      const avatarId = resolveLegacyAvatarId(
src/features/avatar/avatar-progression-migration-v1.js:118:      preserveAvatar(avatarId);
src/features/avatar/avatar-progression-migration-v1.js:132:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
src/features/avatar/avatar-progression-migration-v1.js:135:      avatarId:profile.avatarId || null,
src/features/avatar/avatar-progression-migration-v1.js:158:    profile.avatarCollection = model.normaliseCollectionState(collection, profile.avatarId);
src/features/avatar/avatar-progression-migration-v1.js:160:    if (profile.avatarCollection.equippedAvatarId) {
src/features/avatar/avatar-progression-migration-v1.js:161:      profile.avatarId = profile.avatarCollection.equippedAvatarId;
src/features/avatar/avatar-progression-migration-v1.js:183:      avatarId:profile.avatarId || null,
src/features/avatar/avatar-progression-migration-v1.js:184:      collection:profile.avatarCollection,
```

## Loader order and offline delivery
```text
mobile-refresh.html:49:      `./avatar-collection-screen-v1.js?v=${RELEASE}`,
mobile-refresh.html:50:      `./avatar-collection-screen-v1.css?v=${RELEASE}`,
src/config/course-manifest.js:10:    "weekly-avatar-chest.css?v=5.4.21",
src/config/course-manifest.js:35:    "weekly-avatar-chest.js?v=5.4.21",
src/config/course-manifest.js:37:    "weekly-avatar-polish.js?v=5.4.21",
src/config/course-manifest.js:68:    "weekly-avatar-chest.js?v=5.4.21",
src/config/course-manifest.js:70:    "weekly-avatar-polish.js?v=5.4.21",
src/config/course-manifest.js:95:  const desktopCollectionSafety = "@media(min-width:900px){.avatar-collection-modal,.sq-desktop-collection-safe,[data-avatar-collection-modal]{max-height:calc(100dvh - 32px)!important;overflow:hidden!important}.avatar-collection-modal .modal-content,.sq-desktop-collection-safe .modal-content,.avatar-collection-modal [role=tabpanel],.sq-desktop-collection-safe [role=tabpanel]{max-height:calc(100dvh - 190px)!important;overflow-y:auto!important;overscroll-behavior:contain}.avatar-case-slot img,.avatar-card img,.sq-desktop-collection-safe img{object-fit:contain!important;object-position:center!important;max-width:100%!important;max-height:100%!important}}";
profile-emblem-control.js:44:    addStylesheet("collection-css", `./avatar-collection-screen-v1.css?v=${RELEASE_VERSION}`);
profile-emblem-control.js:45:    addStylesheet("case-css", `./avatar-case-v1.css?v=${AVATAR_CASE_VERSION}`);
profile-emblem-control.js:46:    addStylesheet("weekly-css", `./weekly-avatar-shard-rewards-v1.css?v=${RELEASE_VERSION}`);
profile-emblem-control.js:64:      await loadScript("collection", `./avatar-collection-screen-v1.js?v=${RELEASE_VERSION}`, "Avatar collection screen could not be loaded.");
profile-emblem-control.js:65:      await loadScript("case-profile-runtime", `./src/adapters/avatar/avatar-case-profile-runtime-v1.js?v=${AVATAR_CASE_VERSION}`, "Avatar Case profile runtime could not be loaded.");
profile-emblem-control.js:66:      await loadScript("case-feature", `./src/features/avatar/avatar-case-v1.js?v=${AVATAR_CASE_VERSION}`, "Avatar Case feature could not be loaded.");
profile-emblem-control.js:67:      await loadScript("case", `./avatar-case-v1.js?v=${AVATAR_CASE_VERSION}`, "Avatar Case could not be loaded.");
profile-emblem-control.js:68:      await loadScript("weekly", `./weekly-avatar-shard-rewards-v1.js?v=${RELEASE_VERSION}`, "Weekly avatar rewards could not be loaded.");
service-worker.js:1:const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72";
service-worker.js:2:const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73";
service-worker.js:24:  "./compact-desktop-layout.css", "./compact-home-dashboard.css", "./weekly-avatar-chest.js",
service-worker.js:25:  "./weekly-avatar-polish.js", "./weekly-avatar-chest.css", "./daily-goal-refinement.js",
service-worker.js:55:  "./avatar-progression-migration-v1.js", "./src/features/avatar/avatar-progression-migration-v1.js", "./avatar-collection-screen-v1.js", "./avatar-collection-screen-v1.css",
service-worker.js:56:  "./avatar-case-v1.js", "./src/adapters/avatar/avatar-case-profile-runtime-v1.js", "./src/features/avatar/avatar-case-v1.js", "./avatar-case-v1.css",
service-worker.js:60:  "./weekly-avatar-shard-rewards-v1.js", "./weekly-avatar-shard-rewards-v1.css",
service-worker.js:149:  const cache = await caches.open(CACHE_NAME);
service-worker.js:166:  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(STATIC_FILES.map(file => cache.add(file)))));
service-worker.js:171:    .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
service-worker.js:193:        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
scripts/validate-mobile-refinement.mjs:88:  'const CACHE_NAME = "salita-quest-',
scripts/validate-home-dashboard.mjs:13:  "weekly-avatar-chest.js",
scripts/validate-home-dashboard.mjs:14:  "weekly-avatar-polish.js",
scripts/validate-home-dashboard.mjs:122:const keyAnimation = read("weekly-avatar-polish.js");
scripts/validate-home-dashboard.mjs:151:    'weekly-avatar-chest.css?v=5.4.21',
scripts/validate-home-dashboard.mjs:156:    'weekly-avatar-polish.js?v=5.4.21'
scripts/validate-home-dashboard.mjs:172:  'const CACHE_NAME = "salita-quest-',
scripts/validate-home-dashboard.mjs:174:  '"./weekly-avatar-polish.js"',
scripts/validate-home-dashboard.mjs:175:  '"./weekly-avatar-chest.css"',
scripts/validate-badge-stability.mjs:74:  [/data-share-avatar-case/, "Avatar Case sharing action"],
scripts/validate-badge-stability.mjs:199:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-badge-stability.mjs:200:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-badge-stability.mjs:205:  '"./avatar-case-v1.js"',
scripts/validate-badge-stability.mjs:206:  '"./avatar-case-v1.css"',
scripts/validate-stage1-popup-governance-v553.mjs:123:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-stage1-popup-governance-v553.mjs:124:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-stage1-popup-governance-v553.mjs:130:  '"./avatar-case-v1.js"',
scripts/validate-mobile-level-up-hotfix-v552.mjs:64:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-mobile-level-up-hotfix-v552.mjs:65:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-achievement-sharing-router-module-extraction.mjs:103:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-achievement-sharing-router-module-extraction.mjs:104:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-level-avatar-rewards-module-extraction.mjs:28:const weeklyIndex = loader.indexOf('weekly-avatar-shard-rewards-v1.js?v=${RELEASE_VERSION}');
scripts/validate-level-avatar-rewards-module-extraction.mjs:34:const previousCache = worker.match(/const PREVIOUS_CACHE_NAME = "([^"]+)"/)?.[1] || "";
scripts/validate-level-avatar-rewards-module-extraction.mjs:35:const currentCache = worker.match(/const CACHE_NAME = "([^"]+)"/)?.[1] || "";
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:37:  './avatar-case-desktop-safety.css?v=5.5.11',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:41:  './avatar-case-page-tab-v1.js?v=1.1',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:57:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:58:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:117:  './avatar-case-desktop-safety.css?v=5.5.11',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:121:  './avatar-case-page-tab-v1.js?v=1.1',
scripts/validate_modular_bootstrap.py:108:        'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73";',
scripts/validate-avatar-runtime-v556.mjs:25:  collection:read("avatar-collection-screen-v1.js"),
scripts/validate-avatar-runtime-v556.mjs:26:  avatarCaseRoot:read("avatar-case-v1.js"),
scripts/validate-avatar-runtime-v556.mjs:27:  avatarCaseProfile:read("src/adapters/avatar/avatar-case-profile-runtime-v1.js"),
scripts/validate-avatar-runtime-v556.mjs:28:  avatarCase:read("src/features/avatar/avatar-case-v1.js"),
scripts/validate-avatar-runtime-v556.mjs:29:  weekly:read("weekly-avatar-shard-rewards-v1.js"),
scripts/validate-avatar-runtime-v556.mjs:122:check(sources.worker.includes('PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"'), "Service worker records the pre-modular cache boundary");
scripts/validate-avatar-runtime-v556.mjs:123:check(sources.worker.includes('CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"'), "Service-worker cache revision is the modular-bootstrap release");
scripts/validate-avatar-runtime-v556.mjs:124:check(sources.worker.includes('"./avatar-case-v1.js"') && sources.worker.includes('"./avatar-case-v1.css"'), "Service worker precaches Avatar Case assets");
.github/workflows/validate-avatar-data-migration-module-extraction.yml:18:      - "scripts/validate-avatar-collection-screen.mjs"
.github/workflows/validate-avatar-data-migration-module-extraction.yml:43:      - "scripts/validate-avatar-collection-screen.mjs"
.github/workflows/validate-avatar-data-migration-module-extraction.yml:67:      - run: node scripts/validate-avatar-collection-screen.mjs
scripts/validate-persistent-navigation-ci.mjs:88:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-5-9-avatar-case-r51"',
scripts/validate-persistent-navigation-ci.mjs:89:  'const CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-audio-badge-release.mjs:129:  'const CACHE_NAME = "salita-quest-',
scripts/validate-facebook-share-link-module-extraction.mjs:20:for(const marker of ['const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"','const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"','"./facebook-share-link-v1.js"','"./src/features/sharing/facebook-share-link-v1.js"']) if(!worker.includes(marker)) fail(`Offline delivery missing ${marker}`);
scripts/validate-social-posting-audio-resume.mjs:85:  "data-share-avatar-case",
scripts/validate-social-posting-audio-resume.mjs:152:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-social-posting-audio-resume.mjs:153:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-social-posting-audio-resume.mjs:161:  '"./avatar-case-v1.js"',
scripts/validate-social-posting-audio-resume.mjs:162:  '"./avatar-case-v1.css"',
.github/workflows/validate-avatar-progression-v550.yml:9:      - "weekly-avatar-*.js"
.github/workflows/validate-avatar-progression-v550.yml:10:      - "weekly-avatar-*.css"
scripts/validate-avatar-collection-tabs-module-extraction.mjs:32:  "salita:avatar-case-changed",
scripts/validate-avatar-collection-tabs-module-extraction.mjs:33:  "salita:avatar-case-ready"
scripts/validate-avatar-collection-tabs-module-extraction.mjs:38:  'case: "sq-avatar-case-pane"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:58:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:59:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-progression-scenarios-navigation.mjs:229:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-progression-scenarios-navigation.mjs:230:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:6:      - "avatar-case-v1.js"
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:7:      - "src/adapters/avatar/avatar-case-profile-runtime-v1.js"
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:8:      - "src/features/avatar/avatar-case-v1.js"
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:11:      - "scripts/validate-avatar-case-profile-adapter-extraction.mjs"
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:12:      - "scripts/validate-avatar-case.mjs"
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:18:      - ".github/workflows/validate-avatar-case-profile-adapter-extraction.yml"
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:34:          node --check avatar-case-v1.js
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:35:          node --check src/adapters/avatar/avatar-case-profile-runtime-v1.js
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:36:          node --check src/features/avatar/avatar-case-v1.js
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:37:          node scripts/validate-avatar-case-profile-adapter-extraction.mjs
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:38:          node scripts/validate-avatar-case.mjs
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:39:          node scripts/validate-avatar-case-mobile-flow-hotfix.mjs
scripts/validate-avatar-case.mjs:13:const rootRuntime = read("avatar-case-v1.js");
scripts/validate-avatar-case.mjs:14:const profileRuntime = read("src/adapters/avatar/avatar-case-profile-runtime-v1.js");
scripts/validate-avatar-case.mjs:15:const runtime = read("src/features/avatar/avatar-case-v1.js");
scripts/validate-avatar-case.mjs:20:const css = read("avatar-case-v1.css");
scripts/validate-avatar-case.mjs:21:const collectionCss = read("avatar-collection-screen-v1.css");
scripts/validate-avatar-case.mjs:25:new vm.Script(rootRuntime,{filename:"avatar-case-v1.js"});
scripts/validate-avatar-case.mjs:26:new vm.Script(profileRuntime,{filename:"src/adapters/avatar/avatar-case-profile-runtime-v1.js"});
scripts/validate-avatar-case.mjs:27:new vm.Script(runtime,{filename:"src/features/avatar/avatar-case-v1.js"});
scripts/validate-avatar-case.mjs:50:  'const RELEASE = "5.5.10-avatar-case-compact"',
scripts/validate-avatar-case.mjs:52:  "data-avatar-case-toggle",
scripts/validate-avatar-case.mjs:54:  "sq-avatar-case-body",
scripts/validate-avatar-case.mjs:58:  "sq-avatar-case-picker-order",
scripts/validate-avatar-case.mjs:59:  "data-avatar-case-draft-move",
scripts/validate-avatar-case.mjs:60:  "data-avatar-case-draft-remove",
scripts/validate-avatar-case.mjs:63:  "data-avatar-case-open-picker",
scripts/validate-avatar-case.mjs:64:  "data-avatar-case-picker-save",
scripts/validate-avatar-case.mjs:65:  "data-share-avatar-case",
scripts/validate-avatar-case.mjs:66:  "salita:avatar-case-changed",
scripts/validate-avatar-case.mjs:72:if (/data-avatar-case-(?:move|remove)/.test(slotSource)) {
scripts/validate-avatar-case.mjs:80:  "data-share-avatar-case",
scripts/validate-avatar-case.mjs:96:  "avatar-case-v1.css",
scripts/validate-avatar-case.mjs:97:  "src/adapters/avatar/avatar-case-profile-runtime-v1.js",
scripts/validate-avatar-case.mjs:98:  "src/features/avatar/avatar-case-v1.js",
scripts/validate-avatar-case.mjs:99:  "avatar-case-v1.js",
scripts/validate-avatar-case.mjs:104:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-avatar-case.mjs:105:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-avatar-case.mjs:107:  '"./avatar-case-v1.js"',
scripts/validate-avatar-case.mjs:108:  '"./avatar-case-v1.css"',
scripts/validate-avatar-case.mjs:109:  '"./avatar-collection-screen-v1.css"',
scripts/validate-avatar-case.mjs:114:  ".sq-avatar-case-panel",
scripts/validate-avatar-case.mjs:115:  ".sq-avatar-case-toggle",
scripts/validate-avatar-case.mjs:116:  '.sq-avatar-case-toggle[aria-expanded="false"]',
scripts/validate-avatar-case.mjs:117:  ".sq-avatar-case-body[hidden]",
scripts/validate-avatar-case.mjs:118:  ".sq-avatar-case-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))",
scripts/validate-avatar-case.mjs:119:  ".sq-avatar-case-art img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain",
scripts/validate-avatar-case.mjs:120:  ".sq-avatar-case-picker{position:fixed;inset:0;z-index:2147483300",
scripts/validate-avatar-case.mjs:121:  ".sq-avatar-case-picker-order",
scripts/validate-avatar-case.mjs:122:  ".sq-avatar-case-order-item",
scripts/validate-avatar-case.mjs:123:  ".sq-avatar-case-order-controls",
scripts/validate-avatar-case.mjs:126:  ".sq-avatar-case-slots{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}",
scripts/validate-avatar-case.mjs:128:  ".dark-mode .sq-avatar-case-panel"
scripts/validate-avatar-case.mjs:137:  ".sq-avatar-case-panel,",
scripts/validate-avatar-case.mjs:144:  ".sq-avatar-case-body[hidden]",
scripts/validate-avatar-case.mjs:166:const pickerZ = zValue(css,/\.sq-avatar-case-picker\{[^}]*z-index:(\d+)/,"Avatar Case editor");
scripts/validate-avatar-case.mjs:242:vm.runInContext(profileRuntime,context,{filename:"avatar-case-profile-runtime-v1.behavior.js"});
scripts/validate-avatar-case.mjs:243:vm.runInContext(runtime,context,{filename:"avatar-case-feature-v1.behavior.js"});
scripts/validate-avatar-case.mjs:244:vm.runInContext(rootRuntime,context,{filename:"avatar-case-v1.behavior.js"});
.github/workflows/validate-coin-avatar-shop.yml:12:      - "weekly-avatar-shard-rewards-v1.js"
scripts/validate-ui-quality.mjs:110:  'const CACHE_NAME = "salita-quest-',
scripts/validate-pronunciation-module-extraction.mjs:70:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-pronunciation-module-extraction.mjs:71:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-desktop-shell-module-extraction.mjs:113:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-desktop-shell-module-extraction.mjs:114:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-even-progress-rail-module-extraction.mjs:78:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-even-progress-rail-module-extraction.mjs:79:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:13:      - scripts/validate-weekly-avatar-shards.mjs
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:28:      - scripts/validate-weekly-avatar-shards.mjs
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:46:          node scripts/validate-weekly-avatar-shards.mjs
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:48:          node scripts/validate-avatar-collection-screen.mjs
.github/workflows/validate-avatar-case-mobile-flow-hotfix.yml:6:      - "avatar-case-mobile-flow-hotfix-v1.css"
.github/workflows/validate-avatar-case-mobile-flow-hotfix.yml:8:      - "scripts/validate-avatar-case-mobile-flow-hotfix.mjs"
.github/workflows/validate-avatar-case-mobile-flow-hotfix.yml:9:      - ".github/workflows/validate-avatar-case-mobile-flow-hotfix.yml"
.github/workflows/validate-avatar-case-mobile-flow-hotfix.yml:19:      - run: node scripts/validate-avatar-case-mobile-flow-hotfix.mjs
scripts/validate-placement-sharing.mjs:112:  '"./avatar-case-v1.js"',
scripts/validate-placement-sharing.mjs:113:  '"./avatar-case-v1.css"',
scripts/validate-placement-sharing.mjs:120:if (!worker.includes('const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"')) {
scripts/validate-placement-sharing.mjs:123:if (!worker.includes('const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"')) {
scripts/validate-avatar-collection-summary-module-extraction.mjs:58:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:59:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-avatar-progression-v550.mjs:15:  {file:"scripts/validate-avatar-collection-screen.mjs", args:[]},
scripts/validate-avatar-progression-v550.mjs:16:  {file:"scripts/validate-avatar-case.mjs", args:[]},
scripts/validate-avatar-progression-v550.mjs:17:  {file:"scripts/validate-weekly-avatar-shards.mjs", args:[]},
scripts/validate-avatar-progression-v550.mjs:44:  "avatar-collection-screen-v1.js",
scripts/validate-avatar-progression-v550.mjs:45:  "avatar-case-v1.js",
scripts/validate-avatar-progression-v550.mjs:46:  "weekly-avatar-shard-rewards-v1.js",
scripts/validate-avatar-progression-v550.mjs:135:const avatarCaseRoot = read("avatar-case-v1.js");
scripts/validate-avatar-progression-v550.mjs:136:const avatarCaseProfile = read("src/adapters/avatar/avatar-case-profile-runtime-v1.js");
scripts/validate-avatar-progression-v550.mjs:137:const avatarCase = read("src/features/avatar/avatar-case-v1.js");
scripts/validate-avatar-progression-v550.mjs:149:if (!serviceWorker.includes('const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"')) fail("Service worker does not retain the pre-modular release boundary");
scripts/validate-avatar-progression-v550.mjs:150:if (!serviceWorker.includes('const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"')) fail("Service worker cache version is not the modular-bootstrap release");
scripts/validate-avatar-progression-v550.mjs:153:if (!serviceWorker.includes('"./avatar-case-v1.js"') || !serviceWorker.includes('"./avatar-case-v1.css"')) fail("Service worker does not precache the Avatar Case runtime");
scripts/validate-avatar-hotfix-adapters-extraction.mjs:93:const previousCache = worker.match(/const PREVIOUS_CACHE_NAME = "([^"]+)"/)?.[1] || "";
scripts/validate-avatar-hotfix-adapters-extraction.mjs:94:const currentCache = worker.match(/const CACHE_NAME = "([^"]+)"/)?.[1] || "";
scripts/validate-avatar-hotfix-adapters-extraction.mjs:96:if (currentCache !== "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73") fail("Current cache is not r69");
scripts/validate-avatar-collection-pane-flow.mjs:8:const hotfixIndex = loader.indexOf('avatar-case-mobile-flow-hotfix-v1.css?v=5.7.2');
scripts/validate-avatar-collection-pane-flow.mjs:16:  ['actions below grid', css.includes('.sq-avatar-case-actions') && css.includes('clear:both!important')],
.github/workflows/inspect-avatar-collection-screen.yml:5:    branches: [agent/audit-avatar-collection-screen]
.github/workflows/inspect-avatar-collection-screen.yml:7:      - ".github/workflows/inspect-avatar-collection-screen.yml"
.github/workflows/inspect-avatar-collection-screen.yml:26:          node --check avatar-collection-screen-v1.js
.github/workflows/inspect-avatar-collection-screen.yml:32:            echo '- Target: `avatar-collection-screen-v1.js`'
.github/workflows/inspect-avatar-collection-screen.yml:36:            wc -c avatar-collection-screen-v1.js
.github/workflows/inspect-avatar-collection-screen.yml:37:            rg -n 'localStorage|sessionStorage|setInterval|clearInterval|MutationObserver|addEventListener|dispatchEvent|SalitaAvatarCollectionScreen|SalitaAvatarModel|SalitaAvatarArtwork|PROFILE_STORE|ACTIVE_PROFILE|writeStore|refreshProfile|equipAvatar|openDetail|installLauncher' avatar-collection-screen-v1.js || true
.github/workflows/inspect-avatar-collection-screen.yml:42:            rg -n --glob '!docs/TEMP_AVATAR_COLLECTION_AUDIT.md' 'avatar-collection-screen-v1\.js' . || true
.github/workflows/inspect-avatar-collection-screen.yml:47:            rg -n --glob '!avatar-collection-screen-v1.js' --glob '!docs/TEMP_AVATAR_COLLECTION_AUDIT.md' 'SalitaAvatarCollectionScreen|salita:open-avatar-collection|salita:avatar-equipped|salita:avatar-collection-changed' . || true
.github/workflows/inspect-avatar-collection-screen.yml:57:            rg -n 'avatar-collection-screen|avatar-case|weekly-avatar|CACHE_NAME|PREVIOUS_CACHE_NAME' profile-emblem-control.js service-worker.js mobile-refresh.html src/config/course-manifest.js scripts .github/workflows 2>/dev/null || true
.github/workflows/inspect-avatar-collection-screen.yml:73:          git push origin HEAD:agent/audit-avatar-collection-screen
scripts/validate-avatar-collection-screen.mjs:9:const screenSource = read("avatar-collection-screen-v1.js");
scripts/validate-avatar-collection-screen.mjs:10:const screenCss = read("avatar-collection-screen-v1.css");
scripts/validate-avatar-collection-screen.mjs:14:new vm.Script(screenSource, {filename:"avatar-collection-screen-v1.js"});
scripts/validate-avatar-collection-screen.mjs:63:if (!emblemSource.includes("avatar-collection-screen-v1.css") || !emblemSource.includes("addStylesheet")) {
scripts/validate-avatar-collection-screen.mjs:66:if (!emblemSource.includes("avatar-collection-screen-v1.js") || !emblemSource.includes('loadScript("collection"')) {
scripts/validate-avatar-artwork-registry-module-extraction.mjs:92:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-avatar-artwork-registry-module-extraction.mjs:93:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-coin-avatar-shop.mjs:14:const weekly = read("weekly-avatar-shard-rewards-v1.js");
scripts/validate-hosted-achievement-sharing.mjs:191:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-hosted-achievement-sharing.mjs:192:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-hosted-achievement-sharing.mjs:197:  '"./avatar-case-v1.js"',
scripts/validate-hosted-achievement-sharing.mjs:198:  '"./avatar-case-v1.css"',
scripts/validate-avatar-case-profile-adapter-extraction.mjs:13:const root = read("avatar-case-v1.js");
scripts/validate-avatar-case-profile-adapter-extraction.mjs:14:const adapter = read("src/adapters/avatar/avatar-case-profile-runtime-v1.js");
scripts/validate-avatar-case-profile-adapter-extraction.mjs:15:const feature = read("src/features/avatar/avatar-case-v1.js");
scripts/validate-avatar-case-profile-adapter-extraction.mjs:19:new vm.Script(root,{filename:"avatar-case-v1.js"});
scripts/validate-avatar-case-profile-adapter-extraction.mjs:20:new vm.Script(adapter,{filename:"src/adapters/avatar/avatar-case-profile-runtime-v1.js"});
scripts/validate-avatar-case-profile-adapter-extraction.mjs:21:new vm.Script(feature,{filename:"src/features/avatar/avatar-case-v1.js"});
scripts/validate-avatar-case-profile-adapter-extraction.mjs:24:for (const forbidden of ["salitaQuestLocalProfilesV1","salitaQuestActiveProfileId","localStorage","sessionStorage","sq-avatar-case-panel","SalitaQuestAvatarCase ="]) {
scripts/validate-avatar-case-profile-adapter-extraction.mjs:28:for (const forbidden of ["document.addEventListener","MutationObserver","sq-avatar-case-panel","salita:avatar-case-changed","SalitaQuestAvatarCase ="]) {
scripts/validate-avatar-case-profile-adapter-extraction.mjs:31:requireMarkers(feature,["MAX_CASE_AVATARS = 4","5.5.10-avatar-case-compact","sq-avatar-case-panel","sq-avatar-case-picker","salita:avatar-case-changed","salita:avatar-case-ready","SalitaQuestAvatarCase = Object.freeze"],"feature");
scripts/validate-avatar-case-profile-adapter-extraction.mjs:45:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-avatar-case-profile-adapter-extraction.mjs:46:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-avatar-case-profile-adapter-extraction.mjs:47:  '"./avatar-case-v1.js"',
scripts/validate-avatar-case-profile-adapter-extraction.mjs:48:  '"./src/adapters/avatar/avatar-case-profile-runtime-v1.js"',
scripts/validate-avatar-case-profile-adapter-extraction.mjs:49:  '"./src/features/avatar/avatar-case-v1.js"'
scripts/validate-economy-tracking-module-extraction.mjs:53:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-economy-tracking-module-extraction.mjs:54:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-avatar-three-tabs.mjs:14:  'sq-avatar-case-pane',
scripts/validate-avatar-three-tabs.mjs:21:if (!css.includes('.sq-avatar-case-pane[hidden]')) fail('Avatar Case pane must be independently hideable.');
scripts/validate-weekly-avatar-shards.mjs:8:const source = read("weekly-avatar-shard-rewards-v1.js");
scripts/validate-weekly-avatar-shards.mjs:9:const css = read("weekly-avatar-shard-rewards-v1.css");
scripts/validate-weekly-avatar-shards.mjs:14:new vm.Script(source, {filename:"weekly-avatar-shard-rewards-v1.js"});
scripts/validate-weekly-avatar-shards.mjs:23:  "data-weekly-avatar-target",
scripts/validate-weekly-avatar-shards.mjs:50:  ".weekly-avatar-target-grid",
scripts/validate-weekly-avatar-shards.mjs:51:  ".weekly-avatar-target-grey",
scripts/validate-weekly-avatar-shards.mjs:69:if (!loader.includes("weekly-avatar-shard-rewards-v1.css") || !loader.includes("addStylesheet")) {
scripts/validate-weekly-avatar-shards.mjs:72:if (!loader.includes("weekly-avatar-shard-rewards-v1.js") || !loader.includes('loadScript("weekly"')) {
scripts/validate-phase6-1-tabs-case.mjs:27:  '.sq-avatar-case-body:not([hidden])'
scripts/validate-avatar-data-migration-module-extraction.mjs:129:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-avatar-data-migration-module-extraction.mjs:130:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-popup-governor-module-extraction.mjs:48:  '".weekly-avatar-shard-modal:not([hidden])"',
scripts/validate-popup-governor-module-extraction.mjs:81:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-popup-governor-module-extraction.mjs:82:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-incorrect-order-feedback-adapter-extraction.mjs:120:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-incorrect-order-feedback-adapter-extraction.mjs:121:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-persistent-navigation.mjs:108:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-persistent-navigation.mjs:109:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-avatar-case-mobile-flow-hotfix.mjs:3:const css = fs.readFileSync("avatar-case-mobile-flow-hotfix-v1.css", "utf8");
scripts/validate-avatar-case-mobile-flow-hotfix.mjs:8:  ".sq-avatar-case-panel",
scripts/validate-avatar-case-mobile-flow-hotfix.mjs:12:  ".sq-avatar-case-body:not([hidden])",
scripts/validate-avatar-case-mobile-flow-hotfix.mjs:15:  ".sq-avatar-case-slot.is-filled",
scripts/validate-avatar-case-mobile-flow-hotfix.mjs:26:if (!loader.includes("avatar-case-mobile-flow-hotfix-v1.css?v=5.7.2")) {
scripts/validate-long-term-badge-adapter-extraction.mjs:33:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-long-term-badge-adapter-extraction.mjs:34:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-bisaya-audio-library.mjs:137:check(serviceWorker.includes('const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"'),
scripts/validate-bisaya-audio-library.mjs:139:check(serviceWorker.includes('const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"'),
scripts/validate-home-reward-coordinator-module-extraction.mjs:82:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-home-reward-coordinator-module-extraction.mjs:83:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
scripts/validate-coin-shop-badge-adapter-extraction.mjs:62:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-19-long-term-badge-adapter-extraction-r72"',
scripts/validate-coin-shop-badge-adapter-extraction.mjs:63:  'const CACHE_NAME = "salita-quest-v5-6-20-avatar-case-profile-adapter-extraction-r73"',
```

## Related validators
```text
scripts/validate-level-avatar-rewards-module-extraction.mjs:22:for (const marker of ['const PROFILE_STORE = "salitaQuestLocalProfilesV1"','const ACTIVE_PROFILE = "salitaQuestActiveProfileId"','const ACTIVE_COURSE = "salitaQuestActiveCourse"','const INSTALL_FLAG = "__salitaQuestLevelAvatarRewardsV3Installed"','const RELEASE = "5.5.3"','Object.freeze([10,20,30,40,50,60,70,80,90,99])',"repairFutureMilestones","root.SalitaLevelAvatarRewardLogic = Object.freeze","window.SalitaLevelAvatarRewards = Object.freeze",'new CustomEvent("salita:avatar-milestones-awarded"','new CustomEvent("salita:avatar-milestones-repaired"','new CustomEvent("salita:avatar-collection-changed"'])
scripts/validate-level-avatar-rewards-module-extraction.mjs:67:if (events.map(event=>event.type).join("|")!=="salita:avatar-collection-changed|salita:avatar-milestones-awarded") fail("Award event order changed");
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:39:  './avatar-collection-page-v2.css?v=5.5.12',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:40:  './avatar-collection-page-v2.js?v=5.5.12',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:119:  './avatar-collection-page-v2.css?v=5.5.12',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:120:  './avatar-collection-page-v2.js?v=5.5.12',
.github/workflows/validate-economy-tracking-module-extraction.yml:12:      - 'scripts/validate-avatar-collection-pane-flow.mjs'
.github/workflows/validate-economy-tracking-module-extraction.yml:32:          node scripts/validate-avatar-collection-pane-flow.mjs
scripts/validate-avatar-runtime-v556.mjs:21:      navigationAdapter:read("src/adapters/navigation/avatar-collections-navigation-v551.js"),
scripts/validate-avatar-runtime-v556.mjs:25:  collection:read("avatar-collection-screen-v1.js"),
scripts/validate-persistent-navigation-ci.mjs:28:  'action:"avatar-collection"',
scripts/validate-persistent-navigation-ci.mjs:29:  "salita:open-avatar-collection",
scripts/validate-avatar-unlock-sharing.mjs:72:  "window.SalitaAvatarCollectionScreen",
scripts/validate-avatar-unlock-sharing.mjs:73:  "salita:open-avatar-collection",
scripts/validate-avatar-unlock-sharing.mjs:123:  'document.addEventListener("salita:avatar-collection-changed"',
.github/workflows/validate-economy-v2-phase5.yml:6:      - "avatar-collection-summary-v1.js"
.github/workflows/validate-economy-v2-phase5.yml:7:      - "avatar-collection-summary-v1.css"
scripts/validate-avatar-collection-rarity-fill.mjs:3:const css = fs.readFileSync("avatar-collection-rarity-fill-v1.css", "utf8");
scripts/validate-avatar-collection-rarity-fill.mjs:18:if (!loader.includes('avatar-collection-rarity-fill-v1.css?v=5.6.7')) throw new Error("Collection rarity stylesheet is not loaded");
scripts/validate-avatar-onboarding.mjs:24:  fail("New profiles must initialise avatar collection data.");
.github/workflows/validate-avatar-data-migration-module-extraction.yml:18:      - "scripts/validate-avatar-collection-screen.mjs"
.github/workflows/validate-avatar-data-migration-module-extraction.yml:43:      - "scripts/validate-avatar-collection-screen.mjs"
.github/workflows/validate-avatar-data-migration-module-extraction.yml:67:      - run: node scripts/validate-avatar-collection-screen.mjs
scripts/validate-avatar-collection-tabs-module-extraction.mjs:8:const rootFile = "avatar-collection-tabs-phase6-1-v1.js";
scripts/validate-avatar-collection-tabs-module-extraction.mjs:9:const moduleFile = "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js";
scripts/validate-avatar-collection-tabs-module-extraction.mjs:19:  'const TARGET = "./src/features/avatar/avatar-collection-tabs-phase6-1-v1.js?v=5.7.4"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:23:  'salitaCompatibilityLoader = "avatar-collection-tabs-phase6-1-v1"'
scripts/validate-avatar-collection-tabs-module-extraction.mjs:25:for (const forbidden of ["PANE_CLASSES", "ensureTabs", "ensurePane", "moveContent", "applyActive", "MutationObserver", "SalitaAvatarCollectionTabsPhase61 =", "salita:avatar-collection-tabs-ready"])
scripts/validate-avatar-collection-tabs-module-extraction.mjs:29:  "salita:open-avatar-collection",
scripts/validate-avatar-collection-tabs-module-extraction.mjs:31:  "salita:avatar-collection-changed",
scripts/validate-avatar-collection-tabs-module-extraction.mjs:39:  'collection: "sq-avatar-collection-pane"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:41:  'data-avatar-collection-tab="case"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:42:  'data-avatar-collection-tab="collection"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:43:  'data-avatar-collection-tab="statistics"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:45:  'salita:avatar-collection-tabs-ready'
scripts/validate-avatar-collection-tabs-module-extraction.mjs:51:const summaryIndex = loader.indexOf('avatar-collection-summary-v1.js?v=5.6.9');
scripts/validate-avatar-collection-tabs-module-extraction.mjs:53:const tabsIndex = loader.indexOf('src/features/avatar/avatar-collection-tabs-phase6-1-v1.js?v=5.7.4');
scripts/validate-avatar-collection-tabs-module-extraction.mjs:55:if (loader.includes('"./avatar-collection-tabs-phase6-1-v1.js?v=5.7.4"')) fail("Current loader still targets the root compatibility URL");
scripts/validate-avatar-collection-tabs-module-extraction.mjs:60:  '"./avatar-collection-tabs-phase6-1-v1.js"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:61:  '"./src/features/avatar/avatar-collection-tabs-phase6-1-v1.js"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:62:  '"./avatar-collection-tabs-phase6-1-v1.css"'
scripts/validate-avatar-collection-tabs-module-extraction.mjs:88:if (dispatched.length !== 1 || dispatched[0].type !== "salita:avatar-collection-tabs-ready" || dispatched[0].detail?.release !== api.release) fail("Ready-event contract changed");
scripts/validate-avatar-collection-tabs-module-extraction.mjs:93:console.log("Avatar Collection tabs extraction validation passed: direct topbar delivery, compatibility-only root, stable API, five listeners, one observer, pane contracts and r64 offline delivery.");
scripts/validate-progression-scenarios-navigation.mjs:150:  'action:"avatar-collection"',
scripts/validate-progression-scenarios-navigation.mjs:154:  'new CustomEvent("salita:open-avatar-collection"',
scripts/validate-progression-scenarios-navigation.mjs:243:console.log(`Validated live Quick Review item counting, World Progress states, ${totalXpTo99} XP to Level 99, governed acknowledgement-before-render level celebrations, ${scenarioCount} adaptive scenarios, persistent labelled navigation, dedicated Badges and Avatar Collection routes, small-desktop safety, modular course loading and offline delivery.`);
scripts/validate-avatar-case.mjs:21:const collectionCss = read("avatar-collection-screen-v1.css");
scripts/validate-avatar-case.mjs:109:  '"./avatar-collection-screen-v1.css"',
scripts/validate-avatar-case.mjs:133:  ".sq-avatar-collection-backdrop{position:fixed;inset:0;z-index:2147483000",
scripts/validate-avatar-case.mjs:136:  ".sq-avatar-collection-header,",
scripts/validate-avatar-case.mjs:138:  ".sq-avatar-collection-summary,",
scripts/validate-avatar-case.mjs:139:  ".sq-avatar-collection-scroll{",
scripts/validate-avatar-case.mjs:149:  fail("Avatar Collection must not return to a three-row grid after inserting the Avatar Case");
scripts/validate-avatar-case.mjs:164:const collectionZ = zValue(collectionCss,/\.sq-avatar-collection-backdrop\{[^}]*z-index:(\d+)/,"collection");
.github/workflows/validate-avatar-case-profile-adapter-extraction.yml:40:          node scripts/validate-avatar-collection-pane-flow.mjs
scripts/validate-economy-v2-phase5.mjs:4:const rootLoader = fs.readFileSync("avatar-collection-summary-v1.js", "utf8");
scripts/validate-economy-v2-phase5.mjs:5:const summary = fs.readFileSync("src/features/avatar/avatar-collection-summary-v1.js", "utf8");
scripts/validate-economy-v2-phase5.mjs:6:const css = fs.readFileSync("avatar-collection-summary-v1.css", "utf8");
scripts/validate-economy-v2-phase5.mjs:11:new vm.Script(rootLoader, {filename:"avatar-collection-summary-v1.js"});
scripts/validate-economy-v2-phase5.mjs:12:new vm.Script(summary, {filename:"src/features/avatar/avatar-collection-summary-v1.js"});
scripts/validate-economy-v2-phase5.mjs:33:  'avatar-collection-summary-v1.css?v=5.6.9',
scripts/validate-economy-v2-phase5.mjs:34:  'src/features/avatar/avatar-collection-summary-v1.js?v=5.6.9',
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:1:name: Validate Avatar Collection summary module extraction
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:5:      - 'avatar-collection-summary-v1.js'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:6:      - 'src/features/avatar/avatar-collection-summary-v1.js'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:7:      - 'avatar-collection-summary-v1.css'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:10:      - 'scripts/validate-avatar-collection-summary-module-extraction.mjs'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:13:      - 'scripts/validate-avatar-collection-tabs-module-extraction.mjs'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:14:      - 'scripts/validate-avatar-collection-pane-flow.mjs'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:20:      - '.github/workflows/validate-avatar-collection-summary-module-extraction.yml'
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:33:          node --check avatar-collection-summary-v1.js
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:34:          node --check src/features/avatar/avatar-collection-summary-v1.js
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:35:          node scripts/validate-avatar-collection-summary-module-extraction.mjs
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:40:          node scripts/validate-avatar-collection-tabs-module-extraction.mjs
.github/workflows/validate-avatar-collection-summary-module-extraction.yml:41:          node scripts/validate-avatar-collection-pane-flow.mjs
scripts/validate-avatar-collection-summary-module-extraction.mjs:8:const rootFile = "avatar-collection-summary-v1.js";
scripts/validate-avatar-collection-summary-module-extraction.mjs:9:const moduleFile = "src/features/avatar/avatar-collection-summary-v1.js";
scripts/validate-avatar-collection-summary-module-extraction.mjs:19:  'const TARGET = "./src/features/avatar/avatar-collection-summary-v1.js?v=5.6.9"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:23:  'salitaCompatibilityLoader = "avatar-collection-summary-v1"'
scripts/validate-avatar-collection-summary-module-extraction.mjs:29:  "salita:open-avatar-collection",
scripts/validate-avatar-collection-summary-module-extraction.mjs:30:  "salita:avatar-collection-changed",
scripts/validate-avatar-collection-summary-module-extraction.mjs:42:  'summary.className = "sq-avatar-collection-summary"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:51:const summaryIndex = loader.indexOf('src/features/avatar/avatar-collection-summary-v1.js?v=5.6.9');
scripts/validate-avatar-collection-summary-module-extraction.mjs:53:const tabsIndex = loader.indexOf('src/features/avatar/avatar-collection-tabs-phase6-1-v1.js?v=5.7.4');
scripts/validate-avatar-collection-summary-module-extraction.mjs:55:if (loader.includes('"./avatar-collection-summary-v1.js?v=5.6.9"')) fail("Current loader still targets the root compatibility URL");
scripts/validate-avatar-collection-summary-module-extraction.mjs:60:  '"./avatar-collection-summary-v1.js"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:61:  '"./src/features/avatar/avatar-collection-summary-v1.js"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:62:  '"./avatar-collection-summary-v1.css"'
scripts/validate-avatar-collection-summary-module-extraction.mjs:77:    if (selector === ".sq-avatar-collection-header") return header;
scripts/validate-avatar-collection-summary-module-extraction.mjs:78:    if (selector === ".sq-avatar-collection-summary") return summaryElement;
scripts/validate-avatar-collection-summary-module-extraction.mjs:83:  querySelector(selector){ return selector === ".sq-avatar-collection" ? host : null; },
scripts/validate-avatar-collection-summary-module-extraction.mjs:123:if (summaryElement.className !== "sq-avatar-collection-summary" || summaryElement.attributes["aria-label"] !== "Avatar collection progress") fail("Summary DOM contract changed");
scripts/validate-avatar-collection-summary-module-extraction.mjs:130:console.log("Avatar Collection summary extraction validation passed: direct topbar delivery, compatibility-only root, exact storage keys, stable totals/render API, four listeners, one interval and r65 offline delivery.");
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:1:name: Validate Avatar Collection tabs module extraction
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:5:      - 'avatar-collection-tabs-phase6-1-v1.js'
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:6:      - 'src/features/avatar/avatar-collection-tabs-phase6-1-v1.js'
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:7:      - 'avatar-collection-tabs-phase6-1-v1.css'
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:10:      - 'scripts/validate-avatar-collection-tabs-module-extraction.mjs'
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:13:      - 'scripts/validate-avatar-collection-pane-flow.mjs'
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:16:      - '.github/workflows/validate-avatar-collection-tabs-module-extraction.yml'
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:28:        run: node scripts/validate-avatar-collection-tabs-module-extraction.mjs
.github/workflows/validate-avatar-collection-tabs-module-extraction.yml:33:          node scripts/validate-avatar-collection-pane-flow.mjs
scripts/validate-avatar-progression-v550.mjs:15:  {file:"scripts/validate-avatar-collection-screen.mjs", args:[]},
scripts/validate-avatar-progression-v550.mjs:38:  "src/adapters/navigation/avatar-collections-navigation-v551.js",
scripts/validate-avatar-progression-v550.mjs:44:  "avatar-collection-screen-v1.js",
scripts/validate-avatar-progression-v550.mjs:106:const navigationAdapter = read("src/adapters/navigation/avatar-collections-navigation-v551.js");
scripts/validate-avatar-progression-v550.mjs:145:if (!navigation.includes('action:"avatar-collection"')) fail("Persistent navigation does not expose the Avatar Collection and Avatar Case");
scripts/validate-avatar-hotfix-adapters-extraction.mjs:8:const navigationFile = "src/adapters/navigation/avatar-collections-navigation-v551.js";
scripts/validate-avatar-hotfix-adapters-extraction.mjs:24:  'const NAVIGATION_URL = "./src/adapters/navigation/avatar-collections-navigation-v551.js?v=5.5.6"',
scripts/validate-avatar-hotfix-adapters-extraction.mjs:45:  "data-open-badge-collection", "data-open-avatar-collection-main", "setTimeout"
scripts/validate-avatar-hotfix-adapters-extraction.mjs:51:  "data-open-badge-collection", "data-open-avatar-collection-main", "closeMobileMenu",
scripts/validate-avatar-hotfix-adapters-extraction.mjs:52:  "renderBadges", 'new CustomEvent("salita:open-avatar-collection"',
scripts/validate-avatar-hotfix-adapters-extraction.mjs:159:        element.querySelector = selector => selector === "[data-open-badge-collection]" ? badgeButton : selector === "[data-open-avatar-collection-main]" ? avatarButton : null;
scripts/validate-avatar-hotfix-adapters-extraction.mjs:214:if (dom.document.events.at(-1)?.type !== "salita:open-avatar-collection") fail("Avatar collection action changed");
scripts/validate-avatar-hotfix-adapters-extraction.mjs:254:    } else if (script.src.includes("avatar-collections-navigation-v551.js")) {
scripts/validate-avatar-collection-pane-flow.mjs:3:const js = fs.readFileSync('src/features/avatar/avatar-collection-tabs-phase6-1-v1.js','utf8');
scripts/validate-avatar-collection-pane-flow.mjs:4:const css = fs.readFileSync('avatar-collection-tabs-phase6-1-v1.css','utf8');
scripts/validate-avatar-collection-pane-flow.mjs:9:const structuralIndex = loader.indexOf('avatar-collection-tabs-phase6-1-v1.css?v=5.7.3');
scripts/validate-avatar-collection-pane-flow.mjs:12:  ['collection pane wrapper', js.includes('sq-avatar-collection-pane') && js.includes('collectionPane.appendChild(child)')],
scripts/validate-avatar-collection-pane-flow.mjs:17:  ['summary follows case', css.includes('.sq-avatar-collection-summary{order:1!important')],
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:7:      - src/adapters/navigation/avatar-collections-navigation-v551.js
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:22:      - src/adapters/navigation/avatar-collections-navigation-v551.js
.github/workflows/validate-avatar-hotfix-adapters-extraction.yml:48:          node scripts/validate-avatar-collection-screen.mjs
scripts/validate-avatar-collection-screen.mjs:9:const screenSource = read("avatar-collection-screen-v1.js");
scripts/validate-avatar-collection-screen.mjs:10:const screenCss = read("avatar-collection-screen-v1.css");
scripts/validate-avatar-collection-screen.mjs:14:new vm.Script(screenSource, {filename:"avatar-collection-screen-v1.js"});
scripts/validate-avatar-collection-screen.mjs:63:if (!emblemSource.includes("avatar-collection-screen-v1.css") || !emblemSource.includes("addStylesheet")) {
scripts/validate-avatar-collection-screen.mjs:66:if (!emblemSource.includes("avatar-collection-screen-v1.js") || !emblemSource.includes('loadScript("collection"')) {
scripts/validate-level-avatar-rewards.mjs:114:  "salita:avatar-collection-changed",
scripts/validate-economy-tracking-module-extraction.mjs:29:  "salita:open-avatar-collection",
scripts/validate-economy-tracking-module-extraction.mjs:32:  "salita:avatar-collection-changed",
scripts/validate-economy-tracking-module-extraction.mjs:33:  "salita:avatar-collection-tabs-ready"
scripts/validate-economy-tracking-module-extraction.mjs:47:const summaryIndex = loader.indexOf('avatar-collection-summary-v1.js?v=5.6.9');
scripts/validate-economy-tracking-module-extraction.mjs:49:const tabsIndex = loader.indexOf('avatar-collection-tabs-phase6-1-v1.js?v=5.7.4');
scripts/validate-weekly-avatar-shards.mjs:28:  "salita:avatar-collection-changed",
.github/workflows/validate-avatar-three-tabs.yml:1:name: Validate Avatar Collection three tabs
.github/workflows/validate-avatar-three-tabs.yml:6:      - 'avatar-collection-tabs-phase6-1-v1.js'
.github/workflows/validate-avatar-three-tabs.yml:7:      - 'avatar-collection-tabs-phase6-1-v1.css'
.github/workflows/validate-avatar-three-tabs.yml:20:      - run: node --check avatar-collection-tabs-phase6-1-v1.js
.github/workflows/validate-avatar-collection-rarity-fill.yml:1:name: Validate avatar collection rarity fill
.github/workflows/validate-avatar-collection-rarity-fill.yml:6:      - "avatar-collection-rarity-fill-v1.css"
.github/workflows/validate-avatar-collection-rarity-fill.yml:8:      - "scripts/validate-avatar-collection-rarity-fill.mjs"
.github/workflows/validate-avatar-collection-rarity-fill.yml:9:      - ".github/workflows/validate-avatar-collection-rarity-fill.yml"
.github/workflows/validate-avatar-collection-rarity-fill.yml:19:      - run: node scripts/validate-avatar-collection-rarity-fill.mjs
scripts/validate-avatar-case-mobile-flow-hotfix.mjs:17:  ".sq-avatar-collection-summary",
.github/workflows/validate-avatar-collection-pane-flow.yml:1:name: Validate Avatar Collection pane flow
.github/workflows/validate-avatar-collection-pane-flow.yml:6:      - 'avatar-collection-tabs-phase6-1-v1.js'
.github/workflows/validate-avatar-collection-pane-flow.yml:7:      - 'avatar-collection-tabs-phase6-1-v1.css'
.github/workflows/validate-avatar-collection-pane-flow.yml:10:      - 'scripts/validate-avatar-collection-pane-flow.mjs'
.github/workflows/validate-avatar-collection-pane-flow.yml:11:      - '.github/workflows/validate-avatar-collection-pane-flow.yml'
.github/workflows/validate-avatar-collection-pane-flow.yml:21:      - run: node --check avatar-collection-tabs-phase6-1-v1.js
.github/workflows/validate-avatar-collection-pane-flow.yml:23:      - run: node scripts/validate-avatar-collection-pane-flow.mjs
scripts/validate-avatar-artwork-registry-module-extraction.mjs:55:  'document.addEventListener("salita:avatar-collection-changed"',
scripts/validate-avatar-artwork-registry-module-extraction.mjs:74:const navigationAdapterIndex = profileSource.indexOf("src/adapters/navigation/avatar-collections-navigation-v551.js");
scripts/validate-avatar-artwork-registry-module-extraction.mjs:171:if (listeners.map(item => item.name).join(",") !== "salita:avatar-equipped,salita:avatar-collection-changed") fail("Artwork listener ownership changed");
.github/workflows/inspect-avatar-collection-screen.yml:1:name: Inspect Avatar Collection screen
.github/workflows/inspect-avatar-collection-screen.yml:5:    branches: [agent/audit-avatar-collection-screen]
.github/workflows/inspect-avatar-collection-screen.yml:7:      - ".github/workflows/inspect-avatar-collection-screen.yml"
.github/workflows/inspect-avatar-collection-screen.yml:26:          node --check avatar-collection-screen-v1.js
.github/workflows/inspect-avatar-collection-screen.yml:29:            echo '# Avatar Collection screen audit'
.github/workflows/inspect-avatar-collection-screen.yml:32:            echo '- Target: `avatar-collection-screen-v1.js`'
.github/workflows/inspect-avatar-collection-screen.yml:36:            wc -c avatar-collection-screen-v1.js
.github/workflows/inspect-avatar-collection-screen.yml:37:            rg -n 'localStorage|sessionStorage|setInterval|clearInterval|MutationObserver|addEventListener|dispatchEvent|SalitaAvatarCollectionScreen|SalitaAvatarModel|SalitaAvatarArtwork|PROFILE_STORE|ACTIVE_PROFILE|writeStore|refreshProfile|equipAvatar|openDetail|installLauncher' avatar-collection-screen-v1.js || true
.github/workflows/inspect-avatar-collection-screen.yml:42:            rg -n --glob '!docs/TEMP_AVATAR_COLLECTION_AUDIT.md' 'avatar-collection-screen-v1\.js' . || true
.github/workflows/inspect-avatar-collection-screen.yml:47:            rg -n --glob '!avatar-collection-screen-v1.js' --glob '!docs/TEMP_AVATAR_COLLECTION_AUDIT.md' 'SalitaAvatarCollectionScreen|salita:open-avatar-collection|salita:avatar-equipped|salita:avatar-collection-changed' . || true
.github/workflows/inspect-avatar-collection-screen.yml:57:            rg -n 'avatar-collection-screen|avatar-case|weekly-avatar|CACHE_NAME|PREVIOUS_CACHE_NAME' profile-emblem-control.js service-worker.js mobile-refresh.html src/config/course-manifest.js scripts .github/workflows 2>/dev/null || true
.github/workflows/inspect-avatar-collection-screen.yml:62:            rg -n 'Avatar Collection|avatar collection|avatar-collection|avatar equipped|SalitaAvatarCollectionScreen' scripts .github/workflows 2>/dev/null || true
.github/workflows/inspect-avatar-collection-screen.yml:72:          git commit -m "Record Avatar Collection ownership audit"
.github/workflows/inspect-avatar-collection-screen.yml:73:          git push origin HEAD:agent/audit-avatar-collection-screen
scripts/validate-avatar-three-tabs.mjs:4:const js = fs.readFileSync('src/features/avatar/avatar-collection-tabs-phase6-1-v1.js','utf8');
scripts/validate-avatar-three-tabs.mjs:5:const css = fs.readFileSync('avatar-collection-tabs-phase6-1-v1.css','utf8');
scripts/validate-avatar-three-tabs.mjs:9:new vm.Script(js,{filename:'src/features/avatar/avatar-collection-tabs-phase6-1-v1.js'});
scripts/validate-avatar-three-tabs.mjs:11:  'data-avatar-collection-tab="case"',
scripts/validate-avatar-three-tabs.mjs:12:  'data-avatar-collection-tab="collection"',
scripts/validate-avatar-three-tabs.mjs:13:  'data-avatar-collection-tab="statistics"',
scripts/validate-avatar-three-tabs.mjs:15:  'sq-avatar-collection-pane',
scripts/validate-avatar-three-tabs.mjs:22:if (!css.includes('.sq-avatar-collection-pane[hidden]')) fail('Collection pane must be independently hideable.');
scripts/validate-avatar-three-tabs.mjs:24:if (!loader.includes('avatar-collection-tabs-phase6-1-v1.css?v=5.7.4')) fail('Three-tab CSS is not loaded.');
scripts/validate-avatar-three-tabs.mjs:25:if (!loader.includes('avatar-collection-tabs-phase6-1-v1.js?v=5.7.4')) fail('Three-tab runtime is not loaded.');
scripts/validate-phase6-1-tabs-case.mjs:4:const js = fs.readFileSync("src/features/avatar/avatar-collection-tabs-phase6-1-v1.js", "utf8");
scripts/validate-phase6-1-tabs-case.mjs:5:const css = fs.readFileSync("avatar-collection-tabs-phase6-1-v1.css", "utf8");
scripts/validate-phase6-1-tabs-case.mjs:9:new vm.Script(js, {filename:"src/features/avatar/avatar-collection-tabs-phase6-1-v1.js"});
scripts/validate-phase6-1-tabs-case.mjs:12:  'data-avatar-collection-tab="collection"',
scripts/validate-phase6-1-tabs-case.mjs:13:  'data-avatar-collection-tab="statistics"',
scripts/validate-phase6-1-tabs-case.mjs:31:if (!loader.includes('avatar-collection-tabs-phase6-1-v1.css?v=5.7.1')) fail("Phase 6.1 CSS is not loaded.");
scripts/validate-phase6-1-tabs-case.mjs:32:if (!loader.includes('avatar-collection-tabs-phase6-1-v1.js?v=5.7.1')) fail("Phase 6.1 JS is not loaded.");
scripts/validate-persistent-navigation.mjs:30:  'data-sq-nav-action="avatar-collection"',
scripts/validate-persistent-navigation.mjs:31:  'action:"avatar-collection"',
scripts/validate-persistent-navigation.mjs:32:  "salita:open-avatar-collection",
```
