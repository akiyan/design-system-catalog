import {useEffect,useRef,useState} from 'react';
export const specimenUrl=(system,index=0,language='ja')=>`${system.views[index]?.url || system.views[0].url}?lang=${language}`;
export default function SpecimenFrame({system,index,language,onSwipe,onKey,expanded=false,compact=false,lazy=false,theme='default'}) {
 const initialTheme=useRef(theme);
 const ref=useRef(null);const [height,setHeight]=useState(360);
 const [visible,setVisible]=useState(!lazy);
 useEffect(()=>{
  if(!lazy||visible)return;
  // Native iframe loading=lazy starts several screens ahead and competes with the overview.
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect()}
  },{rootMargin:"120px 0px"});
  if(ref.current)observer.observe(ref.current);
  return()=>observer.disconnect();
 },[lazy,visible]);
 const url=specimenUrl(system,index,language)+'&embedded=1'+(compact?'&compact=1':'')+(initialTheme.current!=='default'?`&theme=${initialTheme.current}`:'');
 useEffect(()=>{setHeight(360)},[url]);
 useEffect(()=>{
  const frame=ref.current;
  const update=()=>frame?.contentWindow?.postMessage({type:'catalog-specimen-theme',theme},location.origin);
  update();frame?.addEventListener('load',update);
  return()=>frame?.removeEventListener('load',update);
 },[theme,url]);

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
  const frame=ref.current;
  const requestSize=()=>frame?.contentWindow?.postMessage({type:'catalog-specimen-measure'},location.origin);
  window.addEventListener('message',receive);frame?.addEventListener('load',requestSize);requestSize();
  return()=>{window.removeEventListener('message',receive);frame?.removeEventListener('load',requestSize)};
 },[onSwipe,onKey,expanded]);
 return <iframe ref={ref} key={url} className={`specimen-frame ${expanded?'expanded':''}`} src={visible?url:undefined} loading="eager" data-deferred={!visible||undefined} title={`${system.shortName} — ${language==='en'?system.views[index].labelEn:system.views[index].label}`} style={{height}} sandbox="allow-scripts allow-same-origin allow-forms"/>;
}
