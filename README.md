# Salita Quest

Salita Quest is a local-first, conversation-focused Tagalog and Cebuano learning app. It combines active recall, spaced repetition, structured mastery, short daily practice, scenario challenges, audio review, learner profiles, collectible rewards and offline installation.

Current application release: **5.5.0 — Avatar Progression**.

## Learner onboarding and placement

A new learner chooses one of two routes when first opening a language course:

1. **Complete beginner** — begins at the first region and automatically enables Complete Beginner mode.
2. **Estimated level** — chooses A1, A2, A3, B1, B2 or B3 and completes a 20-question placement check.

The self-estimate changes the mix of basic, intermediate and advanced questions, but the final recommendation is based on the answers. A3 and B3 are internal Salita Quest progression bands rather than official CEFR labels.

Placement changes **content access only**. It does not award XP, manufacture mastery, add review history or mark unseen phrases as encountered. Earlier regions remain available, existing learners retain their journey, and the placement check can be retaken from Settings.

New learner profiles choose one of four equal-status starter avatars: Anahaw, Waling-Waling, Jade Vine or Philippine Rafflesia. Existing learner avatars are preserved during migration.

## Learning model

- Stable item IDs preserve progress between releases.
- Phrase mastery has five stages: Seen, Familiar, Usable, Flexible and Mastered.
- Long-term mastery only grows after correct recall following at least three days away.
- Daily Sessions mix due review, familiar material and a small amount of new language.
- Quick Review uses encountered material only and can be configured from 3 to 20 items.
- Incorrect sentence builders visibly reorder into the correct sentence after submission.
- Correct answers show direct word-level translations beneath the completed answer.
- Adaptive conversation scenarios use material the learner has already encountered.

## Daily goals and avatar rewards

Each day contains four goals:

1. finish one Daily Session;
2. give 15 correct answers;
3. strengthen three learned items;
4. complete 15 Quick Review items.

Completing all four goals awards one account-wide Daily Key. Six keys earned during a Monday-to-Sunday week open the weekly avatar reward. The learner chooses any eligible locked Common, Uncommon or Rare avatar; no avatar is assigned randomly.

Weekly shard awards are:

- Common: 100 shards, normally unlocking in one weekly reward;
- Uncommon: 50 shards, normally unlocking in two weekly rewards;
- Rare: 25 shards, normally unlocking in four weekly rewards.

The 48-avatar collection is shared by Tagalog and Bisaya. Locked avatars are grey, partial progress reveals colour at 25%, 50% and 75%, and owned avatars can be equipped at any time. Newly completed avatars enter a once-only reveal queue and can fly into their collection card.

## Levels

- Learner levels run from 1 to 99.
- Existing learners keep their current level when the progressive curve is introduced.
- Later levels require increasingly more XP.
- Level-up celebrations are queued and shown when Home is visible.
- Levels 10–90 grant catalogue avatars from the Common and Uncommon tiers.
- Level 99 grants the Special Golden Salita Crest.
- Existing learners receive reached milestone rewards retroactively and exactly once.
- After a genuine level-up, learners can share an avatar-backed level card or continue without sharing.

## Badges and Badge Chest

Badges have their own dedicated navigation page. The catalogue displays:

1. earned badges first, ordered newest to oldest;
2. available but not yet earned badges;
3. locked badges.

Every badge has a stable ID, category, requirement, status, progress data, earned timestamp and an optional custom image path. Custom art can later be added at `badges/<badge-id>.png`; the learner's equipped catalogue avatar remains the current fallback.

New badges are celebrated on Home. The **Badge Chest** lets a learner choose, replace and manually order up to six favourite earned badges. Existing chest selections are preserved. An unconfigured chest is no longer silently filled, and the explicit **Choose badges** editor is the main replacement workflow.

`badge-catalogue-v2.js` owns badge definitions, earned state and catalogue rendering. It emits one `salita:badges-rendered` event after the shelf is complete. `badge-chest-v2.js` owns selection, ordering and persistence and does not use a shelf `MutationObserver`.

## Hosted achievement sharing

Facebook, LinkedIn and X cannot inspect a canvas or `blob:` image that exists only inside the learner's browser. Sharing the ordinary Salita Quest homepage therefore produces a generic link preview rather than the selected badge, Badge Chest or level-up card.

The Cloud Run share service creates a unique public page for each post:

1. the browser renders the actual 1080 × 1080 achievement card;
2. it also renders a 1200 × 630 Open Graph version;
3. both PNGs are uploaded to the Salita Quest share service;
4. the service returns a unique `/share/<id>` page;
5. that page exposes the exact card through `og:image` and Twitter Card metadata;
6. the page and artwork both link back to Salita Quest.

The cards contain a visible **START LEARNING FREE** call-to-action and **Choose Tagalog or Cebuano** invitation. Badge, Badge Chest and Level Up cards resolve the learner's currently equipped avatar from the central catalogue.

Platform behavior:

- **Facebook, LinkedIn and X** share the unique hosted page, allowing their crawlers to display the actual achievement card.
- **WhatsApp** shares the hosted card link and invitation.
- **Instagram and TikTok** receive the square PNG through mobile/device sharing, or through a future approved connected-account publishing integration.
- Each hosted URL is unique, avoiding stale social-preview caches from earlier generic Salita Quest links.

`achievement-sharing-v4.js` remains the owner of individual badge, Badge Chest and level-up card generation and external platform hand-off. `achievement-sharing-avatar-bridge-v1.js` resolves the equipped catalogue avatar for those cards.

The service lives in [`services/social-share/`](services/social-share/) and can be deployed from Google Cloud Shell:

```bash
chmod +x services/social-share/deploy-cloud-shell.sh
./services/social-share/deploy-cloud-shell.sh
```

The production HTTPS service URL is built into the app. Learners do not paste or configure infrastructure addresses. See [`services/social-share/README.md`](services/social-share/README.md).

## Connected social accounts

Settings contains a compact sharing-status screen. Hosted previews work without account setup or social access tokens.

True connected-account publishing remains a separate layer requiring provider applications, OAuth credentials, secure token storage and approved permissions. Provider restrictions still apply:

- Facebook personal-profile sharing remains user-confirmed.
- Instagram publishing requires a supported professional account and Meta permissions.
- TikTok requires a registered app, user OAuth, approved posting scopes and provider review conditions.
- LinkedIn member posting requires OAuth and `w_member_social`.
- Google can support identity or future sync, but is not a badge-post destination.

See [`docs/SOCIAL_CONNECTIONS.md`](docs/SOCIAL_CONNECTIONS.md).

## Pronunciation and audio

- The main pronunciation control activates on pointer release rather than pointer press.
- Touch-generated click events are deduplicated.
- Keyboard activation remains supported.
- Pronunciation is hidden before English-to-Filipino sentence production.
- Pronunciation becomes available after every submitted answer when a phrase is known.
- Static audio is indexed through `audio/audio_manifest.json`.
- Tagalog audio is never substituted for Cebuano.

### Cebuano Google Cloud audio

The repository includes `scripts/generate_cebuano_google_audio.py`, which uses Google Cloud Gemini-TTS with language code `ceb-PH` and the approved `Kore` voice.

The generator is resumable. It keeps existing clips, updates the manifest after each success, reuses punctuation-equivalent recordings, retries transient errors, logs rejected phrases in `audio/ceb-PH/failed.jsonl`, and continues through the remaining library.

```bash
cd ~/SalitaQuest-current
git pull --ff-only origin main
export GOOGLE_CLOUD_PROJECT="$(gcloud config get-value project)"
export GOOGLE_CLOUD_REGION="global"
python3 scripts/generate_cebuano_google_audio.py
```

Setup and recovery details are in [`docs/CEBUANO_AUDIO.md`](docs/CEBUANO_AUDIO.md).

## Learner profiles, migration and saving

- Multiple local learner profiles are supported.
- Each learner has separate Tagalog and Cebuano course progress and placement results.
- Avatar ownership, shards, weekly keys, milestone claims and equipped avatar are account-wide.
- PINs are salted and hashed with SHA-256 through Web Crypto.
- Course state is mirrored to the active learner regularly.
- A full save is forced every 15 seconds and before switching learner or language, logging out, refreshing, hiding or leaving the page.
- JSON backup/import and transfer codes remain supported.

Release 5.5.0 performs an additive and idempotent avatar migration. It preserves the equipped legacy avatar, copies legacy weekly keys and claims into profile-level state, converts old avatar variants to their catalogue avatar, and does not delete the original Tagalog or Bisaya progress JSON.

This is a local profile lock, not a server-authenticated account. Progress remains tied to the website origin, device and browser unless exported or connected to a future sync service.

## Interface

- Responsive desktop dashboard with a retractable symbol-only navigation rail.
- Dedicated Home, Learn, Topic Review, Hands-Free Review, Dictionary, Journey Map, Challenges, Progress, Badges and Settings destinations.
- Responsive 48-avatar Collection screen with rarity grouping and shard progress.
- Responsive badge catalogue, six-slot Badge Chest and full badge picker.
- Compact mobile practice mode with fixed Skip, Check and Continue controls.
- Mobile World Progress uses numbered nodes without overlapping region labels.
- Light and dark themes are supported.
- Reduced-motion alternatives preserve reward acknowledgement without major movement.

## Offline installation

Salita Quest is a Progressive Web App. The service worker caches the course engine, language packs, interface assets, all catalogue avatars and avatar progression runtimes. Release 5.5.0 uses cache `salita-quest-v5-5-avatar-progression-r43` and matches cached resources independently of release query strings.

Hosted share pages themselves require a network connection because social-platform crawlers must reach public image and metadata URLs.

## Repository structure

- `app.js` — shared course engine
- `app.html` — Tagalog profile-aware loader
- `bisaya.html` / `bisaya-app-loader.js` — Cebuano course loader and engine transformation
- `languages/cebuano/` — Cebuano course and module packs
- `audio/audio_manifest.json` — static audio index
- `scripts/generate_cebuano_google_audio.py` — resumable Google Cloud generator
- `placement-onboarding-v1.js` — beginner choice and placement check
- `avatar-catalogue-v1.js` — central 48-avatar definitions, rarity, rewards and aliases
- `avatar-collection-screen-v1.js` — collection catalogue and equip controls
- `weekly-avatar-shard-rewards-v1.js` — six-key learner-selected shard rewards
- `level-avatar-rewards-v1.js` — Levels 10–99 avatar milestones
- `avatar-unlock-celebration-v1.js` — queued once-only unlock reveals
- `avatar-progression-migration-v1.js` — additive legacy migration
- `achievement-sharing-avatar-bridge-v1.js` — equipped-avatar social-card integration
- `badge-catalogue-v2.js` — ordered badge catalogue, earned state and celebrations
- `badge-chest-v2.js` — six-slot selection, picker, ordering and persistence
- `badge-layout-v3.css` — non-overlapping badge geometry
- `achievement-sharing-v4.js` — badge, chest and level-up cards and platform sharing
- `social-connections-v2.js` — built-in service status and OAuth-ready connection contract
- `services/social-share/` — Cloud Run Open Graph image and landing-page service
- `home-reward-coordinator.js` — Home-only Daily Key playback
- `pronunciation-release-control.js` — release-based pronunciation activation
- `service-worker.js` — installed/offline delivery
- `docs/releases/5.5.0-avatar-progression.md` — release notes
- `docs/releases/5.5.0-avatar-progression-release-checklist.md` — integration and smoke-test checklist
- `docs/CODE_AUDIT_2026-07-30.md` — architecture findings and staged simplification plan

## Code audit and consolidation

Release 5.4.29 removed the active dependency on `badge-sharing-v1`, `social-posting-v2`, `achievement-sharing-v3` and `social-links-v1`. Their responsibilities were duplicated, misleading or dependent on event interception order. Release 5.5.0 builds the avatar feature on the consolidated badge, profile and sharing runtimes rather than reactivating those superseded handlers.

The audit also records deferred structural work: replacing the pinned raw-document loader, reducing global function wrapping, centralising release versions, consolidating patch CSS and adding Playwright browser smoke tests. See [`docs/CODE_AUDIT_2026-07-30.md`](docs/CODE_AUDIT_2026-07-30.md).

## Validation

The pull-request workflows validate the courses, shared UI, Home, mobile, key-run, progression/scenarios/navigation, audio/badges, placement, hosted previews, resumable audio, deterministic Badge Chest state and the integrated Avatar Progression release.

Run the complete Avatar Progression release gate with:

```bash
node scripts/validate-avatar-progression-v550.mjs
```

The integration runner executes these component validators:

```bash
node scripts/validate-avatar-catalogue.mjs
node scripts/validate-avatar-onboarding.mjs
node scripts/validate-avatar-collection-screen.mjs
node scripts/validate-weekly-avatar-shards.mjs
node scripts/validate-level-avatar-rewards.mjs
node scripts/validate-avatar-unlock-sharing.mjs
node scripts/validate-avatar-release-v550.mjs
```

The established application validators remain available:

```bash
node scripts/validate-bisaya.mjs
node scripts/validate-ui-quality.mjs
node scripts/validate-home-dashboard.mjs
node scripts/validate-mobile-refinement.mjs
node scripts/validate-key-run-refinement.mjs
node scripts/validate-progression-scenarios-navigation.mjs
node scripts/validate-audio-badge-release.mjs
node scripts/validate-placement-sharing.mjs
node scripts/validate-social-posting-audio-resume.mjs
node scripts/validate-hosted-achievement-sharing.mjs
node scripts/validate-badge-stability.mjs
```

## Privacy

The static app does not contain Google Cloud credentials, provider client secrets or social access tokens. Public share images contain only the learner name, selected language, equipped avatar and achievements deliberately chosen for sharing. The share service stores generated cards for up to 365 days and does not store local progress or PINs.
