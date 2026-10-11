# Phase 31 — Player names for every map piece

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Player names for
> every map piece" (score 4.5, promoted via oversight 2026-10-10; renumbered 27 to 31 so it
> ships before v0.1.0 and the content era's new piece kinds use one naming rule). No rule or
> config value changes. /debug keeps its ids.

## Outcome

1. One pure naming module, `apps/web/src/names/pieceNames.ts`: enemies by kind and place seen
   from a hex ("grunt, 1 hex east"), and for the log by kind and place from the base centre
   ("grunt 2 hexes north of the base centre", "Tower 1 hex west of the base centre"), with
   "(n)" only when two pieces read the same. `ENGINE_ID` is the id pattern the test checks.
2. The engagement view, the /play choice buttons (`describeAction`), the log
   (`describeEvent`, including the miniature-limit line), and the map's hex titles read it.
3. `describeAction` takes `{ ids: true }` for /debug, which keeps engine ids beside names.
4. /config pick lists show names only; deck presets read "Preset N: 10 cards, hand of 5"; the
   preset sections are labelled by place.
5. A test plays seeded runs (engagements, exchanges, co-op) and fails on any engine id in the
   choice labels, the banner, the last 60 log lines, the Tower-target labels, or hex titles.

## Decisions made upfront — DO NOT ASK

- The log names pieces from the base centre (the log outlives the player's position); buttons
  and the engagement view name them from the current player.
- A piece no longer on the map is its kind alone ("the grunt").
- Hex titles drop the enemy id: one enemy stands on a hex, so the place already tells it apart.
- Closes the critique row "/config — pick lists show internal ids next to names".
