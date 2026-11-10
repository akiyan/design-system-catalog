import {test,expect} from '@playwright/test';
test.use({locale:'ja-JP'});
const ready=async page=>expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
for(const id of ['astryx','dads','fluent','ant','carbon','cloudscape','govuk','dsfr'])test(`${id}: overview includes library-specific statuses and banner`,async({page})=>{
 await page.goto(`/specimens/${id}/overview/?lang=ja`);await ready(page);
 await expect(page.locator('.specimen-badges')).toContainText('公開済み');
 await expect(page.locator('.specimen-overview-banner')).toContainText('設定を確認してください');
 await expect(page.locator('.specimen-overview-list>li')).toHaveCount(3);
});
for(const id of ['ant','astryx','cloudscape','arco','tdesign','fluent','carbon'])test(`${id}: chat sends a local message and clears its input`,async({page})=>{
 await page.goto(`/specimens/${id}/chat/?lang=ja`);await ready(page);
 const composer=page.locator('.specimen-chat-composer');const send=composer.getByRole('button',{name:'送信',exact:true});
 await expect(send).toBeDisabled();await composer.getByRole('textbox').fill('レビューをお願いします');await send.click();
 await expect(page.getByRole('log')).toContainText('レビューをお願いします');await expect(composer.getByRole('textbox')).toHaveValue('');await expect(send).toBeDisabled();
});
for(const id of ['astryx','ant','carbon','fluent','cloudscape','dads','boosted','tdesign'])test(`${id}: dialog can close and reopen`,async({page})=>{
 await page.goto(`/specimens/${id}/dialog/?lang=ja`);await ready(page);
 const dialog=page.getByRole('dialog').or(page.getByRole('alertdialog'));
 await expect(dialog).toBeVisible();await expect(dialog).toContainText('プロジェクトを公開しますか？');
 await dialog.getByRole('button',{name:'公開する',exact:true}).click();await expect(dialog).toBeHidden();
 await page.getByRole('button',{name:'ダイアログを開く',exact:true}).click();await expect(dialog).toBeVisible();
});
test('all new categories drive both list thumbnails and the matching selected specimen',async({page})=>{
 await page.goto('/astryx/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 for(const [key,label] of [['card','カード'],['dialog','ダイアログ'],['code','コードブロック'],['chat','チャット']]){
  await page.getByRole('navigation',{name:'一覧のプレビューカテゴリ'}).getByRole('button',{name:label,exact:true}).click();
  await expect(page.locator('.system-row[href="/astryx/"] img')).toHaveAttribute('src',`/specimens/list-thumbnails/astryx-${key}.webp`);
  await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',new RegExp(`/astryx/${key}/`));
  await expect(page.frameLocator('.main-preview iframe').locator('#specimen-root')).toHaveAttribute('data-ready','true');
 }
});

for(const id of ['coinbase','cloudscape'])test(`${id}: genuine dark theme and canvas remain in sync`,async({page})=>{
 await page.goto(`/specimens/${id}/overview/`);await ready(page);
 await expect(page.locator('html')).toHaveAttribute('data-color-scheme','dark');
 const background=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
 expect(background).not.toBe('rgb(255, 255, 255)');
 const color=await page.getByRole('textbox').first().evaluate(el=>getComputedStyle(el).color);
 const channels=color.match(/[0-9.]+/g).slice(0,3).map(Number);expect(Math.max(...channels)).toBeGreaterThan(150);
});
test('footer has no external arrows and source-link text shares one baseline',async({page})=>{
 await page.goto('/dads/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.site-footer svg')).toHaveCount(2);
 await expect(page.locator('.source-links a')).toHaveCount(2);
 const positions=await page.locator('.source-links a').evaluateAll(links=>links.map(link=>{const range=document.createRange();range.selectNodeContents([...link.childNodes].find(node=>node.nodeType===Node.TEXT_NODE));const rect=range.getBoundingClientRect();return {y:rect.y,height:rect.height}}));
 expect(positions[0].y).toBe(positions[1].y);expect(positions[0].height).toBe(positions[1].height);
});

test('Coinbase uses the published font defaults for its genuine typography',async({page})=>{
 await page.goto('/specimens/coinbase/overview/');await ready(page);
 await expect(page.getByRole('heading',{level:1})).toHaveCSS('font-family',/Inter/);
});

test('Digital Agency modal stays the same height after opening and Escape closes it',async({page})=>{
 await page.goto('/dads/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await page.locator('.view-thumbnail').filter({hasText:'ダイアログ'}).click();
 const iframe=page.locator('.main-preview iframe'),frame=page.frameLocator('.main-preview iframe');
 await expect(frame.getByRole('dialog')).toBeVisible();await page.waitForTimeout(650);
 const height=await iframe.evaluate(el=>el.clientHeight);await page.waitForTimeout(400);
 expect(await iframe.evaluate(el=>el.clientHeight)).toBe(height);
 await expect.poll(()=>frame.locator('html').evaluate(()=>document.scrollingElement.scrollHeight<=innerHeight)).toBe(true);
 await frame.getByRole('button',{name:'公開する',exact:true}).focus();await page.keyboard.press('Escape');await expect(frame.getByRole('dialog')).toBeHidden();
 await expect(page).toHaveURL(/\/dads\/$/);
});
