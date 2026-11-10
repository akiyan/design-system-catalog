import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const registry=JSON.parse(await fs.readFile('src/data/specimens.json','utf8'));
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4175';
const jobs=Object.entries(registry).filter(([,entry])=>entry.status==='ready').flatMap(([id,entry])=>entry.views.map((view,index)=>({id,view,index})));
const results=[];let next=0;const browser=await chromium.launch();
await Promise.all(Array.from({length:4},async()=>{
 const page=await browser.newPage({viewport:{width:1920,height:1080},locale:'ja-JP'});
 while(next<jobs.length){
  const {id,view,index}=jobs[next++];
  try{
   await page.goto(`${base}/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
   if(index)await page.locator('.view-thumbnail').nth(index).click();
   const iframe=page.locator('.main-preview iframe');const frame=page.frameLocator('.main-preview iframe');
   await expect(frame.locator('#specimen-root')).toHaveAttribute('data-ready','true');
   await expect.poll(async()=>{const natural=await frame.locator('#specimen-root').evaluate(el=>Math.ceil(Math.max(el.scrollHeight,el.getBoundingClientRect().height))+2);return await iframe.evaluate(el=>el.clientHeight)-natural;}).toBe(0);
   const naturalHeight=await frame.locator('#specimen-root').evaluate(el=>el.scrollHeight);
   const height=await iframe.evaluate(el=>el.clientHeight);
   const maxScroll=await page.locator('.preview-panel').evaluate(el=>{el.scrollTop=0;return el.scrollHeight-el.clientHeight});
   const box=await iframe.boundingBox();await page.mouse.move(box.x+box.width*.6,box.y+60);await page.mouse.wheel(0,250);
   if(maxScroll>0)await expect.poll(()=>page.locator('.preview-panel').evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
   const innerOverflow=await frame.locator('html').evaluate(()=>Math.max(0,document.scrollingElement.scrollHeight-innerHeight));
   expect(innerOverflow).toBe(0);
   if(view==='overview')await expect(frame.locator('.specimen-overview-list>li')).toHaveCount(3);
   const innerScroll=await frame.locator('html').evaluate(()=>document.scrollingElement.scrollTop);
   expect(innerScroll).toBe(0);await expect(frame.locator('.specimen-header')).toHaveCount(0);
   results.push({id,view,ok:true,height,naturalHeight,outerScrollable:maxScroll>0,innerScroll,innerOverflow});
  }catch(error){results.push({id,view,ok:false,error:error.message.slice(0,600)})}
 }
 await page.close();
}));
await browser.close();results.sort((a,b)=>a.id.localeCompare(b.id)||a.view.localeCompare(b.view));
await fs.writeFile('docs/preview-scroll-validation.json',JSON.stringify(results,null,2)+'\n');
const failures=results.filter(result=>!result.ok);console.log(JSON.stringify({total:results.length,failures},null,2));if(failures.length)process.exitCode=1;
