# tools/sim

**Purpose:** a Node CLI for batch bot runs (phase 9), config comparison and real-run timing
reports (phase 14), the playtest report numbers (phase 16), and sweeps (phase 38). Runs under plain Node (type
stripping). Relative paths resolve from where you run `pnpm sim`.

| Command | What it does |
| --- | --- |
| `pnpm sim -- --runs 200 [--seed 1] [--config file.json\|rec\|exp] [--rec\|--exp] [--policy default\|turtle\|defender] [--out runs.csv\|runs.json]` | Bot batch: median end round against the 8-14 band, causes, milestones, play totals. Exits 1 if any run threw. |
| `pnpm sim -- compare --a default --b file.json [--policy p] [--a-policy p] [--b-policy p] [--runs 200] [--out report.md]` | One bot batch per side, side by side, with play totals (hits, cancelled dice, defeats, defenses) and table upkeep per Combat. |
| `pnpm sim -- compare --configs default,rec,file.json [--policy p] [--runs 200] [--out report.md]` | The same, for 2 or more configs, a column each. |
| `pnpm sim -- sweep --set spawn.rampEvery=2,3,4 [--set key=a,b] [--seats 1,2,4] [--policy default,defender] [--base default\|rec\|exp\|file.json] [--runs 200] [--out report.md]` | A batch for every combination, as one table: end rounds, hits, health lost, knock-outs, cancelled dice, and placements, spill-overs and promotions per Combat. An unknown key or a value the config schema rejects stops the sweep. |
| `pnpm sim -- timing <export.json ...> [--out report.md]` | Minutes per round and time shares, from real run exports. |
| `pnpm sim -- playtests [--dir docs/playtests/runs] [--estimate 8.5] [--out report.md]` | Every playtest export against the 8-9 minutes-per-round estimate. |

A config is a JSON file, `default`, or a named option set from `src/optionSets.ts`: `rec`
(rows 63, 66, 67: the options phase 22 recommends that act under engagements) or `exp` (rows 64,
70: the options left for a playtest). A test fails when an option in a set equals the default.

**Tests:** `src/run.test.ts`, `src/report.test.ts`, `src/playtests.test.ts`,
`src/optionSets.test.ts`, `src/sweep.test.ts`.

Reports: `docs/reports/phase-9-bot-batch.md`, `docs/reports/phase-14-regression.md`,
`docs/reports/phase-36-defender.md`. A run stalls at 5000 actions per seat.
