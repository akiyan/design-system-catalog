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
test('Enter enlarges the selected specimen while buttons, fields and links retain native activation',async({page,context})=>{
 await page.goto('/astryx/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await page.keyboard.press('Enter');await expect(page.locator('.zoom-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('.system-row[aria-current="page"]').focus();await page.keyboard.press('Enter');await expect(page.locator('.zoom-dialog')).toBeVisible();await page.keyboard.press('Escape');
 const frame=page.frameLocator('.main-preview iframe');await frame.getByRole('button',{name:'変更を保存',exact:true}).press('Enter');await expect(frame.locator('.specimen-status')).toHaveText('変更を保存しました');await expect(page.locator('.zoom-dialog')).not.toBeVisible();
 await frame.getByRole('textbox').press('Enter');await expect(page.locator('.zoom-dialog')).not.toBeVisible();
 await frame.getByRole('heading',{level:1}).click();await page.keyboard.press('Enter');await expect(page.locator('.zoom-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await context.route('https://astryx.atmeta.com/',route=>route.fulfill({body:'Official site',contentType:'text/html'}));await page.locator('.preview-heading>.official-link').focus();const popup=page.waitForEvent('popup');await page.keyboard.press('Enter');const opened=await popup;await opened.waitForLoadState();await opened.close();await expect(page.locator('.zoom-dialog')).not.toBeVisible();
});
test('offscreen specimens wait for viewport proximity and initialize when scrolled into view',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await expect(page.frameLocator('.main-preview iframe').locator('#specimen-root')).toHaveAttribute('data-ready','true');
 const extra=page.locator('.component-section[data-view="components"] iframe');await expect(extra).toHaveAttribute('data-deferred','true');await expect(extra).not.toHaveAttribute('src');
 await extra.scrollIntoViewIfNeeded();await expect(extra).toHaveAttribute('src',/\/ant\/components\//);await expect(extra.contentFrame().locator('#specimen-root')).toHaveAttribute('data-ready','true');await expect(extra).not.toHaveAttribute('data-deferred');
 await page.locator('.system-row[href="/dads/"]').click();await expect(page.locator('.preview-panel')).toHaveJSProperty('scrollTop',0);await expect(page.frameLocator('.main-preview iframe').locator('#specimen-root')).toHaveAttribute('data-ready','true');await expect(page.locator('.component-section[data-view="components"] iframe')).not.toHaveAttribute('src');
});
