# Module Extraction Plan

## Objective

The contract inventory establishes the compatibility surface that must remain stable while Salita Quest moves from root-level browser scripts to explicit feature modules. Physical relocation should now proceed incrementally rather than through a repository-wide move.

## Evidence from the inventory

The current application contains 58 discovered runtime files connected through 147 dependency edges. The scanner records 21 storage contracts and 36 Salita custom events. Seventeen feature files have sufficiently low coupling for controlled extraction, while core engine, loader, and high-coupling files should remain in place until adapters exist.

For Cebuano, `bisaya-app-loader.js` is the executed loader and `app.js` is a fetched, transformed engine source. The inventory includes both because both are runtime inputs; they must not be interpreted as two directly executed initial scripts.

## First extraction: mobile level-up safety

The recommended first physical move is `level-up-mobile-safety-v552.js` because it is loaded by both courses, has no storage operations, no direct shared-engine dependencies, and a low static coupling score.

Target structure:

```text
src/features/progression/level-up-mobile-safety.js
level-up-mobile-safety-v552.js  # temporary compatibility loader
```

The first extraction pull request should:

1. Copy the implementation to the feature path without changing behavior.
2. Convert the root file into a minimal ordered compatibility loader.
3. Keep the existing manifest filename and version during the first offline-cache release.
4. Add the new feature path to the service-worker cache.
5. Extend validators to confirm that the compatibility loader loads exactly one implementation and does not duplicate event listeners.
6. Run all Tagalog, Bisaya, avatar, economy, navigation, and installed-app validation suites.

The compatibility loader should remain for at least one cache release. A later pull request can point the course manifest directly to the feature path and remove the root shim after older installed clients have crossed the cache boundary.

## Subsequent low-coupling sequence

After the first move is verified, the next candidates should be extracted separately or in narrowly related families:

1. `pronunciation-release-control.js` — audio interaction safety.
2. `clean-topbar.js` and `compact-desktop-layout.js` — desktop shell refinements.
3. `even-progress-rail.js` — progress presentation.
4. `avatar-catalogue-v1.js` and `avatar-progression-migration-v1.js` — avatar data and migration, with stable exported APIs.
5. `avatar-artwork-registry-v554.js` — artwork resolution, retaining existing storage and API contracts.

These rankings are migration guidance rather than proof of independence. Static analysis cannot fully resolve computed DOM selectors, dynamically constructed storage keys, or runtime mutation timing. Each proposed move therefore still requires targeted browser validation.

## Files that should not move yet

`app.js`, `profile-app.js`, `profile-emblem-control.js`, `bisaya-app-loader.js`, and `src/app/course-bootstrap.js` are structural owners or loaders. `bisaya-review-regions.js`, `exercise-fixes-v545.js`, `daily-goal-refinement.js`, `adaptive-scenarios.js`, `badge-catalogue-v2.js`, `key-run-refinement.js`, and `ui-quality-fixes.js` have substantial direct coupling to the shared engine or DOM.

Before extracting these files, introduce an explicit engine adapter that owns access to learner state, persistence, navigation, rendering, exercises, audio, and popup coordination. The adapter should expose documented methods rather than reproducing the current browser-global surface.

## Non-negotiable compatibility rules

- Do not rename or reinterpret storage keys during a file move.
- Do not change custom-event names or payload semantics.
- Preserve DOM IDs and selectors until callers have migrated to an explicit component interface.
- Preserve script execution order unless a validator proves the new dependency model.
- Keep one implementation owner for each feature; compatibility loaders must not install duplicate listeners.
- Do not combine physical relocation with feature redesign.
- Keep the original repository backup and the modular-bootstrap rollback point available throughout the migration.
