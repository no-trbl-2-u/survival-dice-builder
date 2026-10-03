# Phase 12 — Web UI II: base, Shop, draft, tiles, log, summary — Milestone 2

> Agent-facing brief. Ship without asking. Source:
> `spec/phases/phase-5-web-ui.md` (second half). Builds on `/play` (phase 11).

## Outcome

The designer plays a full solo run in the browser by mouse or keyboard, reads why each thing
happened in the event log, and exports the run as replayable JSON. **Milestone 2.**

## Modules (apps/web/src/play/)

- `BasePanel.tsx` — base health, upgrade tracks (bought / next / cost; Buy buttons while a
  Build is active on the base), Shop offers with Buy buttons (only when legal).
- `DecisionDialog.tsx` — a modal for required choices: Skill draft (keep 1, then replace when
  full) and the replace-starter return. Focus moves into it; it names the choice.
- Tile placement preview — the revealed tile shown beside the map; hovering or focusing a slot
  previews the tile's terrain at that slot.
- `PlayLog.tsx` + `describeEvent.ts` — plain-language event lines, newest first, each with its
  rule id.
- `RunSummary.tsx` + `exportRun.ts` — cause, round, level, milestones, base health by round;
  "Download run (JSON)" with `{ version, seed, config, actions }`, replayable through
  `createGame` + `applyAction`; "New run".
- Focus management — after each action, focus moves to the first control of the next decision
  (dialog first, then the decision panels), and a polite live region announces the step.

## Decisions made upfront — DO NOT ASK

- The Choices panel keeps the map's keyboard path (steps, builds, targets, reveal, stops);
  Shop, upgrades, draft, and starter returns move to their own controls.
- Export schema `version: 1`; the file name is `survival-run-<seed>-round-<n>.json`. A unit
  test replays an export to the same state.
- Reduced motion: the global rule already turns transitions off; the dialog does not animate.
- The base curve in the summary is collected by the UI per round (engine state is unchanged).

## Tests

- Unit: `describeEvent` for each event family, `exportRun` round trip (replay = same state).
- e2e: a full seeded solo run to the run summary through the UI only, then the export
  download contains the seed and every action; no console errors.

## DoD

`pnpm verify` green, deploy green. Milestone 2 noted in the plan.
