import {ArrowSquareOut,Keyboard} from '@phosphor-icons/react';
import {systemName,systemPath} from './catalog';
const copy={
 ja:{heading:'公開デザインシステムを実物で比較',intro:'各システムの公式コンポーネントを同じ内容で表示するカタログです。',systems:'掲載システム',examples:'全体像の比較例',sources:'公開実装がないシステムには公式資料のキャプチャを掲載しています。提供元と利用条件も各詳細で確認できます。',keyboard:'キーボード操作',select:'システムを選択',preview:'プレビューを切り替え',help:'操作ヘルプ'},
 en:{heading:'Compare real design systems',intro:'Official components rendered with the same sample content.',systems:'Catalog systems',examples:'Overview comparison',sources:'Systems without a public implementation show reference captures. Provider information and usage terms are available in each detail view.',keyboard:'Keyboard navigation',select:'Select a system',preview:'Switch preview',help:'Shortcut help'}
};
export default function CatalogIntroduction({systems,language,ready,onSelect,onHelp}){
 const t=copy[language];const examples=systems.filter(s=>s.specimen.status==='ready').slice(0,2);
 return <div className="catalog-introduction">
  <div className="welcome-header"><div className="welcome-copy"><h1>{t.heading}</h1><p className="welcome-intro">{t.intro}</p></div><dl className="welcome-stats"><div><dt>{t.systems}</dt><dd>{systems.length}</dd></div></dl></div>
  <section><h2>{t.examples}</h2><div className="welcome-examples">{examples.map(s=><a key={s.id} href={systemPath(s)} onClick={event=>{if(!ready||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();onSelect(s)}}><img src={`/specimens/list-thumbnails/${s.id}-overview.webp`} alt={systemName(s,language)} width="480" height="224"/><span>{systemName(s,language)}<ArrowSquareOut size={16}/></span></a>)}</div></section>
  <p className="welcome-sources">{t.sources}</p>
  <section className="welcome-keyboard"><h2><Keyboard size={19}/>{t.keyboard}</h2><dl><div><dt><kbd>J</kbd><kbd>K</kbd></dt><dd>{t.select}</dd></div><div><dt><kbd>H</kbd><kbd>L</kbd></dt><dd>{t.preview}</dd></div></dl><button type="button" disabled={!ready} onClick={onHelp}>{t.help}<kbd>?</kbd></button></section>
 </div>;
}
