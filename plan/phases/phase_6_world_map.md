# Phase 6 — World I: hex map, movement, Gather and Build, defenses

> Agent-facing brief. Ship without asking. Mirrors the canonical
> sibling (`phase_5_engine_core.md`): same module layout, TSDoc
> `@rule`, rule-tagged tests, `rules-lawyer` review before commit.
> Source: `spec/phases/phase-3-world.md` (map half). Rules: 3.x,
> 6.7, 6.9-6.15, 7.9 (range), 7.8 step 8 (adjacency), 12.1-12.2,
> 12.4; Issue 006 rulings in `OPEN-QUESTIONS.md`.

## Scope

Replace phase 5's abstract world with a real board: placed tiles,
figure and enemy positions, step-by-step movement, skirmishes,
Gather, Build (defenses only; base upgrades are phase 8), and
range-aware Combat. Enemy movement, spawning, Tower attacks,
structure attacks, exploration, and waves stay deferred to phase 7.

## New modules (canonical layout)

```
packages/engine/src/
├── map/
│   ├── tiles.ts        # TILE_SLOT_OFFSETS, placeTile, emptySlots, mapHex, isPassable  (@rule 3.1, 3.4, 10.1)
│   └── tiles.test.ts
├── movement/
│   ├── move.ts         # moveCost, legalMoves, nextToEnemy                               (@rule 6.7, 6.9, 6.15, 3.4, 3.7, 3.8)
│   ├── move.test.ts
│   ├── skirmish.ts     # startSkirmish, finishSkirmish                                   (@rule 6.10-6.14)
│   └── skirmish.test.ts
├── build/
│   ├── defenses.ts     # legalBuilds, buildDefense, damageDefense                        (@rule 12.1, 12.2, 12.4)
│   └── defenses.test.ts
└── gather/gather.ts (+ test)                                                             (@rule 6.7, 6.9)
```

## State additions

- `map: { tiles: { tile, center }[]; hexes: Record<"q,r", { terrain, site, tile }> }`
- `Player.hex`, `Enemy.hex` (axial), `defenses: { id, kind, hex, health }[]`
- `active`: the top-half effect being resolved — `{ kind: 'move', hexesLeft, ignoreEnemyCost }`
  or `{ kind: 'build', buildsLeft, costReduction }` — or null.
- `Exchange.skirmish: { hex, from } | null` (a skirmish reuses the exchange: 1 roll, Skills only).
- `phase: 'setup'` before round 1 for the setup tile choice.

## Actions (step-by-step)

- `placeTile { slot }` — setup 4.2 (and Explore 10.1 in phase 7): one of the empty slots next to a placed tile.
- `moveTo { q, r }` — one adjacent hex; `stopMoving`.
- `build { defense, q, r }`; `stopBuilding`.
- Skirmish: `assignDie` / `unassignDie` / `confirmAssignment` / `chooseTarget` (no cards, no reroll).

## Decisions made upfront — DO NOT ASK

- **Tile slots**: 7-hex tiles tessellate; the 6 slot offsets from a tile center are axial
  (2,1), (-1,3), (-3,2), (-2,-1), (1,-3), (3,-2). Base tile center (0,0); base hex = (0,0).
- **Setup tile (4.2)**: the player chooses its slot (proposed; same choice as 10.1).
- **Move cost**: 1 per hex; 2 when the destination is next to an enemy (6.9) unless the card
  ignores it (Blink). Entering an enemy hex needs the full cost (6.15) and starts a skirmish;
  a won skirmish moves the figure in and the remaining movement continues.
- **Blocked hexes for figures**: lake, mountain (3.4); a hex with another figure except the base
  (3.8 + row 16). Figures may enter Barricade and Tower hexes (only enemies are blocked).
- **Skirmish**: 1 roll of all action dice, Skill placement and targets as in 7.8 steps 6-7, but
  only the enemy in the entered hex can be targeted; then that enemy attacks once (6.12); guard
  gained in the skirmish is removed after it. A player at 0 health ends the run (14.2).
- **Gather**: the node on the player's hex gives `gatherAmount` + the card bonus; no node → 0
  (event). Gathering is impossible on a hex with an enemy (6.9; a figure never shares one).
- **Build**: on your hex or an adjacent hex (12.1); not on the base, lake, mountain, or an enemy
  hex (12.2); 1 defense per hex (physical edition, proposed); on a gathering node allowed
  (row 14). Cost = defense cost − card reduction (minimum 0). On the base hex itself, Build is a
  base upgrade: deferred to phase 8 (event). Architect builds twice.
- **Range** (Combat): the 7.9 skip uses the hex distance from the player to the nearest enemy
  (`combat.exchangeRange`); Skill targets must be within the Skill's range; "each enemy" Skills
  hit every enemy in range; enemies attack only when next to the player (7.8 step 8).
- **Enemies stay on their spawn nodes** this phase (movement is phase 7). Setup puts 1 grunt
  on each spawn node of the setup tile; elite spawn nodes only exist on core tiles (phase 7).

## Tests (rule-tagged)

- Map: slots tessellate (no overlap, adjacency), 4.2 setup slot choice, 3.4 impassable.
- Move: cost 1, cost 2 next to an enemy, Blink ignores it, 6.15 full cost into an enemy hex,
  3.8 one figure per hex except base, stop early.
- Skirmish: 6.11 one roll and Skills only, 6.12 enemy attacks, 6.13 win moves in, 6.14 loss
  stays and loses the move.
- Gather: node gives 2 + bonus; no node gives 0.
- Build: 12.1 hexes offered, 12.2 forbidden hexes, cost and reduction, can't afford → not offered,
  Architect twice, base hex → deferred upgrade.
- Combat: 7.9 skip when no enemy within 2 hexes; range limits targets; only adjacent enemies attack.
- Properties: no figure on lake/mountain; never 2 enemies or 2 figures (except base) on a hex;
  materials never negative; phase 5 properties still hold.
- Golden: regenerate `p5-three-rounds.json` (state shape changed; say so in the commit).
- `/debug`: plain SVG map (tiles, figure, enemies, defenses) + labels for the new actions.

## DoD

`pnpm verify` green, deploy green, `rules-lawyer` review addressed, RULES-COVERAGE rows added.
