# Zodiak prototype

Indonesian zodiac directory and 60 forecast destinations, built afresh with Next.js App Router and TypeScript. The supplied screenshots govern visual presentation; the PRD governs behavior. Original illustrations, photos, decorations, and self-hosted fonts are included.

## Run

Requires Node.js 24 and npm (Vitest requires Node 22.12+ or 24+). Use only npm and commit `package-lock.json`.

```sh
npm ci
npm run dev
```

Open http://localhost:3001/zodiak. Port 3001 avoids the neighboring project's server. For a production-mode local preview:

```sh
npm run build
npm run start
```

All content is illustrative, the demo is noindex, and events remain in browser memory. No authentication, database, CMS, n8n, production analytics, or deployment is configured.

## Configuration and scenarios

Copy `.env.example` to `.env.local` if customization is needed. `DEMO_REFERENCE_DATE` defaults to `2026-10-29`; `SITE_URL` defaults to `http://localhost:3001`. Change the base URL when changing the preview port. Restart/rebuild after changing configuration. All calculations use Asia/Jakarta and Monday–Sunday weeks. The demo clock is intentionally fixed and does not silently relabel old content with the real current date.

Append `?scenario=unavailable`, `failed`, `expired`, `draft`, or `empty-articles` to a directory/detail URL. Normal is the default. Expired and draft forecasts never expose their body or Article schema. Retry removes the simulated failure and reloads the normal record. Period and sign navigation retain a selected scenario; breadcrumbs return to the normal experience.

Articles in the supplied HTML have no real editorial destinations. Cards therefore use explicit demo fragment URLs and open accessible, closable previews. Replace the fixture's `url` with a verified existing CMS URL and set `demoDestination: false` to navigate directly. No new editorial route is created.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Browser tests use installed Google Chrome on macOS and start the built app when no local server is running. To use another platform, update `launchOptions.executablePath` in `playwright.config.ts` to the local Chromium executable or remove it after installing Playwright Chromium. `npm run build` must precede browser testing. Safari Remote Automation is disabled on this machine, so Safari verification remains pending; no preferences were changed. To repeat the capability check after enabling it yourself, run `safaridriver --port 4444` and `node scripts/safari-smoke.mjs`.

`node scripts/capture-qa.mjs` captures 1280px directory, 1296px detail, and 390px mobile pages, plus combined reference comparisons. It uses `sharp` for comparison artifacts, not for constructing page imagery. See `design-qa.md` and `docs/validation.md` for evidence and limitations.

## Project map

- `app/zodiak/`: directory and detail templates plus finder, period navigation, and article previews.
- `app/lib/`: server-only configuration, fixture adapter, and metadata. The fixture adapter generates 60 unique sample records from a single clock and editorial configuration.
- `lib/`: client-safe calendar, route, finder, state validation, and analytics utilities.
- `app/types/`: shared content contracts for a future adapter.
- `public/`: local fonts and reference assets. `docs/asset-manifest.json` records original image URLs and aliases are documented separately.
- `tests/` and `e2e/`: domain and browser regression checks.

The app's public pages do not require session checks. Server Actions and APIs are deliberately absent because this prototype does not mutate server data. Future protected integrations must follow the authentication, validation, and audit rules in `AGENTS.md`.

## Handoff

See `docs/routes.md`, `docs/events.md`, `docs/visual-spec.md`, `docs/validation.md`, and `design-qa.md`. Production integration requires editorial URLs, reviewed content and identity, a CMS/n8n source contract, caching rules, consent-aware analytics, and release QA. Do not remove noindex or publish demo fixtures as production content.
