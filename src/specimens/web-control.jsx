import React,{useEffect,useRef}from'react';
export default function WebControl({tag,eventName='input',onValueChange,children,booleanValue=false,...props}){
 const ref=useRef(null);
 useEffect(()=>{const el=ref.current;const listener=e=>{const d=e.detail;onValueChange?.(booleanValue?(d?.checked??el.checked):(d?.value??el.modelValue??el.value??e.target.value))};const names=[eventName,'change'];names.forEach(n=>el.addEventListener(n,listener));return()=>names.forEach(n=>el.removeEventListener(n,listener))},[onValueChange,eventName,booleanValue]);
 return React.createElement(tag,{...props,ref},children);
}
