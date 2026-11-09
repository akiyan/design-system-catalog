import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
export const words = language => language === 'en' ? {
 save:'Save changes',cancel:'Cancel',more:'Details',disabled:'Disabled',basic:'Buttons',sizes:'Sizes',states:'Disabled state',form:'Form fields',name:'Project name',placeholder:'Design system catalog',notify:'Notify the team',visibility:'Visibility',team:'Team only',public:'Public',heading:'Project settings',body:'Manage the project and share updates with your team.',status:'Changes saved',small:'Small',medium:'Medium',large:'Large',specimen:'Component specimen',check:'Selected',library:'Official implementation',type:'Typography',sample:'A clear interface starts with shared components.'
} : {
 save:'変更を保存',cancel:'キャンセル',more:'詳細を見る',disabled:'無効',basic:'基本のボタン',sizes:'サイズ',states:'無効な状態',form:'入力フォーム',name:'プロジェクト名',placeholder:'デザインシステムカタログ',notify:'チームに通知する',visibility:'公開範囲',team:'チーム内',public:'一般公開',heading:'プロジェクト設定',body:'プロジェクトを管理してチームに更新を共有します。',status:'変更を保存しました',small:'小',medium:'中',large:'大',specimen:'コンポーネント見本',check:'選択済み',library:'公式の公開実装',type:'タイポグラフィ',sample:'共通のコンポーネントから使いやすい画面を組み立てます。'
};
function Example({kit,view,language,name}) {
 const t=words(language);const [value,setValue]=useState(t.placeholder);const [checked,setChecked]=useState(true);const [selection,setSelection]=useState('team');const [status,setStatus]=useState('');
 const B=kit.Button, I=kit.Input, C=kit.Checkbox, S=kit.Select;
 const button=(label,variant='primary',extra={})=><B variant={variant} onClick={()=>setStatus(t.status)} {...extra}>{label}</B>;
 const section=(title,content)=><section className="specimen-section"><h2>{title}</h2>{content}</section>;
 let content;
 if(view==='overview') content=<>{section(t.basic,<div className="specimen-row">{button(t.save)}{button(t.cancel,'secondary')}{button(t.disabled,'primary',{disabled:true})}</div>)}{I&&section(t.form,<div className="specimen-fields"><div className="specimen-field"><label htmlFor="project-name">{t.name}</label><I id="project-name" aria-label={t.name} value={value} onValueChange={setValue}/></div><div className="specimen-field"><label>{t.states}</label><I aria-label={t.disabled} value={t.placeholder} disabled onValueChange={()=>{}}/></div></div>)}{C&&section(t.notify,<div className="specimen-row"><C checked={checked} onValueChange={setChecked}>{t.notify}</C><C checked disabled>{t.check}</C></div>)}</>;
 if(view==='buttons') content=<>{section(t.basic,<div className="specimen-row">{button(t.save)}{button(t.cancel,'secondary')}{button(t.more,'text')}</div>)}{kit.sizes!==false&&section(t.sizes,<div className="specimen-row">{button(t.save,'primary',{size:'small'})}{button(t.save,'primary',{size:'medium'})}{button(t.save,'primary',{size:'large'})}</div>)}{section(t.states,<div className="specimen-row">{button(t.disabled,'primary',{disabled:true})}{button(t.disabled,'secondary',{disabled:true})}</div>)}</>;
 if(view==='form') content=<>{section(t.form,<div className="specimen-fields"><div className="specimen-field"><label htmlFor="project-name">{t.name}</label>{I&&<I id="project-name" aria-label={t.name} value={value} onValueChange={setValue} placeholder={t.placeholder}/>}</div>{S&&<div className="specimen-field"><label htmlFor="visibility">{t.visibility}</label><S id="visibility" aria-label={t.visibility} value={selection} onValueChange={setSelection} options={[{label:t.team,value:'team'},{label:t.public,value:'public'}]}/></div>}</div>)}{C&&section(t.notify,<div className="specimen-row"><C checked={checked} onValueChange={setChecked}>{t.notify}</C><C checked disabled>{t.check}</C></div>)}{section(t.states,<div className="specimen-field">{I&&<I aria-label={t.disabled} value={t.placeholder} disabled onValueChange={()=>{}}/>}</div>)}<div className="specimen-row">{button(t.save)}{button(t.cancel,'secondary')}</div></>;
 if(view==='typography'&&kit.Typography)content=<kit.Typography t={t}/>;
 if(view==='table'&&kit.Table)content=<kit.Table t={t}/>;
 const page=<div className="specimen"><header className="specimen-header"><span>{name}</span><span>{t.specimen}</span></header>{content}<div className="specimen-status" role="status">{status}</div></div>;
 return kit.Provider?<kit.Provider>{page}</kit.Provider>:page;
}
export default function reactKit(kit) {
 return (container,options)=>{const root=createRoot(container,{onUncaughtError(error){container.dataset.error="true";container.textContent=error.message;console.error(error)}});root.render(<Example kit={kit} {...options}/>);return()=>root.unmount()};
}
