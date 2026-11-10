import {ArrowSquareOut,Keyboard} from '@phosphor-icons/react';
import {specimenCategories,systemName,systemPath} from './catalog';
const copy={
 ja:{heading:'公開デザインシステムを実物で比較',intro:'各システムの公式コンポーネントを同じ内容で表示するカタログです。左の一覧から選んで比較を始めてください。',systems:'掲載システム',implementations:'実装プレビュー',categories:'比較カテゴリ',examples:'全体像の比較例',steps:['一覧からシステムを選択','カテゴリを切り替えて比較','公式サイトで使い方を確認'],sources:'公開実装がないシステムには公式資料のキャプチャを掲載しています。提供元と利用条件も各詳細で確認できます。',keyboard:'キーボード操作',select:'システムを選択',preview:'プレビューを切り替え',help:'操作ヘルプ'},
 en:{heading:'Compare real design systems',intro:'Official components rendered with the same sample content. Choose a system from the list to start comparing.',systems:'Catalog systems',implementations:'Live implementations',categories:'Specimen categories',examples:'Overview comparison',steps:['Choose a system from the list','Switch categories to compare','Visit the official usage guide'],sources:'Systems without a public implementation show reference captures. Provider information and usage terms are available in each detail view.',keyboard:'Keyboard navigation',select:'Select a system',preview:'Switch preview',help:'Shortcut help'}
};
export default function CatalogIntroduction({systems,language,ready,onSelect,onHelp}){
 const t=copy[language];const examples=systems.filter(s=>s.specimen.status==='ready').slice(0,2);
 return <div className="catalog-introduction">
  <p className="welcome-eyebrow">DESIGN SYSTEM CATALOG</p><h1>{t.heading}</h1><p className="welcome-intro">{t.intro}</p>
  <dl className="welcome-stats">{[[systems.length,t.systems],[systems.filter(s=>s.specimen.status==='ready').length,t.implementations],[Object.keys(specimenCategories).length,t.categories]].map(([value,label])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  <section><h2>{t.examples}</h2><div className="welcome-examples">{examples.map(s=><a key={s.id} href={systemPath(s)} onClick={event=>{if(!ready||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();onSelect(s)}}><img src={`/specimens/list-thumbnails/${s.id}-overview.webp`} alt={systemName(s,language)} width="480" height="224"/><span>{systemName(s,language)}<ArrowSquareOut size={16}/></span></a>)}</div></section>
  <ol className="welcome-steps">{t.steps.map((step,index)=><li key={step}><span aria-hidden="true">0{index+1}</span>{step}</li>)}</ol>
  <p className="welcome-sources">{t.sources}</p>
  <section className="welcome-keyboard"><h2><Keyboard size={19}/>{t.keyboard}</h2><dl><div><dt><kbd>J</kbd><kbd>K</kbd></dt><dd>{t.select}</dd></div><div><dt><kbd>H</kbd><kbd>L</kbd></dt><dd>{t.preview}</dd></div></dl><button type="button" disabled={!ready} onClick={onHelp}>{t.help}<kbd>?</kbd></button></section>
 </div>;
}
