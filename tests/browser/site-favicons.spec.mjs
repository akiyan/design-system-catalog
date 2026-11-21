import { test, expect } from '@playwright/test';

const ready = async page => expect(page.locator('.catalog-app')).toHaveAttribute('data-ready', 'true');
const firstRow = page => page.locator('.system-row').first();

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager|google-analytics/, route => route.abort());
});

test('desktop home shows a loaded favicon at the thumbnail top-right', async ({ page }) => {
  await page.goto('/'); await ready(page);
  const row = firstRow(page);
  const badge = row.locator('.site-favicon-thumbnail');
  await expect(badge).toBeVisible();
  await expect(row.locator('.site-favicon-name')).toBeHidden();
  await expect.poll(() => badge.locator('img').evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
  const image = await row.locator('.row-image').boundingBox();
  const icon = await badge.boundingBox();
  expect(Math.abs(image.x + image.width - icon.x - icon.width - 8)).toBeLessThan(2);
  expect(Math.abs(icon.y - image.y - 8)).toBeLessThan(2);
  await expect(badge).toHaveAttribute('aria-hidden', 'true');
});

for (const mobile of [false, true]) {
  test(`${mobile ? 'mobile' : 'desktop'} list places the favicon before the name, not over the image`, async ({ page }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(mobile ? '/' : '/astryx/'); await ready(page);
    const row = firstRow(page);
    const badge = row.locator('.site-favicon-name');
    await expect(badge).toBeVisible();
    await expect(row.locator('.site-favicon-thumbnail')).toBeHidden();
    const icon = await badge.boundingBox();
    const image = await row.locator('.row-image').boundingBox();
    const name = await row.locator('.system-name > span').last().boundingBox();
    expect(icon.x + icon.width).toBeLessThanOrEqual(name.x);
    expect(icon.x >= image.x + image.width || icon.y >= image.y + image.height).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('missing or failed favicons do not replace specimen thumbnails or add focus targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/'); await ready(page);
  await expect(page.locator('.system-row[href="/czech/"] .site-favicon')).toHaveCount(0);
  const row = firstRow(page);
  await row.locator('.site-favicon-name img').evaluate(image => image.dispatchEvent(new Event('error')));
  await expect(row.locator('.site-favicon-name')).toHaveCount(0);
  await expect(row.locator('.row-image > img')).toBeVisible();
  await expect(row.locator('.site-favicon a, .site-favicon button, .site-favicon [tabindex]')).toHaveCount(0);
});
