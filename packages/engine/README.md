# @survival/engine

**Purpose:** the pure rules engine for Spec v1. Pure functions over plain data: no classes, no
mutation of inputs, no I/O, no `Date` or `Math.random` (enforced by ESLint). Every export has
TSDoc naming its rule section (`@rule`). Rule numbers come from `GameState.config`, never from
literals.

## Public API

```ts
createGame(config, seed, content?)   // -> GameState at the first decision
legalActions(state)                  // -> Action[] (progress action first)
applyAction(state, action)           // -> { state, events }
serialize(state) / deserialize(text) // stable JSON (sorted keys)
```

Also exported: `canFire`, `experienceForLevel`, `levelForExperience`, hex helpers, and the
state, action, and event types.

**Decisions are step-by-step:** each `Action` is one atomic choice (play a card, keep a die,
put one die on one Skill slot, choose a target). Automatic steps resolve inside `applyAction`
and appear as `GameEvent`s, each with the rule id that produced it.

## Layout (the template for phases 6-8)

```
src/
  api/        createGame, legalActions, applyAction, serialize, actions
  state/      GameState types and small helpers
  rng/        mulberry32 (state lives in GameState.rng)
  deck/       draw, discard, rotate (7.1-7.2, 10.6)
  dice/       roll, keep, reroll
  skills/     canFire, Skill slot placement, fired uses
  combat/     card effects, Skill resolution, enemy attacks (7.8)
  phases/     the phase machine (advance)
  events/     the GameEvent union
  progression/ levels (8.3, 8.5)
  map/        tile placement and slots, passability, spawning with spill-over (3.x, 4.2, 9.8)
  movement/   step-by-step Move and skirmishes (6.7-6.15)
  build/      defense placement, cost, damage (12.1-12.4)
  gather/     Gather on a gathering node (6.7)
  enemies/    targets, pathing, movement, refill and waves, Towers and structure attacks (7.3-7.12, 9)
  explore/    tile reveal and the wave track (10.1-10.3, 18.1)
test/
  api.test.ts         rule-tagged scenario tests
  world.test.ts       map, Move, skirmish, Gather, Build, Combat range (phase 6)
  enemies.test.ts     enemy targets and movement, spawns, waves, Towers, structures, Explore (phase 7)
  properties.test.ts  fast-check invariants over random legal walks
  golden.test.ts      seed + actions -> expected state hash (golden/*.json)
  helpers/            scripted and random policies, walk()
```

Unit tests sit next to the code (`<module>.test.ts`). Test names start with the rule id.

## Scope (phases 6-7)

One player on a real hex map. A run starts in `setup`: the Base tile is at (0,0) and the
player chooses the setup countryside tile's slot (`placeTile`). Move and Build are decided one
step at a time (`moveTo` / `stopMoving`, `build` / `stopBuilding`) through `state.active`;
entering an enemy's hex starts a skirmish, which reuses `state.exchange` with `skirmish` set.
Combat is range-aware: an exchange is skipped with no enemy within `combat.exchangeRange`, Skills
hit only within their range, and only adjacent enemies attack.

Combat starts with refills, the wave step, enemy movement, and Tower attacks (7.3-7.6) and
ends with the structure attack step (7.10-7.12); the base at 0 health ends the run (14.1).
Explore reveals a tile for the player to place (`placeTile`), or raises the wave track when
the tile deck is empty.

Still deferred as `stepDeferred` / `effectDeferred` events: base upgrades and progression
(phase 8). The engine is solo-only until the co-op turn order lands in phase 13.

## Golden replays

`UPDATE_GOLDEN=1 pnpm test:run` regenerates `test/golden/*.json` after an intended rules
change; say why in the commit body.
