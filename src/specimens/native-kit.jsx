import React from 'react';import kit from './react-kit';
// Markup classes below come from each published framework, not a recreated theme.
export default function nativeKit(config) {
 const input=(props,onValueChange)=><input type="text" className={config.input} {...props} onChange={e=>onValueChange(e.target.value)}/>;
 return kit({sizes:false,
  Button:({children,variant,disabled,onClick})=><button type="button" disabled={disabled} className={config.button[variant]} onClick={onClick}>{children}</button>,
  Input:({onValueChange,...props})=>config.inputWrap?<div className={config.inputWrap}>{input(props,onValueChange)}</div>:input(props,onValueChange),
  Checkbox:({children,onValueChange,...props})=>{const id=props.disabled?'notify-disabled':'notify';return <div className={config.checkWrap}><input id={id} type="checkbox" className={config.checkbox} {...props} onChange={e=>onValueChange?.(e.target.checked)}/><label htmlFor={id} className={config.checkLabel}>{children}</label></div>},
  Select:({options,onValueChange,...props})=><select className={config.select} {...props} onChange={e=>onValueChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>,
  Typography:({t})=><div className="specimen-heading-group"><h1 className={config.h1}>{t.heading}</h1><h2 className={config.h2}>{t.sample}</h2><p className={config.body}>{t.body}</p></div>
 });
}
