import {test,expect} from '@playwright/test';
import {readFileSync}from'node:fs';
const systems=JSON.parse(readFileSync(new URL('../../src/data/systems.json',import.meta.url)));
const registry=JSON.parse(readFileSync(new URL('../../src/data/specimens.json',import.meta.url)));
test.use({locale:'ja-JP'});
test.describe.configure({mode:'parallel'});
for(const [id,entry] of Object.entries(registry).filter(([,s])=>s.status==='ready'))test(`${id}: genuine isolated components render and respond`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const view=entry.views.includes('overview')?'overview':entry.views[0];
 await page.goto(`/specimens/${id}/${view}/`);
 await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
 await expect(page.locator('#specimen-root')).not.toHaveAttribute('data-error','true');
 expect(entry.views[0]).toBe('overview');
 const system=systems.find(s=>s.id===id);
 await expect(page.getByRole('heading',{name:system.shortName,exact:true})).toBeVisible();
 await expect(page.getByText(system.thumbnailDescription.ja,{exact:true})).toBeVisible();
 const save=page.getByRole('button',{name:'変更を保存',exact:true}).first();await expect(save).toBeVisible();await save.click();
 await expect(page.locator('.specimen-status')).toContainText('変更を保存しました');
 const input=page.getByRole('textbox').filter({visible:true}).first();
 if(entry.views.includes('form'))await expect(input).toBeVisible();
 if(await input.count()){await input.fill('Test project');await expect(input).toHaveValue('Test project');}
 const checkbox=page.getByRole('checkbox').first();
 if(await checkbox.count()){const before=await checkbox.isChecked();await checkbox.press('Space');if(before)await expect(checkbox).not.toBeChecked();else await expect(checkbox).toBeChecked();}
 expect(errors).toEqual([]);
 if(entry.views.includes('form')){
  await page.goto(`/specimens/${id}/form/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  const disabled=page.getByRole('button',{name:/^無\s*効$/}).first();
  if(await disabled.count())await expect(disabled).toBeDisabled();else await expect(page.locator('.specimen-row [disabled]').filter({hasText:/無\s*効/}).first()).toHaveText(/無\s*効/);
 }
 const styles=await page.evaluate(()=>[...document.styleSheets].map(s=>s.href||''));
 expect(styles.some(s=>s.includes('/_astro/arco.'))).toBe(false);
});
test('catalog renders live specimens, switches shared categories and keeps editable keys',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const frame=page.frameLocator('.main-preview iframe');
 await frame.getByRole('button',{name:'変更を保存',exact:true}).click();await expect(frame.getByRole('status')).toHaveText('変更を保存しました');
 await frame.getByRole('textbox').first().pressSequentially('jk?');await expect(page).toHaveURL(/\/ant\/$/);
 await page.locator('.view-thumbnail').filter({hasText:'フォーム'}).click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/ant\/form\//);
 await page.locator('.system-row[href="/fluent/"]').click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/fluent\/form\//);
 await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.frameLocator('.main-preview iframe').getByRole('button',{name:'Save changes',exact:true}).first()).toBeVisible();
});
test('nonimplemented systems explicitly show resources without fabricated specimens',async({page})=>{
 await page.goto('/sansan/');await expect(page.locator('.implementation-resource')).toBeVisible();await expect(page.locator('.main-preview iframe')).toHaveCount(0);
 await page.goto('/airtable/');await expect(page.locator('.implementation-resource')).toBeVisible();
});

test('next and previous system navigation reset typography to the overview',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const waitForLayout=async()=>{const root=page.frameLocator('.main-preview iframe').locator('#specimen-root');await expect(root).toHaveAttribute('data-ready','true');const height=await root.evaluate(el=>Math.ceil(Math.max(el.scrollHeight,el.getBoundingClientRect().height))+2);await expect(page.locator('.main-preview iframe')).toHaveJSProperty('clientHeight',height);};
 await waitForLayout();
 await page.locator('.view-thumbnail').filter({hasText:'タイポグラフィ'}).click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/fluent\/typography\//);
 await page.getByRole('link',{name:'次のデザインシステム',exact:true}).click();
 await expect(page).toHaveURL(/\/dads\/$/);await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/dads\/overview\//);
 await page.getByRole('link',{name:'前のデザインシステム',exact:true}).click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/fluent\/overview\//);
 await waitForLayout();
 await page.locator('.view-thumbnail').filter({hasText:'タイポグラフィ'}).click();await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/fluent\/typography\//);await page.keyboard.press('j');
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/dads\/overview\//);
});

for(const [id,entry] of Object.entries(registry).filter(([,s])=>s.status==='ready'))for(const view of entry.views.filter(v=>['table','alerts'].includes(v)))test(`${id}: ${view} uses shared content`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`/specimens/${id}/${view}/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');await expect(page.locator('#specimen-root')).not.toHaveAttribute('data-error','true');
 if(view==='table'){await expect(page.getByText('カタログ',{exact:true}).first()).toBeVisible();await expect(page.getByText('担当者',{exact:true}).first()).toBeVisible();await expect(page.getByText('下書き',{exact:true}).first()).toBeVisible();}
 else for(const [tone,title] of [['info','更新のお知らせ'],['success','保存しました'],['warning','設定を確認してください']]){if(entry.alertTones&&!entry.alertTones.includes(tone))continue;await expect(page.getByText(title,{exact:false}).filter({visible:true}).first()).toBeVisible();}
 expect(errors).toEqual([]);
});
test('static crawler files identify the catalog and preserve image access',async({request})=>{
 const robots=await request.get('/robots.txt');expect(robots.ok()).toBe(true);expect(robots.headers()['content-type']).toContain('text/plain');expect(await robots.text()).toContain('Allow: /specimens/list-thumbnails/');
 const llms=await request.get('/llms.txt');expect(llms.ok()).toBe(true);const text=await llms.text();expect(text).toMatch(/^# Design System Catalog/);expect(text).toContain('/astryx/');expect(text).toContain('repository creation is not treated as a confirmed public launch');
 const sitemap=await request.get('/sitemap.xml');expect(sitemap.ok()).toBe(true);expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(68);
});

test('typing in a shadow-DOM field never navigates the catalog',async({page})=>{
 await page.goto('/porsche/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const input=page.frameLocator('.main-preview iframe').getByRole('textbox').first();await input.pressSequentially('jk?');await expect(page).toHaveURL(/\/porsche\/$/);await expect(page.locator('.help-dialog')).not.toBeVisible();
});

test('thumbnail headings and descriptions identify each system across rendering frameworks',async({page})=>{
 const systems=JSON.parse(readFileSync(new URL('../../src/data/systems.json',import.meta.url)));
 for(const id of ['ant','pajamas','fluent'])for(const language of ['ja','en']){
  const system=systems.find(s=>s.id===id);
  await page.goto(`/specimens/${id}/overview/?thumbnail=1&lang=${language}`);
  await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  await expect(page.getByRole('heading',{name:language==='en'?system.shortNameEn:system.shortName,exact:true})).toBeVisible();
  await expect(page.getByText(system.thumbnailDescription[language],{exact:true})).toBeVisible();
  await expect(page.getByText('プロジェクト設定',{exact:true})).toHaveCount(0);
 }
});

test('H and L switch previews in the page, iframe and zoom while preserving text input',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const preview=page.locator('.main-preview iframe');
 await page.keyboard.press('l');await expect(preview).toHaveAttribute('src',/\/form\//);
 await page.keyboard.press('h');await expect(preview).toHaveAttribute('src',/\/overview\//);
 const frame=page.frameLocator('.main-preview iframe');
 await frame.getByRole('textbox').first().fill('hl');
 await frame.getByRole('textbox').first().press('h');await frame.getByRole('textbox').first().press('l');
 await expect(preview).toHaveAttribute('src',/\/overview\//);
 await frame.getByRole('button',{name:'変更を保存',exact:true}).press('l');await expect(preview).toHaveAttribute('src',/\/form\//);
 await frame.getByRole('button',{name:'変更を保存',exact:true}).first().press('h');await expect(preview).toHaveAttribute('src',/\/overview\//);
 await page.locator('.preview-heading h1').click();await page.keyboard.press('v');
 await expect(page.locator('.zoom-dialog')).toBeVisible();
 await page.keyboard.press('l');await expect(page.locator('.zoom-navigation')).toContainText('2 /');
 await page.keyboard.press('h');await expect(page.locator('.zoom-navigation')).toContainText('1 /');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'日本語',exact:true}).focus();await page.keyboard.press('l');
 await expect(preview).toHaveAttribute('src',/\/overview\//);
 await page.locator('.preview-heading h1').click();await page.keyboard.press('?');
 await expect(page.locator('.keyboard-shortcuts')).toContainText('H');await expect(page.locator('.keyboard-shortcuts')).toContainText('L');
});

test('list categories switch comparison thumbnails and keep resource references distinct',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const categories=page.getByRole('navigation',{name:'一覧のプレビューカテゴリ'});
 await expect(categories.getByRole('button',{name:'ボタン',exact:true})).toHaveCount(0);
 await categories.getByRole('button',{name:'フォーム',exact:true}).click();
 await expect(page.locator('.system-row[href="/ant/"] img')).toHaveAttribute('src',/ant-form.webp/);
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/form\//);
 await categories.getByRole('button',{name:'テーブル',exact:true}).click();
 await expect(page.locator('.system-row[href="/ant/"] img')).toHaveAttribute('src',/ant-table.webp/);
 await expect(page.locator('.system-row[href="/astryx/"] .reference-badge')).toHaveText('全体像を表示');
 await expect(page.locator('.system-row[href="/sansan/"] img')).toHaveAttribute('src',/\/previews\//);
 await page.locator('.system-row[href="/sansan/"]').click();
 await expect(page.locator('.implementation-toolbar')).toContainText('公式サイトのキャプチャ');
 await expect(page.locator('.main-preview img')).toBeVisible();
 await page.keyboard.press('l');await expect(page.locator('.main-preview img')).toHaveAttribute('src',/sansan-0.webp/);
 await page.keyboard.press('v');await expect(page.locator('.zoom-dialog img')).toBeVisible();
 await page.keyboard.press('Escape');
});

test('typography includes genuine paragraph blocks and explicit line breaks in both languages',async({page})=>{
 for(const id of ['govuk','fluent','primer'])for(const language of ['ja','en']){
  await page.goto(`/specimens/${id}/typography/?lang=${language}`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.specimen-prose p')).toHaveCount(3);
  await expect(page.locator('.specimen-prose p br')).toHaveCount(1);
  expect((await page.locator('.specimen-prose p').first().innerText()).length).toBeGreaterThan(100);
 }
});

test('all integrated forms include action kinds and disabled states',async({page})=>{
 for(const id of ['ant','govuk','pajamas','dads','fluent']){
  await page.goto(`/specimens/${id}/form/`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  await expect(page.getByRole('button',{name:'変更を保存',exact:true}).first()).toBeVisible();
  await expect(page.getByRole('button',{name:'キャンセル',exact:true}).first()).toBeVisible();
  await expect(page.getByRole('button',{name:'詳細を見る',exact:true}).first()).toBeVisible();
  await expect(page.getByRole('button',{name:/^無\s*効$/}).first()).toBeDisabled();
 }
});

test('system repository actions appear beside official sites',async({page})=>{
 await page.goto('/dads/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.system-links a',{hasText:'GitHub'})).toHaveAttribute('href','https://github.com/digital-go-jp/design-system-example-components-react');
 await page.goto('/sugao/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.system-links .system-repository')).toHaveCount(0);
});

test('evidence and usage details are expanded on desktop and collapsed on mobile',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 for(const selector of ['.release-details','.license-details'])await expect(page.locator(selector)).toHaveAttribute('open','');
 await page.setViewportSize({width:390,height:844});
 for(const selector of ['.release-details','.license-details'])await expect(page.locator(selector)).not.toHaveAttribute('open','');
});

test('switching systems resets the desktop detail scroll position',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const pane=page.locator('.preview-panel');await pane.evaluate(el=>{el.scrollTop=500});
 await expect.poll(()=>pane.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
 await page.locator('.system-row[href="/fluent/"]').click();
 await expect.poll(()=>pane.evaluate(el=>el.scrollTop)).toBe(0);
 await pane.evaluate(el=>{el.scrollTop=400});await page.keyboard.press('j');
 await expect(page).toHaveURL(/\/dads\/$/);
 await expect.poll(()=>pane.evaluate(el=>el.scrollTop)).toBe(0);
});

test('rich typography provides semantic quotations, lists, definitions and an accessible note link',async({page})=>{
 for(const id of ['govuk','europa','dsfr','fluent','primer'])for(const language of ['ja','en']){
  await page.goto(`/specimens/${id}/typography/?lang=${language}`);await expect(page.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  if(id==='europa')expect((await page.locator('.specimen-heading-group>h1').evaluate(el=>getComputedStyle(el).fontFamily)).toLowerCase()).toContain('arial');
  const rich=page.locator('.specimen-rich-text');
  await expect(rich.locator('blockquote')).toHaveCount(1);await expect(rich.locator('cite')).toContainText(language==='ja'?'サンプル':'Original');
  await expect(rich.locator('ul>li')).toHaveCount(3);await expect(rich.locator('ol>li')).toHaveCount(3);await expect(rich.locator('dl>dt')).toHaveCount(2);
  await expect(rich.locator('strong')).toBeVisible();await expect(rich.locator('em')).toBeVisible();await expect(rich.locator('code')).toHaveText('font-size');
  await rich.getByRole('link').click();await expect(page).toHaveURL(/#specimen-reading-note$/);await expect(rich.locator('#specimen-reading-note')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('home starts unselected, shows the introduction and restores it through history',async({page})=>{
 await page.goto('/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.system-row.selected')).toHaveCount(0);await expect(page.locator('.system-row[aria-current]')).toHaveCount(0);
 await expect(page.locator('.catalog-introduction')).toBeVisible();await expect(page.locator('.main-preview iframe')).toHaveCount(0);
 await expect(page).toHaveTitle('デザインシステムカタログ.akiyan.tokyo');await expect(page.locator('.desktop-site-title')).toHaveText('デザインシステムカタログ.akiyan.tokyo');
 await page.getByRole('navigation',{name:'一覧のプレビューカテゴリ'}).getByRole('button',{name:'フォーム',exact:true}).click();await expect(page.locator('.catalog-introduction')).toBeVisible();
 await page.getByRole('button',{name:'政府・公共 15',exact:true}).click();await expect(page.locator('.catalog-introduction')).toBeVisible();
 await page.locator('.system-row[href="/dads/"]').click();await expect(page.locator('.preview-heading h1')).toBeVisible();
 await expect(page).toHaveTitle(/デジタル庁.*デザインシステムカタログ\.akiyan\.tokyo/);
 await page.goBack();await expect(page.locator('.catalog-introduction')).toBeVisible();await expect(page.locator('.system-row[aria-current]')).toHaveCount(0);
});

test('addition requests link to the issue form in both languages without mobile overflow',async({page})=>{
 await page.goto('/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const link=page.locator('.site-footer .addition-request');await expect(link).toHaveText('追加リクエスト');await expect(link).toHaveAttribute('href','https://github.com/akiyan/design-system-catalog/issues/new?template=add-design-system.yml');
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(link).toHaveText('Suggest a system');
 for(const width of [320,390,900,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(link).toBeVisible();}
});

test('headless libraries use multiple official-site screenshots with source links',async({page})=>{
 for(const id of ['reactaria','ariakit','lion','kobalte','bitsui']){
  await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.main-preview iframe')).toHaveCount(0);await expect(page.locator('.main-preview img')).toHaveAttribute('src',`/previews/${id}-0.webp`);
  await expect(page.locator('.implementation-toolbar')).toContainText('公式サイトのキャプチャ');await expect(page.locator('.reference-notice')).toHaveCount(0);
  await page.locator('.view-thumbnail').nth(1).click();await expect(page.locator('.main-preview img')).toHaveAttribute('src',`/previews/${id}-1.webp`);
  await expect(page.locator('.implementation-meta a')).toHaveAttribute('href',systems.find(s=>s.id===id).views[1].url);
 }
});


test('home comparison examples open the matching specimen and respect the active category',async({page})=>{
 await page.goto('/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.catalog-introduction h1')).toHaveText('デザインシステムを選んで下さい');
 await expect(page.locator('.welcome-stats,.welcome-intro')).toHaveCount(0);
 const links=page.locator('.welcome-comparison a');await expect(links).toHaveCount(6);
 expect(new Set(await links.evaluateAll(elements=>elements.map(el=>el.getAttribute('href')))).size).toBe(6);
 await page.locator('.welcome-comparison[data-view=table] a[href="/carbon/"]').click();
 await expect(page).toHaveURL(/\/carbon\/$/);await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/carbon\/table\//);
 await expect(page.locator('.list-preview-categories button[aria-pressed=true]')).toHaveText('テーブル');
 await page.goBack();await expect(page.locator('.catalog-introduction')).toBeVisible();
 await page.locator('.welcome-comparison[data-view=alerts] a[href="/primer/"]').click();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/primer\/alerts\//);
 await page.goBack();await page.getByRole('button',{name:'政府・公共 15',exact:true}).click();
 const hrefs=await links.evaluateAll(elements=>elements.map(el=>el.getAttribute('href')));
 for(const href of hrefs)await expect(page.locator(`.system-row[href="${href}"]`)).toBeVisible();
 await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.locator('.catalog-introduction h1')).toHaveText('Please select a design system');
 await expect(page.locator('.welcome-comparison h2')).toHaveCount(0);
});


test('embedded previews fit their whole contents and keep wheel browsing in the outer pane',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 for(const id of ['fluent','smarthr','ant']){
  await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
  const frame=page.frameLocator('.main-preview iframe');await expect(frame.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  await expect(frame.locator('.specimen-header')).toHaveCount(0);await expect(page.locator('.implementation-toolbar')).toHaveCount(0);
  const measured=await frame.locator('#specimen-root').evaluate(e=>Math.ceil(Math.max(e.scrollHeight,e.getBoundingClientRect().height)));
  await expect.poll(()=>page.locator('.main-preview iframe').evaluate(e=>e.clientHeight)).toBeGreaterThanOrEqual(measured);
  expect(await frame.locator('html').evaluate(()=>document.scrollingElement.scrollHeight<=innerHeight)).toBe(true);
  const canvas=await page.locator('.main-preview').boundingBox();const enlarge=await page.locator('.implementation-meta .specimen-enlarge').boundingBox();expect(enlarge.y).toBeGreaterThan(canvas.y+canvas.height);
  await page.locator('.main-preview iframe').hover();await page.mouse.wheel(0,240);
  await expect.poll(()=>page.locator('.preview-panel').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
  expect(await frame.locator('html').evaluate(()=>document.scrollingElement.scrollTop)).toBe(0);
 }
 await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await page.getByRole('button',{name:'タイポグラフィ',exact:true}).first().click();
 await page.locator('.implementation-meta .specimen-enlarge').click();
 const zoom=page.frameLocator('.zoom-content iframe');await expect(zoom.locator('#specimen-root')).toHaveAttribute('data-ready','true');
 await expect(zoom.locator('.specimen-rich-text blockquote')).toBeVisible();
 await page.locator('.zoom-content iframe').hover();await page.mouse.wheel(0,300);
 await expect.poll(()=>page.locator('.zoom-content').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
 expect(await zoom.locator('html').evaluate(()=>document.scrollingElement.scrollTop)).toBe(0);
});

test('short bilingual descriptions fit one line at 1080p without truncation',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 for(const system of systems)for(const language of ['ja','en']){
  const fits=await page.locator('.system-description').evaluate((el,text)=>{el.textContent=text;return el.getBoundingClientRect().height<=parseFloat(getComputedStyle(el).lineHeight)+1;},system.description[language]);
  expect(fits,`${system.id} ${language}`).toBe(true);
 }
});


test('Digital Agency overview shows the complete interactive checkbox and bulleted list',async({page})=>{
 for(const width of [1920,1440,900]){
  await page.setViewportSize({width,height:1080});await page.goto('/dads/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
  const frame=page.frameLocator('.main-preview iframe');await expect(frame.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  const checkbox=frame.getByRole('checkbox',{name:'チームに通知する',exact:true});await expect(checkbox).toBeInViewport();await checkbox.uncheck();await expect(checkbox).not.toBeChecked();await checkbox.check();
  await expect(frame.locator('.specimen-overview-list>li')).toHaveCount(3);await expect(frame.locator('.specimen-overview-list')).toHaveCSS('list-style-type','disc');
  expect(await checkbox.evaluate(el=>{const rect=el.getBoundingClientRect();return innerHeight-rect.bottom;})).toBeGreaterThan(16);
  expect(await frame.locator('html').evaluate(()=>document.scrollingElement.scrollHeight<=innerHeight)).toBe(true);
 }
});
