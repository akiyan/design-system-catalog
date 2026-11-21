# 企業ロゴ掲載の事前調査 — global-b

- 確認日: 2026-11-20（日本時間）
- Timeline参照: `tree-164c2d05cc066528` / `global-b`。共有Timelineの編集なし。
- 対象用途: 独立したデザインシステム（DS）カタログのトップ／一覧で、提供元の識別目的に**企業ロゴ**を継続表示する。報道記事、公式パートナー表示、企業自身の制作物とは区別する。
- 調査のみ。ロゴの取得・配置・アプリ実装は行っていない。
- 以下は公開規約に照らした保守的な運用判断であり、法律意見ではない。法令上の参照的使用の可否と、権利者による明示的許諾の有無は別問題。

## 判定基準と結論

- **条件付き候補**: 第三者の情報提供目的が規約に含まれ、ロゴを含む定義も確認できたもの。表示案の条件適合確認は別途必要。
- **事前許諾／申請**: 書面許諾等が明記されるもの。または素材請求窓口はあるがカタログ用途の許諾がないもの。
- **報道限定**: 記者・報道目的への許諾を、一般カタログに拡張しない。
- **限定条件・要照会**: 素材やガイドは公開されていても、カタログの企業ロゴに適用できる許諾範囲が不十分。
- **不明／未確認**: 403・429・接続不能・JSの空本文・404等を含む。**不明は許可ではない**。

今回、企業ロゴについてカタログ用途の**条件付き候補と判断できたのは Airtable**。それ以外は、書面許諾・用途照会または未確認の解消前には表示しない。Vaadinの詳細なブランドガイドや各社のダウンロード提供は、それ自体では第三者カタログへの許諾を確定しない。

OSSライセンスは企業商標の許諾ではない。TDesign、Ant Design、Kumo、PatternFly、Forma 36、Vibe、Vitamin、Orbit、Lion、Boosted、Calcite、Lexiconなどの**DSロゴと企業ロゴは別資産**。DSのリポジトリに企業ロゴが入っていても、コードのMIT／Apache等をその企業ロゴへ自動適用しない。本資料はDSロゴ自体の利用許諾を認定しない。

## 一覧（全19対象）

| 対象企業／関連DS | 企業ロゴの保守的判定 | 実確認の主要根拠 |
|---|---|---|
| Porsche／Porsche Design System | 報道限定・別途許諾 | Newsroom利用条件1・3、Legal notice |
| Audi／Audi UI等 | 未確認・掲載保留 | ブランド規定・メディア規約URLが接続タイムアウト |
| Coinbase／CDS | 未確認・掲載保留 | 公式brand-assets／trademarks／pressが403 |
| Tencent／TDesign | 未確認・掲載保留 | 公式media URLがHTTP/HTTPSリダイレクト、別取得567 |
| Ant Group / Alibaba／Ant Design | 未確認・掲載保留 | Antの本文未取得、Alibabaの素材窓口は確認、許諾範囲未確認 |
| Cloudflare／Kumo | 事前書面許諾 | Trademark Guidelinesはロゴにwritten permissionを要求 |
| Red Hat／PatternFly | 別途明示的書面契約 | Use of Red Hat Logos |
| Contentful／Forma 36 | 未確認・掲載保留 | 公式brand／legal URLが429 |
| Airtable | 条件付き候補 | ロゴを含むAirtable Marksの情報提供目的使用を明示許容 |
| monday.com／Vibe | 事前書面承認 | Terms of Service 5.4(vii) |
| Decathlon／Vitamin | 限定条件・要照会 | メディアサイト規約4はアクセス等の限定許諾のみ |
| Kiwi.com／Orbit | 素材申請・用途確認 | Press officeがbrand assets requestsを受付、記者向けフォーム |
| DBS Bank | 未確認・掲載保留 | Image & Video Libraryは確認、企業ロゴ許諾条項未取得 |
| Finastra | 未確認・掲載保留 | brand／media-resourcesが403 |
| ING／Lion | 事前書面同意 | Legal informationのTrademarks, service marks and logos |
| Orange／Boosted | 事前許諾・承認ユーザー制限 | ブランドサイト規約の知財・Orange Brand条項 |
| Esri／Calcite | 限定条件・企業ロゴは要照会 | 公開情報の個人的非商用目的複製等とロゴ許諾は別 |
| Liferay／Lexicon | 限定条件・企業ロゴは要照会 | Commentary例外、商用制限、corporate logo個別ガイド請求 |
| Vaadin | 表示条件確認済み・用途許諾不明 | Brand Toolkitの公式ロゴ配布／形状・色条件は確認 |

## 対象別の確認記録

### 1. Porsche

**判定: 報道限定。カタログ一覧の企業識別ロゴとしては事前許諾を得るまで掲載しない。**

- [Porsche Newsroom Legal notice](https://newsroom.porsche.com/en/legal-notice.html) — HTTP 200。権利者の事前同意なしにサイト固有コンテンツを複製・配布・公衆利用等してはならない旨: “without the prior consent of the right holder”。
- Newsroomの共通「Terms and conditions Porsche Newsroom」1: “intended exclusively for use by journalists as a source for their own media reporting”。同3: 記載ロゴ・商標は特記なければPorsche AGの商標。
- この共通条件は[試行URLの404ページ](https://newsroom.porsche.com/en/terms-and-conditions.html)にも実際に表示された。ただし当該URL自体は `/en/404.html` へ遷移しHTTP 404であり、**有効な独立規約ページと誤記しない**。有効なLegal noticeも上記のとおり確認した。
- [Porsche Brand Guide](https://brand.porsche.com/) — HTTP 200、抽出できたのはタイトルのみ。Brand Guideの企業ロゴ個別条項は未確認。
- **資産区別**: Porscheのクレスト／ワードマークと、Porsche Design Systemの名称・識別ロゴは別。DSコード公開をクレスト利用許諾としない。

### 2. Audi

**判定: 未確認。許諾ありとしない。**

- [Audi Brand appearance候補](https://www.audi.com/en/company/brand/brand-appearance/) — 接続タイムアウト／IPv6到達不能。
- [Audi MediaCenter利用条件候補](https://www.audi-mediacenter.com/en/terms-of-use-17) — `web_fetch`は接続タイムアウト。別のHTTP取得では404。条項引用不能。
- [Audi Legal notice候補](https://www.audi.com/en/legal-notice/) — 接続タイムアウト。
- したがってリングス／Audiワードマークの第三者情報カタログ利用条件、プレス用途の範囲、申請要否は未確認。企業ロゴとAudi UI等のDS識別資産を同一の許諾としない。

### 3. Coinbase

**判定: 未確認。掲載保留。**

- [Brand assets](https://www.coinbase.com/brand-assets)、[Trademarks候補](https://www.coinbase.com/legal/trademarks)、[Press](https://www.coinbase.com/press) — 全てHTTP 403 “Just a moment...”で本文を確認できず。
- ロゴの配布、情報提供／報道目的の範囲、事前申請条件はいずれも未確認。Coinbase企業のCシンボル／ワードマークとCoinbase Design System（CDS）の識別資産は区別。CDSのOSSライセンスから企業ロゴ許諾を推定しない。

### 4. Tencent（TDesign）

**判定: 未確認。掲載保留。**

- [Tencent media brand候補](https://www.tencent.com/en-us/media/brand.html)、[Media](https://www.tencent.com/en-us/media.html)、[Statement候補](https://www.tencent.com/en-us/statement.html) — `web_fetch`では `http://www.tencent.com` へのクロスオリジン転送。指定された[HTTP URL](http://www.tencent.com/en-us/media/brand.html)を改めて確認するとHTTPSへの転送となり、規約本文に到達できず。
- Mediaの別の標準HTTP取得ではHTTP 567。ブランド規定の実条項は未確認。
- Tencent企業ロゴとTDesignロゴは別。TDesignの公開・OSSであることをTencent企業ロゴの許諾としない。

### 5. Ant Group / Alibaba（Ant Design）

**判定: Ant Group・Alibabaとも企業ロゴのカタログ許諾は未確認。掲載保留。**

- [Ant Group brand候補](https://www.antgroup.com/en/brand)、[Media kit候補](https://www.antgroup.com/en/news-media/media-kit)、[Terms候補](https://www.antgroup.com/en/terms-of-use) — HTTP 200だが本文が空。別のHTML解析でもMedia kitに条項・リンクなし。200というステータスだけで有効なガイドや許諾を確認した扱いにはしない。
- [Alibaba News and Resources](https://www.alibabagroup.com/en-US/news-and-resource) — HTTP 200。Libraryに “Logos” の[素材一覧リンク](https://www.alibabagroup.com/resource-logos)があることを確認。素材一覧の個別ダウンロード条件・転載許諾は本調査では未確認。
- [Alibaba media-resource候補](https://www.alibabagroup.com/en-US/media-resource) — HTTP 200だがサイト共通部中心。許諾条項は抽出されず、`All rights reserved` 表示のみでは用途を許可できない。
- **資産・提供元区別**: Ant Designロゴ、Ant Group企業ロゴ、Alibaba Group企業ロゴはそれぞれ別。Ant GroupとAlibabaを同一権利者・同一許諾として扱わない。Ant Designの提供元識別にどちらを表示するかも沿革だけで決めず、現在の提供元表示と権利者の双方を要確認。

### 6. Cloudflare（Kumo）

**判定: 企業ロゴは事前書面許諾。文字での参照許容と混同しない。**

- [Trademark Guidelines](https://www.cloudflare.com/trademark/) — `web_fetch`はHTTP 200だが本文抽出不能、通常HTTP取得は403。[同規約のクエリ付きURL](https://www.cloudflare.com/trademark/?ref=brand)を標準HTTPクライアントで取得するとHTTP 200となり、全該当条項を確認できた。
- “You are permitted to use Cloudflare trademarks in word form only (word marks, not logos) to identify Cloudflare products or services”。
- “Use of the Cloudflare logos (other than the use of Web Badges described below) requires our written permission.”
- Web badgesはCloudflareに保護・高速化されるサイトの利用表示向けの限定例外。**Kumoの提供元を示す企業ロゴ欄を、この例外に置き換えない**。
- 許可後も初出の商標表示、帰属文、真実の参照、関係・推薦誤認防止、非改変などを要求。
- [Cloudflare Press Kit](https://www.cloudflare.com/press/press-kit/) — HTTP 200。Company logos／透明・白背景版の配布と `press@cloudflare.com` を確認。配布は上記書面許諾要件を消さない。
- [brand.cloudflare.com候補](https://brand.cloudflare.com/) — DNS解決失敗。根拠に使わない。
- Cloudflareの雲ロゴとKumoのDSロゴは別。

### 7. Red Hat（PatternFly）

**判定: 企業ロゴは別途の明示的書面契約が必要。**

- [Trademark guidelines and policies](https://www.redhat.com/en/about/trademark-guidelines-and-policies) — HTTP 200。`web_fetch`のナビゲーションによる切断を補うため同URLのHTMLを取得・テキスト抽出して本文確認。
- 「Use of Red Hat Logos」: “These Guidelines do not give you any permission to use a Red Hat Logo or any Red Hat Word Mark in a stylized form.” 続いて “a separate, express written agreement with Red Hat” を要求。
- 冒頭は商標と著作権を明確に区別: “Trademarks and copyright are different rights”。OSSで有する権利と、商標の権利・許諾は別であることを説明。
- 許可後も非改変、適切なクリアスペース、関連Red Hatサイトへのリンク、Brand Standards遵守などが必要。問い合わせ: `trademarks@redhat.com`。
- PatternFlyのDSロゴへの別ポリシーがある可能性と、Red Hatの帽子ロゴの許諾は区別。

### 8. Contentful（Forma 36）

**判定: 未確認。掲載保留。**

- [Brand guidelines候補](https://www.contentful.com/legal/brand-guidelines/)、[Brand候補](https://www.contentful.com/brand/)、[Terms of service](https://www.contentful.com/legal/terms-of-service/) — HTTP 429、Vercel Security Checkpoint。規約本文未確認。
- Contentful企業ロゴとForma 36のDSロゴは別。Forma 36のコードライセンスを企業ロゴへ拡張しない。

### 9. Airtable

**判定: 条件付き候補。企業識別の情報提供という設計が条件に合えば公開ガイドラインで検討可能。**

- [Trademark Guidelines](https://www.airtable.com/company/trademark-guidelines) — HTTP 200。長いナビゲーションを除いたHTML本文も確認。表示上の更新日は2023-09-12。
- 定義は “name, trademarks, logos, designs, service marks, or other brand assets”（Airtable Marks）で、**ロゴを含む**。
- 「What's Allowed」: “Reference Airtable or our products or services in an informational context in articles, websites, etc., provided such reference is not confusing or misleading.”
- 主要条件: 正確な説明、関係・提携・スポンサー・推薦を示唆しない、権利者帰属を明示、公式ロゴの非改変・非変形・非描き直し、自サイトの名称／ブランディングより目立たせない。情報提供ウェブサイトの例外は単なる報道記事限定とは書かれていない。
- 帰属の公式例: “Airtable and the Airtable trademark are registered trademarks of Formagrid Inc dba Airtable.” 非関係性のディスクレーマーも推奨。権利者は許容使用を変更・撤回できる。
- [Newsroom](https://www.airtable.com/newsroom) — HTTP 200。Media Resourcesの “Brand assets — Download the official Airtable logo and marks” と `press@airtable.com` を確認。[旧推測パス](https://www.airtable.com/company/brand)は404。
- **適用判断**: DS名に添える小さな提供元表示は情報的参照として検討できるが、スポンサー一覧に見える「ロゴウォール」、本カタログ自体のブランドへの組込み、広告的推薦表現は避ける。アイコン単体の任意切出しではなく公式承認ロックアップを基本にする。

### 10. monday.com（Vibe）

**判定: ロゴ表示は事前書面承認。**

- [Terms of Service（現行到達先）](https://monday.com/l/legal/tos/) — HTTP 200。[terms-of-serviceパス](https://monday.com/l/legal/terms-of-service/)から到達。該当本文は同URLのHTML抽出でも確認。
- 5.1はdesign system、names、logos、trademarks等をmonday.com Materialsに含め、権利留保。
- 5.4(vii): “use or display logos of the Services or Sites without monday.com’s prior written approval” を制限。
- 5.2 Customer Referenceは**monday.comが顧客の名前／ロゴを利用する権利**であり、逆方向にmonday.comのロゴを使える規定ではない。
- [brand候補](https://monday.com/brand)・[trademark-policy候補](https://monday.com/terms/trademark-policy/)は404。[別のbrand候補](https://monday.com/p/brand/)は無関係のBrand Innovatorsイベントへ転送され、ロゴ規定としては不採用。
- 企業のmonday.comロゴ、DSのVibe、同社AI製品monday vibeは名前が似ていても別。Vibeコード公開から企業ロゴ許諾を導かない。

### 11. Decathlon（Vitamin）

**判定: 限定条件・要照会。カタログへの転載許諾は確認できず、掲載保留。**

- [Decathlon United Media](https://www.decathlon-united.media/) — HTTP 200。プレスルーム・連絡先 `international.media@decathlon.com` を確認。
- [Terms of use](https://www.decathlon-united.media/en_GB/terms-of-use) — HTTP 200。抽出不足を同URLのHTML解析で補完。
- 4「Intellectual Property」: 素材・商標等の権利をDecathlon等に留保。許諾は “simple access, navigation and use linked to the Site”。“This license does not grant Users any other right, particularly any right of commercial exploitation” と限定。
- メディアサイトであることからプレス素材が存在するとはいえても、一般カタログの企業ロゴ継続転載までの許諾とは読まない。特定ロゴの別条件があれば追加確認が必要。
- [media候補](https://www.decathlon-united.media/en_GB/media)は200の `/404` へ転送。素材規定として使わない。
- Decathlon企業ロゴとVitamin DSロゴは別。

### 12. Kiwi.com（Orbit）

**判定: 素材申請窓口あり。カタログ用途を説明して許諾・条件を確認するまで掲載しない。**

- [Kiwi.com Media Room](https://media.kiwi.com/) — HTTP 200。“Media inquiries, interviews, travel data, and brand assets requests” と[Press office](https://media.kiwi.com/press-office/)へのリンクを確認。
- Press office — HTTP 200。同じ用途説明に加え、必須項目が “News Outlet” “Journalist name” などの記者向けフォーム。**申請窓口の存在は一般カタログへの事前許諾ではなく、報道以外の用途対応も未確認**。
- [brand候補](https://media.kiwi.com/brand/)は404。
- Kiwi.com企業ロゴとOrbit DSロゴは別。OrbitのOSS性を企業ロゴ許諾の代わりにしない。

### 13. DBS Bank

**判定: 未確認。掲載保留。**

- [Image & Video Library](https://www.dbs.com/media/image-video-library.page) — `web_fetch`はHTTP 200。建物・支店・ワークスペース・経営陣画像等のメディア配布を確認。別HTTPクライアントでは403。
- [Terms & Conditions](https://www.dbs.com/terms/default.page) — `web_fetch`はHTTP 200だがナビゲーション・フッター中心で権利条項本文を確認できず。別HTTPクライアントは403。
- [DBS Brand Assets候補](https://www.dbs.com/newsroom/DBS_Brand_Assets) — HTTP 200だがNewsDetailの共通部のみ。企業ロゴの許諾内容を確認したとは扱わない。
- ページにDBSロゴが表示されることや画像ZIPが配布されることは、ロゴの転載許諾ではない。企業マークとDBSのDS識別資産も区別。

### 14. Finastra

**判定: 未確認。掲載保留。**

- [Brand候補](https://www.finastra.com/brand)、[Media resources候補](https://www.finastra.com/news-events/media-resources) — HTTP 403 “Access Denied”。本文未確認。
- Finastra企業ロゴと同社DSのロゴ・製品ブランドを区別。カタログ使用の条件、申請、報道限定の有無を推定で埋めない。

### 15. ING（Lion）

**判定: 企業マークは事前書面同意が必要。**

- [ING Media kit](https://ing.com/newsroom/media-kit) — HTTP 200。ロゴ・ブランドガイドへの案内 “Our brand fundamentals with logo and brand guidelines” を確認。
- [Legal information](https://ing.com/pages/legal-information) — HTTP 200。ナビゲーション以降の実条項を同URLのHTML抽出で確認。
- 「Trademarks, service marks and logos」: “Users are prohibited from using any of the marks without the prior written consent of the relevant ING company.”
- 著作権条項に「ING情報提供」目的の記述があっても、独立したマーク使用の書面同意条項を無視できない。Media kitの存在だけで免除としない。
- [旧ブランド候補](https://ing.com/About-us/ING-Brand.htm)と[旧disclaimer候補](https://ing.com/disclaimer)は404。
- INGのライオン企業マークとLion（headless web componentsのDS名・識別ロゴ）は別物。名前がLionであることは企業マーク利用根拠ではない。

### 16. Orange（Boosted）

**判定: 事前許諾・承認ユーザー制限。一般カタログに自動適用できない。**

- [Orange Brand Site](https://brand.orange.com/en) — HTTP 200。公開版とログイン後版を区別し、Brand logosへの案内がある。
- [Terms and conditions](https://brand.orange.com/en/node/317) — HTTP 200。
- 「Intellectual property rights」: “without the prior express permission of Orange, its designee or the copyright owner” の複製・配布・ダウンロード等制限。
- 素材は “only for use in relation to the businesses of Orange and/or authorised users of the Orange brand” と規定。個人利用のページ抜粋や社内共有の例外を公衆カタログのロゴ使用に拡張しない。商用利用には別ライセンスが必要。
- 「Use of the Orange Brand」: 関連Brand Licence Agreement、Orange Brand Guidelines、通知される品質基準等に従う。
- 問い合わせ: `support.brandsite@orange.com`。Orangeのオレンジ色四角企業ロゴとBoosted（Bootstrap系DS）の識別資産は別。

### 17. Esri（Calcite）

**判定: 公開情報には限定条件あり。企業ロゴのカタログ許諾は未確認のため要照会。**

- [Copyright and Proprietary Rights Acknowledgement](https://www.esri.com/en-us/legal/copyright-proprietary-rights) — HTTP 200。
- サイト情報の複製・再配布等について “for personal, noncommercial purposes, including teaching, classroom use, scholarship, and/or research” と限定し、適切なEsri著作権表示を要求。商用目的の複製・送信には書面許諾を要求。
- これはサイト情報の利用規定であり、**企業ロゴをトップ／一覧に継続表示する明示的な商標許諾とは確認できない**。非商用カタログであっても `personal` や列挙目的への適合を勝手に認定しない。
- [Legal overview](https://www.esri.com/en-us/legal/overview) — HTTP 200、上記の正式権利ページへのリンクを確認。
- [trademarks候補](https://www.esri.com/en-us/legal/terms/trademarks)、[trademark-guidelines候補](https://www.esri.com/en-us/legal/terms/trademark-guidelines)、[terms-of-use候補](https://www.esri.com/en-us/legal/terms-of-use)は404。リンク先のPDF規定は本調査では精読しておらず、根拠として採用しない。
- Esri企業ロゴ（地球マーク等）とCalciteのDSロゴは別。CalciteのOSS性をEsriロゴへ拡張しない。

### 18. Liferay（Lexicon）

**判定: 非商用の論評等には条件付き許容があるが、企業ロゴは個別ガイド確認が必要。トップ／一覧への掲載は要照会。**

- [Liferay Trademark Policy](https://www.liferay.com/trademark) — HTTP 200。`web_fetch`はタイトルのみだったため同URLのHTMLを取得・抽出して条項確認。
- 「Permitted Use / Commentary and Parody」: 推薦を示唆しないdiscussion・commentary・criticism・parodyを許容し、記事／ウェブコンテンツ／ブログ等で単にLiferayを参照し代弁していないと明確にする条件。
- 「Restricted Use / Commercial Use」: “any commercial intent including websites, projects, solutions, or classes” 等に制限。純粋な非商用コミュニティ情報提供と、商用のウェブサイトを区別。
- 「Use Guidelines / Liferay corporate logo」: “Please request a copy of pr@liferay.com for approved usage guidelines.” 企業ロゴ固有の承認ガイドは未取得。
- 商標形状・色の改変は承認なしにしない。不明な用途の照会・ライセンス申請も `pr@liferay.com`。
- **判断**: 文章による参照の許容があっても、企業ロゴ欄に関する個別条件を飛ばして採用しない。Lexicon DSロゴの許諾は別。

### 19. Vaadin

**判定: 公式配布と表示条件は確認済み。第三者カタログ用途の包括許諾は不明、掲載前に要確認。**

- [Vaadin Brand Toolkit](https://brand.vaadin.com/) — HTTP 200。[旧trademark URL](https://vaadin.com/trademark)は同ホストへの転送だったため転送先を直接確認。Version 3.0、Updated Sep 22, 2026という表示。
- 「Vaadin Logo」: シンボル（縦向きトナカイ頭）と文字ロゴの組合せ。**文字ロゴは必ずシンボルと一緒**。会社・製品の表示にはfull lockupを優先。単体シンボルはより非公式・コミュニティ／個人文脈向け。
- “The full lockup should be used in most cases, especially when representing the company or the product.”
- クリアスペース、指定色、背景に応じた黒／白ワードマーク＋青シンボル、縦横比維持、可読性を規定。回転、構成要素の関係変更、別の形への封入等を禁止。
- 公式Google DriveのDownload logosリンクはあるが、**外部カタログが無申請で企業ロゴを使える旨の適用範囲や商標ライセンスは確認できなかった**。見た目の条件が揃っていることと、用途の許諾は分ける。
- Vaadinは企業名・製品名が重なるが、そのことから全Vaadin関連イラストやDS資産の同一許諾を推定しない。

## カタログでの保守的運用（実装しない）

1. 不明・申請対象・報道限定の企業は、許諾取得までは企業名の通常テキストによる事実説明と公式リンクを基本候補にする。文字使用にも個別規定があるため、ロゴ規定が不明だから文字は無条件自由、とは断定しない。
2. Airtableを採用検討する場合も、公式素材、帰属、非関係性表示、十分に小さい従属表示、非改変等を具体的表示案で確認する。
3. 許諾申請には、トップ／一覧・詳細のスクリーンショット案、表示サイズ、隣接するDS名、商用性／広告有無、独立カタログであること、リンク先、ホスティング・保存方法を明示する。「報道用素材をダウンロードした」だけでは代替しない。
4. 企業ロゴとDSロゴを別々に台帳管理し、根拠URL、取得日、適用条項、許諾メール、使用範囲・期限を記録する。Simple Icons等の第三者配布元のライセンスだけで企業商標を判断しない。
5. ブロックや空本文は本資料の未確認理由であり、権利者が禁止したという法的結論でも、許可したという結論でもない。再確認・問い合わせが必要。

## 確認方法・限界

公式URLへ `web_fetch` を実行。ナビゲーションの長さ等で本文が切れる場合は、同URLをPython標準HTTPクライアントで取得しHTMLParserでスクリプトを除いて確認した（Red Hat、Liferay、Cloudflare、Airtable、Decathlon、monday.com、ING）。認証・ログイン・アカウント作成・申請送信・アクセス制御回避は行っていない。HTTP取得結果が方法で異なる場合は両方を記録した。PDF・ログイン後資料・各ロゴZIPの同梱条件までは未確認。全19対象に判定と根拠URLまたは未確認理由を付した。
