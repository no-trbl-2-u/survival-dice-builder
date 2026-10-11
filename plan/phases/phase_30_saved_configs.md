# Phase 30 — Saved configs that follow the rules

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Saved configs
> that follow the rules" (score 5.5, discovery pass 1, promoted via oversight 2026-10-10 with
> the designer's yes: outside loop scope, web storage and UI). Changes no default.

## Outcome

1. `packages/content/src/configVersions.ts` (pure): `CONFIG_HISTORY` names each default change
   since the phase 21 defaults (version 1) with the value it had before: v2 hand of 5, v3
   engagements, v4 Skill uses and move cost next to enemies. `defaultsAt(version)` rebuilds old
   defaults; `changedFields` lists /config fields that differ; `migrateConfig` moves a save
   forward, giving each untouched field its new default.
2. The browser store saves `{ version, values, changedKeys }` under `survival.config.v2`. A
   save from before versions (`survival.config.v1`) is read as version 1, its changes worked
   out against the version 1 defaults, and replaced on the next save.
3. `/config` and the `/play` start panel say "Playing with N changes from the standard rules"
   with each field and value, and name the saved fields that took a new default.
4. Run exports record the app commit (set at build time) and the changed fields;
   `pnpm sim -- playtests` prints both per run.

## Decisions made upfront — DO NOT ASK

- New keys need no history step: `withConfigDefaults` already fills them.
- A pre-version save is read as version 1. The history values chain, so a save made at
  version 3 reads correctly too.
- Reset stays on /config (with its confirmation); the start panel links to it ("review or
  reset") instead of resetting from /play.
- The commit comes from `GITHUB_SHA` in CI, else `git rev-parse`, else "unknown".
