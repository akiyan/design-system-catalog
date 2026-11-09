# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Project decisions

- The selected visual is `docs/selected-design.png` (option 3): thumbnail list on the left and large selected preview on the right.
- Thumbnails must show actual official website captures. Do not substitute invented component screenshots.
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
