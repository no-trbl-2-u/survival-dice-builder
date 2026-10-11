# Phase 27 — Rules coverage that still pins the rules

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Rules coverage
> that still pins the rules" (score 5.5, discovery pass 1, promoted via oversight 2026-10-10).
> No engine behaviour changes; no rule or default changes.

## Outcome

1. A test fails when `RULES-COVERAGE.md` cites a test file that does not exist or a quoted test
   title that no test file contains: `tools/sim/src/rulesCoverage.ts` (pure parser and checker)
   and `tools/sim/src/rulesCoverage.test.ts` (unit tests plus the check of the real file).
2. Every stale citation the checker finds is repaired (6.9, 12.1, 11.9, 16.2, the phase 22
   defaults row).
3. 16.7 leaves the 16.2 row; 9.2 leaves the spawn row. Both join one row that marks the rules
   core loop v2 removed (4.2, 4.4, 4.5 wave track, 7.3, 7.4, 9.2, 10.2-10.4, 15, 16.6, 16.7) as
   superseded by `docs/design/core-loop-v2.md`, citing the tests that pin the removals.
4. New rows: 5.3, the Combat v3 engagement steps, Combat v3 siege.
5. Two mislabelled tests are renamed so the label says which option they pin:
   `deck.test.ts` "6.1 draws a hand of the given size (3 here)...", `assign.test.ts`
   "7.8 step 6 with skillUses "once" each Skill is used 1 time only".
6. From the rules-lawyer review: rows and tests for 2.6/2.7, 4.13, 5.2 and 7.13; 4.2, 4.4,
   7.9, 10.2 and 14.2 leave the rows that claimed them live; stale `@rule 9.2` and `@rule 4.2`
   tags in the engine are corrected (comments only).

## Decisions made upfront — DO NOT ASK

- Title matching: a quoted title must appear in the cited file (any test file when no path is
  given); "..." marks a cut, so each piece of the title must appear. A path matches any test
  file whose repo path ends with it.
- A row with no citation must say "superseded by" (or "schema validation only").
- Superseded marks record what core loop v2 already decided; they decide nothing. Siege's
  reading of rows 7 and 7.11 stays open for phase 34.
- The checker lives in `tools/sim` beside the `docs/DECISIONS.md` freshness test.
