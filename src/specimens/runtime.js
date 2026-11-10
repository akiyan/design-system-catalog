import layoutStyles from './layout.css?inline';
const modules=import.meta.glob('./adapters/*.{jsx,js}');
const root=document.getElementById('specimen-root');
const language=new URLSearchParams(location.search).get('lang')==='en'?'en':'ja';
document.documentElement.lang=language;
if(new URLSearchParams(location.search).has('thumbnail'))document.documentElement.classList.add('specimen-thumbnail');
function notify(){parent.postMessage({type:'catalog-specimen-size',height:Math.ceil(root.scrollHeight)},location.origin)}
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

document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return;if(event.key!=='Escape'&&eventTouchesControl(event,'input,textarea,select,[contenteditable],[role="combobox"],[role="listbox"]'))return;if(['j','k','h','l','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','v','o','?','Escape'].includes(event.key)){event.preventDefault();parent.postMessage({type:'catalog-specimen-key',key:event.key},location.origin)}});
