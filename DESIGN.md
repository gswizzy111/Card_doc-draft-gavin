---
name: The Card Doc Clinic
description: Card restoration, grading prep and DIY kits presented as a cozy handheld-RPG (GBA / DS era) healing center. Muted pastel floor, wall and counter colors, chunky Jersey 10 pixel headings over a readable Atkinson Hyperlegible body, pixel windows and dialog boxes with stepped corners, hard one-tone pixel shadows, steps() motion, and real before and after photos framed in pixel UI.
colors:
  floor: "#F3EAC8"
  tile: "#E6D8A8"
  tile-alt: "#EFE3BB"
  wall: "#F2CBA0"
  trim: "#E3A77A"
  coral: "#E07A6E"
  coral-fill: "#E8887B"
  coral-deep: "#A9473F"
  rx-soft: "#F8E0D2"
  mint: "#9DD3B4"
  mint-deep: "#376B56"
  powder: "#A9C8E8"
  frame: "#5D7AA6"
  frame-deep: "#4A6690"
  butter: "#F1D77A"
  panel: "#FFFBEF"
  ink: "#3B3040"
  ink-soft: "#5E5162"
  rule: "#D9C897"
  muted-surface: "#EFE5C2"
  destructive: "#A63D3A"
  night: "#2E2A3D"
  night-raise: "#3A3550"
  stage-fg: "#FFFBEF"
  stage-muted: "#B8AEC0"
  rx-bright: "#EE9A8E"
typography:
  display:
    fontFamily: "Jersey 10, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 9.5vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
    textTransform: "uppercase"
    fontSizeAdjust: "ex-height 0.53"
  section:
    fontFamily: "Jersey 10, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
    fontSizeAdjust: "ex-height 0.53"
  title:
    fontFamily: "Jersey 10, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.02em"
    fontSizeAdjust: "ex-height 0.53"
  button:
    fontFamily: "Jersey 10, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    letterSpacing: "0.04em"
    textTransform: "uppercase"
  body:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Silkscreen, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1rem
    letterSpacing: "0.04em"
    textTransform: "uppercase"
rounded:
  everything: "0px"
  pill: "9999px (legacy only; do not add new pills)"
spacing:
  pixel: "3px"
  row: "10px"
  panel: "20px"
  gutter-phone: "16px"
  gutter-desk: "40px"
  section-phone: "80px"
  section-desk: "128px"
components:
  window:
    className: "px-window (or <Window/>)"
    backgroundColor: "{colors.panel}"
    outline: "3px {colors.frame}, stepped corners"
    innerLine: "3px {colors.powder}"
    shadow: "7px 7px 0 ink @ 24%"
  dialog:
    className: "px-window px-dialog + .px-dialog-next (▼)"
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  card:
    className: "px-window-ink (ui/card)"
    backgroundColor: "{colors.panel}"
    outline: "3px {colors.ink}, stepped corners"
  button-primary:
    className: "px-btn / comic-btn / ui Button default"
    backgroundColor: "{colors.coral-fill}"
    textColor: "{colors.ink}"
    bottomEdge: "#C4665A"
    height: "36-56px"
  button-secondary:
    className: "px-btn px-btn-mint / ui Button secondary"
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
  button-ghost-panel:
    className: "px-btn px-btn-panel / comic-btn-light / ui Button outline"
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    border: "2px {colors.ink}"
    focus: "border {colors.frame-deep} + 3px frame-deep @ 35% outline + butter tint"
    height: "40px"
  status-chip:
    labels: "CHECK-IN / TRIAGE / IN TREATMENT / DISCHARGED"
    typography: "{typography.label}"
  night-band:
    className: "stage stage-light"
    backgroundColor: "{colors.night}"
    textColor: "{colors.stage-fg}"
  nav-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    height: "64px + 6px trim"
---

# Design System: The Card Doc Clinic

## Direction (November 2026): the pixel healing center

The site is a clinic for trading cards, drawn like a cozy handheld RPG from
the GBA / DS era. Hurt cards check in, get triaged, go into treatment and are
discharged healthy. It replaces the comic-workshop look (which read as a copy
of another shop). The mood reference is a fan-made healing-center screenshot:
we borrow only its feel (soft cream tiles, peach walls, coral counter, mint
machines, blue-framed dialog boxes), never its content.

Source of truth for tokens: `app/globals.css`. Reusable pieces:
`components/pixel/` (Window, StatusChip, HpBar, WallBand, TileFloor,
DocPortrait, MenuCursor, HealSparkles, Typewriter, pixelButton) and the
restyled `components/ui/*`. Pixel sprites live in
`components/pixel/sprites.tsx` and `public/pixel/`.

## Hard rules

- **Original artwork only.** No Pokémon names, characters (no nurse or pink
  egg-creature helper), Poké Balls (not even as a floor pattern), the
  Pokémon Center building or logo, game fonts, UI rips or screenshots.
  Generic RPG conventions are fine: dialog boxes with a blinking ▼, HP /
  condition bars, a ▶ menu cursor, tile floors, healing sparkles, sprites.
- **No Red Cross emblem.** A red cross on white is legally protected. Use a
  pixel heart-plus, a rounded mint or coral plus, or a card-with-plus. Plus
  marks are never red-on-white and never the sole symbol on a white field.
- **The owner's wording never changes**, punctuation included. Decorative UI
  labels that make no claim are fine (`▶ CHECK-IN`, `DISCHARGED`, `NEXT ▼`,
  `HP`); new facts, numbers, prices, ratings or promises are not.
- **The logo** `/card-doctor.jpg` is shown as a photo inside a pixel portrait
  frame (`<DocPortrait/>`). Never pixelate, redraw or recolor it.
- **Customer card photos** stay photos, framed in pixel UI.

## Colors

Muted GBA pastels. Saturation stays low; no neon, no pure black, no pure
white (`white` and `black` in Tailwind are remapped to panel and ink).

| Token | Hex | Use | Contrast |
|---|---|---|---|
| floor / paper / cream | `#F3EAC8` | page | ink 10.4:1 |
| tile, tile-alt | `#E6D8A8`, `#EFE3BB` | floor grout, checker | decorative |
| wall / peach | `#F2CBA0` | section bands | ink 8.2:1, ink-soft 4.7:1 |
| trim | `#E3A77A` | wainscot stripe | ink 6:1 |
| coral | `#E07A6E` | decorative fills, sprites | ink 4.3:1 (large text only) |
| coral-fill | `#E8887B` | primary pixel button | ink 4.9:1 |
| coral-deep / rx / primary | `#A9473F` | accent text, fills with panel text | 4.8:1 floor, 5.6:1 panel, panel on it 5.6:1 |
| rx-soft | `#F8E0D2` | coral wash | rx on it 4.6:1 |
| mint | `#9DD3B4` | secondary fill | ink 7.4:1 |
| mint-deep | `#376B56` | green text | 5.1:1 floor |
| powder | `#A9C8E8` | tertiary fill, window inner line | ink 7.2:1 |
| frame | `#5D7AA6` | window frames | 3.6:1 on floor (non-text) |
| frame-deep | `#4A6690` | focus ring, blue text | 4.8:1 floor |
| butter | `#F1D77A` | highlights, hover, tabs | ink 8.8:1 |
| panel / bone | `#FFFBEF` | windows, cards | ink 12:1 |
| ink | `#3B3040` | outlines, text | |
| ink-soft / muted-foreground | `#5E5162` | secondary text | 6.2:1 floor, 4.7:1 wall |
| night / stage | `#2E2A3D` | dusk bands, footer, phone menu | panel 13.4:1, stage-muted 6.5:1, rx-bright 6.4:1 |

**Palette remap.** Tailwind scales used directly by older pages are pointed
at muted clinic ramps: orange/purple/violet/fuchsia/pink to coral,
blue/sky/indigo to powder-frame blue, slate/gray/zinc/neutral/stone/cyan/teal
to plum grey, green/emerald/lime to mint, red/rose to brick, amber/yellow to
butter. Every 500+ step is at least 4.5:1 as text on its own 50/100 tint, on
floor and on panel.

**Pairs to avoid:** coral-deep or ink-soft text on wall peach under 18px
bold (use ink); panel text on coral or coral-fill (use ink); ink-soft on
night (use stage-muted).

## Typography

- **Jersey 10** (`--font-heading`, `.font-heading`, h1-h4, buttons, nav,
  prices): chunky, condensed pixel face whose C never reads as an O. One
  weight; `font-size-adjust: ex-height 0.53` sizes it to match the body.
  Tracking is never negative (glyphs sit on a grid), uppercase for display.
- **Atkinson Hyperlegible Next** (`--font-sans`): all body copy, forms, FAQs
  and legal text. Long text is never set in a pixel face.
- **Silkscreen** (`--font-pixel`, `font-pixel`, `.rx-label`, `font-mono`):
  tiny labels only: chips, HUD text, table headers, price hints. 11-13px.
- Prices use lining figures (`lnum`), tables use tabular figures.

## Layout and surfaces

- **Floor:** the body carries the art tile `/pixel/tile-floor.svg` (the
  same bevelled cream tile as the clinic scene) at 3x, 48px (`.tile-floor`,
  `.page-glow`, token `--floor-tile`). `.tile-floor-sm` draws it at 2x,
  32px. Always whole multiples of 16px.
- **Wall band:** `.wall-band` / `<WallBand/>`: peach wall with faint seams,
  the wainscot trim art `/pixel/wall-trim.svg` at 2x (32x24, token
  `--wall-trim`) and an ink skirting line. Section header device; `sprite`
  slot on the trim. `.wall-trim` is the 24px trim strip alone (footer top).
- **Night band:** `.stage .stage-light`: dusk with a sparse square-star tile.
- Square corners everywhere (`--radius: 0`). Stepped corners come from four
  offset box-shadows (`.px-frame`, `.px-window*`, `.px-btn`), so focus rings
  and overflow still work. `.px-corners` clips a solid fill instead.

## Elevation

One-tone hard pixel shadows only: `--px-shadow` (ink at 24%) offset down
right (4-7px). No blur, no glow, no glossy gradients, no film grain.
`.comic-shadow*` now draw this shadow.

## Components

- **Window** (`<Window/>`, `.px-window`): panel fill, 3px frame-blue outline
  with stepped corners, powder inner line, hard shadow. `tone="ink"` for
  cards on busy floors (`.px-window-ink`, used by `ui/card`), `tone="night"`
  for menus on the stage. `title` adds a butter tab on the top edge.
- **Dialog** (`variant="dialog"`, `.px-dialog` + `.px-dialog-next`): a window
  that talks, ▼ blinking bottom right. Pair with `<DocPortrait/>` for NPC
  lines (PageHero lead, 404, footer sign-off).
- **Pixel button** (`.px-btn`, tones `-mint -panel -butter -powder -ink
  -danger`; `pixelButton()` for links; `ui/button` variants map to tones;
  legacy `.comic-btn`, `.comic-btn-light`, `.comic-btn-ink`, `.btn-depth`):
  stepped ink outline, 4px darker bottom edge, 2px light top edge; hover
  lightens instantly; presses down 2px. Focus is a dashed ring drawn inside.
- **Inputs** (`ui/input`, `textarea`, `select`): panel fill, 2px ink border,
  inset top shade; focus turns the border frame-blue, adds a soft blue ring
  and a faint butter tint. Checkbox and radio are square; checked radio is a
  coral-deep square, checked checkbox mint.
- **Menus** (`ui/select`, `ui/dropdown-menu`, nav Explore): blue-framed
  windows; the highlighted row shows the ▶ cursor and a butter fill.
- **Status chip** (`<StatusChip/>`): CHECK-IN (powder), TRIAGE (butter), IN
  TREATMENT (coral wash), DISCHARGED (mint). Decorative labels.
- **HP / condition bar** (`<HpBar/>`): coral (low), butter (mid), mint (full)
  inside a night track. Never shows a number. `animate` fills it in frames.
- **Menu cursor** (`<MenuCursor/>` in a `.menu-cursor-item`): ▶ shows on
  hover, focus, highlighted menu rows and the current page.
- **Doc portrait** (`<DocPortrait/>`, xs-xl): the logo photo in a powder and
  frame-blue portrait box, optional butter nameplate.
- **Heal sparkles** (`<HealSparkles/>`): the art's mint sparkle sprite,
  twinkling through its frames while it rises in steps; a static scatter of
  full stars under reduced motion. It covers its `relative` parent and
  paints over in-flow content, so give it an empty decorative area (or put
  the content in a `relative z-[1]` box).
- **Typewriter** (`<Typewriter/>`): short NPC lines only; reduced motion and
  screen readers get the full text at once.
- **Badges** (`ui/badge`): square, 2px ink border, Silkscreen label.
- **Tabs** (`ui/tabs`): the active tab is a panel window in a muted tray.
- **Tables** (`ui/table`): muted header row with Silkscreen labels, ink rule.
- **Nav:** panel-white command bar with a 6px trim stripe under it; logo is
  `<DocPortrait size="xs"/>` + Jersey wordmark; tabs get the ▶ cursor and a
  3px coral-deep underline when active. Phone menu is a full-screen night
  window with RPG-style lists. `sprite` prop: slot beside the logo.
- **Footer:** night band after hours under the wainscot trim art; the doc's
  portrait and a dialog box carry the sign-off; a faint giant wordmark rises
  in frames. `sprite` prop defaults to `<DocSprite scale={2}/>` beside the
  name (md and up); `sprite={null}` hides it.
- **Page hero** (`<PageHero/>`): butter eyebrow tab with ▶, uppercase Jersey
  headline with a wall-peach pixel shadow, and the lead in a dialog box with
  the doc's portrait. `sprite` and `portrait` props.
- **404** (`<NotFoundPanel/>`): big 404 with a hurt card sprite (`sprite`
  prop, default `<CardSprite variant="hurt" scale={4}/>`), Next's words in a
  dialog box. `/not-available` and the route skeleton use the same dialog
  with `<DocSprite scale={2}/>`.
- **Preview banner:** butter strip with the 16px heart-plus icon.

## Pixel art (`components/pixel/sprites.tsx`)

Original art only, drawn on a 1px grid and always rendered at whole
multiples (crisp edges, `image-rendering: pixelated`). Every sprite takes
`label?` (gives it `role="img"` and a name; omit it and the sprite is
decorative and `aria-hidden`), `className?` and `style?`. All are server
components; their motion uses `step-end` timing and stops under reduced
motion on a finished frame. Import from `@/components/pixel` in server
components; in a `"use client"` file import from
`@/components/pixel/sprites` (the barrel also pulls in `Typewriter`).

| Component | Native | Use it for | Don't |
|---|---|---|---|
| `<ClinicScene/>` | 240x140 | The home hero only: the waiting room with the healing station (6 slots light up, bar fills, heal flash, sparkle burst, 6s loop). Fluid width; `scale` fixes it. `priority` when above the fold. `animate={false}` freezes the healed frame. | Repeat it on other pages or shrink it under ~320px wide. |
| `<DocSprite/>` | 24x32 | The mascot "talking": next to dialog boxes, empty states, loading, the footer. 2-frame idle bob (`animate`). Scale 2-5. | Replace the logo photo; the photo (`<DocPortrait/>`) stays the brand mark. |
| `<CardSprite variant/>` | 18x24 (sleeve 18x25, slab 20x28) | The patient: `hurt` (before, triage, errors, 404), `healed` (after, discharge, success; corner twinkle), `sleeve` and `slab` for prep and slab-cracking copy. Scale 2-5. | Stand in for real customer photos. |
| `<PixelIcon name/>` | 16x16 | Feature lists, steps, pills and section labels. `size` snaps to 16/32/48. Names: `PIXEL_ICON_NAMES`. `heart-plus` is the clinic emblem. | UI controls (close, menu, chevrons): those stay `lucide-react`. |
| `<SparkleSprite/>` | 12x12 | One heal sparkle: beside a success line, on a healed card, a one-shot burst (`iterations={1}`, `delay`). | Large fields of sparkles; use `<HealSparkles/>`. |
| `SPRITE_SIZES` | | Native sizes for layout math. | |

Static files in `/public/pixel/`: `tile-floor.svg`, `wall-trim.svg`,
`frame.svg` (9-slice, slice 4), `clinic-scene.svg` (healed still, e.g. for
an OG image), `icons/*.svg`, `sprites/*.svg`. The art is generated from
pixel grids (the art agent's scripts); hand edits to `sprites.tsx` may be
overwritten by a regeneration, so note any change in the generator too.
- **Legacy classes** kept working with pixel equivalents: `.comic-border`,
  `.comic-shadow*`, `.comic-lift`, `.halftone*` (now a pixel dither),
  `.speech` (dialog with a stepped tail), `.sticker` (square badge),
  `.burst` (stepped star), `.metal-*` (flat swatches with a hard highlight
  band), `.holo-bands` (hard-stop pastel bands), `.holo-ring` (stepped
  cycling frame), `.lit-border` (hard coral frame on hover),
  `.wordmark-pattern` (night with pixel plus-marks), `.grain-overlay`
  (disabled).

## Motion

Pixel-honest: `steps()` easing everywhere, two-frame idle loops
(`.px-bob`, `.px-blink`, `.px-nudge`), the blinking ▼, sparkles rising in 8
frames, reveals and hero entrances in 3-4 frames, a short stepped heal flash
(brightness) as each page arrives (`::view-transition-new(.page-in)`), a
stepped HP bar as the route progress indicator, a two-frame skeleton blink.
Interaction feedback is instant (< 150ms). Under `prefers-reduced-motion`
every loop stops and pages cross-fade in two frames; everything still looks
finished. Motion (`motion/react`) is used with a frame-snapping ease
(`FRAMES(n)` in the nav). No GSAP.

## Accessibility

- WCAG AA for every text pair listed above; non-text frames are 3:1+.
- Focus: 3px frame-deep outline with 2px offset; pixel buttons draw a dashed
  ring inside themselves.
- Touch targets 40-56px; footer links have 44px rows.
- No horizontal scroll at 390px.

## Do's and Don'ts

### Do

- Put content in windows and dialog boxes; let the floor show between them.
- Use ink text on every pastel fill; coral-deep or mint-deep for colored text.
- Use the ▶ cursor, ▼ prompt, HP bar and status chips as the clinic's
  vocabulary for check-in, triage, treatment and discharge.
- Keep photos as photos, framed by pixel UI.
- Give every new graphic a reduced-motion state and a lightweight fallback.

### Don't

- Don't use Pokémon IP of any kind, or a red cross on white.
- Don't add rounded corners, blur shadows, gradients that read as gloss,
  neon or pure black / pure white.
- Don't set body copy, FAQs or legal text in a pixel face.
- Don't use negative letter-spacing on pixel faces.
- Don't animate with smooth springs or long glides on marketing chrome; use
  frames.
- Don't change the owner's wording, prices, policies or flows.
