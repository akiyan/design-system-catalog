import {comparisonWords} from './comparison-words';
import React, {useState, useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {typographyWords} from './typography-extras';
const defaultWords = language => language === 'en' ? {
 save:'Save changes',cancel:'Cancel',more:'Details',disabled:'Disabled',basic:'Buttons',sizes:'Sizes',states:'Disabled state',form:'Form fields',name:'Project name',placeholder:'Design system catalog',notify:'Notify the team',visibility:'Visibility',team:'Team only',public:'Public',heading:'Project settings',body:'Manage the project and share updates with your team.',status:'Changes saved',small:'Small',medium:'Medium',large:'Large',specimen:'Component specimen',check:'Selected',library:'Official implementation',type:'Typography',sample:'A clear interface starts with shared components.',tableTitle:'Projects',tableHeaders:['Project','Owner','Status'],tableRows:[['Catalog','Aki','Published'],['Components','Mika','In review'],['Guidelines','Jun','Draft']],alerts:'Alerts',alertMessages:[{tone:'info',title:'An update is available',body:'Review the latest project settings.'},{tone:'success',title:'Changes saved',body:'Your team can now view the updated settings.'},{tone:'warning',title:'Review your settings',body:'Check the visibility before publishing.'}]
} : {
 save:'変更を保存',cancel:'キャンセル',more:'詳細を見る',disabled:'無効',basic:'基本のボタン',sizes:'サイズ',states:'無効な状態',form:'入力フォーム',name:'プロジェクト名',placeholder:'デザインシステムカタログ',notify:'チームに通知する',visibility:'公開範囲',team:'チーム内',public:'一般公開',heading:'プロジェクト設定',body:'プロジェクトを管理してチームに更新を共有します。',status:'変更を保存しました',small:'小',medium:'中',large:'大',specimen:'コンポーネント見本',check:'選択済み',library:'公式の公開実装',type:'タイポグラフィ',sample:'共通のコンポーネントから使いやすい画面を組み立てます。',tableTitle:'プロジェクト一覧',tableHeaders:['プロジェクト','担当者','状態'],tableRows:[['カタログ','Aki','公開'],['コンポーネント','Mika','確認中'],['ガイドライン','Jun','下書き']],alerts:'アラート',alertMessages:[{tone:'info',title:'更新のお知らせ',body:'最新のプロジェクト設定を確認してください。'},{tone:'success',title:'保存しました',body:'更新した設定をチームが確認できます。'},{tone:'warning',title:'設定を確認してください',body:'公開する前に公開範囲を確認してください。'}]
};
export const words = (language,copy) => ({...defaultWords(language),...copy,rich:typographyWords(language),...comparisonWords(language),overviewItems:language==='en'?['Project details','Team notifications','Visibility and access']:['プロジェクトの基本情報','チームへの通知設定','公開範囲とアクセス権'],paragraphs:language==='en'?[
 'A design system connects a product’s visual language with the way people use it. Shared typography helps readers find the information they need and follow the next step with confidence.',
 'This paragraph is long enough to wrap across several lines. Compare the reading rhythm, spacing and balance as the available width changes.\nThis sentence starts on a new line within the same paragraph, so you can distinguish an explicit line break from automatic wrapping.',
 'A new paragraph marks a change of topic. Headings, body text and the space between paragraphs work together to give longer content a clear structure. Check how comfortably the text reads on both desktop and mobile screens.'
 ]:[
 'デザインシステムはプロダクトの見た目と操作を支える共通の基盤です。文字の大きさや行間を揃えることで情報の優先順位が伝わりやすくなります。読み手が必要な内容を見つけて次の操作に進めるように文章のまとまりを整えます。',
 'この段落では複数行にわたる文章を使って折り返し方を確認します。画面の幅が変わったときに一行の長さや読み進めるリズムがどのように変化するかを比べてください。\nここは同じ段落の中で明示的に改行した行です。自動の折り返しとの違いを確認できます。',
 '話題が変わるところでは新しい段落を始めます。見出しと本文の関係だけでなく段落同士の間隔も文章の構造を伝える要素です。長い説明を読む場面を想定してパソコンとスマートフォンの両方で読みやすさを確かめます。'
 ]});
export const lineBreaks = text => text.split('\n').map((line,index)=><React.Fragment key={index}>{index>0&&<br/>}{line}</React.Fragment>);
function DialogSpecimen({kit,t}) {
 const [open,setOpen]=useState(true);const stage=useRef(null);
 useEffect(()=>{
  if(!open)return;
  let frame;
  const size=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const dialog=document.querySelector(kit.dialogMeasure||'[role="dialog"], [role="alertdialog"], dialog[open]');
   if(!dialog||!stage.current)return;
   const height=Math.ceil(Math.max(dialog.scrollHeight,dialog.getBoundingClientRect().height))+96;
   if(Math.abs(stage.current.offsetHeight-height)>3)stage.current.style.minHeight=`${height}px`;
  })};
  const observer=new MutationObserver(size);observer.observe(document.body,{childList:true,subtree:true});size();
  const timer=setTimeout(size,350);window.addEventListener('resize',size);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);clearTimeout(timer);window.removeEventListener('resize',size)};
 },[open]);
 return <div ref={stage} className="specimen-dialog-stage"><kit.Button variant="primary" onClick={()=>setOpen(true)}>{t.openDialog}</kit.Button><kit.Dialog t={t} open={open} onClose={()=>setOpen(false)}/></div>;
}
function ChatSpecimen({kit,t}) {
 const [messages,setMessages]=useState(t.messages);const [draft,setDraft]=useState('');
 const send=()=>{if(draft.trim()){setMessages([...messages,{author:'Aki',self:true,text:draft.trim()}]);setDraft('')}};
 return <div className="specimen-chat"><div className="specimen-messages" role="log" aria-label={t.chat}>{messages.map((message,index)=><kit.Message key={index} {...message}/>)}</div><form className="specimen-chat-composer" onSubmit={event=>{event.preventDefault();send()}}><kit.Input aria-label={t.message} value={draft} onValueChange={setDraft}/><kit.Button variant="primary" aria-label={t.send} disabled={!draft.trim()} onClick={send}>{t.send}</kit.Button></form></div>;
}
function Example({kit,view,language,name,copy}) {
 const t=words(language,copy);const [value,setValue]=useState(t.placeholder);const [checked,setChecked]=useState(true);const [selection,setSelection]=useState('team');const [status,setStatus]=useState('');
 const B=kit.Button, I=kit.Input, C=kit.Checkbox, S=kit.Select;
 const button=(label,variant='primary',extra={})=><B variant={variant} onClick={()=>setStatus(t.status)} {...extra}>{label}</B>;
 const section=(title,content)=><section className="specimen-section">{view!=='overview'&&<h2>{title}</h2>}{content}</section>;
 let content;
 if(view==='overview') content=<>{section(t.type,<>{kit.Typography?<kit.Typography t={t} overview/>:<div className="specimen-heading-group"><h1>{t.heading}</h1><p>{t.body}</p></div>}<ul className={`specimen-overview-list ${kit.listClass||''}`}>{t.overviewItems.map(item=><li className={kit.listItemClass} key={item}>{item}</li>)}</ul>{kit.Badge&&<div className="specimen-badges">{t.badges.map((label,index)=><kit.Badge key={label} tone={['success','warning','neutral'][index]}>{label}</kit.Badge>)}</div>}</>)}{section(t.basic,<div className="specimen-row">{button(t.save)}{button(t.cancel,'secondary')}</div>)}{I&&section(t.form,<div className="specimen-field"><label htmlFor="project-name">{t.name}</label><I id="project-name" aria-label={t.name} value={value} onValueChange={setValue}/></div>)}{C&&section(t.notify,<div className="specimen-row"><C checked={checked} onValueChange={setChecked}>{t.notify}</C></div>)}{(kit.Banner||kit.Alert)&&<section className="specimen-section specimen-overview-banner">{React.createElement(kit.Banner||kit.Alert,{tone:'warning',title:t.alertMessages[2].title},t.alertMessages[2].body)}</section>}{kit.Card&&<section className="specimen-section specimen-overview-cards"><kit.Card title={t.cardTitles[0]} description={t.cardBodies[0]} t={t} index={0}/></section>}</>;
 if(view==='form') content=<>{section(t.form,<div className="specimen-fields"><div className="specimen-field"><label htmlFor="project-name">{t.name}</label>{I&&<I id="project-name" aria-label={t.name} value={value} onValueChange={setValue} placeholder={t.placeholder}/>}</div>{S&&<div className="specimen-field"><label htmlFor="visibility">{t.visibility}</label><S id="visibility" aria-label={t.visibility} value={selection} onValueChange={setSelection} options={[{label:t.team,value:'team'},{label:t.public,value:'public'}]}/></div>}</div>)}{C&&section(t.notify,<div className="specimen-row"><C checked={checked} onValueChange={setChecked}>{t.notify}</C><C checked disabled>{t.check}</C></div>)}{section(t.states,<div className="specimen-field">{I&&<I aria-label={t.disabled} value={t.placeholder} disabled onValueChange={()=>{}}/>}</div>)}{section(t.basic,<div className="specimen-row">{button(t.save)}{button(t.cancel,'secondary')}{button(t.more,'text')}</div>)}{kit.sizes!==false&&section(t.sizes,<div className="specimen-row">{button(t.save,'primary',{size:'small'})}{button(t.save,'primary',{size:'medium'})}{button(t.save,'primary',{size:'large'})}</div>)}{section(t.states,<div className="specimen-row">{button(t.disabled,'primary',{disabled:true})}{button(t.disabled,'secondary',{disabled:true})}{button(t.disabled,'text',{disabled:true})}</div>)}</>;
 if(view==='typography'&&kit.Typography)content=<kit.Typography t={t} longForm/>;
 if(view==='table'&&kit.Table)content=section(t.tableTitle,<kit.Table t={t}/>);
 if(view==='alerts'&&(kit.Alert||kit.Banner))content=section(t.alerts,<div className="specimen-alerts">{t.alertMessages.filter(message=>!kit.alertTones||kit.alertTones.includes(message.tone)).map(message=>React.createElement(kit.Alert||kit.Banner,{key:message.tone,...message},message.body))}</div>);
 if(view==='card'&&kit.Card)content=<div className="specimen-card-grid">{t.cardTitles.map((title,index)=><kit.Card key={title} title={title} description={t.cardBodies[index]} index={index} t={t}/>)}</div>;
 if(view==='dialog'&&kit.Dialog)content=<DialogSpecimen kit={kit} t={t}/>;
 if(view==='code'&&kit.Code)content=<kit.Code t={t}/>;
 if(view==='chat'&&kit.Message&&I)content=<ChatSpecimen kit={kit} t={t}/>;
 const page=<div className="specimen">{content}<div className="specimen-status" role="status">{status}</div></div>;
 return kit.Provider?<kit.Provider>{page}</kit.Provider>:page;
}
export default function reactKit(kit) {
 return (container,options)=>{container.dataset.dialogSurface=kit.dialogCapture||kit.dialogMeasure||'';const root=createRoot(container,{onUncaughtError(error){container.dataset.error="true";container.textContent=error.message;console.error(error)}});root.render(<Example kit={kit} {...options}/>);return()=>root.unmount()};
}
