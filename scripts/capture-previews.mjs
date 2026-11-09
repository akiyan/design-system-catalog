import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const systems = JSON.parse(await readFile(new URL('../src/data/systems.json', import.meta.url)));
await mkdir('public/previews', {recursive:true});
const browser = await chromium.launch({headless:true});
const requestedIds=process.argv.slice(2).flatMap(value=>value.split(','));
const selectedSystems=requestedIds.length?systems.filter(s=>requestedIds.includes(s.id)):systems;
const jobs = selectedSystems.flatMap(s=>s.views.map((v,i)=>({...v,id:s.id,index:i})));
const results=[];
async function work() {
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,locale:'en-US',reducedMotion:'reduce'});
 while(jobs.length) {
  const job=jobs.shift(); const page=await context.newPage();
  try {
   const response=await page.goto(job.url,{waitUntil:'domcontentloaded',timeout:35000});
   if(!response || response.status()>=400) throw new Error(`HTTP ${response?.status()}`);
   await page.waitForLoadState('networkidle',{timeout:7000}).catch(()=>{});
   await page.waitForTimeout(1300);
   const preview=page.locator('#storybook-preview-iframe');
   if(await preview.count()) {
    const frame=page.frameLocator('#storybook-preview-iframe');
    await frame.locator('body').waitFor({state:'visible',timeout:15000});
    await page.waitForTimeout(1800);
    const previewText=await frame.locator('body').innerText();
    if(/No Preview|Failed to fetch dynamically imported module/.test(previewText)) throw new Error('Source Storybook preview unavailable');
   }
   await page.evaluate(()=>document.fonts.ready);
   for(const label of ['Reject additional cookies','Reject all cookies','Accept all cookies']) {
    const button=page.getByRole('button',{name:label,exact:true});
    if(await button.count() && await button.first().isVisible()) await button.first().click().catch(()=>{});
   }
   const title=await page.title();
   if(/sign in|log in|login/i.test(title)) throw new Error('Authentication required; excluded from previews');
   const text=await page.locator('body').first().innerText();
   if(text.length<100 || /Access denied|Just a moment|Checking your browser/i.test(text.slice(0,300))) throw new Error('Blocked or empty source');
   await page.screenshot({path:`public/previews/${job.id}-${job.index}.webp`,type:'webp',quality:88});
   results.push({...job,status:'captured',finalUrl:page.url(),title:await page.title()});
   console.log(`Captured ${job.id}-${job.index}: ${await page.title()}`);
  } catch(e) { results.push({...job,status:'failed',error:e.message});console.log(`Failed ${job.id}-${job.index}: ${e.message}`); }
  await page.close();
 }
 await context.close();
}
await Promise.all([work(),work(),work()]);
await browser.close();
await writeFile(requestedIds.length>1?'docs/capture-manifest-additions.json':requestedIds.length?`docs/capture-manifest-${requestedIds[0]}.json`:'docs/capture-manifest.json',JSON.stringify({capturedAt:new Date().toISOString(),viewport:{width:1440,height:1000},results},null,2));
