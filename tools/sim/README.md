# tools/sim

**Purpose:** Node CLI for batch bot runs (phase 9) and, later, config comparison reports
(phase 14).

**Usage:** `pnpm sim -- --runs 200 [--seed 1] [--config file.json] [--out runs.csv|runs.json]`.
Prints the summary (median end round against the 8-14 band, causes, milestones) and exits 1
if any run threw an error. Runs under plain Node (type stripping).

**Tests:** `src/run.test.ts` (determinism, summary maths, CSV).

Latest report: `docs/reports/phase-9-bot-batch.md`.
