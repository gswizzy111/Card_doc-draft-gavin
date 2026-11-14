# Redesign brief: "The Card Doc Clinic" (pixel healing-center)

Owner's ask (Nov 2026): rebuild the whole public site so it is unmistakably The
Card Doc, not a copy of The Mint Workshop's comic look. The vibe is a
handheld-RPG (GBA / DS era) healing center: soft pixel art, chunky pixel
type, muted pastel colors that are NOT vibrant, cozy and friendly. The card
doctor runs a clinic where hurt cards get checked in, treated and sent home
healthy. Reference for mood and color only:
`/tmp/claude-0/-home-user-Card-doc-draft-gavin/b7ee8eef-9e3e-5bbf-8c43-a3bbd97a00be/images/1.png`
(a fan-game-style healing center screenshot). The site background does not
need to be a hospital room; it needs that pixel feel and that palette.

## Hard rules

- **Original artwork only.** No Pokémon names, characters (no Nurse Joy, no
  Chansey), Poké Balls (not even on floors), the Pokémon Center building or
  logo, game fonts, UI rips, or screenshots. Generic RPG conventions are fine:
  dialog boxes with a blinking ▼, HP/condition bars, a ▶ menu cursor, tile
  floors, a healing jingle sparkle, pixel sprites.
- **No Red Cross emblem** (red cross on white is legally protected). Use a
  pixel heart-plus, a rounded green/coral plus, or a card-with-plus.
- **The owner's wording never changes**, punctuation included (see
  `PRODUCT.md`). Keep every existing visible string. You may add short
  decorative UI labels that make no claim (e.g. `▶ CHECK-IN`, `ADMITTED`,
  `DISCHARGED`, `NEXT ▼`, `HP`), but never new facts, numbers, prices,
  ratings, promises or testimonials.
- **Appearance only.** Do not change logic, data fetching, props, handlers,
  routes, prices, policies, `lib/`, `app/api/`, `legal/`, or Supabase. You may
  restructure JSX and classes freely as long as every element, link, form
  field and behaviour keeps working.
- The logo image `/card-doctor.jpg` stays the brand mark (show it inside a
  pixel frame / portrait box; it is not to be pixelated or redrawn).
- Real customer card photos (before/after, testimonials) stay as photos,
  framed in pixel UI.
- Accessibility is not traded for style: WCAG AA contrast, visible keyboard
  focus, `prefers-reduced-motion` (pixel motion stops; everything still looks
  finished), touch targets >= 44px, no horizontal scroll at 390px.

## Palette (muted GBA pastel; exact tokens live in `app/globals.css`)

| Role | Hex | Notes |
|---|---|---|
| Floor cream (page) | `#F3EAC8` | main background |
| Floor tile line | `#E6D8A8` | checker / grid lines |
| Wall peach | `#F2CBA0` | section bands |
| Wall trim | `#E3A77A` | wainscot stripe |
| Counter coral (primary) | `#E07A6E` | fills, buttons |
| Coral deep (text-safe) | `#A9473F` | links/accent text on cream |
| Machine mint | `#9DD3B4` | secondary fill |
| Mint deep | `#3F7A63` | text-safe green |
| Powder blue | `#A9C8E8` | tertiary fill |
| Slate blue (dialog border) | `#5D7AA6` | dialog/window frames |
| Butter yellow | `#F1D77A` | highlights, seats |
| Panel white | `#FFFBEF` | windows, cards |
| Ink (outlines/text) | `#3B3040` | warm plum-charcoal, never pure black |
| Ink soft | `#6B5E6E` | secondary text |
| Night (dark sections) | `#2E2A3D` | deep dusk blue-plum for contrast bands |

Saturation stays low. No neon, no pure black, no pure white.

## Type

- Display / headings / buttons / nav / prices / labels: a free pixel font
  via `next/font/google` (e.g. **Pixelify Sans** for headings, **Silkscreen**
  or **Press Start 2P** only for tiny labels). Large, chunky, uppercase where
  it reads well.
- Body copy: a crisp, highly readable free sans (or the most readable pixel
  font at >= 18px) so long text, FAQs and legal pages stay comfortable. Long
  legal text must not be set in a pixel font.
- Keep lining figures for prices.

## Motifs (build these as reusable pieces in `components/pixel/`)

- **Window / dialog box**: panel-white fill, 2-tone pixel border (slate blue
  outer, white inner), stepped pixel corners. The core container. Dialog
  variant gets a blinking ▼ in the corner.
- **Pixel button**: chunky, stepped corners, 2px darker bottom edge, presses
  down 2px on tap; primary coral, secondary mint, ghost panel.
- **Condition / HP bar**: the healing metaphor. Before/after = low red-ish bar
  to full mint bar. Decorative only (no numbers that look like claims).
- **Status chips**: `CHECK-IN`, `TRIAGE`, `IN TREATMENT`, `DISCHARGED`.
- **Tile floor + wall band**: subtle checker floor pattern for the page,
  peach wall band with trim stripe as a section header device.
- **Healing station**: an original pixel machine with card slots that light
  up one after another (heal sequence) and a sparkle burst.
- **Doc portrait**: the logo photo inside a pixel portrait frame next to
  dialog-box copy, like an NPC talking.
- **Menu cursor**: ▶ appears beside the focused/hovered nav or list item.

## Motion

Pixel-honest motion: `steps()` easing for sprite loops, 2-frame idle bobs,
blinking ▼, healing sparkles rising, a short white "heal flash" between
pages, typewriter text only where short and only with motion allowed. Keep
interaction feedback instant (< 150ms). Everything respects
`prefers-reduced-motion`. Use Motion (`motion/react`) or CSS; no GSAP unless
a section truly pins/scrubs.

## Tech notes

- Next.js 16 here differs from older versions: read
  `node_modules/next/dist/docs/` before using an unfamiliar API.
- Sprites: inline SVG with `shape-rendering="crispEdges"` or PNG with
  `image-rendering: pixelated`. Keep total new asset weight small.
- A dev server is already running at http://localhost:3000 in preview mode.
  Do not start, stop or restart it. Look at your work with
  `node .claude/skills/preview-site/scripts/shoot.mjs <paths>` (set `OUT_DIR`
  to a folder of your own) and Read the PNGs.
- Do not commit; the lead commits.

## Revision 2 (owner feedback, Nov 14): "more professional, a little less cartoony"

The owner likes the direction. Keep the clinic idea, the muted palette, the
before/after card slider hero, the symptoms ticker and the Trusted by section.
Turn the cartoon volume down so it reads as a trustworthy, premium service
with a retro pixel accent, not a game. Rules for this pass:

- **Type:** headings move to a clean, confident sans (free, via next/font;
  not Inter) in mostly sentence/title case, not all-caps pixel everywhere.
  The pixel font becomes an accent only: small labels, status chips, the
  eyebrow tags, maybe prices or stat numbers. Body stays Atkinson Hyperlegible
  Next.
- **Calmer surfaces:** plain cream/panel backgrounds instead of the tile
  floor pattern (a very faint grid at most, in one or two places). Thinner
  borders (2px, not 3px) and smaller, softer pixel shadows. More whitespace,
  fewer boxes inside boxes.
- **Fewer props:** remove most sprites placed around sections (the Doc
  mascot repeated on pages, hopping hurt cards, "!" blinks, sparkles
  scattered everywhere, random icons beside headings). Keep at most one
  small pixel illustration per page where it earns its place (e.g. the
  footer, 404, success screens). Pixel icons only where they label
  something (services, steps), at a modest size.
- **Fewer gimmicks:** the blinking ▼ on dialog boxes goes away by default
  (keep it only on the hero dialog if anywhere); typewriter effects off;
  status chips and HP bars only where they explain the process (how it
  works, before/after), not as decoration on every card. Decorative labels
  like "THE DOC", "FRONT DESK", "TREATMENT MENU" mostly go.
- **Motion:** subtle and quick; stepped pixel motion only on small accents.
- Keep everything else from the brief: wording unchanged, appearance only,
  AA contrast, reduced motion, phone first, original art only.
