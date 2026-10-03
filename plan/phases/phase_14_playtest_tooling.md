# Phase 14 — Playtest tooling: real timing and the tuning report — Milestone 3

> Agent-facing brief. Ship without asking. Source:
> `spec/phases/phase-7-playtest-tooling.md` (the items phase 9 did not ship).

## Outcome

A real run's export says where the time went (per phase, per decision type, per round) and
sums to the session length; a report script compares two configs (median end round, middle
half, minutes per round). The 200-run batch is re-run as the regression check. **Milestone 3.**

## Web (apps/web/src/play)

- `timing.ts` (pure): `Timing = { startedAt, lastAt, byPhase, byDecision, byRound }`;
  `recordGap(timing, at, phase, decision, round)` adds the time since the last action to the
  phase, decision type, and round the player was deciding in; `closeTiming(timing, at)` adds
  the open gap at export time. Session length = `at - startedAt` = sum of every bucket.
- The run reducer takes the action's timestamp in the message (`{ kind: 'act', action, at }`),
  so the reducer stays pure; the page passes `Date.now()`.
- Export `version: 1` gains `timing` (milliseconds) and `sessionMs`; loading restores the
  totals and does not count the time between saving and loading.

## Tools (tools/sim)

- `pnpm sim -- compare --a <config.json|default> --b <config.json> [--runs 200]`: bot batch
  for each config; a markdown table of runs, errors, median end round, middle half, causes.
- `pnpm sim -- timing <export.json ...>`: minutes per round (median and per file), share of
  time per phase and per decision type, from real run exports.
- `--out report.md` writes the markdown.

## Decisions made upfront — DO NOT ASK

- Bot runs have no wall clock, so "minutes per round" comes only from real exports; the
  compare report says so and links the timing command.
- Time while the tab is hidden still counts (a table pause is part of a session); the export
  lists it under the phase it happened in. Noted in the report.
- The regression re-run writes `docs/reports/phase-14-regression.md` and compares with the
  phase 9 numbers; a median outside 8-14 files an AUDIT row, not a rule change.

## Tests

- Unit: timing buckets sum to the session (fake clock); reducer passes timestamps; export and
  import keep the totals; compare summary table; timing report maths.
- e2e: the downloaded export has `timing` whose phases sum to `sessionMs` within 5%.

## DoD

`pnpm verify` green, 200-run regression re-run and committed, deploy green, Milestone 3 noted.
