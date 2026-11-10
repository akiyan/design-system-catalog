import{test,expect}from'@playwright/test';
import{readFileSync}from'node:fs';
const registry=JSON.parse(readFileSync(new URL('../../src/data/specimens.json',import.meta.url)));
test.use({locale:'ja-JP'});
for(const [id,entry]of Object.entries(registry).filter(([,s])=>s.views.includes('components')))test(`${id}: additional genuine components render and respond`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`/specimens/${id}/components/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');await expect(page.locator('#specimen-root')).not.toHaveAttribute('data-error','true');
 await expect(page.locator('.specimen-extra-grid')).toBeVisible();expect(await page.locator('.specimen-extra-grid').innerText()).not.toBe('');
 const toggle=page.getByRole('button',{name:'公開時の設定',exact:true}).or(page.locator('summary').filter({hasText:'公開時の設定'}));
 if(await toggle.count()){await toggle.first().click();await toggle.first().click();}
 const tabs=page.getByRole('tab');if(await tabs.count()>1){await tabs.nth(1).click();await expect(page.getByText('招待されたチームメンバーのみがこのプロジェクトを更新できます。',{exact:true})).toBeVisible();}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('Digital Agency dialog buttons keep official medium-size padding',async({page})=>{
 await page.goto('/specimens/dads/dialog/');await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');for(const name of ['公開する','キャンセル']){const button=page.getByRole('dialog').getByRole('button',{name,exact:true});await expect(button).toHaveCSS('padding-left','16px');await expect(button).toHaveCSS('padding-right','16px');expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(48);}
});
for(const id of ['astryx','carbon','polaris','smarthr','evergreen'])test(`${id}: card heading and body have a real content gap`,async({page})=>{
 await page.goto(`/specimens/${id}/card/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');const heading=page.getByRole('heading',{name:'コンポーネントライブラリ',exact:true});const body=page.getByText('次のプロジェクトで使える共通部品。Akiが本日更新しました。',{exact:true});const a=await heading.boundingBox(),b=await body.boundingBox();expect(b.y-a.y-a.height).toBeGreaterThanOrEqual(7.5);
});
for(const id of ['boosted','italia','sgds','kumo'])test(`${id}: modal content retains its official inset`,async({page})=>{
 await page.goto(`/specimens/${id}/dialog/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');const dialog=page.getByRole('dialog');const heading=dialog.getByRole('heading').first();const a=await dialog.boundingBox(),b=await heading.boundingBox();expect(b.x-a.x).toBeGreaterThanOrEqual(15);expect(b.y-a.y).toBeGreaterThanOrEqual(15);
});
test('Fluent rich-text headings and paragraphs occupy separate lines',async({page})=>{
 await page.goto('/specimens/fluent/typography/');await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');const section=page.locator('.specimen-rich-text>section').nth(2);const elements=await section.locator('h2,h3,p').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().toJSON()));for(let i=1;i<elements.length;i++)expect(elements[i].y-elements[i-1].bottom).toBeGreaterThanOrEqual(11);
});
for(const id of ['astryx','bitsui'])test(`${id}: horizontal navigation stops at both gallery boundaries`,async({page})=>{
 await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await page.keyboard.press('ArrowLeft');await page.keyboard.press('h');await page.keyboard.press('v');
 const dialog=page.locator('.zoom-dialog');await expect(dialog).toBeVisible();await expect(page.locator('.zoom-navigation')).toContainText('1 /');await expect(dialog.getByRole('button',{name:'前のプレビュー',exact:true})).toBeDisabled();
 await page.keyboard.press('ArrowLeft');await page.keyboard.press('h');await expect(page.locator('.zoom-navigation')).toContainText('1 /');
 const count=Number((await page.locator('.zoom-navigation').innerText()).split('/')[1].trim());
 for(let i=0;i<count+2;i++)await page.keyboard.press('l');await page.keyboard.press('ArrowRight');await expect(page.locator('.zoom-navigation')).toContainText(`${count} / ${count}`);await expect(dialog.getByRole('button',{name:'次のプレビュー',exact:true})).toBeDisabled();
 for(let i=0;i<count+2;i++)await page.keyboard.press('h');await expect(page.locator('.zoom-navigation')).toContainText(`1 / ${count}`);
 await page.keyboard.press('Escape');await page.keyboard.press('h');await page.keyboard.press('v');await expect(page.locator('.zoom-navigation')).toContainText(`1 / ${count}`);
});
