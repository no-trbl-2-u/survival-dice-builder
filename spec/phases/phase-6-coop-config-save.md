# Phase 6 — Co-op hot-seat, configuration panel, save and load

**Goal:** 2–4 players on one screen, adjustable rules, and resumable runs.

## Scope

- Player count 1–4 at setup; seat order; whose decision it is shown clearly; exchanges in turn (16.4).
- Configuration panel for every value in `config.default.json` and every option in rules section 18, with "reset to defaults".
- Save and load to a local file (serialize / deserialize); autosave to browser storage with a clear "this browser only" label.
- Undo for the last decision (developer toggle), implemented by replaying the action list.

## Acceptance criteria

- A 3-player run plays to the end.
- Changing a config value and starting a new run uses the new value (test).
- A saved file loads and continues to the identical state hash.
