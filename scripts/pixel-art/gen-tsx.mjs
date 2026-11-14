// Writes public/pixel/** , components/pixel/sprites.tsx and sprites.module.css
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import * as A from './art.mjs';
import { built } from './sprites.mjs';
import { Grid, fromArt, toPaths, pathsSvg, svgDoc } from './lib.mjs';
import { SLOTS, slotLit, SLOT_LED, BAR, BURST, LED, W, H } from './scene.mjs';
import './build-scene.mjs';
import { readFileSync, copyFileSync } from 'node:fs';

const REPO = '/home/user/Card_doc-draft-gavin';
const PUB = `${REPO}/public/pixel`;
rmSync(PUB, { recursive: true, force: true });
mkdirSync(`${PUB}/icons`, { recursive: true });
mkdirSync(`${PUB}/sprites`, { recursive: true });

const OUT = process.env.PIXEL_OUT || '/tmp/pixel-work/out';
// ---- public files ----
copyFileSync(`${OUT}/clinic-scene.svg`, `${PUB}/clinic-scene.svg`);
copyFileSync(`${OUT}/clinic-base.svg`, `${PUB}/clinic-base.svg`);
copyFileSync(`${OUT}/wall-trim.svg`, `${PUB}/wall-trim.svg`);
copyFileSync(`${OUT}/frame.svg`, `${PUB}/frame.svg`);
// floor tile = the scene's floor tile, so the page and the hero match
import { FLOOR_TILE } from './scene.mjs';
const tile = new Grid(16, 16); tile.stamp(0, 0, FLOOR_TILE);
writeFileSync(`${PUB}/tile-floor.svg`, svgDoc(tile));
for (const n of Object.keys(A.ICONS)) copyFileSync(`${OUT}/icon-${n}.svg`, `${PUB}/icons/${n}.svg`);
for (const n of ['card-healed', 'card-hurt', 'card-sleeve', 'card-slab', 'doc-a', 'doc-b']) copyFileSync(`${OUT}/${n}.svg`, `${PUB}/sprites/${n}.svg`);
// sprite sheets: doc 2 frames (48x32), sparkle 6 frames (72x12)
function sheet(grids, fw, fh) {
  const g = new Grid(fw * grids.length, fh);
  grids.forEach((s, i) => { for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) if (s.get(x, y)) g.set(i * fw + x, y, s.get(x, y)); });
  return g;
}
writeFileSync(`${PUB}/sprites/doc-sheet.svg`, svgDoc(sheet([built['doc-a'], built['doc-b']], 24, 32)));
writeFileSync(`${PUB}/sprites/sparkle-sheet.svg`, svgDoc(sheet(A.SPARKLES.map((_, i) => built[`sparkle-${i}`]), 12, 12)));

// ---- TSX data ----
const P = (g, ox = 0, oy = 0) => JSON.stringify(toPaths(g, ox, oy));
const healedBase = new Grid(18, 24);
A.CARD_HEALED.layers.forEach((L, i) => { if (i !== 1) healedBase.stamp(L.x, L.y, L.art); });
const healedSpark = new Grid(18, 24); healedSpark.stamp(A.CARD_HEALED.layers[1].x, A.CARD_HEALED.layers[1].y, A.CARD_HEALED.layers[1].art);

const iconData = Object.keys(A.ICONS).map(n => `  ${JSON.stringify(n)}: ${P(built[`icon-${n}`])},`).join('\n');
const sparkData = A.SPARKLES.map((_, i) => `  ${P(built[`sparkle-${i}`])},`).join('\n');

// overlay pieces
const rectsToPaths = (rects) => { const g = new Grid(W, H); for (const [c, x, y, w, h] of rects) g.rect(x, y, w, h, c); return toPaths(g); };
const slotData = SLOTS.map((s, i) => `  ${JSON.stringify(rectsToPaths([...slotLit(s), SLOT_LED(i)]))},`).join('\n');
const slotBox = { x: SLOTS[0].x, y: SLOTS[0].y, w: SLOTS[5].x + 7 - SLOTS[0].x, h: 10 };
const burstFrames = [1, 2, 3, 4, 5];
const burstData = BURST.map(b => `  { x: ${b.x}, y: ${b.y}, delay: ${(b.s * 0.12).toFixed(2)}, frames: [${burstFrames.map(f => P(built[`sparkle-${f}`], b.x, b.y)).join(', ')}] },`).join('\n');

const tsx = `/* eslint-disable @next/next/no-img-element */
// Pixel sprites for The Card Doc clinic redesign. Original art, generated from
// hand-placed pixel grids (see public/pixel/). Server-component safe: no hooks.
// All animation lives in sprites.module.css and stops under
// prefers-reduced-motion, leaving a finished static frame.
import type { CSSProperties, ReactNode } from 'react';
import styles from './sprites.module.css';

type Paths = readonly (readonly [fill: string, d: string])[];

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
const int = (n: number | undefined, d: number) => Math.max(1, Math.round(n ?? d));

function PathSet({ paths }: { paths: Paths }) {
  return <>{paths.map(([fill, d]) => <path key={fill} fill={fill} d={d} />)}</>;
}

type BaseProps = {
  /** Accessible name. Omit for decorative use (aria-hidden). */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

function PixelSvg({ w, h, scale, label, className, style, children }: BaseProps & { w: number; h: number; scale: number; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={\`0 0 \${w} \${h}\`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      focusable="false"
      className={cx(styles.pixel, className)}
      style={style}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {label ? <title>{label}</title> : null}
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ icons */

const ICONS = {
${iconData}
} as const satisfies Record<string, Paths>;

export type PixelIconName = keyof typeof ICONS;
export const PIXEL_ICON_NAMES = Object.keys(ICONS) as PixelIconName[];

/** 16x16 pixel icon. size is in CSS px and snaps to a multiple of 16 (default 32). */
export function PixelIcon({ name, size = 32, ...rest }: BaseProps & { name: PixelIconName; size?: number }) {
  const scale = Math.max(1, Math.round(size / 16));
  return (
    <PixelSvg w={16} h={16} scale={scale} {...rest}>
      <PathSet paths={ICONS[name]} />
    </PixelSvg>
  );
}

/* ------------------------------------------------------------------ doc */

const DOC_A: Paths = ${P(built['doc-a'])};
const DOC_B: Paths = ${P(built['doc-b'])};

/** Original chibi doctor mascot, 24x32 native. animate = 2-frame idle bob. */
export function DocSprite({ animate = true, scale, ...rest }: BaseProps & { animate?: boolean; scale?: number }) {
  return (
    <PixelSvg w={24} h={32} scale={int(scale, 4)} {...rest} className={cx(animate && styles.bob, rest.className)}>
      <g className={styles.docA}><PathSet paths={DOC_A} /></g>
      {animate ? <g className={styles.docB}><PathSet paths={DOC_B} /></g> : null}
    </PixelSvg>
  );
}

/* ------------------------------------------------------------------ cards */

const CARDS = {
  hurt: { w: 18, h: 24, paths: ${P(built['card-hurt'])} },
  healed: { w: 18, h: 24, paths: ${P(healedBase)} },
  sleeve: { w: 18, h: 25, paths: ${P(built['card-sleeve'])} },
  slab: { w: 20, h: 28, paths: ${P(built['card-slab'])} },
} as const satisfies Record<string, { w: number; h: number; paths: Paths }>;
const HEALED_SPARK: Paths = ${P(healedSpark)};

export type CardVariant = keyof typeof CARDS;

/** Trading card sprite: hurt (bent, scuffed, bandaged), healed (clean + shine), sleeve, slab. */
export function CardSprite({ variant = 'healed', scale, animate = true, ...rest }: BaseProps & { variant?: CardVariant; scale?: number; animate?: boolean }) {
  const c = CARDS[variant];
  return (
    <PixelSvg w={c.w} h={c.h} scale={int(scale, 3)} {...rest}>
      <PathSet paths={c.paths} />
      {variant === 'healed' ? <g className={cx(animate && styles.twinkle)}><PathSet paths={HEALED_SPARK} /></g> : null}
    </PixelSvg>
  );
}

/* ------------------------------------------------------------------ sparkle */

const SPARKLE_FRAMES: readonly Paths[] = [
${sparkData}
];
const SPARK_CLASS = [styles.sf0, styles.sf1, styles.sf2, styles.sf3, styles.sf4, styles.sf5];

/**
 * 12x12 heal sparkle, 6 frames (grow, burst, fade). Loops by default.
 * delay (s) offsets the loop; iterations = 1 plays it once and ends empty.
 * Reduced motion shows the full burst frame, still.
 */
export function SparkleSprite({ scale, animate = true, delay = 0, iterations = 'infinite', ...rest }: BaseProps & { scale?: number; animate?: boolean; delay?: number; iterations?: number | 'infinite' }) {
  const vars = { '--sparkle-delay': \`\${delay}s\`, '--sparkle-iterations': String(iterations), ...rest.style } as CSSProperties;
  return (
    <PixelSvg w={12} h={12} scale={int(scale, 2)} {...rest} style={vars} className={cx(styles.sparkle, animate && styles.sparkleAnim, rest.className)}>
      {SPARKLE_FRAMES.map((p, i) => (
        <g key={i} className={cx(styles.sparkFrame, SPARK_CLASS[i], i === 3 && styles.sparkRest)}><PathSet paths={p} /></g>
      ))}
    </PixelSvg>
  );
}

/* ------------------------------------------------------------------ clinic scene */

const SLOT_LIT: readonly Paths[] = [
${slotData}
];
const SLOT_CLASS = [styles.slot0, styles.slot1, styles.slot2, styles.slot3, styles.slot4, styles.slot5];
const BURSTS: readonly { x: number; y: number; delay: number; frames: readonly Paths[] }[] = [
${burstData}
];
const BURST_CLASS = [styles.bf1, styles.bf2, styles.bf3, styles.bf4, styles.bf5];

/**
 * The clinic hero, 240x140 native. The base is /pixel/clinic-base.svg; an
 * inline overlay animates the healing station: the 6 card slots light up mint
 * one after another, the screen bar fills, a white heal flash, a sparkle
 * burst, then it rests and repeats (6s loop). animate={false} or reduced
 * motion shows the finished, healed frame.
 * Fluid by default (width: 100%, aspect 240/140); pass scale for a fixed
 * integer multiple.
 */
export function ClinicScene({ animate, animated, scale, label, className, style, priority = false }: BaseProps & { animate?: boolean; /** @deprecated use animate */ animated?: boolean; scale?: number; priority?: boolean }) {
  const play = animate ?? animated ?? true;
  const sized: CSSProperties = scale ? { width: ${W} * int(scale, 1), ...style } : { ...style };
  return (
    <div
      className={cx(styles.scene, play && styles.animated, className)}
      style={sized}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <img src="/pixel/clinic-base.svg" alt="" width={${W}} height={${H}} className={styles.sceneLayer} decoding="async" fetchPriority={priority ? 'high' : undefined} />
      <svg viewBox="0 0 ${W} ${H}" className={styles.sceneLayer} shapeRendering="crispEdges" focusable="false" aria-hidden="true">
        <rect className={styles.bar} x={${BAR.x}} y={${BAR.y}} width={${BAR.w}} height={${BAR.h}} fill="#9DD3B4" />
        <rect className={styles.led} x={${LED.x}} y={${LED.y}} width={2} height={1} fill="#9DD3B4" />
        {SLOT_LIT.map((p, i) => <g key={i} className={cx(styles.slot, SLOT_CLASS[i])}><PathSet paths={p} /></g>)}
        <path className={styles.flash} fill="#FFFBEF" d="${SLOTS.map(s => `M${s.x + 1} ${s.y + 1}h5v8h-5z`).join('')}" />
        {BURSTS.map((b, i) => (
          <g key={i} style={{ '--burst-delay': \`\${b.delay}s\` } as CSSProperties}>
            {b.frames.map((p, f) => (
              <g key={f} className={cx(styles.burstFrame, BURST_CLASS[f], f === 2 && i < 3 && styles.burstStatic)}><PathSet paths={p} /></g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Native pixel sizes, for layout math (render at integer multiples). */
export const SPRITE_SIZES = {
  clinic: { w: ${W}, h: ${H} },
  doc: { w: 24, h: 32 },
  card: { w: 18, h: 24 },
  sleeve: { w: 18, h: 25 },
  slab: { w: 20, h: 28 },
  icon: { w: 16, h: 16 },
  sparkle: { w: 12, h: 12 },
  tile: { w: 16, h: 16 },
  frameSlice: 4,
} as const;
`;
writeFileSync(`${REPO}/components/pixel/sprites.tsx`, tsx);

// ---- CSS module ----
const CYCLE = 6;
const pct = (s) => `${+(s / CYCLE * 100).toFixed(3)}%`;
const slotOn = (i) => 0.4 + i * 0.35;
const REST_END = 5.4;
const FLASH = 2.6, BURST_T = 2.8, BF = 0.15;
let css = `/* Pixel sprite styles. Owned by components/pixel/sprites.tsx. */
.pixel {
  display: inline-block;
  flex: none;
  vertical-align: middle;
  image-rendering: pixelated;
  shape-rendering: crispEdges;
  overflow: visible;
}

/* ---- clinic scene ---- */
.scene {
  position: relative;
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: ${W} / ${H};
}
.sceneLayer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}
/* static (finished) state: slots lit, bar full, LED mint, three sparkles */
.slot { opacity: 1; }
.bar { transform-box: fill-box; transform-origin: 0 0; }
.flash { opacity: 0; }
.burstFrame { opacity: 0; }
.burstStatic { opacity: 1; }

/* ---- sparkle ---- */
.sparkFrame { opacity: 0; }
.sparkRest { opacity: 1; }

/* ---- doc ---- */
.docB { opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
`;
SLOTS.forEach((_, i) => {
  css += `  .animated .slot${i} { animation: slot${i} ${CYCLE}s step-end infinite; }\n`;
});
css += `  .animated .bar { animation: bar ${CYCLE}s step-end infinite; }
  .animated .led { animation: led ${CYCLE}s step-end infinite; }
  .animated .flash { animation: flash ${CYCLE}s step-end infinite; }
  .animated .burstFrame { opacity: 0; animation-duration: ${CYCLE}s; animation-timing-function: step-end; animation-iteration-count: infinite; animation-delay: var(--burst-delay, 0s); }
`;
for (let f = 1; f <= 5; f++) css += `  .animated .bf${f} { animation-name: bf${f}; }\n`;
css += `
  .sparkleAnim .sparkFrame { opacity: 0; animation: 0.72s step-end var(--sparkle-delay, 0s) var(--sparkle-iterations, infinite) both; }
`;
for (let f = 0; f < 6; f++) css += `  .sparkleAnim .sf${f} { animation-name: sf${f}; }\n`;
css += `
  .bob .docA { animation: docA 1s step-end infinite; }
  .bob .docB { animation: docB 1s step-end infinite; }
  .twinkle { animation: twinkle 1.8s step-end infinite; }
}
`;
// keyframes (outside the media query so names stay local and valid)
SLOTS.forEach((_, i) => {
  css += `@keyframes slot${i} { 0% { opacity: 0; } ${pct(slotOn(i))} { opacity: 1; } ${pct(REST_END)} { opacity: 0; } 100% { opacity: 0; } }\n`;
});
css += `@keyframes bar { 0% { transform: scaleX(0); } ${SLOTS.map((_, i) => `${pct(slotOn(i))} { transform: scaleX(${+((i + 1) / 6).toFixed(4)}); }`).join(' ')} ${pct(REST_END)} { transform: scaleX(0); } 100% { transform: scaleX(0); } }\n`;
css += `@keyframes led { 0% { opacity: 0; } ${pct(BURST_T)} { opacity: 1; } ${pct(REST_END)} { opacity: 0; } 100% { opacity: 0; } }\n`;
css += `@keyframes flash { 0% { opacity: 0; } ${pct(FLASH)} { opacity: 1; } ${pct(FLASH + 0.1)} { opacity: 0; } ${pct(FLASH + 0.15)} { opacity: 0.7; } ${pct(BURST_T)} { opacity: 0; } 100% { opacity: 0; } }\n`;
const bfLen = [BF, BF, BF * 2, BF * 1.5, BF * 1.5];
let t = BURST_T;
for (let f = 1; f <= 5; f++) {
  css += `@keyframes bf${f} { 0% { opacity: 0; } ${pct(t)} { opacity: 1; } ${pct(t + bfLen[f - 1])} { opacity: 0; } 100% { opacity: 0; } }\n`;
  t += bfLen[f - 1];
}
for (let f = 0; f < 6; f++) {
  const a = (f / 6 * 100).toFixed(3), b = ((f + 1) / 6 * 100).toFixed(3);
  css += `@keyframes sf${f} { 0% { opacity: ${f === 0 ? 1 : 0}; } ${f === 0 ? '' : `${a}% { opacity: 1; } `}${b}% { opacity: 0; } 100% { opacity: 0; } }\n`;
}
css += `@keyframes docA { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
@keyframes docB { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
@keyframes twinkle { 0% { opacity: 1; } 55% { opacity: 0; } 65% { opacity: 1; } 80% { opacity: 0; } 85% { opacity: 1; } 100% { opacity: 1; } }
`;
writeFileSync(`${REPO}/components/pixel/sprites.module.css`, css);
console.log('wrote');
