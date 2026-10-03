# Phase 4 — Content and data model + tile proposals

> Agent-facing brief. Ship without asking; document calls in the
> commit body. Source spec: `spec/phases/phase-1-content.md` (its
> acceptance criteria are the DoD). Rules: Issue 006 draft, plus
> `OPEN-QUESTIONS.md` rows marked `decided`.

## Scope

All rule numbers and game content live in validated JSON, not code.

## Outputs

```
packages/content/
├── data/
│   ├── config.default.json     # every rule number + section 18 flags + designer-ruling flags
│   ├── cards.json              # starter (Table 2) + supplies L1-L3 (Table 8)
│   ├── skills.json             # starter (Table 3) + supplies L1-L3 (Table 9)
│   ├── enemies.json            # Table 5 + enemy die results (Table 4)
│   ├── defenses.json           # Table 7
│   ├── upgrades.json           # Table 6
│   └── tiles.json              # 9 proposed tile layouts (Broken Village, 3 countryside, 5 core)
├── src/
│   ├── schemas/<kind>.ts       # one Zod schema + inferred type per kind
│   ├── schemas/<kind>.test.ts  # valid + invalid fixtures
│   ├── load.ts                 # loadContent(raw) -> { ok, content } | { ok: false, errors[] }
│   ├── load.test.ts            # every error names file + field path
│   ├── content.ts              # defaultContent (validated at import; throws with all errors)
│   └── index.ts
packages/engine/src/progression/levels.ts (+ test)   # levelForXp(xp, config) @rule 8.3, 8.5
apps/web/src/router.tsx                              # tiny hand router: "/" and "/tiles"
apps/web/src/tiles/TileSheet.tsx, TileView.tsx (+ tests)
apps/web/e2e/tiles.spec.ts
```

## Decisions made upfront — DO NOT ASK

- **Effects are data**: a card half / Skill effect is a tagged union
  (`{ kind: "move", hexes, ignoreEnemyCost? }`, `{ kind: "damage", amount, range, target: "one" | "each" }`, ...).
  The engine interprets them (phase 5+); content only describes.
- **Tile hex order**: index 0 = center, 1-6 = `AXIAL_DIRECTIONS` order.
- **Tile constraints validated in the schema** (Table 1 + spec 1): base tile has the base at
  center and 2 gathering nodes; countryside has 1 spawn node and 1-2 gathering nodes; core has
  the elite spawn node at center, 1 spawn node, 1 gathering node; at most 1 lake-or-mountain
  per tile, never on the center hex; no site on lake or mountain.
- **XP thresholds** (8.5): level 2 at 5; each step is 5 more than the last (steps 5, 10, 15...;
  cumulative 5, 15, 30, 50). Config: `experience.firstStep`, `experience.stepIncrease`.
- **Supply copies**: Tables 8-9 list each card/Skill once; default 1 copy each, config
  `supplies.copiesPerCard` (open question).
- **Starter deck presets** (18.1: 6/3, 8/4, 10/5): the 8 and 10 presets add Move 2 / Gather
  pairs (open question, proposed reading).
- **Designer rulings** become config flags with the decided defaults (OPEN-QUESTIONS rows 1-15).
- **Rule 3.8 vs 4.6**: the base hex is exempt from the 1-figure limit (open question, proposed).
- **Router**: 25-line hand router on `window.location.pathname` (no dependency); recorded in
  bearings.
- **Tile sheet** at `/tiles`: one SVG per tile, terrain colour + site icon from `assets/icons/game`
  (inlined SVG via Vite `?raw`), terrain legend, tile names. Designer review is async
  (AUDIT `[needs-user-call]`).
- **The "config changes the game" test**: `levelForXp` reads `config.experience`; a test edits
  the config and the level changes. No engine numbers are hardcoded.

## Tests

- Schema: each table's content validates; invalid fixtures fail with a clear path
  (e.g. a Skill with 0 faces -> `skills.json: skills[3].faces: must have at least 1 face`).
- Tiles: all 9 pass the constraint checks; a tile with a lake on the center fails.
- Engine: `8.5 level thresholds`, config-override test.
- Web: TileView renders 7 hexes + site icons; e2e `/tiles` shows 9 tiles (63 hexes), no console
  errors, 375px no horizontal scroll; `/` still works.

## DoD

Spec 1 acceptance criteria; RULES-COVERAGE rows for every table encoded; `pnpm verify` green;
deploy green; `/tiles` live.
