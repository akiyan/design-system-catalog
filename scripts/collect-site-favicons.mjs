import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { isIP } from 'node:net';
import sharp from 'sharp';

// Local research only. Remote HTML is data, never executable instructions.
const root = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = resolve(root, 'src/data/site-favicons.json');
const reportPath = resolve(root, 'docs/research/site-favicon-sources.md');
const systems = JSON.parse(await readFile(resolve(root, 'src/data/systems.json'), 'utf8'));
const checkedAt = new Date().toISOString();
const maxImageBytes = 2 * 1024 * 1024;
const maxPageBytes = 5 * 1024 * 1024;
const timeout = 15000;
const manifest = {};

function publicUrl(value, base) {
  const url = new URL(value, base);
  if (url.protocol !== 'https:' || url.username || url.password || isIP(url.hostname)
      || !url.hostname.includes('.') || /(^|\.)(localhost|local|internal|test|invalid)$/.test(url.hostname)) {
    throw new Error('Only public HTTPS hostnames are accepted');
  }
  url.hash = '';
  return url.href;
}

async function download(value, maxBytes) {
  let url = publicUrl(value);
  const signal = AbortSignal.timeout(timeout);
  for (let redirect = 0; redirect < 6; redirect++) {
    const response = await fetch(url, {
      redirect: 'manual', signal,
      headers: { 'user-agent': 'DesignSystemCatalog-FaviconResearch/1.0', accept: '*/*' },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await response.body?.cancel();
      url = publicUrl(response.headers.get('location'), url);
      continue;
    }
    if (!response.ok) { await response.body?.cancel(); throw new Error(`HTTP ${response.status}`); }
    if (Number(response.headers.get('content-length')) > maxBytes) {
      await response.body?.cancel(); throw new Error('Content-Length exceeds byte limit');
    }
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > maxBytes) { throw new Error('Response exceeds byte limit'); }
      chunks.push(chunk);
    }
    return { bytes: Buffer.concat(chunks), url, contentType: (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase() };
  }
  throw new Error('Too many redirects');
}

function decodeEntities(text) {
  return text.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
    const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const hex = entity[2].toLowerCase() === 'x';
    const code = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  });
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

function declarations(html, pageUrl) {
  // Ignore comments and raw-text elements; never execute site JavaScript.
  const markup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const baseTag = markup.match(/<base\b[^>]*>/i)?.[0];
  let base = pageUrl;
  try { if (baseTag) base = publicUrl(attributes(baseTag).href, pageUrl); } catch { /* Ignore unsafe base. */ }
  const icons = [];
  for (const match of markup.matchAll(/<link\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const attr = attributes(match[0]);
    const rel = (attr.rel || '').toLowerCase().split(/\s+/);
    if (!attr.href || !rel.some(token => ['icon', 'apple-touch-icon', 'apple-touch-icon-precomposed', 'mask-icon'].includes(token))) continue;
    try {
      icons.push({ url: publicUrl(attr.href, base), method: 'html-declaration', rel: attr.rel,
        declaredSizes: attr.sizes || null, declaredType: attr.type || null,
        rank: rel.includes('icon') ? 0 : rel.includes('mask-icon') ? 2 : 1 });
    } catch { /* data: and other non-public URLs are intentionally unsupported. */ }
  }
  return icons.sort((a, b) => a.rank - b.rank).filter((icon, index, list) => list.findIndex(other => other.url === icon.url) === index).slice(0, 12);
}

function checkSvg(bytes) {
  const svg = bytes.toString('utf8');
  // Fail closed on active content, entity expansion, CSS escapes and external references.
  if (!/^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg\b/i.test(svg)
      || /<!DOCTYPE|<!ENTITY|<\?(?!xml\s)|<!\[CDATA\[|\\|@import|@font-face|expression\s*\(/i.test(svg)) throw new Error('Unsafe or unsupported SVG document');
  const allowed = new Set('svg g path rect circle ellipse line polyline polygon defs lineargradient radialgradient stop clippath mask title desc style use symbol'.split(' '));
  for (const match of svg.matchAll(/<\s*([\w:-]+)\b([^>]*)>/g)) {
    if (!allowed.has(match[1].toLowerCase())) throw new Error(`Unsupported SVG element: ${match[1]}`);
    if (/\son[\w:-]+\s*=/i.test(match[2])) throw new Error('SVG event handler rejected');
    for (const [name, value] of Object.entries(attributes(match[2]))) {
      if ((name === 'href' || name.endsWith(':href')) && !/^#[\w:.-]+$/.test(value)) throw new Error('SVG external reference rejected');
    }
  }
  // Every CSS url must reference an internal fragment, including in style elements.
  for (const match of decodeEntities(svg).matchAll(/url\s*\(\s*([^)]*)\)/gi)) {
    if (!/^['"]?#[\w:.-]+['"]?$/.test(match[1].trim())) throw new Error('SVG external CSS reference rejected');
  }
  return svg;
}

export async function inspectImage({ bytes, contentType }) {
  if (!bytes.length || bytes.length > maxImageBytes) throw new Error('Invalid image byte size');
  if (contentType.includes('html') || /^\s*(?:<!doctype\s+html|<html\b)/i.test(bytes.toString('utf8', 0, 512))) throw new Error('HTML is not an image');
  const isIco = bytes.length >= 22 && bytes.readUInt32LE(0) === 0x00010000;
  if (isIco) {
    if (!['image/x-icon', 'image/vnd.microsoft.icon', 'application/octet-stream', 'binary/octet-stream', ''].includes(contentType)) throw new Error(`ICO Content-Type mismatch: ${contentType}`);
    const count = bytes.readUInt16LE(4);
    if (!count || count > 256 || 6 + count * 16 > bytes.length) throw new Error('Invalid ICO directory');
    let width = 0; let height = 0;
    for (let i = 0; i < count; i++) {
      const start = 6 + i * 16;
      const size = bytes.readUInt32LE(start + 8); const offset = bytes.readUInt32LE(start + 12);
      if (offset < 6 + count * 16 || size < 16 || offset + size > bytes.length) throw new Error('Invalid ICO image bounds');
      const image = bytes.subarray(offset, offset + size);
      const w = bytes[start] || 256; const h = bytes[start + 1] || 256;
      if (image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        const meta = await sharp(image).metadata();
        if (meta.width !== w || meta.height !== h) throw new Error('ICO PNG dimension mismatch');
        await sharp(image).stats();
      } else {
        if (image.readUInt32LE(0) < 40 || image.readInt32LE(4) !== w || Math.abs(image.readInt32LE(8)) !== h * 2) throw new Error('Invalid ICO bitmap dimensions');
        const bits = image.readUInt16LE(14);
        const stride = Math.ceil(w * bits / 32) * 4;
        if (![1, 4, 8, 16, 24, 32].includes(bits) || image.length < 40 + stride * h) throw new Error('Truncated ICO bitmap');
      }
      width = Math.max(width, w); height = Math.max(height, h);
    }
    return { ext: 'ico', width, height, validation: 'ICO directory, frame bounds and PNG decode / DIB dimensions' };
  }
  if (!contentType.startsWith('image/')) throw new Error(`Non-image Content-Type: ${contentType || '(missing)'}`);
  const isSvg = contentType === 'image/svg+xml' || /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(bytes.toString('utf8', 0, 512));
  if (isSvg) checkSvg(bytes);
  const image = sharp(bytes, { limitInputPixels: 2048 * 2048, animated: false });
  const meta = await image.metadata();
  if (!meta.width || !meta.height || meta.width > 2048 || meta.height > 2048) throw new Error('Image dimensions outside 1–2048px');
  const ext = { png: 'png', jpeg: 'jpg', webp: 'webp', gif: 'gif', svg: 'svg' }[meta.format];
  if (!ext || (isSvg && ext !== 'svg')) throw new Error('Unsupported image format');
  const types = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' };
  if (contentType !== types[ext] && !(ext === 'png' && contentType === 'image/x-png')) throw new Error(`Image Content-Type mismatch: ${contentType} / ${ext}`);
  await image.stats(); // Decode pixels, not just file extension or response headers.
  return { ext, width: meta.width, height: meta.height, validation: ext === 'svg' ? 'SVG passive-element/internal-reference checks and raster decode' : 'sharp metadata and pixel decode' };
}

async function collect(system) {
  const entry = { src: null, sourceUrl: null, pageUrl: system.url, resolvedPageUrl: null, status: 'missing', checkedAt,
    usage: 'catalog-site-icon; permission-not-verified', attempts: [] };
  let candidates = [];
  try {
    const page = await download(system.url, maxPageBytes);
    entry.resolvedPageUrl = page.url;
    if (!['text/html', 'application/xhtml+xml'].includes(page.contentType)) throw new Error(`Non-HTML page: ${page.contentType}`);
    candidates = declarations(page.bytes.toString('utf8'), page.url);
    entry.declarationCount = candidates.length;
    entry.attempts.push({ url: system.url, kind: 'page', status: 'ok', resolvedUrl: page.url });
  } catch (error) {
    entry.attempts.push({ url: system.url, kind: 'page', status: 'failed', reason: error.message });
  }
  const fallback = new URL('/favicon.ico', entry.resolvedPageUrl || system.url).href;
  if (!candidates.some(candidate => candidate.url === fallback)) candidates.push({ url: fallback, method: 'same-origin-fallback', rel: null });
  for (const candidate of candidates) {
    try {
      const image = await download(candidate.url, maxImageBytes);
      const info = await inspectImage(image);
      const src = `/site-favicons/${system.id}.${info.ext}`;
      await writeFile(resolve(root, `public${src}`), image.bytes);
      Object.assign(entry, { src, sourceUrl: image.url, declaredSourceUrl: candidate.url, status: 'ok', method: candidate.method,
        rel: candidate.rel, contentType: image.contentType, bytes: image.bytes.length, width: info.width, height: info.height, validation: info.validation });
      entry.attempts.push({ url: candidate.url, kind: 'image', status: 'ok', resolvedUrl: image.url });
      break;
    } catch (error) {
      entry.attempts.push({ url: candidate.url, kind: 'image', status: 'failed', reason: error.message });
    }
  }
  manifest[system.id] = entry;
  console.log(`${system.id}: ${entry.status}${entry.src ? ` ${entry.src}` : ''}`);
}

function md(text) { return String(text).replaceAll('|', '\\|').replaceAll('\n', ' '); }
async function main() {
  await mkdir(resolve(root, 'public/site-favicons'), { recursive: true });
  await mkdir(resolve(root, 'docs/research'), { recursive: true });
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < systems.length) await collect(systems[next++]); }));
  const ordered = Object.fromEntries(systems.map(system => [system.id, manifest[system.id]]));
  await writeFile(manifestPath, `${JSON.stringify(ordered, null, 2)}\n`);
  const success = Object.values(ordered).filter(entry => entry.status === 'ok').length;
  const report = [
    '# 公式サイト favicon 出典（ローカル試作）', '',
    `取得確認日時: ${checkedAt}`, '',
    `対象 ${systems.length}件 / 成功 ${success}件 / 欠損 ${systems.length - success}件。`, '',
    '## 方針と制限', '',
    '- 企業ロゴではなく、カタログ登録の公式URLのHTMLで宣言された favicon を優先。rel=icon、apple-touch-icon、mask-iconの順に検査し、失敗・宣言なしでは同originの /favicon.ico を試す。第三者favicon APIは使用しない。',
    '- 登録URLがGitHub/Figma等のホスティングページの場合、そのサイトのfaviconが取得されることがある。DS独自アイコンと同一とは断定しない。',
    '- ローカル表示検証用の複製。取得できたことは商標・著作権・ブランド素材の利用許諾を意味しない。faviconへの変更は企業ロゴの許諾確認を回避するものではない。公開前には各出典の利用条件を別途確認する。',
    '- リダイレクト後URLも記録。外部HTML/JavaScriptは実行しない。各要求15秒、並列6、画像2MiB以下、HTML5MiB以下、画像寸法1–2048px。Content-Typeと実画像のdecodeを確認。ICOは各frame bounds/PNG decodeまたはDIB寸法と必要画素量を検査。',
    '- SVGはスクリプト・イベント・外部href/CSS url・DOCTYPE/ENTITY等を拒否し、受動要素のみ許容した上で画像decode。安全性の完全な保証や許諾監査ではない。',
    '- status=missing は src/sourceUrl=null。HTTPエラー、タイムアウト、画像検証失敗を省略せず下表とmanifestのattemptsに記録。欠損を企業ロゴや推測URLで補わない。', '',
    '再取得: `pnpm exec node scripts/collect-site-favicons.mjs`。既存の同名出力を再生成するため、レビュー済み変更と並行実行しない。',
    '検証: `pnpm exec node --test tests/collect-site-favicons.test.mjs`。pnpmのmachine-local DBが書き込み不可の環境では `XDG_DATA_HOME=/tmp/favicon-pnpm-data XDG_CACHE_HOME=/tmp/favicon-pnpm-cache PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false` をコマンド前に付け、依存関係の自動再インストールを無効化して既存の依存関係を使用した。', '',
    '## 全件出典・結果', '',
    '| ID / system | status | 公式ページ | favicon出典 | ローカル / 検証 | 失敗記録 |',
    '| --- | --- | --- | --- | --- | --- |',
    ...systems.map(system => {
      const entry = ordered[system.id];
      const failures = entry.attempts.filter(attempt => attempt.status === 'failed').map(attempt => `${attempt.kind}: ${attempt.url} — ${attempt.reason}`).join('<br>');
      return `| ${md(system.id)} / ${md(system.name)} | ${entry.status} | [公式](${entry.pageUrl})${entry.resolvedPageUrl && entry.resolvedPageUrl !== entry.pageUrl ? ` → [転送先](${entry.resolvedPageUrl})` : ''} | ${entry.sourceUrl ? `[${entry.method}; ${md(entry.rel || 'implicit')}](${entry.sourceUrl})` : '欠損'} | ${entry.src ? `[${entry.src.split('/').at(-1)}](../../public${entry.src}) ${entry.width}×${entry.height}, ${entry.contentType}, ${entry.bytes} bytes` : 'なし'} | ${md(failures || 'なし')} |`;
    }), '',
  ].join('\n');
  await writeFile(reportPath, report);
  console.log(JSON.stringify({ total: systems.length, success, missing: systems.length - success, manifestPath, reportPath }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
