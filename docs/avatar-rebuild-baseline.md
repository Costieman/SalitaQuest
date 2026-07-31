# Avatar Rebuild Baseline

Recorded: 2026-07-31 21:30 PHT

This document freezes the starting point for the canonical avatar rebuild. It is a comparison baseline, not a statement that the current avatar implementation is acceptable.

## Frozen source reference

- Repository: `Costieman/SalitaQuest`
- Default branch: `main`
- Frozen main commit: `b9490dfd6fda901fb1acada1719e843d1d95e67c`
- Frozen reference branch: `baseline/avatar-v5-5-5-main`
- Commit title: `Stop avatar collections from freezing the browser`
- Runtime release named by the avatar artwork registry: `5.5.5`

The frozen reference branch must not be moved or used for new development. It exists only as the rollback and comparison point for the rebuild.

## Production entry points

- Home: `https://costieman.github.io/SalitaQuest/`
- Tagalog app: `https://costieman.github.io/SalitaQuest/app.html`
- Bisaya app: `https://costieman.github.io/SalitaQuest/bisaya.html`
- Cache recovery page: `https://costieman.github.io/SalitaQuest/mobile-refresh.html`

## Current offline/cache baseline

At the frozen commit, `service-worker.js` declares:

- previous cache: `salita-quest-v5-5-3-popup-governance-r46`
- active cache: `salita-quest-v5-5-4-avatar-artwork-r47`

This is an important inconsistency: the runtime hotfix identifies itself as 5.5.5, while the service-worker cache name still identifies the 5.5.4 artwork release. The rebuild must resolve this with one release identifier and one cache revision.

## Current active avatar runtime

The service worker actively caches all of the following avatar-related runtime layers:

1. `avatar-catalogue-v1.js`
2. `avatar-artwork-registry-v554.js`
3. `avatar-progression-hotfix-v551.js`
4. `avatar-progression-hotfix-v551.css`
5. `avatar-progression-migration-v1.js`
6. `avatar-collection-screen-v1.js`
7. `avatar-collection-screen-v1.css`
8. `weekly-avatar-shard-rewards-v1.js`
9. `weekly-avatar-shard-rewards-v1.css`
10. `level-avatar-rewards-v1.js`
11. `avatar-unlock-celebration-v1.js`
12. `avatar-unlock-celebration-v1.css`
13. `achievement-sharing-avatar-bridge-v1.js`

The active asset list also mixes:

- direct PNG files;
- WebP files;
- SVG files;
- SVG wrappers around shared artwork;
- one shared rare-animal sprite;
- runtime canvas extraction for sprite cells;
- local versioned paths;
- local unversioned paths;
- raw GitHub fallback paths;
- generated initials placeholders.

This overlapping image pipeline is the main architectural target of the rebuild.

## User-observed state at baseline

The supplied screenshots and reports establish the following current behaviour:

- the app itself can load and display learner navigation and collection screens;
- the browser-freezing observer loop introduced in 5.5.4 was removed in 5.5.5;
- the Avatar Collection is still not acceptable or reliable;
- several cards display initials placeholders instead of artwork;
- several avatars display the wrong, damaged, distorted or incomplete image;
- some supplied avatars do not appear correctly in the collection;
- equipped/profile artwork cannot yet be assumed to match the selected collection item;
- the implementation is difficult to navigate because several generations of fixes remain active together.

The current version must therefore be treated as a rollback point for learner functionality, not as a visual acceptance baseline for avatars.

## Functionality that must not regress

The rebuild must preserve all non-artwork behaviour already stored in learner profiles, including:

- learner profiles and profile PIN state;
- Tagalog and Bisaya course progress;
- stable content IDs and mastery history;
- XP, levels, streaks and coins;
- avatar ownership;
- avatar shard totals;
- weekly key progress and reward claims;
- level milestone claims;
- equipped avatar stable ID;
- unlock acknowledgement state;
- JSON backup/import and transfer compatibility;
- legacy avatar ID aliases required to read existing profiles.

No rebuild task may reset, rename or manufacture any of these values.

## Stable avatar identity contract

The collection contains exactly 48 catalogue identities. Their stable IDs are the persistence contract. Artwork filenames and rendering code may change, but existing saved IDs must continue to resolve to the same avatar identity.

The rebuild may normalize known historical aliases to canonical IDs. It must not keep a second active catalogue or a second active artwork resolver merely for compatibility.

## Freeze rules during the rebuild

Until the clean runtime is approved and merged:

1. `main` remains at the frozen behaviour unless an unrelated critical safety fix is required.
2. PR #41 and its experimental binary-transfer/generation approach must not be merged.
3. No new avatar hotfix layer may be added to `main`.
4. No service-worker revision is changed before the ordinary browser integration passes.
5. No learner persistence schema is changed during artwork work.
6. Every implementation branch must start from the frozen `main` baseline or from a reviewed successor to it.

## Required comparison gates

Every candidate stable release must be compared with this baseline and demonstrate:

- the app still opens for existing profiles;
- Tagalog and Bisaya progress remains intact;
- the collection opens without freezing;
- all 48 canonical images load;
- no real avatar falls back to initials;
- card, detail, profile emblem and popup artwork agree by stable ID;
- equipping survives navigation and reload;
- mobile and desktop layouts remain usable;
- offline installation uses one updated cache revision;
- no active sprite extraction, canvas artwork conversion, global avatar observer or duplicate resolver remains.

## Baseline conclusion

The frozen version protects learner data and provides a known rollback commit, but its avatar image architecture is not suitable for further patching. The rebuild should proceed from this reference toward one manifest, one resolver and 48 direct canonical assets.