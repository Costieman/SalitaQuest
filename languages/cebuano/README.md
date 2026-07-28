# Salita Quest: Bisaya — Cebuano course pack

This directory starts a Cebuano/Sinugbuanong Binisaya edition of Salita Quest while retaining the existing interface, map, reward system, mastery logic, sentence-builder exercises, profiles, and review modes.

## Current scope

- Complete 13-location map metadata
- Ten reusable teaching modules
- A separate Cebuano progress namespace
- Beginners Bay vocabulary and phrase analysis
- Twelve starter exercises, including six-token sentence-builder banks
- Accepted regional and spelling alternatives where they are common

The course pack is intentionally separate from the Tagalog constants currently embedded in `app.js`. The next implementation step is to make the engine load a selected course pack rather than duplicating the application logic.

## Language policy

The primary target is contemporary conversational Cebuano, commonly called Bisaya. “Bisaya” is broader than Cebuano and may also refer to other Visayan languages; the interface and documentation should therefore identify the course as Cebuano/Sinugbuanong Binisaya.

Regional alternatives should be stored in `accepted` fields rather than deleted. Examples in the foundation pack include:

- `pud` / `sad`
- `palihug` / `palihog`
- `gabii` / `gabi-i`
- `walay sapayan` / `way sapayan`

A fluent Cebuano speaker should review each completed module before it is marked production-ready, especially pronunciation, particle use, register, and regionally marked vocabulary.

## Integration plan

1. Extract the Tagalog `MODULES`, `MODULE_META`, `ITEMS`, and exercise data from `app.js` into a Tagalog course pack.
2. Add a small course loader that selects `tagalog` or `cebuano` before the learning interface opens.
3. Namespace progress by course and learner so Tagalog and Cebuano mastery never overwrite one another.
4. Replace hard-coded labels such as “Tagalog” with values from the selected course pack.
5. Add Cebuano-capable audio; never use Tagalog speech as a pronunciation fallback.
6. Run schema validation and manual language review before expanding beyond Beginners Bay.

## Reference material used for the foundation

- John U. Wolff, *A Dictionary of Cebuano Visayan* (1972), digitised search edition: https://www.bohol.ph/wced.php
- Peace Corps-derived Cebuano phrasebook hosted by Bohol.ph: https://www.bohol.ph/article123.html
- Learn Bisaya essential phrase guide: https://learnbisaya.net/blog/essential-bisaya-phrases-your-first-steps-to-speaking-cebuano

These references support initial drafting but do not replace native-speaker review of contemporary usage.
