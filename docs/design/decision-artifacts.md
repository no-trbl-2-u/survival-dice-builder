# Decision artifact types (2026-11-11)

A ballot (mark Open / Decided / Defer) fits one kind of decision. Open decisions come in 4 kinds:
pick one system, tune a number, accept a reading, design content. 10 artifact types, each run on
the real engine, showing the choice in a real game state, projecting it forward, and handing
back something the repo takes (config patch, row status, content JSON).

| # | Type | Kind | Serves |
| --- | --- | --- | --- |
| 1 | Run Theater | pick one | Row 79 (Event Calendar). Built: `tools/sim/src/theater.ts` |
| 2 | Tuning Bench | tune | Rows 63, 64, 66, 70, 68, 17, 56 |
| 3 | Option Mixer | tune | Rows 63-70 together, with the calendar |
| 4 | Skill and Card Workbench | design | Rows 9, 12, 46, 78 |
| 5 | Encounter Sandbox | design | Enemy and structure design |
| 6 | Milestone Ladder | tune | Rows 4, 78 |
| 7 | Economy Ledger | tune | Row 67, upgrade costs |
| 8 | Ruling Scene | reading | Row 61 |
| 9 | Tile Atelier | design | Row 57 |
| 10 | Tabletop Proof | pick one | Row 70, physical pieces, playtests |

Build order after the Run Theater, by open decisions served per effort: Tuning Bench, Option
Mixer, Milestone Ladder, Skill and Card Workbench, then the rest.

## Run Theater

`playTheater(config, seed, options)` plays one bot run and records a frame per Combat start.
`tools/sim/src/theaterBundle.entry.ts` is the browser entry (engine, bot, config schema as one
script; bundle with esbuild, `--format=iife --global-name=SDB`). The page plays one seed under
each calendar side by side, runs full batches over seeds 1-N, and exports a config patch.

Checks: `theater.test.ts` (a recorded run ends in the same round as `playRun`); the page's
exported patch for Notoriety, 40 seeds, defender bot gave median 10, middle half 8-14, 5 stalled,
and `pnpm sim -- --config pick.json --runs 40 --policy defender` gave the same.
