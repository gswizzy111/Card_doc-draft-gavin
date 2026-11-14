// Build every non-scene sprite to /tmp/pixel-work/out/*.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import * as A from './art.mjs';
import { fromArt, fromLayers, checkArt, svgDoc, Grid, parse } from './lib.mjs';

const OUT = process.env.PIXEL_OUT || '/tmp/pixel-work/out';
mkdirSync(OUT, { recursive: true });
export const built = {};
function save(name, g) { built[name] = g; writeFileSync(`${OUT}/${name}.svg`, svgDoc(g)); }

checkArt('doc', A.DOC_BODY, 24, 32);
function docFrame(dy) {
  const g = new Grid(24, 32);
  g.stamp(0, 0, A.DOC_BODY, 'doc');
  g.stamp(15, 17, A.DOC_CARD, 'card');
  g.stamp(13, 23, A.DOC_HAND, 'hand');
  if (!dy) return g;
  // bob: everything above row 26 drops 1px (row 25 is swallowed), legs stay
  const b = new Grid(24, 32);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 24; x++) {
    const src = y === 0 ? null : (y <= 25 ? g.get(x, y - 1) : g.get(x, y));
    b.set(x, y, y === 0 ? null : src);
  }
  return b;
}
const docA = docFrame(0), docB = docFrame(1);
save('doc-a', docA); save('doc-b', docB);

for (const [n, spec] of Object.entries({ 'card-healed': A.CARD_HEALED, 'card-hurt': A.CARD_HURT, 'card-sleeve': A.CARD_SLEEVE, 'card-slab': A.CARD_SLAB })) {
  spec.layers.forEach((L, i) => { const r = parse(L.art); const w = Math.max(...r.map(x => x.length)); r.forEach((row, j) => { if (row.length !== w) console.warn(`${n} layer ${i} row ${j}: ${row.length} vs ${w}`); }); });
  save(n, fromLayers(spec, n));
}
for (const [n, art] of Object.entries(A.ICONS)) { checkArt(`icon ${n}`, art, 16, 16); save(`icon-${n}`, fromArt(art, n)); }
A.SPARKLES.forEach((art, i) => { checkArt(`sparkle ${i}`, art, 12, 12); save(`sparkle-${i}`, fromArt(art, 'sparkle')); });
checkArt('tile', A.TILE_FLOOR, 16, 16); save('tile-floor', fromArt(A.TILE_FLOOR));
checkArt('trim', A.WALL_TRIM, 16, 12); save('wall-trim', fromArt(A.WALL_TRIM));
checkArt('frame', A.FRAME, 12, 12); save('frame', fromArt(A.FRAME));
