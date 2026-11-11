# Event Calendar (experiment, 2026-11-11)

The designer's Event Calendar experiment (AUDIT `[needs-user-call]` 2026-10-11) may replace
the spawn cadence (Spec v2 7.3, ruling 14) and the gathering-node rule (6.7, ruling 9). This
page records 10 calendar systems, how they were measured, and the 3 now in the engine behind
`calendar.system` (default `off`). OPEN-QUESTIONS row 79.

Brief: difficulty rises, rounds are unlimited, some days are good or reward milestones, and the
calendar sits on the table as physical components.

## Method

- `event-calendar/model.mjs`: each system as a pure function of the round (and a seeded RNG),
  4,000 runs x 30 rounds. Output: enemy health spawned per round on a reference board of 6 spawn
  nodes and 1 elite spawn node (grunt 2, elite 14, Table 5). The reference board is an
  assumption (confidence 40): it compares systems, it does not predict a run.
- `event-calendar/score.mjs`: a weighted matrix. Escalation, good days and variety come from the
  model; milestone link, upkeep, table footprint, co-op hook and engine cost are design scores.
- The top 3 are in the engine (`packages/engine/src/enemies/calendar.ts`) and were played by the
  bot: `docs/reports/event-calendar/`.

## The 10 systems

| # | System | Components | Rule in short |
| --- | --- | --- | --- |
| 1 | Threat dice | 6 custom d6, dice tray | Roll 1 die, +1 every 3 rounds. Raid: +1 enemy per node. Elite: 1 elite near the base. Calm: nothing. Boon: Respite (2 Boons: + Harvest). A new milestone sets 1 die to Boon. |
| 2 | Sundial | Round 8-day dial, 1 marker, era tokens | Marker moves 1 day a round: Dawn (no spawn, Respite), Raid, Harvest, Feast, Blood Moon (+1 elite). Each lap: +1 on every raid day. |
| 3 | Notoriety ladder | Ladder board, 1 cube | +1 rung every 3 rounds and +1 per milestone. +1 enemy per node every 3 rungs; every 3rd rung brings 1 elite. Each new rung: Respite. |
| 4 | Moon wheel | 6-phase wheel, blood tokens | New moon (no spawn, Harvest), waxing 1, half 1, gibbous 2, full 2 + elite, waning 1 + Respite. Each cycle +1 to every phase. |
| 5 | Crossroads | 20 fork cards, grudge pile | Reveal 2 cards, play 1 (boon with a cost); the other goes on the grudge pile. 3 grudges resolve together. |
| 6 | Warband bag | Cloth bag, 30 chits | Draw 1 chit per spawn node: grunt, brute (2), elite, calm, boon. Each round add 1 grunt; every 3 rounds 1 elite; each milestone 1 boon chit. |
| 7 | Omen deck | 10 cards + 6 doom cards | Draw 1 omen a round. When the deck is empty, shuffle in 2 Doom cards and remove 1 Calm or Boon. |
| 8 | Weather front | Storm and Sun tokens on the map | Storm tile's nodes spawn extra; Sun tile spawns none and its nodes refresh. +1 storm every 4 rounds. |
| 9 | Herald countdown | 5-space track, Herald standee | Every 5 rounds a Herald elite (+6 health each time) arrives; defeating it opens a reward chest. |
| 10 | Tribute ledger | Tribute track | Pay a rising tribute (materials or currency) each round; each unpaid point spawns a grunt. Every 5th round is a holiday with a boon. |

## Scores (weighted total)

From `event-calendar/score.json`: Threat dice 42, Sundial 35, Notoriety 34.5, Moon wheel 33.5,
Crossroads 31.5, Warband bag 30, Omen deck 29.5, Weather front 27, Herald 25.5, Tribute 19.5.

## Bot sweep (200 runs each, solo)

Spec v2 1.7 target: a solo run ends in rounds 10-12. "Stalled" runs hit the sim's action cap
(very long runs). Full tables: `docs/reports/event-calendar/`.

| `calendar.system` | Default bot median (middle half) | Defender bot median (middle half) | Defender stalled |
| --- | --- | --- | --- |
| off | 6 (5-7) | 12 (9-22) | 53 |
| threat-dice | 7 (6-8) | 11 (8-20) | 48 |
| sundial | 6 (6-8) | 14 (12-19) | 43 |
| notoriety | 6 (6-7) | 10 (8-16) | 26 |

With the forced reveal (row 63) on, the defender bot's stalled runs fall from 126 (off) to 95
(threat dice), 70 (Sundial) and 58 (Notoriety).

## Readings the rules check raised (open)

- Harvest (spent nodes work again) goes against 6.7 "the node is then spent" (ruling 9); the
  experiment allows it, Spec v2 does not.
- Respite heals and repairs outside cards (7.7, 12.5): a new rule if kept.
- Threat dice: elite spawn nodes spawn only on a day with a Raid. Notoriety: elite nodes get the
  same extra enemies as grunt nodes. Both differ from 7.3.
- With the calendar on, `spawn.rampEvery` does not stack (the calendar has its own ramp).
- Some calendar mechanics (1 more per lap, 2 Boons for a Harvest) are fixed in code, not config.
