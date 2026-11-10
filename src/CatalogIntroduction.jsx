import {ArrowLeft,ArrowSquareOut,Keyboard} from '@phosphor-icons/react';
import {systemName,systemPath} from './catalog';
const copy={
 ja:{heading:'デザインシステムを選んで下さい',sources:'公開実装がないシステムには公式資料のキャプチャを掲載しています。提供元と利用条件も各詳細で確認できます。',keyboard:'キーボード操作',select:'システムを選択',preview:'プレビューを切り替え',help:'操作ヘルプ'},
 en:{heading:'Please select a design system',sources:'Systems without a public implementation show reference captures. Provider information and usage terms are available in each detail view.',keyboard:'Keyboard navigation',select:'Select a system',preview:'Switch preview',help:'Shortcut help'}
};
export default function CatalogIntroduction({systems,language,ready,onSelect,onHelp}){
 const t=copy[language];const used=new Set();
 const groups=[['overview',['astryx','fluent']],['table',['carbon','ant']],['alerts',['primer','cloudscape']]].map(([view,preferred])=>{
  const available=systems.filter(s=>s.specimen.status==='ready'&&s.specimen.views.includes(view));
  const ordered=[...preferred.map(id=>available.find(s=>s.id===id)).filter(Boolean),...available];
  const examples=[];for(const system of ordered){if(used.has(system.id))continue;examples.push(system);used.add(system.id);if(examples.length===2)break;}
  return {view,examples};
 });
 return <div className="catalog-introduction">
  <div className="welcome-header"><h1><ArrowLeft size={16} weight="light" aria-hidden="true"/>{t.heading}</h1></div>
  {groups.filter(group=>group.examples.length).map(({view,examples})=><section className="welcome-comparison" key={view} data-view={view}><div className="welcome-examples">{examples.map(s=><a key={s.id} href={systemPath(s)} onClick={event=>{if(!ready||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();onSelect(s,{viewKey:view})}}><img src={`/specimens/list-thumbnails/${s.id}-${view}.webp`} alt={systemName(s,language)} width="480" height="224"/><span>{systemName(s,language)}<ArrowSquareOut size={16}/></span></a>)}</div></section>)}
  <p className="welcome-sources">{t.sources}</p>
  <section className="welcome-keyboard"><h2><Keyboard size={19}/>{t.keyboard}</h2><dl><div><dt><kbd>J</kbd><kbd>K</kbd></dt><dd>{t.select}</dd></div><div><dt><kbd>H</kbd><kbd>L</kbd></dt><dd>{t.preview}</dd></div></dl><button type="button" disabled={!ready} onClick={onHelp}>{t.help}<kbd>?</kbd></button></section>
 </div>;
}
