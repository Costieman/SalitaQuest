# Phase 3 — File-by-file candidate review

This checkpoint reviews every file classified by the corrected connectivity audit as disconnected, unwired development, or indirect/dynamic. No deletions are performed here.

## A. Safe archive candidates

These files do not contribute to the deployed browser runtime and are documentation, migration history, inventories, or release notes. They may be removed from the minimal TestSalita copy while remaining available in Git history or an archive branch.

- `AGENTS.md`
- `PHONE_SETUP.md`
- `V5_2_HANDS_FREE_REVIEW.md`
- `docs/CEBUANO_AUDIO.md`
- `docs/CODE_AUDIT_2026-07-30.md`
- `docs/SOCIAL_CONNECTIONS.md`
- `docs/avatar-canonical-id-map.csv`
- `docs/avatar-source-inventory.csv`
- `docs/canonical-avatar-gallery.html`
- `docs/releases/5.5.0-avatar-progression.md`
- `docs/releases/5.5.1-avatar-hotfix.md`
- `docs/releases/5.5.10-persistent-navigation.md`
- `docs/releases/5.5.2-mobile-level-up-hotfix.md`
- `docs/releases/5.5.3-stage-1-popup-governance.md`
- `docs/releases/5.5.4-avatar-artwork-governance.md`
- `docs/releases/5.5.6-canonical-avatar-runtime.md`
- `docs/releases/5.5.7-complete-bisaya-audio.md`
- `docs/releases/5.5.8-sharing-foundation.md`
- `docs/releases/5.5.9-avatar-case.md`
- `docs/salita-quest-canonical-avatar-contact-sheet.webp`

## B. Local or maintenance tooling

These files are not part of the browser runtime. They should be excluded from a minimal production copy unless there is an explicit maintenance use for them.

- `apply_patch.py`
- `connect_audio_library.py`
- `generate_audio_library.py`
- `requirements.txt`
- `server.py`
- `start_app_windows.bat`
- `services/social-share/Dockerfile`

Recommendation: keep these in an optional `tools/` archive or separate maintenance branch, not at the application root.

## C. Unwired validators

These scripts are not called by any current workflow. They are candidates for removal from TestSalita, but their assertions should first be checked for unique coverage.

- `scripts/validate-avatar-artwork-v554.mjs`
- `scripts/validate-avatar-hotfix-v551.mjs`
- `scripts/validate-avatar-release-v550.mjs`
- `scripts/validate-avatar-unlock-sharing.mjs`
- `scripts/validate-level-avatar-rewards.mjs`
- `scripts/validate-mobile-level-up-hotfix-v552.mjs`
- `scripts/validate-persistent-navigation-ci.mjs`
- `scripts/validate-targeted-hotfix.mjs`

Recommendation: compare their assertions with active validators. Preserve only unique assertions by moving them into consolidated feature validators.

## D. Strong runtime removal candidates

These files have no detected path from `index.html`, `app.html`, the manifest, service worker, or a dynamic loader. They should be removed from TestSalita in small reversible batches and tested.

### Batch D1 — isolated files

- `achievement-sharing-image-transport-v1.js`
- `avatar-case-page-tab-v1.js`
- `avatar-case-page-tab-v1.css`
- `avatar-collection-page-v2.js`
- `coin-avatar-shop-topbar-v1.css`
- `mystery-rarity-roll-v1.js`
- `profile-shell-base.css`
- `pronoun-clarity-daily-quest-collapse-v1.js`

### Batch D2 — internally connected but entry-point-disconnected cluster

- `avatar-card-actions-v1.js`
- `daily-key-weekday-reconciliation-v1.js`
- `universal-share-simplifier-v1.js`
- `universal-share-simplifier-v1.css`
- `weekly-avatar-projected-unlock-fix-v1.js`

This cluster should be removed together. Its files reference one another, but no deployed entry point references the cluster.

## E. Do not remove yet

These files were classified as indirect because they are referenced only by maintenance documentation or scripts. Their current runtime role is uncertain enough to require targeted testing before removal.

- `profile-shell.js` — referenced by `apply_patch.py`; verify whether its behavior has already been embedded elsewhere.
- `server.py` — local hosting only; safe for production exclusion, but retain until local testing workflow is decided.

## Phase 3 conclusion

The candidate set is no longer a flat list. It is now divided into:

- 20 archive-only files;
- 7 maintenance-tool files;
- 8 unwired validators;
- 13 runtime-removal candidates, including one five-file disconnected cluster;
- 2 files requiring explicit workflow decisions.

The recommended first destructive experiment in TestSalita is to remove sections A and B, then D1, then D2, with a deployment and smoke test after each batch. The production SalitaQuest repository remains unchanged.
