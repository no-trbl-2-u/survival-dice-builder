# Phase 16 — Playtest protocol, survey, and analysis kit

> Agent-facing brief. Ship without asking. Source: `spec/phases/phase-C-playtests.md`.

## Outcome

The designer can run playtests from a one-page script, collect a survey, drop the run exports in
a folder, and get the numbers the report needs with one command. The sessions themselves are
the designer's (`[needs-user-call]`).

## Docs (docs/playtests/)

- `PROTOCOL.md`: a one-page script.
  - Before: setup, the build URL, seed, 1-4 players.
  - Teach: the rules, timed.
  - Play: sound and 3D settings as the player likes. Save the run file at the end.
  - Survey.
  - File naming: `YYYY-MM-DD-<who>-<seed>.json`.
  - Goal: at least 5 solo runs and 3 co-op sessions.
- `SURVEY.md`: short questions.
  - The spec's examples: the base trip, deck length, wave fairness, best Skill.
  - Plus friction, rules confusion, and "play again?". Each is a 1-5 rating or one line.
  - A copy-paste answer block per session.
- `REPORT.md`: a template.
  - Median run length in rounds and minutes.
  - Minutes per round against the simulator estimate (8-9 at a normal table).
  - The top 5 friction points.
  - Proposed Spec v2 changes, each with its rule id and evidence (data or quote).
  - The scenarios (rules section 19) go/no-go.
- `runs/README.md`: where run exports go and how they are named.

## Tool (tools/sim)

- `pnpm sim -- playtests [--dir docs/playtests/runs] [--estimate 8.5] [--out report.md]` reads every export in the folder and prints markdown:
  - Sessions by player count.
  - Median end round, cause counts, median session minutes.
  - Median minutes per round, and the ratio to the estimate (with the 8-9 band).
  - Per-session rows.
  - The timing shares from phase 14 (`timingReport`).
  - Exports without timing are counted but left out of the minute figures.
- Pure functions in `playtests.ts`: `summarizePlaytests`, `playtestReport`. Unit-tested on fixture exports.

## Decisions made upfront — DO NOT ASK

- The estimate defaults to 8.5 minutes per round, the middle of the spec's "about 8 to 9". A real median between 8 and 9 is "on the estimate".
- An empty runs folder prints "no sessions yet" and exits 0, so the kit ships before any session.
- The sessions and the filled report are a `[needs-user-call]` in `plan/AUDIT.md`. The loop cannot playtest.

## Tests

- Unit:
  - The summary maths (medians, causes, player counts, minutes per round, ratio).
  - The report contains the estimate comparison.
  - The empty folder case.

## DoD

`pnpm verify` green, docs present, the AUDIT row filed, and the deploy green.
