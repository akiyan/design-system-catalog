import{test,expect}from'@playwright/test';
import{readFileSync}from'node:fs';
const themes=JSON.parse(readFileSync(new URL('../../src/data/preview-themes.json',import.meta.url)));
test.use({locale:'ja-JP'});
test.beforeEach(async({page})=>{await page.route('https://www.googletagmanager.com/**',r=>r.abort());});
for(const id of Object.keys(themes))test(`${id}: genuine themes change in place without losing form state`,async({page})=>{
 await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');const frame=page.frameLocator('.main-preview iframe');await expect(frame.locator('#specimen-root')).toHaveAttribute('data-ready','true');
 const input=frame.getByRole('textbox').first();await input.fill('Theme state preserved');await frame.locator('body').evaluate(el=>el.dataset.themeTest='same-document');
 const colors=()=>frame.locator('button').evaluateAll(els=>els.map(e=>{const s=getComputedStyle(e);return[s.color,s.backgroundColor,s.borderColor].join('/')}).join('|'));
 await page.getByRole('radio',{name:'ライト',exact:true}).check();await expect(frame.locator('html')).toHaveAttribute('data-color-scheme','light');const light=await colors();
 await page.getByRole('radio',{name:'ダーク',exact:true}).check();await expect(frame.locator('html')).toHaveAttribute('data-color-scheme','dark');await expect.poll(colors).not.toBe(light);
 await expect(input).toHaveValue('Theme state preserved');await expect(frame.locator('body')).toHaveAttribute('data-theme-test','same-document');await expect(frame.locator('#specimen-root')).not.toHaveAttribute('data-error','true');
 await page.getByRole('radio',{name:themes[id].defaultIsLight?'ライト':'標準',exact:true}).check();await expect(frame.locator('html')).toHaveAttribute('data-color-scheme',['coinbase','cloudscape'].includes(id)?'dark':'light');
});
test('theme toolbar stays pinned; deferred specimens, system changes and enlargement inherit the choice',async({page})=>{
 await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await expect(page.frameLocator('.main-preview iframe').locator('#specimen-root')).toHaveAttribute('data-ready','true');await page.getByRole('radio',{name:'ダーク',exact:true}).check();
 const bar=page.locator('.preview-theme-bar'),before=await bar.boundingBox();expect(Math.abs(before.y-(await page.locator('.preview-panel').boundingBox()).y)).toBeLessThan(1);const section=page.locator('.component-section[data-view="components"]');await section.scrollIntoViewIfNeeded();await expect(section.locator('iframe').contentFrame().locator('#specimen-root')).toHaveAttribute('data-ready','true');await expect(section.locator('iframe').contentFrame().locator('html')).toHaveAttribute('data-color-scheme','dark');expect(Math.abs((await bar.boundingBox()).y-before.y)).toBeLessThan(1);
 await section.locator('.specimen-enlarge').click();await expect(page.frameLocator('.zoom-content iframe').locator('html')).toHaveAttribute('data-color-scheme','dark');await page.keyboard.press('Escape');
 await page.locator('.system-row[href="/ant/"]').click();await expect(page.getByRole('radio',{name:'ダーク',exact:true})).toBeChecked();await expect(page.frameLocator('.main-preview iframe').locator('html')).toHaveAttribute('data-color-scheme','dark');
});
test('unsupported integrations and captures omit the theme toolbar; supported systems retain the choice',async({page})=>{
 for(const width of [1440,390])for(const id of ['dads','bitsui']){await page.setViewportSize({width,height:844});await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await expect(page.locator('.preview-theme-bar')).toHaveCount(0);await expect(page.getByRole('radio')).toHaveCount(0);}
 await page.setViewportSize({width:1440,height:1024});await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await page.getByRole('radio',{name:'ダーク',exact:true}).check();
 await page.locator('.system-row[href="/dads/"]').click();await expect(page.locator('.preview-theme-bar')).toHaveCount(0);await expect(page.frameLocator('.main-preview iframe').locator('html')).toHaveAttribute('data-color-scheme','light');
 await page.locator('.system-row[href="/fluent/"]').click();await expect(page.getByRole('radio',{name:'ダーク',exact:true})).toBeChecked();
 await page.goto('/');await expect(page.locator('.preview-theme-bar')).toHaveCount(0);
});
test('mobile theme controls remain fixed and use native radio keyboard behavior',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');const light=page.getByRole('radio',{name:'ライト',exact:true});await light.check();await light.focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('radio',{name:'ダーク',exact:true})).toBeChecked();await expect(page).toHaveURL(/\/fluent\/$/);
 const bar=page.locator('.preview-theme-bar'),before=await bar.boundingBox();await page.locator('.workspace').evaluate(e=>e.scrollTop=500);expect(Math.abs((await bar.boundingBox()).y-before.y)).toBeLessThan(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.getByRole('radio',{name:'Dark',exact:true})).toBeChecked();
});

test('equivalent original/light themes expose only Light and Dark in both languages',async({page})=>{
 for(const id of ['ant','primer','arco','semi']){
  await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.preview-theme-options input')).toHaveCount(2);await expect(page.getByRole('radio',{name:'標準',exact:true})).toHaveCount(0);await expect(page.getByRole('radio',{name:'ライト',exact:true})).toBeChecked();
  await expect(page.frameLocator('.main-preview iframe').locator('html')).toHaveAttribute('data-color-scheme','light');
  await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.getByRole('radio',{name:'Original',exact:true})).toHaveCount(0);await expect(page.getByRole('radio',{name:'Light',exact:true})).toBeChecked();await page.getByRole('button',{name:'日本語',exact:true}).click();
 }
});
test('distinct original palettes remain selectable; collapsed Light preference persists into dark-default systems',async({page})=>{
 await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await expect(page.locator('.preview-theme-options input')).toHaveCount(3);await expect(page.getByRole('radio',{name:'標準',exact:true})).toBeChecked();
 await page.locator('.system-row[href="/ant/"]').click();await expect(page.getByRole('radio',{name:'ライト',exact:true})).toBeChecked();
 await page.locator('.system-row[href="/coinbase/"]').click();await expect(page.locator('.preview-theme-options input')).toHaveCount(3);await expect(page.getByRole('radio',{name:'ライト',exact:true})).toBeChecked();await expect(page.frameLocator('.main-preview iframe').locator('html')).toHaveAttribute('data-color-scheme','light');
 await page.getByRole('radio',{name:'標準',exact:true}).check();await expect(page.frameLocator('.main-preview iframe').locator('html')).toHaveAttribute('data-color-scheme','dark');
});
