# Phase 14 — regression re-run of the 200-run bot batch

200 bot runs, seeds 1-200, default config, `@survival/bot` policy, at the phase 14 commit.
Reproduce with `pnpm sim -- --runs 200 --out regression.csv`.

## Result

| Measure | Phase 9 | Phase 14 |
| --- | --- | --- |
| Runs / errors / stalled | 200 / 0 / 0 | 200 / 0 / 0 |
| Median end round | 14 | 14 (target band 8-14: inside) |
| Middle half | 10-17 | 10-17 |
| Range | 9-25 | 9-25 |
| Cause | base 117, player 83 | base 117, player 83 |
| Median level | 2 | 2 |

The per-run CSV is **byte-identical** to
[`phase-9-bot-batch.csv`](phase-9-bot-batch.csv), so it is not committed again. The only
engine change since phase 9 is phase 13 (co-op hot-seat). This run confirms it left solo play
unchanged: every seed ends in the same round, for the same cause, with the same curves.

Milestones (runs that reached each): survive to round 5: 200; buy 3 upgrades: 200; survive to
round 10: 181; survive to round 15: 81; defeat an Elite: 90.

## Comparing configs and reading real timing

- `pnpm sim -- compare --a default --b <config.json> [--runs 200] [--out report.md]` runs one
  bot batch per config and prints a markdown table: runs, errors, median end round, middle
  half, range, median level, and causes.
- Bot runs have no wall clock, so minutes per round come only from real run exports. Save a run
  from `/play` (the "Save run" or "Download run" button), then run
  `pnpm sim -- timing <export.json ...> [--out report.md]`. It reports the median minutes per
  round, and each phase's and each decision type's share of the time.
- Time while the tab is hidden still counts (a table pause is part of a session). It is listed
  under the phase it happened in.
- The time between saving a run and loading it again is not counted.

No AUDIT row is needed: the median stays inside the band.
