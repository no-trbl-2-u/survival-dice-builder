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
  progression/ XP and levels, supplies, Shop, base upgrades, Skill draft, milestones (8, 11, 17)
  map/        tile placement and slots, passability, spawning with spill-over (3.x, 4.2, 9.8)
  movement/   step-by-step Move and skirmishes (6.7-6.15)
  build/      defense placement, cost, damage (12.1-12.4)
  gather/     Gather on a gathering node (6.7)
  enemies/    targets, pathing, movement, refill and waves, Towers and structure attacks (7.3-7.12, 9)
  explore/    tile reveal and the wave track (10.1-10.3, 18.1)
test/
  api.test.ts         rule-tagged scenario tests
  coop.test.ts        2-4 players: setup, turn order, reveals, drafts, a 3-player run
  world.test.ts       map, Move, skirmish, Gather, Build, Combat range (phase 6)
  enemies.test.ts     enemy targets and movement, spawns, waves, Towers, structures, Explore (phase 7)
  progression.test.ts XP, Shop, upgrades, draft, milestones, end of run (phase 8)
  properties.test.ts  fast-check invariants over random legal walks
  golden.test.ts      seed + actions -> expected state hash (golden/*.json)
  helpers/            scripted and random policies, walk()
```

Unit tests sit next to the code (`<module>.test.ts`). Test names start with the rule id.

## Scope (phases 6-8)

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

Progression (phase 8): defeats pay shared experience and the killer's currency; levels add
dice; a Build on the base buys upgrades; the Shop sells at any decision while on the base;
even-round drafts while Training is open; milestones are recorded at 10.10 and at the end.
The engine is feature-complete for Spec v1 (Milestone 1).

Co-op (phase 13): `createGame(config, seed, content, { players: 1-4 })`. `state.current` is
the seat whose decision it is; `turnFresh` marks a new Prepare turn or Combat exchange.
Prepare alternates hands (16.8, `coopPrepareOrder`), Combat exchanges go in seat order
(16.4), Explore reveals 1 tile per player (16.6), and each player drafts (11.6).

## Golden replays

`UPDATE_GOLDEN=1 pnpm test:run` regenerates `test/golden/*.json` after an intended rules
change; say why in the commit body.
