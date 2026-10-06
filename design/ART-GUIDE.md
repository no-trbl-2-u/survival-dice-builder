# Art guide

The look of the Survival Dice-Builder prototype: **real-wood skeuomorphism** (2026-10-06),
readable at a glance, and built only from the assets in `ASSETS.md`. The UI phases (11-12)
use these tokens; the designer's own exports in `design/decisions.*` win on conflict.

- **Palette source:** [`tokens.json`](tokens.json). `apps/web/src/styles/tokens.css` carries
  the same values; `scripts/check-design.mjs` (part of `pnpm lint`) fails when they drift or
  when a contrast pair drops below its minimum.
- **Templates:** [`templates/`](templates/) — card, die net, tile, base board.
- **Mock-ups:** [`mockups/`](mockups/) — main screen, run summary; `wood-before/` and
  `wood-after/` are the screenshots either side of the real-wood pass.

## Direction: real-wood skeuomorphism

Source brief: [daisyUI trend, real-wood skeuomorphism](https://trends.daisyui.com/trend/real-wood-skeuomorphism/).
The game is a survival board game on a table, so the UI is the table.

| Layer | Material | Where | Recipe (`apps/web/src/styles/wood.css`) |
| --- | --- | --- | --- |
| Room | dark weathered planks | page background | `--tex-planks` under a dark wash, `--wood-table` |
| Board | oak slab, walnut frame | `.app` | `--tex-oak` under `--color-bg` at `--grain-mix` |
| Rail | carved dark plank | nav, Config save bar | planks + `--wood-rail`; labels in `--wood-rail-text` |
| Parchment | paper pinned with brass tacks | panels, cards, dialogs, Config sections | `--tex-paper` under `--color-surface` at 90% |
| Inlay | routed oak strip | phase bar, Skills, offers | `--tex-oak` under `--color-surface-raised`, `--groove` or `--bevel` |
| Felt | green baize in a walnut frame | map, dice tray, home tile mat | `--tex-felt` under `--felt` |
| Brass | aged brass plate | current nav item, primary buttons, Save config, turn badge | `--tex-brass`, class `.brass` / `.primary` |
| Dice | bone-white cube; enemy dice scorched walnut | dice tray | gradients + inset bevel |

- **Text never sits on raw grain.** Every texture is mixed under a solid scrim of its palette
  colour, so the contrast pairs in `tokens.json` still hold. Text on felt or the rail uses the
  fixed light colours (`#f3ead2`, `--wood-rail-text`).
- **Light vs dark:** light is oak by daylight; dark is walnut by lamplight. Only the palette
  and the shadow strengths change; the materials are the same.
- **Depth:** `--bevel` (raised edge), `--lift` (sits on the board), `--groove` (routed in).
  Buttons are wooden blocks that press in (`translateY(2px)` + `--groove`); checkboxes are
  wooden toggles in a carved track with a brass knob when on.
- **Motion:** physical and small: cards lift on hover, buttons press, the selected die rises.
  All of it is off under `prefers-reduced-motion`.
- **Textures:** CC0 from ambientCG (`assets/textures/`, ASSETS.md), 256-512 px WebP, about 50 kB
  in all.

## Palette

Light and dark themes follow `prefers-color-scheme`. Every pair below is checked in both.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `color-bg` | `#dcc49c` | `#26180e` | page |
| `color-surface` | `#f6ecd6` | `#362417` | panels, card faces |
| `color-surface-raised` | `#ead7b2` | `#4a3221` | dice, Skill slots, empty slots |
| `color-border` | `#7a5230` | `#a88358` | control and panel borders (3:1) |
| `color-text` | `#2a1a0d` | `#f3e4c6` | text |
| `color-text-muted` | `#5b3d22` | `#cbb48f` | secondary text (4.5:1) |
| `color-accent` | `#2f5d34` | `#9fd18a` | links, primary buttons |
| `phase-prepare` | `#2c4f86` | `#93b4f2` | Prepare: phase bar, card top band |
| `phase-combat` | `#9e2a1c` | `#f0907f` | Combat: phase bar, card bottom band |
| `phase-explore` | `#2f6a3a` | `#86d39e` | Explore: phase bar |
| `on-phase` | `#ffffff` | `#1a1008` | text on a phase colour (4.5:1) |
| `health` | `#a32a1c` | `#f0907f` | health pips and bars |
| `guard` | `#2c4f86` | `#93b4f2` | guard pips |
| `materials` | `#6e4512` | `#e6b86e` | materials count |
| `currency` | `#6b5200` | `#ecd26e` | currency count and card cost |
| `enemy-grunt` | `#7a3f10` | `#e6a66c` | grunt outline |
| `enemy-elite` | `#5e1f72` | `#d7a0e6` | elite outline |
| `legal-move` | `#8a3d00` | `#ffb347` | legal-move hex outline (3:1 on every passable terrain) |
| `terrain-*` | see tokens | see tokens | the 6 terrains (phase 4); every pair at least 20 apart (delta E) in each theme |

## Type

| Role | Family (OFL, ASSETS.md) | Fallback | Use |
| --- | --- | --- | --- |
| Display | Alfa Slab One (stamped, branded slab) | Rockwell, Georgia | titles, panel titles, phase names, band labels, Config plaques |
| Body | Bitter (variable slab serif) | Georgia | everything else |
| Numbers | Bitter, tabular figures | Georgia | health, costs, counts |

Self-hosted from the `@fontsource` npm packages (no request to Google at run time).

Scale (`--text-*`): xs 0.75rem, sm 0.875rem, md 1rem (body), lg 1.25rem, xl 1.5rem, 2xl 2rem.
Body text never below `sm`; numbers on the board never below `md`.

## Icons

game-icons.net SVGs drawn in `currentColor` (`assets/icons/`), sized by `--icon-sm` 16px
(inline with text), `--icon-md` 24px (panels, buttons), `--icon-lg` 40px (map sites, enemies,
dice). Icons on terrain use `tile-icon` (3:1 on every terrain).

## Readability rules

1. **Colour is never the only signal.** Each colour cue has an icon, a shape, or a label too.
2. **Card orientation:** the up half has its band on the top edge with "TOP · PREPARE" or
   "BOTTOM · COMBAT"; the other half is printed upside down. Band position + label + colour.
3. **Enemy type:** grunt = round outline + goblin icon; elite = square outline + ogre icon;
   the outline colours differ too.
4. **Health:** enemies, structures, and the base show `current/max` in numbers beside a bar or
   pips; never a bar alone.
5. **Phase:** the phase bar names all 3 phases; the current one is filled, has a ▶ marker,
   and the other two are outlined.
6. **Legal moves:** a thick `legal-move` outline plus the move cost written in the hex.
7. **Motion:** event-driven, skippable, off under `prefers-reduced-motion` (bearings).

## Do and don't

| Do | Don't |
| --- | --- |
| Pair every phase colour with its name | Show the phase by colour alone |
| Write `9/14` beside the elite's health bar | Show a bar with no number |
| Use the display font for labels on bands | Put body-size text on a coloured band |
| Keep icons at 24px or more on the map | Shrink site icons to fit more text |
| Use the templates' sizes for print (5 px per mm) | Stretch a template to a new aspect ratio |

## Acceptance still open

The spec asks that a first-time viewer identify card orientation, enemy type, and health at a
glance, checked with 2 people. That is a designer task (AUDIT `[needs-user-call]`), using the
mock-ups in `design/mockups/` or the live UI after phase 11.
