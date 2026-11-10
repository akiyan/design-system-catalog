import layoutStyles from './layout.css?inline';
const modules=import.meta.glob('./adapters/*.{jsx,js}');
const root=document.getElementById('specimen-root');
const params=new URLSearchParams(location.search);
const embedded=parent!==window&&params.has('embedded');
const language=params.get('lang')==='en'?'en':'ja';
if(embedded)document.documentElement.classList.add('specimen-embedded');
if(params.has('compact'))document.documentElement.classList.add('specimen-compact');
document.documentElement.lang=language;
if(new URLSearchParams(location.search).has('thumbnail'))document.documentElement.classList.add('specimen-thumbnail');
function notify(){parent.postMessage({type:'catalog-specimen-size',height:Math.ceil(Math.max(root.scrollHeight,root.getBoundingClientRect().height))+2},location.origin)}
try {
 const module=await modules[`./adapters/${root.dataset.adapter}.jsx`]?.() || await modules[`./adapters/${root.dataset.adapter}.js`]?.();
 if(!module)throw new Error('Implementation adapter unavailable');
 const shellStyles=document.createElement('style');shellStyles.textContent=layoutStyles;document.head.append(shellStyles);
 await module.default(root,{view:root.dataset.view,language,name:root.dataset.name,copy:JSON.parse(root.dataset.thumbnailCopy)[language]});
 await document.fonts.ready;
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 root.dataset.ready='true';notify();new ResizeObserver(notify).observe(document.body);
} catch(error){root.dataset.error='true';root.textContent=error.message;root.className='specimen-error';console.error(error);notify()}
const eventTouchesControl=(event,selector)=>event.composedPath().some(node=>node instanceof Element&&node.matches(selector));
let touch;
document.addEventListener('touchstart',event=>{touch=event.touches.length===1&&!eventTouchesControl(event,'button,input,select,textarea,table,[role="table"],[role="grid"],[role="button"],[role="checkbox"],[role="combobox"]')?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null},{passive:true});
document.addEventListener('touchend',event=>{if(!touch||event.touches.length||event.changedTouches.length!==1)return;const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)parent.postMessage({type:'catalog-specimen-swipe',direction:dx<0?1:-1},location.origin)},{passive:true});
document.addEventListener('touchcancel',()=>{touch=null},{passive:true});

document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return;if(event.key==='Escape'&&document.querySelector('dialog:modal,[aria-modal="true"]'))return;if(event.key!=='Escape'&&eventTouchesControl(event,'input,textarea,select,[contenteditable],[role="combobox"],[role="listbox"]'))return;if(['j','k','h','l','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','v','o','?','Escape'].includes(event.key)){event.preventDefault();parent.postMessage({type:'catalog-specimen-key',key:event.key},location.origin)}});

// The surrounding catalog owns vertical browsing; keep genuine nested controls usable.
if(embedded)document.addEventListener('wheel',event=>{
 const dialogView=root.dataset.view==='dialog';
 if((event.defaultPrevented&&!dialogView)||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
 if(dialogView&&eventTouchesControl(event,'textarea,select,[role="listbox"],[role="grid"]'))return;
 for(const node of dialogView?[]:event.composedPath()){
  if(!(node instanceof Element)||node===document.body||node===document.documentElement)continue;
  const style=getComputedStyle(node);
  if(/auto|scroll/.test(style.overflowY)&&node.scrollHeight>node.clientHeight+1){
   if(event.deltaY>0?node.scrollTop+node.clientHeight<node.scrollHeight-1:node.scrollTop>0)return;
  }
 }
 event.preventDefault();
 const multiplier=event.deltaMode===1?16:event.deltaMode===2?innerHeight:1;
 parent.postMessage({type:'catalog-specimen-scroll',deltaY:event.deltaY*multiplier},location.origin);
},{passive:false});
