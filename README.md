# Elsewhere

A cinematic, responsive life-exploration UI. Run `npm install`, then `npm run dev`. Build with `npm run build` using Node 22.22.0. On this Windows host, Node 24.13.0 crashes during vinext's shutdown after static prerendering; Node 22 completes successfully. Static output is `dist/client`.

## Included in this UI edition

- Animated canvas constellation tree, star field, parallax and spark transitions.
- Six selectable starting constellations; one-click randomized beginning.
- Nine age chapters with 44 decisions per run from a curated starter content library.
- Deterministic recombination, eligibility gates, remembered creative interests, money, keepsakes, and character changes.
- Interactive history map with zoom and alternative branches; earlier branches stay available.
- Device-local autosave, JSON save export/import, and an SVG constellation keepsake.
- Responsive touch layout, semantic choice controls, reduced-motion preference, optional synthesized ambient sound.

## Expand the experience

`app/content/world.ts` contains chapters, constellation options, avatar variants, and independent event records. Add an event in its chapter with a stable ID, three authored choices, and explicit effect data. Optional `requires` gates follow-ups on existing facts. `app/engine/life.ts` handles eligible selection, state transitions, branch history, and validation. `app/ui/Experience.tsx` renders the interface; `Cosmos.tsx` owns background animation.

Run `node tools/test-life.cjs` for simulation checks across all 729 starting combinations. Run `npm exec tsc -- --noEmit` for TypeScript validation.

## Scope and next steps

This release implements the UI and a playable first content edition, not all 180 cards in the longer project plan. Avatar visuals use six illustrated full-character variants; granular mix-and-match clothing, wedding outfits, and presentation customization remain future asset work. The economy is illustrative and deliberately simple: positive net monthly earnings and explicit event costs, without investments, debt, inflation, or real-world forecasts. Character details are fictional.

Saves remain on this device and can be exported. There is no account, server database, or per-choice AI inference. Broad cultural/locality packs and a full authoring editor are later work.

The optional WebMCP surface exposes `read_elsewhere_life` and `choose_elsewhere_path` where supported. Unsupported browsers simply use the visible UI.

## Validation recorded for this edition

- TypeScript passed and the production static export completed under Node 22.
- 2,187 complete simulated lives passed across all 729 starting combinations; all 58 event records were reached. Checks cover deterministic replay, retained alternate histories, chapter completion, and invalid-save/cycle rejection.
- No browser visual/interaction QA was performed; the Sites workflow reserves that for an explicit browser-testing request. Responsive desktop and mobile layouts are implemented, but real-device appearance remains a review step.
- A supported WebMCP invocation context was unavailable, so optional WebMCP tools were not runtime-verified.
- The pinned starter's dependency audit reports upstream issues. Only static HTML, CSS, JavaScript, and artwork are deployed; RSC server functions and image-processing endpoints are not hosted. Development tooling should be updated before exposing a dev server beyond localhost.
