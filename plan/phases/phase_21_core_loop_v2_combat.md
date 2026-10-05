# Phase 21 — Core loop v2 II: enemies and Combat

> Agent-facing brief. Ship without asking. Source: `docs/design/core-loop-v2.md` (designer
> walkthrough 2026-10-04, "Combat" and "Experience, defeat, and the end") and the
> `OPEN-QUESTIONS.md` rows decided or proposed on 2026-10-04 (32, 35, 40, 53, 55, 56, 62).
> `spec/` is not edited. Phase 20 shipped the map, exploration, and Prepare; this phase
> finishes the loop. Phase 22 runs the experiments on top of it.

## Outcome

Combat runs as the walkthrough describes, and the run ends only when the base falls:
- The wave track goes. At each Combat start, after the decks turn: enemies move, then every
  spawn node gets 1 grunt and every elite spawn node 1 elite, on every revealed tile (spill-over
  when the node is occupied). Then each Tower attacks.
- Past the 20-miniature limit a spawn (grunt or elite) instead turns the grunt nearest the base
  into an elite (row 32).
- Enemies head for the nearest structure (Barricade, Tower, or the Base tile) and turn to a
  player only when the player is `rulings.playerPullDistance` (2) or more hexes nearer (row 56).
- In an exchange, only the enemies next to the player that have that player as their target
  attack.
- A Tower with 2 or more equally near enemies waits for its builder to choose (row 35). A
  Tower's defeat pays currency to its builder (rows 40, 53).
- Exchanges are not skipped when no enemy is near: heal, guard, and reroll halves (and guard
  or heal Skills) work; damage needs a target in range.
- A player at 0 health is knocked out: the figure leaves the map, every card goes to the
  discard pile, and the materials are lost. At the start of the next round the player puts the
  figure on a free Base tile hex with half health, rounded up (row 55, proposed).

## Content (packages/content)

- `config.default.json`:
  - remove `waveTrackStart` (no wave track);
  - add `rulings.playerPullDistance: 2` (row 56);
  - add `knockout: { returnHealthDivisor: 2, loseMaterials: true }` (row 55).
- `config.meta.json`: entries follow the keys above.

## Engine (packages/engine)

| Area | Change |
|---|---|
| `state/types.ts` | `version: 3`. Drops `waveTrack`, `vacantNodes`, `Enemy.home`. Adds `Player.knockedOut`, `Defense.builder`, `towerQueue` (Tower ids still to attack this Combat). `endedBecause` is `'base' \| null`. |
| `enemies/spawning.ts` | `spawnAtNodes`: 1 enemy per node per Combat (tile order, then hex order). `refillNodes` and `waveStep` go. |
| `map/spawn.ts` | At the limit both kinds promote the grunt nearest the base (row 32). No `home`. |
| `enemies/targets.ts` | `rankTargets` ranks players at distance + `playerPullDistance`; knocked-out figures are not targets. |
| `enemies/movement.ts` | `currentTarget(state, enemy)`: the target the enemy is next to or walking toward. |
| `enemies/structures.ts` | `towerStep`: attacks the nearest enemy; on a tie waits for `chooseTowerTarget`. |
| `combat/resolve.ts` | Exchange attacks only from adjacent enemies that target the player; 0 health knocks out (no run end). |
| `combat/knockout.ts` (new) | `knockOut`, `returnKnockedOut`. |
| `progression/experience.ts` | A Tower's defeat pays its builder. |
| `phases/advance.ts` | Combat start: turn decks, move, spawn, Towers. No 7.9 skip. Knocked-out players take no turns. Round start: returns, then the start-hex choice. |
| `api/actions.ts` | Adds `chooseTowerTarget {tower, enemy}`; `placeFigure` also in Prepare for a returning player. |
| `explore/explore.ts` | A revealed tile queues nothing: its nodes spawn at the next Combat start. |
| `api/serialize.ts` | Accepts version 3 only. |

## Bot and sim

- `packages/bot`: chooses the weakest enemy on a Tower tie; places a returning figure.
- `tools/sim`: causes are `base`, `stalled`, `error`. The 200-run batch is re-run and the
  numbers go in the commit body and `plan/AUDIT.md`.

## Web (apps/web)

- `/play`: the phase bar drops "Wave"; a knocked-out player shows "Knocked out" in the player
  panel and has no figure on the map; Tower choices read "Tower d1 shoots grunt e3"; the run
  summary says "The base fell". Run export version 3.
- `/debug`: describes `chooseTowerTarget` and the new events; no wave track in the state view.
- Event text for `playerKnockedOut`, `playerReturned`, `towerTieWaiting`.

## Decisions made upfront — DO NOT ASK

- **Pull distance is added to a player's distance**, so "2 or more nearer" wins ties toward the
  player via the existing tie-break (player first). `playerPullDistance: 0` restores 9.3.
- **An enemy's target is worked out from the board, not stored** (physical edition: no hidden
  counters): the first ranked target when next to it, else the target its route leads to.
- **Structure attack keeps "not next to a player"** as the walkthrough writes it: a figure next
  to an enemy shields the structures for that Combat.
- **The Tower tie is decided by the Tower's builder**, one Tower at a time, oldest first.
- **Knockout loses the materials at once** (same result as losing them on return) and puts
  hand, deck, and cards in play on the discard pile, so the round-end turn rebuilds the deck.
- **No free Base tile hex at the round start:** the player stays knocked out for that round.
- **No skip for an exchange without enemies.** The walkthrough lets heal, guard, and reroll
  halves work anywhere, so every exchange is played. No flag: 7.9's skip is replaced.
- **State and export version 3:** removed fields would break a version 2 save silently.

## Tests

- **Unit/integration (engine):**
  - spawning at every node every Combat, after moving; spill-over; limit promotion for grunt
    and elite spawns;
  - targeting: structure first, the 2-hex pull, pull 0, knocked-out figures ignored;
  - exchange: an adjacent enemy that targets the base does not attack;
  - exchanges run with no enemy near (guard, heal);
  - Tower tie waits for the builder's choice; the builder gets the currency;
  - knockout in Combat and in a skirmish; return at the next round with half health; no free
    hex; the run ends only by the base; version 3 serialize.
- **Goldens:** re-recorded on purpose (`UPDATE_GOLDEN=1`).
- **Bot:** a seeded run reaches the base-falls end.
- **e2e:** the full solo run ends with "The base fell"; flows that used the skipped exchange
  follow the new decisions.

## Verify gate

`pnpm verify` (lint, typecheck, test:run, build, e2e), foreground, then `pnpm deploy:check`.

## Docs

- `RULES-COVERAGE.md` rows for the Combat start order, targeting, spawning, Tower ties and
  currency, exchanges without enemies, knockout.
- `OPEN-QUESTIONS.md`: rows 32, 35, 40, 53, 55, 56 note phase 21 shipped; row 62 superseded.
- `docs/DECISIONS.md` regenerated (`pnpm sim -- decisions`).

## DoD

- [ ] No wave track anywhere (engine, config, UI).
- [ ] Every node spawns every Combat after enemies move; the limit promotes.
- [ ] Structure-first targeting with the pull distance; enemies attack only their target.
- [ ] Tower ties are a choice; Tower defeats pay the builder.
- [ ] Knockout instead of run end; the run ends when the base falls.
- [ ] Goldens, bot batch, export version 3; the verify gate and the deploy gate are green.

## Follow-ups (out of scope)

- Phase 22: experience curves, Skill caps, spawn pressure experiments.
- Elites (structure damage, ranged retaliation), Build versus Repair, new tiles.
