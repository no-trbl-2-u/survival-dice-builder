# Phase 39 — Try the proposals

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Try the
> proposals" (score 5.5, expand pass 3), promoted via oversight 2026-10-11 after the phase 38
> batch so the presets carry engagement numbers. Rows 63-70 stay `proposed`: a preset changes
> only the player's local config, never a default.

## Outcome

1. **Proposals in content.** `packages/content/data/proposals.json`, validated by Zod
   (`ProposalsFileSchema`): one entry per structural row 63-70 with an id, the row, a plain
   label and one-sentence "about", the config options it sets (dotted path and value), a
   recommendation (`turn-on`, `playtest`, `keep-off`), and either the measured effect under
   engagements (solo, or 4 seats for row 68; 200 runs; the default bot and the defender bot;
   median end round, middle half, and stalled runs for the standard rules and for the proposal)
   or `combatModel: "exchange"` for the rows that change nothing under engagements (65, 69).
2. **Pure helpers** in `packages/content/src/proposals.ts`: `defaultProposals`,
   `proposalProblems` (an unknown path, a value equal to the default, a result the config
   schema rejects, a repeated id or row, a measured entry on an Exchanges-only proposal),
   `applyProposal(config, p)`, `proposalsIn(config)` (every proposal whose options the config
   carries), `proposalForRow(n)`, `measuredText(p)`, `adviceText(p)`.
3. **/decisions** shows, under each row with a proposal, the measured effect in plain words,
   the recommendation, and a **Try this on /play** button: it applies the proposal to the
   saved config (keeping the player's other changes) and opens /play. An Exchanges-only
   proposal says it changes nothing under engagements and has no button.
4. **The "playing with" mark.** `ConfigChanges` (on /config and the /play start panel) names
   the proposals the config carries ("Playing with proposals: Forced reveal."), each linked
   to its row on /decisions.
5. **/config** gets a "Proposals" group: an **Apply** button per proposal sets its options in
   the draft (save as usual). **/play** start panel gets **Reset to the standard rules** when
   the config differs from the defaults.
6. **Run exports** record `proposals` (the ids `proposalsIn` finds); the file version stays 4
   (an optional field, like `changedKeys`).
7. `docs/reports/phase-39-proposals.md`: the engagement tables the measured entries come from,
   with the command to re-run each.

## Routes / API / CLI surface

- No new routes. `/decisions`, `/config`, `/play` (start panel) change.
- Content: `ProposalSchema`, `ProposalsFileSchema`, `Proposal`, and the helpers above, exported
  from `@survival/content`.
- Web: `applyProposalToStore(store, p)` in `configStore.ts`; `decisions/ProposalTry.tsx`;
  `config/ProposalList.tsx`; `RunExport.proposals`.

## Tests

- `packages/content/src/proposals.test.ts`: the file parses; `proposalProblems` is empty for the
  shipped file and catches each problem kind on a broken copy; every option differs from the
  default (drift guard); `applyProposal` does not mutate and passes the schema; `proposalsIn`
  finds an applied proposal and not a half-applied one; a test fails when a structural row
  63-70 has no proposal; `measuredText` / `adviceText` carry no build words.
- `configStore.test.ts`: `applyProposalToStore` keeps other changes and stores the options.
- `ConfigChanges.test.tsx`: the proposals line with links.
- `DecisionsPage.test.tsx`: measured line and button on row 63; row 65 says Exchanges only and
  has no button.
- `exportRun` test: `proposals` recorded.
- e2e (`config.spec.ts`): Try this on /play on row 63 lands on /play with "Playing with
  proposals: Forced reveal"; Reset to the standard rules clears it; /config Apply then Save
  shows the mark.

## Decisions made upfront — DO NOT ASK

- **"Proposals", not "presets", in code and copy.** `presets` already names the deck presets
  (`config.decks`, `source: "presets"`); a second meaning would confuse /config.
- Proposals are separate from `Content` (like `config.meta.json`): UI and measurement data, not
  rules the engine reads.
- Measured under engagements with today's sim (phase 38 `compare --configs`, the phase 22
  config files), both bots, so the default bot's floor and the defender's ceiling both show.
  Row 68 is measured at 4 seats (at 2 seats it is the default by construction).
- Recommendations follow the engagement numbers, not the phase 22 exchange numbers: row 67
  moves from "turn on" to "needs a playtest" (the defender stalls in 157 of 200 runs with it).
  A recommendation is the loop's reading of a bot batch, not a ruling.
- Try this on /play saves directly (the /decisions page has no draft); /config Apply edits the
  draft, so the safe save flow (phase 19) stays the one way to save on /config.
- The sim's `rec` / `exp` option sets stay as measurement tools (phase 38); no change there.
- No `OPEN-QUESTIONS.md`, `RULES-COVERAGE.md`, engine, or default change.
