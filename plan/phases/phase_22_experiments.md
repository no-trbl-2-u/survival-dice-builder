# Phase 22 — Experiments: structural levers, experience curves, Skill caps, spawn pressure

> Agent-facing brief. Ship without asking. Source: `OPEN-QUESTIONS.md` rows 9 and 17 (designer
> 2026-10-04) and the structural rows 63-70 (2026-10-05), which the build plan requires this
> brief to answer first. `spec/` is not edited. Phase 21 (79bc77e) shipped the core loop v2
> Combat; this phase adds options and measures them. **No default changes:** every new option
> defaults to the phase 21 behaviour, so the 200-run default batch must be identical to phase 21.

## Outcome

1. Each structural question (rows 63-70) gets one proposed reading, built as a config option
   that defaults to off (the current rules). The designer turns a reading on by deciding the row.
2. The experiment options from rows 9 and 17 exist as config options.
3. `pnpm sim -- compare` reports what the designer needs (level by round, when the 20-miniature
   cap is first reached, causes), takes a seat count, and can run a turtle bot.
4. `docs/reports/phase-22-experiments.md` holds every comparison with one recommendation per
   row and the weak-bot caveat.

## Answers to the structural questions (rows 63-70)

Each row gets one proposed reading. Default values reproduce phase 21 exactly.

| Row | Problem | Proposed reading | Config option (default = off) | Experiment value |
|---|---|---|---|---|
| 63 | No clock: a run where nobody reveals a tile never ends. | **Forced reveal.** At round end, if no tile was revealed in the last N rounds and the tile deck is not empty, the top tile is revealed in the open slot nearest the base (ties: slot order). The round track shows when it is due, so nothing is hidden. | `clock.forcedRevealEvery: null` | 3 |
| 64 | Pressure depends on the map, not on the round. | **Spawn ramp.** Each spawn node spawns `1 + floor((round - 1) / N)` enemies per Combat. Extra spawns use the same spill-over and cap rules. | `spawn.rampEvery: null` | 4 |
| 65 | Exchange count follows deck size, and enemies attack every exchange. | **Each enemy attacks once per Combat.** An enemy that has attacked is tipped over (physical edition) and does not attack again until the next Combat start. | `combat.enemyAttacks: "every-exchange"` (other value `"once-per-combat"`) | `"once-per-combat"` |
| 66 | A tile revealed in Prepare spawns in the same round, so the explorer is pinned. | **New tiles wait one round.** A tile's nodes first spawn at the Combat of the round after its reveal. A marker on the new tile shows this. | `spawn.newTileDelay: 0` | 1 |
| 67 | Materials are a fixed budget; spent nodes leave Gather cards dead. | **Gather off a node gives 1.** Gather on a spent node, or off any node, gives `gather.offNodeAmount` materials. Nodes stay single-use. Tiles still raise the cap; this only removes dead cards. | `gather.offNodeAmount: 0` | 1 |
| 68 | Co-op does not scale pressure. | **Seat scaling.** With `spawn.perSeat` on, each node spawns 1 enemy per 2 seats, rounded up (1 for 1-2 seats, 2 for 3-4). Not 1 per seat: row 70 already says upkeep is too high. | `spawn.perSeat: false` | true (measured at 2 and 4 seats) |
| 69 | Players on the Base tile are never attacked (turtling). | **Adjacent enemies also attack players.** In a player's exchange, every enemy next to that player attacks, whatever its target. Movement and targets do not change. | `combat.adjacentAttack: "target-only"` (other value `"any-adjacent"`) | `"any-adjacent"` |
| 70 | Table upkeep: up to 13 placements every Combat. | **Spawn range.** Only nodes within N hexes of a player figure or a structure spawn. | `spawn.nodeRange: null` | 4 |

Rows 63-70 stay `proposed`. The report recommends which to turn on; the designer decides.
Each row's "Reading implemented" cell is updated to name the option and say "default off".

## Experiment options (rows 9 and 17)

| Experiment | How | New config |
|---|---|---|
| Experience steps of 3 | `experience.firstStep: 3`, `experience.stepIncrease: 3` | none (already config) |
| Steps of 5, extra experience for elites | `experience.eliteBonus: N` is added to the elite's experience on defeat | `experience.eliteBonus: 0` (experiment: 5) |
| 1 level for each elite that spawns | `experience.levelPerEliteSpawn: true`: every elite spawn (and every cap promotion to elite) raises the party level by 1, capped by `options.maxLevel` | `experience.levelPerEliteSpawn: false` |
| Skill caps 4, 6, 8 | `player.draftSlots` | none (already config) |

## Content (packages/content)

- `config.default.json`: add `clock`, `spawn`, `gather` blocks, `combat.enemyAttacks`,
  `combat.adjacentAttack`, `experience.eliteBonus`, `experience.levelPerEliteSpawn`, with the
  defaults above. Zod: `null` or a positive integer for the "every N" and range options.
- `config.meta.json`: label, help, and rules section for every new key. The help names the
  row (for example "Row 66: new tiles wait one round"). Each says "Off: the current rule."
- `docs/reports/phase-22/*.json`: one config file per experiment (partial configs merged over
  the default, the same way `--config` works now).

## Engine (packages/engine)

| Area | Change |
|---|---|
| `state/types.ts` | `version: 4`. Adds `PlacedTile.revealedRound`, `Enemy.attackedThisCombat` (boolean), `progress.lastRevealRound`, `progress.capReachedRound` (number or null). |
| `explore/explore.ts` | Records `revealedRound` and `lastRevealRound`. New `forcedReveal(state)` for row 63 (nearest open slot, then slot order). |
| `phases/advance.ts` | Round end: `forcedReveal` when due. Combat start: clears `attackedThisCombat`. |
| `enemies/spawning.ts` | `spawnCount(state, node)`: ramp (64), seats (68). `spawnNodes` filters by `newTileDelay` (66) and `nodeRange` (70). |
| `map/spawn.ts` | Records `capReachedRound` the first time a spawn promotes. |
| `combat/resolve.ts` | `exchangeAttackers`: `adjacentAttack` (69) and `enemyAttacks` (65). |
| `gather/gather.ts` | `offNodeAmount` (67) when not on a live node. |
| `progression/experience.ts` | `eliteBonus`. |
| `progression/levels.ts` + spawning | `levelPerEliteSpawn`: a level step per elite spawn. |
| `api/serialize.ts` | Accepts version 4 only. |

Every new function has TSDoc with `@rule` naming the row (for example `@rule core-loop-v2 row 66`).
No `Date`, no `Math.random`, no mutation.

## Bot and sim

- `packages/bot`: a `turtle` policy option: figures never leave the Base tile; otherwise the
  normal policy. It exists to measure rows 63 and 69. The default policy does not change.
- `tools/sim`:
  - `--seats <1-4>` for batch and compare (default 1), passed to `createGame` as `{ players }`;
  - `--policy <default|turtle>`;
  - `RunResult` adds `levelCurve` (level at each round start) and `capReachedRound`;
  - `compareTable` adds rows: median level at rounds 3, 6, 9; median round the cap is first
    reached (and how many runs reach it); end causes (already there).
- Turtle runs with no clock stall (`MAX_ACTIONS`); the report shows that as the row 63 finding,
  not as an error.

## The report (`docs/reports/phase-22-experiments.md`)

200 runs per config, seeds 1-200, all against `default`:

1. Structural, solo: each of rows 63-70 alone (row 68 at 2 and 4 seats; rows 63 and 69 with
   both the default and the turtle bot).
2. Structural, combined: rows 63 + 64 + 65 + 66 + 67 + 69 + 70 on together (the "all proposed"
   config), solo and at 2 seats.
3. Experience: steps of 3; steps of 5 with elite bonus 5; 1 level per elite spawn.
4. Skill caps: draft slots 4, 6 (default), 8.

Each section: the compare table, three lines of reading, and a recommendation (turn on, keep
off, or needs a playtest). The top of the report: a one-paragraph summary and the caveat that
the bot is weak (it builds few defenses and does not defend the base on purpose), so the
numbers are a floor. The 8-14 end-round band is the target.

## Web (apps/web)

- `/config` shows the new options with their help (from `config.meta.json`); no new pages.
- `/play`: a tile that waits one round (66) shows "Spawns from round N" in its tile label; a
  tipped enemy (65) shows "Attacked" in the map hex text. Run export version 4.
- `/decisions` and `docs/DECISIONS.md` regenerated (`pnpm sim -- decisions`).

## Decisions made upfront — DO NOT ASK

- **Defaults do not change.** The phase measures; the designer decides. The default 200-run
  batch must match phase 21 (median end round 6); a test pins the default summary.
- **One reading per row, not a menu.** Each row's candidates were weighed; the one with no
  hidden counter and the smallest table cost was picked (physical edition).
- **Row 63: forced reveal over edge spawns or a round cap.** Edge spawns put enemies next to the
  base with no warning; a round cap ends the run but does not add pressure. Forced reveal reuses
  the reveal rules.
- **Row 65: once per Combat over a fixed exchange count.** A fixed count would change every
  card's value; tipping a miniature is visible and cheap.
- **Row 67: off-node Gather for 1 over node recharge.** Recharge needs a per-node timer (hidden
  state). The minimum deck size stays 10.
- **Row 68: 1 per 2 seats, rounded up.** 1 per seat doubles row 70's upkeep at 4 seats.
- **Row 69: any adjacent enemy attacks** over "pull distance 0 on the Base tile", because it
  also covers players next to a Barricade or a Tower.
- **Forced reveal slot is picked by the engine** (nearest the base, then slot order) so bot runs
  stay deterministic; a player-chosen slot can follow if the designer decides row 63.
- **The turtle bot is a sim option only**, not a /debug or /play feature.
- **State and export version 4**, because the new state fields would break a version 3 save.

## Tests

- **Unit (engine):** each option on and off (off = phase 21 result on the same seed): forced
  reveal due and not due, empty deck; ramp counts by round; once per Combat with two exchanges;
  new tile waits one round; off-node Gather amount; seat scaling at 1-4 seats; any-adjacent
  attackers; node range; elite bonus; level per elite spawn; `capReachedRound`; version 4.
- **Property:** with every option off, a random seed gives the same final state as the phase 21
  golden replay.
- **Goldens:** re-recorded only for the version field (`UPDATE_GOLDEN=1`); a diff beyond the
  version is a bug.
- **Sim:** `--seats`, `--policy turtle`, the new compare rows; the default summary is pinned.
- **e2e:** `/config` shows one new option with its help; the full solo run still ends with "The
  base fell".

## Verify gate

`pnpm verify` (lint, typecheck, test:run, build, e2e), foreground, then `pnpm deploy:check`.
The report batches run before the gate, in foreground calls.

## Docs

- `OPEN-QUESTIONS.md` rows 63-70: reading names the option, "default off; measured in phase
  22"; rows 9 and 17 link the report.
- `RULES-COVERAGE.md`: one row per new option (row id -> function -> test).
- `plan/AUDIT.md`: the "Structural v2 questions" and "Balance after phase 21" rows point at the
  report.

## Commit body template

```
feat: structural levers and experiments — phase 22

- Rows 63-70: one proposed reading each, as a config option (default off)
- Experience and Skill-cap options (rows 9, 17)
- sim: --seats, --policy turtle, level curve and cap round in compare
- docs/reports/phase-22-experiments.md: <one line per section>
- Default batch unchanged: median end round <n>

Decisions:
- <calls made while building>

Closes #<phase issue>
```

## DoD

- [ ] Eight structural options and three experience options, all default off.
- [ ] Default batch identical to phase 21; goldens differ only by version.
- [ ] Sim seats, turtle policy, level curve, cap round.
- [ ] Report with every section and one recommendation per row.
- [ ] OPEN-QUESTIONS, RULES-COVERAGE, DECISIONS updated; verify and deploy gates green.

## Follow-ups (out of scope)

- Turning any option on by default (designer decides the rows).
- A player-chosen slot for the forced reveal.
- Upgraded Skill tiers (row 9), new tiles (row 57), elites (row 7).
