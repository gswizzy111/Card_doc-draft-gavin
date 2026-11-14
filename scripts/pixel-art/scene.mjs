// Clinic interior, 240x140, 3/4 top-down.
import { Grid, parse } from './lib.mjs';
import { ICONS } from './art.mjs';

export const W = 240, H = 140;
export const WALL_H = 42; // wall rows 0..41, floor from 42

const PLANT = `
......kk..kk......
.....kffk.kfk.....
..kk.kfFk.kffk.kk.
.kffkkfFkkfFkkffk.
.kfFFkffkfFkkfFfk.
..kkfFkffffkfFkk..
.kffkfFkfFfkffkk..
kffFFkfFfkkfFFffk.
kfFkkkffFffkkkFfk.
.kk.kfFkffFfk.kk..
...kffkkffkkffk...
...kFk.kFfk.kFk...
....kkkkffkkkk....
...kkkkkkkkkkkk...
...kRRhhhhhhRRk...
...kkkkkkkkkkkk...
....krhrrrrrrk....
....krhrrrrrRk....
....krrrrrrrRk....
....krrrrrrRRk....
.....kRRRRRRk.....
......kkkkkk......
`;

const FLOWERS = `
...kk.kk...
..kyykhhk..
..kyYkhRk..
.kkkkfkk...
.kfkkfkfk..
..kffffk...
.kkkkkkkk..
.kbbbbbbk..
.kbwbbbqk..
.kbbbbbqk..
..kqqqqk...
...kkkk....
`;

const CHAIR = (c, C) => `
.kkkkkkkkkkkkkk.
k${c.repeat(13)}${C}k
k${'w'}${c.repeat(12)}${C}k
k${c.repeat(13)}${C}k
k${c.repeat(13)}${C}k
k${c.repeat(13)}${C}k
k${c.repeat(13)}${C}k
k${c.repeat(13)}${C}k
k${C.repeat(14)}k
kkkkkkkkkkkkkkkk
k${C.repeat(14)}k
kk${'k'.repeat(12)}kk
.kOk........kOk.
..k..........k..
`;

const BELL = `
...kk...
..kyyk..
.kywyYk.
.kyyyYk.
kkkkkkkk
kGGGGGGk
.kkkkkk.
`;

const BINDER_COLORS = ['r', 'm', 'b', 'y', 'B', 'h', 'N', 'q', 'y', 'r'];

// floor tile, shared with the pattern in the SVG
export const FLOOR_TILE = [
  'zzzzzzzzzzzzzzzl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccllccccccl',
  'zccccccllccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'zccccccccccccccl',
  'llllllllllllllll',
];
export function floorPixel(x, y) {
  const tx = x % 16, ty = (y - WALL_H) % 16;
  return FLOOR_TILE[ty][tx];
}

export function buildScene() {
  const g = new Grid(W, H, 'c');

  // ----- wall -----
  g.rect(0, 0, W, WALL_H, 'p');
  g.rect(0, 0, W, 3, 't');
  g.hline(0, 3, W, 'T');
  g.hline(0, 4, W, 'P');
  // wallpaper: small diamond lattice
  for (let y = 9; y < 31; y += 8) for (let x = ((y / 8) | 0) % 2 ? 4 : 0; x < W; x += 8) {
    g.set(x, y, 'P'); g.set(x - 1, y + 1, 'P'); g.set(x + 1, y + 1, 'P'); g.set(x, y + 2, 'P');
  }
  // wainscot
  g.hline(0, 31, W, 'P');
  g.rect(0, 32, W, 7, 't');
  for (let x = 0; x < W; x += 12) { g.vline(x, 32, 7, 'T'); g.vline(x + 1, 33, 5, 'p'); }
  g.hline(0, 32, W, 'p');
  g.hline(0, 39, W, 'T');
  g.rect(0, 40, W, 2, 'O');

  // ----- floor tiles 16x16 -----
  for (let y = WALL_H; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, floorPixel(x, y));
  // shadow line under the wall
  g.rect(0, WALL_H, W, 2, 'd');

  // ----- bookshelf of binders (left) -----
  const bx = 8, by = 6, bw = 32, bh = 40;
  g.box(bx, by, bw, bh, 'o', 'k', false);
  g.rect(bx + 2, by + 2, bw - 4, bh - 5, 'O');
  for (let s = 0; s < 3; s++) {
    const sy = by + 2 + s * 12;
    // binders
    let x = bx + 3, i = s * 3;
    while (x < bx + bw - 4) {
      const col = BINDER_COLORS[i++ % BINDER_COLORS.length];
      const wd = 3;
      const h = 9 - ((i * 7) % 3);
      if ((i + s) % 5 === 4) { x += 2; continue; } // gap
      g.rect(x, sy + (10 - h), wd, h, 'k');
      g.rect(x, sy + (10 - h) + 1, wd - 1, h - 1, col);
      g.set(x, sy + (10 - h) + 3, 'w'); // label
      x += wd;
    }
    g.hline(bx + 1, sy + 10, bw - 2, 'k');
    g.hline(bx + 1, sy + 11, bw - 2, 'o');
  }
  g.hline(bx + 1, by + 1, bw - 2, 'o');
  g.rect(bx + 1, by + bh - 3, bw - 2, 2, 'O');
  g.rect(bx + 2, by + bh, bw - 2, 2, 'd'); // floor shadow

  // ----- wall monitor -----
  const mx = 150, my = 7;
  g.box(mx, my, 34, 21, 's');
  g.rect(mx + 2, my + 2, 30, 17, 'k');
  g.rect(mx + 3, my + 3, 28, 15, 'n');
  // bar chart + heartbeat (static)
  [[5, 6], [9, 9], [13, 7], [17, 11]].forEach(([dx, h], i) => g.rect(mx + dx, my + 17 - h, 3, h, i % 2 ? 'N' : 'm'));
  g.hline(mx + 22, my + 10, 3, 'm'); g.set(mx + 25, my + 9, 'm'); g.set(mx + 26, my + 7, 'm'); g.set(mx + 27, my + 12, 'm'); g.hline(mx + 28, my + 10, 2, 'm');
  g.hline(mx + 4, my + 4, 2, 'S');
  g.hline(mx + 1, my + 20, 32, 'G');
  g.set(mx + 30, my + 19, 'm');

  // ----- notice board with pinned cards -----
  g.box(44, 9, 20, 18, 'o');
  g.rect(46, 11, 16, 14, 'y');
  g.rect(46, 11, 16, 1, 'Y');
  [[47, 13, 'w'], [53, 12, 'b'], [57, 15, 'w'], [48, 19, 'h']].forEach(([x, y, c]) => { g.box(x, y, 5, 6, c); g.set(x + 2, y, 'r'); });
  g.hline(54, 21, 6, 's'); g.hline(54, 23, 4, 's');

  // ----- wall clock -----
  g.stamp(194, 7, ICONS.clock, 'clock');

  // ----- heart-plus plaque -----
  g.box(126, 8, 20, 20, 'w');
  g.hline(127, 26, 18, 'v');
  g.stamp(128, 10, ICONS['heart-plus'], 'heart');

  // ----- plant (right corner) -----
  g.stamp(212, 22, PLANT, 'plant');
  g.rect(215, 44, 13, 2, 'd');

  // ----- counter -----
  const cx = 40, cy = 46, cw = 162;
  // back edge shadow on floor
  g.rect(cx, cy - 2, cw, 2, 'd');
  g.rect(cx, cy, cw, 22, 'k');
  g.rect(cx + 1, cy + 1, cw - 2, 7, 'h'); // top surface
  g.hline(cx + 1, cy + 1, cw - 2, 'w');
  g.hline(cx + 1, cy + 8, cw - 2, 'k');
  g.rect(cx + 1, cy + 9, cw - 2, 11, 'r'); // front face
  for (let x = cx + 10; x < cx + cw - 4; x += 19) { g.rect(x, cy + 11, 15, 7, 'R'); g.rect(x + 1, cy + 11, 14, 6, 'r'); g.hline(x + 1, cy + 11, 14, 'h'); }
  g.hline(cx + 1, cy + 20, cw - 2, 'R');
  g.rect(cx + 2, cy + 22, cw - 2, 3, 'd'); // floor shadow

  // ----- healing station (on counter) -----
  buildMachine(g);

  // ----- counter items -----
  g.stamp(46, 37, FLOWERS, 'flowers');
  g.stamp(188, 37, FLOWERS, 'flowers');
  g.stamp(170, 43, BELL, 'bell');
  // clipboard + card stack
  g.box(136, 44, 12, 7, 'w'); g.hline(138, 46, 6, 's'); g.hline(138, 48, 8, 's'); g.hline(140, 44, 4, 'B');
  g.box(152, 45, 9, 6, 'y'); g.box(153, 43, 9, 6, 'y'); g.rect(155, 45, 5, 2, 'b');

  // ----- waiting area -----
  chair(g, 14, 96, 'y', 'Y'); chair(g, 31, 96, 'b', 'q');
  table(g, 52, 98);
  table(g, 166, 98);
  chair(g, 193, 96, 'y', 'Y'); chair(g, 210, 96, 'b', 'q');
  // front chairs (second row)
  chair(g, 14, 118, 'b', 'q'); chair(g, 210, 118, 'y', 'Y');

  // ----- runner rug from the counter to the door -----
  const rx = 106, ry = 74, rw = 28, rh = 50;
  g.rect(rx + 1, ry + rh, rw, 1, 'd');
  g.box(rx, ry, rw, rh, 'm');
  g.rect(rx + 2, ry + 2, rw - 4, rh - 4, 'x');
  g.rect(rx + 3, ry + 3, rw - 6, rh - 6, 'm');
  for (let y = ry + 7; y < ry + rh - 6; y += 9) { const c2 = rx + rw / 2; g.hline(c2 - 2, y + 1, 4, 'x'); g.vline(c2 - 1, y, 4, 'x'); g.vline(c2, y, 4, 'x'); g.hline(c2 - 2, y + 2, 4, 'x'); }
  for (let x = rx + 1; x < rx + rw - 1; x += 2) { g.set(x, ry - 1, 'x'); g.set(x, ry + rh, 'x'); }

  // ----- doormat -----
  const dx = 100, dy = 128;
  g.box(dx, dy, 40, 11, 'r');
  g.rect(dx + 2, dy + 2, 36, 7, 'R');
  for (let x = dx + 3; x < dx + 37; x += 3) g.rect(x, dy + 3, 2, 5, 'h');
  g.hline(dx + 1, dy + 11, 40, 'd');

  return g;
}

function chair(g, x, y, c, C) {
  g.rect(x + 2, y + 13, 16, 2, 'd');
  g.stamp(x, y, CHAIR(c, C), 'chair');
}
function table(g, x, y) {
  g.rect(x + 2, y + 14, 22, 2, 'd');
  g.box(x, y, 22, 14, 'b');
  g.rect(x + 2, y + 2, 18, 8, 'x');
  g.hline(x + 3, y + 3, 4, 'w'); g.set(x + 3, y + 4, 'w');
  g.rect(x + 1, y + 10, 20, 2, 'q');
  g.hline(x + 1, y + 12, 20, 'B');
  // a card lying on the table
  g.box(x + 12, y + 4, 6, 7, 'y'); g.rect(x + 13, y + 5, 4, 3, 'b');
}

// Machine geometry shared with the overlay
export const MACHINE = { x: 64, y: 12, w: 58, slotsX: 69, slotsY: 32, slotW: 7, slotH: 10, slotGap: 1 };
export const SLOTS = Array.from({ length: 6 }, (_, i) => ({ x: MACHINE.slotsX + i * (MACHINE.slotW + MACHINE.slotGap), y: MACHINE.slotsY }));
export const SCREEN = { x: 79, y: 15, w: 28, h: 11 };

function buildMachine(g) {
  const { x, y, w } = MACHINE;
  // top monitor housing
  g.box(76, 12, 34, 17, 'g');
  g.hline(77, 13, 32, 'w');
  g.rect(78, 14, 30, 13, 'k');
  g.rect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, 'n');
  // idle heartbeat line on screen
  const hy = SCREEN.y + 5;
  g.hline(SCREEN.x + 1, hy, 9, 'M'); g.set(SCREEN.x + 10, hy - 1, 'M'); g.set(SCREEN.x + 11, hy - 3, 'M'); g.set(SCREEN.x + 12, hy + 2, 'M'); g.hline(SCREEN.x + 13, hy, 14, 'M');
  g.rect(90, 29, 6, 2, 'G'); // neck
  g.hline(90, 29, 6, 'k');
  // body
  g.box(x, 30, w, 20, 'b');
  g.hline(x + 1, 31, w - 2, 'w');
  g.vline(x + 1, 31, 17, 'x');
  g.rect(x + w - 3, 32, 2, 16, 'q');
  // slot tray
  g.rect(SLOTS[0].x - 2, SLOTS[0].y - 2, 6 * 8 + 3, 14, 'k');
  g.rect(SLOTS[0].x - 1, SLOTS[0].y - 1, 6 * 8 + 1, 12, 'B');
  for (const s of SLOTS) {
    g.rect(s.x, s.y, 7, 10, 'k');
    g.rect(s.x + 1, s.y + 1, 5, 8, 'q');
    g.rect(s.x + 2, s.y + 2, 3, 5, 'b'); // resting card silhouette
    g.set(s.x + 1, s.y + 1, 'b');
  }
  // control strip
  g.rect(x + 3, 45, 4, 3, 'k'); g.rect(x + 4, 46, 2, 1, 'y'); // dial
  for (let i = 0; i < 6; i++) g.set(SLOTS[i].x + 3, 46, 'G');
  g.rect(x + w - 8, 45, 4, 3, 'k'); g.rect(x + w - 7, 46, 2, 1, 'r'); // status LED (overlay blinks it)
  // feet
  g.rect(x + 2, 49, w - 4, 1, 'B');
}

export const LED = { x: MACHINE.x + MACHINE.w - 7, y: 46 };

// Overlay pieces for animation, in scene coordinates.
export function slotLit(s) {
  return [
    ['m', s.x + 1, s.y + 1, 5, 8],
    ['x', s.x + 1, s.y + 1, 1, 8],
    ['k', s.x + 2, s.y + 2, 3, 6],
    ['y', s.x + 2, s.y + 2, 3, 5],
    ['w', s.x + 2, s.y + 3, 3, 2],
  ];
}
export const SLOT_LED = (i) => ['m', SLOTS[i].x + 3, 46, 1, 1];
// heal bar on screen (grows in 6 steps)
export const BAR = { x: SCREEN.x + 2, y: SCREEN.y + SCREEN.h - 3, w: 24, h: 2 };
// sparkle burst positions (12x12 sparkles, top-left)
export const BURST = [
  { x: 60, y: 22, s: 0 }, { x: 116, y: 20, s: 1 }, { x: 86, y: 0, s: 2 }, { x: 102, y: 34, s: 3 }, { x: 68, y: 38, s: 2 },
];
