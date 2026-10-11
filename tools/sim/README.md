# tools/sim

**Purpose:** a Node CLI for batch bot runs (phase 9), config comparison and real-run timing
reports (phase 14), and the playtest report numbers (phase 16). Runs under plain Node (type
stripping). Relative paths resolve from where you run `pnpm sim`.

| Command | What it does |
| --- | --- |
| `pnpm sim -- --runs 200 [--seed 1] [--config file.json] [--policy default\|turtle\|defender] [--out runs.csv\|runs.json]` | Bot batch: median end round against the 8-14 band, causes, milestones, play totals. Exits 1 if any run threw. |
| `pnpm sim -- compare --a default --b file.json [--policy p] [--a-policy p] [--b-policy p] [--runs 200] [--out report.md]` | One bot batch per side, side by side, with play totals (hits, cancelled dice, defeats, defenses). |
| `pnpm sim -- timing <export.json ...> [--out report.md]` | Minutes per round and time shares, from real run exports. |
| `pnpm sim -- playtests [--dir docs/playtests/runs] [--estimate 8.5] [--out report.md]` | Every playtest export against the 8-9 minutes-per-round estimate. |

**Tests:** `src/run.test.ts`, `src/report.test.ts`, `src/playtests.test.ts`.

Reports: `docs/reports/phase-9-bot-batch.md`, `docs/reports/phase-14-regression.md`,
`docs/reports/phase-36-defender.md`. A run stalls at 5000 actions per seat.
