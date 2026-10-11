# Phase 36 — a defending bot: the defender against the default bot, rows 63-70, defeated dice, draft pool

> Bot comparison report. 200 bot runs per side, seeds 1-200, engagements (the default Combat
> model, row 72). The defender (`--policy defender`, `packages/bot/src/defender.ts`) stays near
> the base, builds Towers and Barricades next to it, repairs it, picks targets to defeat enemies
> before their dice hit, keeps its heal cards across engagements, and buys Training before Shop.
> The default bot gathers, explores, and buys upgrades. No rule or default changes in this
> phase: every table is the current game.

## Summary

- **The defender lasts longer.** Solo median end round 6 -> 10 (middle half 9-14, inside the
  8-14 band); 2 seats 5 -> 8; 4 seats 5 -> 24. It defeats about 10 times as many enemies solo
  (708 -> 7,077), builds 815 defenses where the default bot builds none, and takes more hits
  (it fights instead of walking away).
- **A defended base can hold forever.** 26 of 200 solo defender runs reach the action cap (5000
  actions per seat) in rounds 26-45: with no new tile revealed there is no new spawn node, and
  the defender clears what is left. At 4 seats 184 of 200 runs reach the cap (round ~24): four
  defenders never lose. This is the phase 22 turtle finding again, now with an active bot: the
  game has no clock without row 63.
- **Row 63 (forced reveal) ends the stall:** 26 -> 1 stalled solo, median unchanged (10), range
  6-45 -> 6-26. Row 64 (spawn ramp) does the same and lowers the median to 9.
- **Rows 65 and 69 do nothing under engagements:** both tables are identical to the default,
  run for run. Row 65 tips an enemy over after its attack in an exchange; row 69 changes who an
  exchange attacks. Engagements have neither step (phase 37 records these readings).
- **Row 67 (Gather off a node) is now far too strong:** solo median 10 -> 23, 157 of 200 runs
  stall. With the defender, steady materials buy a defense ring that holds.
- **Row 68 (seat scaling)** is the default by construction at 2 seats (1 enemy per 2 seats,
  rounded up); at 4 seats it ends 50 more runs (stalled 184 -> 134) and triples knock-outs.
- **Defeated dice:** under `cancelled`, the defender cancels 2,268 enemy dice solo (21% of the
  hits it would take under `hit`; the default bot cancelled about 8% in phase 23); health lost
  9,112 -> 7,269, knock-outs 205 -> 146, median end round 10 -> 11. Target picks matter here:
  the defender aims for the enemy whose dice it can cancel.
- **Draft pool:** `pool` against `supply` gives the same batch within noise (median 10 both;
  stalled 26 against 25). The pool matters for which Skills a player sees, not how long a bot
  lasts.

**Caveat:** both bots are floors, not forecasts. The defender plays one plan with fixed
priorities; it never trades cards, plans a draft, or coordinates seats. Read the deltas between
columns. "Stalled" means the run reached the sim cap of 5000 actions per seat without the base
falling; stalled runs stay in the medians (their end round is where they stopped).

Re-run any table: `pnpm sim -- compare --a default --b <config.json|default> [--policy
defender] [--b-policy defender] [--seats <n>]`. `--policy` sets both sides, `--a-policy` and
`--b-policy` one side. The play totals ("Enemy hits taken" to "Upgrades bought") add up every
run of the batch.

## 1. The defender against the default bot

### Solo

`pnpm sim -- compare --b-policy defender --runs 200`

| | A: default | B: default (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 26 |
| Median end round | 6 | 10 |
| Middle half | 6-7 | 9-14 |
| Range | 5-11 | 6-45 |
| Median level | 1 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 2 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 196 of 200 | 170 of 200 |
| Median round the limit is first reached | 6 | 8 |
| Causes | base 200 | base 174, stalled 26 |
| Enemy hits taken (all runs) | 4508 | 10543 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 5093 | 9112 |
| Knock-outs | 155 | 205 |
| Enemies defeated | 708 | 7077 |
| Defenses built | 0 | 815 |
| Health repaired | 336 | 1202 |
| Upgrades bought | 529 | 279 |

### 2 seats

`pnpm sim -- compare --b-policy defender --runs 200 --seats 2`

| | A: default | B: default (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 7 | 52 |
| Median end round | 5 | 8 |
| Middle half | 4-6 | 6-22 |
| Range | 4-62 | 4-48 |
| Median level | 1 | 5 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 3 / 5 |
| Runs that reach the miniature limit | 190 of 200 | 196 of 200 |
| Median round the limit is first reached | 4 | 5 |
| Causes | base 193, stalled 7 | base 148, stalled 52 |
| Enemy hits taken (all runs) | 8869 | 21503 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9579 | 15985 |
| Knock-outs | 253 | 284 |
| Enemies defeated | 2152 | 8753 |
| Defenses built | 0 | 896 |
| Health repaired | 845 | 4860 |
| Upgrades bought | 522 | 369 |

### 4 seats

`pnpm sim -- compare --b-policy defender --runs 200 --seats 4`

| | A: default | B: default (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 30 | 184 |
| Median end round | 5 | 24 |
| Middle half | 4-6 | 23-25 |
| Range | 3-63 | 3-30 |
| Median level | 2 | 15 |
| Median level at round 3 / 6 / 9 | 1 / 3 / 4 | 2 / 5 / 7 |
| Runs that reach the miniature limit | 197 of 200 | 198 of 200 |
| Median round the limit is first reached | 3 | 4 |
| Causes | base 170, stalled 30 | base 16, stalled 184 |
| Enemy hits taken (all runs) | 20751 | 46427 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 18391 | 24226 |
| Knock-outs | 406 | 141 |
| Enemies defeated | 5173 | 35379 |
| Defenses built | 0 | 1001 |
| Health repaired | 4938 | 5229 |
| Upgrades bought | 471 | 359 |

## 2. Rows 63-70 under the defender

Column A is the defender on the default config; column B the defender with the row's option
on (the phase 22 config files).

### Row 63 — forced reveal every 3 rounds

`pnpm sim -- compare --b docs/reports/phase-22/row63-forced-reveal.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row63-forced-reveal.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 1 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-12 |
| Range | 6-45 | 6-26 |
| Median level | 4 | 3 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 198 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 199, stalled 1 |
| Enemy hits taken (all runs) | 10543 | 9529 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 8727 |
| Knock-outs | 205 | 205 |
| Enemies defeated | 7077 | 3942 |
| Defenses built | 815 | 889 |
| Health repaired | 1202 | 975 |
| Upgrades bought | 279 | 284 |

### Row 64 — spawn ramp every 4 rounds

`pnpm sim -- compare --b docs/reports/phase-22/row64-spawn-ramp.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row64-spawn-ramp.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 1 |
| Median end round | 10 | 9 |
| Middle half | 9-14 | 7-11 |
| Range | 6-45 | 6-35 |
| Median level | 4 | 3 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 198 of 200 |
| Median round the limit is first reached | 8 | 6 |
| Causes | base 174, stalled 26 | base 199, stalled 1 |
| Enemy hits taken (all runs) | 10543 | 9782 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 9222 |
| Knock-outs | 205 | 294 |
| Enemies defeated | 7077 | 3791 |
| Defenses built | 815 | 706 |
| Health repaired | 1202 | 888 |
| Upgrades bought | 279 | 274 |

### Row 65 — each enemy attacks once per Combat

`pnpm sim -- compare --b docs/reports/phase-22/row65-once-per-combat.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row65-once-per-combat.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 26 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-14 |
| Range | 6-45 | 6-45 |
| Median level | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 170 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 174, stalled 26 |
| Enemy hits taken (all runs) | 10543 | 10543 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 9112 |
| Knock-outs | 205 | 205 |
| Enemies defeated | 7077 | 7077 |
| Defenses built | 815 | 815 |
| Health repaired | 1202 | 1202 |
| Upgrades bought | 279 | 279 |

Identical: under engagements no enemy attacks in an exchange, so the option never applies.

### Row 66 — new tiles wait one round

`pnpm sim -- compare --b docs/reports/phase-22/row66-new-tile-delay.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row66-new-tile-delay.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 7 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-12 |
| Range | 6-45 | 6-44 |
| Median level | 4 | 3 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 181 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 193, stalled 7 |
| Enemy hits taken (all runs) | 10543 | 8473 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 7850 |
| Knock-outs | 205 | 202 |
| Enemies defeated | 7077 | 4355 |
| Defenses built | 815 | 787 |
| Health repaired | 1202 | 1139 |
| Upgrades bought | 279 | 371 |

### Row 67 — Gather off a node gives 1

`pnpm sim -- compare --b docs/reports/phase-22/row67-gather-off-node.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row67-gather-off-node.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 157 |
| Median end round | 10 | 23 |
| Middle half | 9-14 | 21-25 |
| Range | 6-45 | 8-49 |
| Median level | 4 | 8 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 149 of 200 |
| Median round the limit is first reached | 8 | 12 |
| Causes | base 174, stalled 26 | base 43, stalled 157 |
| Enemy hits taken (all runs) | 10543 | 12462 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 12568 |
| Knock-outs | 205 | 148 |
| Enemies defeated | 7077 | 16133 |
| Defenses built | 815 | 4748 |
| Health repaired | 1202 | 4556 |
| Upgrades bought | 279 | 1003 |

### Row 68 — seat scaling (2 and 4 seats)

`pnpm sim -- compare --b docs/reports/phase-22/row68-per-seat.json --policy defender --seats 2`

| | A: default (defender bot) | B: docs/reports/phase-22/row68-per-seat.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 56 | 56 |
| Median end round | 8 | 8 |
| Middle half | 6-15 | 6-15 |
| Range | 4-29 | 4-29 |
| Median level | 5 | 5 |
| Median level at round 3 / 6 / 9 | 1 / 3 / 5 | 1 / 3 / 5 |
| Runs that reach the miniature limit | 195 of 200 | 195 of 200 |
| Median round the limit is first reached | 5 | 5 |
| Causes | base 144, stalled 56 | base 144, stalled 56 |
| Enemy hits taken (all runs) | 18945 | 18945 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 15284 | 15284 |
| Knock-outs | 284 | 284 |
| Enemies defeated | 6515 | 6515 |
| Defenses built | 888 | 888 |
| Health repaired | 4185 | 4185 |
| Upgrades bought | 369 | 369 |

`pnpm sim -- compare --b docs/reports/phase-22/row68-per-seat.json --policy defender --seats 4`

| | A: default (defender bot) | B: docs/reports/phase-22/row68-per-seat.json (defender bot) |
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

### Row 69 — every adjacent enemy attacks

`pnpm sim -- compare --b docs/reports/phase-22/row69-any-adjacent.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row69-any-adjacent.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 26 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-14 |
| Range | 6-45 | 6-45 |
| Median level | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 170 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 174, stalled 26 |
| Enemy hits taken (all runs) | 10543 | 10543 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 9112 |
| Knock-outs | 205 | 205 |
| Enemies defeated | 7077 | 7077 |
| Defenses built | 815 | 815 |
| Health repaired | 1202 | 1202 |
| Upgrades bought | 279 | 279 |

Identical: an engagement rolls the dice of every enemy next to the player whatever its target,
which is what row 69 asks of an exchange.

### Row 70 — spawn range 4

`pnpm sim -- compare --b docs/reports/phase-22/row70-node-range.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/row70-node-range.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 21 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-13 |
| Range | 6-45 | 7-45 |
| Median level | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 167 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 179, stalled 21 |
| Enemy hits taken (all runs) | 10543 | 10426 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 9079 |
| Knock-outs | 205 | 212 |
| Enemies defeated | 7077 | 6820 |
| Defenses built | 815 | 804 |
| Health repaired | 1202 | 952 |
| Upgrades bought | 279 | 281 |

### All proposed (rows 63, 64, 65, 66, 67, 69, 70)

`pnpm sim -- compare --b docs/reports/phase-22/all-proposed.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-22/all-proposed.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 7 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-12 |
| Range | 6-45 | 6-24 |
| Median level | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 200 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 193, stalled 7 |
| Enemy hits taken (all runs) | 10543 | 9535 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 10500 |
| Knock-outs | 205 | 340 |
| Enemies defeated | 7077 | 4823 |
| Defenses built | 815 | 1361 |
| Health repaired | 1202 | 2242 |
| Upgrades bought | 279 | 1008 |

## 3. Defeated enemies' dice: `hit` against `cancelled`

`combat.engage.defeatedDice` (designer 2026-10-09; default `hit`). Phase 23 measured it with the
default bot, which defeats an enemy mid-engagement only by chance.

### Solo

`pnpm sim -- compare --b docs/reports/phase-23/cancelled.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-23/cancelled.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 25 |
| Median end round | 10 | 11 |
| Middle half | 9-14 | 9-14 |
| Range | 6-45 | 6-45 |
| Median level | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 167 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 175, stalled 25 |
| Enemy hits taken (all runs) | 10543 | 8570 |
| Enemy dice cancelled | 0 | 2268 |
| Health lost | 9112 | 7269 |
| Knock-outs | 205 | 146 |
| Enemies defeated | 7077 | 7345 |
| Defenses built | 815 | 819 |
| Health repaired | 1202 | 1166 |
| Upgrades bought | 279 | 279 |

### 2 seats

`pnpm sim -- compare --b docs/reports/phase-23/cancelled.json --policy defender --seats 2`

| | A: default (defender bot) | B: docs/reports/phase-23/cancelled.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 52 | 59 |
| Median end round | 8 | 8 |
| Middle half | 6-22 | 6-22 |
| Range | 4-48 | 4-48 |
| Median level | 5 | 5 |
| Median level at round 3 / 6 / 9 | 1 / 3 / 5 | 1 / 3 / 5 |
| Runs that reach the miniature limit | 196 of 200 | 195 of 200 |
| Median round the limit is first reached | 5 | 5 |
| Causes | base 148, stalled 52 | base 141, stalled 59 |
| Enemy hits taken (all runs) | 21503 | 17002 |
| Enemy dice cancelled | 0 | 4447 |
| Health lost | 15985 | 12895 |
| Knock-outs | 284 | 203 |
| Enemies defeated | 8753 | 9153 |
| Defenses built | 896 | 886 |
| Health repaired | 4860 | 5304 |
| Upgrades bought | 369 | 373 |

## 4. Draft pool: `pool` against `supply`

`draft.unpicked` (designer 2026-10-09; default `pool`). Column B returns unpicked Skills to the
supply (`docs/reports/phase-36/draft-supply.json`).

`pnpm sim -- compare --b docs/reports/phase-36/draft-supply.json --policy defender`

| | A: default (defender bot) | B: docs/reports/phase-36/draft-supply.json (defender bot) |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 26 | 25 |
| Median end round | 10 | 10 |
| Middle half | 9-14 | 9-14 |
| Range | 6-45 | 6-45 |
| Median level | 4 | 4 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 170 of 200 | 170 of 200 |
| Median round the limit is first reached | 8 | 8 |
| Causes | base 174, stalled 26 | base 175, stalled 25 |
| Enemy hits taken (all runs) | 10543 | 10532 |
| Enemy dice cancelled | 0 | 0 |
| Health lost | 9112 | 9144 |
| Knock-outs | 205 | 203 |
| Enemies defeated | 7077 | 7058 |
| Defenses built | 815 | 811 |
| Health repaired | 1202 | 1132 |
| Upgrades bought | 279 | 279 |

## What this unblocks

The deferred "Try the proposals" candidate (experiment presets for rows 63-70) can now cite
numbers measured under engagements with a bot that defends. Rows 65 and 69 have no effect under
engagements and should not be offered as presets for that model until phase 37 records new
readings.
