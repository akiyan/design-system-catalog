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
test('catalog renders every live specimen in a scrolling gallery and keeps editable keys',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const frame=page.frameLocator('.main-preview iframe');
 await frame.getByRole('button',{name:'変更を保存',exact:true}).click();await expect(frame.getByRole('status')).toHaveText('変更を保存しました');
 await frame.getByRole('textbox').first().pressSequentially('jk?');await expect(page).toHaveURL(/\/ant\/$/);
 await expect(page.locator('.component-section')).toHaveCount(registry.ant.views.length);
 await page.locator('.component-section[data-view="form"]').scrollIntoViewIfNeeded();
 await expect(page.locator('.component-section[data-view="form"] iframe')).toHaveAttribute('src',/\/ant\/form\//);
 await page.locator('.system-row[href="/fluent/"]').click();await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/fluent\/overview\//);
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.frameLocator('.main-preview iframe').getByRole('button',{name:'Save changes',exact:true}).first()).toBeVisible();
});
test('nonimplemented systems explicitly show resources without fabricated specimens',async({page})=>{
 await page.goto('/sansan/');await expect(page.locator('.implementation-resource')).toBeVisible();await expect(page.locator('.main-preview iframe')).toHaveCount(0);
 await page.goto('/airtable/');await expect(page.locator('.implementation-resource')).toBeVisible();
});

test('next and previous navigation reset the scrolling gallery to its overview',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await page.locator('.component-section[data-view="typography"]').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('.workspace').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
 await page.getByRole('link',{name:'次のデザインシステム',exact:true}).click();await expect(page).toHaveURL(/\/dads\/$/);await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/dads\/overview\//);
 await expect.poll(()=>page.locator('.workspace').evaluate(e=>e.scrollTop)).toBe(0);
 await page.getByRole('link',{name:'前のデザインシステム',exact:true}).click();await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/fluent\/overview\//);
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

test('H and L scroll between specimens without replacing overview thumbnails',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const preview=page.locator('.main-preview iframe');await page.keyboard.press('l');await expect.poll(()=>page.locator('.preview-panel').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
 await expect(preview).toHaveAttribute('src',/\/overview\//);await expect(page.locator('.system-row[href="/ant/"] img')).toHaveAttribute('src',/ant-overview.webp/);
 await page.keyboard.press('h');await page.keyboard.press('v');await expect(page.locator('.zoom-dialog')).toBeVisible();
 await page.keyboard.press('l');await expect(page.locator('.zoom-navigation')).toContainText('2 /');await page.keyboard.press('h');await expect(page.locator('.zoom-navigation')).toContainText('1 /');await page.keyboard.press('Escape');
 const input=page.frameLocator('.main-preview iframe').getByRole('textbox').first();await input.fill('hl');await input.press('h');await input.press('l');await expect(preview).toHaveAttribute('src',/\/overview\//);
});

test('preview category selectors are absent and reference images open directly in zoom',async({page})=>{
 await page.goto('/ant/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await expect(page.locator('.list-preview-categories,.preview-thumbnails')).toHaveCount(0);
 await expect(page.locator('.system-row[href="/ant/"] img')).toHaveAttribute('src',/ant-overview.webp/);
 await page.locator('.system-row[href="/sansan/"]').click();await expect(page.locator('.reference-gallery')).toBeVisible();await expect(page.locator('.main-preview')).toHaveCount(0);
 const images=page.locator('.reference-thumbnail');await images.nth(1).click();await expect(page.locator('.zoom-dialog')).toBeVisible();await expect(page.locator('.zoom-dialog img')).toHaveAttribute('src',/sansan-0.webp/);await page.keyboard.press('Escape');await expect(page.locator('.reference-gallery')).toBeVisible();
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

test('compact system heading keeps the official icon and repository under sources',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 await page.goto('/dads/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const heading=page.locator('.preview-heading');
 await expect(heading.locator('a')).toHaveCount(2);
 await expect(heading.locator('h1 a')).toHaveAttribute('href','https://design.digital.go.jp/dads/');
 await expect(heading.locator('h1 a')).toHaveAttribute('target','_blank');
 await expect(heading.getByRole('link',{name:/公式サイト/})).toHaveAttribute('href','https://design.digital.go.jp/dads/');
 await expect(heading.locator('.official-link')).toHaveText('公式サイト');
 await expect(page.locator('.source-repository')).toHaveAttribute('href','https://github.com/digital-go-jp/design-system-example-components-react');
 const title=await heading.locator('h1').boundingBox(),description=await heading.locator('.system-description').boundingBox();
 expect(description.x).toBeGreaterThan(title.x+title.width);expect(Math.abs(description.y+description.height/2-title.y-title.height/2)).toBeLessThan(3);
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

test('home starts as a full-width grid and restores it through history',async({page})=>{
 await page.goto('/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.system-row.selected')).toHaveCount(0);await expect(page.locator('.system-row[aria-current]')).toHaveCount(0);
 await expect(page.locator('.catalog-app')).toHaveClass(/catalog-home/);await expect(page.locator('.preview-panel')).toBeHidden();await expect(page.locator('.main-preview iframe')).toHaveCount(0);
 await expect(page).toHaveTitle('デザインシステムカタログ');await expect(page.locator('.desktop-site-title')).toHaveText('デザインシステムカタログ');
 await expect(page.locator('.list-preview-categories')).toHaveCount(0);
 await page.getByRole('button',{name:'政府・公共 15',exact:true}).click();await expect(page.locator('.catalog-app')).toHaveClass(/catalog-home/);await expect(page.locator('.preview-panel')).toBeHidden();
 await page.locator('.system-row[href="/dads/"]').click();await expect(page.locator('.preview-heading h1')).toBeVisible();
 await expect(page).toHaveTitle(/デジタル庁.*デザインシステムカタログ/);
 await page.goBack();await expect(page.locator('.catalog-app')).toHaveClass(/catalog-home/);await expect(page.locator('.preview-panel')).toBeHidden();await expect(page.locator('.system-row[aria-current]')).toHaveCount(0);
});

test('addition requests link to the issue form in both languages without mobile overflow',async({page})=>{
 await page.goto('/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 const link=page.locator('.site-footer .addition-request');await expect(link).toHaveText('追加リクエスト');await expect(link).toHaveAttribute('href','https://github.com/akiyan/design-system-catalog/issues/new?template=add-design-system.yml');
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(link).toHaveText('Suggest a system');
 for(const width of [320,390,900,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(link).toBeVisible();}
});

test('headless libraries display a full-width first capture and two-column subsequent captures',async({page})=>{
 for(const id of ['reactaria','ariakit','lion','kobalte','bitsui']){
  await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await expect(page.locator('.main-preview')).toHaveCount(0);
  await expect(page.locator('.reference-thumbnail img').first()).toHaveAttribute('src',`/previews/${id}-0.webp`);await expect(page.locator('.reference-notice')).toHaveCount(0);
  expect(await page.locator('.reference-gallery').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(2);
  const first=await page.locator('.reference-item').first().boundingBox(), second=await page.locator('.reference-item').nth(1).boundingBox();expect(first.width).toBeGreaterThan(second.width*1.9);expect(second.y).toBeGreaterThanOrEqual(first.y+first.height);
  await page.locator('.reference-thumbnail').nth(1).click();await expect(page.locator('.zoom-dialog img')).toHaveAttribute('src',`/previews/${id}-1.webp`);await page.keyboard.press('Escape');
 }
});


test('desktop grid shows every system and opens its overview with a scrolling detail gallery',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 await page.goto('/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
 await expect(page.locator('.catalog-introduction,.welcome-comparison')).toHaveCount(0);
 await expect(page.locator('.system-row')).toHaveCount(systems.length);
 expect(await page.locator('.catalog-list').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(4);
 const cards=await page.locator('.system-row').evaluateAll(els=>els.slice(0,4).map(el=>el.getBoundingClientRect().toJSON()));
 expect(new Set(cards.map(rect=>rect.y)).size).toBe(1);expect(cards[3].right).toBeGreaterThan(1800);
 for(const card of cards)expect(card.height).toBeGreaterThan(220);
 const nextRow=await page.locator('.system-row').nth(4).boundingBox();expect(nextRow.y).toBeGreaterThan(cards[0].bottom);
 await expect(page.locator('.list-preview-categories')).toHaveCount(0);
 const card=page.locator('.system-row[href="/carbon/"]');await card.scrollIntoViewIfNeeded();
 await expect(card.locator('img')).toHaveAttribute('src','/specimens/list-thumbnails/carbon-overview.webp');
 const scroll=await page.locator('.catalog-list').evaluate(el=>el.scrollTop);expect(scroll).toBeGreaterThan(0);
 await card.click();await expect(page).toHaveURL(/\/carbon\/$/);
 await expect(page.locator('.catalog-app')).not.toHaveClass(/catalog-home/);
 await expect(page.locator('.preview-panel')).toBeVisible();
 await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/carbon\/overview\//);
 await expect(page.locator('.system-row[href="/carbon/"]')).toBeInViewport();
 await page.goBack();await expect(page.locator('.catalog-app')).toHaveClass(/catalog-home/);
 await expect.poll(()=>page.locator('.catalog-list').evaluate(el=>el.scrollTop)).toBe(scroll);
 await page.getByRole('button',{name:'政府・公共 15',exact:true}).click();await expect(page.locator('.system-row')).toHaveCount(15);
 await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.locator('.desktop-site-title')).toHaveText('Design System Catalog');
 await expect(page.locator('.preview-panel')).toBeHidden();
 for(const width of [1440,2560]){
 await page.setViewportSize({width,height:1024});
 expect(await page.locator('.catalog-list').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(4);
 expect(await page.locator('html').evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});


test('embedded previews fit their whole contents and keep wheel browsing in the outer pane',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 for(const id of ['fluent','smarthr','ant']){
  await page.goto(`/${id}/`);await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');
  const frame=page.frameLocator('.main-preview iframe');await expect(frame.locator('#specimen-root')).toHaveAttribute('data-ready','true');
  await expect(frame.locator('.specimen-header')).toHaveCount(0);await expect(page.locator('.implementation-toolbar')).toHaveCount(0);
  const measured=await frame.locator('#specimen-root').evaluate(e=>Math.ceil(Math.max(e.scrollHeight,e.getBoundingClientRect().height)));
  await expect.poll(()=>page.locator('.main-preview iframe').evaluate(e=>e.clientHeight)).toBeGreaterThanOrEqual(measured);
  await expect.poll(()=>frame.locator('html').evaluate(()=>document.scrollingElement.scrollHeight<=innerHeight)).toBe(true);
  const canvas=await page.locator('.main-preview').boundingBox();const enlarge=await page.locator('.implementation-meta .specimen-enlarge').first().boundingBox();expect(enlarge.y).toBeGreaterThan(canvas.y+canvas.height);
  await page.locator('.main-preview iframe').hover();await page.mouse.wheel(0,240);
  await expect.poll(()=>page.locator('.preview-panel').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
  expect(await frame.locator('html').evaluate(()=>document.scrollingElement.scrollTop)).toBe(0);
 }
 await page.goto('/fluent/');await expect(page.locator('.catalog-app')).toHaveAttribute('data-ready','true');await page.locator('.component-section[data-view="typography"] .specimen-enlarge').click();
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
  await expect.poll(()=>frame.locator('html').evaluate(()=>document.scrollingElement.scrollHeight<=innerHeight)).toBe(true);
 }
});
