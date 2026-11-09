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
 await page.setViewportSize({width:600,height:500});
 await open(page,id,view,true);
 const specimen=page.locator('.specimen');
 // Fit real content to the thumbnail proportions without cropping controls.
 for(let i=0;i<4;i++){
  const box=await specimen.boundingBox();
  const width=Math.round(Math.max(420,Math.min(1000,box.width*Math.sqrt(2.15/(box.width/box.height)))));
  if(Math.abs(width-box.width)<12)break;
  await page.setViewportSize({width,height:700});await page.waitForTimeout(40);
 }
 await sharp(await specimen.screenshot()).resize(480,224,{fit:'contain',background:'#fff'}).webp({quality:86}).toFile(`public/specimens/list-thumbnails/${id}-${view}.webp`);
}
await Promise.all(Array.from({length:4},async()=>{
 const page=await browser.newPage({viewport:{width:1000,height:720},deviceScaleFactor:1});
 while(next<jobs.length){
  const {id,view}=jobs[next++];const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
  try{
   if(!listOnly){
    await page.setViewportSize({width:1000,height:720});await open(page,id,view);
    const buttons=await page.getByRole('button').count();
    if(!buttons&&!['typography','table','alerts'].includes(view))throw Error('No accessible buttons rendered');
    await sharp(await page.screenshot()).webp({quality:84}).toFile(`public/specimens/thumbnails/${id}-${view}.webp`);
   }
   await compactCapture(page,id,view);
   if(errors.length)throw Error(errors.join('; '));
   results.push({id,view,ok:true});console.log('OK',id,view);
  }catch(error){results.push({id,view,ok:false,error:error.message.slice(0,1200)});console.log('FAIL',id,view,error.message.slice(0,250))}
  page.off('pageerror',listener);
 }
 await page.close();
}));
await browser.close();
await fs.writeFile(`docs/specimen${listOnly?'-list':''}-validation.json`,JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({total:results.length,failed:results.filter(x=>!x.ok)},null,2));
if(results.some(x=>!x.ok))process.exitCode=1;
