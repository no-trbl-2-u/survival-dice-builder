# Phase 7 — World II: enemies, base, exploration, wave track

> Agent-facing brief. Ship without asking. Mirrors the canonical
> sibling (`phase_5_engine_core.md`) and phase 6's layout. Source:
> `spec/phases/phase-3-world.md` (enemy half). Rules: 7.3-7.6,
> 7.10-7.13, 9.1-9.8, 10.1-10.5, 12.3-12.4, 14.1, 15; Issue 006
> rulings in `OPEN-QUESTIONS.md`.

## Outcome

The board fights back: enemies refill, march on the nearest target,
and batter structures; Towers shoot; Explore reveals tiles and, once
the tile deck is empty, the wave track grows. A solo run can now end
by the base falling (14.1) as well as by the player falling (14.2).

## Scope

- Combat setup (7.3-7.6): refill spawn nodes whose enemy was defeated,
  wave step, enemy movement, Tower attacks.
- Structure attack step (7.10-7.12) and base health; run ends at 0 (14.1).
- Explore (10.1-10.5): reveal + place a tile (forced default; optional
  and automatic as config 18.1), spawns on the new tile, wave track +1
  when the tile deck is empty, miniature limit and grunt-to-elite.
- `/debug`: wave track and base shown; labels for the new actions.

**Moved out:** co-op exchange order (16.4-16.8) ships with the co-op
hot-seat in phase 13, where multi-player state, decks, and turn order
are built together. The engine stays solo-only until then; the plan
row for phase 13 says so.

## New modules

```
packages/engine/src/
├── enemies/
│   ├── targets.ts      # structures, target list, nearest target with tie-break (@rule 9.3, 9.7, Table 7)
│   ├── pathing.ts      # BFS over enemy-enterable hexes, step toward a target  (@rule 9.4, 9.7, 3.4, 3.7)
│   ├── movement.ts     # moveEnemies (7.5)
│   ├── spawning.ts     # refill (7.3, 9.2), wave step (10.4, 10.5), miniature limit (15)
│   └── structures.ts   # towerAttacks (12.3), structureAttacks (7.11-7.12), damageBase (14.1)
└── explore/explore.ts  # reveal (10.1, 10.3, 18.1)
```

## State additions

- `Enemy.home?: Axial` — the spawn node that owns the enemy (9.2 refill);
  wave grunts have none.
- `waveTrack: number` (4.5, 15).
- `revealOffer: boolean` — optional exploration is waiting for the choice.

## Actions

- `placeTile { q, r }` — also in Explore (10.1).
- `revealTile` / `skipReveal` — optional exploration only.

## Decisions made upfront — DO NOT ASK

- **Enemy-enterable hex** = the 9.8 "empty hex": passable, not the base,
  no enemy, no figure, no defense (row 27). Enemies never enter a Tower
  hex either (proposed; a Tower is a target, so enemies stop next to it).
- **Nearest target** = straight hex distance; ties by `rulings.targetTieBreak`
  (player, Tower, Barricade, base), then lowest health, then id (row 15).
  An enemy goes for the nearest target it can reach; if every path to it is
  blocked it tries the next nearest (9.7, `blockedPathRule`). No reachable
  target → it waits. An enemy next to any target does not move (9.4).
- **Movement**: `combat.enemyMoveHexes` steps along a shortest path (BFS,
  `AXIAL_DIRECTIONS` order); enemies move in id order (oldest first).
- **Tower attack**: nearest enemy within 2 (Tower attack range); ties:
  lowest health, then id. Towers attack in id order.
- **Structure attack**: each enemy not next to a player attacks 1 adjacent
  structure: Barricade, then Tower, then base (7.12); ties by id. Damage per
  `rulings.structureDamage`: `v1` = 9.5/9.6 (default), `grunt-die` = grunt
  rolls 1 action die on Table 4, elite as 9.6 (row 7).
- **Refill (7.3)**: a spawn node or elite spawn node with no living enemy
  whose `home` is that node gets a new one (spill-over 9.8). Elite nodes
  refill too (row 21).
- **Wave step (10.4)**: once per wave point, 1 grunt per spawn node (not
  elite nodes), with spill-over. Miniature limit counts **grunts on the map**
  (`miniatureLimit`, proposed); a grunt the limit stops replaces the grunt
  nearest the base with an elite (10.5, row 13). The limit applies to every
  grunt placement (refill, Explore, wave), not only the wave step.
- **Explore**: forced = draw the top tile, the player chooses its slot from
  every empty slot next to a placed tile; automatic = the engine uses the
  first empty slot (closest to the base, then slot order); optional = the
  player chooses `revealTile` or `skipReveal`. Empty tile deck → wave +1 (10.3).
- **Experience and currency** for defeats stay phase 8.

## Tests (rule-tagged)

- Pathing: nearest target, tie-break order, a Barricade wall forces a detour
  or an attack, an enemy blocked by enemies switches target (9.7).
- Movement: 2 hexes, stops next to the target, never onto lake/mountain/base/
  Barricade/figure.
- Refill only when the node's enemy is defeated; elite node refills.
- Wave step count, spill-over, miniature limit and grunt-to-elite.
- Tower attack range and damage; structure priority; base to 0 ends the run.
- Explore: forced choice, automatic placement, optional skip, empty deck → wave.
- Properties: no enemy on lake, mountain, Barricade, base, or a figure hex;
  grunts never exceed the miniature limit; base health within 0..max.
- Golden: a full solo run to the end on the default config.

## DoD

`pnpm verify` green, deploy green, `rules-lawyer` review addressed,
RULES-COVERAGE rows added, OPEN-QUESTIONS rows for new readings.
