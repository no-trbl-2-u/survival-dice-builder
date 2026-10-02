# Phase 5 — Engine core: cards, dice, Skills, phases

> Agent-facing brief. Concise, opinionated, decisive. Ship
> without asking; document any judgment calls in the commit
> body. **This phase establishes the canonical structure every
> later engine phase (6, 7, 8) mirrors.** Spend extra care here.
>
> Source spec: `spec/phases/phase-2-engine-core.md`. Its
> acceptance criteria are part of this phase's DoD. Rules:
> `spec/01-spec-v1-rules.md` sections 5, 6.1–6.6, 7, 9.5–9.6,
> 10.6–10.7. Reference only: `spec/reference/simulator-engine-issue-004.js`
> (dice keep logic, Skill assignment) — do not port it.

## Public surface (locked in `bearings.md`)

```ts
createGame(config: GameConfig, seed: number): GameState
legalActions(state: GameState): Action[]
applyAction(state: GameState, action: Action): { state: GameState; events: GameEvent[] }
serialize(state: GameState): string
deserialize(text: string): GameState
```

This phase runs one player against an abstract enemy list (no
map). Map effects (Move, Gather, Build) emit events and change
no board state; phase 6 replaces the stubs.

## Module layout (the template)

```
packages/engine/
├── README.md                    # purpose, public API, tests, rule sections covered
├── src/
│   ├── index.ts                 # re-exports the 5 API functions + public types only
│   ├── api/                     # createGame, legalActions, applyAction, serialize
│   ├── state/                   # GameState, Player, Phase, Decision types
│   ├── rng/                     # mulberry32: next(rng) -> [value, rng]; no hidden state
│   ├── deck/                    # drawHand, playTop, rotateDeck, shuffle (uses rng)
│   ├── dice/                    # rollDice, rerollUnkept, keep
│   ├── skills/                  # canFire, assignDice, resolveSkill
│   ├── combat/                  # exchange steps (7.8), enemyAttack
│   ├── phases/                  # nextPhase, round sequence (section 5)
│   └── events/                  # GameEvent union; every event has { type, rule, ...payload }
└── test/
    ├── helpers/arbitraries.ts   # fast-check arbitraries: seeds, configs, legal action walks
    ├── helpers/walk.ts          # play N random legal actions from a seed (used by properties)
    ├── golden/                  # { seed, config, actions[], expectedHash } JSON
    └── golden.test.ts           # replays every golden file and compares SHA-256 of serialize()
```

One folder per rule area. Each folder: `<name>.ts` (pure
functions), `<name>.test.ts` (rule-tagged unit tests), and
`<name>.property.test.ts` where a spec property applies.
**Every later engine phase adds folders in this shape**
(`map/`, `enemies/`, `defenses/`, `explore/`, `waves/`,
`progression/`, `shop/`, `draft/`, `endgame/`).

## Code conventions (copied by every later phase)

- Every exported function and type has TSDoc: what it does,
  inputs, outputs, and `@rule <id>` (several allowed).
- Functions take state and return new state; never mutate
  inputs. Use readonly types on public state.
- Randomness only through `rng/`; the rng state is a field of
  `GameState`, threaded through return values.
- Every rule number is read from `state.config` (content
  package types); no literals for rule values.
- Decisions: `state.pending` describes what the engine waits
  for; `legalActions` derives from it. Automatic steps loop
  inside `applyAction` until the next decision, emitting events.
- Illegal action passed to `applyAction`: throw
  `IllegalActionError` with the rule id and the pending
  decision (the UI only offers legal actions, so this is a bug
  signal, not a game state).

## Key functions (from the spec)

`drawHand`, `playTop`, `rotateDeck`, `rollDice`,
`rerollUnkept`, `canFire(faces, need)`,
`assignDice(faces, skills, choice)`, `resolveSkill`,
`enemyAttack`, `nextPhase`.

## Tests (the template)

| Kind | Where | Naming |
|---|---|---|
| Unit | `<folder>/<name>.test.ts` | test name starts with rule id: `"7.8 keep dice between rolls"` |
| Property | `<folder>/<name>.property.test.ts` | name the invariant: `"cards are conserved"` |
| Golden | `test/golden/*.json` + `golden.test.ts` | file name: `<phase>-<what>.json` |

Required this phase:

- Property: owned cards conserved (deck + hand + discard + in-play = owned) through any legal-action walk.
- Property: `canFire` with Stars never uses one Star for two faces.
- Property: health never exceeds maximum.
- Golden: `p5-three-rounds.json` — 3 rounds, fixed seed, reproduces the same hash.
- Unit: every rule in 5.x, 6.1–6.6, 7.1–7.2, 7.8, 9.5–9.6, 10.6–10.7.

## RULES-COVERAGE.md (the template)

Append one row per rule covered:

```
| Rule | Function(s) | Test(s) |
|---|---|---|
| 7.8 | combat/exchange.ts `resolveExchange` | combat/exchange.test.ts "7.8 ..." |
```

A rule implemented without a row is a failed gate (the
`rules-lawyer` review catches it).

## Review step (every engine phase)

Before running `pnpm verify`, spawn `rules-lawyer` with the
list of rule ids this phase covers and the changed files. Fix
every `violation` it returns. `unclear` items go to
`OPEN-QUESTIONS.md` with a proposed reading and a config flag.

## Decisions made upfront — DO NOT ASK

- RNG: mulberry32, seeded with the game seed; rng state = one uint32 in `GameState`.
- Shuffle: Fisher-Yates using the engine rng.
- Serialization: stable JSON (sorted keys) so hashes are deterministic.
- Star assignment: when the player assigns dice, the action carries the explicit face each Star counts as; `legalActions` enumerates valid assignments (dedupe equivalent ones).
- Skill uses per Combat: once each by default; `config.skillUses = "unlimited"` flag per the rules section 18.
- Enemy list for this phase: `state.enemies` with `{ id, kind, health }` and no hex; attacks follow the grunt (fixed 2) and elite (6 dice) rules.
- Events are append-only in the returned `events` array; `state.log` keeps the last 200.

## Pages × tests matrix

| Surface | Unit | Property | Golden |
|---|---|---|---|
| deck | draw, play top, rotate, quick Prepare (10.6) | conservation | 3 rounds |
| dice | roll, keep, reroll up to 3 | faces in range | 3 rounds |
| skills | canFire, assign, resolve | Star never double-counted | 3 rounds |
| combat | exchange order, guard, heal, enemy attacks | health ≤ max | 3 rounds |
| phases | Prepare → Combat → Explore → next round | phase sequence valid | 3 rounds |

## Verify gate

```bash
pnpm verify
```

## Commit body template

```
feat: engine core — phase 5

- <what shipped, by folder>
- Rules covered: <ids>; RULES-COVERAGE.md +<n> rows
- Tests: <unit n, property n, golden n>

Canonical sibling for every later engine phase.

Report (spec 2): <acceptance criteria results>
Open questions: <ids added to OPEN-QUESTIONS.md, or none>

Decisions:
- <calls made>
```

## DoD

Spec 2 acceptance criteria pass. Flip Phase 5 in the build plan
with the commit hash; add to "Phase log". `pnpm deploy:check`
green (the site is unchanged, but the gate still runs).

## Follow-ups (out of scope this phase)

- Map, movement, Gather/Build effects (phase 6).
- Enemy movement, base, waves, exploration (phase 7).
- XP, Shop, upgrades, draft, end of run (phase 8).
