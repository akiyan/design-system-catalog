import {test,expect} from '@playwright/test';
import {readFileSync}from'node:fs';
const registry=JSON.parse(readFileSync(new URL('../../src/data/specimens.json',import.meta.url)));
test.use({locale:'ja-JP'});
test.describe.configure({mode:'parallel'});
for(const [id,entry] of Object.entries(registry).filter(([,s])=>s.status==='ready'))test(`${id}: genuine isolated components render and respond`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const view=entry.views.includes('overview')?'overview':entry.views[0];
 await page.goto(`/specimens/${id}/${view}/`);
 await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
 await expect(page.locator('#specimen-root')).not.toHaveAttribute('data-error','true');
 const save=page.getByRole('button',{name:'変更を保存',exact:true}).first();await expect(save).toBeVisible();await save.click();
 await expect(page.locator('.specimen-status')).toContainText('変更を保存しました');
 if(view!=='form'){const disabled=page.getByRole('button',{name:/^無\s*効$/}).first();if(await disabled.count())await expect(disabled).toBeDisabled();else{const control=page.locator('.specimen-row [disabled]').first();await expect(control).toHaveText(/無\s*効/);await control.click({force:true});await expect(page.locator('.specimen-status')).toHaveText('変更を保存しました');}}
 if(view==='buttons'&&entry.views.includes('form')){await page.goto(`/specimens/${id}/form/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');}
 const input=page.getByRole('textbox').filter({visible:true}).first();
 if(entry.views.includes('form'))await expect(input).toBeVisible();
 if(await input.count()){await input.fill('Test project');await expect(input).toHaveValue('Test project');}
 const checkbox=page.getByRole('checkbox').first();
 if(await checkbox.count()){const before=await checkbox.isChecked();await checkbox.press('Space');if(before)await expect(checkbox).not.toBeChecked();else await expect(checkbox).toBeChecked();}
 expect(errors).toEqual([]);
 const styles=await page.evaluate(()=>[...document.styleSheets].map(s=>s.href||''));
 expect(styles.some(s=>s.includes('/_astro/arco.'))).toBe(false);
});
test('catalog renders live specimens, switches shared categories and keeps editable keys',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const frame=page.frameLocator('.main-preview iframe');
 await frame.getByRole('button',{name:'変更を保存',exact:true}).click();await expect(frame.getByRole('status')).toHaveText('変更を保存しました');
 await frame.getByRole('textbox').first().fill('jk?');await expect(page).toHaveURL(/\/ant\/$/);
 await page.locator('.view-thumbnail').filter({hasText:'ボタン'}).click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/ant\/buttons\//);
 await page.locator('.system-row[href="/fluent/"]').click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/fluent\/buttons\//);
 await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.frameLocator('.main-preview iframe').getByRole('button',{name:'Save changes',exact:true}).first()).toBeVisible();
});
test('nonimplemented systems explicitly show resources without fabricated specimens',async({page})=>{
 await page.goto('/sansan/');await expect(page.locator('.implementation-resource')).toBeVisible();await expect(page.locator('.main-preview iframe')).toHaveCount(0);
 await page.goto('/airtable/');await expect(page.locator('.implementation-resource')).toBeVisible();
});
