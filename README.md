# Design System Catalog / デザインシステムカタログ

[Live site / 公開サイト](https://design-system-catalog.akiyan.tokyo/) · [Example permalink / 個別ページ](https://design-system-catalog.akiyan.tokyo/astryx/)

A visual catalog of 67 public design systems with live specimens of their official component implementations. The code is MIT licensed. Third-party captures and trademarks retain their original terms.

実際の公開コンポーネントを共通の内容で比較する国内外67件のカタログです。

- Japanese/English browser detection and a persistent manual language selection
- Category filters; no keyword search
- Five curated systems in newest-release order followed by the remaining newest public releases, with date evidence and explicit reference markers
- Static paths such as `/astryx/` with client navigation and Back/Forward support
- Keyboard shortcuts and a `?` help overlay
- Bilingual descriptions of each system’s purpose and distinctive features
- Common component specimens and interactive enlarged previews
- Mobile previous/next browsing and horizontal swipes on the main preview

## Development / 開発

Use Node.js 22.12+ and pnpm 12.18.0 (pinned in `packageManager`). The specimen build loads many independent UI libraries and allows an 8 GB Node heap.

```sh
pnpm install --frozen-lockfile
pnpm dev --host 0.0.0.0 --port 4173
```

## Static build and Cloudflare Pages / 静的生成

Astro prerenders the catalog homepage and all 67 system paths. React handles category filters, language selection, component specimens and keyboard input in the browser. No server adapter or Pages Functions are used.

```sh
pnpm build
pnpm run deploy
```

- Build command: `pnpm build`
- Output directory: `dist/client`
- Production branch: `main`
- Authenticate Wrangler to the intended Cloudflare account before deployment.

## Catalog data / 掲載情報

Edit `src/data/systems.json` to update names, categories, source URLs, technology, screenshots and publication evidence.

`published.date` retains its known precision (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`). `published.estimated` marks reference dates. `published.basis`, `sourceUrl`, `sourceTitle` and bilingual `note` document the source. The initial public release is preferred over a later redesign or version update. When it cannot be verified, contextual dates such as repository creation or a documented historical milestone are visibly labelled as references. Repository creation is not presented as a confirmed public launch. Partial dates are ordered by their known year/month; exact ordering within an unknown month or year is not asserted.

公開日は公式発表と初回リリース履歴を優先します。日や月が不明な場合は精度を補わずに表示します。周辺情報を使った項目には「参考」を表示します。採用した根拠は画面内で確認できます。

```sh
pnpm exec playwright install chromium
pnpm capture:previews
# Capture a single entry:
node scripts/capture-previews.mjs astryx
```

Capture manifests are saved under `docs/`. Authentication-required source pages are excluded.

`PUBLIC_GITHUB_URL` can override the default footer link to this repository.

## Keyboard shortcuts / キーボード操作

| Key | Action |
| --- | --- |
| Down / Up or J / K | Select the next / previous system |
| Home / End | Select the first / last system |
| Left / Right or H / L | Switch component specimens |
| V | Enlarge the preview |
| O | Open the official site |
| ? | Show or hide shortcut help |
| Esc | Close overlay or return to the mobile list |
| Tab / Shift+Tab | Move focus |
| Enter / Space | Activate focused links / buttons using native semantics |

Shortcuts do not intercept editable controls or the language selector. Modal dialogs trap focus and restore it when closed.

## Verification / 検証

Run the server on port 4173 before tests:

```sh
pnpm test
# Test a built preview or the published site:
TEST_BASE_URL=http://127.0.0.1:4174 pnpm test
```

The browser suite covers publication order/evidence, all static paths, navigation without JavaScript, history, automatic/manual languages, keyboard shortcuts, modal focus, image loading and mobile layout. Use `node scripts/capture-qa.mjs` for visual evidence.

## License and sources / ライセンスと出典

Catalog code: MIT License. Copyright © 2026 @akiyan.

`public/previews/` contains captures of third-party official websites. These images, logos and trademarks are excluded from this repository's MIT license. Follow the respective owners' terms. Original URLs remain in `src/data/systems.json` as reference material.

The catalog began with a supplied research list. Licensing for an entire system, trademarks and artwork is not assumed from its code license. Unverified license entries remain identified as such.

## Additional catalog scope

The catalog includes design systems rather than aggregator or comparison sites. Semi Design and Arco Design are separate entries. Cloudscape, GOV.UK and USWDS are deduplicated. Public documentation does not imply an open-source implementation; usage/license details distinguish those cases.

## Live component specimens

`src/data/specimens.json` records each real implementation, its version and provenance. Each adapter renders shared form content with the official package and its own styles. Headings and introductory descriptions identify the current system in both live previews and thumbnails. Styles are isolated in same-origin iframes under `/specimens/<system>/<view>/`. These are browser-only interactive examples served as static HTML; no server runtime is used. Headless libraries use official-site screenshot references rather than unstyled live specimens. Design-only resources and integrations requiring their original host are explicitly identified.

Live iframe heights follow their complete content without clipping or fixed limits. Overview specimens combine a bulleted list with primary/secondary actions, one input and a working checkbox; additional states remain in forms.

Run `pnpm build` and a local preview, then `TEST_BASE_URL=http://127.0.0.1:4176 node scripts/capture-specimens.mjs` to generate actual specimen thumbnails. `ONLY=ant,fluent` limits capture to specific entries. The capture report is `docs/specimen-validation.json`. Rebuild after capturing to include thumbnails.

Published implementations may lag the latest design guidelines. For example the public Lightning CSS package implements SLDS 1 and the published Polaris React package is archived. Their specimen notices state this.

Third-party packages retain their respective licenses. Vendored Digital Agency source preserves its MIT license. Vendored public CFPB/Bristol styles and their fonts retain their original terms and source metadata in `src/specimens/vendor/`. Generated specimen thumbnails depict those third-party components and are excluded from the catalog code's MIT license.

## Component categories

Every integrated system starts with an overview combining typography, buttons and form controls. Where supported, genuine badges, banners and card surfaces emphasize differences between libraries. Previous/next controls, horizontal swipes and keyboard system navigation reset to this overview. Direct list selection preserves the current component category where supported. Dedicated table examples are available for 23 implementations and alert examples for 28. Cards (25 implementations), dialogs (20), code blocks (10) and chat (9) use published components or close official equivalents. Tile/Container surfaces and Comment/Avatar compositions are identified beside package provenance. Chat messages stay local to the specimen. Only supported official variants are rendered.

List images are compact 480×224 captures with an adaptive viewport under `public/specimens/list-thumbnails/`, with shared sample sections arranged for legibility at thumbnail size. Detail selectors retain full specimen captures under `public/specimens/thumbnails/`. Both use the same official components.

`/robots.txt`, `/llms.txt` and `/sitemap.xml` are static Astro endpoints. The sitemap includes the homepage and all catalog paths. Robots rules exclude specimen HTML while allowing thumbnail images. The LLM guide includes descriptions and source links generated from catalog data.

The LLM guide follows the [llms.txt proposal](https://llmstxt.org/). `LIST_ONLY=1` regenerates compact images without replacing full captures; `VIEWS=overview` restricts a capture run to overview specimens.

List controls switch the shared specimen category across every supported thumbnail. The forms category includes button variants, sizes and disabled states. Typography examples contain long paragraphs and explicit line breaks. Reference-only entries show labeled official-site or public design-resource captures with multiple previews and per-capture source links. Desktop system selection resets the detail pane to the top; release evidence and usage/source sections start expanded.

The homepage starts without a selected system and explains the catalog in the desktop right pane. Individual system URLs open directly to the selected system. Typography specimens include original quotation samples with citations, unordered/ordered lists, heading levels, inline emphasis, links, code, keyboard notation and definition lists. Official components and published classes provide the styling; unsupported rich-text elements retain native semantic HTML.

Use [Suggest a system](https://github.com/akiyan/design-system-catalog/issues/new?template=add-design-system.yml) to request an addition through GitHub Issues.


Specimen palettes follow each official site's canvas rather than a uniform white background. Coinbase CDS and Cloudscape use their published dark themes; other observed backgrounds include cream, lavender and gray. Palette evidence is stored in `docs/official-theme-validation.json` and `appearance` in the implementation registry. Transient overlays and marketing hero panels are excluded when selecting a documentation canvas.
