# Salita Quest

Salita Quest is a local-first, conversation-focused Tagalog and Cebuano learning app. It combines active recall, spaced repetition, structured mastery, short daily practice, scenario challenges, audio review, learner profiles, collectible rewards and offline installation.

Current application release: **5.4.24 — Social Posting & Resumable Cebuano Audio**.

## Learner onboarding and placement

A new learner chooses one of two routes when first opening a language course:

1. **Complete beginner** — begins at the first region and automatically enables Complete Beginner mode.
2. **Estimated level** — chooses A1, A2, A3, B1, B2 or B3 and completes a 20-question placement check.

The self-estimate changes the mix of basic, intermediate and advanced questions, but the final recommendation is based on the answers. A3 and B3 are internal Salita Quest progression bands rather than official CEFR labels.

Placement changes **content access only**. It does not award XP, manufacture mastery, add review history or mark unseen phrases as encountered. Earlier regions remain available, existing learners retain their journey, and the placement check can be retaken from Settings.

## Learning model

- Stable item IDs preserve progress between releases.
- Phrase mastery has five stages: Seen, Familiar, Usable, Flexible and Mastered.
- Long-term mastery only grows after correct recall following at least three days away.
- Daily Sessions mix due review, familiar material and a small amount of new language.
- Quick Review uses encountered material only and can be configured from 3 to 20 items.
- Incorrect sentence builders visibly reorder into the correct sentence after submission.
- Correct answers show direct word-level translations beneath the completed answer.
- Adaptive conversation scenarios use material the learner has already encountered.

## Daily goals and rewards

Each day contains four goals:

1. finish one Daily Session;
2. give 15 correct answers;
3. strengthen three learned items;
4. complete 15 Quick Review items.

Completing all four goals awards one Daily Key. Six keys earned on consecutive days unlock a random collectible avatar reward. The key is stored immediately but its animation waits until Home is visible.

## Levels

- Learner levels run from 1 to 99.
- Existing learners keep their current level when the progressive curve is introduced.
- Later levels require increasingly more XP.
- Level-up celebrations are queued and shown when Home is visible.

## Badges and Badge Chest

Badges have their own dedicated navigation page. The catalogue displays:

1. earned badges first, ordered newest to oldest;
2. available but not yet earned badges;
3. locked badges.

Every badge has a stable ID, category, requirement, status, progress data, earned timestamp and an optional custom image path. Custom art can later be added at `badges/<badge-id>.png`; the current pictogram remains as a fallback.

New badges are celebrated on Home. The **Badge Chest** lets a learner pin and manually order up to six favourite earned badges.

Release 5.4.24 fixes the catalogue's internal overlap by enforcing a dedicated artwork column and a separate content column even though the legacy course stylesheet loads later. The grid reduces column counts before cards become cramped.

## Achievement posting

Selecting **Share badge** or **Share Badge Chest** now opens a Salita Quest posting panel instead of immediately handing a generic PNG to the Windows share sheet.

The panel:

- renders a high-quality 1080 × 1080 preview;
- uses the learner's selected pixel avatar whenever custom badge art is unavailable;
- offers Facebook, X, LinkedIn and WhatsApp public composers;
- offers mobile image handoff for Instagram, TikTok and other installed apps;
- supports download and caption-copy fallbacks;
- includes a referral link inviting people to **learn Filipino languages for free with Salita Quest**.

Public composer sharing remains user-confirmed. A browser cannot silently attach a locally generated image to every desktop platform.

## Connected social accounts

Settings now contains an OAuth-ready **Connected accounts** screen for Facebook, Instagram, TikTok, X, LinkedIn and Google.

True account connections require a secure HTTPS backend because provider access tokens and client secrets must never be stored in the GitHub Pages app. Once a connection service is deployed, its Cloud Run URL can be saved in Settings. Connected providers can then be used by the posting panel through the documented API contract.

Provider restrictions still apply:

- Facebook personal-profile sharing remains user-confirmed; ordinary apps cannot silently publish arbitrary personal timeline posts.
- Instagram publishing requires a supported professional account and Meta permissions.
- TikTok requires a registered app, user OAuth, approved posting scopes and provider review/audit conditions.
- LinkedIn member posting requires OAuth and `w_member_social`.
- Google is available for identity or future sync, not as a badge-post destination.

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

The generator is now resumable. It:

- keeps existing clips;
- updates the manifest after each success;
- reuses punctuation-equivalent recordings;
- retries transient Google Cloud errors;
- logs provider safety rejections in `audio/ceb-PH/failed.jsonl`;
- continues through the remaining phrases instead of aborting the whole run.

```bash
cd ~/SalitaQuest-current
git pull --ff-only origin main
export GOOGLE_CLOUD_PROJECT="$(gcloud config get-value project)"
export GOOGLE_CLOUD_REGION="global"
python3 scripts/generate_cebuano_google_audio.py
```

Setup and recovery details are in [`docs/CEBUANO_AUDIO.md`](docs/CEBUANO_AUDIO.md).

## Learner profiles and saving

- Multiple local learner profiles are supported.
- Each learner has separate Tagalog and Cebuano progress and placement results.
- PINs are salted and hashed with SHA-256 through Web Crypto.
- Course state is mirrored to the active learner regularly.
- A full save is forced every 15 seconds and before switching learner or language, logging out, refreshing, hiding or leaving the page.
- JSON backup/import and transfer codes remain supported.

This is a local profile lock, not a server-authenticated account. Progress remains tied to the website origin, device and browser unless exported or connected to a future sync service.

## Interface

- Responsive desktop dashboard with a retractable symbol-only navigation rail.
- Dedicated Home, Learn, Topic Review, Hands-Free Review, Dictionary, Journey Map, Challenges, Progress, Badges and Settings destinations.
- Responsive Badge catalogue and Badge Chest.
- Compact mobile practice mode with fixed Skip, Check and Continue controls.
- Mobile World Progress uses numbered nodes without overlapping region labels.
- Light and dark themes are supported.
- Reduced-motion alternatives preserve reward acknowledgement without major movement.

## Offline installation

Salita Quest is a Progressive Web App. The service worker caches the course engine, language packs, interface assets, avatars and reward runtimes. Release 5.4.24 uses cache `salita-quest-v5-4-social-posting-audio-r38`.

After a release, a hard refresh or fully closing and reopening an installed copy may be required once.

## Repository structure

- `app.js` — shared course engine
- `app.html` — Tagalog profile-aware loader
- `bisaya.html` / `bisaya-app-loader.js` — Cebuano course loader and engine transformation
- `languages/cebuano/` — Cebuano course and module packs
- `audio/audio_manifest.json` — static audio index
- `scripts/generate_cebuano_google_audio.py` — resumable Google Cloud generator
- `placement-onboarding-v1.js` — beginner choice and placement check
- `badge-catalogue-v2.js` — ordered badge catalogue and celebrations
- `badge-sharing-v1.js` — Badge Chest state and legacy card helpers
- `badge-layout-v3.css` — final non-overlapping badge geometry
- `social-connections-v2.js` — OAuth-ready connection status and service contract
- `social-posting-v2.js` — card preview, platform picker and connected posting client
- `home-reward-coordinator.js` — Home-only Daily Key playback
- `pronunciation-release-control.js` — release-based pronunciation activation
- `service-worker.js` — installed/offline delivery

## Validation

The pull-request workflow validates the courses, shared UI, Home, mobile, key-run, progression/scenarios/navigation, audio/badges, placement/sharing and the current social/audio recovery release.

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
```

## Privacy

The static app does not contain Google Cloud credentials, provider client secrets or social access tokens. Public sharing is user-confirmed. Connected posting is enabled only through a separately deployed HTTPS service that is responsible for OAuth security, encrypted token storage, revocation and provider compliance.
