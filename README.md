# Elsewhere

A cinematic, responsive life-exploration UI. Run `npm install`, then `npm run dev`. Build with `npm run build` using Node 22.22.0. On this Windows host, Node 24.13.0 crashes during vinext's shutdown after static prerendering; Node 22 completes successfully. Static output is `dist/client`.

## Included in this UI edition

- Animated canvas constellation tree, star field, parallax and spark transitions.
- Six selectable starting constellations; one-click randomized beginning.
- Nine age chapters with 44 decisions per run from a curated starter content library.
- Deterministic recombination, eligibility gates, remembered creative interests, money, keepsakes, and character changes.
- A chapter overview and chronological decision explorer with remembered consequences, alternate choices, and an always-visible return control; earlier branches stay available.
- Device-local autosave, JSON save export/import, and an SVG constellation keepsake.
- Larger rounded Nunito typography, responsive touch layout, semantic choice controls, and reduced-motion preference.
- Three illustrated characters with six outfits each and four selectable orbiting charms. Outfit changes can follow life choices or stay manually selected; appearance preferences persist locally, independently of story saves.
- Seven editorial choice themes with quiet colored nebulas: Courage, Connection, Comfort, Discovery, Devotion, Independence, and Letting go.
- Optional original 16-bar melodic space score, “Between stars,” with softly decaying notes and reverb. This is not a recording or arrangement of Interstellar.

## Expand the experience

`app/content/world.ts` contains chapters, constellation options, avatar roles, and independent event records. Add an event in its chapter with a stable ID, three authored choices, and explicit effect data. Add its three editorial categories to `app/content/choice-themes.ts`; the test checks every event has an explicit mapping. Categories describe intent, not good/bad outcomes. Optional `requires` gates follow-ups on existing facts. `app/engine/life.ts` handles eligible selection, state transitions, branch history, and validation. `app/ui/Experience.tsx` renders the interface; `Cosmos.tsx` owns background animation, `LifeMap.tsx` handles chapter/decision exploration, `Avatar.tsx` defines characters and wardrobes, and `useAmbientScore.ts` owns the original music.

Run `node tools/test-life.cjs` for simulation checks across all 729 starting combinations. Run `npm exec tsc -- --noEmit` for TypeScript validation.

## Scope and next steps

This release implements the UI and a playable first content edition, not all 180 cards in the longer project plan. Avatar visuals use 18 illustrated full-character variants with different gender presentations and skin tones; granular mix-and-match garment layers, wedding outfits, and broader body customization remain future asset work. Character appearance does not gate life choices. The economy is illustrative and deliberately simple: positive net monthly earnings and explicit event costs, without investments, debt, inflation, or real-world forecasts. Character details are fictional.

Saves remain on this device and can be exported. There is no account, server database, or per-choice AI inference. Broad cultural/locality packs and a full authoring editor are later work.

The optional WebMCP surface exposes `read_elsewhere_life` and `choose_elsewhere_path` where supported. Unsupported browsers simply use the visible UI.

## Validation recorded for this edition

- TypeScript passed and the production static export completed under Node 22.
- 2,187 complete simulated lives passed across all 729 starting combinations; all 58 event records were reached. Checks cover deterministic replay, retained alternate histories, chapter completion, and invalid-save/cycle rejection.
- All 58 events have explicit valid choice-theme mappings. The score repeats correctly after 16 bars, with bounded MIDI notes, velocities, durations, and timing.
- No browser visual/interaction QA was performed; the Sites workflow reserves that for an explicit browser-testing request. Responsive desktop and mobile layouts are implemented, but real-device appearance remains a review step.
- A supported WebMCP invocation context was unavailable, so optional WebMCP tools were not runtime-verified.
- Audio composition and scheduling were source-checked, not auditioned on the user's speakers.
- The pinned starter's dependency audit reports upstream issues. Only static HTML, CSS, JavaScript, and artwork are deployed; RSC server functions and image-processing endpoints are not hosted. Development tooling should be updated before exposing a dev server beyond localhost.
