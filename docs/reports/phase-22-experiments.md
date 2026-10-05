# Phase 22 — experiments: structural levers, experience curves, Skill caps

> Bot comparison report for `OPEN-QUESTIONS.md` rows 63-70 (structural), 17 (experience), and
> 9 (Skill caps). 200 bot runs per config, seeds 1-200, each against the default config on the
> same seeds. Every option defaults to off, so the default column is the phase 21 game: median
> end round 6, middle half 6-8, all 200 runs end with the base falling.

## Summary

No single option puts the active bot in the 8-14 end-round band except **row 67 (Gather off a
node for 1)**, which moves the median from 6 to 9. Rows 65 (each enemy attacks once per Combat)
and 66 (new tiles wait one round) each add about 1 round. Rows 64 (spawn ramp) and 70 (spawn
range) barely change the end round, because bot runs end before they matter. The combined
"all proposed" config (rows 63, 64, 65, 66, 67, 69, 70) gives a tight median of 8 (middle half
8-9) solo, and 6 at 2 seats. The clearest finding is about turtling: **a bot that never leaves
the Base tile never ends a run without the row 63 clock** (all 200 runs stall at the action cap
in round 124), and **with the clock it outlasts the active bot** (median 11 against 6). Row 69
adds attacks on the turtle but does not change when the base falls. Experience: steps of 3 give
1 more level by round 9; extra elite experience changes almost nothing (35 of 200 runs defeat an
elite); 1 level per elite spawn levels far too fast (median end level 8). Skill caps of 4, 6, and
8 give identical batches: bot runs are too short for a cap to bind.

**Caveat: the bot is weak.** It builds few defenses, does not defend the base on purpose, and
never plays to a plan, so every number here is a floor for a real table, not a forecast. Use the
deltas between columns, not the absolute rounds. "Stalled" means the bot reached the sim's
5000-action cap without the run ending (a sim limit, not an engine loop); with many dice a long
run can reach it.

How to read a table: column A is the baseline, column B the experiment. "Median level at round 3
/ 6 / 9" counts only runs that reached that round (`-`: none did). "Miniature limit" is the 20
enemy cap (`miniatureLimit`): how many runs reached it, and the median round they first did.

Re-run any table: `pnpm sim -- compare --a default --b docs/reports/phase-22/<file>.json
[--seats <n>] [--policy turtle]`. The JSON files hold only the keys an experiment changes; the
rest come from the default config.

## 1. Structural, one option at a time

### Row 63 — forced reveal every 3 rounds (`clock.forcedRevealEvery: 3`)

Active bot:

| | A: default | B: row63-forced-reveal.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 6-7 |
| Range | 5-12 | 5-10 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 108 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

Turtle bot (never leaves the Base tile):

| | A: default | B: row63-forced-reveal.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 200 | 0 |
| Median end round | 124 | 11 |
| Middle half | 124-124 | 10-12 |
| Range | 124-125 | 8-14 |
| Median level | 1 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 1 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 0 of 200 | 0 of 200 |
| Median round the limit is first reached | - | - |
| Causes | stalled 200 | base 200 |

- The active bot reveals tiles itself, so the clock rarely fires: median and causes do not move.
- Without a clock, every turtle run stalls: no tile is revealed, so no enemy ever spawns (row 63
  as written). With the clock, every turtle run ends by the base falling, in rounds 8-14.
- The turtle with the clock (median 11) outlasts the active bot (median 6): staying home is the
  stronger line for this bot.

**Recommendation: turn on.** It is the only option that gives the game an end for every play
style, and it does not change the active game. Rows 69 and 64 are the places to make turtling
cost more.

### Row 64 — spawn ramp every 4 rounds (`spawn.rampEvery: 4`)

| | A: default | B: row64-spawn-ramp.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 5-7 |
| Range | 5-12 | 5-12 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 180 of 200 |
| Median round the limit is first reached | 7 | 6 |
| Causes | base 200 | base 200 |

- The first extra spawn comes at round 5; the median run ends in round 6, so the ramp has one
  or two Combats to act.
- It shows in the cap: 180 of 200 runs reach the 20-miniature limit (115 by default), a round
  earlier.
- End rounds do not move: pressure already ends runs before the ramp builds up.

**Recommendation: needs a playtest.** Keep it as the late-game clock once other options make
runs longer (it is in the combined config below); alone it does nothing for the bot.

### Row 65 — each enemy attacks once per Combat (`combat.enemyAttacks: "once-per-combat"`)

| | A: default | B: row65-once-per-combat.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 7 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-15 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 103 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

- Median end round 6 to 7; the longest run goes from 12 to 15 rounds.
- Fewer runs reach the cap (103 against 115), and more runs defeat an elite (54 against 35)
  and buy 3 upgrades (87 against 57).
- Bought cards no longer add enemy attacks, so the deck size stops setting the player damage.

**Recommendation: turn on.** It cuts player damage without a counter (a tipped miniature) and
removes the coupling to deck size that row 65 names.

### Row 66 — new tiles wait one round (`spawn.newTileDelay: 1`)

| | A: default | B: row66-new-tile-delay.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 7 |
| Middle half | 6-8 | 7-8 |
| Range | 5-12 | 6-13 |
| Median level | 2 | 1 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 111 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

- Median end round 6 to 7, middle half 7-8: a tile the bot reveals in Prepare no longer spawns
  next to it in the same Combat.
- Median level falls from 2 to 1: fewer early spawns mean fewer early defeats.
- On /play a waiting node reads "spawns from round N" in its hex name.

**Recommendation: turn on.** It gives exploring a fair first round and a visible marker, at no
table cost.

### Row 67 — Gather off a node gives 1 (`gather.offNodeAmount: 1`)

| | A: default | B: row67-gather-off-node.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 9 |
| Middle half | 6-8 | 8-11 |
| Range | 5-12 | 6-18 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 151 of 200 |
| Median round the limit is first reached | 7 | 9 |
| Causes | base 200 | base 200 |

- Median end round 6 to 9 (middle half 8-11): the largest single change, and inside the band.
- Every run now buys 3 base upgrades (the "buy-upgrades" milestone: 200 of 200 runs, against
  57 by default), and the cap comes later (round 9).
- Gather cards stop being dead once the nodes are spent; nodes stay single-use.

**Recommendation: turn on.** It is the one lever that lengthens runs by itself, and it fixes
the dead-card problem without a recharge timer.

### Row 68 — seat scaling (`spawn.perSeat: true`)

At 2 seats (1 per 2 seats, rounded up, is still 1 per node, so this matches the default by
construction):

| | A: default | B: row68-per-seat.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 6 | 6 |
| Median end round | 5 | 5 |
| Middle half | 5-6 | 5-6 |
| Range | 3-38 | 3-38 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 174 of 200 | 174 of 200 |
| Median round the limit is first reached | 5 | 5 |
| Causes | base 194, stalled 6 | base 194, stalled 6 |

At 4 seats (2 per node):

| | A: default | B: row68-per-seat.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 9 | 5 |
| Median end round | 5 | 4 |
| Middle half | 4-6 | 3-5 |
| Range | 3-21 | 2-19 |
| Median level | 4 | 3 |
| Median level at round 3 / 6 / 9 | 2 / 3 / 5 | 2 / 3 / 5 |
| Runs that reach the miniature limit | 188 of 200 | 199 of 200 |
| Median round the limit is first reached | 4 | 3 |
| Causes | base 191, stalled 9 | base 195, stalled 5 |

- Co-op is already shorter than solo for the bot (median 5 at 2 seats and at 4 seats, against 6
  solo), and stalls more (long co-op runs reach the action cap).
- At 4 seats seat scaling takes the median from 5 to 4 and the first cap round from 4 to 3.

**Recommendation: keep off.** The bot finds co-op harder than solo already; more spawns make it
harder still. Revisit after a co-op playtest with people, who coordinate better than 4 copies of
the bot.

### Row 69 — every adjacent enemy attacks (`combat.adjacentAttack: "any-adjacent"`)

Active bot:

| | A: default | B: row69-any-adjacent.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 6-7 |
| Range | 5-12 | 5-13 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 107 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

Turtle bot, no clock (row 69 alone cannot end a run that spawns no enemy):

| | A: default | B: row69-any-adjacent.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 200 | 200 |
| Median end round | 124 | 124 |
| Middle half | 124-124 | 124-124 |
| Range | 124-125 | 124-125 |
| Median level | 1 | 1 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 1 | 1 / 1 / 1 |
| Runs that reach the miniature limit | 0 of 200 | 0 of 200 |
| Median round the limit is first reached | - | - |
| Causes | stalled 200 | stalled 200 |

Turtle bot, with the row 63 clock (A: row 63 alone; B: rows 63 and 69):

| | A: row63-forced-reveal.json | B: row63-row69.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 11 | 11 |
| Middle half | 10-12 | 10-12 |
| Range | 8-14 | 8-14 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 0 of 200 | 0 of 200 |
| Median round the limit is first reached | - | - |
| Causes | base 200 | base 200 |

- For the active bot nothing moves: it is rarely next to an enemy that targets something else.
- For the turtle, enemies next to the figure now attack it (391 attacks in the first 50 seeds),
  but a knockout does not end a run, so the base falls in the same round.
- Turtling stays the stronger line: median 11 against 6 for the active bot.

**Recommendation: needs a playtest.** The reading works, but its cost to a turtle is knockouts,
which the bot does not mind. A person may; measure it at the table.

### Row 70 — spawn range 4 (`spawn.nodeRange: 4`)

| | A: default | B: row70-node-range.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-15 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 104 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

- Median unchanged; the longest run goes from 12 to 15; slightly fewer runs reach the cap.
- The bot stays near the base, so most nodes are in range anyway. The saving is in table upkeep
  (fewer placements on far tiles), which the bot cannot measure.

**Recommendation: needs a playtest.** It costs the bot almost nothing; whether it saves enough
table time is a question for a physical session.

## 2. Structural, combined

The "all proposed" config: rows 63, 64, 65, 66, 67, 69, and 70 on together (row 68 off).

Solo:

| | A: default | B: all-proposed.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 8 |
| Middle half | 6-8 | 8-9 |
| Range | 5-12 | 6-10 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 190 of 200 |
| Median round the limit is first reached | 7 | 8 |
| Causes | base 200 | base 200 |

2 seats:

| | A: default | B: all-proposed.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 6 | 0 |
| Median end round | 5 | 6 |
| Middle half | 5-6 | 6-7 |
| Range | 3-38 | 5-10 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 3 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 174 of 200 | 199 of 200 |
| Median round the limit is first reached | 5 | 6 |
| Causes | base 194, stalled 6 | base 200 |

Turtle bot, solo (A: default, so every run stalls):

| | A: default | B: all-proposed.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 200 | 0 |
| Median end round | 124 | 12 |
| Middle half | 124-124 | 11-13 |
| Range | 124-125 | 11-13 |
| Median level | 1 | 3 |
| Median level at round 3 / 6 / 9 | 1 / 1 / 1 | 1 / 1 / 2 |
| Runs that reach the miniature limit | 0 of 200 | 200 of 200 |
| Median round the limit is first reached | - | 11 |
| Causes | stalled 200 | base 200 |

- Solo: median 8, middle half 8-9, range 6-10. The runs are inside the band, at its low edge,
  and much less spread out than the default (5-12).
- 2 seats: median 6, and no stalled runs (6 by default).
- The turtle still outlasts the active bot (median 12 against 8), and reaches the cap in every
  run by round 11.

**Recommendation:** turn on rows 63, 65, 66, and 67 (each helps alone); decide 64, 69, and 70
after a playtest with the combined set. Turtling needs a further answer (row 69 alone is not
enough).

## 3. Experience (row 17)

### Steps of 3 (`experience.firstStep: 3`, `experience.stepIncrease: 3`)

| | A: default | B: xp-steps-3.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 7 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-14 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 3 |
| Runs that reach the miniature limit | 115 of 200 | 114 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

- 1 more level by round 9 (3 against 2); median end round 6 to 7.

### Steps of 5 with extra experience for elites (`experience.eliteBonus: 5`)

| | A: default | B: xp-elite-bonus-5.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-12 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 115 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

- The batch summary does not move. Only 35 of 200 runs defeat an elite; in those the experience
  rises, and the end round changes in 4 runs.

### 1 level for each elite that spawns (`experience.levelPerEliteSpawn: true`)

| | A: default | B: xp-level-per-elite-spawn.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 2 |
| Median end round | 6 | 7 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-21 |
| Median level | 2 | 8 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 5 |
| Runs that reach the miniature limit | 115 of 200 | 108 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 198, stalled 2 |

- Experience no longer gives levels; every elite spawn (and every cap promotion) does. Once the
  cap is reached every new spawn promotes, so the level climbs fast: level 5 by round 9, median
  end level 8.
- The longest run goes to round 21, and 2 runs reach the action cap (many dice, long exchanges).

**Recommendation:** steps of 3 — **turn on** (more levels in a short run, small effect on
length). Extra elite experience — **keep off** (the bot rarely defeats an elite; it changes
almost nothing). 1 level per elite spawn — **keep off** (it ties player power to the cap and
grows too fast).

## 4. Skill caps (row 9)

Draft slots 4:

| | A: default | B: skills-cap-4.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-12 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 115 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

Draft slots 8:

| | A: default | B: skills-cap-8.json |
| --- | --- | --- |
| Runs | 200 | 200 |
| Errors | 0 | 0 |
| Stalled | 0 | 0 |
| Median end round | 6 | 6 |
| Middle half | 6-8 | 6-8 |
| Range | 5-12 | 5-12 |
| Median level | 2 | 2 |
| Median level at round 3 / 6 / 9 | 1 / 2 / 2 | 1 / 2 / 2 |
| Runs that reach the miniature limit | 115 of 200 | 115 of 200 |
| Median round the limit is first reached | 7 | 7 |
| Causes | base 200 | base 200 |

- Caps of 4, 6 (default), and 8 give identical batches. A draft comes every 2 rounds and the
  most Skills any default run drafted is 5, so a cap rarely binds before the run ends.

**Recommendation: needs a playtest.** Keep 6 until runs are longer (row 67, the combined set);
then re-run this section.

## Recommendations at a glance

| Row | Option | Recommendation |
| --- | --- | --- |
| 63 | `clock.forcedRevealEvery: 3` | Turn on |
| 64 | `spawn.rampEvery: 4` | Needs a playtest (with the combined set) |
| 65 | `combat.enemyAttacks: "once-per-combat"` | Turn on |
| 66 | `spawn.newTileDelay: 1` | Turn on |
| 67 | `gather.offNodeAmount: 1` | Turn on |
| 68 | `spawn.perSeat: true` | Keep off |
| 69 | `combat.adjacentAttack: "any-adjacent"` | Needs a playtest |
| 70 | `spawn.nodeRange: 4` | Needs a playtest |
| 17 | steps of 3 | Turn on |
| 17 | `experience.eliteBonus: 5` | Keep off |
| 17 | `experience.levelPerEliteSpawn: true` | Keep off |
| 9 | `player.draftSlots` 4 / 6 / 8 | Needs a playtest (keep 6) |

The designer decides each row in `OPEN-QUESTIONS.md`; the defaults do not change until then.
