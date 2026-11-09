import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const systems=JSON.parse(readFileSync(new URL('../../src/data/systems.json',import.meta.url)));

test.use({ locale: 'ja-JP' });
const ready = async page => expect(page.locator('.catalog-app')).toHaveAttribute('data-ready', 'true');
const active = page => page.locator('.system-row[aria-current="page"]');

test('newest-first catalog, categories, date evidence, and repository link', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/'); await ready(page);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.locator('.system-row')).toHaveCount(15);
  await expect(page.locator('.system-row').first()).toContainText('Astryx');
  const dates = await page.locator('.release-line time').allTextContents();
  expect(dates).toEqual([...dates].sort((a,b) => b.localeCompare(a)));
  await expect(page.locator('.release-info')).toContainText('2026-06-18');
  await page.locator('.release-details summary').click();
  await expect(page.getByRole('link', {name:'公開日の根拠',exact:true})).toHaveAttribute('href', 'https://astryx.atmeta.com/blog/introducing-astryx');
  await page.getByRole('button', {name:'政府・公共 12',exact:true}).click();
  await expect(page.locator('.system-row')).toHaveCount(12);
  await expect(active(page)).toContainText('GC Design System');
  await page.getByRole('button', {name:'企業・OSS 3',exact:true}).click();
  await expect(page.locator('.system-row')).toHaveCount(3);
  await expect(active(page)).toContainText('Astryx');
  await page.locator('.system-row').filter({hasText:'Gestalt'}).click();
  await expect(page.locator('.release-info .date-reference')).toHaveText('参考');
  await page.locator('.release-details summary').click();
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

test('all 15 direct paths serve the selected system as static HTML', async ({request}) => {
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
    await expect(page.locator('.site-title')).toHaveText(label);
    await context.close();
  }
});

test('manual language selection persists, translates metadata/help, and returns to auto', async ({page}) => {
  await page.goto('/dads/'); await ready(page);
  await page.getByRole('combobox').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('.preview-heading h1')).toHaveText('Digital Agency Design System (DADS)');
  await expect(page.locator('.source-meta')).toContainText('Japan');
  await page.keyboard.press('?');
  await expect(page.getByRole('dialog',{name:'Keyboard shortcuts'})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload(); await ready(page);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('combobox')).toHaveValue('en');
  await page.getByRole('combobox').selectOption('auto');
  await expect(page.locator('html')).toHaveAttribute('lang','ja');
});

test('keyboard selection, boundaries, screenshot switching, zoom and help focus', async ({page}) => {
  await page.goto('/'); await ready(page);
  await page.keyboard.press('j');
  await expect(active(page)).toContainText('GC Design System');
  await expect(page).toHaveURL(/\/canada\/$/);
  await expect(active(page)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(active(page)).toContainText('Astryx');
  await page.keyboard.press('End'); await expect(active(page)).toContainText('Bristol');
  await page.keyboard.press('Home'); await expect(active(page)).toContainText('Astryx');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.main-preview img')).toHaveAttribute('src','/previews/astryx-1.webp');
  await page.keyboard.press('v'); await expect(page.locator('.zoom-dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight'); await expect(page.locator('.zoom-navigation')).toContainText('3 / 3');
  await page.keyboard.press('Escape'); await expect(page.locator('.zoom-dialog')).not.toBeVisible();
  const help=page.getByRole('button',{name:'キーボード操作',exact:true}); await help.focus();
  await page.keyboard.press('?'); await expect(page.locator('.help-dialog')).toBeVisible();
  const close=page.getByRole('button',{name:'ヘルプを閉じる'});
  await expect(close).toBeFocused(); await page.keyboard.press('Tab'); await expect(close).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.locator('.help-dialog')).not.toBeVisible(); await expect(help).toBeFocused();
  const language=page.getByRole('combobox'); await language.focus();
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
  await expect(page.locator('.system-row')).toHaveCount(15);
  for (const row of await page.locator('.system-row').all()) {
    await row.scrollIntoViewIfNeeded();
    await expect.poll(()=>row.locator('img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
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
