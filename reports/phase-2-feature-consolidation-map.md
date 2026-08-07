# Phase 2 — Feature consolidation map

This checkpoint groups the currently runtime-reachable root files by feature and defines one intended owner module per subsystem. It does not move or delete production code.

## Summary

The runtime is not large in terms of core logic, but it is fragmented across many root-level patches. The largest active groups are:

- Avatar, collection, case, shard, emblem, and avatar-reward behavior: 23 files.
- Layout, top bar, navigation, desktop/mobile refinements: 16 files.
- Progress, levels, Daily Goals, key runs, and reward coordination: 14 files.
- Sharing and social behavior: 9 files.
- Translation and answer feedback: 8 files.
- Badges: 5 files.
- Onboarding and installation prompts: 5 files.
- Bisaya bootstrapping and review regions: 4 files.

Several files belong to more than one feature because responsibilities are mixed. Those overlaps are a primary source of maintenance cost.

## Proposed canonical structure

```text
src/
  core/
    app.js
    profile.js
    storage.js
    navigation.js
  features/
    avatars/
      catalogue.js
      artwork.js
      inventory.js
      cases.js
      rewards.js
      celebrations.js
      profile-emblem.js
      styles.css
    badges/
      catalogue.js
      chest.js
      styles.css
    progress/
      levels.js
      world-progress.js
      daily-quests.js
      keys-and-rewards.js
      styles.css
    learning/
      exercises.js
      answer-feedback.js
      translations.js
      pronunciation.js
      mastery.js
      styles.css
    sharing/
      achievements.js
      router.js
      social.js
      styles.css
    onboarding/
      placement.js
      install-prompt.js
      popup-governor.js
      styles.css
    bisaya/
      loader.js
      review-regions.js
      styles.css
  ui/
    shell.js
    topbar.js
    responsive-layout.js
    lesson-launcher.js
    styles.css
```

The final file count does not have to match this exactly. The rule is one canonical owner for each responsibility, with no version-numbered production filenames.

## 1. Avatar system

### Currently active files

- `avatar-artwork-registry-v554.js`
- `avatar-catalogue-v1.js`
- `avatar-case-v1.js`
- `avatar-case-v1.css`
- `avatar-case-desktop-safety.css`
- `avatar-collection-screen-v1.js`
- `avatar-collection-screen-v1.css`
- `avatar-collection-page-v2.css`
- `avatar-progression-hotfix-v551.js`
- `avatar-progression-hotfix-v551.css`
- `avatar-progression-migration-v1.js`
- `avatar-unlock-celebration-v1.js`
- `avatar-unlock-celebration-v1.css`
- `level-avatar-rewards-v1.js`
- `profile-emblem-control.js`
- `profile-emblem-control.css`
- `weekly-avatar-chest.js`
- `weekly-avatar-chest.css`
- `weekly-avatar-polish.js`
- `weekly-avatar-shard-rewards-v1.js`
- `weekly-avatar-shard-rewards-v1.css`
- `achievement-sharing-avatar-bridge-v1.js`
- `collection-key-translation-hotfix.js`

### Intended ownership

- `catalogue.js`: avatar IDs, names, rarity, class, unlock metadata.
- `artwork.js`: asset registry and image resolution.
- `inventory.js`: ownership, shards, duplicate conversion, persistence.
- `cases.js`: case opening and weekly chest behavior.
- `rewards.js`: level and weekly avatar rewards.
- `celebrations.js`: unlock and level-up presentation.
- `profile-emblem.js`: selected avatar/emblem and profile rendering.

### Consolidation decisions

- Rarity and class must be properties in one catalogue, not separate repositories or independent implementations.
- `weekly-avatar-chest.js` and `weekly-avatar-shard-rewards-v1.js` should be merged into `cases.js` and `inventory.js`.
- `avatar-progression-hotfix-v551.js`, `avatar-progression-migration-v1.js`, and `level-avatar-rewards-v1.js` should be absorbed into `rewards.js`; migrations should be isolated and removable after compatibility is confirmed.
- `weekly-avatar-polish.js` and desktop safety CSS should become normal styles rather than permanent hotfix layers.
- `achievement-sharing-avatar-bridge-v1.js` belongs under sharing, not avatars.
- `collection-key-translation-hotfix.js` mixes collection and language concerns and should be split or removed after its exact behavior is identified.

This is the highest-priority consolidation family.

## 2. Progress, quests, keys, and rewards

### Currently active files

- `progression-v54.js`
- `level-progression-v2.js`
- `level-progression-v2.css`
- `level-up-mobile-safety-v552.js`
- `even-progress-rail.js`
- `world-progress-status.css`
- `topbar-world-progress-hotfix.css`
- `daily-goal-refinement.js`
- `home-reward-coordinator.js`
- `key-run-refinement.js`
- `level-avatar-rewards-v1.js`
- `avatar-progression-hotfix-v551.js`
- `avatar-progression-hotfix-v551.css`
- `avatar-progression-migration-v1.js`

### Intended ownership

- `levels.js`: XP, levels, threshold calculations, level-up events.
- `world-progress.js`: milestone model and desktop/mobile rendering.
- `daily-quests.js`: quest definitions, progress, completion, collapsed state, routing.
- `keys-and-rewards.js`: Daily Keys, key-run animation, reward coordination.

### Consolidation decisions

- `progression-v54.js` and `level-progression-v2.js` should not both remain canonical.
- World Progress spacing, status, and topbar fixes should become one renderer plus one style block.
- `home-reward-coordinator.js` should coordinate events only; it should not own quest, key, or avatar state.
- Avatar reward logic must call the avatar inventory API rather than patching progression directly.
- Mobile safety logic should be folded into the normal responsive implementation.

## 3. Layout and navigation

### Currently active files

- `clean-topbar.js`
- `clean-topbar.css`
- `desktop-navigation-refinement.js`
- `desktop-navigation-refinement.css`
- `compact-desktop-layout.js`
- `compact-desktop-layout.css`
- `compact-home-dashboard.css`
- `fluid-desktop-app.css`
- `mobile-session-refinement.js`
- `mobile-session-refinement.css`
- `lesson-side-launcher.js`
- `lesson-side-launcher.css`
- `profile-shell.css`
- `topbar-world-progress-hotfix.css`
- `avatar-case-desktop-safety.css`
- `badge-layout-v3.css`

### Intended ownership

- `shell.js`: application regions and view mounting.
- `navigation.js`: route/view selection and persistent navigation.
- `topbar.js`: top bar and World Progress container.
- `responsive-layout.js`: desktop/mobile behavior.
- `lesson-launcher.js`: lesson-side actions.

### Consolidation decisions

- Desktop, compact desktop, fluid desktop, and mobile refinement styles must be reconciled into one responsive stylesheet.
- Feature-specific layout overrides should live with the feature only when they cannot be expressed through shared layout primitives.
- `badge-layout-v3.css` and avatar desktop safety should not remain global patch layers.

## 4. Sharing and social

### Currently active files

- `achievement-sharing-v4.js`
- `achievement-sharing-v4.css`
- `achievement-sharing-router-v2.js`
- `achievement-sharing-router-v2.css`
- `achievement-sharing-router-v3.js`
- `achievement-sharing-avatar-bridge-v1.js`
- `facebook-share-link-v1.js`
- `social-connections-v2.js`
- `social-connections-v2.css`

### Intended ownership

- `achievements.js`: achievement preview and image generation.
- `router.js`: one current transport/router implementation.
- `social.js`: connections and platform-specific links.

### Consolidation decisions

- Router v2 and router v3 are both reachable. Only one should survive after behavior comparison.
- Facebook-specific behavior should be a small adapter called by `social.js`.
- Avatar rendering for shared achievements should use the canonical avatar artwork API.

## 5. Translation and answer feedback

### Currently active files

- `translation-gloss-completion-v1.js`
- `collection-key-translation-hotfix.js`
- `incorrect-order-feedback.js`
- `incorrect-order-feedback.css`
- `mastery-feedback.js`
- `mastery-feedback.css`
- `pronunciation-release-control.js`
- `ui-answer-breakdown.css`

Related shared files include `ui-quality-fixes.js`, `ui-quality-fixes.css`, and `mastery-console-overrides.css`.

### Intended ownership

- `translations.js`: source-token gloss resolution and direct-translation cards.
- `answer-feedback.js`: correctness, incorrect-order explanation, answer breakdown.
- `pronunciation.js`: pronunciation reveal and playback policy.
- `mastery.js`: mastery feedback and state presentation.

### Consolidation decisions

- The glossary resolver must be data-driven and independent of collection/key code.
- Single-word and multiword rendering rules should be enforced in one answer-feedback renderer.
- `ui-quality-fixes.js` must be decomposed; it appears to be a broad patch owner rather than a bounded feature.

## 6. Badges

### Currently active files

- `badge-catalogue-v2.js`
- `badge-catalogue-v2.css`
- `badge-chest-v2.js`
- `badge-chest-v2.css`
- `badge-layout-v3.css`

### Intended ownership

- `catalogue.js`: definitions and unlock conditions.
- `chest.js`: display and interaction.
- `styles.css`: catalogue and chest presentation.

This family is comparatively clean and should be consolidated after avatars and progress.

## 7. Exercises and learning modes

### Currently active files

- `adaptive-scenarios.js`
- `adaptive-scenarios.css`
- `exercise-fixes-v545.js`
- `mastery-feedback.js`
- `incorrect-order-feedback.js`
- `pronunciation-release-control.js`

### Intended ownership

- `exercises.js`: exercise controllers and sentence-builder interactions.
- Separate bounded modules for feedback, pronunciation, and mastery.

`exercise-fixes-v545.js` should be integrated into the core exercise controller once its recovery behavior is validated.

## 8. Onboarding and installation

### Currently active files

- `placement-onboarding-v1.js`
- `placement-onboarding-v1.css`
- `profile-install-prompt-v1.js`
- `profile-install-prompt-v1.css`
- `popup-governor-v1.js`

These can become three small modules without versioned filenames. This is a low-risk consolidation family.

## 9. Bisaya

### Currently active files

- `bisaya-app-loader.js`
- `bisaya-review-regions.js`
- `bisaya-review-regions.css`
- `bisaya.html`

The loader should remain distinct while both courses share the engine. Review-region code and styles can live under `features/bisaya/`. Course data should remain under `languages/cebuano/`.

## Migration order for TestSalita

1. Onboarding and installation prompts — small and isolated.
2. Badges — bounded and comparatively clean.
3. Sharing/social — resolve router v2 versus v3.
4. Translation and answer feedback — preserve the recent direct-translation fixes.
5. Progress, Daily Quests, keys, and rewards.
6. Avatar catalogue, inventory, cases, rewards, and celebrations.
7. Layout/navigation — last, because almost every feature depends on it.
8. Exercise controller and broad UI-quality patches.

Each family should be migrated in one branch and one testable commit sequence. Existing files should remain until the new owner module passes the relevant validators and smoke tests.

## Required regression checks per family

- No duplicate event listeners or animations.
- Saved profile and progression data remain compatible.
- Tagalog and Bisaya both load.
- Service-worker cache lists only current files.
- No old and new module are loaded simultaneously.
- Feature-specific validators are replaced by one maintained validator per canonical module.
- Browser console has no missing-file, duplicate-definition, or unhandled-promise errors.

## Phase 2 conclusion

The repository should not be consolidated into one giant file. It should be consolidated into a small number of feature-owned modules. The most important immediate target is the avatar family, but the safest first implementation target in TestSalita is onboarding or badges. This allows the consolidation process itself to be proven before touching the most interconnected subsystem.
