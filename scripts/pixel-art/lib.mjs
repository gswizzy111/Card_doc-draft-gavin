import { PAL } from './art.mjs';

export function parse(art) {
  const rows = art.replace(/^\n/, '').replace(/\n$/, '').split('\n');
  return rows;
}

export class Grid {
  constructor(w, h, fill = null) {
    this.w = w; this.h = h;
    this.px = Array.from({ length: h }, () => Array(w).fill(fill));
  }
  set(x, y, c) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[y][x] = c;
  }
  get(x, y) { return this.px[y]?.[x] ?? null; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); }
  hline(x, y, w, c) { this.rect(x, y, w, 1, c); }
  vline(x, y, h, c) { this.rect(x, y, 1, h, c); }
  // filled box with ink outline and optional rounded corners
  box(x, y, w, h, fill, ink = 'k', round = true) {
    this.rect(x, y, w, h, ink);
    this.rect(x + 1, y + 1, w - 2, h - 2, fill);
    if (round) { this.set(x, y, null); this.set(x + w - 1, y, null); this.set(x, y + h - 1, null); this.set(x + w - 1, y + h - 1, null); }
  }
  stamp(x, y, art, name = '') {
    const rows = typeof art === 'string' ? parse(art) : art;
    rows.forEach((row, j) => {
      [...row].forEach((ch, i) => {
        if (ch === '.') return;
        if (ch === '_') { this.set(x + i, y + j, null); return; }
        if (!PAL[ch]) throw new Error(`unknown color ${ch} in ${name}`);
        this.set(x + i, y + j, ch);
      });
    });
  }
}

export function checkArt(name, art, w, h) {
  const rows = parse(art);
  const bad = [];
  if (h && rows.length !== h) bad.push(`${name}: ${rows.length} rows, want ${h}`);
  rows.forEach((r, i) => { if (w && r.length !== w) bad.push(`${name} row ${i}: ${r.length} cols, want ${w}`); });
  if (bad.length) console.warn(bad.join('\n'));
  return bad.length === 0;
}

export function fromLayers(spec, name) {
  const g = new Grid(spec.w, spec.h);
  for (const L of spec.layers) g.stamp(L.x, L.y, L.art, name);
  return g;
}
export function fromArt(art, name) {
  const rows = parse(art);
  const w = Math.max(...rows.map(r => r.length));
  const g = new Grid(w, rows.length);
  g.stamp(0, 0, rows, name);
  return g;
}

// colour -> path data, run-length per row
export function toPaths(g, ox = 0, oy = 0) {
  const by = new Map();
  for (let y = 0; y < g.h; y++) {
    let x = 0;
    while (x < g.w) {
      const c = g.px[y][x];
      if (!c) { x++; continue; }
      let n = 1;
      while (x + n < g.w && g.px[y][x + n] === c) n++;
      const s = by.get(c) || [];
      s.push(`M${x + ox} ${y + oy}h${n}v1h-${n}z`);
      by.set(c, s);
      x += n;
    }
  }
  return [...by.entries()].map(([c, arr]) => [PAL[c], arr.join('')]);
}

export function pathsSvg(paths) {
  return paths.map(([fill, d]) => `<path fill="${fill}" d="${d}"/>`).join('');
}

export function svgDoc(g, extra = '', title = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.w} ${g.h}" width="${g.w}" height="${g.h}" shape-rendering="crispEdges">${title ? `<title>${title}</title>` : ''}${pathsSvg(toPaths(g))}${extra}</svg>\n`;
}
