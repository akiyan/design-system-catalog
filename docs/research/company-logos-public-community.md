# 行政・国際機関・コミュニティのロゴ：補足調査

確認日：2026-11-20（日本時間）。企業ロゴ調査の補足。許諾申請・法律相談は実施していない。

## 詳細を確認できたもの

### デジタル庁（DADS）— 事前申請・許諾が必要

- [ロゴタイプの使用条件・申請・使用キット](https://www.digital.go.jp/applications/logotype)（HTTP 200で本文確認）
- [コピーライトポリシー](https://www.digital.go.jp/copyright-policy)（HTTP 200で本文確認）
- 公式の明記：「必ずデジタル庁に対して申請し、許諾を受けてください」。ロゴは一般の公共データ利用規約の対象外。
- 「ロゴを使用してデジタル庁ウェブサイトにリンクさせる場合」は申請可能な用途として列挙されている。ただしリンクすれば申請不要という意味ではない。DADS紹介カードに使う計画を添えて確認する。
- 使用キットはZIPで公開。基本形は日英2行、最小高さ50 CSS px。省略形は最小高さ20 CSS pxで、面積が小さく基本形を使いにくく、日本語話者または英語話者のみに向けた内容の場合に限る。日英切替サイトでの省略形の適否も申請時に確認する。
- アイソレーション規定があるため、一律の小型正方形アイコンにする設計には不向き。使用キット内PDFの全文確認は未実施。許諾取得前には掲載しない。
- 探索中の旧候補 `/policies/posts/logos`（`/policies/logos`へ転送）と `/copyright` は404。上記現行ページで解決した。

### GOV.UK — OGLだけではロゴを使えない

- [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)（HTTP 200で本文確認）
- OGLの適用除外に「departmental or public sector organisation logos, crests and the Royal Arms」と商標等を明記。公式性・推奨の示唆も許諾されない。
- これはGOV.UK/GDSのロゴ利用許可を直接定めるページではない。今回、外部カタログに単体ロゴを掲載できる個別条件までは確認していない。文字表記を維持する。
- 候補 `https://www.gov.uk/government/publications/govuk-logo-guidelines` は404。一般の[画像ガイダンス](https://design-system.service.gov.uk/styles/images/)はアクセシビリティ指針であり、ロゴ利用許可の根拠ではない。

### WFP — 事前の書面許諾が必要

- [WFP Terms of Use](https://cdn.wfp.org/legal/terms/)（HTTP 200で本文確認、文書上の最終更新2017-06-21）
- 第12項：「The WFP Marks may not be reproduced or used in any manner without WFP’s prior written permission.」
- WFP名称・紋章・略称を対象としており、UI Kitのコードが公開されていても、提供元の紋章をカタログで使う許可にはならない。掲載は許諾後。
- 候補 `https://www.wfp.org/brand` は404。サイト上のSVG画像URLは許諾の証拠にしない。

### USWDS / GSA — 今回は個別許諾を確認できず

- [USWDS About](https://designsystem.digital.gov/about/)でGSAのプロダクトであることと連絡先 `uswds@gsa.gov` を確認。
- [GSA Website policies](https://www.gsa.gov/website-information/website-policies)は取得できたが、取得本文が長大で途中省略された。ロゴ利用に関する条項の確認には不十分。
- パブリックドメインのコード・政府サイトというだけでは、GSAの紋章やUSWDSロゴの自由利用を推定しない。必要ならUSWDSチームに外部カタログ用途を確認。

## 今回の企業ロゴ調査の対象外（個別規定は未調査）

以下もカタログにあるが企業提供ではない。すべて「掲載可否は未判定」とし、名称のテキスト表示を継続する。公開ドキュメントにロゴがあることだけでは採用しない。

| システム | 提供元 | 公式入口（カタログ登録値。今回ロゴ規定の本文確認なし） |
|---|---|---|
| SGDS | GovTech Singapore | https://www.designsystem.tech.gov.sg/ |
| Agriculture Design System | 豪州農林水産省 | https://design-system.agriculture.gov.au/ |
| Czech Design System | Digital and Information Agency | https://designsystem.gov.cz/ |
| Designers Italia | イタリア・デジタル変革担当部門 | https://designers.italia.it/ |
| Europa Component Library | 欧州委員会 | https://ec.europa.eu/component-library/ |
| GC Design System | カナダ政府 | https://design-system.canada.ca/ |
| CFPB Design System | Consumer Financial Protection Bureau | https://cfpb.github.io/design-system/ |
| Bristol Design System | Bristol City Council | https://style.bristol.gov.uk/ |
| BC Design System | Government of British Columbia | https://www2.gov.bc.ca/gov/content/digital/design-system |
| KoliBri | ITZBund / Public UI | https://public-ui.github.io/ |
| DSFR | フランス政府 | https://www.systeme-de-design.gouv.fr/ |
| Ariakit | Ariakit community | https://ariakit.com/ |
| Kobalte | Kobalte community | https://kobalte.dev/ |
| Bits UI | Bits UI community | https://bits-ui.com/ |

コミュニティ製品に架空の企業ロゴを割り当てない。製品ロゴを採用するなら、そのアートワークのライセンスと商標規定を別途確認する。
