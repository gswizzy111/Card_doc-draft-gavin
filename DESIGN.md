---
name: The Card Doc Clinic
description: Card restoration, grading prep and DIY kits presented as a calm, trustworthy card clinic with a retro pixel accent. Muted pastel cream, peach, coral and mint, sentence-case Bricolage Grotesque headings over a readable Atkinson Hyperlegible body, Silkscreen only for small labels, plain cream surfaces, 2px stepped-corner windows with small soft shadows, quick restrained motion, and real before and after photos framed in light pixel UI.
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
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 8vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
    textTransform: "none (sentence or title case, as written)"
  section:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25-1.5rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  button:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375-1.0625rem"
    fontWeight: 600
    letterSpacing: "0"
    textTransform: "none"
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
    fontFamily: "Silkscreen, ui-monospace, monospace (accent only)"
    fontSize: "0.6875-0.75rem"
    fontWeight: 400
    lineHeight: 1rem
    letterSpacing: "0.04em"
    textTransform: "uppercase"
rounded:
  everything: "0px"
  pill: "9999px (legacy only; do not add new pills)"
spacing:
  pixel: "2px (--px; every outline)"
  shadow-drop: "3px (--px-drop; beyond the outline)"
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
    outline: "2px frame @ 80% on panel, stepped corners"
    innerLine: "2px powder @ 45% on panel"
    shadow: "5px 5px 0 ink @ 13% (2px outline + 3px drop)"
  dialog:
    className: "px-window px-dialog (+ .px-dialog-next ▼ opt-in, .px-dialog-next-blink home hero only)"
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  card:
    className: "px-window-ink (ui/card)"
    backgroundColor: "{colors.panel}"
    outline: "2px ink @ 78% on panel, stepped corners, no inner line"
  button-primary:
    className: "px-btn / comic-btn / ui Button default"
    backgroundColor: "{colors.coral-fill}"
    textColor: "{colors.ink}"
    bottomEdge: "3px #C4665A"
    textTransform: "none"
    height: "40-48px"
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
    surface: "pale tint + 1px ink @ 22% hairline, 24px tall"
    use: "process explanations only (how it works, before/after)"
  night-band:
    className: "stage stage-light"
    backgroundColor: "{colors.night}"
    textColor: "{colors.stage-fg}"
  nav-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    height: "64px, 2px ink @ 80% bottom rule"
---

# Design System: The Card Doc Clinic

## Revision 2 (November 14, 2026): professional first, pixel as accent

The owner liked the clinic but found it a little too cartoony. The site now
reads as a trustworthy, premium card service with a retro pixel accent, not
a game. These rules override anything older below that disagrees.

- **Type.** Headings, nav and buttons use **Bricolage Grotesque**
  (`--font-heading`), in the case the source is written in: sentence or
  title case, never all caps. `globals.css` enforces this (unlayered): h1-h4
  and `.font-heading` drop `uppercase`, pixel text-shadows and wide tracking
  left on old call sites. **Silkscreen** (`--font-pixel`) is an accent only:
  eyebrow tags, status chips, tiny HUD labels, price hints, the big 404.
  Never a heading, never body copy, never a form label. Jersey 10 is gone.
- **Surfaces.** Plain floor cream and panel white. The tile floor art is
  retired (`.tile-floor`, `.page-glow`, `<TileFloor/>` are plain now); use
  `.faint-grid` in one or two places at most. Wall bands are a pale peach
  wash with a 4px trim line. Fewer boxes inside boxes; more whitespace.
- **Chrome.** Every outline is 2px (`--px`). Shadows are one soft tone (ink
  13%) falling 3px beyond the outline (`--px-drop`). Window frames are
  softened toward the panel. Buttons keep stepped corners and a 3px bottom
  edge but no top highlight, no caps and no wide tracking.
- **Props budget per page.** At most **one** small pixel illustration per
  page, and only where it earns its place (404, a success screen, the
  footer if a page opts in). No repeated Doc mascot, hopping hurt cards,
  "!" blinks or scattered sparkles. Pixel icons only where they label
  something (services, steps), at 32px or less beside text.
- **Gimmicks off by default.** No blinking ▼ (`<Window next>` is opt-in;
  `next="blink"` only on the home hero, if anywhere). Typewriter is off
  unless `animate`. Status chips and HP bars only where they explain the
  process (how it works, before/after). Decorative labels like "THE DOC",
  "FRONT DESK", "TREATMENT MENU" mostly go.
- **Motion.** Subtle and quick: reveals and entrances use a smooth ease-out
  (about 400ms, 10px), page changes a 240ms fade with a faint brightness
  lift. Stepped pixel motion only on small accents (the before/after sweep,
  HP fill). No idle loops on chrome (the ▶ cursor no longer nudges).
- **Keep:** the palette, the clinic idea, the home before/after card slider
  (PatientCard), the symptoms ticker under the hero, the Trusted by section,
  every word of the owner's copy, AA contrast, reduced motion, phone first.

## Direction (November 2026): the pixel healing center (first pass)

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

- **Bricolage Grotesque** (`--font-heading`, `.font-heading`, h1-h4,
  buttons, nav, prices): a confident grotesque with ink traps and optical
  sizes (the `opsz` axis is loaded, so big headlines tighten on their own).
  Weights 600-700; headings default to 650. Tracking -0.015em by default,
  -0.02em on display. Sentence or title case as written; never uppercase.
  Sub-1 `leading-*` on headings is lifted to 1.06 globally.
- **Atkinson Hyperlegible Next** (`--font-sans`): all body copy, forms, FAQs,
  form labels and legal text. Long text is never set in a pixel face.
- **Silkscreen** (`--font-pixel`, `font-pixel`, `.rx-label`, `font-mono`):
  the accent. Eyebrow tags, status chips, HUD text, table headers, price
  hints. 11-12px, uppercase, +0.04em. The only large use is the 404 numeral.
- Prices use lining figures (`lnum`), tables use tabular figures.

## Layout and surfaces

- **Floor:** plain `--floor` cream on `body`. `.tile-floor`,
  `.tile-floor-sm`, `.page-glow` and `<TileFloor/>` are plain cream (kept so
  old call sites work). `.faint-grid` is the opt-in texture: a 48px grid of
  ink at 4%. One or two places per site, not per page.
- **Wall band:** `.wall-band` / `<WallBand/>`: peach at 55% over the floor
  with a 4px trim line at the foot. Section header device; its `sprite` slot
  is opt-in and should usually stay empty. `.wall-trim` is the 4px trim
  line alone (footer top).
- **Night band:** `.stage .stage-light`: dusk with a very sparse, faint star
  tile.
- Square corners everywhere (`--radius: 0`). Stepped corners come from four
  offset box-shadows (`.px-frame`, `.px-window*`, `.px-btn`), so focus rings
  and overflow still work. `.px-corners` clips a solid fill instead.
- Prefer one container per idea: a window holding a list, not a window
  holding windows.

## Elevation

One soft shadow tone, `--px-shadow` (ink at 13%), offset down right by the
2px outline plus `--px-drop` (3px). No blur, no glow, no glossy gradients,
no film grain. `.comic-shadow*` draw 2-3px versions. Hover lifts are 2px.

## Components

- **Window** (`<Window/>`, `.px-window`): panel fill, 2px softened
  frame-blue outline with stepped corners, a quiet powder inner line, small
  soft shadow. `tone="ink"` for cards (`.px-window-ink`, used by
  `ui/card`; softened ink, no inner line), `tone="night"` for menus on the
  stage. `title` adds a small butter Silkscreen tab on the top edge; use it
  for labels that name something, not for decoration.
- **Dialog** (`variant="dialog"`, `.px-dialog`): a window that talks. The ▼
  is opt-in: `next` shows it still, `next="blink"` blinks it (home hero
  only). Pair with `<DocPortrait/>` only where the doc truly speaks
  (`<PageHero portrait>` on one page at most).
- **Pixel button** (`.px-btn`, tones `-mint -panel -butter -powder -ink
  -danger`; `pixelButton()` for links; `ui/button` variants map to tones;
  legacy `.comic-btn`, `.comic-btn-light`, `.comic-btn-ink`, `.btn-depth`):
  2px stepped ink outline, 3px darker bottom edge, Bricolage 600 in the
  label's own case; hover lightens in 100ms; presses down 2px. Sizes 40 /
  44 / 48px (`pixelButton` sm / md / lg; `.comic-btn` 52px, `-sm` 40px).
  Focus is a dashed ring drawn inside.
- **Inputs** (`ui/input`, `textarea`, `select`): panel fill, 2px ink border,
  inset top shade; focus turns the border frame-blue, adds a soft blue ring
  and a faint butter tint. Checkbox and radio are square; checked radio is a
  coral-deep square, checked checkbox mint.
- **Menus** (`ui/select`, `ui/dropdown-menu`, nav Explore): blue-framed
  windows; the highlighted row shows the ▶ cursor and a butter fill.
- **Status chip** (`<StatusChip/>`): CHECK-IN (powder), TRIAGE (butter), IN
  TREATMENT (coral wash), DISCHARGED (mint) as pale tints with a hairline,
  24px tall. Only where they explain the process (how it works,
  before/after).
- **HP / condition bar** (`<HpBar/>`): coral (low), butter (mid), mint (full)
  in a pale track with a 2px soft outline. Never shows a number. `animate`
  fills it in frames. Only beside before/after or process steps.
- **Menu cursor** (`<MenuCursor/>` in a `.menu-cursor-item`): ▶ shows on
  hover, focus, highlighted menu rows and the current page. It holds still.
- **Doc portrait** (`<DocPortrait/>`, xs-xl): the logo photo in a powder and
  frame-blue portrait box, optional small butter nameplate. The nav logo and
  footer use it; elsewhere, sparingly.
- **Heal sparkles** (`<HealSparkles/>`, 3 by default; success moments
  only): the art's mint sparkle sprite,
  twinkling through its frames while it rises in steps; a static scatter of
  full stars under reduced motion. It covers its `relative` parent and
  paints over in-flow content, so give it an empty decorative area (or put
  the content in a `relative z-[1]` box).
- **Typewriter** (`<Typewriter/>`): off by default (full text at once);
  `animate` opts one short line back in. Reduced motion and screen readers
  always get the full text at once.
- **Badges** (`ui/badge`): square, 2px softened ink border, 11px Silkscreen.
- **Form labels** (`ui/label`): Atkinson 14px semibold, not pixel caps.
- **Tabs** (`ui/tabs`): the active tab is a panel window in a muted tray.
- **Tables** (`ui/table`): muted header row with Silkscreen labels, ink rule.
- **Nav:** panel-white bar with a 2px soft ink rule under it; logo is
  `<DocPortrait size="xs"/>` + Bricolage wordmark; tabs get the ▶ cursor and
  a 2px coral-deep underline when active. Phone menu is a full-screen night
  panel with plain lists. `sprite` prop: opt-in slot beside the logo (empty).
- **Footer:** calm night band under a 4px trim line; portrait, name and the
  sign-off as plain text; a faint giant wordmark rises once. `sprite` is an
  opt-in slot for one small illustration (default none).
- **Page hero** (`<PageHero/>`): a small Silkscreen eyebrow in coral-deep
  with a square bullet, a sentence-case Bricolage headline, and the lead as
  a plain paragraph. `portrait` (opt-in) puts the lead in a window beside
  the doc's portrait; `sprite` (opt-in, desktop only) stands beside the
  headline. Most pages pass neither.
- **404** (`<NotFoundPanel/>`): big Silkscreen 404 with one hurt card sprite
  (`sprite`, default `<CardSprite variant="hurt" scale={3}/>`) and Next's
  words as a plain heading. The route skeleton has no sprite.
- **Preview banner:** a thin muted strip, ink-soft text, a small coral
  square.

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

Revision 2: subtle and quick. Entrances, scroll reveals and the headline
word rise use `--ease-out` (about 400ms, 10px of travel, 50ms stagger).
Page changes fade out in 160ms and in over 240ms with a faint brightness
lift. Stepped `steps()` motion stays only on small accents: the before/after
sweep, the HP fill, button press (one frame), the opt-in ▼ blink and sprite
loops. Chrome has no idle loops. The route indicator is a 3px mint-deep bar;
the skeleton pulses softly. Interaction feedback is instant (< 150ms). Under
`prefers-reduced-motion` every loop stops and pages cross-fade; everything
still looks finished. No GSAP.

## Accessibility

- WCAG AA for every text pair listed above; non-text frames are 3:1+.
- Focus: 3px frame-deep outline with 2px offset (kept at 3px even though
  chrome outlines are 2px); pixel buttons draw a dashed ring inside.
- Touch targets 40-56px; footer links have 44px rows.
- No horizontal scroll at 390px.

## Do's and Don'ts

### Do

- Lead with the photos and the words; let pixel details be the accent.
- Use plain cream and panel surfaces with generous whitespace; one
  container per idea.
- Use ink text on every pastel fill; coral-deep or mint-deep for colored text.
- Use the ▶ cursor, HP bar and status chips only where they explain check-in,
  triage, treatment and discharge.
- Keep photos as photos, framed by light pixel UI.
- Give every new graphic a reduced-motion state and a lightweight fallback.

### Don't

- Don't use Pokémon IP of any kind, or a red cross on white.
- Don't set headings, buttons or nav in all caps, or headings in a pixel face.
- Don't put more than one pixel illustration on a page, or scatter sprites,
  sparkles and "!" blinks around sections.
- Don't add blinking ▼ prompts, typewriter text or decorative labels
  ("THE DOC", "FRONT DESK") as default decoration.
- Don't use 3px+ outlines, hard dark shadows over 3px, rounded corners, blur
  shadows, gloss gradients, neon, or pure black / pure white.
- Don't set body copy, FAQs, form labels or legal text in a pixel face.
- Don't use negative letter-spacing on the pixel face.
- Don't change the owner's wording, prices, policies or flows.
