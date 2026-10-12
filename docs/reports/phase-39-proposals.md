# Phase 39 — the rows 63-70 proposals under engagements

> Bot comparison report for the proposals on /decisions (`packages/content/data/proposals.json`).
> 200 bot runs per column, seeds 1-200, engagements (the default Combat model, row 72). Column A
> is the standard rules; each other column turns on one row's option (the phase 22 config
> files in `docs/reports/phase-22/`). No rule or default changes: the proposals change only a
> player's local config.

## Summary

- **Row 63 (forced reveal)** ends the defender's stalls (26 -> 1 of 200) and leaves the median
  alone; the default bot does not stall, so it sees no change. Recommendation: turn on.
- **Row 64 (spawn ramp)** also ends the stalls and shortens the defender's runs (median 10 -> 9);
  the default bot's runs end before the ramp builds. Recommendation: needs a playtest.
- **Rows 65 and 69** act only under exchanges: every column is the same as A, run for run. The
  proposals keep their exchange-era recommendations and say so; /decisions shows no Try button.
- **Row 66 (new tiles wait a round)** gives the default bot one more round (6 -> 7) and cuts the
  defender's stalls to 7. Recommendation: turn on.
- **Row 67 (Gather off a node)** helps the default bot (6 -> 8) and breaks the defender (10 -> 23,
  157 stalled). The phase 22 "turn on" becomes "needs a playtest".
- **Row 68 (seat scaling), 4 seats:** the default bot ends 2 rounds sooner (5 -> 3); the
  defender still stalls in 134 of 200. Recommendation: keep off.
- **Row 70 (spawn range 4)** changes no median; placements per Combat fall a little. The table
  upkeep saving is a question for a playtest.

**Caveat:** both bots are floors, not forecasts; read the deltas between columns. "Stalled"
means the run reached the sim cap of 5000 actions per seat.

Column names: `rowNN-*` is `docs/reports/phase-22/rowNN-*.json`.

## 1. Default bot, solo

`pnpm sim -- compare --configs default,docs/reports/phase-22/row63-forced-reveal.json,docs/reports/phase-22/row64-spawn-ramp.json,docs/reports/phase-22/row65-once-per-combat.json,docs/reports/phase-22/row66-new-tile-delay.json,docs/reports/phase-22/row67-gather-off-node.json,docs/reports/phase-22/row69-any-adjacent.json,docs/reports/phase-22/row70-node-range.json --runs 200`

| | A: default | B: row63-forced-reveal | C: row64-spawn-ramp | D: row65-once-per-combat | E: row66-new-tile-delay | F: row67-gather-off-node | G: row69-any-adjacent | H: row70-node-range |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Runs | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 200 |
| Errors | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Stalled | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Median end round | 6 | 6 | 6 | 6 | 7 | 8 | 6 | 6 |
| Middle half | 6-7 | 6-7 | 5-6 | 6-7 | 7-8 | 7-10 | 6-7 | 6-7 |
| Range | 5-11 | 5-10 | 5-11 | 5-11 | 5-14 | 5-61 | 5-11 | 5-13 |
| Median level | 1 | 1 | 1 | 1 | 1 | 2 | 1 | 1 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 2 | 1 / 1 / 2 | 1 / 1 / 1 | 1 / 1 / 2 | 1 / 1 / 2 | 1 / 1 / 2 | 1 / 1 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 196 of 200 | 199 of 200 | 200 of 200 | 196 of 200 | 199 of 200 | 198 of 200 | 196 of 200 | 189 of 200 |
| Median round the limit is first reached | 6 | 6 | 5 | 6 | 6 | 7 | 6 | 6 |
| Causes | base 200 | base 200 | base 200 | base 200 | base 200 | base 199, stalled 1 | base 200 | base 200 |
| Enemy hits taken (all runs) | 4508 | 4367 | 3994 | 4508 | 3484 | 5933 | 4508 | 4959 |
| Enemy dice cancelled | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Health lost | 5093 | 4956 | 4597 | 5093 | 3965 | 6805 | 5093 | 5557 |
| Knock-outs | 155 | 145 | 159 | 155 | 111 | 221 | 155 | 174 |
| Enemies defeated | 708 | 695 | 547 | 708 | 518 | 1433 | 708 | 749 |
| Defenses built | 0 | 0 | 0 | 0 | 0 | 194 | 0 | 0 |
| Health repaired | 336 | 346 | 265 | 336 | 577 | 1051 | 336 | 444 |
| Upgrades bought | 529 | 527 | 510 | 529 | 624 | 996 | 529 | 526 |
| Placements per Combat | 5.12 | 5.18 | 6.14 | 5.12 | 4.65 | 4.40 | 5.12 | 4.83 |
| Spill-overs per Combat | 1.32 | 1.31 | 1.62 | 1.32 | 0.96 | 1.28 | 1.32 | 1.33 |
| Promotions per Combat | 1.51 | 1.56 | 2.36 | 1.51 | 1.59 | 1.39 | 1.51 | 1.30 |

## 2. Defender bot, solo

The same command with `--policy defender`.

| | A: default (defender bot) | B: row63-forced-reveal (defender bot) | C: row64-spawn-ramp (defender bot) | D: row65-once-per-combat (defender bot) | E: row66-new-tile-delay (defender bot) | F: row67-gather-off-node (defender bot) | G: row69-any-adjacent (defender bot) | H: row70-node-range (defender bot) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Runs | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 200 |
| Errors | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Stalled | 26 | 1 | 1 | 26 | 7 | 157 | 26 | 21 |
| Median end round | 10 | 10 | 9 | 10 | 10 | 23 | 10 | 10 |
| Middle half | 9-14 | 9-12 | 7-11 | 9-14 | 9-12 | 21-25 | 9-14 | 9-13 |
| Range | 6-45 | 6-26 | 6-35 | 6-45 | 6-44 | 8-49 | 6-45 | 7-45 |
| Median level | 4 | 3 | 3 | 4 | 3 | 8 | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 | 1 / 2 / 3 | 1 / 2 / 3 | 1 / 2 / 3 | 1 / 2 / 3 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 198 of 200 | 198 of 200 | 170 of 200 | 181 of 200 | 149 of 200 | 170 of 200 | 167 of 200 |
| Median round the limit is first reached | 8 | 8 | 6 | 8 | 8 | 12 | 8 | 8 |
| Causes | base 174, stalled 26 | base 199, stalled 1 | base 199, stalled 1 | base 174, stalled 26 | base 193, stalled 7 | base 43, stalled 157 | base 174, stalled 26 | base 179, stalled 21 |
| Enemy hits taken (all runs) | 10543 | 9529 | 9782 | 10543 | 8473 | 12462 | 10543 | 10426 |
| Enemy dice cancelled | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Health lost | 9112 | 8727 | 9222 | 9112 | 7850 | 12568 | 9112 | 9079 |
| Knock-outs | 205 | 205 | 294 | 205 | 202 | 148 | 205 | 212 |
| Enemies defeated | 7077 | 3942 | 3791 | 7077 | 4355 | 16133 | 7077 | 6820 |
| Defenses built | 815 | 889 | 706 | 815 | 787 | 4748 | 815 | 804 |
| Health repaired | 1202 | 975 | 888 | 1202 | 1139 | 4556 | 1202 | 952 |
| Upgrades bought | 279 | 284 | 274 | 279 | 371 | 1003 | 279 | 281 |
| Placements per Combat | 4.40 | 5.08 | 5.72 | 4.40 | 4.38 | 4.52 | 4.40 | 4.36 |
| Spill-overs per Combat | 1.04 | 1.19 | 2.14 | 1.04 | 1.18 | 1.23 | 1.04 | 1.04 |
| Promotions per Combat | 0.84 | 1.32 | 1.78 | 0.84 | 1.01 | 0.86 | 0.84 | 0.74 |

## 3. Row 68 at 4 seats

`pnpm sim -- compare --configs default,docs/reports/phase-22/row68-per-seat.json --seats 4 --runs 200`
(default bot), and the same with `--policy defender`.

### Default bot

| | A: default | B: row68-per-seat |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 30 | 19 |
| Median end round | 5 | 3 |
| Middle half | 4-6 | 3-4 |
| Range | 3-63 | 2-53 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 3 / 4 | 1 / 3 / 4 |
| Runs that reach the miniature limit | 197 of 200 | 199 of 200 |
| Median round the limit is first reached | 3 | 2 |
| Causes | base 170, stalled 30 | base 181, stalled 19 |
| Enemy hits taken (all runs) | 20751 | 16812 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 18391 | 16007 |
| Knock-outs | 406 | 367 |
| Enemies defeated | 5173 | 3683 |
| Defenses built | 0 | 0 |
| Health repaired | 4938 | 3577 |
| Upgrades bought | 471 | 423 |
| Placements per Combat | 7.14 | 8.88 |
| Spill-overs per Combat | 1.58 | 3.62 |
| Promotions per Combat | 2.67 | 3.52 |

### Defender bot

| | A: default (defender bot) | B: row68-per-seat (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 184 | 134 |
| Median end round | 24 | 23 |
| Middle half | 23-25 | 5-25 |
| Range | 3-30 | 2-36 |
| Median level | 15 | 15 |
| Median level at round 3 / 6 / 9 | 2 / 5 / 7 | 2 / 5 / 7 |
| Runs that reach the miniature limit | 198 of 200 | 200 of 200 |
| Median round the limit is first reached | 4 | 3 |
| Causes | base 16, stalled 184 | base 66, stalled 134 |
| Enemy hits taken (all runs) | 46427 | 46510 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 24226 | 27149 |
| Knock-outs | 141 | 445 |
| Enemies defeated | 35379 | 23919 |
| Defenses built | 1001 | 919 |
| Health repaired | 5229 | 5266 |
| Upgrades bought | 359 | 273 |
| Placements per Combat | 11.40 | 13.24 |
| Spill-overs per Combat | 2.22 | 5.23 |
| Promotions per Combat | 3.10 | 5.65 |

