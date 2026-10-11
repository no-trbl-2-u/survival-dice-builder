# Phase 32 — Release v0.1.0

> Agent-facing brief. Ship without asking. Source: oversight 2026-10-10 (the designer: cut
> v0.1.0 as a stable baseline before the content era). Last phase of the v0.1.0 checkpoint.

## Outcome

1. Every `package.json` (root and the 5 packages) is at `0.1.0`; the root one is the single
   source, read by `apps/web/vite.config.ts` at build time (`__APP_VERSION__`).
2. Every page ends with a release line: "Survival Dice-Builder v0.1.0 · build <commit>".
3. Run exports record `appVersion` beside `commit`; config saves record `appVersion`;
   `pnpm sim -- playtests` shows "v0.1.0 <commit>" per run.
4. `CHANGELOG.md` has a v0.1.0 section summarising phases 1-31 by area, with known gaps.
5. After the verify and deploy gates are green on the release commit: annotated tag
   `v0.1.0` on it, pushed, and a GitHub release with the CHANGELOG section as notes.

## Decisions made upfront — DO NOT ASK

- The site had no footer; the release line goes in a new shell footer.
- A test checks every package version matches the root one, so the next bump cannot miss
  one.
- The e2e checks the footer's shape, not the number, so it survives a version bump.
- The tag goes on the shipping commit (the feature commit), not the plan tick after it.
