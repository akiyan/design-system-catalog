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

## Featured five

Status: PASS. Ant Design, Microsoft Fluent 2, Astryx, Adobe React Aria and GitHub Primer lead the catalog in a separate featured group. Selection references current public GitHub stars; repository evidence, archive status and check time are recorded in `featured-repository-evidence.json`. Shared implementations are represented once. This is a curated selection, not a claim of measured recent growth.

The remaining 62 systems retain descending release-date order. All 67 entries appear exactly once. Matching category filters retain the featured group; the public-sector category shows its usual date-sorted list. Sequential mobile controls, touch gestures, Home/End and J/K follow the displayed order. Default selection and homepage OG image use the first featured entry.

Reviewed `featured-desktop.png` at 1440×1024 and `featured-mobile.png` at 390×844. Existing thumbnail density, preview proportions, bilingual descriptions and mobile header behavior are preserved. No mobile horizontal overflow was observed. All 17 browser tests passed locally, including featured ordering/deduplication and category behavior.

Production deployment: https://23450f90.design-system-catalog-925.pages.dev. All 17 production checks passed across the main run and a focused rerun: the sequential all-path check initially hit the 30-second network deadline at `/dsfr/`, then all 67 paths passed in 3.2 seconds with a larger test deadline. No application failure was found.

## Actual component comparison

Status: PASS for the local static build. The user's corrected intent supersedes documentation-page captures as the primary visual source. Option 3 remains the list/detail composition. `specimen-comparison.jpg` places the selected mock beside the current desktop UI.

- Layout: retained the thumbnail-first 40/60 split. The selected preview now renders genuine interactive components with shared project settings content. Thumbnails are captures of the same local implementations.
- Component anatomy: 58 adapters use official packages or vendored official source. Buttons, form fields and supported typography retain their published structure and styles. Eight design-resource entries and the host-dependent Airtable SDK have explicit resource panels. No invented styled equivalents are shown.
- Spacing and density: common specimen wrappers align sections and field groups; controls preserve their native sizes. Mobile fields stack and buttons wrap. The active specimen type is retained across systems and reflected by list thumbnails.
- Typography and color: library styles are loaded only inside the corresponding iframe. A separate Vite build prevents Astro from preloading every adapter's CSS. Headless primitives remain unstyled. Charcoal theme tokens, Czech tokens and Porsche CSS variables are explicitly loaded. Porsche brand fonts are excluded. Lightning and Polaris version limitations are displayed.
- Content and hierarchy: the large preview is dominant, with bilingual feature descriptions above and package/version provenance below. Existing categories, dates, featured groups and footer remain available. Desktop, mobile list/detail, English and enlarged previews were visually reviewed.

Validation: all 181 specimen routes rendered successfully, recorded in `specimen-validation.json`. The 77 browser tests cover real save events, editable text, checkbox keyboard changes, disabled states, isolation, static permalinks, shared specimen categories, language persistence, mobile navigation/swipes and the existing catalog behavior. Enlarged iframe inputs forward Escape and close the overlay. Static build contains 249 HTML pages and uses no server or Pages Functions.

Evidence: `specimen-desktop.png`, `specimen-dads.png`, `specimen-mobile-list.png`, `specimen-mobile-detail.png`, `specimen-english.png`, `specimen-zoom.png`. Package provenance is recorded in `specimen-provenance.json`; vendored sources keep license/source metadata.

Production verification: all 77 tests passed against https://design-system-catalog-925.pages.dev in 27.7 seconds after deployment to https://cb8a67c6.design-system-catalog-925.pages.dev. This includes all genuine adapters and the catalog/mobile regression checks.

## Mixed overview, dense list images and more components

Every integrated system now starts with an overview combining typography, buttons and form fields. The four implementations that previously started with a single component category also have overview routes. Finastra now includes its official text-field package. Shared previous/next controls, swipes and keyboard system selection reset the view to overview; direct list selection retains supported component categories.

The list uses a separate compact capture of the genuine specimen. Repeated header/status chrome is hidden, section layout is compact, and the capture viewport adapts to the specimen's natural height. Each image fits 480×224 without cutting off controls. Full captures remain in the detail selectors. List image proportions are consistent on desktop and mobile.

Dedicated table examples are available for 23 implementations; alert examples for 25. All use official components or documented framework markup. Shared table rows and message text make comparisons meaningful. Unsupported alert variants are omitted (for example Paste has neutral and warning examples). Evergreen's legacy table imports require the removed ReactDOM.render API and are excluded; its existing components and alerts remain available.

Crawler resources are prerendered static files. The sitemap includes 68 catalog paths. Robots rules disallow specimen-only HTML while allowing thumbnail folders. The llms.txt guide is generated from catalog data and links to every public catalog entry and source metadata.

Source capture reports contain 234 successful full specimens and 234 successful compact specimens. Regression coverage includes mixed overview content, previous/next reset after typography selection, table/alert content, crawler files and keyboard input through shadow DOM.

Final local verification: PASS. All 128 browser tests passed in 10.6 seconds. Reviewed the 58-entry compact overview contact sheet and refreshed desktop/mobile/English/zoom screenshots. Representative table and alert captures retain official styles and show the shared content. The build emits 302 static HTML pages plus robots.txt, llms.txt and sitemap.xml. No server runtime or Pages Functions are introduced.

Production verification: all 128 tests passed in 31.6 seconds against https://design-system-catalog-925.pages.dev after deployment to https://a78c6cf5.design-system-catalog-925.pages.dev. The public robots.txt, llms.txt and sitemap.xml responses passed the static crawler-resource checks.

## Thumbnail content and catalog navigation update — 2026-11-10

PASS: 136 browser checks against the static local preview. Re-captured all 176 full specimens and compact thumbnails after merging button specimens into forms; no rendering or capture failures. All 58 integrated systems retain an overview. Typography examples use three real paragraph blocks and an explicit line break with each library’s own typography.

Thumbnail headings identify each system; short descriptions name its provider. List controls switch the shared specimen category with an explicit overview fallback where unsupported. H/L switch previews in the page, iframe and zoom without intercepting inputs or the language toggle. Right-pane scroll resets on desktop system selection; publication evidence and usage/source details start expanded on desktop and collapsed on mobile. Official repository links appear beside the system’s official-site action.

All nine reference/host-dependent entries show source captures with 32 previews in total. Eleven additional captures cover sugao, Airtable, Apron, DBS and FALCON. Reference captures remain labeled and link to their original pages; live specimens keep official package provenance.

The canonical origin is https://design-system-catalog.akiyan.tokyo. Cloudflare Pages domain registration and a proxied CNAME target the existing Pages project. Canonical tags, sitemap, robots.txt and llms.txt use the custom domain.

Production verification: PASS at https://design-system-catalog.akiyan.tokyo after deployment https://5f6a7527.design-system-catalog-925.pages.dev (source commit 0593607). All 136 browser checks passed in 30.4 seconds. HTTPS and the Cloudflare custom-domain verification/validation statuses are active. Root, individual catalog paths, robots.txt, llms.txt and the 68-path sitemap return successfully from the custom origin. The final build contains 244 static HTML pages, 176 full specimen images and 176 compact specimen images.

## Rich typography and unselected home — 2026-11-10

Local verification: 139 browser checks passed. Full capture validation succeeded for all 176 specimen views after migration to pnpm 12.18.0. All integrated overview headings and introductory descriptions now match their compact list captures. Typography adds original quotations with citations, unordered and ordered lists, h2/h3 hierarchy, bold/italic text, a working note link, inline code, keyboard notation and definition lists. Library components/classes provide styling; semantic browser defaults remain where a library has no dedicated style. Long live specimens can expand beyond 1800 pixels to keep mobile content accessible.

The root page starts without a selected row and explains the catalog in its right pane using actual specimen examples and catalog counts. Individual paths remain selected; browser history restores the root introduction. Desktop header and document titles use the full .akiyan.tokyo brand, with the short mobile header preserved. Footer addition requests open a bilingual GitHub Issue form. GitHub About and package homepage metadata point to the custom production domain.

Migration validation: pnpm frozen installs pass with isolated node_modules. Existing deployed versions are preserved; exact version age exceptions cover only eight pre-existing versions published within the previous day. Install-script permissions are explicit. No npm/npx commands are used.

The featured group is curated explicitly as Astryx, Fluent 2, Digital Agency (DADS), Ant Design and Primer in descending initial-public-release order. React Aria remains in the catalog with its genuine unstyled implementation; list badges and a notice before the live preview explain that its native appearance is intentional. All five unstyled libraries receive the same clear treatment. The star-count selection note is removed from the catalog and current crawler description. ECL typography imports its genuine optional utilities so heading and paragraph classes resolve to the published font styles.

Final local verification: all 140 browser checks passed in 13.2 seconds. Updated publication order is reflected in category filters, system navigation, swipes and keyboard boundaries. Both full and compact capture manifests contain 176 successful views. A clean frozen pnpm install and pnpm build complete successfully. The Issue form YAML is valid and GitHub Issues are enabled.

Production verification: all 140 browser checks passed in 19.7 seconds against https://design-system-catalog.akiyan.tokyo after deployment https://3b881e0b.design-system-catalog-925.pages.dev (source commit 7e96127). The mobile preview navigation check waits for the genuine specimen to finish loading and its measured iframe height to settle before clicking the category control; three repeated production runs also passed.

## Simplified introduction layout — 2026-11-10

The introduction keeps only the catalog-system count, positioned beside the heading. Removed the three obvious choose/switch/visit steps and the redundant selection instruction in both languages. Real specimen comparison examples follow the heading directly; keyboard hints share a compact footer row. Retained the established list/detail split and genuine specimen captures. Desktop branding renders the .akiyan.tokyo suffix exactly one typographic point smaller than the site name without changing document titles. Compared before/after captures at 1440px and checked the English layout at 900px; no horizontal overflow at 701, 900 or 1440px.

Static pnpm build passed; all 140 browser checks passed against the local production build in 12.9 seconds.

Deployed source 2caefd0 to https://15e30acf.design-system-catalog-925.pages.dev. Production smoke checks passed at the custom domain in Japanese and English: one system count, no operation steps, the new heading/count layout and a 1pt font-size difference. No horizontal overflow at 390, 900 or 1440 pixels.

## Domain suffix typography adjustment — 2026-11-10

The desktop .akiyan.tokyo suffix is now 3pt smaller than the site name with font-weight 400. Japanese and English computed-style checks confirm a 4px (3pt) difference and normal weight; the header screenshot was reviewed. Document titles remain unchanged.

Static pnpm build passed. Deployed source 0623d82 to https://41d042d3.design-system-catalog-925.pages.dev and confirmed the 3pt size difference plus font-weight 400 in both languages on the custom production domain.

## Category comparison examples on the unselected home — 2026-11-10

Replaced the introductory headline, description and system count with the requested Japanese selection prompt and its English equivalent in a 160px-high area. The comparison section now includes distinct system pairs: Astryx/Fluent overview, Carbon/Ant Design tables and Primer/Cloudscape alerts. All six images use existing captures of genuine locally rendered components. Example selection opens the matching specimen category and updates the list comparison category. Active government/company filters constrain eligible examples. Retained the 3pt smaller domain suffix with normal font weight.

Reviewed desktop, 900px English and scrolled alert captures against the previous layout. Static pnpm build passed. All 141 browser checks passed in 13.5 seconds, including a new behavior check for matching-category example navigation and government-filter eligibility.
