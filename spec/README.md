# Survival Dice-Builder — Spec v1 handoff

Package for the agents building the web prototype. Read in this order:

1. `01-spec-v1-rules.md` — the game rules (ASD-STE100). The rules win over every other file.
2. `02-build-plan.md` — 12 phases, dependencies, milestones, handoff rules.
3. `03-build-brief.md` — stack, architecture, engine API, data model, UI, testing.
4. `phases/` — one spec per phase with scope, deliverables, and acceptance criteria.
   Code: 0–8. Non-code: A (assets and libraries, including 3D), B (art direction), C (playtests).

## Reference only (older rules, Issue 004)

- `reference/simulator-engine-issue-004.js` — the simulator's rules engine and bot. Useful for pathing, dice keep logic, Skill assignment, and the time model. It does **not** model the central base, defenses, upgrades, or the wave track. Do not port it as-is.
- `reference/spec-page-and-simulator-issue-004.html` — the animated spec page and visual simulator. Open it in a browser.

## Status

- Rules are at Issue 006 (DRAFT): designer rulings of 2026-10-02 folded in, see `OPEN-QUESTIONS.md`.
- Spec v1 balance is untested (the simulator predates the base). Phase 7 re-tunes it.
- Tile layouts are not designed. Phase 1 proposes them for designer review.
- Source of truth for edits: the design doc in Claude (tabs "Spec v1 — Rules", "Build brief", "Build plan").
