# Phase 29 — Playtest kit on the current rules

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Playtest kit on
> the current rules" (score 6.5, discovery pass 1, promoted via oversight 2026-10-10). Docs and
> a generator; no rule or default changes.

## Outcome

1. `packages/content/src/playtestKit.ts` (pure) builds the kit's rule lines from content and
   config through `ruleText`: the PROTOCOL teach list, the SURVEY questions and answer block,
   and the REPORT bot line and survey summary rows.
2. The kit files carry `<!-- kit:<name> -->` ... `<!-- /kit:<name> -->` blocks; the prose
   around them stays hand-written. `pnpm sim -- kit` rewrites the blocks.
3. The survey asks about the v2 loop: the deck and hand (numbers from the default preset),
   stepping off the edge, single-use nodes, engagements (or exchanges, by Combat model), and
   knockout. The deck-size and wave-track items are gone.
4. REPORT drops the fixed "Bot floor 14" and points at the pinned default batch; end causes are
   "base falls" and "unfinished" (a player at 0 is knocked out, not an end).
5. A freshness test per kit file (beside the DECISIONS and RULES-AS-PLAYED ones) fails when a
   block differs from what the config gives.

## Decisions made upfront — DO NOT ASK

- One question list feeds the survey table, the answer block, and the report summary, so the
  three cannot drift apart.
- The Gather amount comes from the default deck's first Gather card, not a literal.
- The bot line sits under the numbers table (an HTML marker inside a table would break it).
