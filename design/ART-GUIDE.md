# Art guide

The look of the Survival Dice-Builder prototype. Theme-neutral (the setting is still open),
readable at a glance, and built only from the assets in `ASSETS.md`. The UI phases (11-12)
use these tokens; the designer's own exports in `design/decisions.*` win on conflict.

- **Palette source:** [`tokens.json`](tokens.json). `apps/web/src/styles/tokens.css` carries
  the same values; `scripts/check-design.mjs` (part of `pnpm lint`) fails when they drift or
  when a contrast pair drops below its minimum.
- **Templates:** [`templates/`](templates/) — card, die net, tile, base board.
- **Mock-ups:** [`mockups/`](mockups/) — main screen, run summary.

## Palette

Light and dark themes follow `prefers-color-scheme`. Every pair below is checked in both.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `color-bg` | `#f7f5f0` | `#15140f` | page |
| `color-surface` | `#ffffff` | `#1f1d17` | panels, card faces |
| `color-surface-raised` | `#ece7dc` | `#2b2920` | dice, Skill slots, empty slots |
| `color-border` | `#857c69` | `#8f8775` | control and panel borders (3:1) |
| `color-text` | `#1d1b18` | `#ece8de` | text |
| `color-text-muted` | `#5a5448` | `#b3ac9c` | secondary text (4.5:1) |
| `color-accent` | `#2a59b3` | `#8fb0f0` | links, primary buttons |
| `phase-prepare` | `#2a59b3` | `#8fb0f0` | Prepare: phase bar, card top band |
| `phase-combat` | `#b02d26` | `#f08a80` | Combat: phase bar, card bottom band |
| `phase-explore` | `#2a7344` | `#7fcf98` | Explore: phase bar |
| `on-phase` | `#ffffff` | `#15140f` | text on a phase colour (4.5:1) |
| `health` | `#b02d26` | `#f08a80` | health pips and bars |
| `guard` | `#2a59b3` | `#8fb0f0` | guard pips |
| `materials` | `#7a5414` | `#e0b46a` | materials count |
| `currency` | `#7a5f00` | `#e8cf6a` | currency count and card cost |
| `enemy-grunt` | `#7a4312` | `#e0a46a` | grunt outline |
| `enemy-elite` | `#6b1f7a` | `#d29be0` | elite outline |
| `legal-move` | `#8a3d00` | `#ffb347` | legal-move hex outline (3:1 on every passable terrain) |
| `terrain-*` | see tokens | see tokens | the 6 terrains (phase 4) |

## Type

| Role | Family (OFL, ASSETS.md) | Fallback | Use |
| --- | --- | --- | --- |
| Display | Oswald | Arial Narrow, system sans | titles, phase names, card names, band labels |
| Body | Atkinson Hyperlegible Next | system UI sans | everything else |
| Numbers | JetBrains Mono | ui-monospace | health, costs, counts (tabular) |

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
