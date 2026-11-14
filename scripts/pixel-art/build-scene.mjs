import { writeFileSync, mkdirSync } from 'node:fs';
import { buildScene, floorPixel, FLOOR_TILE, SLOTS, slotLit, SLOT_LED, BAR, BURST, LED, W, H, WALL_H } from './scene.mjs';
import { toPaths, pathsSvg, Grid } from './lib.mjs';
import { SPARKLES, PAL } from './art.mjs';

mkdirSync(process.env.PIXEL_OUT || '/tmp/pixel-work/out', { recursive: true });
const base = buildScene();

// Pixels identical to the floor pattern are left to the <pattern>.
function masked(g) {
  const m = new Grid(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = g.get(x, y);
    if (y >= WALL_H && c === floorPixel(x, y)) continue;
    m.set(x, y, c);
  }
  return m;
}
const tileGrid = new Grid(16, 16); tileGrid.stamp(0, 0, FLOOR_TILE);
export const FLOOR_PATTERN = pathsSvg(toPaths(tileGrid));
function sceneSvg(g, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">${title ? `<title>${title}</title>` : ''}<defs><pattern id="cd-floor" patternUnits="userSpaceOnUse" x="0" y="${WALL_H}" width="16" height="16">${FLOOR_PATTERN}</pattern></defs><rect x="0" y="${WALL_H}" width="${W}" height="${H - WALL_H}" fill="url(#cd-floor)"/>${pathsSvg(toPaths(masked(g)))}</svg>\n`;
}
writeFileSync('/tmp/pixel-work/out/clinic-base.svg', sceneSvg(base));

const full = new Grid(W, H);
full.px = base.px.map(r => r.slice());
SLOTS.forEach((s, i) => { for (const [c, x, y, w, h] of slotLit(s)) full.rect(x, y, w, h, c); const [c, x, y] = SLOT_LED(i); full.set(x, y, c); });
full.rect(BAR.x, BAR.y, BAR.w, BAR.h, 'm');
full.rect(LED.x, LED.y, 2, 1, 'm');
for (const b of [BURST[0], BURST[1], BURST[2]]) full.stamp(b.x, b.y, SPARKLES[3], 'sp');
writeFileSync('/tmp/pixel-work/out/clinic-scene.svg', sceneSvg(full, 'The Card Doc clinic'));
console.log('ok');
