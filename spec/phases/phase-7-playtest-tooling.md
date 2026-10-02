# Phase 7 — Playtest tooling: bot, batch runs, timing export

**Goal:** data to tune the game, from bots and from real play.

## Scope

- `packages/bot`: an autoplay policy that only uses `legalActions` (port ideas from the simulator bot: gather, build upgrades and defenses, return to base, keep dice toward Skills).
- `tools/sim` CLI: run N seeds with a config, output CSV/JSON: rounds survived, cause of end, base health curve, enemies on map, level, Skills owned, milestones.
- **Real timing capture** in the web app: wall-clock time per phase and per decision type, added to the run export.
- A tuning report script that compares two configs (median end round, middle half, minutes per round).

## Acceptance criteria

- 200 bot runs on the default config finish without errors; median end round between 8 and 14 (regression check).
- A real run export contains per-phase timings that sum to the session length (within 5%).
