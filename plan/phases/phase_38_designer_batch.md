# Phase 38 — A designer's batch

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "A designer's
> batch" (score 5.5, discovery pass 1), promoted via oversight 2026-10-11. Row 72 is decided
> (engagements are the default), so every batch runs under engagements unless a config says
> otherwise. No rule, config value, or default changes: this phase adds sim commands, counts,
> and named option sets.

## Outcome

1. `pnpm sim -- sweep --set <key>=<a,b,c> [--set <key>=<...>] [--seats 1,2,4]
   [--policy default,defender] [--base default|rec|exp|<file.json>] [--runs n] [--out file.md]`
   plays one batch per combination (every value of every `--set`, every seat count, every
   policy) and writes **one** markdown table: a row per batch with the values, seats, policy,
   median end round, middle half, stalled runs, and the play and upkeep counts. `--set` takes a
   dotted config path (`spawn.rampEvery`); values are numbers, `true` / `false`, `null`, or
   strings. An unknown path, or a value the config schema rejects, stops with an error.
2. `compare` takes N configs: `--configs default,rec,docs/reports/phase-22/row64-spawn-ramp.json`
   gives one column per config (A, B, C, ...). `--a` / `--b` still work (2 columns).
3. Every run's tally gains the table upkeep the bot cannot feel (row 70): `placements` (enemy
   miniatures put on the map: spawns plus elite swaps), `spillOvers` (spawns that went to the
   nearest empty hex, 9.8), `promotions` (a grunt swapped for an elite at the miniature limit,
   10.5), and `combats` (Combat phases played). Hits taken, health lost, knock-outs and
   cancelled dice are already counted (phase 36). `compare` and `sweep` print upkeep **per
   Combat** (placements, spill-overs, promotions over combats); CSV gets the new columns.
4. Named option sets in `tools/sim/src/optionSets.ts`:
   - `rec` — the rows 63-70 options phase 22 recommends that act under engagements: row 63
     `clock.forcedRevealEvery: 3`, row 66 `spawn.newTileDelay: 1`, row 67
     `gather.offNodeAmount: 1`.
   - `exp` — the options phase 22 left for a playtest that act under engagements: row 64
     `spawn.rampEvery: 4`, row 70 `spawn.nodeRange: 4`.
   - `pnpm sim -- --rec` / `--exp` plays the batch on that set; `rec` and `exp` are accepted
     wherever a config name is (`--a`, `--configs`, `--base`).
   - A test fails when any option in a set equals the shipped default (the set would silently
     measure the defaults), and when a set's key path is not a config key.

## Routes / API / CLI surface

- No routes, no engine or content change.
- `tools/sim/src/run.ts`: `Tally` gains `placements`, `spillOvers`, `promotions`, `combats`;
  `playRun` counts Combat phases; `upkeepPerCombat(summary)`.
- `tools/sim/src/optionSets.ts`: `OPTION_SETS`, `OptionSet`, `applyOptions(config, set)`,
  `setPath(config, path, value)`, `parseValue`.
- `tools/sim/src/sweep.ts`: `parseSet`, `sweepCells` (the cartesian product), `sweepTable`.
- `tools/sim/src/report.ts`: `compareTable(sides)` takes N sides.
- `tools/sim/src/cli.ts`: `sweep`, `compare --configs`, `--rec`, `--exp`.

## Tests

- `run.test.ts`: `addEvents` counts placements, spill-overs, promotions; `playRun` counts
  combats (one per round reached in Combat); pinned batches unchanged.
- `optionSets.test.ts`: every option differs from the default (drift guard); every path is a
  config key; `applyOptions` result passes `GameConfigSchema`; `setPath` rejects unknown paths
  and does not mutate its input; `parseValue` reads numbers, booleans, null, strings.
- `sweep.test.ts`: `parseSet` errors; `sweepCells` order and count (values x seats x
  policies); `sweepTable` header and one row per cell.
- `report.test.ts`: `compareTable` with 3 sides (header letters, row cells); upkeep rows.

## Decisions made upfront — DO NOT ASK

- Option sets live in the sim, not in content: they are measurement tools, not rules. Phase 39
  moves the presets into content (Zod-validated) for the web app; it can import or replace
  these.
- Row 65 (`combat.enemyAttacks`) and row 69 (`combat.adjacentAttack`) are "Exchanges only"
  (phase 37): under engagements they change nothing, so they are in neither set. Row 68 is
  "keep off" in phase 22, so it is in neither set.
- Phase 36 found row 67 far too strong under the defender; it stays in `rec` because `rec`
  records the phase 22 recommendation, and the sweep is the tool that re-measures it.
- A sweep runs 200 runs per cell by default, like every batch; a large sweep is slow by design
  (no worker threads in this phase).
- No `OPEN-QUESTIONS.md`, `RULES-COVERAGE.md`, or default changes; a bot sim option is not a
  rule.
