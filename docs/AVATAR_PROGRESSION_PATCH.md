# Salita Quest — Avatar Collection and Account Progression Patch

## Patch objective

This patch introduces a unified account-progression system centred on collectible avatars. The system gives learners visible long-term progression without altering the core learning, mastery, spaced-repetition, XP, coin, streak, backup, or migration systems already used by Salita Quest.

Avatar ownership is account-wide and applies across both the Tagalog and Bisaya journeys.

## Starting avatars

New learners choose one of four equal-status Philippine flora avatars:

1. Anahaw
2. Waling-Waling Orchid
3. Jade Vine
4. Philippine Rafflesia

The selected avatar becomes the learner’s account identity until they equip another unlocked avatar.

## Rarity system

| Category | Content | Main acquisition |
|---|---|---|
| Starter | Four initial flora choices | Account creation |
| Common | Leaves, trees, palms, fruits and simpler plant forms | Level milestones or one weekly box |
| Uncommon | Flowers, special botanicals, cultural objects and symbols | Level milestones or two weekly boxes |
| Rare | Philippine animals | Weekly-key progression only |
| Special | Prestige rewards | Major milestones |

These labels describe game progression, not ecological abundance or conservation status.

## Level rewards

Avatars are awarded at Levels **10, 20, 30, 40, 50, 60, 70, 80, 90 and 99**. Levels 10–90 use common or uncommon avatars. Animals remain weekly-key rewards. Level 99 awards the exclusive **Golden Salita Crest**.

## Weekly keys and learner choice

Six Daily Keys unlock one weekly reward choice. The learner directs the reward to any eligible avatar:

| Path | Weekly reward | Standard completion time |
|---|---:|---:|
| Common | 100 shards | 1 week |
| Uncommon | 50 shards | 2 weeks |
| Rare animal | 25 shards | 4 weeks |

Every avatar requires 100 shards. Rewards are never randomly assigned, and the learner may begin a new target or continue one already in progress.

## Avatar Collection

The collection displays all 48 avatars:

- unlocked avatars appear in full colour and can be equipped;
- partial avatars reveal colour from bottom to top according to shard progress;
- locked avatars remain visible in grey;
- each card and detail panel shows status, shard total, rarity and acquisition source.

The equipped avatar is shared across both courses and appears on profile controls and generated social cards.

## Unlock celebrations

A newly completed avatar is queued for the next visit to the Avatar Collection. The avatar appears centrally, changes to full colour, spins and settles before the learner can equip it or continue. Multiple unlocks play one at a time, and reduced-motion settings receive a simplified acknowledgement.

## Initial catalogue

The release contains **48 avatars**:

- 8 original avatars;
- 8 common plants;
- 8 uncommon flowers and special botanicals;
- 8 uncommon objects and symbols;
- 16 additional rare animals.

The catalogue includes the corrected Luzon bleeding-heart dove: its chest marking is narrower and irregular rather than a symmetrical Valentine heart, with darker feather shading around the eyes.

## Artwork standard

All artwork follows the existing Salita Quest pixel-art language: square canvas, transparent background, centred subject, readable silhouette, dark external outline, front lighting and no text or scenery. Transparency is limited to the outside of the subject. Animal eyes are fully rendered with surrounding feather, fur, scale or skin detail rather than transparent cut-outs.

The final app sprites are delivered as a compact transparent WebP atlas and exposed as 128 × 128 avatar assets at runtime.

## Data and migration

Stable avatar IDs preserve ownership if display names or artwork later change. Account data stores:

- equipped avatar ID;
- owned avatar IDs;
- shard balances;
- pending unlock celebrations;
- claimed level milestones.

Existing profile avatars are retained and treated as owned. Legacy random weekly rewards are migrated into completed ownership. Existing learning progress remains unchanged.

## QA and acceptance

The release is accepted when:

1. the catalogue contains 48 unique avatars and four starters;
2. all milestone levels have configured rewards;
3. weekly rewards add exactly 100, 50 or 25 shards;
4. the learner freely chooses the target;
5. grey and partial states render correctly;
6. unlock celebrations play once;
7. owned avatars can be equipped and persist across courses;
8. social cards use the current avatar;
9. all runtime and artwork assets are cached for offline installation;
10. existing learner progress remains intact.
