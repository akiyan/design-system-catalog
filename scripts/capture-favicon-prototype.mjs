import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const baseline = process.argv.includes('--before');
const directory = process.env.CAPTURE_DIRECTORY || 'docs/favicon-prototype/revision-2';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, locale: 'ja-JP' });
// Keep local visual checks from generating analytics traffic.
await context.route('**/*', route => /googletagmanager|google-analytics/.test(route.request().url()) ? route.abort() : route.continue());
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const suffix = baseline ? '-before' : '';
const checks = [];
async function ready() {
  await page.waitForFunction(() => document.querySelector('.catalog-app')?.dataset.ready === 'true');
  await page.locator('.row-image img, .site-favicon img').evaluateAll(images => Promise.all(images.filter(image => {
    const rect = image.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }).map(image => { image.loading = 'eager'; return image.decode().catch(() => {}); })));
  await page.evaluate(() => document.fonts.ready);
}
async function capture(name) {
  await ready();
  if (!baseline) {
    checks.push({ name, ...await page.evaluate(() => {
      const icons = [...document.querySelectorAll('.site-favicon')].filter(el => {
        const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight;
      });
      return {
        visibleFavicons: icons.length,
        allLoaded: icons.every(el => el.querySelector('img')?.naturalWidth > 0),
        placementCorrect: icons.every(el => {
          const r = el.getBoundingClientRect();
          const row = el.closest('.system-row');
          const p = row.querySelector('.row-image').getBoundingClientRect();
          const homeGrid = document.querySelector('.catalog-home') && innerWidth > 700;
          if (homeGrid) return el.classList.contains('site-favicon-thumbnail') && r.left >= p.left && r.top >= p.top && r.right <= p.right && r.bottom <= p.bottom && p.right - r.right < 14 && r.top - p.top < 14;
          const title = el.closest('.system-name');
          if (!title) return false;
          const text = title.lastElementChild.getBoundingClientRect();
          const noImageOverlap = r.left >= p.right || r.right <= p.left || r.top >= p.bottom || r.bottom <= p.top;
          return el.classList.contains('site-favicon-name') && r.right <= text.left && noImageOverlap && getComputedStyle(el).position === 'static';
        }),
        noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
      };
    }) });
  }
  await page.screenshot({ path: `${directory}/${name}${suffix}.png` });
}
try {
  await page.goto(origin);
  await capture('home-desktop');
  await page.locator('.system-row[href="/astryx/"]').click();
  await page.waitForURL('**/astryx/');
  await page.locator('.specimen-frame').first().waitFor();
  await page.locator('.specimen-frame').first().contentFrame().locator('#specimen-root button').first().waitFor({ timeout: 60000 });
  await page.locator('.specimen-frame').first().contentFrame().locator('body').evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('.specimen-frame')?.getBoundingClientRect().height > 100);
  await capture('list-desktop');
  await page.goBack();
  await page.waitForURL(`${origin}/`);
  await page.setViewportSize({ width: 390, height: 844 });
  await capture('list-mobile');
  if (!baseline) {
    // Verify a failed favicon disappears without replacing the real specimen image.
    await page.locator('.system-name .site-favicon img').first().evaluate(image => image.dispatchEvent(new Event('error')));
    const first = page.locator('.system-row').first();
    checks.push({ name: 'failure-fallback', hidden: await first.locator('.system-name .site-favicon').count() === 0, specimenKept: await first.locator('.row-image > img').count() === 1 });
  }
  console.log(JSON.stringify({ errors, checks }, null, 2));
  await writeFile(`${directory}/checks${suffix}.json`, JSON.stringify({ errors, checks }, null, 2) + '\n');
  if (errors.length || checks.some(check => check.allLoaded === false || check.placementCorrect === false || check.noHorizontalOverflow === false || check.hidden === false || check.specimenKept === false || check.visibleFavicons === 0)) process.exitCode = 1;
} finally {
  await browser.close();
}
