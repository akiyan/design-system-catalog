import {useEffect,useRef,useState} from 'react';
export const specimenUrl=(system,index=0,language='ja')=>`${system.views[index]?.url || system.views[0].url}?lang=${language}`;
export default function SpecimenFrame({system,index,language,onSwipe,onKey,expanded=false,compact=false}) {
 const ref=useRef(null);const [height,setHeight]=useState(360);
 const url=specimenUrl(system,index,language)+'&embedded=1'+(compact?'&compact=1':'');
 useEffect(()=>{setHeight(360)},[url]);
 useEffect(()=>{
  const receive=event=>{
   if(event.origin!==location.origin||event.source!==ref.current?.contentWindow)return;
   if(event.data?.type==='catalog-specimen-size')setHeight(Math.max(1,Math.ceil(Number(event.data.height)||360)));
   if(event.data?.type==='catalog-specimen-scroll'){
    const container=ref.current?.closest(expanded?'.zoom-content':matchMedia('(max-width:700px)').matches?'.workspace':'.preview-panel');
    container?.scrollBy({top:Number(event.data.deltaY)||0,behavior:'instant'});
   }
   if(event.data?.type==='catalog-specimen-swipe')onSwipe?.(event.data.direction);
   if(event.data?.type==='catalog-specimen-key')onKey?.(event.data.key);
  };
  window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);
 },[onSwipe,onKey,expanded]);
 return <iframe ref={ref} key={url} className={`specimen-frame ${expanded?'expanded':''}`} src={url} title={`${system.shortName} — ${language==='en'?system.views[index].labelEn:system.views[index].label}`} style={{height}} sandbox="allow-scripts allow-same-origin allow-forms"/>;
}
