# Phase 25 — Rule text from one source

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Rule text from
> one source" (score 6.5, promoted via oversight 2026-10-10). Every rule change since phase 20
> left hand-written copy behind (14+ hand fixes). `spec/` is not edited. No rule value or
> default changes: this phase only moves copy.

## Outcome

1. One pure module, `packages/content/src/ruleText.ts`, builds every rule phrase the site
   shows from a `GameConfig`: the goal, knockout, reveal cost, spawning from new tiles, Gather,
   the Combat model (and when Combat ends), the draft (keep count, slots, pool), the miniature
   limit, the player count, and the milestone labels.
2. `/` (HomePage), `/play` (start panel, cards, draft dialog, run summary) and `/config` help
   read it. A rule change in config changes the copy with no component edit.
3. `/config` shows the live phrase under the fields it covers ("With these values: ..."), built
   from the draft being edited.
4. The existing "unused" test (`packages/engine/test/configUse.test.ts`) is tightened: it reads
   engine code only (no tests, no comments) and needs a property access (`.key`), so a key
   named only in a comment or a test counts as unread.
5. A new web test fails when a component or view string holds a rule number next to a rule
   word ("keep 1 Skill", "6 draft slots", "1 to 4 players") instead of reading it from config.

## Routes / API / CLI surface

- No new routes. `/`, `/play`, `/config` change copy only.
- `@survival/content` exports the `ruleText` functions; `milestoneIds` and `milestoneLabel`
  move there from `apps/web/src/play/milestoneText.ts` (deleted; its test moves with it).

## Content / data reads

| Phrase | Config read |
|---|---|
| `goalText` | none (base falls ends the run) |
| `knockoutText` | `knockout.returnHealthDivisor`, `knockout.loseMaterials` |
| `revealText` | `tiles.revealMoveCost` |
| `spawnText` | `spawn.newTileDelay` |
| `gatherText(amount)` | `rulings.gatherNeedsNode`, `gather.offNodeAmount` |
| `combatText(model)` | `combat.engage.eliteDice` (engage) |
| `draftTitle`, `draftFullText`, `draftPoolText` | `draft.keep`, `player.draftSlots`, `draft.unpicked` |
| `miniatureLimitText` | `miniatureLimit` |
| `playersText` | `players.min`, `players.max` |
| `ruleLineFor(path)` | maps a config path to its phrase for /config |

## Components

- `HomePage.tsx`: the pitch, the two steps, and the knockout line from `defaultContent.config`.
- `StartPanel.tsx`: goal + knockout lines and both Combat hints from the default config.
- `CardView.tsx` `topText(e, config)`: Gather reads `gatherText`; callers pass the run config.
- `DecisionDialog.tsx`: title, full-slots line, and pool line from the run config.
- `RunSummary.tsx`: milestone labels from content.
- `ConfigPage.tsx`: under each field's help, `ruleLineFor(path, draft)` when the draft parses.

## Tests

- `packages/content/src/ruleText.test.ts`: every phrase follows its config value (two values
  each); milestone tests moved from web.
- `packages/engine/test/configUse.test.ts`: tightened as in Outcome 4; the unused set is still
  the 6 marked fields.
- `apps/web/src/ruleNumbers.test.ts`: scans non-test `.ts`/`.tsx` under `apps/web/src`, comments
  stripped, for `<1-9 digits> <rule word>`; a short allow-list names the geometry facts (a tile
  has 7 hexes; a single-target effect hits 1 enemy).
- e2e: existing home, play, and config specs stay green; config spec asserts the live line.

## Decisions made upfront — DO NOT ASK

- Module lives in content (it reads config and content only), not in the engine.
- `/` and the start panel use the default config (they describe the game before a run); in a
  run the run's own config is used.
- Divisor wording: 2 is "half", otherwise "1/N", rounded up as the engine does.
- No `config.meta.json` help is rewritten into templates; the live line sits beside it.
