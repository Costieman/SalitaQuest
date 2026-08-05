# Temporary avatar hotfix extraction audit

## Target metadata
```text
  222 10493 avatar-progression-hotfix-v551.js
5b5f73030ee27ae8e6473784e65b34facb37ece8cb2b822156e60b9ab15e2db0  avatar-progression-hotfix-v551.js
```

## Exact target, API and event references
```text
./profile-emblem-control.js:58:      await loadScript("hotfix-runtime", `./avatar-progression-hotfix-v551.js?v=${RELEASE_VERSION}`, "Avatar progression compatibility could not be loaded.");
./profile-emblem-control.js:59:      await window.SalitaAvatarHotfixReady;
./service-worker.js:48:  "./avatar-progression-hotfix-v551.js", "./avatar-progression-hotfix-v551.css",
./scripts/validate-avatar-runtime-v556.mjs:20:  compatibility:read("avatar-progression-hotfix-v551.js"),
./scripts/validate-avatar-runtime-v556.mjs:51:await sandbox.SalitaAvatarHotfixReady;
./profile-app.js:38:      if (window.SalitaAvatarHotfixReady) {
./profile-app.js:39:        try { await window.SalitaAvatarHotfixReady; } catch {}
./scripts/validate-avatar-artwork-registry-module-extraction.mjs:73:const hotfixIndex = profileSource.indexOf("avatar-progression-hotfix-v551.js");
./mobile-refresh.html:44:      `./avatar-progression-hotfix-v551.js?v=${RELEASE}`,
./scripts/validate-avatar-progression-v550.mjs:37:  "avatar-progression-hotfix-v551.js",
./scripts/validate-avatar-progression-v550.mjs:78:  "await window.SalitaAvatarHotfixReady",
./scripts/validate-avatar-progression-v550.mjs:101:const compatibility = read("avatar-progression-hotfix-v551.js");
./scripts/validate-avatar-collection-screen.mjs:69:if (!emblemSource.includes("await window.SalitaAvatarHotfixReady")) fail("Collection starts before canonical progression data is ready");
./scripts/validate-level-avatar-rewards.mjs:127:if (!loaderSource.includes("await window.SalitaAvatarHotfixReady")) fail("Milestones load before the safe model hotfix");
./scripts/validate-weekly-avatar-shards.mjs:10:const hotfix = read("avatar-progression-hotfix-v551.js");
./scripts/validate-weekly-avatar-shards.mjs:14:new vm.Script(hotfix, {filename:"avatar-progression-hotfix-v551.js"});
./scripts/validate-weekly-avatar-shards.mjs:73:if (!loader.includes("await window.SalitaAvatarHotfixReady")) fail("Weekly rewards load before starter/common progression data");
./docs/MODULE_CONTRACT_INVENTORY.md:102:- `avatar-progression-hotfix-v551.js` — risk 34; 5 engine globals; 0 storage operations.
./docs/MODULE_CONTRACT_INVENTORY.md:179:| `avatar-progression-hotfix-v551.js` | collection-and-rewards | 2 | 34 | 5 | 0/4 | 0 | 9 | 0 |
./docs/MODULE_CONTRACT_INVENTORY.md:249:| `__salitaQuestCollectionsNavigationV551Installed` | avatar-progression-hotfix-v551.js |
./docs/MODULE_CONTRACT_INVENTORY.md:279:| `SalitaAvatarCatalogue` | avatar-progression-hotfix-v551.js, coin-avatar-shop-reveal-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:283:| `SalitaAvatarHotfixReady` | avatar-progression-hotfix-v551.js |
./docs/MODULE_CONTRACT_INVENTORY.md:284:| `SalitaAvatarModel` | avatar-progression-hotfix-v551.js, coin-avatar-shop-reveal-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:316:| `salita:avatar-model-hotfixed` | avatar-progression-hotfix-v551.js | — |
./docs/MODULE_CONTRACT_INVENTORY.md:336:| `salita:open-avatar-collection` | avatar-progression-hotfix-v551.js, avatar-unlock-celebration-v1.js, desktop-navigation-refinement.js, weekly-avatar-shard-rewards-v1.js | avatar-case-v1.js, avatar-collection-screen-v1.js, src/features/avatar/avatar-collection-summary-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:352:| `badgesView` | avatar-progression-hotfix-v551.js, badge-chest-v2.js, desktop-navigation-refinement.js, social-connections-v2.js |
./docs/MODULE_CONTRACT_INVENTORY.md:355:| `settingsView` | avatar-progression-hotfix-v551.js, desktop-navigation-refinement.js, placement-onboarding-v1.js, social-connections-v2.js |
./docs/MODULE_CONTRACT_INVENTORY.md:365:| `mobileViewTitle` | app.js, avatar-progression-hotfix-v551.js, desktop-navigation-refinement.js |
./docs/MODULE_CONTRACT_INVENTORY.md:368:| `viewTitle` | app.js, avatar-progression-hotfix-v551.js, desktop-navigation-refinement.js |
./avatar-progression-hotfix-v551.js:11:    if (base.hotfixRelease === RELEASE) return base;
./avatar-progression-hotfix-v551.js:113:      hotfixRelease:RELEASE,
./avatar-progression-hotfix-v551.js:128:    document.dispatchEvent(new CustomEvent("salita:avatar-model-hotfixed", {detail:{release:RELEASE}}));
./avatar-progression-hotfix-v551.js:142:    if (window.__salitaQuestCollectionsNavigationV551Installed) return;
./avatar-progression-hotfix-v551.js:151:    window.__salitaQuestCollectionsNavigationV551Installed = true;
./avatar-progression-hotfix-v551.js:213:  window.SalitaAvatarHotfixReady = Promise.resolve().then(() => {
./src/config/module-contracts.generated.json:796:      "file": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:819:          "__salitaQuestCollectionsNavigationV551Installed",
./src/config/module-contracts.generated.json:821:          "SalitaAvatarHotfixReady",
./src/config/module-contracts.generated.json:850:          "salita:avatar-model-hotfixed",
./src/config/module-contracts.generated.json:2443:          "SalitaAvatarHotfixReady",
./src/config/module-contracts.generated.json:2618:        "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:2635:        "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:2657:          "SalitaAvatarHotfixReady",
./src/config/module-contracts.generated.json:2776:        "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4324:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4404:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4502:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4526:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4541:      "from": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4602:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4745:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4769:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:4903:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5028:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5128:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5131:        "SalitaAvatarHotfixReady"
./src/config/module-contracts.generated.json:5136:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5172:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5243:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5246:        "SalitaAvatarHotfixReady"
./src/config/module-contracts.generated.json:5251:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5325:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5349:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5381:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5413:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5480:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5588:      "to": "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:5917:        "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:6144:      "name": "salita:avatar-model-hotfixed",
./src/config/module-contracts.generated.json:6147:        "avatar-progression-hotfix-v551.js"
./src/config/module-contracts.generated.json:6309:        "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:6519:      "symbol": "__salitaQuestCollectionsNavigationV551Installed",
./src/config/module-contracts.generated.json:6521:        "avatar-progression-hotfix-v551.js"
./src/config/module-contracts.generated.json:6709:        "avatar-progression-hotfix-v551.js",
./src/config/module-contracts.generated.json:6732:      "symbol": "SalitaAvatarHotfixReady",
./src/config/module-contracts.generated.json:6734:        "avatar-progression-hotfix-v551.js"
./src/config/module-contracts.generated.json:6740:        "avatar-progression-hotfix-v551.js",
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:33:            wc -l -c avatar-progression-hotfix-v551.js
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:34:            sha256sum avatar-progression-hotfix-v551.js
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:35:            node --check avatar-progression-hotfix-v551.js
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:40:            rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!docs/AVATAR_HOTFIX_EXTRACTION_AUDIT.tmp.md' 'avatar-progression-hotfix-v551\.js|SalitaAvatarHotfixReady|__salitaQuestCollectionsNavigationV551Installed|salita:avatar-model-hotfixed|hotfixRelease' . || true
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:67:              if(JSON.stringify(value).includes('avatar-progression-hotfix-v551.js')) matches.push({path,value});
```

## Avatar model owners and consumers
```text
./avatar-catalogue-v1.js:8:  if (root.SalitaAvatarModel || root[LOADING_FLAG]) return;
./weekly-avatar-shard-rewards-v1.js:175:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./weekly-avatar-shard-rewards-v1.js:196:    const latest = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./weekly-avatar-shard-rewards-v1.js:207:    const merged = model.normaliseCollectionState({
./weekly-avatar-shard-rewards-v1.js:213:      levelRewardsClaimed:[...new Set([
./weekly-avatar-shard-rewards-v1.js:214:        ...(latest.levelRewardsClaimed || []),
./weekly-avatar-shard-rewards-v1.js:215:        ...(canonicalCollection.levelRewardsClaimed || [])
./weekly-avatar-shard-rewards-v1.js:350:    const award = model.weeklyShardAward(item.rarity);
./weekly-avatar-shard-rewards-v1.js:444:    const award = model.weeklyShardAward(item.rarity);
./weekly-avatar-shard-rewards-v1.js:532:        !window.SalitaAvatarModel ||
./weekly-avatar-shard-rewards-v1.js:550:    model = window.SalitaAvatarModel;
./coin-avatar-shop-badges-v1.js:17:      return window.SalitaAvatarModel?.list({rarity}).filter(item => owned.has(item.id)).length || 0;
./coin-avatar-shop-badges-v1.js:20:  const totalByRarity = rarity => window.SalitaAvatarModel?.list({rarity}).length || 0;
./coin-avatar-shop-badges-v1.js:36:    if (!Array.isArray(list) || !window.SalitaAvatarModel || !state()) { setTimeout(install,120); return; }
./long-term-badges-v1.js:50:  const totalAvatars = () => n(window.SalitaAvatarModel?.catalogue?.length || window.SalitaAvatarModel?.all?.()?.length || 0);
./avatar-card-actions-v1.js:51:    return window.SalitaAvatarModel?.get?.(id) || null;
./avatar-card-actions-v1.js:59:      const collection = window.SalitaAvatarModel?.normaliseCollectionState?.(profile?.avatarCollection, profile?.avatarId);
./coin-avatar-shop-reveal-v1.js:29:    const model = window.SalitaAvatarModel;
./coin-avatar-shop-reveal-v1.js:48:    function normaliseCollectionState(input = {}, fallbackAvatarId = "") {
./coin-avatar-shop-reveal-v1.js:50:      const collection = model.normaliseCollectionState(source, fallbackAvatarId);
./coin-avatar-shop-reveal-v1.js:62:      const collection = normaliseCollectionState(state);
./coin-avatar-shop-reveal-v1.js:70:    window.SalitaAvatarCatalogue = catalogue;
./coin-avatar-shop-reveal-v1.js:71:    window.SalitaAvatarModel = Object.freeze({...model, phase3RandomPools:true, catalogue, byId, get, list, normaliseCollectionState, progress});
./coin-avatar-shop-reveal-v1.js:73:    return window.SalitaAvatarModel;
./coin-avatar-shop-reveal-v1.js:125:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./coin-avatar-shop-reveal-v1.js:138:    const claimedLevels = new Set((account.collection.levelRewardsClaimed || []).map(Number));
./coin-avatar-shop-reveal-v1.js:314:    if (!window.SalitaAvatarModel || !appState()) {
./avatar-case-v1.js:25:    return window.SalitaAvatarModel || null;
./avatar-case-v1.js:46:    const collection = model().normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./achievement-sharing-v4.js:70:    return window.SalitaAvatarModel || null;
./achievement-sharing-v4.js:82:      return avatarModel()?.normaliseCollectionState?.(profile.avatarCollection, profile.avatarId) || profile.avatarCollection || null;
./achievement-sharing-avatar-bridge-v1.js:27:    return window.SalitaAvatarModel?.get?.(id) || window.SalitaAvatarModel?.get?.("anahaw") || null;
./achievement-sharing-avatar-bridge-v1.js:31:    const item = window.SalitaAvatarModel?.get?.(id);
./achievement-sharing-avatar-bridge-v1.js:35:      const state = window.SalitaAvatarModel?.normaliseCollectionState?.(profile.avatarCollection, profile.avatarId) || profile.avatarCollection || {};
./achievement-sharing-avatar-bridge-v1.js:45:    const item = id ? window.SalitaAvatarModel?.get?.(id) : equippedAvatar();
./profile-emblem-control.js:54:      if (!window.SalitaAvatarModel) {
./profile-emblem-control.js:122:    const item = window.SalitaAvatarModel?.get?.(avatarId);
./avatar-collection-screen-v1.js:31:    if (window.SalitaAvatarModel) return Promise.resolve(window.SalitaAvatarModel);
./avatar-collection-screen-v1.js:36:        if (window.SalitaAvatarModel) {
./avatar-collection-screen-v1.js:38:          resolve(window.SalitaAvatarModel);
./avatar-collection-screen-v1.js:68:    collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./avatar-collection-page-v2.js:37:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./avatar-collection-page-v2.js:262:    model = window.SalitaAvatarModel;
./coin-avatar-shard-shop-v1.js:89:      const model = window.SalitaAvatarModel;
./coin-avatar-shard-shop-v1.js:91:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./coin-avatar-shard-shop-v1.js:231:    if (!window.SalitaAvatarModel || !appState()) { window.setTimeout(install,120); return; }
./avatar-unlock-celebration-v1.js:18:    if (!avatarModel?.normaliseCollectionState) return null;
./avatar-unlock-celebration-v1.js:19:    const collection = avatarModel.normaliseCollectionState(sourceCollection);
./avatar-unlock-celebration-v1.js:31:    const collection = avatarModel.normaliseCollectionState(sourceCollection);
./avatar-unlock-celebration-v1.js:229:    model = window.SalitaAvatarModel || null;
./index.html:55:    const model = window.SalitaAvatarModel;
./index.html:84:      const state = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./index.html:441:        const avatarCollection = model.normaliseCollectionState({
./index.html:446:          levelRewardsClaimed:[],
./src/features/avatar/avatar-catalogue-v1.js:107:  function weeklyShardAward(value) {
./src/features/avatar/avatar-catalogue-v1.js:129:  function normaliseCollectionState(input = {}, fallbackAvatarId = "") {
./src/features/avatar/avatar-catalogue-v1.js:150:      levelRewardsClaimed:[...new Set((Array.isArray(source.levelRewardsClaimed) ? source.levelRewardsClaimed : [])
./src/features/avatar/avatar-catalogue-v1.js:159:    const collection = normaliseCollectionState(state);
./src/features/avatar/avatar-catalogue-v1.js:168:  const levelRewards = Object.freeze(Object.fromEntries(
./src/features/avatar/avatar-catalogue-v1.js:172:  root.SalitaAvatarCatalogue = catalogue;
./src/features/avatar/avatar-catalogue-v1.js:173:  root.SalitaAvatarModel = Object.freeze({
./src/features/avatar/avatar-catalogue-v1.js:181:    weeklyShardAwards:WEEKLY_SHARD_AWARDS,
./src/features/avatar/avatar-catalogue-v1.js:182:    levelRewards,
./src/features/avatar/avatar-catalogue-v1.js:186:    weeklyShardAward,
./src/features/avatar/avatar-catalogue-v1.js:187:    normaliseCollectionState,
./weekly-avatar-projected-unlock-fix-v1.js:28:      const model = window.SalitaAvatarModel;
./weekly-avatar-projected-unlock-fix-v1.js:31:      const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./weekly-avatar-projected-unlock-fix-v1.js:100:    const award = model.weeklyShardAward(item.rarity);
./src/features/avatar/avatar-collection-summary-v1.js:16:      const model = window.SalitaAvatarModel;
./src/features/avatar/avatar-collection-summary-v1.js:18:      return {model, collection:model.normaliseCollectionState(profile.avatarCollection, profile.avatarId)};
./src/features/avatar/avatar-progression-migration-v1.js:129:    if (!profile || !model?.normaliseCollectionState) return {profile, changed:false, report:null};
./src/features/avatar/avatar-progression-migration-v1.js:132:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./src/features/avatar/avatar-progression-migration-v1.js:158:    profile.avatarCollection = model.normaliseCollectionState(collection, profile.avatarId);
./src/features/avatar/avatar-progression-migration-v1.js:239:    const model = window.SalitaAvatarModel;
./src/features/avatar/level-avatar-rewards-v1.js:16:    if (!model?.normaliseCollectionState || !model?.levelRewards) throw new Error("Avatar model is required");
./src/features/avatar/level-avatar-rewards-v1.js:18:    const collection = model.normaliseCollectionState(sourceCollection);
./src/features/avatar/level-avatar-rewards-v1.js:19:    const claimed = new Set(collection.levelRewardsClaimed || []);
./src/features/avatar/level-avatar-rewards-v1.js:31:      const item = model.get(model.levelRewards[milestone]);
./src/features/avatar/level-avatar-rewards-v1.js:54:    collection.levelRewardsClaimed = [...claimed].sort((a,b) => a-b);
./src/features/avatar/level-avatar-rewards-v1.js:83:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./src/features/avatar/level-avatar-rewards-v1.js:87:    const future = new Set((collection.levelRewardsClaimed || []).filter(value => value > safeLevel && MILESTONE_LEVELS.includes(value)));
./src/features/avatar/level-avatar-rewards-v1.js:94:    collection.levelRewardsClaimed = collection.levelRewardsClaimed.filter(value => !falseSet.has(value));
./src/features/avatar/level-avatar-rewards-v1.js:105:      const item = model.get(model.levelRewards[milestone]);
./src/features/avatar/level-avatar-rewards-v1.js:127:    profile.avatarCollection = model.normaliseCollectionState(collection, profile.avatarId);
./src/features/avatar/level-avatar-rewards-v1.js:240:    model = window.SalitaAvatarModel || null;
./src/features/avatar/avatar-artwork-registry-v554.js:17:    return window.SalitaAvatarModel?.normaliseId?.(value) || slug(value);
./src/features/avatar/avatar-artwork-registry-v554.js:21:    return window.SalitaAvatarModel?.get?.(normaliseId(value)) || null;
./src/features/avatar/avatar-artwork-registry-v554.js:112:    const catalogue = window.SalitaAvatarModel?.catalogue || [];
./src/features/avatar/avatar-artwork-registry-v554.js:124:      if (window.SalitaAvatarModel?.catalogue?.length === 48) return window.SalitaAvatarModel;
./src/features/avatar/avatar-artwork-registry-v554.js:135:        (window.SalitaAvatarModel?.catalogue || []).map(item => [item.id, item.image])
./profile-app.js:15:    if (window.SalitaAvatarModel) return Promise.resolve(window.SalitaAvatarModel);
./profile-app.js:19:        if (window.SalitaAvatarModel) {
./profile-app.js:20:          resolve(window.SalitaAvatarModel);
./profile-app.js:23:        existing.addEventListener("load", () => resolve(window.SalitaAvatarModel), {once:true});
./profile-app.js:30:      script.onload = () => resolve(window.SalitaAvatarModel);
./profile-app.js:41:        return window.SalitaAvatarModel || baseModel;
./profile-app.js:45:    return window.SalitaAvatarModel || baseModel;
./profile-app.js:141:    const collection = model.normaliseCollectionState(profile.avatarCollection, profile.avatarId);
./src/features/interface/popup-governor-v1.js:165:    try { return String(window.SalitaAvatarModel?.get?.(avatarId)?.image || ""); }
./desktop-navigation-refinement.js:46:    const item=window.SalitaAvatarModel?.get?.(requestedId)||window.SalitaAvatarModel?.get?.("anahaw")||null;
./desktop-navigation-refinement.js:166:    const item=window.SalitaAvatarModel?.get?.(avatarId)||window.SalitaAvatarModel?.get?.(current.id)||current;
./src/config/module-contracts.generated.json:108:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:226:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:648:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:733:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:820:          "SalitaAvatarCatalogue",
./src/config/module-contracts.generated.json:822:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:886:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:1251:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:1343:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:1396:          "SalitaAvatarCatalogue",
./src/config/module-contracts.generated.json:1397:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:1749:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:2179:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:2444:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:2658:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:3201:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:3299:          "SalitaAvatarModel",
./src/config/module-contracts.generated.json:3413:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:3457:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:3786:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4228:          "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4327:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4335:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4407:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4415:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4505:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4513:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4529:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4537:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4605:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4613:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4748:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4756:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4772:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4780:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4906:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:4914:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5031:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5039:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5139:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5147:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5254:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5262:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5328:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5336:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5352:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5360:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5384:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5392:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5416:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5424:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5483:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5491:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5591:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:5599:        "SalitaAvatarModel"
./src/config/module-contracts.generated.json:6707:      "symbol": "SalitaAvatarCatalogue",
./src/config/module-contracts.generated.json:6738:      "symbol": "SalitaAvatarModel",
./docs/MODULE_CONTRACT_INVENTORY.md:279:| `SalitaAvatarCatalogue` | avatar-progression-hotfix-v551.js, coin-avatar-shop-reveal-v1.js |
./docs/MODULE_CONTRACT_INVENTORY.md:284:| `SalitaAvatarModel` | avatar-progression-hotfix-v551.js, coin-avatar-shop-reveal-v1.js |
./mystery-rarity-roll-v1.js:108:    const model = window.SalitaAvatarModel;
./scripts/validate-avatar-collection-summary-module-extraction.mjs:41:  "model.normaliseCollectionState(profile.avatarCollection, profile.avatarId)",
./scripts/validate-avatar-collection-summary-module-extraction.mjs:100:  normaliseCollectionState(collection){ return {ownedAvatarIds:[...(collection?.ownedAvatarIds||[])]}; }
./scripts/validate-avatar-collection-summary-module-extraction.mjs:103:  SalitaAvatarModel:model,
./scripts/validate-avatar-progression-v550.mjs:66:const model = sandbox.SalitaAvatarModel;
./scripts/validate-level-avatar-rewards-module-extraction.mjs:42:values.set("salitaQuestLocalProfilesV1",JSON.stringify({schemaVersion:1,profiles:[{id:"p1",avatarId:"anahaw",avatarCollection:{equippedAvatarId:"anahaw",ownedAvatarIds:["anahaw"],shards:{},levelRewardsClaimed:[],pendingUnlocks:[]}}]}));
./scripts/validate-level-avatar-rewards-module-extraction.mjs:62:if (saved.avatarCollection.levelRewardsClaimed.join(",")!=="10,20" || !saved.avatarCollection.ownedAvatarIds.includes("narra") || !saved.avatarCollection.ownedAvatarIds.includes("nipa_palm")) fail("Milestone ownership persistence changed");
./scripts/validate-level-avatar-rewards-module-extraction.mjs:73:const weekly={avatarId:"anahaw",avatarCollection:{equippedAvatarId:"anahaw",ownedAvatarIds:["anahaw","nipa_palm"],shards:{nipa_palm:100},levelRewardsClaimed:[20],pendingUnlocks:[{avatarId:"nipa_palm",source:"level_milestone",level:20}]},avatarMilestoneRewards:{version:3,claims:{20:{avatarId:"nipa_palm"}},acknowledgedLevels:[20]},avatarWeeklyRewards:{claims:{week:{avatarId:"nipa_palm",after:100,unlocked:true}}}};
./scripts/validate-level-avatar-rewards-module-extraction.mjs:74:const repaired=logic.repairFutureMilestones(weekly,10,window.SalitaAvatarModel);
./scripts/validate-level-avatar-rewards-module-extraction.mjs:75:if (!repaired.changed || weekly.avatarCollection.levelRewardsClaimed.includes(20) || !weekly.avatarCollection.ownedAvatarIds.includes("nipa_palm") || weekly.avatarCollection.shards.nipa_palm!==100) fail("Weekly evidence repair behavior changed");
./scripts/validate-avatar-collection-screen.mjs:20:const model = sandbox.SalitaAvatarModel;
./scripts/validate-avatar-runtime-v556.mjs:52:const model = sandbox.SalitaAvatarModel;
./scripts/validate-avatar-runtime-v556.mjs:63:const representative = model.normaliseCollectionState({
./scripts/validate-avatar-runtime-v556.mjs:68:  levelRewardsClaimed:[10,20,20],
./scripts/validate-avatar-runtime-v556.mjs:76:check(representative.levelRewardsClaimed.join(",") === "10,20", "Level reward claims are preserved and deduplicated");
./scripts/validate-level-avatar-rewards.mjs:24:const model = sandbox.SalitaAvatarModel;
./scripts/validate-level-avatar-rewards.mjs:42:  if (model.levelRewards[level] !== avatarId) fail(`Level ${level} must award ${avatarId}`);
./scripts/validate-level-avatar-rewards.mjs:60:if (JSON.stringify([...levelFifty.collection.levelRewardsClaimed]) !== JSON.stringify([10,20,30,40,50])) {
./scripts/validate-level-avatar-rewards.mjs:83:if (summit.collection.levelRewardsClaimed.length !== 10) fail("Level 99 must claim all ten milestone rewards");
./scripts/validate-level-avatar-rewards.mjs:95:    levelRewardsClaimed:[10,20],
./scripts/validate-level-avatar-rewards.mjs:104:if (!repaired.changed || corrupted.avatarCollection.levelRewardsClaimed.length) fail("Future milestone claims were not repaired");
./scripts/validate-level-avatar-rewards.mjs:111:  "levelRewardsClaimed",
./scripts/validate-coin-avatar-shop.mjs:58:if (!weekly.includes("model.weeklyShardAward")) throw new Error("Weekly rarity award logic changed");
./scripts/validate-avatar-unlock-sharing.mjs:23:const model = sandbox.SalitaAvatarModel;
./scripts/validate-avatar-unlock-sharing.mjs:109:  "window.SalitaAvatarModel?.get",
./scripts/validate-avatar-unlock-sharing.mjs:112:  "normaliseCollectionState",
./scripts/validate-weekly-avatar-shards.mjs:20:  "model.weeklyShardAward(item.rarity)",
./scripts/validate-avatar-onboarding.mjs:26:if (!index.includes("model.normaliseCollectionState(profile.avatarCollection, profile.avatarId)")) {
./scripts/validate-avatar-data-migration-module-extraction.mjs:40:if (catalogueLoader.includes("const records =") || catalogueLoader.includes("root.SalitaAvatarModel =")) {
./scripts/validate-avatar-data-migration-module-extraction.mjs:59:  "function normaliseCollectionState(input = {}, fallbackAvatarId = \"\")",
./scripts/validate-avatar-data-migration-module-extraction.mjs:60:  "root.SalitaAvatarCatalogue = catalogue",
./scripts/validate-avatar-data-migration-module-extraction.mjs:61:  "root.SalitaAvatarModel = Object.freeze({"
./scripts/validate-avatar-data-migration-module-extraction.mjs:79:const model = sandbox.SalitaAvatarModel;
./scripts/validate-avatar-data-migration-module-extraction.mjs:82:for (const method of ["normaliseId", "get", "list", "weeklyShardAward", "normaliseCollectionState", "progress"]) {
./scripts/validate-avatar-catalogue.mjs:12:const catalogue = sandbox.SalitaAvatarCatalogue;
./scripts/validate-avatar-catalogue.mjs:13:const model = sandbox.SalitaAvatarModel;
./scripts/validate-avatar-catalogue.mjs:35:if (model.weeklyShardAward("common") !== 100 || model.weeklyShardAward("uncommon") !== 50 || model.weeklyShardAward("rare") !== 25) fail("Weekly shard awards must be 100 / 50 / 25");
./scripts/validate-avatar-catalogue.mjs:38:for (const level of expectedLevels) if (!model.levelRewards[level]) fail(`Missing Level ${level} reward`);
./scripts/validate-avatar-catalogue.mjs:39:if (model.levelRewards[99] !== "golden_salita_crest") fail("Level 99 must award the Golden Salita Crest");
./scripts/validate-avatar-catalogue.mjs:40:if (new Set(Object.values(model.levelRewards)).size !== expectedLevels.length) fail("Level rewards must be unique");
./scripts/validate-avatar-catalogue.mjs:54:const migrated = model.normaliseCollectionState({shards:{narra:150,unknown:40}}, "eagle");
./scripts/validate-avatar-catalogue.mjs:61:const newLearner = model.normaliseCollectionState();
./scripts/validate-long-term-badges.mjs:68:context.SalitaAvatarModel = {catalogue:Array.from({length:48},(_,index)=>({id:`avatar-${index}`}))};
./scripts/validate-avatar-case.mjs:213:context.SalitaAvatarModel={
./scripts/validate-avatar-case.mjs:215:  normaliseCollectionState:(input,fallback)=>({
./scripts/validate-avatar-artwork-registry-module-extraction.mjs:58:  "window.SalitaAvatarModel?.catalogue?.length === 48"
./scripts/validate-avatar-artwork-registry-module-extraction.mjs:152:    SalitaAvatarModel:{
./scripts/validate-popup-governor-module-extraction.mjs:113:  SalitaAvatarModel:{get(id){return id === "known" ? {image:"avatars/known.png"} : null;}},
./scripts/validate-avatar-pool-phase3.mjs:19:  "catalogue, byId, get, list, normaliseCollectionState, progress"
./avatar-progression-hotfix-v551.js:9:    const base = window.SalitaAvatarModel;
./avatar-progression-hotfix-v551.js:29:    const weeklyShardAwards = Object.freeze({...base.weeklyShardAwards, common:100, uncommon:50, rare:25});
./avatar-progression-hotfix-v551.js:71:    function normaliseCollectionState(input = {}, fallbackAvatarId = "") {
./avatar-progression-hotfix-v551.js:87:        levelRewardsClaimed:unique((Array.isArray(source.levelRewardsClaimed) ? source.levelRewardsClaimed : [])
./avatar-progression-hotfix-v551.js:95:      const collection = normaliseCollectionState(state);
./avatar-progression-hotfix-v551.js:103:    function weeklyShardAward(value) {
./avatar-progression-hotfix-v551.js:105:      return weeklyShardAwards[item?.weeklyRarity || item?.rarity || String(value || "")] || 0;
./avatar-progression-hotfix-v551.js:107:    const levelRewards = Object.freeze(Object.fromEntries(
./avatar-progression-hotfix-v551.js:117:      weeklyShardAwards,
./avatar-progression-hotfix-v551.js:118:      levelRewards,
./avatar-progression-hotfix-v551.js:122:      weeklyShardAward,
./avatar-progression-hotfix-v551.js:123:      normaliseCollectionState,
./avatar-progression-hotfix-v551.js:126:    window.SalitaAvatarCatalogue = catalogue;
./avatar-progression-hotfix-v551.js:127:    window.SalitaAvatarModel = model;
./avatar-progression-hotfix-v551.js:220:    return window.SalitaAvatarModel;
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:45:            rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!docs/AVATAR_HOTFIX_EXTRACTION_AUDIT.tmp.md' 'SalitaAvatarModel|SalitaAvatarCatalogue|normaliseCollectionState|weeklyShardAward|levelRewards' . || true
```

## Navigation engine ownership
```text
./key-run-refinement.js:81:        typeof switchView !== "function" ||
./key-run-refinement.js:535:    const baseSwitchView = switchView;
./key-run-refinement.js:536:    switchView = function switchViewWithKeyRun(view) {
./badge-catalogue-v2.js:241:      if (typeof BADGES === "undefined" || typeof renderBadges !== "function" || typeof switchView !== "function" || typeof saveState !== "function") { retry(); return; }
./badge-catalogue-v2.js:268:    const baseRenderBadges = renderBadges;
./badge-catalogue-v2.js:269:    renderBadges = function renderBadgesAsCatalogue() {
./badge-catalogue-v2.js:275:    const baseSwitchView = switchView;
./badge-catalogue-v2.js:276:    switchView = function switchViewWithBadgeCelebrations(view) {
./badge-catalogue-v2.js:283:    renderBadges();
./social-connections-v2.js:150:    try{ if(typeof switchView==="function") switchView("badges"); }catch{}
./social-connections-v2.js:200:    const baseSwitch=typeof switchView==="function"?switchView:null;
./social-connections-v2.js:201:    if(baseSwitch){switchView=function switchViewWithSocialConnections(view){const result=baseSwitch.apply(this,arguments);if(view==="settings")window.setTimeout(refresh,30);return result;};}
./social-connections-v2.js:204:      openSettings(){try{switchView("settings");}catch{}window.setTimeout(()=>document.getElementById("socialLinksCard")?.scrollIntoView({behavior:"smooth",block:"center"}),80);}
./avatar-collection-page-v2.js:242:    if (typeof switchView === "function") switchView("avatars");
./mobile-session-refinement.js:20:        typeof switchView !== "function" ||
./mobile-session-refinement.js:179:    const baseSwitchView = switchView;
./mobile-session-refinement.js:180:    switchView = function switchViewWithMobileState(view) {
./src/features/progression/home-reward-coordinator.js:168:      if (typeof state === "undefined" || typeof switchView !== "function" || typeof renderDailyQuests !== "function" || typeof saveState !== "function") {
./src/features/progression/home-reward-coordinator.js:175:    const baseSwitchView = switchView;
./src/features/progression/home-reward-coordinator.js:176:    switchView = function switchViewWithGuaranteedHomeRewards(view) {
./app.js:1904:  switchView("learn");
./app.js:1931:    switchView("learn");
./app.js:2278:function closeSessionComplete(next="home") {document.getElementById("sessionCompleteModal").classList.add("hidden");document.body.classList.remove("modal-open");switchView(next);}
./app.js:2306:function updateAll() {ensureDailyActivity();claimDailyQuestRewards(false);applyDisplaySettings();hydratePictograms();updateGlobalUI();renderMasteryRail();updateHome();renderDailyQuests();renderJourney();renderSkillTree();renderTopicReview();renderHandsFreeReview();renderDictionaryFilters();renderDictionary();renderProgress();renderBadges();updateBoss();syncSettings();checkVoiceService();updateTransferStatus();}
./app.js:2366:function renderBadges() {
./app.js:2398:  switchView("learn");
./app.js:2581:function closeMobileMenu() {
./app.js:2810:function switchView(view) {
./app.js:2832:  closeMobileMenu();
./app.js:2970:document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>switchView(btn.dataset.view)));
./app.js:3032:document.getElementById("mobileMenuCloseBtn")?.addEventListener("click",closeMobileMenu);
./app.js:3033:document.getElementById("mobileMenuBackdrop")?.addEventListener("click",closeMobileMenu);
./app.js:3035:document.getElementById("mobileSheetImportBtn")?.addEventListener("click",()=>{closeMobileMenu();switchView("settings");setTimeout(()=>document.getElementById("importInput")?.click(),150);});
./app.js:3037:  if(!session){switchView("home");return;}
./app.js:3039:  if(leave){session=null;currentExercise=null;switchView("home");updateAll();}
./desktop-navigation-refinement.js:196:      if(typeof closeMobileMenu==="function")closeMobileMenu();
./desktop-navigation-refinement.js:197:      else window.closeMobileMenu?.();
./desktop-navigation-refinement.js:228:      if(typeof switchView!=="function"||typeof renderBadges!=="function"||typeof state==="undefined"){
./desktop-navigation-refinement.js:261:      switchView("badges");
./desktop-navigation-refinement.js:262:      renderBadges();
./desktop-navigation-refinement.js:276:    const baseSwitchView=switchView;
./desktop-navigation-refinement.js:277:    switchView=function switchViewWithPersistentNavigation(view){
./desktop-navigation-refinement.js:280:        renderBadges();
./adaptive-scenarios.js:208:    switchView("learn");
./adaptive-scenarios.js:282:        typeof switchView !== "function" ||
./src/config/module-contracts.generated.json:320:        "switchView",
./src/config/module-contracts.generated.json:811:        "closeMobileMenu",
./src/config/module-contracts.generated.json:813:        "renderBadges",
./src/config/module-contracts.generated.json:815:        "switchView"
./src/config/module-contracts.generated.json:830:          "collectionsView",
./src/config/module-contracts.generated.json:838:          "[data-open-avatar-collection-main]",
./src/config/module-contracts.generated.json:839:          "[data-open-badge-collection]"
./src/config/module-contracts.generated.json:970:        "renderBadges",
./src/config/module-contracts.generated.json:974:        "switchView",
./src/config/module-contracts.generated.json:1183:        "switchView",
./src/config/module-contracts.generated.json:1733:        "closeMobileMenu",
./src/config/module-contracts.generated.json:1736:        "renderBadges",
./src/config/module-contracts.generated.json:1738:        "switchView"
./src/config/module-contracts.generated.json:1746:          "closeMobileMenu",
./src/config/module-contracts.generated.json:1956:        "switchView",
./src/config/module-contracts.generated.json:2032:        "switchView"
./src/config/module-contracts.generated.json:2096:        "switchView",
./src/config/module-contracts.generated.json:2295:        "switchView"
./src/config/module-contracts.generated.json:2877:        "switchView"
./src/config/module-contracts.generated.json:3885:        "switchView",
./src/config/module-contracts.generated.json:4157:        "switchView"
./src/config/module-contracts.generated.json:4466:        "switchView",
./src/config/module-contracts.generated.json:4545:        "closeMobileMenu",
./src/config/module-contracts.generated.json:4547:        "renderBadges",
./src/config/module-contracts.generated.json:4549:        "switchView"
./src/config/module-contracts.generated.json:4644:        "renderBadges",
./src/config/module-contracts.generated.json:4648:        "switchView",
./src/config/module-contracts.generated.json:4723:        "switchView",
./src/config/module-contracts.generated.json:4869:        "closeMobileMenu",
./src/config/module-contracts.generated.json:4872:        "renderBadges",
./src/config/module-contracts.generated.json:4874:        "switchView"
./src/config/module-contracts.generated.json:4973:        "switchView",
./src/config/module-contracts.generated.json:4991:        "switchView"
./src/config/module-contracts.generated.json:5003:        "switchView",
./src/config/module-contracts.generated.json:5071:        "switchView"
./src/config/module-contracts.generated.json:5295:        "switchView"
./src/config/module-contracts.generated.json:5515:        "switchView",
./src/config/module-contracts.generated.json:5567:        "switchView"
./weekly-avatar-polish.js:21:        typeof switchView !== "function" ||
./weekly-avatar-polish.js:376:    const baseSwitchView = switchView;
./weekly-avatar-polish.js:377:    switchView = function switchViewWithPendingKeyAward(view) {
./docs/CODE_AUDIT_2026-07-30.md:88:Many modules replace globals such as `switchView`, `renderBadges`, `updateGlobalUI`, `recordDailyAnswer` and `recordDailySession`. Behavior depends on installation order and every wrapper correctly forwarding arguments and return values.
./level-progression-v2.js:170:      if (typeof state==="undefined"||typeof levelInfo!=="function"||typeof updateGlobalUI!=="function"||typeof switchView!=="function"||typeof saveState!=="function"||!window.SalitaPopupGovernor) { window.setTimeout(install,80); return; }
./level-progression-v2.js:178:    const baseSwitch=switchView;
./level-progression-v2.js:179:    switchView=function(view){const result=baseSwitch.apply(this,arguments);document.dispatchEvent(new CustomEvent("salita:view-changed",{detail:{view}}));if(view==="home")scheduleCelebration(350);return result;};
./scripts/validate-progression-scenarios-navigation.mjs:153:  'switchView("badges")',
./scripts/validate-home-reward-coordinator-module-extraction.mjs:51:  'switchView = function switchViewWithGuaranteedHomeRewards(view)',
./scripts/validate-home-reward-coordinator-module-extraction.mjs:58:if (count(feature, 'switchView = function switchViewWithGuaranteedHomeRewards(view)') !== 1) fail("The extracted coordinator must wrap switchView exactly once");
./scripts/validate-home-reward-coordinator-module-extraction.mjs:88:console.log("Validated the extracted Home reward coordinator: ordered feature delivery, compatibility-only root forwarding, one switchView wrapper, one observer, exact listeners, preserved weekly-key state semantics and r60-to-r61 offline delivery.");
./scripts/validate-bisaya.mjs:150:  'switchView("audioReview")',
./bisaya-review-regions.js:28:  function openEchoCave(){const active=typeof handsFreeActiveItems==="function"?handsFreeActiveItems():[];if(!active.length){toast("Learn at least one phrase before entering Echo Cave.");return;}state.reviewRegions={...(state.reviewRegions||{}),echoVisits:Number(state.reviewRegions?.echoVisits||0)+1};saveState();switchView("audioReview");if(!handsFreeReview.queue.length)buildHandsFreeQueue();renderHandsFreeReview();toast("Echo Cave is ready. Press Play review when you are ready to speak and recall.");}
./bisaya-review-regions.js:29:  function startCampfireReview(){if(!bossReady()){toast("Start at least two items in every curriculum region before attempting Campfire Review.");return;}session={mode:"campfire",label:"Campfire Review",queue:BOSS_ITEMS.map((item,index)=>({...item,id:`campfire_${index}`})),index:0,xp:0,correct:0,answered:0,combo:0,boss:true};switchView("learn");loadBossExercise();}
./avatar-progression-hotfix-v551.js:147:    if (!navButton || !badgesView || !main || !settingsView || typeof switchView !== "function") {
./avatar-progression-hotfix-v551.js:157:    let view = document.getElementById("collectionsView");
./avatar-progression-hotfix-v551.js:160:      view.id = "collectionsView";
./avatar-progression-hotfix-v551.js:167:          <button type="button" class="collections-choice-card badges" data-open-badge-collection>
./avatar-progression-hotfix-v551.js:170:          <button type="button" class="collections-choice-card avatars" data-open-avatar-collection-main>
./avatar-progression-hotfix-v551.js:181:    const baseSwitchView = switchView;
./avatar-progression-hotfix-v551.js:182:    switchView = function switchViewWithCollections(viewName) {
./avatar-progression-hotfix-v551.js:199:      if (typeof closeMobileMenu === "function") closeMobileMenu();
./avatar-progression-hotfix-v551.js:200:      switchView("collections");
./avatar-progression-hotfix-v551.js:204:    view.querySelector("[data-open-badge-collection]")?.addEventListener("click", () => {
./avatar-progression-hotfix-v551.js:205:      switchView("badges");
./avatar-progression-hotfix-v551.js:206:      if (typeof renderBadges === "function") renderBadges();
./avatar-progression-hotfix-v551.js:208:    view.querySelector("[data-open-avatar-collection-main]")?.addEventListener("click", () => {
./.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:50:            rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!docs/AVATAR_HOTFIX_EXTRACTION_AUDIT.tmp.md' '(^|[^A-Za-z0-9_])(switchView|closeMobileMenu|renderBadges)([^A-Za-z0-9_]|$)|collectionsView|data-open-badge-collection|data-open-avatar-collection-main' . || true
./lesson-side-launcher.js:18:        typeof switchView !== "function" ||
./lesson-side-launcher.js:247:    const baseSwitchView = switchView;
./lesson-side-launcher.js:248:    switchView = function switchViewWithLessonLauncher(view) {
```

## Cache and validator references
```text
service-worker.js:1:const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67";
service-worker.js:2:const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68";
service-worker.js:48:  "./avatar-progression-hotfix-v551.js", "./avatar-progression-hotfix-v551.css",
service-worker.js:143:  const cache = await caches.open(CACHE_NAME);
service-worker.js:160:  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(STATIC_FILES.map(file => cache.add(file)))));
service-worker.js:165:    .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
service-worker.js:187:        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
scripts/validate-mobile-refinement.mjs:88:  'const CACHE_NAME = "salita-quest-',
scripts/validate-home-dashboard.mjs:172:  'const CACHE_NAME = "salita-quest-',
scripts/validate-badge-stability.mjs:199:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-badge-stability.mjs:200:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-stage1-popup-governance-v553.mjs:123:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-stage1-popup-governance-v553.mjs:124:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-mobile-level-up-hotfix-v552.mjs:64:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-mobile-level-up-hotfix-v552.mjs:65:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-achievement-sharing-router-module-extraction.mjs:103:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-achievement-sharing-router-module-extraction.mjs:104:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-level-avatar-rewards-module-extraction.mjs:34:const previousCache = worker.match(/const PREVIOUS_CACHE_NAME = "([^"]+)"/)?.[1] || "";
scripts/validate-level-avatar-rewards-module-extraction.mjs:35:const currentCache = worker.match(/const CACHE_NAME = "([^"]+)"/)?.[1] || "";
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:57:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-collection-key-translation-hotfix-module-extraction.mjs:58:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate_modular_bootstrap.py:108:        'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68";',
scripts/validate-avatar-runtime-v556.mjs:20:  compatibility:read("avatar-progression-hotfix-v551.js"),
scripts/validate-avatar-runtime-v556.mjs:116:check(sources.worker.includes('PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"'), "Service worker records the pre-modular cache boundary");
scripts/validate-avatar-runtime-v556.mjs:117:check(sources.worker.includes('CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"'), "Service-worker cache revision is the modular-bootstrap release");
.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:33:            wc -l -c avatar-progression-hotfix-v551.js
.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:34:            sha256sum avatar-progression-hotfix-v551.js
.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:35:            node --check avatar-progression-hotfix-v551.js
.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:40:            rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!docs/AVATAR_HOTFIX_EXTRACTION_AUDIT.tmp.md' 'avatar-progression-hotfix-v551\.js|SalitaAvatarHotfixReady|__salitaQuestCollectionsNavigationV551Installed|salita:avatar-model-hotfixed|hotfixRelease' . || true
.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:55:            rg -n 'PREVIOUS_CACHE_NAME|CACHE_NAME|avatar-progression-hotfix-v551' service-worker.js scripts .github/workflows || true
.github/workflows/inspect-avatar-progression-hotfix-extraction.yml:67:              if(JSON.stringify(value).includes('avatar-progression-hotfix-v551.js')) matches.push({path,value});
scripts/validate-persistent-navigation-ci.mjs:88:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-5-9-avatar-case-r51"',
scripts/validate-persistent-navigation-ci.mjs:89:  'const CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-audio-badge-release.mjs:129:  'const CACHE_NAME = "salita-quest-',
scripts/validate-facebook-share-link-module-extraction.mjs:20:for(const marker of ['const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"','const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"','"./facebook-share-link-v1.js"','"./src/features/sharing/facebook-share-link-v1.js"']) if(!worker.includes(marker)) fail(`Offline delivery missing ${marker}`);
scripts/validate-social-posting-audio-resume.mjs:152:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-social-posting-audio-resume.mjs:153:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-avatar-collection-screen.mjs:11:const hotfixCss = read("avatar-progression-hotfix-v551.css");
scripts/validate-avatar-collection-tabs-module-extraction.mjs:58:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-avatar-collection-tabs-module-extraction.mjs:59:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-hosted-achievement-sharing.mjs:191:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-hosted-achievement-sharing.mjs:192:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-economy-tracking-module-extraction.mjs:53:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-economy-tracking-module-extraction.mjs:54:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-progression-scenarios-navigation.mjs:229:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-progression-scenarios-navigation.mjs:230:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-weekly-avatar-shards.mjs:10:const hotfix = read("avatar-progression-hotfix-v551.js");
scripts/validate-weekly-avatar-shards.mjs:14:new vm.Script(hotfix, {filename:"avatar-progression-hotfix-v551.js"});
scripts/validate-avatar-data-migration-module-extraction.mjs:129:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-avatar-data-migration-module-extraction.mjs:130:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-avatar-case.mjs:84:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-avatar-case.mjs:85:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-ui-quality.mjs:108:  'const CACHE_NAME = "salita-quest-',
scripts/validate-pronunciation-module-extraction.mjs:70:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-pronunciation-module-extraction.mjs:71:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-desktop-shell-module-extraction.mjs:111:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-desktop-shell-module-extraction.mjs:112:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-avatar-artwork-registry-module-extraction.mjs:73:const hotfixIndex = profileSource.indexOf("avatar-progression-hotfix-v551.js");
scripts/validate-avatar-artwork-registry-module-extraction.mjs:90:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-avatar-artwork-registry-module-extraction.mjs:91:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-even-progress-rail-module-extraction.mjs:78:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-even-progress-rail-module-extraction.mjs:79:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-popup-governor-module-extraction.mjs:81:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-popup-governor-module-extraction.mjs:82:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-persistent-navigation.mjs:108:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-persistent-navigation.mjs:109:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-placement-sharing.mjs:120:if (!worker.includes('const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"')) {
scripts/validate-placement-sharing.mjs:123:if (!worker.includes('const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"')) {
scripts/validate-bisaya-audio-library.mjs:137:check(serviceWorker.includes('const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"'),
scripts/validate-bisaya-audio-library.mjs:139:check(serviceWorker.includes('const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"'),
scripts/validate-avatar-collection-summary-module-extraction.mjs:58:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-avatar-collection-summary-module-extraction.mjs:59:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-home-reward-coordinator-module-extraction.mjs:82:  'const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"',
scripts/validate-home-reward-coordinator-module-extraction.mjs:83:  'const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"',
scripts/validate-avatar-progression-v550.mjs:37:  "avatar-progression-hotfix-v551.js",
scripts/validate-avatar-progression-v550.mjs:101:const compatibility = read("avatar-progression-hotfix-v551.js");
scripts/validate-avatar-progression-v550.mjs:140:if (!serviceWorker.includes('const PREVIOUS_CACHE_NAME = "salita-quest-v5-6-14-popup-governor-extraction-r67"')) fail("Service worker does not retain the pre-modular release boundary");
scripts/validate-avatar-progression-v550.mjs:141:if (!serviceWorker.includes('const CACHE_NAME = "salita-quest-v5-6-15-level-avatar-rewards-extraction-r68"')) fail("Service worker cache version is not the modular-bootstrap release");
```

## Generated inventory entry
```json
[
  {
    "path": [],
    "value": {
      "schemaVersion": 2,
      "manifestFile": "src/config/course-manifest.js",
      "sourceDocument": "https://raw.githubusercontent.com/Costieman/SalitaQuest/cb89fa4778737b16408bd5a66dd8fcc7f7f37f81/index.html",
      "sourceDocumentCommit": "cb89fa4778737b16408bd5a66dd8fcc7f7f37f81",
      "courseSeeds": {
        "tagalog": [
          "app.js",
          "progression-v54.js",
          "exercise-fixes-v545.js",
          "ui-quality-fixes.js",
          "daily-goal-refinement.js",
          "weekly-avatar-chest.js",
          "key-run-refinement.js",
          "weekly-avatar-polish.js",
          "incorrect-order-feedback.js",
          "src/features/interface/compact-desktop-layout.js",
          "src/features/interface/clean-topbar.js",
          "src/features/progression/even-progress-rail.js",
          "mastery-feedback.js",
          "lesson-side-launcher.js",
          "mobile-session-refinement.js",
          "src/features/interface/popup-governor-v1.js",
          "profile-app.js",
          "profile-emblem-control.js",
          "adaptive-scenarios.js",
          "level-progression-v2.js",
          "src/features/interface/level-up-mobile-safety-v552.js",
          "desktop-navigation-refinement.js",
          "src/features/audio/pronunciation-release-control.js",
          "src/features/progression/home-reward-coordinator.js",
          "badge-catalogue-v2.js",
          "badge-chest-v2.js",
          "placement-onboarding-v1.js",
          "social-connections-v2.js",
          "achievement-sharing-v4.js",
          "src/features/interface/collection-key-translation-hotfix.js"
        ],
        "cebuano": [
          "app.js",
          "bisaya-app-loader.js",
          "ui-quality-fixes.js",
          "daily-goal-refinement.js",
          "weekly-avatar-chest.js",
          "key-run-refinement.js",
          "weekly-avatar-polish.js",
          "incorrect-order-feedback.js",
          "src/features/interface/compact-desktop-layout.js",
          "src/features/interface/clean-topbar.js",
          "src/features/progression/even-progress-rail.js",
          "mastery-feedback.js",
          "lesson-side-launcher.js",
          "mobile-session-refinement.js",
          "src/features/interface/popup-governor-v1.js",
          "profile-emblem-control.js",
          "adaptive-scenarios.js",
          "level-progression-v2.js",
          "src/features/interface/level-up-mobile-safety-v552.js",
          "desktop-navigation-refinement.js",
          "src/features/audio/pronunciation-release-control.js",
          "src/features/progression/home-reward-coordinator.js",
          "badge-catalogue-v2.js",
          "badge-chest-v2.js",
          "placement-onboarding-v1.js",
          "social-connections-v2.js",
          "achievement-sharing-v4.js"
        ]
      },
      "summary": {
        "modules": 58,
        "dependencyEdges": 147,
        "storageContracts": 21,
        "salitaEvents": 36,
        "extractionCandidates": 17,
        "prepareAdapters": 23,
        "highCoupling": 7,
        "held": 11
      },
      "modules": [
        {
          "file": "achievement-sharing-avatar-bridge-v1.js",
          "bytes": 4453,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "src/features/sharing/facebook-share-link-v1.js"
          ],
          "loads": [
            "src/features/sharing/facebook-share-link-v1.js"
          ],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaQuestAchievementSharingAvatarCompatibilityV558Installed",
              "SalitaAchievementAvatarBridge"
            ],
            "consumes": [
              "getAvatarImagePath",
              "SalitaAvatarArtwork",
              "SalitaAvatarModel",
              "SalitaQuestAchievementSharing"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-avatar-detail-actions",
              "[data-share-avatar]",
              "[data-sq-avatar-id]",
              "script[data-facebook-share-link]"
            ],
            "datasets": [
              "avatarSharingBridge",
              "facebookShareLink",
              "shareAvatar",
              "sqAvatarId"
            ]
          },
          "events": {
            "listens": [
              "salita:avatar-collection-changed"
            ],
            "dispatches": [
              "salita:avatar-sharing-bridge-ready"
            ]
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 23
        },
        {
          "file": "achievement-sharing-router-v2.js",
          "bytes": 539,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "src/features/sharing/achievement-sharing-router-v3.js"
          ],
          "loads": [
            "src/features/sharing/achievement-sharing-router-v3.js"
          ],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [],
            "consumes": [
              "__salitaQuestAchievementSharingRouterV3Installed"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [
              "script[data-sq-sharing-router-v3]"
            ],
            "datasets": [
              "sqSharingRouterV3"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 8
        },
        {
          "file": "achievement-sharing-v4.js",
          "bytes": 41132,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "BADGES",
            "levelInfo",
            "state",
            "toast"
          ],
          "window": {
            "provides": [
              "__salitaQuestAchievementSharingV4Installed",
              "__salitaQuestAchievementSharingV6Installed",
              "SalitaQuestAchievementSharing"
            ],
            "consumes": [
              "getAvatarImagePath",
              "SalitaAvatarArtwork",
              "SalitaAvatarAssets",
              "SalitaAvatarModel",
              "SalitaLevelProgression",
              "SalitaQuestAvatarCase",
              "SalitaQuestBadgeChest",
              "SalitaQuestSocialConnections"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [
              "achievementShareDescription",
              "achievementSharePlatforms",
              "achievementSharePreview",
              "achievementShareStatus",
              "achievementShareTitle",
              "progressView"
            ],
            "selectors": [
              ".progress-hero,.progress-header,.view-heading,.panel",
              ".sq-avatar-detail-actions",
              ".sq-avatar-unlock-actions",
              ".sq-avatar-unlock-layer",
              "[data-badge-id]",
              "[data-share-avatar]",
              "[data-share-current-level]",
              "[data-sq-avatar-id]"
            ],
            "datasets": [
              "achievementPlatform",
              "achievementSharing",
              "avatarShareContext",
              "badgeId",
              "course",
              "shareAvatar",
              "shareBadge",
              "sqAvatarId"
            ]
          },
          "events": {
            "listens": [
              "click",
              "keydown",
              "salita:avatar-collection-changed",
              "salita:avatar-unlock-animation-started",
              "salita:level-updated",
              "salita:popup-finished",
              "salita:view-changed"
            ],
            "dispatches": [
              "salita:achievement-share-prepared"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 48
        },
        {
          "file": "adaptive-scenarios.js",
          "bytes": 14743,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentExercise",
            "escapeHTML",
            "finishSession",
            "ITEMS",
            "loadBossExercise",
            "MODULES",
            "renderExercise",
            "saveState",
            "selectedChoice",
            "session",
            "state",
            "switchView",
            "toast",
            "updateBoss"
          ],
          "window": {
            "provides": [
              "__salitaQuestAdaptiveScenariosInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "adaptiveScenarioGrid",
              "bossView",
              "lessonModule",
              "sessionCompleteMessage",
              "sessionCompleteTitle"
            ],
            "selectors": [
              "[data-scenario-id]"
            ],
            "datasets": [
              "scenarioId"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "high-coupling",
          "risk": 50
        },
        {
          "file": "app.js",
          "bytes": 181419,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "service-worker.js"
          ],
          "loads": [],
          "fetches": [],
          "workers": [
            "service-worker.js"
          ],
          "coreGlobals": [],
          "window": {
            "provides": [],
            "consumes": [
              "AudioContext",
              "scrollTo",
              "webkitAudioContext"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "${STORAGE_KEY}.beforeImport"
            }
          ],
          "dom": {
            "ids": [
              "achievementCount",
              "activityDailyBtn",
              "activityQuickBtn",
              "activityQuickLength",
              "answerDetail",
              "answerInput",
              "audioBtn",
              "badgeShelf",
              "beginnerSetting",
              "bestStreakMetric",
              "bossStatus",
              "bossUnlockNote",
              "builtSentence",
              "celebrationSoundSetting",
              "checkBtn",
              "choiceGrid",
              "clearWordsBtn",
              "closeDialogueBtn",
              "coinValue",
              "comboChip",
              "completeAccuracy",
              "completeCombo",
              "completeXp",
              "conversationSpotlight",
              "copyTransferBtn",
              "currentModuleBadge",
              "currentModuleDescription",
              "currentModuleTitle",
              "dailyQuestList",
              "dailyQuestScore",
              "dailyRing",
              "darkModeSetting",
              "dialogueBody",
              "dialogueLevel",
              "dialogueModal",
              "dialogueNote",
              "dialogueTitle",
              "dictionaryCount",
              "dictionaryGrid",
              "dictionaryMode",
              "dictionaryModuleFilter",
              "dictionaryOriginFilter",
              "dictionaryRandomBtn",
              "dictionarySearch",
              "dueMetric",
              "exerciseType",
              "exportBtn",
              "feedbackBox",
              "feedbackText",
              "feedbackTitle",
              "handsFreeActiveCount",
              "handsFreeApproxTime",
              "handsFreeCountdown",
              "handsFreeElapsed",
              "handsFreeItemCounter",
              "handsFreeNewMixBtn",
              "handsFreeNowEnglish",
              "handsFreeNowTagalog",
              "handsFreePauseBtn",
              "handsFreePhase",
              "handsFreePlayBtn",
              "handsFreeProgressBar",
              "handsFreeQueueList",
              "handsFreeRecallPrompt",
              "handsFreeStopBtn",
              "handsFreeTrackSummary",
              "handsFreeTrackTitle",
              "hintBtn",
              "hintText",
              "homeHeroPill",
              "homeHeroText",
              "homeHeroTitle",
              "homeQuickReviewLength",
              "homeTopicAllBtn",
              "homeTopicEmpty",
              "homeTopicSelect",
              "homeTopicShortBtn",
              "importInput",
              "installAppBtn",
              "inventoryTable",
              "journeyPath",
              "lessonCard",
              "lessonContext",
              "lessonModule",
              "lessonProgressBar",
              "lessonPrompt",
              "lessonXpChip",
              "levelBar",
              "levelValue",
              "masteredMetric",
              "masteryMilestones",
              "masteryNextRegion",
              "masteryNextText",
              "masteryRailTitle",
              "mobileCoinValue",
              "mobileExitLessonBtn",
              "mobileImportBtn",
              "mobileMenuBackdrop",
              "mobileMenuBtn",
              "mobileMenuCloseBtn",
              "mobileMenuSheet",
              "mobileSheetImportBtn",
              "mobileStreakValue",
              "mobileTransferPrompt",
              "mobileViewTitle",
              "moduleItemCount",
              "moduleProgressBar",
              "moduleProgressText",
              "naturalVoiceSetting",
              "newCount",
              "newItemsSetting",
              "nextBtn",
              "openCurrentDialogueBtn",
              "originBadge",
              "playerLevelBadge",
              "playerLevelSubtitle",
              "playerLevelTitle",
              "playerXpBar",
              "playerXpRemaining",
              "playerXpText",
              "productionSetting",
              "progressLevelTitle",
              "progressWeekTitle",
              "progressXpBar",
              "questChest",
              "questChestStatus",
              "questChestText",
              "questChestTitle",
              "quickReviewBtn",
              "quickReviewLengthSetting",
              "reducedMotionSetting",
              "resetBtn",
              "restoreTransferBtn",
              "reviewCount",
              "rewardBurst",
              "rewardBurstIcon",
              "rewardBurstText",
              "sentenceBuilder",
              "sessionAccuracy",
              "sessionCelebrationIcon",
              "sessionCombo",
              "sessionCompleteMessage",
              "sessionCompleteModal",
              "sessionCompleteTitle",
              "sessionCounter",
              "sessionHomeBtn",
              "sessionLengthSetting",
              "sessionReviewBtn",
              "sessionStars",
              "sessionXp",
              "skillBars",
              "skillTree",
              "skipBtn",
              "startBossBtn",
              "startDailyBtn",
              "streakValue",
              "strictSetting",
              "structureBox",
              "structureDetails",
              "toast",
              "todayLabel",
              "topicReviewGrid",
              "totalXpMetric",
              "transferCodeInput",
              "transferStatus",
              "undoWordBtn",
              "viewTitle",
              "voiceStatus",
              "weekMomentumLabel",
              "wordBank"
            ],
            "selectors": [
              ".dictionary-audio-btn",
              ".dictionary-card",
              ".dictionary-reveal-area",
              ".line-audio-btn",
              ".map-node",
              ".map-stop.open",
              ".structure-summary-label",
              ".topic-all-btn",
              ".topic-dialogue-btn",
              ".topic-five-btn",
              ".topic-full-btn",
              ".view",
              "[data-art]",
              "[data-masterytip]",
              "[data-review-camp]",
              "[data-view]",
              "summary"
            ],
            "datasets": [
              "art",
              "currentView",
              "hydrated",
              "masterytip",
              "module",
              "reviewCamp",
              "speech",
              "text",
              "view"
            ]
          },
          "events": {
            "listens": [
              "beforeinstallprompt",
              "change",
              "click",
              "input",
              "keydown"
            ],
            "dispatches": []
          },
          "role": "core-engine",
          "readiness": "hold",
          "risk": 203
        },
        {
          "file": "avatar-case-v1.js",
          "bytes": 14488,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaQuestAvatarCaseV1Installed",
              "SalitaQuestAvatarCase"
            ],
            "consumes": [
              "getAvatarImagePath",
              "SalitaAvatarArtwork",
              "SalitaAvatarModel"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-avatar-case-picker-grid",
              ".sq-avatar-case-picker-order",
              ".sq-avatar-case-picker-status",
              ".sq-avatar-collection-dialog",
              ".sq-avatar-collection-summary",
              "[data-avatar-case-choice]",
              "[data-avatar-case-draft-move]",
              "[data-avatar-case-draft-remove]",
              "[data-avatar-case-open-picker]",
              "[data-avatar-case-picker-close]",
              "[data-avatar-case-picker-save]",
              "[data-avatar-case-toggle]"
            ],
            "datasets": [
              "avatarCase",
              "avatarCaseChoice",
              "avatarCaseDraftMove",
              "avatarCaseDraftRemove",
              "avatarCaseId"
            ]
          },
          "events": {
            "listens": [
              "click",
              "keydown",
              "salita:avatar-collection-changed",
              "salita:avatar-progression-ready",
              "salita:open-avatar-collection"
            ],
            "dispatches": [
              "salita:avatar-case-changed",
              "salita:avatar-case-ready"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 27
        },
        {
          "file": "avatar-collection-screen-v1.js",
          "bytes": 13858,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaAvatarCollectionScreenInstalled",
              "SalitaAvatarCollectionScreen"
            ],
            "consumes": [
              "clearInterval",
              "SalitaAvatarArtwork",
              "SalitaAvatarModel",
              "setInterval"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-avatar-collection-close",
              ".sq-avatar-collection-scroll",
              ".sq-avatar-collection-summary",
              ".sq-profile-button img,.sq-profile-identity img,.sq-profile-emblem-trigger img,.player-avatar img",
              ".sq-profile-menu",
              "[data-avatar-action]",
              "[data-avatar-choice]",
              "[data-avatar-collection]",
              "[data-avatar-detail]",
              "[data-course]",
              "[data-detail-close]",
              "[data-detail-equip]"
            ],
            "datasets": [
              "avatarAction",
              "avatarChoice",
              "avatarCollection",
              "avatarDetail",
              "detailEquip",
              "sqAvatarId"
            ]
          },
          "events": {
            "listens": [
              "click",
              "keydown",
              "salita:avatar-collection-changed",
              "salita:open-avatar-collection"
            ],
            "dispatches": [
              "salita:avatar-collection-changed",
              "salita:avatar-equipped"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 29
        },
        {
          "file": "avatar-progression-hotfix-v551.js",
          "bytes": 10493,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "closeMobileMenu",
            "pictogram",
            "renderBadges",
            "state",
            "switchView"
          ],
          "window": {
            "provides": [
              "__salitaQuestCollectionsNavigationV551Installed",
              "SalitaAvatarCatalogue",
              "SalitaAvatarHotfixReady",
              "SalitaAvatarModel"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "badgesView",
              "collectionsView",
              "mobileViewTitle",
              "settingsView",
              "viewTitle"
            ],
            "selectors": [
              ".main-area",
              ".sidebar .nav-item",
              "[data-open-avatar-collection-main]",
              "[data-open-badge-collection]"
            ],
            "datasets": [
              "view"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": [
              "salita:avatar-model-hotfixed",
              "salita:open-avatar-collection"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 34
        },
        {
          "file": "avatar-unlock-celebration-v1.js",
          "bytes": 11499,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "levelInfo"
          ],
          "window": {
            "provides": [
              "__salitaQuestAvatarUnlockCelebrationV3Installed",
              "SalitaAvatarUnlockCelebration"
            ],
            "consumes": [
              "getAvatarImagePath",
              "SalitaAvatarArtwork",
              "SalitaAvatarAssets",
              "SalitaAvatarCollectionScreen",
              "SalitaAvatarModel",
              "SalitaLevelAvatarRewards",
              "SalitaPopupGovernor"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-avatar-unlock-art img",
              ".sq-avatar-unlock-fallback",
              "[data-unlock-add]",
              "[data-unlock-skip]"
            ],
            "datasets": [
              "retryCount"
            ]
          },
          "events": {
            "listens": [
              "click",
              "error",
              "keydown",
              "load",
              "salita:avatar-collection-changed",
              "salita:avatar-milestones-awarded",
              "salita:popup-finished",
              "visibilitychange"
            ],
            "dispatches": [
              "salita:avatar-unlock-acknowledged",
              "salita:avatar-unlock-animation-finished",
              "salita:avatar-unlock-animation-started",
              "salita:open-avatar-collection"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 39
        },
        {
          "file": "badge-catalogue-v2.js",
          "bytes": 17068,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "badgeArt",
            "BADGES",
            "bossReady",
            "currentView",
            "levelInfo",
            "recordDailyAnswer",
            "recordDailySession",
            "renderBadges",
            "saveState",
            "session",
            "state",
            "switchView",
            "totalLearningPoints"
          ],
          "window": {
            "provides": [
              "__salitaQuestBadgeCatalogueV2Installed"
            ],
            "consumes": [
              "dispatchEvent"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [
              "achievementCount",
              "badgeShelf",
              "homeView"
            ],
            "selectors": [
              ".badge-custom-image",
              ".badge-earned-medal",
              "#badgesView .badges-page-summary h3",
              "img"
            ],
            "datasets": [
              "badgeId",
              "currentView"
            ]
          },
          "events": {
            "listens": [
              "error",
              "load"
            ],
            "dispatches": [
              "salita:badges-rendered"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "high-coupling",
          "risk": 50
        },
        {
          "file": "badge-chest-v2.js",
          "bytes": 15360,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "badgeArt",
            "BADGES",
            "saveState",
            "state",
            "toast"
          ],
          "window": {
            "provides": [
              "__salitaQuestBadgeChestV2Installed",
              "SalitaQuestBadgeChest"
            ],
            "consumes": [
              "dispatchEvent"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [
              "badgeChestPanel",
              "badgeShelf",
              "badgesView"
            ],
            "selectors": [
              ".badge-card-share-actions",
              ".badge-catalogue-copy",
              ".badge-share-visual img",
              "#badgePickerCount",
              "#badgePickerGrid",
              "#badgePickerStatus",
              "#badgeShelf .badge-catalogue-card.earned",
              "#badgesView .badges-page-shelf",
              "#badgesView .badges-page-summary"
            ],
            "datasets": [
              "badgeChestToggle",
              "badgeId",
              "chestBadgeId",
              "chestMove",
              "pickerBadge",
              "signature"
            ]
          },
          "events": {
            "listens": [
              "change",
              "click",
              "error",
              "keydown",
              "load"
            ],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 29
        },
        {
          "file": "bisaya-app-loader.js",
          "bytes": 14054,
          "contexts": [
            "cebuano"
          ],
          "courses": [
            "cebuano"
          ],
          "references": [
            "app.js",
            "exercise-fixes-v545.js",
            "profile-app.js"
          ],
          "loads": [
            "exercise-fixes-v545.js",
            "profile-app.js"
          ],
          "fetches": [
            "app.js"
          ],
          "workers": [],
          "coreGlobals": [
            "accepted",
            "activeAudio",
            "countMasteredInModule",
            "handsFreeReview",
            "state"
          ],
          "window": {
            "provides": [],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "audioBtn",
              "voiceStatus"
            ],
            "selectors": [
              ".main-area"
            ],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 32
        },
        {
          "file": "bisaya-review-regions.js",
          "bytes": 14162,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "attachWorldMapEvents",
            "BADGES",
            "beginQueueSession",
            "BOSS_ITEMS",
            "bossReady",
            "buildHandsFreeQueue",
            "buildWorldMap",
            "currentExercise",
            "finishSession",
            "handsFreeActiveItems",
            "handsFreeReview",
            "isModuleUnlocked",
            "loadBossExercise",
            "MODULE_META",
            "MODULES",
            "moduleStats",
            "pictogram",
            "practisedItems",
            "renderExercise",
            "renderHandsFreeReview",
            "renderSkillTree",
            "reviewPool",
            "saveState",
            "selectedChoice",
            "session",
            "startModuleSession",
            "state",
            "switchView",
            "toast",
            "unlockedModules",
            "updateAll",
            "updateBoss"
          ],
          "window": {
            "provides": [],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "bossStatus",
              "bossUnlockNote",
              "lessonModule",
              "skillTree",
              "startBossBtn"
            ],
            "selectors": [
              ".map-node",
              ".map-stop.open",
              "[data-review-region]"
            ],
            "datasets": [
              "module",
              "reviewRegion"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "high-coupling",
          "risk": 103
        },
        {
          "file": "coin-avatar-shard-shop-v1.js",
          "bytes": 11617,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "coin-avatar-shop-reveal-v1.js"
          ],
          "loads": [
            "coin-avatar-shop-reveal-v1.js"
          ],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "updateGlobalUI"
          ],
          "window": {
            "provides": [
              "__salitaCoinAvatarShardShopV1Installed",
              "SalitaCoinAvatarShop"
            ],
            "consumes": [
              "renderCatalogue",
              "SalitaAvatarModel",
              "saveState",
              "setInterval",
              "state",
              "syncEarned",
              "updateGlobalUI"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-avatar-collection-close",
              ".sq-avatar-collection-header",
              ".sq-coin-pack.mystery",
              ".sq-coin-pack.rare",
              ".sq-coin-shop-balance",
              ".sq-coin-shop-close",
              ".sq-coin-shop-grid",
              ".sq-coin-shop-message",
              "[data-coin-pack]",
              "[data-open-coin-shop]",
              "link[data-sq-coin-reveal]",
              "script[data-sq-coin-reveal]"
            ],
            "datasets": [
              "coinPack",
              "openCoinShop",
              "sqCoinReveal"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": [
              "salita:avatar-collection-changed",
              "salita:coin-avatar-shop-ready",
              "salita:coin-balance-changed",
              "salita:coin-shard-pack-purchased"
            ]
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 52
        },
        {
          "file": "coin-avatar-shop-badges-v1.js",
          "bytes": 4109,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "BADGES"
          ],
          "window": {
            "provides": [
              "__salitaCoinAvatarShopBadgesV1Installed"
            ],
            "consumes": [
              "BADGES",
              "renderCatalogue",
              "SalitaAvatarModel",
              "state",
              "syncEarned"
            ]
          },
          "storage": [
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:coin-shop-badges-ready"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 19
        },
        {
          "file": "coin-avatar-shop-reveal-v1.js",
          "bytes": 16804,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "updateGlobalUI"
          ],
          "window": {
            "provides": [
              "__salitaCoinAvatarRevealV1Installed",
              "SalitaAvatarCatalogue",
              "SalitaAvatarModel"
            ],
            "consumes": [
              "SalitaAvatarArtwork",
              "saveState",
              "setInterval",
              "state",
              "syncEarned",
              "updateGlobalUI"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-coin-pack.rare",
              ".sq-coin-reveal-art",
              ".sq-coin-reveal-backdrop",
              ".sq-coin-reveal-base",
              ".sq-coin-reveal-colour",
              ".sq-coin-reveal-colour img",
              ".sq-coin-reveal-done",
              ".sq-coin-reveal-kicker",
              ".sq-coin-reveal-name",
              ".sq-coin-reveal-progress",
              ".sq-coin-reveal-title",
              ".sq-coin-reveal-track span",
              ".sq-coin-shop-backdrop",
              ".sq-coin-shop-grid",
              ".sq-coin-shop-message",
              ".sq-mystery-gift",
              "button"
            ],
            "datasets": [
              "rarity"
            ]
          },
          "events": {
            "listens": [
              "click",
              "salita:coin-shard-pack-purchased"
            ],
            "dispatches": [
              "salita:avatar-collection-changed",
              "salita:avatar-random-pools-ready",
              "salita:coin-balance-changed",
              "salita:coin-shard-pack-purchased"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 56
        },
        {
          "file": "coin-avatar-shop-topbar-v1.js",
          "bytes": 3177,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "coin-testing-grant-100k-v1.js",
            "coin-testing-grant-50k-phase5-v1.js",
            "src/features/avatar/avatar-collection-summary-v1.js",
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
            "src/features/economy/economy-tracking-phase6-v1.js"
          ],
          "loads": [
            "coin-testing-grant-100k-v1.js",
            "coin-testing-grant-50k-phase5-v1.js",
            "src/features/avatar/avatar-collection-summary-v1.js",
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
            "src/features/economy/economy-tracking-phase6-v1.js"
          ],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaCoinAvatarShopTopbarV1Installed"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-coin-reveal-backdrop",
              "[data-topbar-coin-shop]"
            ],
            "datasets": [
              "rarity"
            ]
          },
          "events": {
            "listens": [
              "salita:coin-shard-pack-purchased"
            ],
            "dispatches": []
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 28
        },
        {
          "file": "coin-testing-grant-100k-v1.js",
          "bytes": 2110,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "saveState",
            "updateGlobalUI"
          ],
          "window": {
            "provides": [
              "__salitaCoinTestingGrant100kV1Installed"
            ],
            "consumes": [
              "saveState",
              "state",
              "updateGlobalUI"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:coin-balance-changed"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 27
        },
        {
          "file": "coin-testing-grant-50k-phase5-v1.js",
          "bytes": 2080,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "saveState",
            "updateGlobalUI"
          ],
          "window": {
            "provides": [
              "__salitaCoinTestingGrant50kPhase5V1Installed"
            ],
            "consumes": [
              "saveState",
              "state",
              "updateGlobalUI"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "key"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:coin-balance-changed"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 27
        },
        {
          "file": "daily-goal-refinement.js",
          "bytes": 8206,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "claimDailyQuestRewards",
            "currentExercise",
            "DAILY_QUESTS",
            "DEFAULT_STATE",
            "ensureDailyActivity",
            "finishSession",
            "questProgress",
            "recordDailyAnswer",
            "renderDailyQuests",
            "saveState",
            "session",
            "showRewardBurst",
            "state",
            "updateAll",
            "updateGlobalUI"
          ],
          "window": {
            "provides": [
              "__salitaQuestDailyGoalRefinementInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "questChestText",
              "questChestTitle"
            ],
            "selectors": [],
            "datasets": [
              "coinEconomy"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:economy-v2-phase1-ready"
            ]
          },
          "role": "progression",
          "readiness": "high-coupling",
          "risk": 51
        },
        {
          "file": "desktop-navigation-refinement.js",
          "bytes": 13173,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "closeMobileMenu",
            "currentView",
            "pictogram",
            "renderBadges",
            "state",
            "switchView"
          ],
          "window": {
            "provides": [
              "__salitaQuestPersistentNavigationV1Installed",
              "SalitaQuestPersistentNavigation"
            ],
            "consumes": [
              "closeMobileMenu",
              "getAvatarImagePath",
              "SalitaAvatarArtwork",
              "SalitaAvatarModel",
              "SalitaCoinAvatarShop"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [
              "badgesView",
              "mobileViewTitle",
              "progressView",
              "settingsView",
              "viewTitle"
            ],
            "selectors": [
              ":scope > span",
              ".badges-page-shelf",
              ".badges-page-summary",
              ".desktop-nav-collapse",
              ".main-area",
              ".mobile-more-grid",
              ".nav-item",
              ".nav-list",
              ".progress-achievement-card",
              ".sidebar",
              ".sidebar .nav-item",
              ".sidebar .nav-item,[data-persistent-navigation] [data-view]",
              ".view.active",
              "#homeView > .achievement-panel, .achievement-panel"
            ],
            "datasets": [
              "currentView",
              "navOrder",
              "persistentNavigation",
              "sqAvatarId",
              "sqNavAction",
              "view"
            ]
          },
          "events": {
            "listens": [
              "click",
              "salita:avatar-equipped",
              "salita:avatar-progression-ready"
            ],
            "dispatches": [
              "salita:open-avatar-collection",
              "salita:shop-opened",
              "salita:view-changed"
            ]
          },
          "role": "interface",
          "readiness": "prepare-adapter",
          "risk": 52
        },
        {
          "file": "exercise-fixes-v545.js",
          "bytes": 10731,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "buildChoices",
            "buildSentenceOptions",
            "capitaliseFirst",
            "currentExercise",
            "escapeHTML",
            "generateVerbExercise",
            "ITEMS",
            "lockSentenceBuilder",
            "removeSelectedWord",
            "renderFeedback",
            "selectBuilderWord",
            "sentenceBuilderState",
            "sentenceTokens",
            "unlockStructureBox",
            "updateSentenceBuilderUI"
          ],
          "window": {
            "provides": [
              "__salitaQuestSentenceBuilderInteractionRecoveryInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "answerDetail",
              "answerInput",
              "builtSentence",
              "checkBtn",
              "feedbackBox",
              "feedbackText",
              "feedbackTitle",
              "nextBtn",
              "sentenceBuilder"
            ],
            "selectors": [
              "#builtSentence .selected-word-tile",
              "#wordBank .word-tile"
            ],
            "datasets": [
              "builderSelectedIndex",
              "builderTileIndex"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "high-coupling",
          "risk": 57
        },
        {
          "file": "incorrect-order-feedback.js",
          "bytes": 5881,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentExercise",
            "renderFeedback",
            "renderSentenceBuilder",
            "sentenceBuilderState",
            "state",
            "updateSentenceBuilderUI"
          ],
          "window": {
            "provides": [
              "__salitaQuestIncorrectOrderFeedbackInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "builtSentence",
              "sentenceBuilder"
            ],
            "selectors": [
              ".selected-word-tile"
            ],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "prepare-adapter",
          "risk": 23
        },
        {
          "file": "key-run-refinement.js",
          "bytes": 24682,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "claimDailyQuestRewards",
            "currentView",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "renderDailyQuests",
            "saveState",
            "showRewardBurst",
            "state",
            "switchView",
            "todayKey"
          ],
          "window": {
            "provides": [
              "__salitaQuestKeyRunRefinementInstalled",
              "__salitaQuestWeeklyAvatarPolishInstalled"
            ],
            "consumes": [
              "AudioContext",
              "crypto",
              "webkitAudioContext"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [
              "homeView",
              "keyRunAvatarModal",
              "questChest",
              "shareKeyRunAvatarBtn"
            ],
            "selectors": [
              ".daily-key-celebration",
              ".daily-key-spark-field",
              ".daily-quests-card .quest-card-header h3",
              ".quest-chest",
              ".weekly-key-meter",
              "[data-key-run-action]",
              "[data-key-run-close]",
              "#keyRunAvatarImage",
              "#keyRunAvatarPreview",
              "#keyRunAvatarTitle",
              "#shareKeyRunAvatarBtn"
            ],
            "datasets": [
              "course",
              "currentView",
              "keyRunAction"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": []
          },
          "role": "progression",
          "readiness": "high-coupling",
          "risk": 50
        },
        {
          "file": "lesson-side-launcher.js",
          "bytes": 10061,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentExercise",
            "finishSession",
            "renderExercise",
            "renderFeedback",
            "saveState",
            "sentenceBuilderState",
            "session",
            "startSession",
            "state",
            "switchView"
          ],
          "window": {
            "provides": [
              "__salitaQuestLessonSideLauncherInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "audioBtn",
              "feedbackBox",
              "learnView",
              "lessonCard",
              "nextBtn"
            ],
            "selectors": [
              ".lesson-content",
              ".lesson-launcher-length select",
              ".long-term-mastery-card",
              ".session-panel",
              "[data-launch-panel]",
              "[data-launch-tab]",
              "[data-start-mode]"
            ],
            "datasets": [
              "launchPanel",
              "launchTab",
              "startMode",
              "text"
            ]
          },
          "events": {
            "listens": [
              "click",
              "resize"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "prepare-adapter",
          "risk": 41
        },
        {
          "file": "level-progression-v2.js",
          "bytes": 11375,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentView",
            "levelInfo",
            "saveState",
            "state",
            "switchView",
            "updateGlobalUI"
          ],
          "window": {
            "provides": [
              "__salitaQuestLevelProgressionV2Installed",
              "SalitaLevelProgression"
            ],
            "consumes": [
              "SalitaPopupGovernor"
            ]
          },
          "storage": [
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveCourse"
            }
          ],
          "dom": {
            "ids": [
              "homeView",
              "playerLevelBadge"
            ],
            "selectors": [
              ".player-avatar img",
              ".sq-profile-emblem-trigger",
              ".version-label",
              "img"
            ],
            "datasets": [
              "course",
              "currentView",
              "digits",
              "learnerLevel"
            ]
          },
          "events": {
            "listens": [
              "error"
            ],
            "dispatches": [
              "salita:level-progression-saved",
              "salita:level-updated",
              "salita:view-changed"
            ]
          },
          "role": "progression",
          "readiness": "prepare-adapter",
          "risk": 36
        },
        {
          "file": "long-term-badges-v1.js",
          "bytes": 11592,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "BADGES",
            "levelInfo",
            "state",
            "totalLearningPoints"
          ],
          "window": {
            "provides": [
              "__salitaQuestLongTermBadgesV1Installed"
            ],
            "consumes": [
              "BADGES",
              "SalitaAvatarModel",
              "state"
            ]
          },
          "storage": [
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": [
              "longTermBadges"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:long-term-badges-ready"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 24
        },
        {
          "file": "mastery-feedback.js",
          "bytes": 11930,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentExercise",
            "getItemState",
            "recordExposure",
            "renderExercise",
            "renderFeedback",
            "session",
            "state",
            "updateSRS"
          ],
          "window": {
            "provides": [
              "__salitaQuestMasteryFeedbackInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [
              ".long-term-mastery-card",
              ".long-term-mastery-fill",
              ".long-term-mastery-note",
              ".long-term-mastery-track",
              ".long-term-score",
              ".long-term-stage",
              ".mastery-list",
              ".mastery-transition-note",
              "[data-mastery-level]",
              "#learnView .session-panel"
            ],
            "datasets": [
              "masteryLevel"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "progression",
          "readiness": "prepare-adapter",
          "risk": 31
        },
        {
          "file": "mobile-session-refinement.js",
          "bytes": 8201,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentExercise",
            "currentView",
            "finishSession",
            "getItemState",
            "openMobileMenu",
            "renderExercise",
            "renderFeedback",
            "renderMasteryRail",
            "session",
            "switchView"
          ],
          "window": {
            "provides": [
              "__salitaQuestMobileSessionRefinementInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "feedbackBox",
              "learnView"
            ],
            "selectors": [
              ".mastery-dot",
              ".mastery-rail-shell",
              ".mobile-nav",
              ".sq-profile-control",
              ".version-label",
              "[data-mobile-long-term]",
              "[data-mobile-mastery-step]",
              "[data-mobile-stage]",
              "#learnView .lesson-progress-track",
              "#learnView .lesson-topline",
              "#masteryMilestones .mastery-milestone"
            ],
            "datasets": [
              "course",
              "currentView",
              "mobileMasteryStep",
              "mobileMilestoneNumber",
              "mobileMore"
            ]
          },
          "events": {
            "listens": [
              "click",
              "resize"
            ],
            "dispatches": []
          },
          "role": "interface",
          "readiness": "prepare-adapter",
          "risk": 40
        },
        {
          "file": "placement-onboarding-v1.js",
          "bytes": 16245,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "ITEMS",
            "MODULES",
            "newItems",
            "saveState",
            "state",
            "syncSettings",
            "toast",
            "totalLearningPoints",
            "unlockedModules",
            "updateAll"
          ],
          "window": {
            "provides": [
              "__salitaQuestPlacementOnboardingV1Installed"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "beginnerSetting",
              "placementContent",
              "placementModal",
              "placementSettingsCard",
              "placementSettingsSummary",
              "settingsView"
            ],
            "selectors": [
              ".panel",
              "[data-placement-answer]",
              "[data-placement-apply]",
              "[data-placement-beginner]",
              "[data-placement-close]",
              "[data-placement-level]",
              "[data-placement-start]",
              "[data-retake-placement]"
            ],
            "datasets": [
              "placementAnswer",
              "placementLevel",
              "retake",
              "selfLevel"
            ]
          },
          "events": {
            "listens": [
              "change",
              "click"
            ],
            "dispatches": []
          },
          "role": "profile-and-onboarding",
          "readiness": "prepare-adapter",
          "risk": 42
        },
        {
          "file": "profile-app.js",
          "bytes": 15930,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "bisaya-review-regions.js",
            "src/features/avatar/avatar-catalogue-v1.js"
          ],
          "loads": [
            "bisaya-review-regions.js",
            "src/features/avatar/avatar-catalogue-v1.js"
          ],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "saveState",
            "state"
          ],
          "window": {
            "provides": [],
            "consumes": [
              "clearInterval",
              "SalitaAvatarArtwork",
              "SalitaAvatarArtworkReady",
              "SalitaAvatarHotfixReady",
              "SalitaAvatarModel",
              "setInterval"
            ]
          },
          "storage": [
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveCourse"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "sessionStorage",
              "operation": "setItem",
              "key": "salitaQuestActiveCourse"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "${PROFILE_PROGRESS_PREFIX}${activeId}.${COURSE}"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "${PROFILE_PROGRESS_PREFIX}${activeId}"
            },
            {
              "store": "localStorage",
              "operation": "removeItem",
              "key": "${PROFILE_PROGRESS_PREFIX}${activeId}.${COURSE}"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestBaseProgressOwner"
            },
            {
              "store": "sessionStorage",
              "operation": "removeItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "sessionStorage",
              "operation": "removeItem",
              "key": "salitaQuestActiveCourse"
            },
            {
              "store": "localStorage",
              "operation": "removeItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "removeItem",
              "key": "salitaQuestBaseProgressOwner"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "${PROFILE_PROGRESS_PREFIX}${activeId}.${nextCourse}"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "${PROFILE_PROGRESS_PREFIX}${activeId}"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "removeItem",
              "key": "salitaQuestProgress"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestBaseProgressOwner"
            },
            {
              "store": "sessionStorage",
              "operation": "setItem",
              "key": "salitaQuestActiveCourse"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".player-avatar",
              ".player-avatar img",
              ".sq-avatar-choice-grid",
              ".sq-avatar-chooser",
              ".sq-profile-button",
              ".sq-profile-button img,.sq-profile-identity img",
              ".sq-profile-identity strong",
              ".sq-profile-menu",
              ".version-label",
              "[data-avatar-choice]",
              "[data-avatar-menu]",
              "[data-change]",
              "[data-course]",
              "[data-logout]",
              "script[data-bisaya-review-regions]"
            ],
            "datasets": [
              "avatarCatalogue",
              "avatarChoice",
              "bisayaReviewRegions",
              "course",
              "sqAvatarId"
            ]
          },
          "events": {
            "listens": [
              "beforeunload",
              "click",
              "DOMContentLoaded",
              "error",
              "keydown",
              "load",
              "pagehide",
              "unload",
              "visibilitychange"
            ],
            "dispatches": [
              "salita:avatar-equipped"
            ]
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 115
        },
        {
          "file": "profile-emblem-control.js",
          "bytes": 9205,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [
            "achievement-sharing-avatar-bridge-v1.js",
            "achievement-sharing-router-v2.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-progression-hotfix-v551.js",
            "avatar-unlock-celebration-v1.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-badges-v1.js",
            "coin-avatar-shop-topbar-v1.js",
            "long-term-badges-v1.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/avatar/avatar-catalogue-v1.js",
            "src/features/avatar/avatar-progression-migration-v1.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "loads": [
            "achievement-sharing-avatar-bridge-v1.js",
            "achievement-sharing-router-v2.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-progression-hotfix-v551.js",
            "avatar-unlock-celebration-v1.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-badges-v1.js",
            "coin-avatar-shop-topbar-v1.js",
            "long-term-badges-v1.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/avatar/avatar-catalogue-v1.js",
            "src/features/avatar/avatar-progression-migration-v1.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaQuestProfileEmblemControlInstalled"
            ],
            "consumes": [
              "SalitaAvatarArtwork",
              "SalitaAvatarArtworkReady",
              "SalitaAvatarHotfixReady",
              "SalitaAvatarModel"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [
              ".mobile-brand-mark",
              ".sidebar .brand-mark",
              ".sq-profile-button",
              ".sq-profile-control",
              ".sq-profile-menu",
              ".version-label",
              "img"
            ],
            "datasets": [
              "avatarId",
              "course",
              "loaded",
              "profileEmblem",
              "salitaRelease",
              "sqAvatarAsset",
              "sqAvatarId"
            ]
          },
          "events": {
            "listens": [
              "click",
              "error",
              "keydown",
              "load",
              "resize",
              "salita:avatar-equipped"
            ],
            "dispatches": [
              "salita:avatar-progression-ready"
            ]
          },
          "role": "runtime-loader",
          "readiness": "hold",
          "risk": 91
        },
        {
          "file": "progression-v54.js",
          "bytes": 5735,
          "contexts": [
            "tagalog"
          ],
          "courses": [
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "isModuleUnlocked",
            "ITEMS",
            "MODULE_META",
            "moduleById",
            "MODULES",
            "renderMasteryRail",
            "state",
            "toast",
            "unlockedModules",
            "updateAll"
          ],
          "window": {
            "provides": [
              "salitaUnlockProgress"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "masteryMilestones",
              "masteryNextRegion",
              "masteryNextText",
              "masteryRailTitle"
            ],
            "selectors": [
              "[data-masterytip]"
            ],
            "datasets": [
              "masterytip"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": []
          },
          "role": "progression",
          "readiness": "prepare-adapter",
          "risk": 37
        },
        {
          "file": "service-worker.js",
          "bytes": 12648,
          "contexts": [
            "worker"
          ],
          "courses": [],
          "references": [
            "achievement-sharing-avatar-bridge-v1.js",
            "achievement-sharing-router-v2.js",
            "achievement-sharing-router-v3.js",
            "achievement-sharing-v4.js",
            "adaptive-scenarios.js",
            "app.js",
            "avatar-artwork-registry-v554.js",
            "avatar-case-v1.js",
            "avatar-catalogue-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-collection-summary-v1.js",
            "avatar-collection-tabs-phase6-1-v1.js",
            "avatar-progression-hotfix-v551.js",
            "avatar-progression-migration-v1.js",
            "avatar-unlock-celebration-v1.js",
            "badge-catalogue-v2.js",
            "badge-chest-v2.js",
            "bisaya-app-loader.js",
            "bisaya-review-regions.js",
            "clean-topbar.js",
            "collection-key-translation-hotfix.js",
            "compact-desktop-layout.js",
            "daily-goal-refinement.js",
            "desktop-navigation-refinement.js",
            "economy-tracking-phase6-v1.js",
            "even-progress-rail.js",
            "exercise-fixes-v545.js",
            "facebook-share-link-v1.js",
            "home-reward-coordinator.js",
            "incorrect-order-feedback.js",
            "key-run-refinement.js",
            "lesson-side-launcher.js",
            "level-avatar-rewards-v1.js",
            "level-progression-v2.js",
            "level-up-mobile-safety-v552.js",
            "mastery-feedback.js",
            "mobile-session-refinement.js",
            "placement-onboarding-v1.js",
            "popup-governor-v1.js",
            "profile-app.js",
            "profile-emblem-control.js",
            "profile-install-prompt-v1.js",
            "progression-v54.js",
            "pronunciation-release-control.js",
            "social-connections-v2.js",
            "src/app/course-bootstrap.js",
            "src/config/course-manifest.js",
            "src/features/audio/pronunciation-release-control.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/avatar/avatar-catalogue-v1.js",
            "src/features/avatar/avatar-collection-summary-v1.js",
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
            "src/features/avatar/avatar-progression-migration-v1.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "src/features/economy/economy-tracking-phase6-v1.js",
            "src/features/interface/clean-topbar.js",
            "src/features/interface/collection-key-translation-hotfix.js",
            "src/features/interface/compact-desktop-layout.js",
            "src/features/interface/level-up-mobile-safety-v552.js",
            "src/features/interface/popup-governor-v1.js",
            "src/features/progression/even-progress-rail.js",
            "src/features/progression/home-reward-coordinator.js",
            "src/features/sharing/achievement-sharing-router-v3.js",
            "src/features/sharing/facebook-share-link-v1.js",
            "ui-quality-fixes.js",
            "weekly-avatar-chest.js",
            "weekly-avatar-polish.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "session"
          ],
          "window": {
            "provides": [],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [
              "activate",
              "fetch",
              "install"
            ],
            "dispatches": []
          },
          "role": "offline-runtime",
          "readiness": "hold",
          "risk": 3
        },
        {
          "file": "social-connections-v2.js",
          "bytes": 12738,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "switchView"
          ],
          "window": {
            "provides": [
              "__salitaQuestSocialConnectionsV2Installed",
              "__salitaQuestSocialConnectionsV3Installed",
              "SalitaQuestSocialConnections"
            ],
            "consumes": [
              "SALITA_SOCIAL_API_BASE"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestSocialApiBase"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestSocialApiBase"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestSocialApiBase"
            },
            {
              "store": "localStorage",
              "operation": "removeItem",
              "key": "salitaQuestSocialApiBase"
            }
          ],
          "dom": {
            "ids": [
              "badgesView",
              "settingsView",
              "socialApiBaseInput",
              "socialConnectionsStatus",
              "socialLinksCard"
            ],
            "selectors": [
              "[data-open-badges]",
              "[data-save-social-api]",
              "[data-social-connect]"
            ],
            "datasets": [
              "socialConnect"
            ]
          },
          "events": {
            "listens": [
              "click",
              "message"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "prepare-adapter",
          "risk": 32
        },
        {
          "file": "src/app/course-bootstrap.js",
          "bytes": 5514,
          "contexts": [
            "bootstrap"
          ],
          "courses": [],
          "references": [
            "app.js"
          ],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "SalitaQuestCourseBootstrap"
            ],
            "consumes": [
              "SalitaQuestCourseManifest"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "storage.profileStore"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "${storage.profileProgressPrefix}${profileId}.${courseId}"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "${storage.profileProgressPrefix}${profileId}"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "storage.activeProfile"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "storage.baseOwner"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "storage.baseProgress"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "${storage.profileProgressPrefix}${activeId}.${course.id}"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "${storage.profileProgressPrefix}${activeId}"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "storage.baseProgress"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "${storage.profileProgressPrefix}${activeId}.${course.id}"
            },
            {
              "store": "localStorage",
              "operation": "removeItem",
              "key": "storage.baseProgress"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "storage.baseOwner"
            },
            {
              "store": "sessionStorage",
              "operation": "setItem",
              "key": "storage.activeCourse"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "course.documentCache"
            },
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "course.documentCache"
            }
          ],
          "dom": {
            "ids": [
              "loader"
            ],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "course-bootstrap",
          "readiness": "hold",
          "risk": 52
        },
        {
          "file": "src/config/course-manifest.js",
          "bytes": 6325,
          "contexts": [
            "bootstrap"
          ],
          "courses": [],
          "references": [
            "achievement-sharing-v4.js",
            "adaptive-scenarios.js",
            "badge-catalogue-v2.js",
            "badge-chest-v2.js",
            "bisaya-app-loader.js",
            "daily-goal-refinement.js",
            "desktop-navigation-refinement.js",
            "exercise-fixes-v545.js",
            "incorrect-order-feedback.js",
            "key-run-refinement.js",
            "lesson-side-launcher.js",
            "level-progression-v2.js",
            "mastery-feedback.js",
            "mobile-session-refinement.js",
            "placement-onboarding-v1.js",
            "profile-app.js",
            "profile-emblem-control.js",
            "progression-v54.js",
            "social-connections-v2.js",
            "src/features/audio/pronunciation-release-control.js",
            "src/features/interface/clean-topbar.js",
            "src/features/interface/collection-key-translation-hotfix.js",
            "src/features/interface/compact-desktop-layout.js",
            "src/features/interface/level-up-mobile-safety-v552.js",
            "src/features/interface/popup-governor-v1.js",
            "src/features/progression/even-progress-rail.js",
            "src/features/progression/home-reward-coordinator.js",
            "ui-quality-fixes.js",
            "weekly-avatar-chest.js",
            "weekly-avatar-polish.js"
          ],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "session"
          ],
          "window": {
            "provides": [
              "SalitaQuestCourseManifest"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "course-config",
          "readiness": "hold",
          "risk": 5
        },
        {
          "file": "src/features/audio/pronunciation-release-control.js",
          "bytes": 2944,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "state",
            "toast"
          ],
          "window": {
            "provides": [
              "__salitaQuestPronunciationReleaseControlInstalled"
            ],
            "consumes": [
              "AudioContext",
              "webkitAudioContext"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": [
              "releasePlayback",
              "text"
            ]
          },
          "events": {
            "listens": [
              "click",
              "pointerdown",
              "pointerup"
            ],
            "dispatches": []
          },
          "role": "audio",
          "readiness": "extraction-candidate",
          "risk": 12
        },
        {
          "file": "src/features/avatar/avatar-artwork-registry-v554.js",
          "bytes": 5921,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaAvatarArtworkRegistryV556Installed",
              "getAvatarImagePath",
              "SalitaAvatarArtwork",
              "SalitaAvatarArtworkReady"
            ],
            "consumes": [
              "SalitaAvatarModel"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-profile-button img,.sq-profile-identity img,.sq-profile-emblem-trigger img,.player-avatar img"
            ],
            "datasets": [
              "avatarAction",
              "avatarCard",
              "avatarChoice",
              "detailEquip",
              "sqAvatarFallback",
              "sqAvatarId"
            ]
          },
          "events": {
            "listens": [
              "salita:avatar-collection-changed",
              "salita:avatar-equipped"
            ],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 13
        },
        {
          "file": "src/features/avatar/avatar-catalogue-v1.js",
          "bytes": 14246,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "state"
          ],
          "window": {
            "provides": [],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 3
        },
        {
          "file": "src/features/avatar/avatar-collection-summary-v1.js",
          "bytes": 3383,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaAvatarCollectionSummaryV1Installed",
              "SalitaAvatarCollectionSummary"
            ],
            "consumes": [
              "SalitaAvatarModel",
              "setInterval"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [
              ".sq-avatar-collection",
              ".sq-avatar-collection-header",
              ".sq-avatar-collection-summary"
            ],
            "datasets": []
          },
          "events": {
            "listens": [
              "salita:avatar-collection-changed",
              "salita:avatar-progression-ready",
              "salita:avatar-random-pools-ready",
              "salita:open-avatar-collection"
            ],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 12
        },
        {
          "file": "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
          "bytes": 5487,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaAvatarCollectionTabsPhase63Installed",
              "SalitaAvatarCollectionTabsPhase61"
            ],
            "consumes": [
              "SalitaEconomyTrackingPhase6"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [
              ":scope > .sq-avatar-case-panel",
              ":scope > .sq-avatar-collection-close",
              ":scope > .sq-avatar-collection-header",
              ":scope > .sq-avatar-collection-tabs",
              ":scope > .sq-economy-tracking-panel",
              ".sq-avatar-collection-dialog",
              "[data-avatar-collection-tab]"
            ],
            "datasets": [
              "activeCollectionTab",
              "avatarCollectionPane",
              "avatarCollectionTab"
            ]
          },
          "events": {
            "listens": [
              "click"
            ],
            "dispatches": [
              "salita:avatar-collection-tabs-ready"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 12
        },
        {
          "file": "src/features/avatar/avatar-progression-migration-v1.js",
          "bytes": 9067,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "state"
          ],
          "window": {
            "provides": [],
            "consumes": [
              "SalitaAvatarModel"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:avatar-progression-migrated"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 7
        },
        {
          "file": "src/features/avatar/level-avatar-rewards-v1.js",
          "bytes": 12787,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "levelInfo"
          ],
          "window": {
            "provides": [
              "__salitaQuestLevelAvatarRewardsV3Installed",
              "SalitaLevelAvatarRewards"
            ],
            "consumes": [
              "__salitaQuestLevelProgressionV2Installed",
              "SalitaAvatarModel"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveCourse"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": [
              "course",
              "placementUpdating"
            ]
          },
          "events": {
            "listens": [
              "salita:course-progress-restored",
              "salita:level-updated",
              "salita:placement-finished"
            ],
            "dispatches": [
              "salita:avatar-collection-changed",
              "salita:avatar-milestones-awarded",
              "salita:avatar-milestones-repaired"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 25
        },
        {
          "file": "src/features/economy/economy-tracking-phase6-v1.js",
          "bytes": 3504,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaEconomyTrackingPhase6V2Installed",
              "SalitaEconomyTrackingPhase6"
            ],
            "consumes": [
              "state"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [
              ":scope > .sq-avatar-statistics-pane",
              ".sq-avatar-collection-dialog",
              ".sq-economy-tracking-panel"
            ],
            "datasets": [
              "economyTracking"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": [
              "salita:economy-tracking-ready"
            ]
          },
          "role": "feature-extension",
          "readiness": "extraction-candidate",
          "risk": 10
        },
        {
          "file": "src/features/interface/clean-topbar.js",
          "bytes": 5066,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "renderMasteryRail",
            "totalLearningPoints"
          ],
          "window": {
            "provides": [
              "__salitaQuestCleanTopbarInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "masteryNextRegion",
              "masteryNextText",
              "masteryRailTitle"
            ],
            "selectors": [
              ":scope > .mastery-next-copy",
              ":scope > .mastery-summary-compact",
              ".mastery-milestones",
              ".mastery-next-copy",
              ".mastery-points-compact",
              ".mastery-rail-shell"
            ],
            "datasets": [
              "compactMastery"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "interface",
          "readiness": "extraction-candidate",
          "risk": 14
        },
        {
          "file": "src/features/interface/collection-key-translation-hotfix.js",
          "bytes": 8247,
          "contexts": [
            "tagalog"
          ],
          "courses": [
            "tagalog"
          ],
          "references": [
            "avatar-card-actions-v1.js",
            "avatar-case-page-tab-v1.js",
            "avatar-collection-page-v2.js",
            "mystery-rarity-roll-v1.js"
          ],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "ITEMS",
            "state"
          ],
          "window": {
            "provides": [
              "__salitaQuestCollectionKeyTranslationHotfixV2"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "questChest"
            ],
            "selectors": [
              ".weekly-key-meter",
              "[data-token], .token-row, .breakdown-row, li, tr, .analysis-token",
              "#questChestTitle, strong",
              "img",
              "link[data-sq-avatar-case-desktop-safety]",
              "link[data-sq-avatar-collection-page]"
            ],
            "datasets": [
              "sqAvatarCaseDesktopSafety",
              "sqAvatarCollectionPage"
            ]
          },
          "events": {
            "listens": [
              "DOMContentLoaded",
              "salita:daily-quests-rendered",
              "salita:state-changed"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "extraction-candidate",
          "risk": 12
        },
        {
          "file": "src/features/interface/compact-desktop-layout.js",
          "bytes": 2993,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "session"
          ],
          "window": {
            "provides": [
              "__salitaQuestCompactDesktopInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "audioBtn",
              "lessonCard",
              "structureBox"
            ],
            "selectors": [
              ":scope > .eyebrow",
              ":scope > .session-panel",
              ".lesson-content",
              ".lesson-topline",
              "#learnView .learn-layout",
              "#learnView .session-panel"
            ],
            "datasets": []
          },
          "events": {
            "listens": [
              "resize"
            ],
            "dispatches": []
          },
          "role": "interface",
          "readiness": "extraction-candidate",
          "risk": 11
        },
        {
          "file": "src/features/interface/level-up-mobile-safety-v552.js",
          "bytes": 1058,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaQuestLevelUpMobileSafetyV552Installed",
              "SalitaLevelUpMobileSafety"
            ],
            "consumes": [
              "SalitaLevelProgression",
              "SalitaPopupGovernor"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": [
              "levelUpSafety"
            ]
          },
          "events": {
            "listens": [
              "pageshow",
              "visibilitychange"
            ],
            "dispatches": []
          },
          "role": "interface",
          "readiness": "extraction-candidate",
          "risk": 8
        },
        {
          "file": "src/features/interface/popup-governor-v1.js",
          "bytes": 6239,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentView",
            "state"
          ],
          "window": {
            "provides": [
              "__salitaQuestPopupGovernorV1Installed",
              "getAvatarImagePath",
              "SalitaAvatarAssets",
              "SalitaPopupGovernor"
            ],
            "consumes": [
              "SalitaAvatarModel"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [
              "homeView"
            ],
            "selectors": [],
            "datasets": [
              "currentView",
              "placementUpdating",
              "popupGovernance"
            ]
          },
          "events": {
            "listens": [
              "pageshow"
            ],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "extraction-candidate",
          "risk": 17
        },
        {
          "file": "src/features/progression/even-progress-rail.js",
          "bytes": 2891,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "MODULES",
            "renderMasteryRail",
            "totalLearningPoints"
          ],
          "window": {
            "provides": [
              "__salitaQuestEvenProgressRailInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "masteryMilestones"
            ],
            "selectors": [
              ".mastery-dot",
              ".mastery-milestone",
              ".mastery-track-fill",
              ".mastery-you"
            ],
            "datasets": [
              "evenMilestone",
              "evenSpacing"
            ]
          },
          "events": {
            "listens": [
              "resize"
            ],
            "dispatches": []
          },
          "role": "progression",
          "readiness": "extraction-candidate",
          "risk": 14
        },
        {
          "file": "src/features/progression/home-reward-coordinator.js",
          "bytes": 8028,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentView",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "renderDailyQuests",
            "saveState",
            "state",
            "switchView",
            "todayKey"
          ],
          "window": {
            "provides": [
              "__salitaQuestHomeRewardCoordinatorInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "homeView"
            ],
            "selectors": [
              ".daily-key-celebration.reward-coordinator",
              ".daily-key-spark-field",
              ".quest-chest",
              ".weekly-key-meter"
            ],
            "datasets": [
              "currentView"
            ]
          },
          "events": {
            "listens": [
              "pageshow",
              "visibilitychange"
            ],
            "dispatches": []
          },
          "role": "progression",
          "readiness": "prepare-adapter",
          "risk": 29
        },
        {
          "file": "src/features/sharing/achievement-sharing-router-v3.js",
          "bytes": 8346,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaQuestAchievementSharingRouterV3Installed",
              "SalitaQuestSharingRouter"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "achievementShareDescription",
              "achievementSharePlatforms",
              "achievementShareTitle"
            ],
            "selectors": [
              ".achievement-share-preview small, #achievementShareStatus",
              ".achievement-share-secondary"
            ],
            "datasets": [
              "achievementSharingRouter"
            ]
          },
          "events": {
            "listens": [
              "click",
              "salita:achievement-share-closed",
              "salita:achievement-share-prepared"
            ],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "extraction-candidate",
          "risk": 8
        },
        {
          "file": "src/features/sharing/facebook-share-link-v1.js",
          "bytes": 1393,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [],
          "window": {
            "provides": [
              "__salitaFacebookShareLinkV1Installed",
              "SalitaFacebookShareLink"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [],
            "selectors": [],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "feature-extension",
          "readiness": "extraction-candidate",
          "risk": 4
        },
        {
          "file": "ui-quality-fixes.js",
          "bytes": 7690,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "currentExercise",
            "DAILY_QUESTS",
            "DEFAULT_STATE",
            "ensureDailyActivity",
            "escapeHTML",
            "finishSession",
            "ITEMS",
            "renderDailyQuests",
            "renderFeedback",
            "session",
            "showAnswerPop",
            "state",
            "updateAll"
          ],
          "window": {
            "provides": [
              "__salitaQuestQualityFixesInstalled"
            ],
            "consumes": []
          },
          "storage": [],
          "dom": {
            "ids": [
              "answerInput",
              "dailyQuestScore",
              "feedbackBox",
              "questChestTitle",
              "sentenceBuilder"
            ],
            "selectors": [
              ".built-sentence",
              ".choice-btn.selected",
              ".correct-word-breakdown",
              ".selected-word-tile"
            ],
            "datasets": []
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "interface",
          "readiness": "high-coupling",
          "risk": 48
        },
        {
          "file": "weekly-avatar-chest.js",
          "bytes": 19092,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "claimDailyQuestRewards",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "questProgress",
            "renderDailyQuests",
            "saveState",
            "showRewardBurst",
            "state",
            "todayKey"
          ],
          "window": {
            "provides": [
              "__salitaQuestWeeklyAvatarChestInstalled"
            ],
            "consumes": [
              "crypto"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [
              "questChest",
              "shareWeeklyAvatarBtn",
              "weeklyAvatarImage",
              "weeklyAvatarModal",
              "weeklyAvatarPreview",
              "weeklyAvatarTitle",
              "weeklyAvatarWeek"
            ],
            "selectors": [
              ".weekly-avatar-close",
              "[data-weekly-chest-action]",
              "[data-weekly-modal-close]"
            ],
            "datasets": [
              "course",
              "weeklyChestAction"
            ]
          },
          "events": {
            "listens": [
              "click",
              "keydown"
            ],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 40
        },
        {
          "file": "weekly-avatar-polish.js",
          "bytes": 15558,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "claimDailyQuestRewards",
            "currentView",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "renderDailyQuests",
            "saveState",
            "state",
            "switchView"
          ],
          "window": {
            "provides": [
              "__salitaQuestWeeklyAvatarPolishInstalled"
            ],
            "consumes": [
              "AudioContext",
              "webkitAudioContext"
            ]
          },
          "storage": [],
          "dom": {
            "ids": [
              "homeView",
              "questChest",
              "questChestStatus",
              "questChestText",
              "questChestTitle"
            ],
            "selectors": [
              ".daily-key-celebration",
              ".daily-key-spark-field",
              ".daily-quests-card .quest-card-header h3",
              ".quest-chest",
              ".weekly-key-meter"
            ],
            "datasets": [
              "currentView"
            ]
          },
          "events": {
            "listens": [],
            "dispatches": []
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 38
        },
        {
          "file": "weekly-avatar-shard-rewards-v1.js",
          "bytes": 24374,
          "contexts": [
            "cebuano",
            "tagalog"
          ],
          "courses": [
            "cebuano",
            "tagalog"
          ],
          "references": [],
          "loads": [],
          "fetches": [],
          "workers": [],
          "coreGlobals": [
            "claimDailyQuestRewards",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "questProgress",
            "renderDailyQuests",
            "saveState",
            "showRewardBurst",
            "state",
            "todayKey"
          ],
          "window": {
            "provides": [
              "__salitaQuestWeeklyAvatarShardsV1Installed",
              "SalitaWeeklyAvatarRewards"
            ],
            "consumes": [
              "SalitaAvatarModel"
            ]
          },
          "storage": [
            {
              "store": "localStorage",
              "operation": "getItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "localStorage",
              "operation": "setItem",
              "key": "salitaQuestLocalProfilesV1"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            },
            {
              "store": "sessionStorage",
              "operation": "getItem",
              "key": "salitaQuestActiveProfileId"
            }
          ],
          "dom": {
            "ids": [
              "questChest"
            ],
            "selectors": [
              ".weekly-avatar-close",
              "[data-open-avatar-collection]",
              "[data-weekly-avatar-target]",
              "[data-weekly-rarity-filter]",
              "[data-weekly-shard-action]",
              "[data-weekly-shard-close]",
              "#weeklyAvatarShardContent",
              "link[data-weekly-avatar-shards]"
            ],
            "datasets": [
              "weeklyAvatarShards",
              "weeklyAvatarTarget",
              "weeklyRarityFilter",
              "weeklyShardAction"
            ]
          },
          "events": {
            "listens": [
              "click",
              "keydown",
              "salita:avatar-collection-changed",
              "salita:avatar-equipped"
            ],
            "dispatches": [
              "salita:avatar-collection-changed",
              "salita:open-avatar-collection",
              "salita:weekly-key-earned"
            ]
          },
          "role": "collection-and-rewards",
          "readiness": "prepare-adapter",
          "risk": 52
        }
      ],
      "edges": [
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "src/features/sharing/facebook-share-link-v1.js",
          "type": "loads"
        },
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "achievement-sharing-avatar-bridge-v1.js",
          "to": "achievement-sharing-v4.js",
          "type": "window-api",
          "symbols": [
            "SalitaQuestAchievementSharing"
          ]
        },
        {
          "from": "achievement-sharing-router-v2.js",
          "to": "src/features/sharing/achievement-sharing-router-v3.js",
          "type": "loads"
        },
        {
          "from": "achievement-sharing-router-v2.js",
          "to": "src/features/sharing/achievement-sharing-router-v3.js",
          "type": "window-api",
          "symbols": [
            "__salitaQuestAchievementSharingRouterV3Installed"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "BADGES",
            "levelInfo",
            "state",
            "toast"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarAssets"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "level-progression-v2.js",
          "type": "window-api",
          "symbols": [
            "SalitaLevelProgression"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "avatar-case-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaQuestAvatarCase"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "badge-chest-v2.js",
          "type": "window-api",
          "symbols": [
            "SalitaQuestBadgeChest"
          ]
        },
        {
          "from": "achievement-sharing-v4.js",
          "to": "social-connections-v2.js",
          "type": "window-api",
          "symbols": [
            "SalitaQuestSocialConnections"
          ]
        },
        {
          "from": "adaptive-scenarios.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentExercise",
            "escapeHTML",
            "finishSession",
            "ITEMS",
            "loadBossExercise",
            "MODULES",
            "renderExercise",
            "saveState",
            "selectedChoice",
            "session",
            "state",
            "switchView",
            "toast",
            "updateBoss"
          ]
        },
        {
          "from": "app.js",
          "to": "service-worker.js",
          "type": "registers-worker"
        },
        {
          "from": "avatar-case-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "avatar-case-v1.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "avatar-case-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "avatar-case-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "avatar-case-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "avatar-collection-screen-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "avatar-collection-screen-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "avatar-collection-screen-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "avatar-progression-hotfix-v551.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "closeMobileMenu",
            "pictogram",
            "renderBadges",
            "state",
            "switchView"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "levelInfo"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarAssets"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "avatar-collection-screen-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarCollectionScreen"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "src/features/avatar/level-avatar-rewards-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaLevelAvatarRewards"
          ]
        },
        {
          "from": "avatar-unlock-celebration-v1.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaPopupGovernor"
          ]
        },
        {
          "from": "badge-catalogue-v2.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "badgeArt",
            "BADGES",
            "bossReady",
            "currentView",
            "levelInfo",
            "recordDailyAnswer",
            "recordDailySession",
            "renderBadges",
            "saveState",
            "session",
            "state",
            "switchView",
            "totalLearningPoints"
          ]
        },
        {
          "from": "badge-chest-v2.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "badgeArt",
            "BADGES",
            "saveState",
            "state",
            "toast"
          ]
        },
        {
          "from": "bisaya-app-loader.js",
          "to": "exercise-fixes-v545.js",
          "type": "loads"
        },
        {
          "from": "bisaya-app-loader.js",
          "to": "profile-app.js",
          "type": "loads"
        },
        {
          "from": "bisaya-app-loader.js",
          "to": "app.js",
          "type": "fetches-script-source"
        },
        {
          "from": "bisaya-app-loader.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "accepted",
            "activeAudio",
            "countMasteredInModule",
            "handsFreeReview",
            "state"
          ]
        },
        {
          "from": "bisaya-review-regions.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "attachWorldMapEvents",
            "BADGES",
            "beginQueueSession",
            "BOSS_ITEMS",
            "bossReady",
            "buildHandsFreeQueue",
            "buildWorldMap",
            "currentExercise",
            "finishSession",
            "handsFreeActiveItems",
            "handsFreeReview",
            "isModuleUnlocked",
            "loadBossExercise",
            "MODULE_META",
            "MODULES",
            "moduleStats",
            "pictogram",
            "practisedItems",
            "renderExercise",
            "renderHandsFreeReview",
            "renderSkillTree",
            "reviewPool",
            "saveState",
            "selectedChoice",
            "session",
            "startModuleSession",
            "state",
            "switchView",
            "toast",
            "unlockedModules",
            "updateAll",
            "updateBoss"
          ]
        },
        {
          "from": "coin-avatar-shard-shop-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "loads"
        },
        {
          "from": "coin-avatar-shard-shop-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "updateGlobalUI"
          ]
        },
        {
          "from": "coin-avatar-shard-shop-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "coin-avatar-shard-shop-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "coin-avatar-shop-badges-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "BADGES"
          ]
        },
        {
          "from": "coin-avatar-shop-badges-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "coin-avatar-shop-badges-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "coin-avatar-shop-reveal-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "updateGlobalUI"
          ]
        },
        {
          "from": "coin-avatar-shop-reveal-v1.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "coin-avatar-shop-topbar-v1.js",
          "to": "coin-testing-grant-100k-v1.js",
          "type": "loads"
        },
        {
          "from": "coin-avatar-shop-topbar-v1.js",
          "to": "coin-testing-grant-50k-phase5-v1.js",
          "type": "loads"
        },
        {
          "from": "coin-avatar-shop-topbar-v1.js",
          "to": "src/features/avatar/avatar-collection-summary-v1.js",
          "type": "loads"
        },
        {
          "from": "coin-avatar-shop-topbar-v1.js",
          "to": "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
          "type": "loads"
        },
        {
          "from": "coin-avatar-shop-topbar-v1.js",
          "to": "src/features/economy/economy-tracking-phase6-v1.js",
          "type": "loads"
        },
        {
          "from": "coin-testing-grant-100k-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "saveState",
            "updateGlobalUI"
          ]
        },
        {
          "from": "coin-testing-grant-50k-phase5-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "saveState",
            "updateGlobalUI"
          ]
        },
        {
          "from": "daily-goal-refinement.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "claimDailyQuestRewards",
            "currentExercise",
            "DAILY_QUESTS",
            "DEFAULT_STATE",
            "ensureDailyActivity",
            "finishSession",
            "questProgress",
            "recordDailyAnswer",
            "renderDailyQuests",
            "saveState",
            "session",
            "showRewardBurst",
            "state",
            "updateAll",
            "updateGlobalUI"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "closeMobileMenu",
            "currentView",
            "pictogram",
            "renderBadges",
            "state",
            "switchView"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "getAvatarImagePath"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "desktop-navigation-refinement.js",
          "to": "coin-avatar-shard-shop-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaCoinAvatarShop"
          ]
        },
        {
          "from": "exercise-fixes-v545.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "buildChoices",
            "buildSentenceOptions",
            "capitaliseFirst",
            "currentExercise",
            "escapeHTML",
            "generateVerbExercise",
            "ITEMS",
            "lockSentenceBuilder",
            "removeSelectedWord",
            "renderFeedback",
            "selectBuilderWord",
            "sentenceBuilderState",
            "sentenceTokens",
            "unlockStructureBox",
            "updateSentenceBuilderUI"
          ]
        },
        {
          "from": "incorrect-order-feedback.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentExercise",
            "renderFeedback",
            "renderSentenceBuilder",
            "sentenceBuilderState",
            "state",
            "updateSentenceBuilderUI"
          ]
        },
        {
          "from": "key-run-refinement.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "claimDailyQuestRewards",
            "currentView",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "renderDailyQuests",
            "saveState",
            "showRewardBurst",
            "state",
            "switchView",
            "todayKey"
          ]
        },
        {
          "from": "lesson-side-launcher.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentExercise",
            "finishSession",
            "renderExercise",
            "renderFeedback",
            "saveState",
            "sentenceBuilderState",
            "session",
            "startSession",
            "state",
            "switchView"
          ]
        },
        {
          "from": "level-progression-v2.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentView",
            "levelInfo",
            "saveState",
            "state",
            "switchView",
            "updateGlobalUI"
          ]
        },
        {
          "from": "level-progression-v2.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaPopupGovernor"
          ]
        },
        {
          "from": "long-term-badges-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "BADGES",
            "levelInfo",
            "state",
            "totalLearningPoints"
          ]
        },
        {
          "from": "long-term-badges-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "long-term-badges-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "mastery-feedback.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentExercise",
            "getItemState",
            "recordExposure",
            "renderExercise",
            "renderFeedback",
            "session",
            "state",
            "updateSRS"
          ]
        },
        {
          "from": "mobile-session-refinement.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentExercise",
            "currentView",
            "finishSession",
            "getItemState",
            "openMobileMenu",
            "renderExercise",
            "renderFeedback",
            "renderMasteryRail",
            "session",
            "switchView"
          ]
        },
        {
          "from": "placement-onboarding-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "ITEMS",
            "MODULES",
            "newItems",
            "saveState",
            "state",
            "syncSettings",
            "toast",
            "totalLearningPoints",
            "unlockedModules",
            "updateAll"
          ]
        },
        {
          "from": "profile-app.js",
          "to": "bisaya-review-regions.js",
          "type": "loads"
        },
        {
          "from": "profile-app.js",
          "to": "src/features/avatar/avatar-catalogue-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-app.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "saveState",
            "state"
          ]
        },
        {
          "from": "profile-app.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "profile-app.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtworkReady"
          ]
        },
        {
          "from": "profile-app.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarHotfixReady"
          ]
        },
        {
          "from": "profile-app.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "profile-app.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "profile-emblem-control.js",
          "to": "achievement-sharing-avatar-bridge-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "achievement-sharing-router-v2.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "avatar-case-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "avatar-collection-screen-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "avatar-unlock-celebration-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "coin-avatar-shard-shop-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "coin-avatar-shop-badges-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "coin-avatar-shop-topbar-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "long-term-badges-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "src/features/avatar/avatar-catalogue-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "src/features/avatar/avatar-progression-migration-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "src/features/avatar/level-avatar-rewards-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "weekly-avatar-shard-rewards-v1.js",
          "type": "loads"
        },
        {
          "from": "profile-emblem-control.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtwork"
          ]
        },
        {
          "from": "profile-emblem-control.js",
          "to": "src/features/avatar/avatar-artwork-registry-v554.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarArtworkReady"
          ]
        },
        {
          "from": "profile-emblem-control.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarHotfixReady"
          ]
        },
        {
          "from": "profile-emblem-control.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "profile-emblem-control.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "progression-v54.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "isModuleUnlocked",
            "ITEMS",
            "MODULE_META",
            "moduleById",
            "MODULES",
            "renderMasteryRail",
            "state",
            "toast",
            "unlockedModules",
            "updateAll"
          ]
        },
        {
          "from": "service-worker.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "session"
          ]
        },
        {
          "from": "social-connections-v2.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "switchView"
          ]
        },
        {
          "from": "src/app/course-bootstrap.js",
          "to": "src/config/course-manifest.js",
          "type": "window-api",
          "symbols": [
            "SalitaQuestCourseManifest"
          ]
        },
        {
          "from": "src/config/course-manifest.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "session"
          ]
        },
        {
          "from": "src/features/audio/pronunciation-release-control.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "state",
            "toast"
          ]
        },
        {
          "from": "src/features/avatar/avatar-artwork-registry-v554.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/avatar-artwork-registry-v554.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/avatar-catalogue-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "state"
          ]
        },
        {
          "from": "src/features/avatar/avatar-collection-summary-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/avatar-collection-summary-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
          "to": "src/features/economy/economy-tracking-phase6-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaEconomyTrackingPhase6"
          ]
        },
        {
          "from": "src/features/avatar/avatar-progression-migration-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "state"
          ]
        },
        {
          "from": "src/features/avatar/avatar-progression-migration-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/avatar-progression-migration-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/level-avatar-rewards-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "levelInfo"
          ]
        },
        {
          "from": "src/features/avatar/level-avatar-rewards-v1.js",
          "to": "level-progression-v2.js",
          "type": "window-api",
          "symbols": [
            "__salitaQuestLevelProgressionV2Installed"
          ]
        },
        {
          "from": "src/features/avatar/level-avatar-rewards-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/avatar/level-avatar-rewards-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/interface/clean-topbar.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "renderMasteryRail",
            "totalLearningPoints"
          ]
        },
        {
          "from": "src/features/interface/collection-key-translation-hotfix.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "ITEMS",
            "state"
          ]
        },
        {
          "from": "src/features/interface/compact-desktop-layout.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "session"
          ]
        },
        {
          "from": "src/features/interface/level-up-mobile-safety-v552.js",
          "to": "level-progression-v2.js",
          "type": "window-api",
          "symbols": [
            "SalitaLevelProgression"
          ]
        },
        {
          "from": "src/features/interface/level-up-mobile-safety-v552.js",
          "to": "src/features/interface/popup-governor-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaPopupGovernor"
          ]
        },
        {
          "from": "src/features/interface/popup-governor-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentView",
            "state"
          ]
        },
        {
          "from": "src/features/interface/popup-governor-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/interface/popup-governor-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "src/features/progression/even-progress-rail.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "MODULES",
            "renderMasteryRail",
            "totalLearningPoints"
          ]
        },
        {
          "from": "src/features/progression/home-reward-coordinator.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentView",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "renderDailyQuests",
            "saveState",
            "state",
            "switchView",
            "todayKey"
          ]
        },
        {
          "from": "ui-quality-fixes.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "currentExercise",
            "DAILY_QUESTS",
            "DEFAULT_STATE",
            "ensureDailyActivity",
            "escapeHTML",
            "finishSession",
            "ITEMS",
            "renderDailyQuests",
            "renderFeedback",
            "session",
            "showAnswerPop",
            "state",
            "updateAll"
          ]
        },
        {
          "from": "weekly-avatar-chest.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "claimDailyQuestRewards",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "questProgress",
            "renderDailyQuests",
            "saveState",
            "showRewardBurst",
            "state",
            "todayKey"
          ]
        },
        {
          "from": "weekly-avatar-polish.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "claimDailyQuestRewards",
            "currentView",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "renderDailyQuests",
            "saveState",
            "state",
            "switchView"
          ]
        },
        {
          "from": "weekly-avatar-shard-rewards-v1.js",
          "to": "app.js",
          "type": "core-globals",
          "symbols": [
            "claimDailyQuestRewards",
            "DAILY_QUESTS",
            "ensureDailyActivity",
            "questProgress",
            "renderDailyQuests",
            "saveState",
            "showRewardBurst",
            "state",
            "todayKey"
          ]
        },
        {
          "from": "weekly-avatar-shard-rewards-v1.js",
          "to": "avatar-progression-hotfix-v551.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        },
        {
          "from": "weekly-avatar-shard-rewards-v1.js",
          "to": "coin-avatar-shop-reveal-v1.js",
          "type": "window-api",
          "symbols": [
            "SalitaAvatarModel"
          ]
        }
      ],
      "storage": [
        {
          "store": "localStorage",
          "key": "${PROFILE_PROGRESS_PREFIX}${activeId}",
          "readers": [
            "profile-app.js"
          ],
          "writers": [
            "profile-app.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "${PROFILE_PROGRESS_PREFIX}${activeId}.${COURSE}",
          "readers": [],
          "writers": [
            "profile-app.js"
          ],
          "removers": [
            "profile-app.js"
          ]
        },
        {
          "store": "localStorage",
          "key": "${PROFILE_PROGRESS_PREFIX}${activeId}.${nextCourse}",
          "readers": [
            "profile-app.js"
          ],
          "writers": [],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "${STORAGE_KEY}.beforeImport",
          "readers": [],
          "writers": [
            "app.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "${storage.profileProgressPrefix}${activeId}",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "${storage.profileProgressPrefix}${activeId}.${course.id}",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "${storage.profileProgressPrefix}${profileId}",
          "readers": [],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "${storage.profileProgressPrefix}${profileId}.${courseId}",
          "readers": [],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "course.documentCache",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "key",
          "readers": [
            "app.js",
            "coin-avatar-shop-reveal-v1.js",
            "coin-testing-grant-100k-v1.js",
            "coin-testing-grant-50k-phase5-v1.js"
          ],
          "writers": [
            "coin-avatar-shop-reveal-v1.js",
            "coin-testing-grant-100k-v1.js",
            "coin-testing-grant-50k-phase5-v1.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "salitaQuestBaseProgressOwner",
          "readers": [],
          "writers": [
            "profile-app.js"
          ],
          "removers": [
            "profile-app.js"
          ]
        },
        {
          "store": "localStorage",
          "key": "salitaQuestLocalProfilesV1",
          "readers": [
            "achievement-sharing-avatar-bridge-v1.js",
            "achievement-sharing-v4.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-unlock-celebration-v1.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-badges-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "desktop-navigation-refinement.js",
            "long-term-badges-v1.js",
            "profile-app.js",
            "social-connections-v2.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/avatar/avatar-collection-summary-v1.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "writers": [
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-unlock-celebration-v1.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "profile-app.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "salitaQuestProgress",
          "readers": [
            "profile-app.js"
          ],
          "writers": [
            "app.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "coin-testing-grant-100k-v1.js",
            "coin-testing-grant-50k-phase5-v1.js",
            "profile-app.js"
          ],
          "removers": [
            "profile-app.js"
          ]
        },
        {
          "store": "localStorage",
          "key": "salitaQuestSocialApiBase",
          "readers": [
            "social-connections-v2.js"
          ],
          "writers": [
            "social-connections-v2.js"
          ],
          "removers": [
            "social-connections-v2.js"
          ]
        },
        {
          "store": "localStorage",
          "key": "storage.baseOwner",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": []
        },
        {
          "store": "localStorage",
          "key": "storage.baseProgress",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": [
            "src/app/course-bootstrap.js"
          ]
        },
        {
          "store": "localStorage",
          "key": "storage.profileStore",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [],
          "removers": []
        },
        {
          "store": "sessionStorage",
          "key": "salitaQuestActiveCourse",
          "readers": [
            "level-progression-v2.js",
            "profile-app.js",
            "src/features/avatar/level-avatar-rewards-v1.js"
          ],
          "writers": [
            "profile-app.js"
          ],
          "removers": [
            "profile-app.js"
          ]
        },
        {
          "store": "sessionStorage",
          "key": "salitaQuestActiveProfileId",
          "readers": [
            "achievement-sharing-avatar-bridge-v1.js",
            "achievement-sharing-v4.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-unlock-celebration-v1.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-badges-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "desktop-navigation-refinement.js",
            "level-progression-v2.js",
            "long-term-badges-v1.js",
            "profile-app.js",
            "social-connections-v2.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/avatar/avatar-collection-summary-v1.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "writers": [],
          "removers": [
            "profile-app.js"
          ]
        },
        {
          "store": "sessionStorage",
          "key": "storage.activeCourse",
          "readers": [],
          "writers": [
            "src/app/course-bootstrap.js"
          ],
          "removers": []
        },
        {
          "store": "sessionStorage",
          "key": "storage.activeProfile",
          "readers": [
            "src/app/course-bootstrap.js"
          ],
          "writers": [],
          "removers": []
        }
      ],
      "events": [
        {
          "name": "activate",
          "listeners": [
            "service-worker.js"
          ],
          "dispatchers": []
        },
        {
          "name": "beforeinstallprompt",
          "listeners": [
            "app.js"
          ],
          "dispatchers": []
        },
        {
          "name": "beforeunload",
          "listeners": [
            "profile-app.js"
          ],
          "dispatchers": []
        },
        {
          "name": "change",
          "listeners": [
            "app.js",
            "badge-chest-v2.js",
            "placement-onboarding-v1.js"
          ],
          "dispatchers": []
        },
        {
          "name": "click",
          "listeners": [
            "achievement-sharing-v4.js",
            "adaptive-scenarios.js",
            "app.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-progression-hotfix-v551.js",
            "avatar-unlock-celebration-v1.js",
            "badge-chest-v2.js",
            "bisaya-review-regions.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "desktop-navigation-refinement.js",
            "exercise-fixes-v545.js",
            "key-run-refinement.js",
            "lesson-side-launcher.js",
            "mobile-session-refinement.js",
            "placement-onboarding-v1.js",
            "profile-app.js",
            "profile-emblem-control.js",
            "progression-v54.js",
            "social-connections-v2.js",
            "src/features/audio/pronunciation-release-control.js",
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js",
            "src/features/sharing/achievement-sharing-router-v3.js",
            "weekly-avatar-chest.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "dispatchers": []
        },
        {
          "name": "DOMContentLoaded",
          "listeners": [
            "profile-app.js",
            "src/features/interface/collection-key-translation-hotfix.js"
          ],
          "dispatchers": []
        },
        {
          "name": "error",
          "listeners": [
            "avatar-unlock-celebration-v1.js",
            "badge-catalogue-v2.js",
            "badge-chest-v2.js",
            "level-progression-v2.js",
            "profile-app.js",
            "profile-emblem-control.js"
          ],
          "dispatchers": []
        },
        {
          "name": "fetch",
          "listeners": [
            "service-worker.js"
          ],
          "dispatchers": []
        },
        {
          "name": "input",
          "listeners": [
            "app.js"
          ],
          "dispatchers": []
        },
        {
          "name": "install",
          "listeners": [
            "service-worker.js"
          ],
          "dispatchers": []
        },
        {
          "name": "keydown",
          "listeners": [
            "achievement-sharing-v4.js",
            "app.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-unlock-celebration-v1.js",
            "badge-chest-v2.js",
            "profile-app.js",
            "profile-emblem-control.js",
            "weekly-avatar-chest.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "dispatchers": []
        },
        {
          "name": "load",
          "listeners": [
            "avatar-unlock-celebration-v1.js",
            "badge-catalogue-v2.js",
            "badge-chest-v2.js",
            "profile-app.js",
            "profile-emblem-control.js"
          ],
          "dispatchers": []
        },
        {
          "name": "message",
          "listeners": [
            "social-connections-v2.js"
          ],
          "dispatchers": []
        },
        {
          "name": "pagehide",
          "listeners": [
            "profile-app.js"
          ],
          "dispatchers": []
        },
        {
          "name": "pageshow",
          "listeners": [
            "src/features/interface/level-up-mobile-safety-v552.js",
            "src/features/interface/popup-governor-v1.js",
            "src/features/progression/home-reward-coordinator.js"
          ],
          "dispatchers": []
        },
        {
          "name": "pointerdown",
          "listeners": [
            "src/features/audio/pronunciation-release-control.js"
          ],
          "dispatchers": []
        },
        {
          "name": "pointerup",
          "listeners": [
            "src/features/audio/pronunciation-release-control.js"
          ],
          "dispatchers": []
        },
        {
          "name": "resize",
          "listeners": [
            "lesson-side-launcher.js",
            "mobile-session-refinement.js",
            "profile-emblem-control.js",
            "src/features/interface/compact-desktop-layout.js",
            "src/features/progression/even-progress-rail.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:achievement-share-closed",
          "listeners": [
            "src/features/sharing/achievement-sharing-router-v3.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:achievement-share-prepared",
          "listeners": [
            "src/features/sharing/achievement-sharing-router-v3.js"
          ],
          "dispatchers": [
            "achievement-sharing-v4.js"
          ]
        },
        {
          "name": "salita:avatar-case-changed",
          "listeners": [],
          "dispatchers": [
            "avatar-case-v1.js"
          ]
        },
        {
          "name": "salita:avatar-case-ready",
          "listeners": [],
          "dispatchers": [
            "avatar-case-v1.js"
          ]
        },
        {
          "name": "salita:avatar-collection-changed",
          "listeners": [
            "achievement-sharing-avatar-bridge-v1.js",
            "achievement-sharing-v4.js",
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "avatar-unlock-celebration-v1.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/avatar/avatar-collection-summary-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "dispatchers": [
            "avatar-collection-screen-v1.js",
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "src/features/avatar/level-avatar-rewards-v1.js",
            "weekly-avatar-shard-rewards-v1.js"
          ]
        },
        {
          "name": "salita:avatar-collection-tabs-ready",
          "listeners": [],
          "dispatchers": [
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js"
          ]
        },
        {
          "name": "salita:avatar-equipped",
          "listeners": [
            "desktop-navigation-refinement.js",
            "profile-emblem-control.js",
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "weekly-avatar-shard-rewards-v1.js"
          ],
          "dispatchers": [
            "avatar-collection-screen-v1.js",
            "profile-app.js"
          ]
        },
        {
          "name": "salita:avatar-milestones-awarded",
          "listeners": [
            "avatar-unlock-celebration-v1.js"
          ],
          "dispatchers": [
            "src/features/avatar/level-avatar-rewards-v1.js"
          ]
        },
        {
          "name": "salita:avatar-milestones-repaired",
          "listeners": [],
          "dispatchers": [
            "src/features/avatar/level-avatar-rewards-v1.js"
          ]
        },
        {
          "name": "salita:avatar-model-hotfixed",
          "listeners": [],
          "dispatchers": [
            "avatar-progression-hotfix-v551.js"
          ]
        },
        {
          "name": "salita:avatar-progression-migrated",
          "listeners": [],
          "dispatchers": [
            "src/features/avatar/avatar-progression-migration-v1.js"
          ]
        },
        {
          "name": "salita:avatar-progression-ready",
          "listeners": [
            "avatar-case-v1.js",
            "desktop-navigation-refinement.js",
            "src/features/avatar/avatar-collection-summary-v1.js"
          ],
          "dispatchers": [
            "profile-emblem-control.js"
          ]
        },
        {
          "name": "salita:avatar-random-pools-ready",
          "listeners": [
            "src/features/avatar/avatar-collection-summary-v1.js"
          ],
          "dispatchers": [
            "coin-avatar-shop-reveal-v1.js"
          ]
        },
        {
          "name": "salita:avatar-sharing-bridge-ready",
          "listeners": [],
          "dispatchers": [
            "achievement-sharing-avatar-bridge-v1.js"
          ]
        },
        {
          "name": "salita:avatar-unlock-acknowledged",
          "listeners": [],
          "dispatchers": [
            "avatar-unlock-celebration-v1.js"
          ]
        },
        {
          "name": "salita:avatar-unlock-animation-finished",
          "listeners": [],
          "dispatchers": [
            "avatar-unlock-celebration-v1.js"
          ]
        },
        {
          "name": "salita:avatar-unlock-animation-started",
          "listeners": [
            "achievement-sharing-v4.js"
          ],
          "dispatchers": [
            "avatar-unlock-celebration-v1.js"
          ]
        },
        {
          "name": "salita:badges-rendered",
          "listeners": [],
          "dispatchers": [
            "badge-catalogue-v2.js"
          ]
        },
        {
          "name": "salita:coin-avatar-shop-ready",
          "listeners": [],
          "dispatchers": [
            "coin-avatar-shard-shop-v1.js"
          ]
        },
        {
          "name": "salita:coin-balance-changed",
          "listeners": [],
          "dispatchers": [
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-reveal-v1.js",
            "coin-testing-grant-100k-v1.js",
            "coin-testing-grant-50k-phase5-v1.js"
          ]
        },
        {
          "name": "salita:coin-shard-pack-purchased",
          "listeners": [
            "coin-avatar-shop-reveal-v1.js",
            "coin-avatar-shop-topbar-v1.js"
          ],
          "dispatchers": [
            "coin-avatar-shard-shop-v1.js",
            "coin-avatar-shop-reveal-v1.js"
          ]
        },
        {
          "name": "salita:coin-shop-badges-ready",
          "listeners": [],
          "dispatchers": [
            "coin-avatar-shop-badges-v1.js"
          ]
        },
        {
          "name": "salita:course-progress-restored",
          "listeners": [
            "src/features/avatar/level-avatar-rewards-v1.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:daily-quests-rendered",
          "listeners": [
            "src/features/interface/collection-key-translation-hotfix.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:economy-tracking-ready",
          "listeners": [],
          "dispatchers": [
            "src/features/economy/economy-tracking-phase6-v1.js"
          ]
        },
        {
          "name": "salita:economy-v2-phase1-ready",
          "listeners": [],
          "dispatchers": [
            "daily-goal-refinement.js"
          ]
        },
        {
          "name": "salita:level-progression-saved",
          "listeners": [],
          "dispatchers": [
            "level-progression-v2.js"
          ]
        },
        {
          "name": "salita:level-updated",
          "listeners": [
            "achievement-sharing-v4.js",
            "src/features/avatar/level-avatar-rewards-v1.js"
          ],
          "dispatchers": [
            "level-progression-v2.js"
          ]
        },
        {
          "name": "salita:long-term-badges-ready",
          "listeners": [],
          "dispatchers": [
            "long-term-badges-v1.js"
          ]
        },
        {
          "name": "salita:open-avatar-collection",
          "listeners": [
            "avatar-case-v1.js",
            "avatar-collection-screen-v1.js",
            "src/features/avatar/avatar-collection-summary-v1.js"
          ],
          "dispatchers": [
            "avatar-progression-hotfix-v551.js",
            "avatar-unlock-celebration-v1.js",
            "desktop-navigation-refinement.js",
            "weekly-avatar-shard-rewards-v1.js"
          ]
        },
        {
          "name": "salita:placement-finished",
          "listeners": [
            "src/features/avatar/level-avatar-rewards-v1.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:popup-finished",
          "listeners": [
            "achievement-sharing-v4.js",
            "avatar-unlock-celebration-v1.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:shop-opened",
          "listeners": [],
          "dispatchers": [
            "desktop-navigation-refinement.js"
          ]
        },
        {
          "name": "salita:state-changed",
          "listeners": [
            "src/features/interface/collection-key-translation-hotfix.js"
          ],
          "dispatchers": []
        },
        {
          "name": "salita:view-changed",
          "listeners": [
            "achievement-sharing-v4.js"
          ],
          "dispatchers": [
            "desktop-navigation-refinement.js",
            "level-progression-v2.js"
          ]
        },
        {
          "name": "salita:weekly-key-earned",
          "listeners": [],
          "dispatchers": [
            "weekly-avatar-shard-rewards-v1.js"
          ]
        },
        {
          "name": "unload",
          "listeners": [
            "profile-app.js"
          ],
          "dispatchers": []
        },
        {
          "name": "visibilitychange",
          "listeners": [
            "avatar-unlock-celebration-v1.js",
            "profile-app.js",
            "src/features/interface/level-up-mobile-safety-v552.js",
            "src/features/progression/home-reward-coordinator.js"
          ],
          "dispatchers": []
        }
      ],
      "windowApis": [
        {
          "symbol": "__salitaAvatarArtworkRegistryV556Installed",
          "providers": [
            "src/features/avatar/avatar-artwork-registry-v554.js"
          ]
        },
        {
          "symbol": "__salitaAvatarCollectionScreenInstalled",
          "providers": [
            "avatar-collection-screen-v1.js"
          ]
        },
        {
          "symbol": "__salitaAvatarCollectionSummaryV1Installed",
          "providers": [
            "src/features/avatar/avatar-collection-summary-v1.js"
          ]
        },
        {
          "symbol": "__salitaAvatarCollectionTabsPhase63Installed",
          "providers": [
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js"
          ]
        },
        {
          "symbol": "__salitaCoinAvatarRevealV1Installed",
          "providers": [
            "coin-avatar-shop-reveal-v1.js"
          ]
        },
        {
          "symbol": "__salitaCoinAvatarShardShopV1Installed",
          "providers": [
            "coin-avatar-shard-shop-v1.js"
          ]
        },
        {
          "symbol": "__salitaCoinAvatarShopBadgesV1Installed",
          "providers": [
            "coin-avatar-shop-badges-v1.js"
          ]
        },
        {
          "symbol": "__salitaCoinAvatarShopTopbarV1Installed",
          "providers": [
            "coin-avatar-shop-topbar-v1.js"
          ]
        },
        {
          "symbol": "__salitaCoinTestingGrant100kV1Installed",
          "providers": [
            "coin-testing-grant-100k-v1.js"
          ]
        },
        {
          "symbol": "__salitaCoinTestingGrant50kPhase5V1Installed",
          "providers": [
            "coin-testing-grant-50k-phase5-v1.js"
          ]
        },
        {
          "symbol": "__salitaEconomyTrackingPhase6V2Installed",
          "providers": [
            "src/features/economy/economy-tracking-phase6-v1.js"
          ]
        },
        {
          "symbol": "__salitaFacebookShareLinkV1Installed",
          "providers": [
            "src/features/sharing/facebook-share-link-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestAchievementSharingAvatarCompatibilityV558Installed",
          "providers": [
            "achievement-sharing-avatar-bridge-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestAchievementSharingRouterV3Installed",
          "providers": [
            "src/features/sharing/achievement-sharing-router-v3.js"
          ]
        },
        {
          "symbol": "__salitaQuestAchievementSharingV4Installed",
          "providers": [
            "achievement-sharing-v4.js"
          ]
        },
        {
          "symbol": "__salitaQuestAchievementSharingV6Installed",
          "providers": [
            "achievement-sharing-v4.js"
          ]
        },
        {
          "symbol": "__salitaQuestAdaptiveScenariosInstalled",
          "providers": [
            "adaptive-scenarios.js"
          ]
        },
        {
          "symbol": "__salitaQuestAvatarCaseV1Installed",
          "providers": [
            "avatar-case-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestAvatarUnlockCelebrationV3Installed",
          "providers": [
            "avatar-unlock-celebration-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestBadgeCatalogueV2Installed",
          "providers": [
            "badge-catalogue-v2.js"
          ]
        },
        {
          "symbol": "__salitaQuestBadgeChestV2Installed",
          "providers": [
            "badge-chest-v2.js"
          ]
        },
        {
          "symbol": "__salitaQuestCleanTopbarInstalled",
          "providers": [
            "src/features/interface/clean-topbar.js"
          ]
        },
        {
          "symbol": "__salitaQuestCollectionKeyTranslationHotfixV2",
          "providers": [
            "src/features/interface/collection-key-translation-hotfix.js"
          ]
        },
        {
          "symbol": "__salitaQuestCollectionsNavigationV551Installed",
          "providers": [
            "avatar-progression-hotfix-v551.js"
          ]
        },
        {
          "symbol": "__salitaQuestCompactDesktopInstalled",
          "providers": [
            "src/features/interface/compact-desktop-layout.js"
          ]
        },
        {
          "symbol": "__salitaQuestDailyGoalRefinementInstalled",
          "providers": [
            "daily-goal-refinement.js"
          ]
        },
        {
          "symbol": "__salitaQuestEvenProgressRailInstalled",
          "providers": [
            "src/features/progression/even-progress-rail.js"
          ]
        },
        {
          "symbol": "__salitaQuestHomeRewardCoordinatorInstalled",
          "providers": [
            "src/features/progression/home-reward-coordinator.js"
          ]
        },
        {
          "symbol": "__salitaQuestIncorrectOrderFeedbackInstalled",
          "providers": [
            "incorrect-order-feedback.js"
          ]
        },
        {
          "symbol": "__salitaQuestKeyRunRefinementInstalled",
          "providers": [
            "key-run-refinement.js"
          ]
        },
        {
          "symbol": "__salitaQuestLessonSideLauncherInstalled",
          "providers": [
            "lesson-side-launcher.js"
          ]
        },
        {
          "symbol": "__salitaQuestLevelAvatarRewardsV3Installed",
          "providers": [
            "src/features/avatar/level-avatar-rewards-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestLevelProgressionV2Installed",
          "providers": [
            "level-progression-v2.js"
          ]
        },
        {
          "symbol": "__salitaQuestLevelUpMobileSafetyV552Installed",
          "providers": [
            "src/features/interface/level-up-mobile-safety-v552.js"
          ]
        },
        {
          "symbol": "__salitaQuestLongTermBadgesV1Installed",
          "providers": [
            "long-term-badges-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestMasteryFeedbackInstalled",
          "providers": [
            "mastery-feedback.js"
          ]
        },
        {
          "symbol": "__salitaQuestMobileSessionRefinementInstalled",
          "providers": [
            "mobile-session-refinement.js"
          ]
        },
        {
          "symbol": "__salitaQuestPersistentNavigationV1Installed",
          "providers": [
            "desktop-navigation-refinement.js"
          ]
        },
        {
          "symbol": "__salitaQuestPlacementOnboardingV1Installed",
          "providers": [
            "placement-onboarding-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestPopupGovernorV1Installed",
          "providers": [
            "src/features/interface/popup-governor-v1.js"
          ]
        },
        {
          "symbol": "__salitaQuestProfileEmblemControlInstalled",
          "providers": [
            "profile-emblem-control.js"
          ]
        },
        {
          "symbol": "__salitaQuestPronunciationReleaseControlInstalled",
          "providers": [
            "src/features/audio/pronunciation-release-control.js"
          ]
        },
        {
          "symbol": "__salitaQuestQualityFixesInstalled",
          "providers": [
            "ui-quality-fixes.js"
          ]
        },
        {
          "symbol": "__salitaQuestSentenceBuilderInteractionRecoveryInstalled",
          "providers": [
            "exercise-fixes-v545.js"
          ]
        },
        {
          "symbol": "__salitaQuestSocialConnectionsV2Installed",
          "providers": [
            "social-connections-v2.js"
          ]
        },
        {
          "symbol": "__salitaQuestSocialConnectionsV3Installed",
          "providers": [
            "social-connections-v2.js"
          ]
        },
        {
          "symbol": "__salitaQuestWeeklyAvatarChestInstalled",
          "providers": [
            "weekly-avatar-chest.js"
          ]
        },
        {
          "symbol": "__salitaQuestWeeklyAvatarPolishInstalled",
          "providers": [
            "key-run-refinement.js",
            "weekly-avatar-polish.js"
          ]
        },
        {
          "symbol": "__salitaQuestWeeklyAvatarShardsV1Installed",
          "providers": [
            "weekly-avatar-shard-rewards-v1.js"
          ]
        },
        {
          "symbol": "getAvatarImagePath",
          "providers": [
            "src/features/avatar/avatar-artwork-registry-v554.js",
            "src/features/interface/popup-governor-v1.js"
          ]
        },
        {
          "symbol": "SalitaAchievementAvatarBridge",
          "providers": [
            "achievement-sharing-avatar-bridge-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarArtwork",
          "providers": [
            "src/features/avatar/avatar-artwork-registry-v554.js"
          ]
        },
        {
          "symbol": "SalitaAvatarArtworkReady",
          "providers": [
            "src/features/avatar/avatar-artwork-registry-v554.js"
          ]
        },
        {
          "symbol": "SalitaAvatarAssets",
          "providers": [
            "src/features/interface/popup-governor-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarCatalogue",
          "providers": [
            "avatar-progression-hotfix-v551.js",
            "coin-avatar-shop-reveal-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarCollectionScreen",
          "providers": [
            "avatar-collection-screen-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarCollectionSummary",
          "providers": [
            "src/features/avatar/avatar-collection-summary-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarCollectionTabsPhase61",
          "providers": [
            "src/features/avatar/avatar-collection-tabs-phase6-1-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarHotfixReady",
          "providers": [
            "avatar-progression-hotfix-v551.js"
          ]
        },
        {
          "symbol": "SalitaAvatarModel",
          "providers": [
            "avatar-progression-hotfix-v551.js",
            "coin-avatar-shop-reveal-v1.js"
          ]
        },
        {
          "symbol": "SalitaAvatarUnlockCelebration",
          "providers": [
            "avatar-unlock-celebration-v1.js"
          ]
        },
        {
          "symbol": "SalitaCoinAvatarShop",
          "providers": [
            "coin-avatar-shard-shop-v1.js"
          ]
        },
        {
          "symbol": "SalitaEconomyTrackingPhase6",
          "providers": [
            "src/features/economy/economy-tracking-phase6-v1.js"
          ]
        },
        {
          "symbol": "SalitaFacebookShareLink",
          "providers": [
            "src/features/sharing/facebook-share-link-v1.js"
          ]
        },
        {
          "symbol": "SalitaLevelAvatarRewards",
          "providers": [
            "src/features/avatar/level-avatar-rewards-v1.js"
          ]
        },
        {
          "symbol": "SalitaLevelProgression",
          "providers": [
            "level-progression-v2.js"
          ]
        },
        {
          "symbol": "SalitaLevelUpMobileSafety",
          "providers": [
            "src/features/interface/level-up-mobile-safety-v552.js"
          ]
        },
        {
          "symbol": "SalitaPopupGovernor",
          "providers": [
            "src/features/interface/popup-governor-v1.js"
          ]
        },
        {
          "symbol": "SalitaQuestAchievementSharing",
          "providers": [
            "achievement-sharing-v4.js"
          ]
        },
        {
          "symbol": "SalitaQuestAvatarCase",
          "providers": [
            "avatar-case-v1.js"
          ]
        },
        {
          "symbol": "SalitaQuestBadgeChest",
          "providers": [
            "badge-chest-v2.js"
          ]
        },
        {
          "symbol": "SalitaQuestCourseBootstrap",
          "providers": [
            "src/app/course-bootstrap.js"
          ]
        },
        {
          "symbol": "SalitaQuestCourseManifest",
          "providers": [
            "src/config/course-manifest.js"
          ]
        },
        {
          "symbol": "SalitaQuestPersistentNavigation",
          "providers": [
            "desktop-navigation-refinement.js"
          ]
        },
        {
          "symbol": "SalitaQuestSharingRouter",
          "providers": [
            "src/features/sharing/achievement-sharing-router-v3.js"
          ]
        },
        {
          "symbol": "SalitaQuestSocialConnections",
          "providers": [
            "social-connections-v2.js"
          ]
        },
        {
          "symbol": "salitaUnlockProgress",
          "providers": [
            "progression-v54.js"
          ]
        },
        {
          "symbol": "SalitaWeeklyAvatarRewards",
          "providers": [
            "weekly-avatar-shard-rewards-v1.js"
          ]
        }
      ]
    }
  }
]
```
