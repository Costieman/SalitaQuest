# Phase 1 — Runtime dependency map

Checkpoint branch: `agent/repository-forensics-audit`

## Scope

This checkpoint records the corrected static reachability audit after adding support for GitHub Actions command lines, Python/shell validators, loader calls, manifest references, and service-worker cache references. It is a map for investigation, not an automatic deletion list.

## Repository surface

The corrected audit classified 1,206 tracked files:

| Classification | Files |
|---|---:|
| Runtime-active | 1,061 |
| Development-active | 83 |
| Documentation/history | 13 |
| Disconnected candidates | 34 |
| Indirect/dynamic candidates | 7 |
| Unwired development candidates | 8 |

The apparent runtime size is dominated by assets:

- 893 audio files
- 65 avatar images
- 11 language-data files
- 2 icons
- 90 root-level runtime files

Therefore, repository complexity is primarily concentrated in approximately 90 root-level runtime files, not the media count.

## Confirmed runtime entry points

- `index.html`
- `app.html`
- `manifest.webmanifest`
- `service-worker.js`

Other reachable pages include `bisaya.html`, `start.html`, and `mobile-refresh.html`.

## Active runtime feature clusters

### Core application and course delivery

- `app.js`
- `profile-app.js`
- `style.css`
- `profile-shell.css`
- `bisaya-app-loader.js`
- `bisaya-review-regions.js` / `.css`
- `languages/`
- `audio/`

### Progress, sessions, and learning UI

- `progression-v54.js`
- `level-progression-v2.js` / `.css`
- `key-run-refinement.js`
- `even-progress-rail.js`
- `topbar-world-progress-hotfix.css`
- `world-progress-status.css`
- `compact-home-dashboard.css`
- `compact-desktop-layout.js` / `.css`
- `mobile-session-refinement.js` / `.css`
- `daily-goal-refinement.js`
- `home-reward-coordinator.js`

### Translation and exercise feedback

- `translation-gloss-completion-v1.js`
- `collection-key-translation-hotfix.js`
- `ui-answer-breakdown.css`
- `ui-quality-fixes.js` / `.css`
- `mastery-feedback.js` / `.css`
- `incorrect-order-feedback.js` / `.css`
- `exercise-fixes-v545.js`
- `pronunciation-release-control.js`

### Avatar, collection, and reward systems

The runtime currently reaches many separate files rather than one canonical module:

- `avatar-artwork-registry-v554.js`
- `avatar-catalogue-v1.js`
- `avatar-collection-screen-v1.js` / `.css`
- `avatar-collection-page-v2.css`
- `avatar-case-v1.js` / `.css`
- `avatar-case-desktop-safety.css`
- `avatar-progression-hotfix-v551.js` / `.css`
- `avatar-progression-migration-v1.js`
- `avatar-unlock-celebration-v1.js` / `.css`
- `level-avatar-rewards-v1.js`
- `weekly-avatar-chest.js` / `.css`
- `weekly-avatar-polish.js`
- `weekly-avatar-shard-rewards-v1.js` / `.css`
- `profile-emblem-control.js` / `.css`

This is the strongest confirmed consolidation target for Phase 2.

### Sharing and social features

- `achievement-sharing-v4.js` / `.css`
- `achievement-sharing-avatar-bridge-v1.js`
- `achievement-sharing-router-v2.js` / `.css`
- `achievement-sharing-router-v3.js`
- `facebook-share-link-v1.js`
- `social-connections-v2.js` / `.css`

Both router v2 and router v3 are runtime-reachable. This needs code-level ownership review before either is removed.

## High-confidence archive/removal candidates for TestSalita

These are not deployed runtime dependencies. They should be removed first in TestSalita as a reversible batch, while remaining preserved in SalitaQuest history:

- historical release notes under `docs/releases/`
- `docs/CODE_AUDIT_2026-07-30.md`
- `docs/CEBUANO_AUDIO.md`
- `docs/SOCIAL_CONNECTIONS.md`
- `docs/avatar-canonical-id-map.csv`
- `docs/avatar-source-inventory.csv`
- `docs/canonical-avatar-gallery.html`
- `docs/salita-quest-canonical-avatar-contact-sheet.webp`
- `PHONE_SETUP.md`
- `V5_2_HANDS_FREE_REVIEW.md`

`AGENTS.md` is not a runtime dependency, but it may still guide automated development and should not be treated as ordinary historical documentation without a separate decision.

## Code candidates requiring direct inspection

The following have no detected path from the deployed application and are the first code-level candidates for TestSalita removal testing:

- `achievement-sharing-image-transport-v1.js`
- `avatar-card-actions-v1.js`
- `avatar-case-page-tab-v1.js`
- `avatar-collection-page-v2.js`
- `coin-avatar-shop-topbar-v1.css`
- `mystery-rarity-roll-v1.js`
- `profile-shell-base.css`
- `pronoun-clarity-daily-quest-collapse-v1.js`

Potential dependent cluster around `avatar-card-actions-v1.js`:

- `daily-key-weekday-reconciliation-v1.js`
- `universal-share-simplifier-v1.js` / `.css`
- `weekly-avatar-projected-unlock-fix-v1.js`

Potential dependent cluster around `avatar-case-page-tab-v1.js`:

- `avatar-case-page-tab-v1.css`

These should be tested as clusters rather than as isolated files.

## Development-only candidates

Eight validators are not connected to a current workflow or another active tooling chain:

- `scripts/validate-avatar-artwork-v554.mjs`
- `scripts/validate-avatar-hotfix-v551.mjs`
- `scripts/validate-avatar-release-v550.mjs`
- `scripts/validate-avatar-unlock-sharing.mjs`
- `scripts/validate-level-avatar-rewards.mjs`
- `scripts/validate-mobile-level-up-hotfix-v552.mjs`
- `scripts/validate-persistent-navigation-ci.mjs`
- `scripts/validate-targeted-hotfix.mjs`

These are candidates for consolidation or archival, but they may encode useful regression assertions. Phase 2 must compare their checks with active validators before removal.

## Local/deployment tooling outside the browser runtime

The following are disconnected from the browser app but may support local hosting, audio generation, or hosted services:

- `apply_patch.py`
- `connect_audio_library.py`
- `generate_audio_library.py`
- `requirements.txt`
- `server.py`
- `start_app_windows.bat`
- `services/social-share/Dockerfile`

These should be excluded from the minimal static app unless an explicit development or hosted-service requirement is retained.

## Phase 1 conclusion

The app is not simply burdened by thousands of meaningful source files. Most tracked files are media. The main structural problem is approximately 90 root-level runtime files, especially the avatar/reward and sharing families, where multiple versioned scripts coexist and are simultaneously reachable.

Phase 2 should therefore focus on assigning one canonical owner module to each feature family before destructive TestSalita pruning begins.
