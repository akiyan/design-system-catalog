# Design QA

Source visual truth: `docs/selected-design.png` (selected option 3).
Implementation screenshot: `docs/implementation-desktop-final.png`.
Additional evidence: `docs/implementation-mobile-final.png`, `docs/implementation-mobile-preview-final.png`, `docs/implementation-astryx.png`.
Local implementation: http://127.0.0.1:4174/ (built static output).
Viewport: desktop 1440 × 1024 CSS px; mobile 390 × 844 CSS px. Device scale factor: 1.
Source pixels: 1487 × 1058. Implementation pixels: 1440 × 1024. Source normalized to 1440 × 1024 for density comparison.
State: initial catalog, Digital Agency selected, button preview active. Additional state: Astryx search result.

## Comparison history

### Initial comparison — blocked

Full-view evidence: `docs/comparison-desktop.jpg`.
Focused evidence: `docs/comparison-detail.jpg` (masthead/list and selected preview).

- [P2] Japanese titles were lighter than the reference. Fixed by explicitly selecting Noto Sans CJK JP when installed.
- [P2] Row previews created excessive vertical list spacing. Fixed by changing thumbnail aspect ratio from 1.85 to 2.15 and minimum row height from 171px to 166px.
- [P1] A mobile click could arrive before React hydration. Fixed by disabling interactive controls until hydration completes.

### Second comparison

Evidence: `docs/comparison-desktop-v2.jpg` and `docs/comparison-detail-v2.jpg`.
The preceding font, density and interaction issues were resolved. Mobile capture revealed horizontal clipping in the main preview. Changed main preview object fit from cover to contain to preserve the complete official screenshot.

### Final comparison — passed

Full-view evidence: `docs/comparison-desktop-final.jpg`, source on left and implementation on right in the same comparison image.
Focused evidence: `docs/comparison-detail-final.jpg`, source/implementation side by side for masthead, selected row and main preview.
Production captures at 1440 × 1024 and 390 × 844 confirm the corrections. Mobile main screenshot retains its complete width. The expanded dialog provides a larger view.

## Required fidelity surfaces

- Fonts/typography: bold Japanese masthead, 26px selected title, 20px row titles and readable 14–16px controls. Noto Sans CJK JP corrects the earlier font weight mismatch. Long names wrap within their columns.
- Spacing/layout rhythm: 76px header, 40%/60% split, 166px minimum rows, dominant preview, three supporting images, restrained 15–25px gaps. Footer intentionally reserves 44px. Panels scroll independently on desktop; mobile has list/detail navigation.
- Colors/tokens: white page, pale gray header, #003cff selection and primary action, restrained gray dividers. Focus rings remain visible.
- Image quality/assets: real official-site WebP captures at 1440 × 1000. No invented component UI, flags, placeholder art or handwritten SVG. Phosphor library supplies interface icons including GitHub. Main image preserves aspect ratio; list previews crop from the top. All 15 primary thumbnail images load.
- Copy/content: direct Japanese catalog labels. No comma-separated catchphrases. Added Astryx as requested, bringing totals to 15 / 12 public / 3 corporate-OSS. Footer includes GitHub icon/link and Copyright © 2026 @akiyan.

## Expected differences

Official websites differ from the generated mock imagery. Current captures preserve their actual content and styling. The requested copyright/GitHub footer and Astryx count are intentional additions. Country metadata uses names rather than emoji flags. Supporting DADS previews show current button, input and typography documentation. Gestalt component documentation requires sign-in and is excluded.

The GitHub footer currently links to the author's profile because no catalog repository URL has been supplied. `PUBLIC_GITHUB_URL` configures the repository once available.

## Verification

- `npm run build` passes with Astro static output.
- All four Playwright tests pass against the built static preview on port 4174.
- Tested search, categories, zero results/reset, selection, Astryx official link, secondary previews, zoom navigation, Escape dismissal, mobile back navigation, persistent footer and horizontal overflow.
- Every primary thumbnail loads; static HTML includes catalog content before hydration.
- Browser page errors and console errors: none.
- Screenshot capture script reports `consoleErrors: []`.

## Implementation checklist

All P0/P1/P2 issues from the comparisons have been fixed and verified.

## Follow-up polish

P3: some official homepages emphasize marketing imagery rather than components. Additional component-page captures can enrich those entries over time.

final result: passed

## Public deployment verification

URL: https://design-system-catalog-925.pages.dev/
Deployment: https://684712d7.design-system-catalog-925.pages.dev/
Cloudflare account: verified author account.
Pages API confirms production deployment status `success` and `uses_functions: false`.
Browser capture: `docs/deployed-desktop.png` (1440 × 1024).
The first request during propagation returned Cloudflare 522. Subsequent requests return HTTP 200. All four end-to-end tests pass against the public URL including the 15-thumbnail check. No site code changes were required.

## Catalog feature update

User-requested changes: public repository, Japanese/English detection and switcher, keyboard navigation with a `?` overlay, publication evidence, newest-first ordering, static path permalinks, and removal of keyword search.

Source baseline: `docs/deployed-desktop.png` (previous deployed catalog), with original visual direction retained in `docs/selected-design.png`.
Updated implementation: `docs/update-desktop.png` at 1440 × 1024 CSS px, density 1, Japanese, DADS button preview selected.
Full-view comparison: `docs/update-comparison.jpg` places both states side by side. Detail comparison: `docs/update-comparison-detail.jpg` shows the header and catalog rows. Both captures use the same 1440 × 1024 viewport and selected DADS preview.

Intentional changes: keyword field removed; language and keyboard controls added; publication dates and a sorting caption added; DADS now occupies its chronological position. The 40/60 split, preview dimensions, typography, colors, screenshot assets and copyright footer are preserved.

Additional states inspected: `docs/update-english.png`, `docs/update-keyboard-help.png`, `docs/update-mobile-list.png`, `docs/update-mobile-detail.png`, `docs/update-astryx.png`.

Required fidelity surfaces:
- Typography: Japanese and English headings wrap within their columns; small metadata remains readable. No placeholder or catchphrase copy.
- Spacing: desktop header controls fit without overflow; mobile controls use the existing compact stacked header. Dates fit within existing rows. Detail and list scrolling preserve the footer.
- Colors: existing blue, neutral surfaces, dividers and focus rings retained.
- Imagery: all official captures retained and decoded before verification. No drawn or generated replacement assets.
- Content: both UI languages, release references, path URLs, repository destination and shortcut help match the requested behavior. Original captured websites retain their own languages.

A functional P1 found during testing was fixed: Tab at the last modal control could place focus on the browser/document. Both dialogs now explicitly cycle focus within their controls and restore it on dismissal. The post-fix keyboard test passes.

All 11 tests pass against built static output on port 4174. They cover all 15 direct paths, no-JavaScript links, URL history, locale detection/persistence, date order/evidence, modal focus and keyboard actions, images and mobile behavior. Browser errors: none; screenshot capture reports `consoleErrors: []`.

No actionable P0/P1/P2 visual differences remain. Existing expected source-site screenshot differences remain applicable. Full publication evidence is stored with each entry in `src/data/systems.json`; reference dates remain visibly marked.

final result: passed

## Public verification of the feature update

Updated production deployment: https://c5a94304.design-system-catalog-925.pages.dev/
Canonical URL: https://design-system-catalog-925.pages.dev/
Repository: https://github.com/akiyan/design-system-catalog (public, main).
Cloudflare reports successful deployment with `uses_functions: false`.
The homepage and direct paths `/astryx/` and `/dads/` return HTTP 200 with the new controls and no keyword search field. All 11 tests pass against the canonical public URL, including the 15 static routes and navigation without JavaScript.

final result: passed
