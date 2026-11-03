# Validation record

This document records prototype readiness, not production readiness or validated astrology.

## Acceptance coverage

- 61 public destinations with server-rendered copy and real navigation links; today profile and non-today related content.
- Exactly 12 directory signs and 11 alternatives per detail; sign/period navigation preserves context.
- Finder uses a single editorial range table, accepts 29 February, rejects impossible days, validates month changes, shows an explicit result CTA, and keeps raw input local.
- Fixed configurable date, Jakarta timezone, separate forecast validity and publication/update timestamps. Expired/draft content is hidden rather than relabelled.
- Loading skeleton, top navigation progress, unavailable/error/expired scenarios, retry and a helpful not-found page.
- One H1, Indonesian language, landmarks, labelled controls, focus styling, reduced motion, screen-reader error/result announcements and keyboard-closable article preview.
- Metadata, canonical and JSON-LD derive from the page's content configuration; previews are noindex.
- All seven specified events have a local collector; page tracking excludes birth inputs and query strings.

## Results

- Production build: passed.
- TypeScript and ESLint: passed.
- Unit tests: 56 passed.
- Browser tests: 15 passed, including all 61 route responses and true HTTP 404.
- Browser console exceptions and missing image checks: none.
- Body overflow: none at 360, 390, 768, 1024 and 1440px on directory and detail templates.
- Contrast samples: body 9.03:1, purple on blush 4.84:1, metadata on white 5.44:1, white on purple 5.28:1, large pink headings on blush 4.18:1. Small breadcrumb pink uses a darker accessible ink.

## Checks and evidence

Unit suite covers all 24 sign boundaries, every valid day of a leap-year calendar, invalid/empty input, year wrap, Jakarta midnight, Monday–Sunday boundaries, leap/non-leap months, year transitions, fixture identities, publication ordering, status filtering and article order.

Browser suite covers all 61 responses and canonicals, HTTP 404, deep links and refresh, Back/Forward, finder, period preservation, states and retry, empty feeds, carousel/dialog, event privacy, image loading, console exceptions, five viewport widths and a text-resize interaction smoke test. The resize smoke test is not a comprehensive assistive-technology certification.

Visual capture covers directory at 1280 CSS px, detail at 1296 CSS px, and both at 390px. Source normalization and deviations are in `../design-qa.md`.

## Limits and production decisions

- No live CMS/n8n, production analytics, database, auth, hosting or production indexing verification.
- Real editorial article URLs are absent from the references. Demo previews are intentional; verified existing URLs are required for production.
- Chrome is the available automated browser. Safari 17.6 WebDriver was checked, but session creation was rejected because “Allow remote automation” is disabled. No Safari preferences were changed. Safari and actual screen-reader testing remain manual handoff checks; see `qa/safari.json`.
- Fixture author/publisher are explicitly demo identities, not asserted editorial credits. Replace them with actual reviewed records during integration.
- Dependency audit initially reported 16 moderate development-tool findings through minimatch. No high/critical findings were reported. Do not apply the suggested force downgrade of ESLint/Next configuration; review compatible upstream fixes separately. These are not part of the page runtime.
- The Impeccable launcher was unavailable due to its external cache requirement; its written craft guidance was applied directly.

## User validation tasks

1. Find a sign using day/month, then open its forecast.
2. Open tomorrow and then this week, explaining the dates being read.
3. Change signs and confirm the selected period remains active.
4. Enter a detail route directly and return to the directory.

Record independent task completion, navigation errors and understanding of forecast validity. UXR participant count and the suggested 80% success threshold require a separate validation session.
