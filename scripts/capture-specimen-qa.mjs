import{chromium}from'@playwright/test';
import sharp from'sharp';
const b=await chromium.launch();const page=await b.newPage({viewport:{width:1440,height:1024},locale:'ja-JP'});const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4174';
async function ready(){await page.locator('.catalog-app[data-ready=true]').waitFor();await page.frameLocator('.main-preview iframe').locator('#specimen-root[data-ready=true]').waitFor();await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.filter(x=>x.loading!=='lazy').map(i=>i.decode().catch(()=>{}))));await page.waitForTimeout(250)}
await page.goto(base+'/ant/');await ready();await page.screenshot({path:'docs/specimen-desktop.png'});
await page.goto(base+'/dads/');await ready();await page.screenshot({path:'docs/specimen-dads.png'});
await page.setViewportSize({width:390,height:844});await ready();await page.screenshot({path:'docs/specimen-mobile-detail.png'});
await page.getByRole('button',{name:'一覧に戻る',exact:true}).click();await page.screenshot({path:'docs/specimen-mobile-list.png'});
await page.setViewportSize({width:1440,height:1024});await page.goto(base+'/fluent/');await ready();await page.getByRole('button',{name:'English',exact:true}).click();await ready();await page.screenshot({path:'docs/specimen-english.png'});
await page.getByRole('button',{name:'Enlarge preview',exact:true}).click();await page.frameLocator('.zoom-dialog iframe').locator('#specimen-root[data-ready=true]').waitFor();await page.screenshot({path:'docs/specimen-zoom.png'});
await page.frameLocator('.zoom-dialog iframe').getByRole('textbox').first().focus();await page.keyboard.press('Escape');await page.locator('.zoom-dialog').waitFor({state:'hidden'});
await b.close();
const shots=['docs/selected-design.png','docs/specimen-desktop.png'];const layers=[];for(let i=0;i<shots.length;i++)layers.push({input:await sharp(shots[i]).resize(900,640,{fit:'contain',background:'#eee'}).png().toBuffer(),left:i*900,top:0});await sharp({create:{width:1800,height:640,channels:3,background:'#eee'}}).composite(layers).jpeg({quality:88}).toFile('docs/specimen-comparison.jpg');
