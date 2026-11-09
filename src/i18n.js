export const messages = {
 ja: {
 title:'デザインシステムカタログ', all:'すべて', public:'政府・公共', oss:'企業・OSS', newest:'公開日が新しい順',
 language:'表示言語', auto:'自動 / Auto', help:'キーボード操作', skip:'カタログへ移動', list:'デザインシステム一覧',
 preview:'選択中のデザインシステム', back:'一覧に戻る', official:'公式サイト', newTab:'新しいタブで開く',
 enlarge:'拡大表示', views:'プレビュー画面', closeZoom:'拡大表示を閉じる', previous:'前のプレビュー', next:'次のプレビュー',
 conditions:'利用条件と画像の出典', license:'ライセンス', imageNote:'掲載画面は公式サイトのキャプチャです。コードのライセンスと画像・ロゴの利用条件は異なる場合があります。',
 imageSource:'キャプチャ元のページ', code:'ソースコード', unavailable:'プレビューを取得できませんでした',
 released:'公開日', reference:'参考', dateSource:'公開日の根拠', closeHelp:'ヘルプを閉じる', count:'件のデザインシステム',
 helpTitle:'キーボード操作', move:'デザインシステムを選択', firstLast:'最初・最後の項目を選択', changeView:'プレビューを切り替え',
 openZoom:'プレビューを拡大', openSite:'公式サイトを開く', showHelp:'このヘルプを表示', dismiss:'オーバーレイを閉じる / 一覧に戻る',
 tab:'操作対象を移動', activate:'フォーカス中の操作を実行', shortcutNote:'入力欄や言語選択の操作中はショートカットを無効にします。',
 imageAlt:'公式サイト画面', releaseNote:'公開日の根拠と補足', category:'カテゴリ', selected:'選択中',
 },
 en: {
 title:'Design System Catalog', all:'All', public:'Government', oss:'Companies & OSS', newest:'Newest first',
 language:'Display language', auto:'Auto / 自動', help:'Keyboard shortcuts', skip:'Skip to catalog', list:'Design systems',
 preview:'Selected design system', back:'Back to list', official:'Official site', newTab:'Opens in a new tab',
 enlarge:'Enlarge preview', views:'Preview screens', closeZoom:'Close enlarged preview', previous:'Previous preview', next:'Next preview',
 conditions:'Usage terms and image sources', license:'License', imageNote:'Screens are captures of official websites. Code licenses may differ from the terms for images and logos.',
 imageSource:'Original preview page', code:'Source code', unavailable:'Preview unavailable',
 released:'Released', reference:'Reference', dateSource:'Release date source', closeHelp:'Close shortcuts', count:'design systems',
 helpTitle:'Keyboard shortcuts', move:'Select a design system', firstLast:'Select the first or last system', changeView:'Switch preview screens',
 openZoom:'Enlarge the preview', openSite:'Open the official site', showHelp:'Show this help', dismiss:'Close overlay / return to list',
 tab:'Move keyboard focus', activate:'Activate the focused control', shortcutNote:'Shortcuts are disabled while typing or using the language selector.',
 imageAlt:'official website screenshot', releaseNote:'Release date evidence', category:'Category', selected:'Selected',
 },
};
export function detectLanguage() {
 const languages=navigator.languages?.length?navigator.languages:[navigator.language];
 const supported=languages.find(l=>/^(ja|en)(-|$)/i.test(l));
 return /^ja(-|$)/i.test(supported||'')?'ja':'en';
}
