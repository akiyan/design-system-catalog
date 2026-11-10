import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const systems=JSON.parse(await fs.readFile('src/data/systems.json','utf8'));
const browser=await chromium.launch();const report=[];let next=0;
await fs.mkdir('docs/official-theme-captures',{recursive:true});
await Promise.all(Array.from({length:5},async()=>{
 const context=await browser.newContext({viewport:{width:1200,height:900},colorScheme:'light',locale:'en-US'});const page=await context.newPage();
 while(next<systems.length){const system=systems[next++];
 try{
 await page.goto(system.url,{waitUntil:'domcontentloaded',timeout:20000});await page.waitForTimeout(1000);
 const result=await page.evaluate(()=>{
  const colors=new Map();
  for(const y of [.25,.4,.55,.7,.85])for(const x of [.25,.4,.55,.7,.85]){
   let element=document.elementFromPoint(innerWidth*x,innerHeight*y),color;
   while(element){const c=getComputedStyle(element).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'&&c!=='transparent'){color=c;break}element=element.parentElement}
   color||='rgb(255, 255, 255)';colors.set(color,(colors.get(color)||0)+1);
  }
  return {title:document.title,url:location.href,bodyBackground:getComputedStyle(document.body).backgroundColor,bodyColor:getComputedStyle(document.body).color,samples:[...colors].sort((a,b)=>b[1]-a[1])};
 });
 const blocked=/just a moment|access denied|not found|404|403|verify.*human|security check/i.test(result.title);
 report.push({id:system.id,ok:!blocked,...result,checkedAt:new Date().toISOString()});
 if(['coinbase','kumo','wise','astryx','porsche','spectrum','carbon','fluent'].includes(system.id))await page.screenshot({path:`docs/official-theme-captures/${system.id}.png`});
 console.log(system.id,result.samples[0],blocked?'BLOCKED':'');
 }catch(error){report.push({id:system.id,ok:false,error:error.message.slice(0,250)});console.log(system.id,'FAIL')}
 }await context.close();
}));
await browser.close();report.sort((a,b)=>a.id.localeCompare(b.id));await fs.writeFile('docs/official-theme-validation.json',JSON.stringify(report,null,2)+'\n');console.log('checked',report.length);
