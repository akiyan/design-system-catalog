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

Deployed source a1d0bec to https://fa9e4667.design-system-catalog-925.pages.dev. The production comparison-navigation test passed (1.9 seconds). All six genuine specimen images decoded successfully and the custom-domain layout has no horizontal overflow at 701/900/1440px.

## Subdued directional prompt — 2026-11-10

The home selection prompt now uses 13px normal-weight muted gray text, with a light left-arrow icon pointing toward the desktop list. Kept the spacious 160px prompt area and all comparison examples. Reviewed the desktop capture and computed typography. Rebuilt the unchanged specimen bundles, then refreshed the static Astro pages after adding the icon.

The two focused home/history and comparison-navigation checks passed in 1.0 seconds. Deployed source 2b0fd01 to https://fc6fc481.design-system-catalog-925.pages.dev. Production checks confirm 13px normal-weight gray text with a decorative left-arrow icon in Japanese and English; the introduction remains hidden on mobile.

## Remove comparison headings — 2026-11-10

Removed the overview/table/alert example headings in both languages. Retained all six genuine specimen cards and their system labels, with the existing spacing between pairs. Reviewed the updated desktop capture and refreshed the 900px English capture.

Static pnpm build and the two focused home checks passed (1.1s). Deployed source 58b9384 to https://1751cc0d.design-system-catalog-925.pages.dev. The production comparison-navigation check, including absence of comparison headings, passed in 1.6 seconds.

## Compact implementation previews and favicon — 2026-11-10

All 176 live specimens were audited with actual wheel input. The initial audit identified fractional document overflow trapping wheel input in SmartHR. Embedded specimens now delegate ordinary vertical wheel input to their outer detail pane or enlarged viewer; native scrollable controls, horizontal gestures, Shift-wheel and pinch zoom retain their behavior. Same-origin/source checks protect message handling. All 176 final checks pass with zero inner-document scroll offsets.

Desktop overview/form specimens use compact shared layout without changing genuine component styling. Normal previews are bounded by 440px or 48dvh; enlarged previews retain full content and mobile keeps natural height. Fluent 2 overview measures 408px instead of 693px at 1920×1080. Long typography remains available in the enlarged scrollable viewer. Removed the redundant specimen header across React, Vue, Solid and Svelte implementations, including the Bits UI header found by the audit. Removed the implementation-preview label; the enlarge action sits below the preview at the right edge beside package provenance.

All 67 Japanese/English descriptions are short enough to fit one line at 1920×1080 without truncation. Narrow screens can wrap naturally. Re-captured all 176 full/compact specimen views successfully. Final static pnpm build passes; all 143 browser checks pass in 13.1 seconds, including wheel browsing, enlarged article scrolling and bilingual line-height checks. Captures compare the production baseline and local implementation at the same viewport/selection/state.

Favicon uses the selected second valid generated design: three rounded blue squares and a blue circle. The exact supplied raster is retained in docs/favicon-selected.png and exported as 16px/32px PNG, multi-size ICO and 180px Apple touch icon. No replacement icon geometry was invented. Source-versus-32px comparison preserves its grid/circle silhouette.

Deployed source 7c7e319 to https://d89779e2.design-system-catalog-925.pages.dev. Three focused production checks pass in 5.6 seconds at the custom domain: outer-pane/zoom wheel scrolling and compact height, all bilingual description line fits, and genuine headless appearance. The production 32px PNG decodes correctly and the ICO response contains both size entries.

## Complete overview content and headless screenshot references — 2026-11-10

The user's attached Digital Agency crop revealed that the prior 440px height cap concealed the checkbox below its heading. Removed the main-frame maximum height, the 8000px measurement cap and embedded overflow concealment. Iframes now fit their complete measured content with a 2px rounding allowance. Removed the enlarged frame's forced minimum height as well. The outer pane retains ordinary wheel scrolling.

Overview samples now use primary/secondary actions, one input and one working checkbox; disabled/size variants remain in forms. Removed redundant overview section headings and added three semantic bullet items under each system introduction. Genuine component styles remain unchanged. Shared padding is 24px. The Digital Agency overview measures 308px at 1440px desktop width by arranging/reducing content, and its checkbox has clear bottom padding. Regression checks operate it at 1920/1440/900px and verify complete content, visible bullet markers and no internal document overflow. Captures compare the supplied crop with the revised preview; the source browser viewport is unknown, so the comparison normalizes image width rather than claiming exact viewport fidelity.

All five headless libraries (React Aria, Ariakit, Lion, Kobalte and Bits UI) now show official-site screenshot references, including multiple component-page captures and original source links. Their code exists; reference-only status deliberately avoids claiming that implementations are unavailable. Inspected all 19 official captures. Removed obsolete live-thumbnail assets for these entries.

All 166 remaining live specimens pass full-content-height and wheel-scroll auditing with zero inner document overflow. All 139 browser checks passed in 13.7 seconds. Captured all 53 updated overview specimens and compact thumbnails successfully. Both capture manifests contain 166 valid specimen views. Static output contains 234 HTML pages and remains entirely client-side. There are 53 live implementations and 14 screenshot-reference entries, exposing 51 reference views.

Deployed source 2a8f541 to https://29a66b18.design-system-catalog-925.pages.dev. Three production checks passed in 4.4 seconds at the custom domain: Digital Agency checkbox/list visibility and operation across widths, complete-content iframe sizing and outer wheel scrolling, and all five headless reference entries. All 19 official screenshot files decoded successfully in the production browser.

## Rich comparison categories and official palettes — 2026-11-10

Preserved the selected option 3 list/detail structure. Overview specimens now prioritize genuine badges, warning banners and card surfaces where supported. Forms keep the broader state examples. All 53 integrated overviews retain their semantic bullet list. At 1920×1080 the overview content remains fully visible through natural iframe sizing; the largest measured overview is approximately 702px. No height caps or overflow concealment were introduced.

Added 25 card, 20 dialog, 10 code-block and 9 chat implementations. Close official equivalents include Carbon Tile, Cloudscape Container, SmartHR Panel, and Arco/TDesign Comment with Avatar. Component mappings are recorded in the registry and shown beside provenance. Ant Design X and Cloudscape's chat/code packages show their actual package versions and sources. Chat messages remain local to the specimen. Dialog previews support closing/reopening; modal sizing measures the content surface instead of a fullscreen backdrop. Thumbnail capture also targets the actual dialog surface. Single-surface categories occupy the whole compact capture width.

The heading now places the short description beside the name, uses an accessible globe-only official-site link, and omits the duplicate repository action. Source-code links remain in the expanded source details. The source links share a flex row and identical text baselines. Footer external-arrow icons are removed. Branding and document titles omit `.akiyan.tokyo`; canonical URLs retain the custom domain.

Audited all 67 official URLs with a light browser preference. 66 returned inspectable pages; DSFR returned a security challenge and retains its existing official light component setup. Recorded the evidence in `docs/official-theme-validation.json`. Thirteen nonwhite specimen canvases follow observed documentation palettes, excluding marketing hero panels and transient overlays. Coinbase CDS and Cloudscape use their published dark theme APIs. Coinbase also loads the required default-font/reset styles and genuine Text components. Cream, lavender and gray surfaces remain visible in the other integrations. Compact thumbnail letterboxing uses the same measured canvas color, including normalization of OKLCH for image export.

Visual evidence: `docs/rich-comparison-astryx.png`, `docs/rich-comparison-dads.png`, `docs/rich-comparison-coinbase.png`, `docs/rich-comparison-cloudscape.png`, all four `docs/rich-comparison-{card,dialog,code,chat}.png` category states, mobile detail/list captures, and the focused source-link crop. Desktop captures use 1920×1080; mobile uses 390×844.

Final static pnpm build passed. All 171 browser checks passed in 20.0 seconds. All 233 views passed natural-height and outer-wheel-scroll auditing with zero inner document overflow. Both thumbnail manifests contain 233 valid views. The Digital Agency modal uses the official useModalDialog hook; an additional stability check waits across resize cycles and verifies Escape closes the inner modal without navigating away. Static output contains 301 HTML pages.

Production loading-order follow-up: a static iframe can finish before React attaches its listener. Added a same-origin parent/iframe size handshake when the listener attaches and whenever the iframe loads. A deterministic regression test gates catalog JavaScript until the iframe is ready, then checks that hydration obtains the complete height. All 172 local browser checks pass in 19.9 seconds; all 233 scroll-audit views still pass.

Published source 9f4c6ea at https://f9e7bb1b.design-system-catalog-925.pages.dev and the canonical custom domain. All 33 focused production browser checks passed in 16.6 seconds, including the gated-hydration reproduction, complete iframe sizing, modal height stability, inner Escape handling, local chat interactions, new category switching, genuine dark themes/fonts, compact heading and source/footer alignment. All 466 full/compact images returned successful image/webp responses with valid RIFF/WEBP signatures.

## Desktop thumbnail grid home — 2026-11-10

The unselected desktop homepage now uses the full workspace for all 67 catalog cards. Removed the introduction and sample comparison pairs. Category/specimen filters, featured group and descending-release ordering remain. A selected card updates its path and returns to the established left-list/right-detail layout. Back restores the grid and its previous scroll offset. Grid links support normal Tab activation; existing selection shortcuts remain available. Mobile retains its list/detail flow.

Verified at 1920×1080 and 1440×1024 (five columns), with narrower responsive column counts and no overlapping card tracks. The grid uses content-sized rows rather than squeezing all cards into the available viewport. Evidence: docs/home-grid-desktop.png, docs/home-grid-desktop-1440.png, docs/home-grid-selected.png and docs/home-grid-mobile-list.png. Astro static build passed with the unchanged specimen runtime retained. All 172 browser checks passed in 18.1 seconds, including grid density, filtering, category thumbnails, transition to details, history scroll restoration and existing mobile/keyboard behavior.

Published source 732e2ab at https://b97d73c7.design-system-catalog-925.pages.dev and the canonical custom domain. All eight focused production browser checks passed in 5.0 seconds, covering grid density/filtering, shared category selection, path navigation/reload/history, restored grid scroll, keyboard and mobile behavior, pre-hydration sizing and complete iframe contents.

## Readable thumbnail excerpts and official heading links — 2026-11-10

Removed enclosing home-grid borders, decorative thumbnail outlines and the featured-group separator. Replaced adaptive whole-document shrinking with 640×300 screen excerpts for list thumbnails. Dialogs use an 800×600 viewport and their genuine dialog surface; smaller mobile breakpoints can have zero-height dialog wrappers. Recaptured all 233 list thumbnails successfully and verified every output is 480×224 WebP. Full detail previews and full specimen captures remain unchanged. The detail title now links to its official site in a new tab, preserving heading appearance and keyboard focus. Five focused browser checks pass. Visual evidence: docs/home-grid-readable-thumbnails.png. Grid strengthening alternatives were generated separately for user selection; none has been implemented.

Published source 1e7f7b4 at https://3e5af44a.design-system-catalog-925.pages.dev and the canonical custom domain. Five focused production browser checks passed in 2.7 seconds.

## Subtle whole-card background — 2026-11-10

User rejected the three generated alternatives and specified a very subtle background across each complete card. Desktop home cards now use #f7f8fa with 6px corners and existing 12px padding, including their thumbnails and metadata. No border, shadow or featured-group separator. Verified at 1920×1080, with selection opening the existing detail layout; two focused browser checks passed. Evidence: docs/home-grid-subtle-cards.png.

## Inline catalog dates — 2026-11-10

Country, category and publication date share a compact metadata row. The compact list/grid omits reference badges; the detail pane retains release precision and evidence. Verified desktop alignment and absence of mobile horizontal overflow. Three focused browser checks passed. Evidence: docs/home-grid-inline-dates.png.

## Four-column maximum — 2026-11-10

Capped the desktop home grid at four columns. At 1920×1080 each thumbnail is 432px wide instead of approximately 337px (about 28% larger). Existing two/three-column breakpoints and featured ordering remain. Two focused browser checks passed, including the four-column cap at 1440, 1920 and 2560px, selection and history restoration. Visual evidence: docs/home-grid-four-columns.png.

## Four featured systems — 2026-11-10

Reduced the curated group to Astryx, Fluent 2, Digital Agency and Ant Design in descending release order. Primer moves into the chronological remainder without losing its entry or permalink. Updated visible Japanese heading, static metadata and project decisions. Four focused browser checks passed for ordering, filtering, grid selection/history and featured deduplication. At 1920×1080 the four featured cards occupy a single row. Evidence: docs/home-grid-featured-four.png.

## Spacing audit and scrolling implementation gallery — 2026-11-10

Captured every integrated specimen before changes (233 views across 53 systems). Inspected contact sheets for overviews, forms, typography, tables, alerts, cards, dialogs, code and chat. Metrics and screenshots identified missing Digital Agency dialog-button sizes; touching card text in Astryx, Carbon, Polaris, SmartHR and Evergreen; missing Kumo dialog insets; missing `.modal` ancestors and therefore unset inherited padding tokens in Boosted, Designers Italia and SGDS; touching headings in richer typography; and missing authored alert spacing. Czech buttons also passed `variant` instead of the component's required `type`. Primer checkboxes now use the published FormControl/Label composition. Fixed these through official size props, layout primitives and utility classes. Shared CSS only arranges authored text blocks and keeps native modal examples in normal flow. Official DSFR alert title/body spacing of 4px remains intact.

After correction, captured and measured all 245 views. There are no touching authored heading/body pairs or horizontal document overflows; only the documented native DSFR 4px alert gap remains below the audit's 6px screening threshold. Dialog actions retain official padding. Relevant evidence is in `docs/spacing-audit/before/` and `after/`, with all-view measurements in before-metrics.json and after-metrics.json. The screenshot audit is visual/structural evidence, not a claim of full accessibility conformance.

Removed specimen-category selectors from both home and list. Catalog thumbnails always show the overview. The detail pane shows the overview first at full width, then every supported specimen in a vertically scrolling gallery. Each section has its own enlargement action and package/component provenance. Non-overview iframes use native lazy loading. Left/Right or H/L scroll between gallery sections; they switch examples only within enlargement. System selection resets the detail scroll. Screenshot-only entries use a two-column gallery; selecting an image enlarges it directly without an intermediate selected image. The official-site action now includes its visible text label.

Added 12 genuine additional-component specimens: Astryx Collapsible/ProgressBar; Digital Agency Accordion/ProgressIndicator; Ant Tabs/Collapse/Progress/Pagination; Fluent Accordion/ProgressBar; Carbon Accordion/ProgressBar; Cloudscape Tabs/ExpandableSection/ProgressBar/Pagination; Primer Breadcrumbs/ProgressBar/CounterLabel; Polaris Tabs/ProgressBar; Arco Tabs/Collapse/Progress; Semi Tabs/Collapse/Progress; Evergreen Tablist/Tab/Spinner; PatternFly Accordion/Progress. Sources and component mappings remain in the registry.

All 195 browser tests passed in 21.0 seconds, including 23 new spacing and additional-component checks. Every one of the 245 gallery views passed the natural-height and outer-wheel-scroll audit with zero inner document overflow. All 245 full captures and 245 compact captures were regenerated successfully. Static output contains 313 HTML pages. Visual evidence: scrolling-gallery-desktop.png, scrolling-gallery-additional.png, scrolling-gallery-mobile.png and reference-gallery-desktop.png.

Published gallery/spacing source 12d9871 at https://b2868dfa.design-system-catalog-925.pages.dev and the canonical domain. All 39 focused production browser checks passed in 24.8 seconds; all 490 full/compact WebP assets returned valid image responses and RIFF/WEBP signatures.

Follow-up: horizontal navigation now clamps at the first and last specimen/reference, both in the scrolling gallery and enlarged viewer. Boundary buttons are disabled. Two new boundary regressions cover a live system and a screenshot-only system; five focused local browser checks passed in 1.9 seconds.

Boundary follow-up source b3592ef was published at https://7cadb3e8.design-system-catalog-925.pages.dev. Five focused production checks passed in 4.9 seconds. Added a globe-icon official-site link after the detail pane’s source/usage information. Verified the destination and new-tab behavior for live and screenshot galleries and the English label. Evidence: docs/detail-official-site-end.png.

## Deferred specimen loading and enlarged first reference capture

The first reference screenshot now spans both gallery columns. Subsequent captures stay in two columns and open directly in the enlarged viewer. Checked desktop 1920×1080 and mobile 390×844; evidence: reference-gallery-first-large.png and reference-gallery-first-large-mobile.png.

Secondary live specimens now receive their URL only when within 120px of the visible viewport. Native iframe lazy loading previously initialized five to nine specimens during switching. The eager overview and sizing handshake remain intact. The new regression verifies an offscreen specimen stays unloaded until scrolling, then initializes, and system switching resets the pane.

Enter now enlarges a selected specimen, including from inside an iframe. Inputs, links and buttons retain native activation. All 198 existing browser checks passed in 13.8 seconds; the new deferred-loading regression and Enter check passed separately (2 checks, 1.6 seconds).

Published source b7a3c3d at https://39f2bee7.design-system-catalog-925.pages.dev. Six focused production checks passed in 3.6 seconds. Same-domain production benchmark (three switches per system, no throttling) median click-to-ready: Fluent 265→194ms; DADS 241→176ms; Ant 680→237ms; Astryx 193→140ms. Ant initial request count dropped from 171 to 38. The small-sample timings include network variability; complete method and raw results are in system-switch-performance.json.

Shadow DOM feasibility: Ant Design officially supports CSS insertion into a ShadowRoot with StyleProvider (https://ant.design/docs/react/compatible-style/); popup containers require separate ConfigProvider/getContainer configuration (https://ant.design/components/config-provider/). Existing adapters load independent global styles, use multiple CSS-in-JS engines and native/custom-element implementations. A migration requires adapter-level handling of stylesheet targets, root selectors, portals and focus. This release retains iframe isolation and removes excess concurrent loading.

## Google Tag Manager and GA4

Added GTM-N9ZZSCNJ to the shared catalog layout with data-layer initialization before its async script and the noscript fallback immediately after body. The published container configures GA4 G-3H0GVLHTFF. All 68 catalog HTML pages include the container once; all 245 isolated specimen HTML pages exclude it.

Headless verification loads the real published container but intercepts Analytics collection requests with HTTP 204 so test visits do not pollute reports. Parsed both query parameters and batched POST lines. Verified exactly one initial page_view, one selection page_view and one Back-navigation page_view with matching titles, and only one container initialization. No manual React page_view code was added because enhanced History API measurement already handles navigation.

Published analytics source 0f65ae8 at https://1c84541a.design-system-catalog-925.pages.dev. Repeated the real-container/intercepted-collection check on the canonical production domain: three expected page views with matching paths/titles, no duplicate views, one GTM initialization. Evidence: analytics-validation.json.

Removed external-link arrow icons from in-page enlargement actions. All remaining ArrowSquareOut instances in the catalog are inside links with target="_blank". Verified icon absence and working dialog enlargement locally and on production. Source 16c4de0 deployed at https://c83007e4.design-system-catalog-925.pages.dev.

Corrected favicon to the supplied split-pane artwork: two stacked white panes on the left and one tall white pane on the right within a blue rounded square. Cropped the user image directly into docs/favicon-selected.png and exported 16/32px PNG, 16/32px ICO and 180px Apple touch icon. Versioned link URLs with layout-2. Confirmed production link version and exact PNG/ICO bytes against local exports. Source 6c97356 deployed at https://47d2c789.design-system-catalog-925.pages.dev.

Added statically generated /sitemap.txt with one absolute canonical URL per line. Its 68 unique URLs (home plus 67 catalog pages) exactly match sitemap.xml; isolated specimen pages are excluded. Browser-verified locally and on production against the built file. Source 6c0adb4 deployed at https://573f1009.design-system-catalog-925.pages.dev.

Copyright attribution @akiyan now links to https://x.com/akiyan. Verified locally and on the canonical production domain. Source 0852d78 deployed at https://cc7a999d.design-system-catalog-925.pages.dev.

## Local component color-theme prototype — 2026-11-12

Implemented detail-only sticky Original / Light / Dark controls for actual component previews. Supported integrations: Astryx, Fluent, Ant Design, Coinbase CDS, Cloudscape, Carbon, Primer, Spectrum 2, Arco and Semi. Each uses its published provider, algorithm, mode API or official CSS attributes. Primer now imports the official light/dark primitives. The catalog shell, list thumbnails and reference screenshots are unchanged. Unsupported integrations and reference screenshots omit the theme toolbar entirely.

Theme changes use an origin/source-checked parent message and update the existing React root, preserving field values and scroll position. Newly visible deferred frames and enlarged frames inherit the selected theme. The preference stays in component state while navigating systems. Radio controls support native keyboard behavior and are exempt from catalog shortcuts. Scroll padding keeps scroll-into-view targets clear of the sticky toolbar on desktop/mobile.

Validation: complete static/specimen build passed. The first full browser run passed 211 of 212 checks; the added sticky bar exposed a mobile touch target overlap. After scroll-padding correction all 17 selected theme, touch, scroll and hydration checks passed in 7.9 seconds, including all 13 new theme checks. The final toolbar alignment polish passed three additional focused checks; flush alignment with the pane top was also asserted. Desktop 1920×1080 and mobile 390×844 captures were reviewed. Screenshots: preview-theme-light-desktop.png, preview-theme-dark-desktop.png, preview-theme-dark-scrolled.png and preview-theme-dark-mobile.png.

Local preview: http://127.0.0.1:4175/fluent/. This prototype has not been committed, pushed or deployed; production remains unchanged.

Local follow-up: hide the complete theme toolbar on unsupported integrations and screenshot entries. Three focused checks passed in 2.2 seconds, including desktop/mobile absence, retained choice when returning to a supported system, fixed positioning and keyboard controls. Not deployed.

GitHub Actions release automation completed: PR #1 merged as d560c45. The dedicated account-restricted Pages Write user token was created through cf CLI and supplied directly to the GitHub secret without printing the token. Both PR and main runs succeeded; the main run passed 199 browser checks and deployed https://718cfe87.design-system-catalog-925.pages.dev. Production catalog, author link and Fluent implementation verified; the unreleased theme prototype is absent. Workflow run: https://github.com/akiyan/design-system-catalog/actions/runs/43167957463.

## Approved theme release — 2026-11-12

The user approved publishing component theme controls. Final verification passed all 212 browser checks in 34.2 seconds. Fixed an initial-hydration keyboard race by installing the ready keyboard listener in a layout effect; the existing Enter regression passed 10 consecutive runs (5.2 seconds). Re-generated all eight Primer specimen captures with official primitive tokens; both full and compact exports succeeded. Unsupported systems and reference captures omit the theme toolbar. Release is triggered through the existing main-push GitHub Actions workflow.

Published theme release 5ca64aa through successful GitHub Actions run https://github.com/akiyan/design-system-catalog/actions/runs/43185567910. All 212 CI browser checks passed (1.1 minutes); deployment URL: https://d95416cb.design-system-catalog-925.pages.dev. All 13 focused checks passed on the canonical production domain in 24.3 seconds. Verified every supported provider, native radio behavior, retained form values, enlargement and deferred inheritance, sticky desktop/mobile placement, plus complete toolbar omission on unsupported and screenshot-only entries. The approved feature is now live.
