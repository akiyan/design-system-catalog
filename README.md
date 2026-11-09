# Design System Catalog / デザインシステムカタログ

[Live site / 公開サイト](https://design-system-catalog-925.pages.dev/) · [Example permalink / 個別ページ](https://design-system-catalog-925.pages.dev/astryx/)

A visual catalog of 43 public design systems with screenshots from their official sites. The code is MIT licensed. Third-party captures and trademarks retain their original terms.

公式サイトのサムネイルを主役にした国内外43件のデザインシステムカタログです。

- Japanese/English browser detection and a persistent manual language selection
- Category filters; no keyword search
- Newest public release first with date evidence and explicit reference markers
- Static paths such as `/astryx/` with client navigation and Back/Forward support
- Keyboard shortcuts and a `?` help overlay
- Screenshot switching and enlarged previews

## Development / 開発

Use Node.js 22.12+.

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

## Static build and Cloudflare Pages / 静的生成

Astro prerenders the catalog homepage and all 43 system paths. React handles category filters, language selection, screenshot previews and keyboard input in the browser. No server adapter or Pages Functions are used.

```sh
npm run build
npm run deploy
```

- Build command: `npm run build`
- Output directory: `dist/client`
- Production branch: `main`
- Authenticate Wrangler to the intended Cloudflare account before deployment.

## Catalog data / 掲載情報

Edit `src/data/systems.json` to update names, categories, source URLs, technology, screenshots and publication evidence.

`published.date` retains its known precision (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`). `published.estimated` marks reference dates. `published.basis`, `sourceUrl`, `sourceTitle` and bilingual `note` document the source. The initial public release is preferred over a later redesign or version update. When it cannot be verified, contextual dates such as repository creation or a documented historical milestone are visibly labelled as references. Repository creation is not presented as a confirmed public launch. Partial dates are ordered by their known year/month; exact ordering within an unknown month or year is not asserted.

公開日は公式発表と初回リリース履歴を優先します。日や月が不明な場合は精度を補わずに表示します。周辺情報を使った項目には「参考」を表示します。採用した根拠は画面内で確認できます。

```sh
npx playwright install chromium
npm run capture:previews
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
| Left / Right | Switch screenshots |
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
npm test
# Test a built preview or the published site:
TEST_BASE_URL=http://127.0.0.1:4174 npm test
```

The 12 browser tests cover publication order/evidence, all static paths, navigation without JavaScript, history, automatic/manual languages, keyboard shortcuts, modal focus, image loading and mobile layout. Use `node scripts/capture-qa.mjs` for visual evidence.

## License and sources / ライセンスと出典

Code: MIT License. Copyright © 2026 @akiyan.

`public/previews/` contains captures of third-party official websites. These images, logos and trademarks are excluded from this repository's MIT license. Follow the respective owners' terms. The original URL is available under the usage/source details in the UI.

The catalog began with a supplied research list. Licensing for an entire system, trademarks and artwork is not assumed from its code license. Unverified license entries remain identified as such.

## Additional catalog scope

The catalog includes design systems rather than aggregator or comparison sites. Semi Design and Arco Design are separate entries. Cloudscape, GOV.UK and USWDS are deduplicated. Public documentation does not imply an open-source implementation; usage/license details distinguish those cases.
