import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const registry=JSON.parse(await fs.readFile('src/data/specimens.json','utf8'));
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4176';
const listOnly=process.env.LIST_ONLY==='1';
const browser=await chromium.launch({headless:true});
for(const folder of ['thumbnails','list-thumbnails'])await fs.mkdir(`public/specimens/${folder}`,{recursive:true});
const jobs=Object.entries(registry).filter(([id,s])=>s.status==='ready'&&(!process.env.ONLY||process.env.ONLY.split(',').includes(id))).flatMap(([id,s])=>s.views.filter(view=>!process.env.VIEWS||process.env.VIEWS.split(',').includes(view)).map(view=>({id,view})));
let next=0;const results=[];
async function open(page,id,view,compact=false){
 await page.goto(`${base}/specimens/${id}/${view}/${compact?'?thumbnail=1':''}`,{waitUntil:'networkidle',timeout:45000});
 await page.locator('#specimen-root[data-ready="true"]').waitFor({timeout:15000});
 await page.waitForTimeout(compact?150:500);
 if(await page.locator('#specimen-root[data-error]').count())throw Error(await page.locator('#specimen-root').innerText());
}
async function compactCapture(page,id,view){
 // Keep native component sizes legible: capture a smaller screen excerpt rather
 // than widening the page until every specimen fits, then shrinking it all.
 await page.setViewportSize({width:view==='dialog'?800:640,height:view==='dialog'?600:300});
 await open(page,id,view,true);
 // A modal can live in a body portal. Capture its actual surface, not the launcher behind it.
 let target=page;
 if(view==='dialog'){
  const selector=await page.locator('#specimen-root').getAttribute('data-dialog-surface');
  target=selector?page.locator(selector):page.getByRole('dialog').or(page.getByRole('alertdialog'));
 }
 const background=await page.evaluate(()=>{const context=new OffscreenCanvas(1,1).getContext('2d');context.fillStyle=getComputedStyle(document.body).backgroundColor;context.fillRect(0,0,1,1);const [r,g,b,a]=context.getImageData(0,0,1,1).data;return {r,g,b,alpha:a/255}});
 await sharp(await target.screenshot()).resize(480,224,{fit:'contain',background}).webp({quality:86}).toFile(`public/specimens/list-thumbnails/${id}-${view}.webp`);
}

await Promise.all(Array.from({length:4},async()=>{
 const page=await browser.newPage({viewport:{width:1000,height:720},deviceScaleFactor:1});
 while(next<jobs.length){
  const {id,view}=jobs[next++];const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
  try{
   if(!listOnly){
    await page.setViewportSize({width:1000,height:720});await open(page,id,view);
    const buttons=await page.getByRole('button').count();
    if(!buttons&&!['typography','table','alerts','card','code'].includes(view))throw Error('No accessible buttons rendered');
    if(view==='alerts'&&!await page.locator('.specimen-alerts>*').count())throw Error('No alert specimens rendered');
    if(view==='card'&&await page.locator('.specimen-card-grid>*').count()<2)throw Error('Missing card specimens');
    if(view==='chat'&&await page.getByRole('log').innerText()==='')throw Error('No chat messages rendered');
    if(view==='code'&&!(await page.locator('.specimen').innerText()).includes('const project'))throw Error('No code sample rendered');
    if(view==='dialog'&&!await page.getByRole('dialog').or(page.getByRole('alertdialog')).isVisible())throw Error('No dialog rendered');
    await sharp(await page.screenshot()).webp({quality:84}).toFile(`public/specimens/thumbnails/${id}-${view}.webp`);
   }
   await compactCapture(page,id,view);
   if(errors.length)throw Error(errors.join('; '));
   results.push({id,view,ok:true,thumbnailViewport:{width:view==='dialog'?800:640,height:view==='dialog'?600:300},thumbnailFraming:view==='dialog'?'dialog-surface':'screen-excerpt'});console.log('OK',id,view);
  }catch(error){results.push({id,view,ok:false,error:error.message.slice(0,1200)});console.log('FAIL',id,view,error.message.slice(0,250))}
  page.off('pageerror',listener);
 }
 await page.close();
}));
await browser.close();
const reportPath=`docs/specimen${listOnly?'-list':''}-validation.json`;
let report=results;
if(process.env.ONLY||process.env.VIEWS){
 try{const previous=JSON.parse(await fs.readFile(reportPath,'utf8'));report=[...previous.filter(item=>registry[item.id]?.views.includes(item.view)&&!results.some(result=>result.id===item.id&&result.view===item.view)),...results];}catch(error){if(error.code!=='ENOENT')throw error;}
}
await fs.writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:results.length,failed:results.filter(x=>!x.ok)},null,2));
if(results.some(x=>!x.ok))process.exitCode=1;
