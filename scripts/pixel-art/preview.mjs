// usage: node preview.mjs <out.png> <scale> <svgfile...>  (or a dir glob list)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');

const [out, scaleArg, ...files] = process.argv.slice(2);
const scale = Number(scaleArg);
const items = files.map(f => {
  const svg = readFileSync(f, 'utf8');
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const w = +m[1], h = +m[2];
  const uri = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  return { name: f.split('/').pop().replace('.svg', ''), w, h, uri };
});
const html = `<html><body style="margin:0;padding:16px;background:#F3EAC8;font:12px monospace;color:#3B3040;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end">
${items.map(i => `<figure style="margin:0;text-align:center"><img src="${i.uri}" width="${i.w * scale}" height="${i.h * scale}" style="image-rendering:pixelated;display:block"><figcaption>${i.name}</figcaption></figure>`).join('')}
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(process.env.VW || 1400), height: 400 } });
await page.setContent(html);
await page.waitForTimeout(200);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
