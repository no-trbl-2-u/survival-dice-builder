# Phase 23 — defeated enemies' dice: "hit" against "cancelled"

> Bot comparison for `combat.engage.defeatedDice` (designer 2026-10-09). 200 bot runs per
> config, seeds 1-200, engagements (the default Combat model since phase 23). Column A is the
> default (`"hit"`: every enemy die rolled hits at the end of the engagement, all at once, even
> the dice of an enemy defeated during it). Column B is `docs/reports/phase-23/cancelled.json`
> (`"cancelled"`: a defeated enemy's dice do not hit).

**Caveat: the bot is weak.** It does not pick targets to defeat enemies before their dice hit,
so it defeats an enemy mid-engagement only by chance. The gap between the columns is a floor:
a player who plays for it would cancel more dice. The target band for a real table is an end
round of 8-14; bot numbers are floors, so read the deltas between columns, not the rounds.

## Solo

`pnpm sim -- compare --a default --b docs/reports/phase-23/cancelled.json --runs 200`

| | A: default | B: docs/reports/phase-23/cancelled.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 7 | 7 |
| Middle half | 6-7 | 6-7 |
| Range | 5-12 | 5-12 |
| Median level | 1 | 1 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 193 of 200 | 193 of 200 |
| Median round the limit is first reached | 6 | 6 |
| Causes | base 200 | base 200 |

- End round: unchanged (median 7, middle half 6-7, range 5-12). Runs end when the base falls to
  siege, and the defeated-dice rule only touches the player's health.
- Hits taken: 2,920 enemy dice hit across the 200 runs under `"hit"`, 2,688 under
  `"cancelled"` (240 dice cancelled, about 8% fewer hits); health lost 3,323 against 3,004;
  knock-outs 49 against 41.
- Level: unchanged (median 1; 2 by round 9 in both).

Default stays `hit` (designer rule); `cancelled` is the measured alternative.

## 2 seats

`pnpm sim -- compare --a default --b docs/reports/phase-23/cancelled.json --runs 200 --seats 2`

| | A: default | B: docs/reports/phase-23/cancelled.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 5 | 5 |
| Middle half | 4-6 | 4-6 |
| Range | 3-10 | 3-11 |
| Median level | 1 | 1 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 199 of 200 | 199 of 200 |
| Median round the limit is first reached | 4 | 4 |
| Causes | base 200 | base 200 |

- End round: unchanged (median 5, middle half 4-6); one run lasts a round longer (range 3-11).
- Hits taken: 5,157 against 4,902 (276 dice cancelled, about 5% fewer hits); health lost 5,980
  against 5,642; knock-outs 107 against 100.
- Level: unchanged (median 1).

Default stays `hit` (designer rule); `cancelled` is the measured alternative.

Hits taken, health lost, and knock-outs come from the engine events of the same 200 seeds
(`enemyAttacked`, `playerDamaged`, `playerKnockedOut`, `enemyDieCancelled`); the compare table
does not count them.
