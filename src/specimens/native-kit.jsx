import React from 'react';import TypographyExtras from './typography-extras';import kit,{lineBreaks} from './react-kit';
// Markup classes below come from each published framework, not a recreated theme.
export default function nativeKit(config) {
 const input=(props,onValueChange)=><input type="text" className={config.input} {...props} onChange={e=>onValueChange(e.target.value)}/>;
 return kit({sizes:false,
  Badge:config.badge?({tone,children})=><span className={config.badge[tone]}>{children}</span>:undefined,
  Card:config.card?({title,description})=>{const c=config.card;return <article className={c.root}>{c.header&&<header className={c.header}><h3 className={c.title}>{title}</h3></header>}<div className={c.body}>{!c.header&&<h3 className={c.title}>{title}</h3>}<p className={c.text}>{description}</p></div></article>}:undefined,
  Dialog:config.dialog?({t,open,onClose})=>{const c=config.dialog;if(!open)return null;const content=<div className={c.root} role="dialog" aria-labelledby="sample-dialog-title"><header className={c.header}><h2 id="sample-dialog-title" className={c.title}>{t.dialogTitle}</h2></header><div className={c.body}><p>{t.dialogBody}</p></div><footer className={c.footer}><button className={config.button.secondary} onClick={onClose}>{t.cancel}</button><button className={config.button.primary} onClick={onClose}>{t.publish}</button></footer></div>;return c.wrapper?<div className={c.wrapper}><div className="modal-dialog">{content}</div></div>:content}:undefined,listClass:config.typography?.list,listItemClass:config.typography?.listItem,
  Table:config.table?({t})=>{const c=config.table;const content=<table className={c.root} aria-label={t.tableTitle}><thead className={c.head}><tr className={c.row}>{t.tableHeaders.map((h,i)=><th key={i} scope="col" className={c.header}>{h}</th>)}</tr></thead><tbody className={c.body}>{t.tableRows.map((row,i)=><tr key={i} className={c.row}>{row.map((v,j)=><td key={j} className={c.cell}>{v}</td>)}</tr>)}</tbody></table>;return c.wrap?<div className={c.wrap}>{content}</div>:content}:undefined,
  Alert:config.alert?({tone,title,children})=>{const c=config.alert;return <div role="alert" className={c.root[tone]}><div className={c.body}><h3 className={c.title}>{title}</h3><p className={c.text}>{children}</p></div></div>}:undefined,
  Button:({children,variant,disabled,onClick})=><button type="button" disabled={disabled} className={config.button[variant]} onClick={onClick}>{children}</button>,
  Input:({onValueChange,...props})=>config.inputWrap?<div className={config.inputWrap}>{input(props,onValueChange)}</div>:input(props,onValueChange),
  Checkbox:({children,onValueChange,...props})=>{const id=props.disabled?'notify-disabled':'notify';return <div className={config.checkWrap}><input id={id} type="checkbox" className={config.checkbox} {...props} onChange={e=>onValueChange?.(e.target.checked)}/><label htmlFor={id} className={config.checkLabel}>{children}</label></div>},
  Select:({options,onValueChange,...props})=><select className={config.select} {...props} onChange={e=>onValueChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>,
  Typography:({t,overview=false,longForm=false})=><div className="specimen-heading-group">
    <h1 className={config.h1}>{t.heading}</h1><p className={config.body}>{t.body}</p>
    {longForm&&<><h2 className={config.h2}>{t.sample}</h2><div className="specimen-prose">{t.paragraphs.map((text,index)=><p key={index} className={config.body}>{lineBreaks(text)}</p>)}</div><TypographyExtras t={t} classes={{body:config.body,heading:config.h2,...config.typography}}/></>}
  </div>
 });
}
