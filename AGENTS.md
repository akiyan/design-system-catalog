# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `pnpm build` and `pnpm test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Project decisions

- The selected visual is `docs/selected-design.png` (option 3): thumbnail list on the left and large selected preview on the right.
- Primary thumbnails must capture locally rendered real design-system components in a shared specimen layout. Do not use reduced documentation pages or imitate components with invented CSS. Keep official documentation captures only as clearly labeled reference material.
- Avoid Japanese comma-separated catchphrases such as 「見て、選ぶ」. Use direct descriptive labels.
- Footer must contain a GitHub icon/link and Copyright with @akiyan.
- User selected Cloudflare Pages deployment under the author’s account. Build a completely static site with Astro. No server-side adapter or Pages Functions.
- The user authorized headless Playwright for source capture and visual verification because the in-app browser is unavailable.
- `PUBLIC_GITHUB_URL` sets the footer repository link. Until a repository URL is supplied use the author's existing GitHub profile.

## Catalog behavior

- Publish this code in the public repository `akiyan/design-system-catalog`; footer links to that repository.
- Support Japanese/English detection from browser language, manual selection, and a persisted preference. Keep original source captures unchanged.
- Remove keyword search. Retain category filtering.
- List systems by descending initial public release date. Add visible reference markers and evidence links when only contextual dates are available; never present repository creation as a confirmed public launch.
- Use static path permalinks such as `/astryx/`. Generate HTML for every system with Astro. Do not use query-string selection.
- Selecting a system updates browser history; direct access, reload, and Back/Forward restore the selection.
- Arrow Up/Down or J/K select systems; Home/End select boundaries; Left/Right switch screenshots; V enlarges; O opens the official site; ? opens the shortcut dialog; Escape closes overlays or returns to the mobile list.
- Do not intercept shortcuts in editable fields or the language selector. Dialogs must trap and restore focus.

## Additional entry scope

- Add the supplied domestic/overseas design systems; deduplicate existing Cloudscape, GOV.UK and USWDS entries.
- Semi Design and Arco Design are separate systems.
- Do not add aggregator, gallery, repository-directory or comparison sites such as Design Systems Repo, Adele or Open UI.
- For public documentation whose code or assets are restricted, state the actual reuse conditions rather than describing it as freely reusable OSS.

- Deduplicate Digital Agency Design System when adding the second supplied list.

## Mobile browsing

- Do not show a selected/current-page state on mobile list rows. Each row opens the detail view.
- Mobile details provide previous/next system navigation and position within the active category. Stop at list boundaries.
- Horizontal swipes on the main preview navigate systems (left advances, right goes back). Preserve vertical scrolling and pinch zoom. Screenshot thumbnails continue to switch captures within a system.
- On mobile, hide the keyboard-help (?) button. Keep the site title and language selector on one line, with category filters on the next row.
- On mobile, category filters are visible only on the list screen. Hide them while viewing system details.

- Language controls use a two-option 日本語 / English toggle on all screen sizes. Do not offer an Auto option. Detect browser language on first visit; persist explicit choices. Keep the toggle on the same mobile header row as the title.
- Provide multiple actual component specimens per system beyond overview and buttons. Prefer practical forms and typography where the implementation supports them.
- Opening mobile details starts at the top. Returning to the list restores its previous scroll position. Do not carry list scroll offsets into the detail screen.

- Every catalog system includes a short factual Japanese/English description of its purpose and distinctive features. Show it below the detail heading while keeping actual component specimens prominent. Avoid unverified superlatives and claims copied from supplied lists.
- Add Adobe React Aria as the headless interaction library; keep it separate from the existing Spectrum 2 visual design system.

## Featured systems

- Feature five systems at the top of the catalog. The current curated selection is stored in `src/data/featured.json`, curated explicitly and deduplicated by implementation repository.
- Display the featured group separately from the remaining systems. Both groups use descending public-release order. Do not duplicate entries. Category filters and sequential/keyboard navigation follow the displayed order.

## Component comparison (corrected intent)

- The primary experience compares actual integrated components using the same content and arrangement for every system. Keep the selected option 3 list/detail layout.
- Use each system’s genuine published package or official implementation with its own styles, isolated from other systems. Show its package/version provenance.
- Render live interactive specimens in details; generate thumbnails from those same local specimens. Provide consistent component categories such as buttons, forms and typography.
- Headless libraries retain their actual unstyled appearance; do not invent a branded theme. Systems with no public implementation must say so clearly and link to their public design resources rather than show a fabricated equivalent.

- Keep an overview specimen first for every integrated system. Combine genuine typography, buttons and form controls using shared content.
- Previous/next navigation, swipes and keyboard system navigation reset the specimen selection to the first overview. Direct list selection may preserve the active specimen category where supported. List thumbnails follow the selected specimen category.

- List thumbnails use compact captures of the same genuine specimens fitted to 480×224. Adapt the capture viewport to the natural specimen height so controls are not cropped. Remove repeated specimen chrome and arrange sample sections tightly so components remain legible at list size. Keep full specimen captures for the detail view selectors.

- Add dedicated table and alert specimen categories using each library’s genuine implementation where supported. Use shared table rows and informational/success/warning messages.
- Publish static robots.txt and llms.txt. List public catalog paths in a sitemap; exclude specimen-only HTML from crawler indexing while allowing thumbnail images.

- List thumbnail typography uses the design system name and a short system-specific description naming its company, organization or community. Keep the shared interactive detail specimen content for comparison.
- H / L switch specimen previews just like Left / Right, including from non-editable iframe content and enlarged previews. Keep editable controls and language toggles exempt; list these shortcuts in the help dialog.

- Systems without a standalone public implementation use official-site or publicly released design-resource captures for list thumbnails and multiple detail previews. Label them as reference captures, link each source, and support preview switching and enlargement.

- The list has its own shared specimen-category controls. Switching them updates every supported list thumbnail and the selected live preview when available. Systems lacking that category show a labeled overview fallback; design-resource entries retain reference captures.

- Typography specimens include multiple substantial paragraphs plus explicit line breaks within a paragraph, using genuine library typography and unchanged fonts/line heights.
- Merge the standalone buttons category into forms. Forms include primary/secondary/text actions, disabled buttons and supported size variants in addition to input fields. Remove the buttons category from the catalog controls.

- Show a system-specific GitHub link beside the official-site action when an official repository is known. Preserve GitLab labeling for GitLab sources; footer GitHub remains the catalog repository.

- Expand release-date evidence and usage/source details by default on desktop. Keep them collapsed by default on mobile.

- Switching systems on desktop resets the right detail pane to the top, including list selection and sequential/keyboard navigation.

- The canonical production domain is https://design-system-catalog.akiyan.tokyo, served by the existing Cloudflare Pages project. Use it for canonical URLs, sitemap and crawler metadata.

- Use pnpm exclusively for package installation, scripts and package execution. Do not run npm or npx. Pin pnpm 12.18.0 and commit pnpm-lock.yaml; use frozen installs for reproducibility.
- Live preview headings and subtitles match each system’s list thumbnail name and provider-specific description in both languages.
- Typography includes quotation samples with citations, list styles, heading hierarchy, definitions and inline formatting using genuine library styling or native semantic HTML. Clearly identify original sample quotations.

- The footer includes a bilingual addition-request link to the catalog repository’s GitHub issue form. The form collects the system name and official URL with optional provider, repository and notes.

- Opening / starts with no selected system. On desktop the right pane explains the catalog with actual specimen examples, counts and keyboard guidance. Individual paths remain selected; Back to / restores the introduction. Category changes on / must not automatically select a system.
- Desktop branding is デザインシステムカタログ.akiyan.tokyo (English equivalent when switched). Use the full brand in title/OG title; individual titles also include the system name. Keep the short mobile header name.

- Rich typography list captures may use a compact two-column article excerpt with the first long paragraph and rich-text samples. Live typography keeps every paragraph and expands the iframe height to avoid clipping long mobile specimens.

- Featured systems are Astryx, Fluent 2, Digital Agency (DADS), Ant Design and Primer, sorted newest public release first. Exclude React Aria from this group. Remove the GitHub-star selection note. Clearly identify unstyled/headless libraries in list rows and before live previews; retain their genuine unstyled appearance.
