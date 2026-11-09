# Catalog additions QA

Status: PASS

Added 28 requested systems, bringing the catalog to 43 entries (12 public-sector, 31 enterprise/OSS). Existing entries are deduplicated. Aggregator and comparison sites are excluded.

Compared the previous and updated DADS selection at 1440×1024. The left thumbnail list, 40/60 panel split, large source preview, spacing, typography, controls and footer remain consistent. Counts and date-sorted list content changed as expected. Reviewed both new-entry contact sheets and the Wise direction capture. All primary thumbnails show actual official sources, including the current Ikyu and Audi URLs. Serendie uses its component page as the leading capture. Twilio Paste uses its official repository because the former docs address now redirects there.

Desktop, English, keyboard-help and 390×844 mobile screenshots are in `docs/update-*.png`. No console errors or horizontal overflow were found. All 12 Playwright tests passed against the static preview, including every individual path, source image loading, browser history, keyboard selection and localization. Astro generated 44 static HTML pages.

Reference dates remain visibly marked. Repository creation dates and contextual dates are not presented as confirmed launches. Public documentation does not imply unrestricted brand asset reuse.

Production deployment: https://984a8fd2.design-system-catalog-925.pages.dev

Cloudflare reports a successful deployment with no Functions.
All 12 browser tests also passed against the production URL, including every catalog permalink and added source capture.

## Mobile sequential browsing

Status: PASS. Reviewed `mobile-system-navigation.png` and `mobile-unselected-list.png` at 390×844. The mobile list has no selected border or current-page marker. Details show back-to-list, previous/next controls and a category-relative position. Verified English at 320px without horizontal overflow. Desktop layout is unchanged.

All 14 tests passed locally. Real Chromium touch events verify left/right swipe navigation, list boundaries, vertical-scroll gestures and tap-to-zoom without accidental zoom after swiping. Category-aware buttons and native path links are covered.

Production https://0e83ca87.design-system-catalog-925.pages.dev deployed successfully. Both new mobile browsing tests also passed against the production domain.

## Compact mobile header

Status: PASS. Mobile hides the keyboard-help button and places the title and language selector on one line. Verified both languages at 320, 390 and 700px with no overlap or horizontal overflow. Category controls appear only in the mobile list and return when leaving details; desktop controls remain visible. Reviewed `mobile-compact-header.png` and `mobile-compact-detail.png`. The full 14-test suite passed for the header changes; all three mobile tests passed after restricting category controls to the list.

Production compact header and list-only category controls verified at 320px after deployment to https://83d5a10d.design-system-catalog-925.pages.dev.

## Language toggle

Status: PASS. Replaced the select menu with two pressed-state buttons, 日本語 and English, and removed Auto. Browser-language detection still applies before an explicit choice; manual choices persist. Reviewed `mobile-language-toggle.png` and checked both languages at 320/390/700px for header overlap and overflow. Updated language tests for button interaction, persisted selection and shortcut exclusion while a language button has focus. All 14 tests passed across the full run and the focused rerun after adapting help-dialog focus to the new buttons.

Language detection and persistent toggle tests also passed against production after deployment to https://b11791fa.design-system-catalog-925.pages.dev.

## Expanded source captures and mobile scroll reset

Status: PASS. Added 109 official source captures, bringing the total to 170 across 43 systems. 37 systems now have multiple views. Captures include data tables, dialogs, selection menus, text fields, navigation, colors, typography, spacing and brand applications where available. Reviewed all six contact sheets. Capture manifests and discovery evidence record the original source URLs. Existing captures and ordering were preserved. Systems with limited accessible public documentation keep their verified existing capture.

Mobile selection resets the shared workspace scroll after the detail layout is committed. Returning to the list restores its saved offset without focus scrolling. A regression test opens GOV.UK from a deeply scrolled list, verifies detail scrollTop=0, returns to the original offset, and opens it again.

All 15 browser tests passed against the local static preview. Desktop/mobile screenshots were updated with no console errors.

All 15 tests also passed against the production domain after deployment to https://d53ee797.design-system-catalog-925.pages.dev, including the mobile scroll regression.

## Latest systems and feature descriptions

Status: PASS. Added 24 verified public systems for a total of 67 (15 public-sector, 52 company/OSS). Added 66 official-source captures for a total of 236. Reviewed the primary and component contact sheets and desktop/mobile detail screenshots. The existing thumbnail-first split layout is retained; concise bilingual descriptions now appear below every detail heading.

Descriptions state practical uses without unsupported rankings or claims. Every entry records its description source URL. Adobe React Aria is distinct from Spectrum 2. SLDS 2 uses its documented 2025-02-25 website publication date; contextual dates remain marked as references. Apron and FALCON use author publication stories as captures, DBS uses its official design-practice site, and Orbit/DSFR use official repositories because the supplied documentation was unavailable. Those preview labels identify the actual source type.

Five ambiguous or inaccessible candidates are recorded in `new-batch-scope.json` with reasons: Goldman Sachs, Pipedrive Convention UI, TELUS Allium, Codmon and the unspecified LINE/Yahoo system. No unrelated API documentation or older replacement system was added under those names.

All 16 browser tests passed locally, including all 67 static paths, bilingual description rendering, mobile scroll restoration, language persistence and touch navigation. Screenshot capture reported no console errors.

All 16 tests also passed against the production domain after deployment to https://a835ccf8.design-system-catalog-925.pages.dev. Final contact sheets include the refreshed Calcite captures after dismissing cookie notices.
