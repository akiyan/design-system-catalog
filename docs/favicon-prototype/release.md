# favicon配置の採用・公開記録

採用日：2026-11-21（日本時間）

## 採用内容

- デスクトップのトップページ：サムネイル右上にfavicon。
- デスクトップ詳細の左一覧・モバイル一覧：システム名の先頭に20pxのfavicon。画像には重ねない。
- 取得できた59件を表示し、8件は欠損として非表示。取得元・確認時の制限は[出典](<../research/site-favicon-sources.md>)を参照。
- faviconを企業ロゴ素材と置き換えただけで権利処理済みとは扱わない。公開依頼は運営者による配置採用の判断であり、各権利者の許諾取得の記録ではない。
- [企業ロゴ調査資料](<../research/company-logo-usage.md>)と初回案・修正案のスクリーンショットをリポジトリに保存。

## 実装コミット

[f88edc5 — Add official site favicons to catalog cards and list names](https://github.com/akiyan/design-system-catalog/commit/f88edc5)

## ローカル最終検証

- favicon素材検証：5件成功。
- `pnpm build`：成功。静的HTMLと実コンポーネントのバンドルを生成。
- `pnpm test --workers=2`：218件成功（37.8秒）。faviconの配置・欠損・読込失敗の回帰テスト4件を含む。
- favicon追加で1行内に複数画像が存在するようになったため、既存5箇所のテストセレクタを`.row-image > img`に限定。実見本の検証内容は維持した。
- 公開用CIに素材検証も追加。

## 公開状況

- mainへのpush後、[GitHub Actions 44860851314](https://github.com/akiyan/design-system-catalog/actions/runs/44860851314)が成功し、Cloudflare Pagesへの公開が完了。
- 公開された実装コミット：`f88edc56272828dd3e13213fbd6d147a183fb055`。
- 本番URL： https://design-system-catalog.akiyan.tokyo/
- 本番URLへChromiumでアクセスし、トップ・詳細左一覧・390pxモバイル一覧を撮影して目視確認。
- 配置、favicon読込、画像との非重複（一覧）、横はみ出しなし、読込失敗時の非表示を自動検証しすべて成功。ページのJavaScriptエラーなし。
- 本番URLに対するfaviconブラウザ回帰テスト4件が成功（2.9秒）。

### 本番スクリーンショット・検証結果

- [トップページ](<production/home-desktop.png>)
- [一覧＋詳細](<production/list-desktop.png>)
- [モバイル一覧](<production/list-mobile.png>)
- [画面配置の機械検証](<production/checks.json>)
