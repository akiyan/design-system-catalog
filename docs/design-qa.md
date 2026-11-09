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
