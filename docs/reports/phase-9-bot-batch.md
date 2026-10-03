# Phase 9 — bot batch report

200 bot runs, seeds 1-200, default config (`packages/content/data/config.default.json`),
`@survival/bot` policy. Raw data: [`phase-9-bot-batch.csv`](phase-9-bot-batch.csv).
Reproduce with `pnpm sim -- --runs 200 --out docs/reports/phase-9-bot-batch.csv`.

**The bot is a floor, not a skilled player.** It walks between the nearest gathering node and
the base, buys the cheapest upgrade, buys the first Shop offer, keeps every non-Blank die, and
places dice on damage Skills first. It never plans a route, builds defenses only after every
upgrade is bought, and never skirmishes on purpose. Read every number below as "a weak player
lasts at least this long".

## Result

| Measure | Value |
| --- | --- |
| Runs / errors / stalled | 200 / 0 / 0 |
| Median end round | **14** (target band 8-14: inside, at the top edge) |
| Middle half | 10-17 |
| Range | 9-25 |
| Cause | base falls 117 (median round 16), player falls 83 (median round 10) |
| Final level | 1: 48, 2: 100, 3: 44, 4: 8 |

End round distribution:

| Round | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 25 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Runs | 19 | 35 | 23 | 10 | 11 | 21 | 15 | 13 | 12 | 13 | 9 | 10 | 5 | 1 | 2 | 1 |

Milestones (runs that reached each): survive to round 5: 200; buy 3 upgrades: 200; survive to
round 10: 181; survive to round 15: 81; defeat an elite: 90; reach level 5: 0; fire Arcane
Rain: 0; reveal 10 tiles: 0 (unreachable with 7 tiles, row 4).

## Observations for the designer

- **No run ends before round 9.** The tile deck (7 tiles) runs out in round 8 Explore; the
  first wave arrives in round 9 Combat (row 38). The 9-10 spike (54 runs) is the first wave.
- **Player deaths cluster early** (median round 10): the bot stands on the base and takes
  every adjacent enemy's attack in each exchange.
- **Progression is shallow for this bot.** No run reached level 5; Level 3 Skills (Arcane
  Rain) were never fired. Experience comes only from defeats, and the bot defeats few enemies.
- The median sits on the band's upper edge, so a better bot (or the designer) will likely
  push it above 14. That is a tuning signal for after the UI exists, not a rule change.
