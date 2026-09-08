# Elsewhere

Elsewhere is a cinematic, interactive life-exploration experience. Start from six constellations, make choices across nine chapters, and revisit the alternate lives that branch from each decision.

## Requirements

- Node.js 22.13 or later (Node 22 LTS is recommended)
- npm

## Run locally

```bash
npm ci
npm run dev
```

Open the local URL printed by the development server (normally `http://localhost:3000`).

## Validate and build

```bash
# Type-check the app
npm exec tsc -- --noEmit

# Simulate every starting combination and validate branching logic
node tools/test-life.cjs

# Create the production static site
npm run build
```

The production site is written to `dist/client`. It is intentionally static: choices, saves, and avatar preferences stay in the visitor's browser; no environment variables or database are required.

## Deploy with Vercel

Import this repository into Vercel. `vercel.json` pins the required build and output settings, so no dashboard build overrides are required. If you prefer to set them in the dashboard, use:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist/client` |
| Node.js version | 22.x |

No environment variables are needed. Do not use `npm start` for Vercel: it is a local Cloudflare Workers development command left over from the original scaffold, while Vercel should serve the static `dist/client` output. The Vite configuration intentionally has no OpenAI Sites plugin or `.openai` metadata, so this build works independently on Vercel.

## Project structure

- `app/content/` — chapters, life events, and choice themes
- `app/engine/` — deterministic branching, state, and save validation
- `app/ui/` — interactive screens, constellation canvas, avatar wardrobe, life map, and ambient score
- `public/` — avatar sprite art and favicon
- `tools/test-life.cjs` — branching simulation test

## Notes for contributors

Every life event has exactly three choices and each choice must have an explicit theme in `app/content/choice-themes.ts`. The simulator check ensures the full event library remains reachable across the starting constellations.

The included avatar artwork is original, stylized fictional character art. See `docs/avatar-art.md` for its generation notes.
