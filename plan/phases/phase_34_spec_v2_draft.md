# Phase 34 — Spec v2 draft

> Agent-facing brief. Ship without asking. Source: oversight 2026-10-11 (two sessions): phase 34
> unblocked as "the loop drafts, the designer reviews", then 32 rulings taken over every changed,
> superseded, and open rule, recorded in `docs/spec-v2-draft/RULINGS.md`. Docs only: no change
> to `spec/`, content, config, or the engine (bearings rule 9: `spec/` changes only at
> `/oversight`).

## Outcome

1. `docs/spec-v2-draft/01-spec-v2-rules.md`: the full Spec v2 rules text in the Spec v1 voice
   (ASD-STE100, 20/25-word sentence limits).
   - Spec v1 rule ids are kept. A rule the rulings delete stays as a one-line
     "Deleted in Spec v2" entry, so `RULES-COVERAGE.md` rows can be retargeted id for id.
   - The 59 "same" rules carry over word for word.
   - Each ruled rule is rewritten from its ruling; tags: **[v2]** for a changed rule,
     **[v2 open: ...]** for a rule the designer left open.
   - Numbers come from `config.default.json` and the content JSON as the engine plays them,
     except where a ruling changes them (Gather amounts, experience step, knockout).
2. A review table at the end of the draft: rule id, ruling number, one-line change.
3. `docs/spec-v2-draft/README.md`: what the folder is, how the designer signs off (at
   `/oversight`: copy the draft to `spec/01-spec-v2-rules.md`, point `spec.md` at it, unblock
   phase 41).

## Tests

None. Docs only; no code path reads `docs/spec-v2-draft/`. The verify gate still runs.

## Decisions made upfront — DO NOT ASK

- Keep v1 rule ids rather than renumber: phase 41 retargets coverage rows by id, and the
  designer reviews a diff against v1 more easily.
- Rulings that need content the designer has not designed (Build II/III and Repair cards,
  elite types, Skill tiers) are written as rules with the card or record values marked
  **[v2 open]**. The draft never invents a card.
- Rules the rulings did not touch but that the v2 loop makes stale (milestone "Reveal 10
  tiles", configuration list 18.1) are updated to what the engine plays and flagged in the
  review table as "carried, check".
- The Event Calendar notes stay as notes on 9.2 and 6.7; no rule text for it.
