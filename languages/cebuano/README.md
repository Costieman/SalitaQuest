# Salita Quest: Bisaya

This directory contains the Cebuano/Sinugbuanong Binisaya language layer for Salita Quest.

## Current playable scope

- Beginners Bay: greetings, courtesy, replies, and leave-taking
- Name Village: names, preferred names, introductions, and occupations
- Home Hills: origin, residence, family, and explaining that the learner is studying Bisaya
- Feeling Forest: wellbeing, physical sensations, emotions, and common discomforts
- Question Crossroads: clarification, repetition, slower speech, meanings, essential questions, and requests for help
- Market Port: wants, availability, quantities, prices, ordering, payment, change, and receipts
- Grammar Bridge: pronouns, noun markers, linkers, location words, demonstratives, and high-frequency particles
- 122 course items across the first seven regions
- 71 authored starter exercises, with exactly six tokens in every sentence-builder word bank
- Separate progress for each learner and language
- In-app switching between Tagalog and Bisaya through the learner-profile menu

The remaining regions stay visible on the shared map but remain locked until reviewed content is added. The next planned module is Verb Volcano, introducing high-value roots and useful aspect and voice patterns through complete sentences.

## Structure

- `course.json` — course metadata, map, module definitions, Beginners Bay items, and initial exercises
- `modules/manifest.json` — ordered list of additional module packs
- `modules/introductions.json` — Name Village content and dialogue
- `modules/origin.json` — Home Hills content and dialogue
- `modules/wellbeing.json` — Feeling Forest content and dialogue
- `modules/questions.json` — Question Crossroads content and dialogue
- `modules/food.json` — Market Port content and dialogue
- `modules/grammar.json` — Grammar Bridge content and dialogue

Additional regions should be implemented as independent module packs and added to the manifest. This keeps the Cebuano content maintainable while the application engine remains shared with Tagalog.

## Language policy

The primary target is contemporary conversational Cebuano, commonly called Bisaya. The course does not treat Cebuano, Hiligaynon, Waray, and other Visayan languages as interchangeable.

Regional, spelling, and register alternatives may be recorded in `accepted` fields. Alternatives should be accepted only when they preserve the intended meaning and remain natural in a relevant Cebuano-speaking context.

All lesson material remains marked for fluent or native Cebuano review before a production release.

## Content cautions

- Questions about marriage and family are taught because they occur in reference phrasebooks, but the lesson notes that they may be too personal in some contexts.
- Physical and emotional expressions are taught as language patterns, not as medical guidance.
- Experienced-state forms such as `gikapoy ko`, `gigutom ko`, and `giuhaw ko` are preserved rather than reshaped to imitate English adjective order.
- Clarification phrases are deliberately repeated across exercises because they are recovery tools that must remain accessible under conversational pressure.
- Market Port treats requests such as `walay baboy` as basic language. Learners should communicate allergies explicitly rather than relying on a preference phrase for safety.
- English `bill` is retained where natural code-switching is common, while price, quantity, and payment structures remain Cebuano.
- Grammar Bridge avoids presenting `ang`, `og`, and `sa` as direct one-word equivalents of English articles or prepositions. Their lesson descriptions focus on how they mark relationships within Cebuano sentences.
- `kita` and `kami` are taught separately because including or excluding the listener changes the meaning of “we.”
- Particles such as `man`, `ra`, `pa`, `na`, and `gyud` are introduced through complete phrases because their English translation depends strongly on context.

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

The validator checks:

- JavaScript syntax and JSON parsing
- the 13-location map and sequential release order
- duplicate map, module, item, module-pack, and exercise IDs
- item, exercise, and module references
- token analysis and native-review status
- exactly six selectable tokens in every sentence builder
- inclusion of every answer token in its word bank
- required shared-engine transformation markers
- offline caching of every registered module pack
- the absence of calls to the Tagalog speech endpoint

## Reference material used for drafting

- John U. Wolff, *A Dictionary of Cebuano Visayan* (1972), digitised search edition
- Bohol.ph Peace Corps-derived Cebuano phrasebook
- *Cebuano Grammar Notes*, University of Hawai‘i Press digital edition
- Universal Dependencies Cebuano documentation for markers, linkers, and particles
- Contemporary Cebuano teaching references used to compare regional and conversational alternatives

These sources support initial drafting but do not replace fluent-speaker review of contemporary usage.
