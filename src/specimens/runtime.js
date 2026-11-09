import layoutStyles from './layout.css?inline';
const modules=import.meta.glob('./adapters/*.{jsx,js}');
const root=document.getElementById('specimen-root');
const language=new URLSearchParams(location.search).get('lang')==='en'?'en':'ja';
document.documentElement.lang=language;
function notify(){parent.postMessage({type:'catalog-specimen-size',height:Math.ceil(root.scrollHeight)},location.origin)}
try {
 const module=await modules[`./adapters/${root.dataset.adapter}.jsx`]?.() || await modules[`./adapters/${root.dataset.adapter}.js`]?.();
 if(!module)throw new Error('Implementation adapter unavailable');
 const shellStyles=document.createElement('style');shellStyles.textContent=layoutStyles;document.head.append(shellStyles);
 await module.default(root,{view:root.dataset.view,language,name:root.dataset.name});
 await document.fonts.ready;
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 root.dataset.ready='true';notify();new ResizeObserver(notify).observe(document.body);
} catch(error){root.dataset.error='true';root.textContent=error.message;root.className='specimen-error';console.error(error);notify()}
let touch;
document.addEventListener('touchstart',event=>{touch=event.touches.length===1&&!event.target.closest('button,input,select,textarea,[role="button"],[role="checkbox"],[role="combobox"]')?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null},{passive:true});
document.addEventListener('touchend',event=>{if(!touch||event.touches.length||event.changedTouches.length!==1)return;const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)parent.postMessage({type:'catalog-specimen-swipe',direction:dx<0?1:-1},location.origin)},{passive:true});
document.addEventListener('touchcancel',()=>{touch=null},{passive:true});

document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return;if(event.key!=='Escape'&&event.target.closest('input,textarea,select,[contenteditable],[role="combobox"],[role="listbox"]'))return;if(['j','k','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','v','o','?','Escape'].includes(event.key)){event.preventDefault();parent.postMessage({type:'catalog-specimen-key',key:event.key},location.origin)}});
