# Playtest report (template)

> Fill in after the sessions (`PROTOCOL.md`). The numbers come from
> `pnpm sim -- playtests --out docs/playtests/numbers.md`. Every proposed change names a rule
> id and its evidence (data or a survey quote).

Build: <deploy date / commit> · Sessions: <n solo> solo, <n co-op> co-op · Dates: <from-to>

## 1. Numbers

| Measure | Value |
| --- | --- |
| Median run length (rounds) | |
| Median run length (minutes) | |
| Median minutes per round | |
| Simulator estimate | about 8-9 minutes per round (spec phase C) |
| Real vs estimate | <ratio>x: <faster / on / slower> |
| Median teach time | |
| End causes | base falls <n>, unfinished <n> |

<!-- kit:bot -->
Bot baseline (median end round): run the default batch with `pnpm sim -- --runs 200`; the pinned summary is in `tools/sim/src/run.test.ts`.
<!-- /kit:bot -->

Where the time went (phase and decision shares): paste the "Where the time went" tables.

## 2. Top 5 friction points

| # | Friction | Evidence (data or quote) | Sessions |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

## 3. Survey summary

<!-- kit:survey-summary -->
| Question | Median (1-5) | Notable answers |
| --- | --- | --- |
| Base trip tense | | |
| Deck and hand right | | |
| Reveal a real choice | | |
| Nodes pace right | | |
| Engagements fair | | |
| Dice fun | | |
| Knew what to do | | |
| Knockout fair | | |
| Length right | | |
| Co-op pace | | |
| Play again | | |
<!-- /kit:survey-summary -->

Best Skill: <tally> · Useless Skill: <tally>

## 4. Proposed changes for Spec v2

| Rule id | Change | Evidence | Config value or rule text? |
| --- | --- | --- | --- |
| | | | |

## 5. Scenarios (rules section 19)

Start scenarios now? **<yes / not yet>**. Rule 19.4 says to make the base game work first, so
"yes" needs the base game's friction points above to be small. Reason: <one paragraph>.
