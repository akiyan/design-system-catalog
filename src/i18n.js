export const messages = {
 ja: {
 title:'デザインシステムカタログ', all:'すべて', public:'政府・公共', oss:'企業・OSS', newest:'公開日が新しい順', featured:'注目の5件', featuredBasis:'GitHubスター数を参考に選定',
 comparisonCategory:'一覧のプレビューカテゴリ',overviewFallback:'全体像を表示',siteCapture:'公式サイトのキャプチャ',captureSource:'キャプチャの出典',captureNote:'公式サイトや公開紹介記事の画面を参考資料として掲載しています。コード実装の見本ではありません。原著作物の利用条件は出典で確認してください。',liveComponents:'実装プレビュー',unstyled:'スタイルなし',designResources:'デザイン資料',designResourcesNote:'公開されたコード実装を確認できないため共通コンポーネントの見本は表示していません。公式のデザイン資料を参照できます。',integrationLimited:'実装見本は未対応',integrationLimitedNote:'実行環境に依存するため単体の実装見本を用意できていません。公式資料を参照できます。',openResources:'公式資料を見る',
 language:'表示言語', help:'キーボード操作', skip:'カタログへ移動', list:'デザインシステム一覧',
 browseSystems:'デザインシステムを切り替え', previousSystem:'前のデザインシステム', nextSystem:'次のデザインシステム', previousShort:'前へ', nextShort:'次へ',
 preview:'選択中のデザインシステム', back:'一覧に戻る', official:'公式サイト', newTab:'新しいタブで開く',
 enlarge:'拡大表示', views:'プレビュー画面', closeZoom:'拡大表示を閉じる', previous:'前のプレビュー', next:'次のプレビュー',
 conditions:'利用条件と実装の出典', license:'ライセンス', imageNote:'公式の公開実装を共通の内容で描画しています。各ライブラリの利用条件は出典で確認してください。',
 imageSource:'実装の出典', code:'ソースコード', unavailable:'プレビューを取得できませんでした',
 released:'公開日', reference:'参考', dateSource:'公開日の根拠', closeHelp:'ヘルプを閉じる', count:'件のデザインシステム',
 helpTitle:'キーボード操作', move:'デザインシステムを選択', firstLast:'最初・最後の項目を選択', changeView:'プレビューを切り替え',
 openZoom:'プレビューを拡大', openSite:'公式サイトを開く', showHelp:'このヘルプを表示', dismiss:'オーバーレイを閉じる / 一覧に戻る',
 tab:'操作対象を移動', activate:'フォーカス中の操作を実行', shortcutNote:'入力欄や言語選択の操作中はショートカットを無効にします。',
 imageAlt:'公式コンポーネントの実装見本', releaseNote:'公開日の根拠と補足', category:'カテゴリ', selected:'選択中',
 },
 en: {
 title:'Design System Catalog', all:'All', public:'Government', oss:'Companies & OSS', newest:'Newest first', featured:'Featured systems', featuredBasis:'Selected with reference to GitHub stars',
 comparisonCategory:'List preview category',overviewFallback:'Overview shown',siteCapture:'Official site capture',captureSource:'Capture source',captureNote:'Screenshots of official sites and public introduction articles are shown as reference material. These are not integrated component specimens. Refer to the source for usage terms.',liveComponents:'Live components',unstyled:'Unstyled primitives',designResources:'Design resources',designResourcesNote:'No verified public code implementation is available for this specimen. The official design resources remain accessible.',integrationLimited:'Specimen unavailable',integrationLimitedNote:'This implementation depends on its host environment and is not available as a standalone specimen. Refer to the official resources.',openResources:'Open design resources',
 language:'Display language', help:'Keyboard shortcuts', skip:'Skip to catalog', list:'Design systems',
 browseSystems:'Browse design systems', previousSystem:'Previous design system', nextSystem:'Next design system', previousShort:'Previous', nextShort:'Next',
 preview:'Selected design system', back:'Back to list', official:'Official site', newTab:'Opens in a new tab',
 enlarge:'Enlarge preview', views:'Preview screens', closeZoom:'Close enlarged preview', previous:'Previous preview', next:'Next preview',
 conditions:'Usage terms and implementation sources', license:'License', imageNote:'Official implementations are rendered with shared content. Refer to each library’s source for usage terms.',
 imageSource:'Implementation source', code:'Source code', unavailable:'Preview unavailable',
 released:'Released', reference:'Reference', dateSource:'Release date source', closeHelp:'Close shortcuts', count:'design systems',
 helpTitle:'Keyboard shortcuts', move:'Select a design system', firstLast:'Select the first or last system', changeView:'Switch preview screens',
 openZoom:'Enlarge the preview', openSite:'Open the official site', showHelp:'Show this help', dismiss:'Close overlay / return to list',
 tab:'Move keyboard focus', activate:'Activate the focused control', shortcutNote:'Shortcuts are disabled while typing or using the language selector.',
 imageAlt:'real component specimen', releaseNote:'Release date evidence', category:'Category', selected:'Selected',
 },
};
export function detectLanguage() {
 const languages=navigator.languages?.length?navigator.languages:[navigator.language];
 const supported=languages.find(l=>/^(ja|en)(-|$)/i.test(l));
 return /^ja(-|$)/i.test(supported||'')?'ja':'en';
}
