# Salita Quest

Salita Quest is a local-first, conversation-focused Tagalog and Cebuano learning app. It combines active recall, spaced repetition, structured mastery, short daily practice, scenario challenges, audio review, learner profiles, collectible rewards and offline installation.

Current application release: **5.4.23 — Placement & Social Badge Chest**.

## Learner onboarding and placement

A new learner chooses one of two routes when first opening a language course:

1. **Complete beginner** — begins at the first region and automatically enables Complete Beginner mode.
2. **Estimated level** — chooses A1, A2, A3, B1, B2 or B3 and completes a 20-question placement check.

The self-estimate changes the mix of basic, intermediate and advanced questions, but the final recommendation is based on the answers. A3 and B3 are internal Salita Quest progression bands rather than official CEFR labels.

Placement changes **content access only**. It does not:

- award XP;
- create false mastery;
- add review history;
- mark unseen phrases as encountered.

The learner starts around the recommended region while earlier regions remain available. Existing learners retain their current journey and are not forced through the test. The placement check can be retaken from Settings. Turning off Complete Beginner mode also offers the test again.

## Learning model

- Stable item IDs preserve progress between releases.
- Normal phrase mastery has five stages: Seen, Familiar, Usable, Flexible and Mastered.
- Long-term mastery only grows after a correct recall following at least three days away.
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

Completing all four goals awards one Daily Key. Six keys earned on consecutive days unlock a random collectible avatar reward. The key is stored immediately but its animation waits until the learner returns to Home, ensuring the reward is visible.

## Levels

- Learner levels run from 1 to 99.
- Existing learners keep their current level when the progressive curve is introduced.
- Later levels require increasingly more XP.
- Level-up celebrations are queued and shown when Home is visible.

## Badges and Badge Chest

Badges have their own dedicated navigation page.

The catalogue displays:

1. earned badges first, ordered newest to oldest;
2. available but not yet earned badges;
3. locked badges.

Every badge has a stable ID, category, requirement, status, progress data, earned timestamp and an optional custom image path. Custom art can later be added at `badges/<badge-id>.png`; the current pictogram remains as a fallback.

New badge awards are queued and celebrated on Home. The badge appears centrally, spins, then travels toward the Badges navigation destination. Existing badges are migrated without replaying every historic achievement.

The **Badge Chest** lets a learner pin and manually order up to six favourite earned badges. The first chest item is treated as the top-left achievement. Learners can:

- add or remove earned badges;
- reorder the chest;
- share an individual badge;
- share the full Badge Chest as a square social card.

Share cards include Salita Quest branding and an invitation to **learn Filipino languages for free with Salita Quest**. On supported phones the app uses the system share sheet. On desktop it downloads the image and copies a suggested caption where clipboard access is available. Nothing is posted automatically.

## Optional social links

Each local learner profile can store optional links or handles for Facebook, Instagram, TikTok, X, YouTube and LinkedIn. One platform can be marked as the primary public handle for future share experiences.

These links:

- remain inside the local learner profile;
- are never used for automatic posting;
- do not provide OAuth access to the learner's social account;
- can be changed or removed from Settings.

Direct social-account OAuth and server-side posting would require registered platform applications, redirect URLs, a privacy policy and a secure backend. The current implementation deliberately uses local links plus the device share sheet.

## Pronunciation and audio

- The main pronunciation control activates on pointer release rather than pointer press.
- Touch-generated click events are deduplicated.
- Keyboard activation remains supported.
- Pronunciation is hidden before English-to-Filipino sentence production so it cannot reveal the answer.
- Pronunciation becomes available after every submitted answer when a phrase is known.
- Static audio is indexed through `audio/audio_manifest.json`.
- Tagalog and Cebuano audio remain separate; Tagalog pronunciation is never substituted for Cebuano.

### Cebuano Google Cloud audio

Google Cloud Gemini-TTS currently lists Cebuano (Philippines), `ceb-PH`, as a Preview language. The repository includes:

```bash
python scripts/generate_cebuano_google_audio.py --dry-run
```

The generator reads the released Cebuano items and dialogue lines, writes deterministic MP3 files beneath `audio/ceb-PH/`, and updates the shared audio manifest.

Setup instructions are in [`docs/CEBUANO_AUDIO.md`](docs/CEBUANO_AUDIO.md).

Google Cloud credentials are never stored in the browser app or committed to the repository. Audio generation requires a Google Cloud project, billing, Application Default Credentials and the necessary API and prediction permissions.

## Learner profiles and saving

- Multiple local learner profiles are supported.
- Each learner has separate Tagalog and Cebuano progress and placement results.
- PINs are salted and hashed with SHA-256 through Web Crypto.
- Course state is mirrored to the active learner regularly.
- A full save is forced every 15 seconds.
- Saves also occur before changing learner, changing language, logging out, hiding the tab, refreshing or leaving the page.
- JSON backup/import and transfer codes remain supported.

This is a local profile lock, not a server-authenticated account. Progress remains tied to the website origin, device and browser unless it is exported or a future sync service is added.

## Interface

- Responsive desktop dashboard with a retractable symbol-only navigation rail.
- Dedicated Home, Learn, Topic Review, Hands-Free Review, Dictionary, Journey Map, Challenges, Progress, Badges and Settings destinations.
- Responsive Badge catalogue and Badge Chest grids that reduce column counts before cards can overlap the desktop app canvas.
- Compact mobile practice mode with fixed Skip, Check and Continue controls.
- Mobile World Progress uses numbered nodes without overlapping region labels.
- Light and dark themes are supported.
- Reduced-motion alternatives preserve reward acknowledgement without major movement.

## Offline installation

Salita Quest is a Progressive Web App. The service worker caches the course engine, loaders, language packs, interface assets, avatars and reward runtimes. Network-first delivery keeps releases current while retaining offline fallback.

After a release, a hard refresh or fully closing and reopening an installed copy may be required once to replace the previous cache.

## Repository structure

- `app.js` — shared course engine
- `app.html` — Tagalog profile-aware loader
- `bisaya.html` / `bisaya-app-loader.js` — Cebuano course loader and engine transformation
- `languages/cebuano/` — Cebuano course, map and module packs
- `audio/audio_manifest.json` — static audio index
- `scripts/generate_cebuano_google_audio.py` — Google Cloud Gemini-TTS generator
- `placement-onboarding-v1.js` — beginner choice and 20-question placement check
- `badge-catalogue-v2.js` — ordered badge catalogue and badge persistence
- `badge-sharing-v1.js` — Badge Chest and share-card generation
- `social-links-v1.js` — optional learner social-profile links
- `home-reward-coordinator.js` — reliable Home-only Daily Key playback
- `pronunciation-release-control.js` — release-based pronunciation activation
- `service-worker.js` — installed/offline delivery

## Validation

The pull-request workflow runs course, shared UI, Home dashboard, mobile, key-run, progression/scenario/navigation, audio/badge and placement/share release checks.

Run the principal checks locally with Node.js 20 or later:

```bash
node scripts/validate-bisaya.mjs
node scripts/validate-ui-quality.mjs
node scripts/validate-home-dashboard.mjs
node scripts/validate-mobile-refinement.mjs
node scripts/validate-key-run-refinement.mjs
node scripts/validate-progression-scenarios-navigation.mjs
node scripts/validate-audio-badge-release.mjs
node scripts/validate-placement-sharing.mjs
```

## Privacy

The app does not automatically post rewards, badges or social content. Share controls use the device share sheet where supported or generate a local image file. Optional social links remain in the local profile. Google Cloud credentials are used only by the offline generation script and must never be exposed to the browser.