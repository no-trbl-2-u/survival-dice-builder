# Phase 10 — Art direction and placeholder art (non-code)

> Agent-facing brief. Ship without asking. Source:
> `spec/phases/phase-B-art-direction.md`. Uses only the phase 3 assets in
> `ASSETS.md` (game-icons.net SVGs, project-owned blank face, OFL fonts).

## Outcome

A consistent, readable look the UI phases (11-12) build on: one token
source, verified contrast in light and dark, templates for every printed
component, and two mock-ups.

## Deliverables

```
design/
├── ART-GUIDE.md          # palette, type scale, icon sizes, readability rules, do/don't
├── tokens.json           # the palette, light + dark, and the contrast pairs to verify
├── templates/
│   ├── card.svg          # top half + upside-down bottom half, edge bands, level, cost
│   ├── die-net.svg       # the 6 faces on a d6 net (2D dice and 3D textures)
│   ├── tile.svg          # 7-hex tile with the 4 printed sites
│   └── base-board.svg    # base health track, upgrade tracks, Shop slots
└── mockups/
    ├── main-screen.svg   # map, player panel, hand, dice tray, Skill board, phase bar
    └── run-summary.svg   # end cause, round, milestones, curve
scripts/check-design.mjs  # contrast pairs >= AA; tokens.css matches tokens.json; templates
                          # reference only registered assets (runs in `pnpm lint`)
```

## Decisions made upfront — DO NOT ASK

- **Theme-neutral palette** (the setting is open): warm paper neutrals, the bearings phase
  colours (Prepare blue, Combat red, Explore green), terrain greens/browns kept from phase 4.
- **Fonts** (ASSETS.md, OFL): Oswald for display, Atkinson Hyperlegible Next for body,
  JetBrains Mono for numbers; system fallbacks until phase 11 self-hosts them.
- **Contrast**: text pairs >= 4.5:1, large text and icons/UI strokes >= 3:1, in both themes,
  checked by script from `design/tokens.json`. `apps/web/src/styles/tokens.css` is updated to
  the art guide and kept in sync by the same script.
- **Colour is never the only signal**: card orientation = band position + "TOP"/"BOTTOM"
  label + band colour; enemy type = icon + outline shape; health = pips with numbers.
- Templates embed icons with `<image href>` to files under `assets/`; the check script fails
  on any reference outside the register.
- The "2 people identify orientation, enemy type, and health at a glance" acceptance check is a
  designer task: an AUDIT `[needs-user-call]` row, not a blocker.

## DoD

`pnpm verify` green (the design check runs in lint), deploy green, AUDIT row filed.
