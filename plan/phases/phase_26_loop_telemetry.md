# Phase 26 — Loop telemetry

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Loop telemetry"
> (score 5.5, discovery pass 1, promoted via oversight 2026-10-10). First phase of the v0.1.0
> checkpoint. Tooling only: no rule, content, engine or web change.

## Outcome

1. Every cloud tick says what it did on its run page. The ceiling step writes a job summary
   (weighted budget against the ceiling, and on a skip the time the budget next frees) and, on a
   skip, a `::notice::` annotation, so a skipped run is no longer a silent green check. A final
   `if: always()` step appends the tick outcome: the commits the tick pushed to main, or
   "no commit this tick".
2. `node scripts/pulse.mjs` tells the truth:
   - dates in headers are parsed strictly (the leading `YYYY-MM-DD` of "2026-10-10 at commit
     8402ba3"), so `NaNd ago` is gone; an unparsable date prints "date unreadable";
   - `audit` counts the open `[ ]` rows of the latest pass in `plan/AUDIT.md` plus its
     `[needs-user-call]` rows (the file has no `## Pending` section);
   - a new `cloud` row: weighted budget in the last 24 h against the ceiling, computed offline
     from `git log` with the same weights as `march.yml` (phase commit 3, churn 1), the ceiling
     read from the `ceiling=` line in `march.yml`, and "ticks skip until <time>" when at or over.
3. The pure parsers live in `scripts/pulse-lib.mjs` with `node:test` tests in
   `scripts/__tests__/pulse-lib.test.mjs`.
4. The `scripts/__tests__` suite joins the verify gate: `test:run` runs vitest, then
   `node --test "scripts/__tests__/*.test.mjs"`. (Today those 17 tests run nowhere.)
5. `scripts/one-pagers.mjs` launches Playwright's own Chromium; `PW_CHROMIUM` overrides the
   path. The Linux-only `/opt/pw-browsers/chromium` constant is gone.

## Routes / API / CLI surface

- No routes. `node scripts/pulse.mjs` output gains a `cloud` row; other rows keep their labels.

## Tests

- `scripts/__tests__/pulse-lib.test.mjs`: `headerDate` (with and without "at commit", junk,
  "never"); `auditPending` on a two-pass fixture (only the latest pass's `[ ]` rows count) plus
  needs-user-call rows; `cloudBudget` (weights, 24 h window edge, the free-at time);
  `ceilingFromWorkflow` (reads `ceiling=12`, falls back to 12).
- Existing gate stays green.

## Decisions made upfront — DO NOT ASK

- No committed `plan/LOOP-LOG.md`. A no-op tick must not commit (march, critique), and a log
  commit would itself spend cloud budget. The run page's job summary is the per-tick log; the
  agent prompt already asks for one, and the workflow now writes its own lines around it.
- pulse stays offline (its header contract). The `cloud` row is computed from git, not
  `gh run list`; the last-run outcome is on the run page.
- The ceiling logic in `march.yml` stays in bash; pulse mirrors it, and a test pins the weights.
- Closes the critique row "tooling — pulse prints last pass NaNd ago and always 0 audit rows".
