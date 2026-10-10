# /discover — one-off cloud session prompt

Paste everything below the rule into a new cloud session on
`no-trbl-2-u/survival-dice-builder` (branch off `main`, permission
mode `bypassPermissions` or `auto`; nobody is watching).

---

You are running a one-off **discovery pass** for Survival Dice-Builder.
Goal: file **15 or more** phase candidates into `plan/PHASE_CANDIDATES.md`
so the autonomous loop (`/march` on GitHub Actions, hourly) has a deep,
ruling-checked backlog to promote from. You write plan files only. You
ship no code. You ask no questions (non-interactive run).

## 0. Rules of the run

1. Read `agents.md` first. Standing rules apply: commit + push as one act,
   no `Co-Authored-By`, no emojis, no `--no-verify`, no force-push.
2. **Plan files only.** Allowed writes: `plan/PHASE_CANDIDATES.md`,
   `plan/DISCOVERY.md` (new), `plan/CRITIQUE.md` (observations only),
   `docs/DECISIONS.md` (regenerated, never hand-edited). Nothing under
   `packages/`, `apps/`, `tools/`, `spec/`, `skills/`, `.github/`.
3. **Never change a rule or a default.** Spec v1 wins. A candidate that
   needs a rule change is filed as "needs an OPEN-QUESTIONS reading" and
   names the row to add; it does not propose the new value as fact.
4. Follow the candidate format in `skills/expand.md` §6 Step 2 exactly,
   and score per `skills/expand.md` §5. Add one field the format lacks:
   `- ruling audit: <rows checked> — <no conflict | conflicts with row N: how>`.
5. Every claim about current behaviour cites a file:line or a commit
   hash. Where you infer rather than observe, write `(inferred, ~NN%)`.
6. Do not duplicate: the 1 pending candidate, the 3 promoted + 4 new
   phase rows (25-28) in `plan/steps/01_build_plan.md`, the 2 rejected
   candidates, or any pending `plan/CRITIQUE.md` row that fits one
   `/iterate` tick. A candidate is a **phase**: 3+ files or 2+ surfaces
   or a new module, not a one-file fix.
7. `pnpm verify` must be green before the commit. Note:
   `tools/sim/src/decisions.test.ts` diffs `docs/DECISIONS.md` against
   `plan/AUDIT.md`/`OPEN-QUESTIONS.md`; if you touch those sources run
   `pnpm sim -- decisions --out docs/DECISIONS.md` first. Run every gate
   leg in the foreground.

## 1. Read (parallel where independent)

Spec and intent
- `spec.md`, `spec/02-build-plan.md` (milestones 1-4, phases A-C),
  `spec/03-build-brief.md` (non-goals, engine API, testing), every file
  in `spec/phases/` (acceptance criteria).
- `spec/01-spec-v1-rules.md` sections 1-19 (skim; section 19 = scenarios).
- `OPEN-QUESTIONS.md` (all rows; status vocabulary at line 8),
  `docs/DECISIONS.md`, `RULES-COVERAGE.md`.
- `docs/design/core-loop-v2.md`, `docs/design/combat-v3.md` ("Open" lists).
- `plan/bearings.md` (locked stack, URL contract, engine API, posture).

State
- `plan/steps/01_build_plan.md` (Status block, phase sections 20-28,
  carry-overs), `plan/PHASE_CANDIDATES.md` (all sections),
  `plan/CRITIQUE.md` (pending + done), `plan/AUDIT.md`
  (`[needs-user-call]` rows), `design/` (ART-GUIDE, mockups).
- `docs/reports/*` (phase 9, 14, 22, 23), `docs/playtests/*`
  (PROTOCOL, SURVEY, REPORT, runs/), `docs/retrospective-2026-10-06.md`,
  `docs/research/*`.
- `git log --format='%h %ad %s' --date=short -200` for commit patterns
  (repeated `fix:`/`content:` on one file = a missing abstraction).

Code reality (spawn `rules-lawyer` for the rules part; Explore agents
for the rest; you read only their conclusions)
- `packages/engine/src` module map; which rule sections have a module,
  which have only a test, which have neither.
- `packages/bot/src/policy.ts` capabilities vs. what reports say the bot
  cannot measure.
- `tools/sim/src` commands; what a designer cannot yet batch.
- `apps/web/src` route list vs. `bearings.md` URL contract; components
  with hand-written rule text or engine ids; a11y patterns; bundle size
  (`pnpm --filter @survival/web build` output).
- Test shape: `pnpm test:run` count by package; e2e spec list; golden
  replays; property tests present or absent.
- Loop health: `scripts/pulse.mjs` prints `last pass NaNd ago` (bug);
  `.github/workflows/march.yml` ceiling and cron; Playwright version vs.
  the cloud runner's cached browser; anything else that makes a tick
  silently do nothing.

Live site (spawn `reader`; it returns observations only)
- https://survival-dice-builder.pages.dev — every route, 1280x800 and
  375x812: first-run comprehension, time to first meaningful action,
  anything a stranger would call unfinished.

## 2. Discover — lenses (produce candidates under each; aim 2-4 per lens)

A. **Spec acceptance gaps.** For each `spec/phases/*` acceptance criterion
   and each milestone in `spec/02-build-plan.md`, mark met / partly / unmet
   with evidence. Unmet or partly = candidate. Milestone 4 "Presentable
   build" (phase 8: icons, art, 3D dice, animation) and phase C
   (playtest protocol, first playtests, timing export in use) are the
   expected large gaps; split them into phase-sized pieces.
B. **Rules coverage.** Rule sections with no engine module, no test, or
   a `RULES-COVERAGE.md` row pointing at a test that no longer pins the
   rule. Proposed readings in `OPEN-QUESTIONS.md` that have no config
   flag or no `/decisions` surface.
C. **Designer feedback loop.** What the designer still has to do by hand
   to playtest, judge, or tune (reports → presets, run export → review,
   timing data → any chart). Each manual step = candidate.
D. **Balance instruments.** What the bot/sim cannot measure (see reports'
   caveats and the 2026-10-09 residue rows). Candidates that produce
   numbers, not opinions.
E. **Copy and comprehension.** Clusters of pending critique rows and the
   `content:` commit stream. Phase 25 covers rule text; look for the
   next cluster (onboarding, the first 60 seconds, the run summary,
   the log).
F. **Co-op.** Hot-seat is shipped (phase 13). What is untested or thin
   at 2-4 seats: turn order, shared base, scaling (row 68), seat-aware
   copy, e2e at 4 seats.
G. **Save, export, data.** Run export completeness, save migrations
   (the 2026-10-09 residue says saved configs are not migrated),
   `docs/playtests/runs` schema, anything a future analysis needs now.
H. **Engineering health.** Test gaps (property tests, golden replay
   breadth vs. verify-gate budget per agents.md rule 3), a11y audit
   coverage, bundle size, perf on 375px, loop health bugs from §1.
I. **Physical edition constraint.** `fdf7fba` and row 70 record a
   physical-edition constraint; find every digital-only affordance that
   would not survive a tabletop (hidden state, >20 miniatures, fractional
   damage) and propose checks or config to keep parity.
J. **Beyond v1** (explicitly allowed this run). Scenarios with win
   conditions (rules §19), final art direction, richer co-op, anything
   `spec/03-build-brief.md` lists as a non-goal. File each with
   `- non-goal override: <which non-goal> — needs the designer's yes`
   and apply the §5 -5 modifier honestly. Do not let these crowd out A-I:
   at most 4 of the 15+.

## 3. Audit every candidate against the rulings before filing

Rulings changed 5 times in 7 days (`git log -- OPEN-QUESTIONS.md spec/
docs/design/`). For each candidate:
- list the `OPEN-QUESTIONS.md` rows it touches; read their current
  status (`decided` / `proposed`) and the config keys they set
  (`packages/content/data/config.default.json`);
- confirm the candidate's premise against HEAD, not against an older
  report (the phase 22 tables were measured on exchanges; row 72 made
  engagements the default on 2026-10-09);
- drop or rewrite any candidate whose premise is already shipped
  (check phases 23-28 and the `[x]` critique rows).
Record the result in the `ruling audit` field.

## 4. Write

1. `plan/PHASE_CANDIDATES.md`: append each candidate under `## Pending`
   with `- proposed: <date>, discovery pass 1`. Keep existing rows.
   Update the header `Last pass` / `Pass count` lines only if
   `skills/expand.md` says a discovery counts as a pass; otherwise leave
   them and add a line `> Discovery pass 1: <date> at <sha>`.
2. `plan/DISCOVERY.md` (new): the acceptance-criteria matrix from lens A
   (criterion → met/partly/unmet → evidence), the lens-by-lens candidate
   list with scores, and a **promotion shortlist**: the top 8 by score
   with a one-line "why now" and a suggested phase order that respects
   dependencies (name them: e.g. presets after the defender bot).
3. `plan/CRITIQUE.md`: anything the `reader` found that is a one-tick
   fix goes here as a normal row (`source: discovery`), not as a candidate.
4. Regenerate `docs/DECISIONS.md` if any source it reads changed.

## 5. Commit + push

```
git add plan/PHASE_CANDIDATES.md plan/DISCOVERY.md plan/CRITIQUE.md docs/DECISIONS.md
git commit -m "discover: pass 1 — <K> candidates filed, <M> beyond v1, shortlist of 8"
git push origin main
pnpm deploy:check
```

Body: one bullet per lens with the candidate count, then
`Ruling audit: <N> rows checked, <D> candidates dropped as stale`.
No trailers.

## 6. Final reply (the only chat output that matters)

Under 25 lines:
- commit sha, counts (filed / dropped / beyond-v1 / critique rows),
- the shortlist of 8 as `[score] title — why now — depends on`,
- the 3 candidates you are least sure of and why (`~NN%`),
- anything that needs the designer: new `OPEN-QUESTIONS` rows proposed,
  non-goal overrides requested.
Next step for the user: `/oversight` to promote from the shortlist.
