import {useEffect,useRef,useState} from 'react';
export const specimenUrl=(system,index=0,language='ja')=>`${system.views[index]?.url || system.views[0].url}?lang=${language}`;
export default function SpecimenFrame({system,index,language,onSwipe,onKey,expanded=false}) {
 const ref=useRef(null);const [height,setHeight]=useState(520);
 const url=specimenUrl(system,index,language);
 useEffect(()=>{setHeight(520)},[url]);
 useEffect(()=>{
  const receive=event=>{
   if(event.origin!==location.origin||event.source!==ref.current?.contentWindow)return;
   if(event.data?.type==='catalog-specimen-size')setHeight(Math.min(1800,Math.max(420,Number(event.data.height)||520)));
   if(event.data?.type==='catalog-specimen-swipe')onSwipe?.(event.data.direction);
   if(event.data?.type==='catalog-specimen-key')onKey?.(event.data.key);
  };
  window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);
 },[onSwipe,onKey]);
 return <iframe ref={ref} key={url} className={`specimen-frame ${expanded?'expanded':''}`} src={url} title={`${system.shortName} — ${language==='en'?system.views[index].labelEn:system.views[index].label}`} style={{height}} sandbox="allow-scripts allow-same-origin allow-forms"/>;
}
