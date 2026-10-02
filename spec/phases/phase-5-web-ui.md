# Phase 5 — Playable web UI (solo)

**Goal:** the designer plays a full solo run in the browser.

## Scope

Build the UI areas listed in the brief: map (pan, zoom, legal-target highlights), player panel, hand with visible card rotation, dice tray with keep toggles and roll counter, Skill board with live "can fire" highlighting, base panel with upgrade tracks and Shop offers, draft dialog, tile placement preview, phase bar (round, phase, wave track, tiles left, miniature count), event log with rule ids, run summary with export.

- All decisions come from `legalActions`; the UI never decides a rule on its own.
- Animations are driven by engine events and can be skipped. Respect `prefers-reduced-motion`.
- Placeholder icons from Phase A; the SVG die faces from Phase B when ready.

## Acceptance criteria

- A full solo run is playable by mouse and by keyboard.
- Every decision type in the brief has a UI control.
- No rule logic in `apps/web` (checked in review: the UI only calls the engine API).
- The run summary exports JSON with the seed and the full action list (replayable).
