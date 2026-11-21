import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import sharp from 'sharp';
import { inspectImage } from '../scripts/collect-site-favicons.mjs';

const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="blue"/></svg>';
const png = await sharp({ create: { width: 32, height: 32, channels: 4, background: '#123456' } }).png().toBuffer();

test('accepts decoded PNG and passive self-contained SVG', async () => {
  assert.equal((await inspectImage({ bytes: png, contentType: 'image/png' })).width, 32);
  assert.equal((await inspectImage({ bytes: Buffer.from(svg), contentType: 'image/svg+xml' })).ext, 'svg');
});

test('rejects HTML, mismatched MIME types and oversized dimensions', async () => {
  await assert.rejects(inspectImage({ bytes: Buffer.from('<html>not image</html>'), contentType: 'image/png' }));
  await assert.rejects(inspectImage({ bytes: png, contentType: 'text/html' }));
  await assert.rejects(inspectImage({ bytes: png, contentType: 'image/jpeg' }));
  const wide = await sharp({ create: { width: 2049, height: 1, channels: 4, background: '#fff' } }).png().toBuffer();
  await assert.rejects(inspectImage({ bytes: wide, contentType: 'image/png' }));
});

test('rejects SVG scripts, event handlers, external resources and entities', async () => {
  const unsafe = [
    svg.replace('<rect', '<script>alert(1)</script><rect'),
    svg.replace('<rect', '<image href="https://example.com/image.png"/><rect'),
    svg.replace('<rect', '<rect onclick="alert(1)"'),
    svg.replace('fill="blue"', 'fill="url(https://example.com/a.svg)"'),
    svg.replace('<rect', '<use href="https://example.com/a.svg#id"/><rect'),
    `<!DOCTYPE svg [<!ENTITY x "unsafe">]>${svg}`,
    `<?xml-stylesheet href="https://example.com/style.css"?>${svg}`,
  ];
  for (const value of unsafe) await assert.rejects(inspectImage({ bytes: Buffer.from(value), contentType: 'image/svg+xml' }));
});

test('validates ICO frame bounds and embedded PNG pixels', async () => {
  const ico = Buffer.alloc(22 + png.length);
  ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
  ico[6] = 32; ico[7] = 32;
  ico.writeUInt32LE(png.length, 14); ico.writeUInt32LE(22, 18); png.copy(ico, 22);
  assert.equal((await inspectImage({ bytes: ico, contentType: 'image/x-icon' })).ext, 'ico');
  const truncated = Buffer.from(ico);
  truncated.writeUInt32LE(png.length + 10, 14);
  await assert.rejects(inspectImage({ bytes: truncated, contentType: 'image/x-icon' }));
});

test('manifest covers every catalog ID and local images match recorded validation', async () => {
  const systems = JSON.parse(await readFile(new URL('../src/data/systems.json', import.meta.url), 'utf8'));
  const manifest = JSON.parse(await readFile(new URL('../src/data/site-favicons.json', import.meta.url), 'utf8'));
  const files = await readdir(new URL('../public/site-favicons/', import.meta.url));
  assert.deepEqual(Object.keys(manifest).sort(), systems.map(system => system.id).sort());
  for (const system of systems) {
    const entry = manifest[system.id];
    assert.equal(entry.pageUrl, system.url);
    assert.ok(entry.attempts.length > 0);
    if (entry.status === 'missing') {
      assert.equal(entry.src, null); assert.equal(entry.sourceUrl, null);
      assert.ok(entry.attempts.some(attempt => attempt.status === 'failed'));
      continue;
    }
    assert.equal(entry.status, 'ok');
    assert.match(entry.src, new RegExp(`^/site-favicons/${system.id}\\.(ico|png|svg|jpg|gif|webp)$`));
    assert.ok(files.includes(entry.src.split('/').at(-1)));
    const bytes = await readFile(new URL(`../public${entry.src}`, import.meta.url));
    assert.equal(bytes.length, entry.bytes);
    const info = await inspectImage({ bytes, contentType: entry.contentType });
    assert.equal(info.width, entry.width); assert.equal(info.height, entry.height);
    assert.match(entry.sourceUrl, /^https:\/\//);
  }
});
