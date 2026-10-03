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
test/
  api.test.ts         rule-tagged scenario tests
  properties.test.ts  fast-check invariants over random legal walks
  golden.test.ts      seed + actions -> expected state hash (golden/*.json)
  helpers/            scripted and random policies, walk()
```

Unit tests sit next to the code (`<module>.test.ts`). Test names start with the rule id.

## Phase 5 scope

One player against an abstract enemy list: every enemy counts as next to the player. Map
effects (Move, Gather, Build) and map steps (7.3-7.6, 7.10-7.12, 10.1-10.5) resolve as
`effectDeferred` / `stepDeferred` events until phases 6-7; progression (XP, Shop, draft,
milestones) arrives in phase 8.

## Golden replays

`UPDATE_GOLDEN=1 pnpm test:run` regenerates `test/golden/*.json` after an intended rules
change; say why in the commit body.
