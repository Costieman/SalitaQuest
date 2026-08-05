# Modular convergence checkpoint

Baseline: `1f954fec0af3e8dd3fecf699565aae94d4b0df75`

Current stacked head: `b7db34dd9f633e8bc014fde1ce04a5f54e40d3d0`

## Verdict

**Meaningful architectural streamlining with temporary migration overhead.**

The refactor should now move into a convergence phase: continue only where a boundary removes duplicate ownership, consolidate repeated profile access, and treat compatibility loaders as temporary migration infrastructure.

## Measured architecture

| Metric | Pre-refactor | Current | Change |
|---|---:|---:|---:|
| Runtime JavaScript files | 66 | 101 | +35 |
| Runtime JavaScript bytes | 820,056 | 889,534 | +69478 |
| Root behavioral runtime files | 66 | 38 | -28 |
| Feature modules | 0 | 26 | +26 |
| Adapter modules | 0 | 7 | +7 |
| Compatibility coordinators | 0 | 28 | +28 |
| Direct storage call sites | 111 | 119 | +8 |
| Files with direct storage | 25 | 24 | -1 |
| Direct-storage files outside adapters | 25 | 19 | -6 |
| Root files with direct storage | 25 | 15 | -10 |
| Files implementing active-profile lookup | 21 | 20 | -1 |
| Direct switchView call sites | 11 | 13 | +2 |
| Non-adapter files calling switchView | 4 | 4 | 0 |
| Application window symbols | 53 | 77 | +24 |
| Custom Salita events | 48 | 48 | 0 |
| Event-listener call sites | 173 | 243 | +70 |
| Network fetch call sites | 9 | 10 | +1 |
| Tagalog startup entries | n/a | 34 | n/a |
| Cebuano startup entries | n/a | 31 | n/a |

## What has genuinely improved

- Direct-storage ownership outside adapters changed by **-6 files**.
- Root-level storage owners changed by **-10 files**.
- The codebase now has **26 explicit feature modules** and **7 explicit adapters**, making ownership testable.
- Existing public APIs and historical URLs remain available while implementation ownership moves behind named boundaries.

## Cost and over-modularisation risk

- Runtime JavaScript file count changed by **+35**.
- There are **28 compatibility coordinators**, totalling **45,054 bytes** (5.1% of scanned runtime JavaScript).
- **20 files** still implement active-profile lookup using both profile-store keys. This is the clearest current duplication hotspot.
- More modules and startup entries improve separation but can increase loader fragility and browser-request overhead if they are not later bundled or consolidated.

## Active-profile lookup owners

- `achievement-sharing-v4.js`
- `avatar-card-actions-v1.js`
- `avatar-unlock-celebration-v1.js`
- `coin-avatar-shard-shop-v1.js`
- `coin-avatar-shop-reveal-v1.js`
- `daily-key-weekday-reconciliation-v1.js`
- `desktop-navigation-refinement.js`
- `profile-app.js`
- `profile-shell.js`
- `src/adapters/avatar/avatar-case-profile-runtime-v1.js`
- `src/adapters/avatar/avatar-collection-profile-runtime-v1.js`
- `src/adapters/badges/badge-catalogue-runtime-v1.js`
- `src/adapters/badges/coin-shop-badge-runtime-v1.js`
- `src/adapters/sharing/social-connections-runtime-v1.js`
- `src/config/course-manifest.js`
- `src/features/avatar/avatar-artwork-registry-v554.js`
- `src/features/avatar/avatar-collection-summary-v1.js`
- `src/features/avatar/level-avatar-rewards-v1.js`
- `weekly-avatar-projected-unlock-fix-v1.js`
- `weekly-avatar-shard-rewards-v1.js`

## Most duplicated direct storage keys

### `sessionStorage:salitaQuestActiveProfileId` — 4 owners

- `avatar-card-actions-v1.js`
- `daily-key-weekday-reconciliation-v1.js`
- `desktop-navigation-refinement.js`
- `level-progression-v2.js`

### `localStorage:salitaQuestLocalProfilesV1` — 3 owners

- `avatar-card-actions-v1.js`
- `daily-key-weekday-reconciliation-v1.js`
- `desktop-navigation-refinement.js`

## Engine wrapper/replacement hotspots

- `switchView`: 8 file(s) — `desktop-navigation-refinement.js`, `lesson-side-launcher.js`, `level-progression-v2.js`, `mobile-session-refinement.js`, `src/adapters/navigation/avatar-collections-navigation-v551.js`, `src/adapters/sharing/social-connections-runtime-v1.js`, `src/features/progression/home-reward-coordinator.js`, `weekly-avatar-polish.js`
- `finishSession`: 6 file(s) — `adaptive-scenarios.js`, `bisaya-review-regions.js`, `daily-goal-refinement.js`, `lesson-side-launcher.js`, `mobile-session-refinement.js`, `ui-quality-fixes.js`
- `renderExercise`: 4 file(s) — `adaptive-scenarios.js`, `lesson-side-launcher.js`, `mastery-feedback.js`, `mobile-session-refinement.js`
- `saveState`: 4 file(s) — `coin-avatar-shard-shop-v1.js`, `coin-avatar-shop-reveal-v1.js`, `profile-app.js`, `weekly-avatar-projected-unlock-fix-v1.js`
- `loadBossExercise`: 2 file(s) — `adaptive-scenarios.js`, `bisaya-review-regions.js`
- `updateBoss`: 2 file(s) — `adaptive-scenarios.js`, `bisaya-review-regions.js`
- `recordDailyAnswer`: 1 file(s) — `daily-goal-refinement.js`
- `renderBadges`: 1 file(s) — `src/adapters/navigation/avatar-collections-navigation-v551.js`

## Broad engine-token reference hotspots

These are lexical references, not proof that every occurrence is a global. They identify areas that need manual boundary review.

- `state`: 27 runtime file(s)
- `saveState`: 14 runtime file(s)
- `switchView`: 12 runtime file(s)
- `currentExercise`: 8 runtime file(s)
- `finishSession`: 8 runtime file(s)
- `session`: 8 runtime file(s)
- `toast`: 7 runtime file(s)
- `MODULES`: 5 runtime file(s)
- `renderExercise`: 5 runtime file(s)
- `ITEMS`: 4 runtime file(s)

## Compatibility coordinators

- `achievement-sharing-avatar-bridge-v1.js`
- `achievement-sharing-router-v2.js`
- `achievement-sharing-router-v3.js`
- `avatar-artwork-registry-v554.js`
- `avatar-case-v1.js`
- `avatar-catalogue-v1.js`
- `avatar-collection-screen-v1.js`
- `avatar-collection-summary-v1.js`
- `avatar-collection-tabs-phase6-1-v1.js`
- `avatar-progression-hotfix-v551.js`
- `avatar-progression-migration-v1.js`
- `badge-catalogue-v2.js`
- `clean-topbar.js`
- `coin-avatar-shop-badges-v1.js`
- `coin-avatar-shop-topbar-v1.js`
- `collection-key-translation-hotfix.js`
- `compact-desktop-layout.js`
- `economy-tracking-phase6-v1.js`
- `even-progress-rail.js`
- `facebook-share-link-v1.js`
- `home-reward-coordinator.js`
- `incorrect-order-feedback.js`
- `level-avatar-rewards-v1.js`
- `level-up-mobile-safety-v552.js`
- `long-term-badges-v1.js`
- `popup-governor-v1.js`
- `pronunciation-release-control.js`
- `social-connections-v2.js`

## Required convergence actions

1. Consolidate active-profile lookup: 20 runtime files currently contain both profile-store keys.
2. Create a retirement plan for 28 compatibility coordinators; do not add coordinators without an explicit removal condition.
3. Do not extract Badge Chest until shared profile access and wrapper ownership have been reviewed against this report.
4. Approve future extraction only when it removes duplicate storage/global ownership, not merely when it relocates code.

## Decision rubric for the remaining refactor

A proposed extraction should proceed only when all of the following are true:

1. It removes direct storage, navigation or engine-global ownership from at least one feature.
2. It does not duplicate an adapter capability that already exists.
3. Its compatibility coordinator has a documented retirement condition.
4. It preserves startup order and receives a targeted behavioral simulation.
5. It leaves the stacked branch one commit ahead and zero behind its exact parent.

A consolidation should take priority when any of the following are true:

1. Four or more modules independently implement the same profile lookup.
2. Multiple adapters expose substantially overlapping storage methods.
3. A wrapper target has more than one active replacement owner.
4. Compatibility coordinators exceed eight without a retirement plan.
5. Startup entries increase materially without a browser performance checkpoint.

## Method

- Scans browser-runtime `.js` files while excluding workflows, documentation, validators, tests, tools and backend-service directories.
- Compares the permanent pre-refactor rollback commit with the exact stacked head.
- Counts direct browser-storage calls, known profile-key ownership, navigation calls, wrapper assignments, compatibility-loader heuristics, manifest entries, events and application globals.
- Treats engine-token counts as review signals rather than definitive scope analysis.

