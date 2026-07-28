# Salita Quest: Bisaya

This directory contains the Cebuano/Sinugbuanong Binisaya language layer for Salita Quest.

## Current playable scope

- Beginners Bay: greetings, courtesy, replies, and leave-taking
- Name Village: names, preferred names, introductions, and occupations
- 30 course items across the first two regions
- 18 authored starter exercises, with exactly six tokens in every sentence-builder word bank
- Separate progress for each learner and language
- In-app switching between Tagalog and Bisaya through the learner-profile menu

The remaining regions stay visible on the shared map but remain locked until reviewed content is added.

## Structure

- `course.json` — course metadata, map, module definitions, Beginners Bay items, and initial exercises
- `modules/manifest.json` — ordered list of additional module packs
- `modules/introductions.json` — Name Village content and dialogue

Additional regions should be implemented as independent module packs and added to the manifest. This keeps the Cebuano content maintainable while the application engine remains shared with Tagalog.

## Language policy

The primary target is contemporary conversational Cebuano, commonly called Bisaya. The course does not treat Cebuano, Hiligaynon, Waray, and other Visayan languages as interchangeable.

Regional, spelling, and register alternatives may be recorded in `accepted` fields. Alternatives should be accepted only when they preserve the intended meaning and remain natural in a relevant Cebuano-speaking context.

All lesson material remains marked for fluent or native Cebuano review before a production release.

## Audio policy

Tagalog pronunciation must never be substituted for Cebuano. The Bisaya runtime uses only:

1. verified static audio mapped to `ceb-PH`; or
2. a browser voice explicitly identified as Cebuano.

When neither is available, audio remains disabled and the written lesson continues normally.

## Progress compatibility

Tagalog and Cebuano progress use separate profile-and-course keys. Existing Tagalog progress is migrated to the Tagalog namespace and is not overwritten when the learner switches to Bisaya.

## Validation

Run:

```bash
node scripts/validate-bisaya.mjs
```

The validator checks JavaScript syntax, JSON parsing, map and module integrity, duplicate item IDs, exercise references, engine transformation markers, the six-token sentence-builder rule, and the absence of calls to the Tagalog speech endpoint.

## Reference material used for drafting

- John U. Wolff, *A Dictionary of Cebuano Visayan* (1972), digitised search edition
- Bohol.ph Cebuano phrasebook, including biographical questions and introductions
- Omniglot and Wikivoyage Cebuano phrase references for comparison of common alternatives

These sources support initial drafting but do not replace fluent-speaker review of contemporary usage.
