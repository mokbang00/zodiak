# Zodiak visual QA

Date: 3 November 2026. The approved target is the supplied visual composition with mandatory PRD content retained. This is not a claim of literal whole-page pixel identity.

## Source and capture normalization

| View | Source visual truth | Source pixels | Implementation evidence | CSS viewport / density | Implementation pixels |
|---|---|---|---|---|---|
| Directory | docs/references/homepage.png | 2560 × 5210 | docs/qa/home.png | 1280 × 900, DPR 1 | 1280 × 2727 |
| Libra today | docs/references/detail-page.png | 648 × 1600 | docs/qa/detail.png | 1296 × 900, DPR 1 | 1296 × 3708 |
| Directory mobile | Desktop reference adapted to PRD | No mobile source supplied | docs/qa/home-mobile.png | 390 × 900, DPR 1 | 390 × 4153 |
| Detail mobile | Desktop reference adapted to PRD | No mobile source supplied | docs/qa/detail-mobile.png | 390 × 900, DPR 1 | 390 × 4261 |

The directory source is normalized to 1280px wide (assumed 2× export). The detail implementation is normalized to 648px wide for the source comparison (source assumed reduced from a 1296px desktop capture). These effective viewport assumptions are based on reference HTML and composition; original capture metadata was not supplied. Compare equal-width content, not raw export pixels.

State: normal fixture, Libra, today, 29 October 2026 reference date. Local fonts finish loading before capture; images are loaded and motion is disabled. Chrome renders the actual production build at http://localhost:3001.

## Combined evidence reviewed

- Full-page, source left / implementation right: `docs/qa/home-comparison.png` and `docs/qa/detail-comparison.png`.
- Focused typography, finder, spacing and hero assets: `docs/qa/home-hero-comparison.png` and `docs/qa/detail-hero-comparison.png`.
- Focused editorial title wrapping, photo crop, tonal overlay and colored cards: `docs/qa/latest-comparison.png`. Its two regions are aligned independently to each page's section start.
- Mobile reflow: `docs/qa/home-mobile.png` and `docs/qa/detail-mobile.png`. No matching mobile screenshot was supplied, so this checks PRD responsiveness rather than mobile pixel identity.
- Measured layout and computed font evidence: `docs/qa/metrics.json`; capture dimensions: `docs/qa/dimensions.json`.

## Comparison history and corrections

1. Initial comparison, preserved in `docs/qa/*-round-1.png`: P2 divider artwork was compressed vertically; P2 title weight/measure and editorial wraps differed; P2 photo used a uniform dark filter rather than a bottom-weighted overlay. Detail hero frame and title size also needed calibration. Result remained blocked.
2. Corrected intrinsic divider presentation, set the directory title to its measured 445px width at 72px, matched the detail frame to 1088px at a 1296px viewport, and adjusted heading size and grid spacing. Confirmed these in the focused hero and full-page comparisons. Period heading and content additions remain intentional.
3. Focused editorial comparison exposed the remaining P2 line-wrap and photo-treatment mismatch. Corrected the lead title measure to 560px, supporting headline measure to 180px, lead bottom inset and photo overlay. Recaptured the production build and reviewed `latest-comparison.png`: the three-line lead title, six-line Taurus title, source photograph crop and colored-card composition now follow the reference. No remaining actionable P0/P1/P2 findings for the approved scope.

## Required fidelity surfaces

- **Fonts and typography:** original self-hosted DM Serif Display, Plus Jakarta Sans and DM Sans are used. Italic face format is declared correctly. Main desktop title measures 445.47px, matching the source composition. Required period text is included in the H1 with a smaller visual line. Minor line-break and rasterization differences remain P3; no pixel-identical claim.
- **Spacing and layout:** six-column desktop grid, 7/5 hero split, 1200px directory content and 1088px detail hero match the reference layout. Latest grid starts at 1395.53px versus approximately 1393px in the normalized source. Main reading content has the reference's narrow measure. Added PRD sections increase detail height deliberately.
- **Colors and tokens:** blush #FDF2F8, magenta #DC2C67, purple #8C56A3, pale borders and white paper are retained. Normal small pink labels use darker ink for contrast. Sample contrast: body 9.03:1; purple on blush 4.84:1; metadata on white 5.44:1; white on purple 5.28:1; large magenta headings on blush 4.18:1.
- **Image fidelity:** original zodiac illustrations, tape, stars, wave/divider assets, swap-paper collage and editorial photos are local. No placeholder illustrations or screenshot-as-page implementation. Original asset URLs are in `docs/asset-manifest.json`. Source-resolution softness in editorial imagery is retained rather than replaced by a different photo.
- **Copy/content:** hero, finder and editorial titles follow the screenshot. All required PRD sections, full period headings, author and validity metadata are included. Explicit demo attribution prevents fictional credits being represented as production editorial data.

## Approved differences

- Directory breadcrumb and real fixture-update label, full detail period H1, author, summary, Karier and today profile are required PRD additions.
- Non-today pages show related editorial cards; today retains its sign profile.
- Preview disclosure/footer, 44px controls, visible keyboard focus, accessible contrast and functional finder/empty/error states are retained even when absent from static screenshots.
- Article URLs were absent from the reference material. Clearly labelled demo previews replace dead or invented editorial links.
- Detail ribbon wording changes by sign; decorative motion is not needed for the still comparison and reduced-motion users.

## Functional evidence and gaps

56 unit tests and 15 Chrome browser tests passed. Browser checks cover all 61 routes, HTTP 404, finder, period/sign navigation, Back/Forward, refresh, empty/failed/expired/draft scenarios, retry, carousel/dialog, metadata and tracking privacy. No missing images or uncaught browser exceptions were found; the capture log `docs/qa/browser-errors.json` is empty. Five viewport widths passed body-overflow checks. Final CSS-only editorial adjustments were rebuilt and recaptured after the browser suite.

Safari 17.6 is installed, but WebDriver refused a session because “Allow remote automation” is disabled (`docs/qa/safari.json`). No browser preferences were changed. Safari and real screen-reader testing remain manual checks. The 200% text-resize smoke test is not a full accessibility certification. No mobile reference exists for a literal mobile comparison.

## Implementation checklist

- [x] Original assets and local fonts.
- [x] Desktop reference comparison with focused hero/editorial regions.
- [x] Mobile responsive capture and five viewport checks.
- [x] P0/P1/P2 defects corrected and recaptured.
- [x] Functional regression checks and true 404 handling.
- [x] Documented PRD additions and production integration limits.

## Follow-up polish

P3: minor text wrapping, type rasterization, and decorative ribbon density differ slightly from the exported images. These do not change navigation, content hierarchy or the approved composition. Whole-page heights differ because the implementation includes required PRD content and a demo disclosure.

final result: passed
