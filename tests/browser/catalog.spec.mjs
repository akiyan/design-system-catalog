import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const systems=JSON.parse(readFileSync(new URL('../../src/data/systems.json',import.meta.url)));
const specimens=JSON.parse(readFileSync(new URL('../../src/data/specimens.json',import.meta.url)));
const publicCount=systems.filter(s=>s.category==='public').length;
const ossCount=systems.length-publicCount;
const oldest=[...systems].sort((a,b)=>a.published.date.localeCompare(b.published.date))[0];

test.use({ locale: 'ja-JP' });
const ready = async page => expect(page.locator('.catalog-app')).toHaveAttribute('data-ready', 'true');
const active = page => page.locator('.system-row[aria-current="page"]');

test('featured catalog, chronological remainder, categories and date evidence', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/'); await ready(page);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.locator('.system-row')).toHaveCount(systems.length);
  await expect(page.locator('.system-row').first()).toContainText('Astryx');
  await expect(page.locator('.system-row[data-featured="true"]')).toHaveCount(5);
  const dates = await page.locator('.system-row[data-featured="false"] .release-line time').allTextContents();
  expect(dates).toEqual([...dates].sort((a,b) => b.localeCompare(a)));
  await page.locator('.system-row').filter({hasText:'Astryx'}).click();
  await expect(page.locator('.release-info')).toContainText('2026-06-18');
  await expect(page.getByRole('link', {name:'公開日の根拠',exact:true})).toHaveAttribute('href', 'https://astryx.atmeta.com/blog/introducing-astryx');
  await page.getByRole('button', {name:`政府・公共 ${publicCount}`,exact:true}).click();
  await expect(page.locator('.system-row')).toHaveCount(publicCount);
  await expect(active(page)).toContainText('デジタル庁');
  await page.getByRole('button', {name:`企業・OSS ${ossCount}`,exact:true}).click();
  await expect(page.locator('.system-row')).toHaveCount(ossCount);
  await expect(active(page)).toContainText('Astryx');
  await page.locator('.system-row').filter({hasText:'Gestalt'}).click();
  await expect(page.locator('.release-info .date-reference')).toHaveText('参考');
  await expect(page.locator('.release-details')).toContainText('リポジトリ作成日と一般公開日は一致しない');
  await expect(page.locator('.github-link')).toHaveAttribute('href','https://github.com/akiyan/design-system-catalog');
  await expect(page.locator('footer')).toContainText('Copyright © 2026 @akiyan');
  expect(errors).toEqual([]);
});

test('selection uses paths, survives reload, and restores Back/Forward', async ({page}) => {
  await page.goto('/'); await ready(page);
  await page.locator('.system-row').filter({hasText:'Cloudscape'}).click();
  await expect(page).toHaveURL(/\/cloudscape\/$/);
  await page.locator('.system-row').filter({hasText:'GOV.UK'}).click();
  await expect(page).toHaveURL(/\/govuk\/$/);
  await page.goBack(); await expect(active(page)).toContainText('Cloudscape');
  await page.goForward(); await expect(active(page)).toContainText('GOV.UK');
  await page.reload(); await ready(page);
  await expect(page.locator('.preview-heading h1')).toContainText('GOV.UK');
  expect(new URL(page.url()).search).toBe('');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/govuk\/$/);
});

test('all catalog direct paths serve the selected system as static HTML', async ({request}) => {
  for (const system of systems) {
    const response = await request.get(`/${system.id}/`);
    expect(response.ok(),system.id).toBe(true);
    const html = await response.text();
    expect(html,system.id).toContain(`<h1>${system.shortName}</h1>`);
    expect(html).toContain(`href="/${system.id}/"`);
    expect(html).not.toContain('server:defer');
  }
});

test('paths also work without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false,locale:'ja-JP'});
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/dads/`);
  await expect(page.locator('.preview-heading h1')).toContainText('デジタル庁');
  await page.locator('.system-row').filter({hasText:'Astryx'}).click();
  await expect(page).toHaveURL(/\/astryx\/$/);
  await expect(page.locator('.preview-heading h1')).toHaveText('Astryx');
  await context.close();
});

test('automatic language detection follows browser preference', async ({browser}) => {
  for (const [locale,expected,label] of [['en-US','en','Design System Catalog'],['ja-JP','ja','デザインシステムカタログ'],['fr-FR','en','Design System Catalog']]) {
    const context=await browser.newContext({locale}); const page=await context.newPage();
    await page.goto(test.info().project.use.baseURL); await ready(page);
    await expect(page.locator('html')).toHaveAttribute('lang',expected);
    await expect(page.locator('.desktop-site-title')).toHaveText(label);
    await context.close();
  }
});

test('manual language selection persists, translates metadata/help, and switches back to Japanese', async ({page}) => {
  await page.goto('/dads/'); await ready(page);
  await page.getByRole('button',{name:'English',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('.preview-heading h1')).toHaveText('Digital Agency Design System (DADS)');
  await expect(page.locator('.source-meta')).toContainText('Japan');
  await page.getByRole('button',{name:'Keyboard shortcuts',exact:true}).focus();
  await page.keyboard.press('?');
  await expect(page.getByRole('dialog',{name:'Keyboard shortcuts'})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload(); await ready(page);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('button',{name:'English',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'日本語',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
});

test('keyboard selection, boundaries, screenshot switching, zoom and help focus', async ({page}) => {
  await page.goto('/'); await ready(page);
  await expect(active(page)).toHaveCount(0);
  await page.keyboard.press('j');await expect(active(page)).toContainText('Astryx');
  await page.keyboard.press('j');
  await expect(active(page)).toContainText('Microsoft Fluent 2');
  await expect(page).toHaveURL(/\/fluent\/$/);
  await expect(active(page)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(active(page)).toContainText('Astryx');
  await page.keyboard.press('End'); await expect(active(page)).toContainText(oldest.shortName);
  await page.keyboard.press('Home'); await expect(active(page)).toContainText('Astryx');
  await page.goto('/astryx/'); await ready(page);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.main-preview iframe')).toHaveAttribute('src',/\/specimens\/astryx\/form\/\?lang=ja(?:&|$)/);
  await page.keyboard.press('v'); await expect(page.locator('.zoom-dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight'); await expect(page.locator('.zoom-navigation')).toContainText(`3 / ${specimens.astryx.views.length}`);
  await page.keyboard.press('Escape'); await expect(page.locator('.zoom-dialog')).not.toBeVisible();
  const help=page.getByRole('button',{name:'キーボード操作',exact:true}); await help.focus();
  await page.keyboard.press('?'); await expect(page.locator('.help-dialog')).toBeVisible();
  const close=page.getByRole('button',{name:'ヘルプを閉じる'});
  await expect(close).toBeFocused(); await page.keyboard.press('Tab'); await expect(close).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.locator('.help-dialog')).not.toBeVisible(); await expect(help).toBeFocused();
  const language=page.getByRole('button',{name:'日本語',exact:true}); await language.focus();
  await page.keyboard.press('?'); await expect(page.locator('.help-dialog')).not.toBeVisible();
  await expect(active(page)).toContainText('Astryx');
});

test('keyboard O opens the official site', async ({page,context}) => {
  await context.route('https://astryx.atmeta.com/',route=>route.fulfill({body:'Official site test',contentType:'text/html'}));
  await page.goto('/astryx/'); await ready(page);
  const popup=page.waitForEvent('popup'); await page.keyboard.press('o');
  const opened=await popup; await opened.waitForLoadState();
  expect(opened.url()).toBe('https://astryx.atmeta.com/'); await opened.close();
});

test('all images load and desktop has no horizontal overflow', async ({page}) => {
  await page.goto('/'); await ready(page);
  await expect(page.locator('.system-row')).toHaveCount(systems.length);
  for (const row of await page.locator('.system-row').all()) {
    await row.scrollIntoViewIfNeeded();
    if(await row.locator('img').count())await expect.poll(()=>row.locator('img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
    else await expect(row.locator('.implementation-unavailable')).toBeVisible();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('mobile path opens the detail, list navigation and footer remain usable', async ({page}) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/dads/'); await ready(page);
  await expect(page.locator('.preview-panel')).toBeVisible();
  await expect(page.locator('.catalog-list')).not.toBeVisible();
  await page.getByRole('button',{name:'一覧に戻る'}).click();
  await expect(page.locator('.catalog-list')).toBeVisible();
  await page.locator('.system-row').filter({hasText:'Astryx'}).click();
  await expect(page).toHaveURL(/\/astryx\/$/); await expect(page.locator('.preview-panel')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.locator('.catalog-list')).toBeVisible();
  await expect(page.locator('.github-link')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('release metadata states precision and identifies every evidence source', async () => {
  expect(systems.find(s=>s.id==='astryx').published.date).toBe('2026-06-18');
  for (const entry of systems) {
    expect(entry.published.sourceUrl).toMatch(/^https:\/\//);
    expect(entry.published.note.ja).toMatch(/\S/);
    expect(entry.published.note.en).toMatch(/\S/);
    const lengths={year:4,month:7,day:10};
    expect(entry.published.date.length).toBe(lengths[entry.published.precision]);
    if(entry.published.basis==='repository-created') expect(entry.published.estimated).toBe(true);
  }
});


test('requested additions have source previews, dates, and separate Semi/Arco entries', async ({page,request}) => {
  const ids=['sansan','charcoal','serendie','sugao','vibes','vitals','pajamas','paste','wise','semi','arco','spectrum','carbon','fluent','baseweb','polaris','spindle','smarthr','ikyu','francfranc','porsche','audi','coinbase','tdesign','ant','kumo','patternfly','primer'];
  expect(new Set(systems.map(s=>s.id)).size).toBe(67);
  for(const id of ids) {
    const entry=systems.find(s=>s.id===id);
    expect(entry,id).toBeTruthy();
    expect(entry.category).toBe('oss');
    for(let i=0;i<entry.views.length;i++) {
      const response=await request.get(`/previews/${id}-${i}.webp`);
      expect(response.ok(),`${id}-${i}`).toBe(true);
      expect(response.headers()['content-type']).toContain('image/');
    }
  }
  expect(systems.some(s=>['adele','openui','designsystemsrepo'].includes(s.id))).toBe(false);
  await page.goto('/vibes/'); await ready(page);
  await expect(page.locator('.release-info')).toContainText('2023-12-19');
  await expect(page.locator('.github-link')).toHaveAttribute('href','https://github.com/akiyan/design-system-catalog');
});

test('mobile list has no selected state and detail buttons browse the active category', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/'); await ready(page);
  await expect(page.locator('.system-row.selected, .system-row[aria-current]')).toHaveCount(0);
  await page.getByRole('button',{name:`政府・公共 ${publicCount}`,exact:true}).click();
  await page.locator('.system-row').first().click();
  await expect(page.getByRole('button',{name:'前のデザインシステム',exact:true})).toBeDisabled();
  await expect(page.locator('.system-position')).toHaveText(`1 / ${publicCount}`);
  await page.getByRole('link',{name:'次のデザインシステム',exact:true}).click();
  await expect(page).toHaveURL(/\/canada\/$/);
  await expect(page.locator('.system-position')).toHaveText(`2 / ${publicCount}`);
  await page.getByRole('link',{name:'前のデザインシステム',exact:true}).click();
  await expect(page).toHaveURL(/\/dads\/$/);
  await page.getByRole('button',{name:'English',exact:true}).click();
  await page.setViewportSize({width:320,height:740});
  await expect(page.getByRole('link',{name:'Next design system',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Back to list',exact:true}).click();
  await expect(page.locator('.system-row.selected, .system-row[aria-current]')).toHaveCount(0);
});

test('touch swipes browse systems without opening zoom, vertical gestures and taps stay distinct', async ({browser}) => {
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ja-JP'});
  const page=await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/astryx/`); await ready(page);
  const client=await context.newCDPSession(page);
  async function swipe(dx,dy=0) {
    await expect(page.frameLocator('.main-preview iframe').locator('#specimen-root')).toHaveAttribute('data-ready','true');
    await page.locator('.main-preview').scrollIntoViewIfNeeded();
    const box=await page.locator('.main-preview iframe').boundingBox();
    const x=box.x+box.width/2,y=box.y+30;
    await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let i=1;i<=5;i++) await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/5,y:y+dy*i/5}]});
    await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }
  await swipe(-100);
  await expect(page).toHaveURL(/\/fluent\/$/);
  await expect(page.locator('.zoom-dialog')).not.toBeVisible();
  await swipe(100);
  await expect(page).toHaveURL(/\/astryx\/$/);
  await swipe(100); // First item remains at the boundary.
  await expect(page).toHaveURL(/\/astryx\/$/);
  await swipe(10,-90);
  await expect(page).toHaveURL(/\/astryx\/$/);
  await page.waitForTimeout(550);
  await page.getByRole('button',{name:'拡大表示',exact:true}).click();
  await expect(page.locator('.zoom-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto(`${test.info().project.use.baseURL}/${oldest.id}/`); await ready(page);
  await expect(page.getByRole('button',{name:'次のデザインシステム',exact:true})).toBeDisabled();
  await swipe(-100);
  await expect(page).toHaveURL(new RegExp(`/${oldest.id}/$`));
  await context.close();
});

test('mobile details start at top and returning restores the list scroll offset', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/'); await ready(page);
  const row=page.locator('.system-row').filter({hasText:'GOV.UK'});
  await row.scrollIntoViewIfNeeded();
  const before=await page.locator('.workspace').evaluate(e=>e.scrollTop);
  expect(before).toBeGreaterThan(100);
  await row.click();
  await expect(page).toHaveURL(/\/govuk\/$/);
  await expect.poll(()=>page.locator('.workspace').evaluate(e=>e.scrollTop)).toBe(0);
  await expect(page.getByRole('button',{name:'一覧に戻る',exact:true})).toBeInViewport();
  await page.getByRole('button',{name:'一覧に戻る',exact:true}).click();
  await expect.poll(()=>page.locator('.workspace').evaluate(e=>e.scrollTop)).toBe(before);
  await row.click();
  await expect.poll(()=>page.locator('.workspace').evaluate(e=>e.scrollTop)).toBe(0);
});


test('every system has a bilingual feature description and official source', async ({page}) => {
  for(const system of systems) {
    expect(system.description.ja,system.id).toMatch(/\S/);
    expect(system.description.en,system.id).toMatch(/\S/);
    expect(system.descriptionSourceUrl,system.id).toMatch(/^https:\/\//);
  }
  await page.goto('/cloudscape/'); await ready(page);
  const description=page.locator('.system-description');
  await expect(description).toHaveText(systems.find(s=>s.id==='cloudscape').description.ja);
  await page.getByRole('button',{name:'English',exact:true}).click();
  await expect(description).toHaveText(systems.find(s=>s.id==='cloudscape').description.en);
  await page.goto('/reactaria/'); await ready(page);
  await expect(description).toHaveText(systems.find(s=>s.id==='reactaria').description.en);
});


test('five featured entries lead each matching category without duplicates', async ({page}) => {
  await page.goto('/'); await ready(page);
  const links=await page.locator('.system-row').evaluateAll(rows=>rows.map(row=>row.getAttribute('href')));
  expect(links.slice(0,5)).toEqual(['/astryx/','/fluent/','/dads/','/ant/','/primer/']);
  expect(new Set(links).size).toBe(systems.length);
  const featuredDates=await page.locator('.system-row[data-featured="true"] time').allTextContents();expect(featuredDates).toEqual([...featuredDates].sort((a,b)=>b.localeCompare(a)));
  await expect(page.getByText('GitHubスター数を参考に選定',{exact:true})).toHaveCount(0);
  await expect(page.locator('.system-row[href="/reactaria/"]')).toHaveAttribute('data-featured','false');
  await expect(page.getByRole('heading',{name:'注目の5件',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'公開日が新しい順',exact:true})).toHaveCount(1);
  await page.getByRole('button',{name:`政府・公共 ${publicCount}`,exact:true}).click();
  await expect(page.getByRole('heading',{name:'注目のシステム',exact:true})).toBeVisible();
  await expect(page.locator('.system-row[data-featured="true"]')).toHaveCount(1);
  await expect(page.locator('.system-row[data-featured="true"]')).toContainText('デジタル庁');
  await page.getByRole('button',{name:`企業・OSS ${ossCount}`,exact:true}).click();
  await expect(page.locator('.system-row').first()).toContainText('Astryx');
  await page.getByRole('button',{name:'English',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Featured systems',exact:true})).toBeVisible();
});
