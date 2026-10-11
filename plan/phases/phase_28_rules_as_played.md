# Phase 28 — Rules as played

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Rules as played"
> (score 4.5, discovery pass 1, promoted via oversight 2026-10-10). The rulebook the v0.1.0
> tag carries. Writes a doc beside `spec/`, never into it (bearings hard rule 9).

## Outcome

1. `packages/content/src/rulesAsPlayed.ts` (pure): parses Spec v1 into sections and numbered
   rules, matches each rule to its `OPEN-QUESTIONS.md` rows (ids and ranges), and gives each a
   status: same, changed, superseded, or open, with the "as played" text and its source.
2. The core loop v2 and Combat v3 changes are a short table keyed by rule id whose text is
   built from `ruleText` and config (reveal, spawning, knockout, Gather, Combat model, siege,
   draft pool, miniature limit), so numbers follow the config.
3. `pnpm sim -- rules --out docs/RULES-AS-PLAYED.md` writes the doc: a count per status, then
   one table per Spec v1 section (Rule, As written, Status, As played, Source).
4. A freshness test beside the `docs/DECISIONS.md` one fails when the doc is out of date.

## Decisions made upfront — DO NOT ASK

- Status order: a known v2/v3 change wins; else a superseded row (with no decided row) gives
  superseded; else a proposed or pending-spec row gives open; else a decided row gives changed;
  else same.
- "As played" for a row-backed rule is the row's Reading cell as written.
- Under engagements 7.10-7.13 read as the siege step; whether siege reads row 7 and 7.11's
  "not next to a player" is marked open (phase 34 owns it).
- The fold-in into `spec/` stays an `/oversight` act; this doc decides nothing.
- `ruleText` already covers sections 9-12 well enough; the phase stays at 1.
