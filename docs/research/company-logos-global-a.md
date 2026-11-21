# 企業ロゴ掲載の事前調査 — 海外企業 global-a

- 調査日: 2026-11-20（日本時間）
- Timeline: `tree-164c2d05cc066528` / task: `global-a`
- 対象用途: 独立したデザインシステムカタログのトップ／一覧カードで、**DSの提供元を識別する小さな企業ロゴ**を表示する。公式・提携・推奨という意味は持たせない。
- 実施内容: 公式プレスキット、商標利用条件、ブランド規定のHTTP実取得と条項確認のみ。アプリ実装・ロゴ導入・共有Timeline編集は行っていない。
- これは公開規定からの運用上の保守的判定であり、各国の商標法上の適法性に関する法的助言ではない。法定の記述的使用と、権利者が明示する許諾範囲は区別した。

## 判定方法・読み方

- **申請／書面許可**: 企業ロゴの表示に明示的許可を要求する規定が確認できた。カタログ用途の承認取得前は採用しない。
- **条件付き候補・要確認**: 公式に関連する使用例はあるが、このカタログ用途まで含むか、他の許可要件と両立するかが未確定。無申請で採用可能という意味ではない。
- **用途限定／適用不明**: Pinterest上のプレゼンス訴求、報道向け配布などが確認できたが、独立カタログの提供元表示への許諾は確認できない。
- **未確認**: ブロック、空応答、JS依存、または該当許諾条項を取得できなかった。許可・禁止の断定はしないが、公開は保留する。
- 「press kit」「download」があることだけでは利用許諾とは判定しない。**報道向け配布と「報道に限る」という明文制限も同一視しない**。
- **企業ロゴとDS固有ロゴは別**。本資料は企業のコーポレートマークを対象とする。Cloudscape、Gestalt、Astryx、Pajamas、Paste、Evergreen、Wise Design、Semi、Arco、Spectrum 2、React Aria、Carbon、Fluent 2、Base Web、Polaris、Primer、Atlassian Design System、Lightningの名称・DS固有マークを企業ロゴの代用品として許諾済みとは扱わない。
- **OSSライセンス ≠ ロゴ／商標の許諾**。コードのMIT/Apache等や公式リポジトリ内にロゴ画像があることは、第三者サイト上での企業ロゴの再表示根拠にしない。

## 全対象の結論一覧

| 提供元／対象DS | 調査した企業マーク | 規定上の区分 | カタログトップ／一覧の保守的判定 |
| --- | --- | --- | --- |
| AWS / Cloudscape | AWS、AWS Smile | 申請／書面許可 | 不採用、個別許可が必要。一般fair useはplain text only。Powered by AWSに置換しない |
| Pinterest / Gestalt | Pinterest P、ワードマーク | 用途限定／適用不明 | Pinterest上のプレゼンス訴求規定をDS提供元表示まで拡張せず、確認まで保留 |
| Meta / Astryx | Meta infinity＋ワードマーク | 申請／承認 | 全Metaロゴ利用に承認要求。Brand Review承認まで不採用 |
| GitLab / Pajamas | GitLab Core Logo、Logomark、Wordmark | 原則不可・申請も一般に拒否 | カタログへの企業ロゴ表示は不採用。CE未改変配布時の保持例外は別用途 |
| Twilio / Paste | Twilio企業ロゴ | 申請／書面許可 | 不採用、trademark@twilio.comへ用途を示して照会 |
| Segment / Evergreen | Segment企業ロゴ | 申請／書面許可 | Twilio規定がSegmentおよび関連ロゴを明記。企業ロゴを無断採用しない |
| Wise / Wise Design | Wise企業ロゴ、Fast Flag等 | プレス配布あり・用途許諾不明 | Press kitの存在だけで採用しない。独立カタログ利用の許可確認が必要 |
| ByteDance / Semi Design | ByteDance企業ロゴ | 未確認 | 企業サイト／IP Principlesにカタログ利用許諾を確認できず保留 |
| ByteDance / Arco Design | ByteDance企業ロゴ | 未確認 | Semiと同様。Arco固有ロゴのライセンスを企業ロゴへ転用しない |
| Douyin / Semi、Arcoの提供元表記候補 | 抖音／Douyinブランドマーク | 申請／事前書面同意 | Douyin利用規約10.7が識別標識の展示・使用に書面同意を要求。ByteDance企業ロゴとは別判定 |
| Adobe / Spectrum 2 | Adobe企業ロゴ | 申請／書面ライセンス | 不採用。文字の製品識別許可はロゴを除外 |
| Adobe / React Aria | Adobe企業ロゴ | 申請／書面ライセンス | Spectrum 2と同じ。React Aria独自アイコンとは別 |
| IBM / Carbon | IBM 8-bar | 申請／書面許可 | 不採用。fair useはtext-only、IBMロゴを明示除外 |
| Microsoft / Fluent 2 | Microsoft企業ロゴ（四色窓等） | 申請／明示ライセンス | 不採用。一般的文字参照とロゴ利用を区別 |
| Uber / Base Web | Uber企業ロゴ | 未確認（取得制限） | 規定本文未確認のため不採用。ブロックは許可根拠にしない |
| Shopify / Polaris | Shopify Shopping Bag＋ワードマーク | 申請／書面許可 | 不採用。素材ダウンロードがあっても書面承認が必要 |
| GitHub / Primer | GitHub Invertocat、ロックアップ | 条件付き候補・許可要件要確認 | GitHubへのリンク例はあるが同ページにprior written permission要件。提供元アイコンとしては照会・承認まで保留 |
| Atlassian / Atlassian Design System | Atlassian企業ロゴ | 条件付き候補・適用範囲要確認 | 製品promote等の用途規定あり。ただしauthorized partner/vendor文脈とカタログの関係を確認し、必要なら書面承認 |
| Salesforce / Lightning | Salesforce cloud企業ロゴ | 申請／書面許可 | 不採用。製品統合図に限るproduct logo例外は一覧カード用途ではない |

**直ちに無条件で採用可能と判断できた企業ロゴはない。** 条件付きの候補はGitHub、Atlassianだが、いずれもこの用途への適用確認が残る。まず提供元のプレーンテキストと公式サイトへのリンクを基本にするのが安全側。文字商標にも正確性・帰属表示等の条件があるため、文字なら無条件という意味ではない。

## 1. AWS — Cloudscape

**実確認URL（HTTP 200）**
- [AWS Trademark Guidelines & License Terms](https://aws.amazon.com/trademark-guidelines/)

**確認条項**
- §2: AWS MarksにAWS、AWS Smile Logo、製品・サービス・プログラム等の名称とロゴを含む。
- §3(d): “Any use ... outside the scope of the foregoing licenses requires Licensor’s prior written permission.”
- §13 Fair Use: “plain text only (no logos)”で真実の事実を記述し、提携・支援・推奨を示唆しない。
- §3(a)の顧客向けPowered by AWSは、AWSサービスを使用するコンテンツ／サービス用ツールの識別に限定。企業の提供元識別用のAWS企業ロゴとは別。
- §4は事前承認済み素材、§5は非提携・非推奨と自ブランドより大きく／目立つ表示の禁止、§9は非改変・余白など。

**判定**: Cloudscapeの提供元表示のためにAWS企業ロゴを置く一般許可は確認できない。書面許可が必要。CloudscapeのOSSコード使用とAWSロゴ許諾は別。

## 2. Pinterest — Gestalt

**実確認URL（いずれもHTTP 200）**
- [Pinterest Brand Guidelines](https://business.pinterest.com/brand-guidelines/)
- [Pinterest Trademark policy](https://policy.pinterest.com/en/trademark)

**確認条項**
- ガイド冒頭: “for businesses promoting their presence on Pinterest”。媒体は店頭、包装、デジタル、放送を含むが、目的はPinterest上のプレゼンス訴求。
- ロゴ: 公式EPS／高解像度PNG、赤円内白Pを基本とし色制約時に黒／白、フィルター等による改変禁止。
- “Don’t use any Pinterest marks, logos, graphics ... as part of your logo or branding.”
- Press assetsの配布とpress@pinterest.comを案内。“Only members of the press will receive a response.” は**報道窓口の回答対象**の説明であり、全利用が報道限定という条項には読み替えない。
- Trademark policyは第三者の侵害申告と執行が中心で、カタログ向け企業ロゴ許諾の根拠にはならない。

**判定**: Gestalt提供元の識別はPinterest上の自社プレゼンス訴求とは異なる。素材が取得可能でも、独立DSカタログ用途への許諾は不明。許可とせず保留。Pinterest PマークとGestalt固有ブランドを混同しない。

## 3. Meta — Astryx

**実確認URL**
- [Meta brand resources and guidelines](https://www.meta.com/brand/resources/meta/company-brand/)（HTTP 200、ページ上Updated June 2026）
- 旧 [about.meta.comのURL](https://about.meta.com/brand/resources/meta/company-brand/) はweb_fetchでwww.meta.comへのクロスオリジン転送により停止。その後、上記の現行URLを直接取得して確認したため、最終的な条項は未確認ではない。

**確認条項**
- “All usage of the Meta logo requires approval.”
- Metaの担当者を通して内部Brand Reviewを申請。申請処理は英語のみ。
- 利用例には正式契約のある提携／スポンサー、ニュース、editorials、書籍等、包装、オンライン／TV広告を挙げるが、**列挙は無承認許可ではない**。
- シンボル高さ最低12px／5mm、クリアスペースはシンボル高さの2倍。MetaロゴでFacebookを代表しない。

**判定**: Astryxの提供元表示にも承認取得が必要。企業MetaロゴとAstryxのDSロゴは別。無申請での採用不可。

## 4. GitLab — Pajamas

**実確認URL**
- [GitLab logos and brand assets / press kit](https://about.gitlab.com/press/press-kit/)（HTTP 200）
- [現行Trademark Guidelines](https://handbook.gitlab.com/handbook/marketing/brand-experience/trademark-guidelines/)（HTTP 200、Last modified October 28, 2026）
- Press kitからリンクされた旧階層の[trademark-guidelines](https://handbook.gitlab.com/handbook/marketing/brand-and-product-marketing/brand/brand-activation/trademark-guidelines/)は現行URLへ転送され取得できた。
- 最初に試行した旧[brand-guidelines](https://handbook.gitlab.com/handbook/marketing/brand-and-product-marketing/brand/brand-activation/brand-guidelines/)は404。これを許諾根拠には使っていない。

**確認条項**
- 冒頭: “Use of the Logos is not permitted under these Guidelines, except ... Section 3.1.”
- Webサイト等のmarketing materials、UI、integrations等へのロゴ使用要求は “will generally be refused”。窓口: intellectualproperty@gitlab.com。
- §3.1は**未改変GitLab CEソフトウェアの配布**で、含まれる商標を保持する場合の限定例外。
- “This [MIT] license does not cover use of the Trademarks.”
- §1.2.2は初出／最も目立つGitLab名付近の商標帰属文を要求。

**判定**: 企業ロゴをカタログのUIへ抜き出して表示することはCE配布例外ではない。不採用。Press kitの公開にかかわらず現行商標規定を優先。Pajamas固有マークも別途確認対象。

## 5. Twilio／Segment — Paste／Evergreen

**実確認URL（HTTP 200）**
- [Twilio Trademark Usage Guidelines](https://www.twilio.com/en-us/legal/trademark)

**確認条項**
- “Most uses ... require our express written permission”。許可なしの限定参照はplain textに限る。
- Twilio Logo節: “you may not use it without our express written permission”。提携関係の存在だけでもロゴ利用権は生じない。
- 商標帰属例に “Twilio, Segment and all related logos are trademarks of Twilio Inc. or its affiliates.” とあり、Segmentを対象に含めている。
- OSSについて “Most open source licenses don’t grant, and many expressly exclude, a license to use trademarks.”
- Powered by Twilio例外はTwilio技術で構築・統合した自社サービス等を識別するバッジで、企業ロゴとは別。その他ロゴは明示書面許可。
- 質問・ロゴ利用申請: trademark@twilio.com。

**判定**: PasteのTwilio企業ロゴ、EvergreenのSegment企業ロゴとも書面許可待ち。企業グループ上の関係があってもTwilioとSegmentのマークを一つにまとめず、それぞれ対象画像と用途を明示して申請する。

## 6. Wise — Wise Design

**実確認URL**
- [Wise Press page](https://wise.com/gb/press)（HTTP 200）
- [Wise intellectual property](https://wise.com/help/articles/79CxCv9Qj1r7mDPJuIwUA3/wise-intellectual-property)（HTTP 200）
- [Wise Design / Logo](https://wise.design/foundations/logo)（HTTP 200。ただし取得本文はLogoと「This site requires JavaScript」のみで、ロゴ規定本文は未確認）

**確認条項**
- Press page: press kitには “visual assets, including logos, product visuals ...” を含む。press@wise.comが窓口。
- Intellectual property: brandingを含む知的財産はWise／ライセンサーに帰属。顧客への限定ライセンスはサービス利用に必要なpersonal useのみで、Wise以外の製品・サービスに拡張しない。“Any use not specifically permitted is strictly prohibited.”
- これは顧客のサービス利用条項であり、独立カタログへの個別ロゴ許諾を与える条項ではない。
- [試行brand URL](https://wise.com/gb/about/brand)、[試行brand-assets URL](https://wise.com/imaginary-v2/brand-assets)は404で根拠にならない。

**判定**: **プレス向け配布は確認できたが、報道限定という明文も、カタログ用許可も未確認**。Press kitの存在だけでは企業ロゴを採用しない。Wise DesignのDSマークと企業マークを区別して、転載用途を問い合わせる。

## 7. ByteDance／Douyin — Semi Design、Arco Design

### ByteDance企業マーク

**実確認URL**
- [ByteDance企業サイト](https://www.bytedance.com/?locale=en)（HTTP 200）
- [ByteDance IP Principles](https://www.bytedance.com/ip-principles?locale=en)（HTTP 200。ただし取得本文は主にサイト共通ナビゲーションで、第三者の企業ロゴ利用許諾条項を確認できなかった）
- [Semi Design introduction](https://semi.design/en-US/start/introduction)、[Arco Design introduction](https://arco.design/docs/spec/introduce)（HTTP 200だが、HTTP本文から第三者向け企業ロゴ許諾は確認できない）

**判定**: Semi、ArcoそれぞれについてByteDance企業ロゴのカタログ利用は**未確認・保留**。企業サイトにロゴが表示されている事実は転載許諾にならない。SemiとArcoは別DSであり、両者のロゴもByteDance企業マークも別。OSSコードやDS資産の公開から企業ロゴの許可を推定しない。

### Douyin／抖音ブランドマーク

**実確認URL（HTTP 200）**
- [抖音用户服务协议](https://www.douyin.com/draft/douyin_agreement/douyin_agreement_user.html?id=6773906068725565448)
- [公式agreements入口のID指定URL](https://www.douyin.com/agreements/?id=6773906068725565448)から上記へ転送し、本文確認できた。IDなし入口は実質タイトルのみだったが、本文確認後に評価を更新。

**確認条項**
- 更新2026-02-13、発効2026-02-20。
- §10.7: “未经我们事先书面同意，您不得将本条款前述标识以单独或结合任何方式展示、使用 ...” — 抖音、douyin.com等のブランド標識を、事前の書面同意なく単独でも組み合わせても展示・使用しない。
- §2.4も明示されていない権利を留保する。

**判定**: 抖音ブランドマークを提供元識別のため表示する場合は書面同意を取得する。**これはByteDance企業マークの許諾規定を確認したことにはならない**。ByteDance、Douyinグループ／サービスブランドのどれを「提供元」とするかも別途正確に決定する。

## 8. Adobe — Spectrum 2、React Aria

**実確認URL（HTTP 200）**
- [Adobe General trademark guidelines](https://www.adobe.com/legal/permissions/trademarks.html)

**確認条項**
- 冒頭: “You may use Adobe trademarks (but not logos or taglines) to identify Adobe products ...”
- Logos節: “Unless you are licensed ... under a specific licensing program agreement or equivalent authorization, use of Adobe logos ... is not allowed.” 企業ロゴ・製品ロゴの双方を例示。
- 一般ガイド§3はソフトウェア製品・サービス内等へのAdobeロゴ／製品アイコンの掲載にprior written licenseを要求。
- その他の許可申請は同ページの[online form](https://survey.adobe.com/jfe/form/SV_8uGlwyb2nrJuWJE)を案内（フォーム本文の追加条件までは未確認）。

**判定**: Spectrum 2とReact Aria双方に企業Adobeロゴを置くには許諾が必要。文字によるAdobe製品識別と、図案化されたAdobeマークを分ける。DSやライブラリのOSS公開は企業ロゴ許諾ではない。

## 9. IBM — Carbon

**実確認URL（HTTP 200）**
- [IBM Copyright and Trademark Information](https://www.ibm.com/legal/copyright-trademark)（[旧copytrade URL](https://www.ibm.com/legal/copytrade)から転送）

**確認条項**
- Use of IBM logos: “No other company may use IBM logos unless it has the express written permission of IBM, or is licensed by IBM to do so.”
- Fair use: “limited to text-only references ... and excludes IBM logos.”
- 申請はIBM担当者またはIBM Call Center（1-800-IBM4YOU）でCorporate Branding宛に連絡。
- 初出の製品商標の帰属表示と、誤認させない正確な関係説明を要求。

**判定**: Carbonの提供元表示でもIBM 8-bar等は許可待ち。Carbonロゴ、Carbonのコード／アイコンと、IBM企業ロゴを混同しない。

## 10. Microsoft — Fluent 2

**実確認URL（HTTP 200）**
- [Microsoft Trademark and Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks)

**確認条項**
- “Many uses, including our logos, app and product icons, and other designs, will require a license first.”
- Dos and Don’ts: “our logos, app and product icons ... can never be used without an express license.”
- 書面ライセンスまたは別の公開ガイドによる明示許可なしに、Microsoftのロゴ・アイコン・デザインを使用しない。
- 一般的wordmarkの事実説明とロゴは別。範囲外の利用はMicrosoftの適切な窓口の承認が必要、問い合わせtrademarks@microsoft.com。

**判定**: Fluent 2のOSSパッケージ利用や提供元の事実関係だけでMicrosoft企業ロゴは採用しない。固有の適用ガイド／書面承認を確認する。Fluent 2の図案をMicrosoft企業ロゴの代替として勝手に扱わない。

## 11. Uber — Base Web

**実試行URLと取得結果**
- [Uber brand試行URL](https://www.uber.com/us/en/about/brand/): web_fetchは404、別HTTP取得では406 Not Acceptable。規定本文未確認。
- [Uber newsroom media assets](https://www.uber.com/newsroom/media-assets/): HTTP取得は406。web_fetchではassets.uber.comへのクロスオリジン転送で停止。
- 転送先ホストの[assets.uber.com](https://assets.uber.com/): 直接web_fetchはHTTP 200だが「Brand.uber」のみで条件本文を取得できなかった。元ページの正確な転送先パスは未確認。
- [brand.uber.com](https://brand.uber.com/): HTTP取得で204 No Content。
- [商標ガイドと思われるlegal URL](https://www.uber.com/legal/en/document/?name=trademark-guidelines&country=united-states&lang=en): HTTP 406。存在・内容とも確認できず、正式な根拠URLとしては扱わない。

**判定**: **未確認（ブロック／空応答）**。Uberの企業ロゴをBase Webの提供元として表示できるとは判断しない。Base Webが公開実装を持つこととUberロゴの権利は別。ブラウザ等で公式現行ガイド本文・申請要件を確認するか、Uberの権利者に照会する必要がある。

## 12. Shopify — Polaris

**実確認URL（HTTP 200）**
- [Shopify Brand Assets](https://www.shopify.com/brand-assets)

**確認条項**
- Trademark Usage Guidelines: “Use of our brand assets must be expressly authorized in writing.”
- ウェブ上でブランド資産・Shopify名称を使う場合はShopifyホームページへの埋め込みリンクを要求。
- 通常ロゴはShopping Bag＋斜体wordmark。原則フルカラー、Sは白。クリアスペースはwordmarkのx-height、ロゴ最低幅80px／28mm。
- 旧ロゴ、wordmark単体、変形、回転、低コントラスト、独自版作成等を避ける。

**判定**: ダウンロード可能でも書面承認が先。小さな提供元アイコンではフルロゴの最低80px条件も問題になる。Shopping Bag単独使用のデザイン例があることは無許可で使用できる意味ではない。Polaris固有アイコンと区別。

## 13. GitHub — Primer

**実確認URL**
- [GitHub Brand Toolkit / Logo](https://brand.github.com/foundations/logo)（HTTP 200）
- [github.com/logos](https://github.com/logos)のHTTP取得は上記へ転送。現行URLを直接取得し本文確認済み。

**確認条項・両方を保持する理由**
- Do these things: “Use a permitted GitHub logo to link to GitHub.”。GitHubプロフィール／プロジェクトへのsocial button、GitHubに関するブログ・ニュースでの使用例、自社ブランドより控えめな表示を列挙。
- 一方Legal節: “No adaptation or use of any kind ... is allowed without the express written permission of GitHub, Inc.”
- Don’t do these thingsにも “Do not use GitHub trademarks, logos, or artwork without GitHub’s prior written permission.”
- 非提携・非推奨、独自サイト／事業のロゴにしない、図案改変・色変更・要素結合をしない。
- 現行企業マークはInvertocat／wordmarkのロックアップ。Octocat/Monaイラストを企業ロゴの代用にしない。

**判定**: **条件付き候補だが許可要件要確認**。GitHubの公式ページへリンクする控えめな企業マークはDoの例に近い。ただしDS一覧の静的な提供元表示やカタログ詳細へのリンクは、GitHubへリンクする許容例そのものではない。また同一ページの書面許可要件を無視して「自由利用可」としない。公開前にこのカタログ用途・遷移先を示して照会／承認取得する。Primer固有マーク、コード用octicon、サイトフッターのGitHubリンク用途の評価を相互流用しない。

## 14. Atlassian — Atlassian Design System

**実確認URL（いずれもHTTP 200）**
- [Atlassian Trademark Guidelines](https://www.atlassian.com/legal/trademark)
- [Atlassian Press Kit](https://www.atlassian.com/company/news/press-kit)

**確認条項**
- 公式サイト／press kit／design siteから取得し、改変せず関連ガイドに従う。
- Logos節: “You may use the Atlassian logo or product logos to promote Atlassian and its products or to identify that your own products are designed for and compatible with Atlassian’s products ...”。変更はリサイズのみ、独自ロゴとの結合等は不可。
- “All other usages of the Atlassian logos require the written approval of Atlassian.”
- 前段は “if you are an authorized partner or vendor” の一般的利用許可を説明し、追加のpartner／vendor契約・ブランド条件も参照する。カタログ運営者がこの対象とは確認できない。
- Press Kitは公式logo libraryを案内するが、素材公開だけで用途要件は免除されない。
- 問い合わせ: trademarks@atlassian.com。

**判定**: **条件付き候補・適用範囲要確認**。提供元を正確に識別するカタログが“promote Atlassian and its products”に含まれ、非partnerにも適用されるという根拠が必要。中立比較サイトは常にプロモーションでも互換製品でもない。書面確認までは保留。Atlassian企業ロゴとDS固有ブランド／製品ロゴを別扱いにする。

## 15. Salesforce — Lightning

**実確認URL（HTTP 200）**
- [Salesforce Intellectual Property / Trademark & Copyright Usage Guidelines](https://www.salesforce.com/company/legal/intellectual-property/?bc=HL)（対象節にLast Updated: June 12, 2023と表示）

**確認条項**
- “Most uses require specific written permission”。パートナー／顧客／開発者／出版者等を含む第三者の商標・著作物使用に適用。
- Referring to Salesforce in Text: 会社・製品・サービスの正確な識別のためplain textのword marksは許可、非混同・自社名称より控えめ・帰属表示等を要求。
- Product Integration & Compatibility Diagrams: 連携・互換製品がSalesforceとどう動作するかを説明する**diagram／flowchart内に限りappropriate product logo**を使用できる例外。企業ロゴの一般配布許可ではない。
- Written Agreement節は、合意で明示された資産だけを所定条件で使用できるとする。
- 商標帰属文: “[insert Salesforce trademark] is a trademark of Salesforce, Inc.”
- [旧intellectual URL](https://www.salesforce.com/company/legal/intellectual/)は総合legalページへ転送したため条項根拠にせず、現行URLを探索して確認した。[試行tmusageguidelines URL](https://www.salesforce.com/company/legal/intellectual/tmusageguidelines/)と[試行trademarks URL](https://www.salesforce.com/company/legal/intellectual-property/trademarks/)は404。[旧press-resources試行](https://www.salesforce.com/company/news-press/press-resources/)も転送後404で未確認。

**判定**: Lightning紹介カード上のSalesforce cloud企業ロゴは統合図例外ではない。個別許可前は採用しない。Lightning固有マークやDSのOSSコードは別の権利対象。

## 公開前の運用上の残作業（実装はしない）

1. 許可取得時は「独立した比較カタログ」「トップと一覧」「企業提供元を識別」「画像サイズ」「リンク先」「非提携表示」「商用／非商用・広告の有無」を具体的に提示する。
2. 承認は企業マークごとに対象画像・利用範囲・有効期限・地域・改変可否・余白・最小サイズ・帰属文を保存する。DS側の許諾と別台帳にする。
3. GitHub、Atlassianは候補だが、この用途への書面確認／公開規定上の明確な適用根拠が得られるまで保留。
4. Pinterest、Wise、ByteDance、Uberは用途適用または本文取得が未確定。ダウンロード、HTTP 200、OSS、他サイトでの使用例だけで許可に繰り上げない。
5. 明示許可がない間は企業名テキストと公式リンクを基本とし、正確な表記・非提携・必要な商標帰属条件を守る。法的に別判断をする場合は権利処理担当者に確認する。

## 確認範囲の完了チェック

- [x] AWS / Cloudscape
- [x] Pinterest / Gestalt
- [x] Meta / Astryx
- [x] GitLab / Pajamas
- [x] Twilio / Paste、Segment / Evergreen
- [x] Wise
- [x] ByteDance / Semi、Arco、Douyinブランドの区別
- [x] Adobe / Spectrum 2、React Aria
- [x] IBM / Carbon
- [x] Microsoft / Fluent 2
- [x] Uber / Base Web（取得制限の理由・試行URLを明記）
- [x] Shopify / Polaris
- [x] GitHub / Primer
- [x] Atlassian
- [x] Salesforce / Lightning

全対象について判定と根拠URL、または未確認理由を記録した。未確認を許可扱いした項目はない。
