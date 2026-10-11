# Phase 37 — The rulings the engagement model bypasses

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "The rulings the
> engagement model bypasses" (score 5.0, discovery pass 1), promoted via oversight 2026-10-10,
> renumbered 34 -> 37 via oversight 2026-10-11. Records readings as shipped: no rule, config
> value, or default changes. The designer answers the new `proposed` rows.

## Outcome

1. `OPEN-QUESTIONS.md` gets 5 rows:
   - 73 (`proposed`): under engagements, does siege use `rulings.structureDamage` (row 7) and the
     7.11 "not next to a player" check? Reading as shipped: no to both. Every enemy next to a
     structure at the end of Combat deals `combat.engage.siegeDamage` (an elite
     `eliteSiegeDamage`), whether or not a player stands next to it.
   - 74 (`proposed`): do rows 65 (`combat.enemyAttacks`) and 69 (`combat.adjacentAttack`) apply
     under engagements? Reading as shipped: no, exchanges only. In an engagement every adjacent
     enemy already rolls enemy dice once per engagement. Cites `docs/reports/phase-36-defender.md`.
   - 75, 76, 77 (`decided 2026-10-09`): the designer's changes of that day, which had config keys
     but no row: `options.skillUses: "unlimited"` (cc92fe3), `combat.moveCostNextToEnemy: 1`
     (9ba3222), `draft.unpicked: "pool"` (256bdb4).
2. `config.meta.json` tags every key one Combat model ignores: `rulings.structureDamage` joins
   `combat.enemyAttacks` and `combat.adjacentAttack` as `combatModel: "exchange"`; the
   `combat.engage.*` leaves get `combatModel: "engage"`. Row 7 on /decisions now carries
   "Exchanges only".
3. /config shows the tag on each tagged field: "Exchanges only." and, when the draft's
   `combat.model` is the other model, "Combat is set to engagements, so changing it changes
   nothing." (one pure helper in content, `combatModelNote`).
4. /decisions gets a "Decided recently" section after the open readings: rows whose status is
   `decided <date>` within 14 days of the newest decided date in the file, newest first, each
   with its question and reading. `docs/DECISIONS.md` gets the same section and is regenerated.

## Routes / API / CLI surface

- `@survival/content`: `recentDecisions(rows, days?)`, `decidedDate(status)`,
  `RECENT_DAYS`, `combatModelNote(model, current)`; `decisionsMarkdown` adds the section.
- /decisions: a `#recent` section and nav link. /config: the tag in each tagged field's help.
- `pnpm sim -- decisions --out docs/DECISIONS.md` (unchanged command, new output).

## Tests

- `packages/content/src/decisions.test.ts`: `decidedDate`; `recentDecisions` (window anchored on
  the newest date, newest first, superseded and undated rows left out); the markdown section;
  `combatModelNote` both ways; rows 73-77 parse with their statuses; row 7 is tagged
  "Exchanges only".
- `packages/bot/src/combatModel.test.ts`: for every key tagged with one Combat model, a bot run
  under the other model with the key set to each other value plays the same game (same events)
  over 5 seeds. This is the test that keeps the tags honest.
- `apps/web/src/decisions/DecisionsPage.test.tsx`: the recent section lists rows 75-77.
- `apps/web/e2e/config.spec.ts`: the structure-damage field reads "Exchanges only".

## Decisions made upfront — DO NOT ASK

- "Recent" is anchored on the newest decided date in `OPEN-QUESTIONS.md`, not on today, so
  `docs/DECISIONS.md` stays a pure function of its inputs and its freshness test cannot rot with
  the calendar. The window is 14 days, as the candidate says.
- Only statuses starting with `decided` and carrying a date count; `superseded` and
  `decided (brief)` rows are left out.
- Rows 65 and 69 are not edited beyond what row 74 says; their status stays `proposed`.
- The siege row cites the siege code path, not a config change; no engine change.
- No RULES-COVERAGE rows: no rule or engine code changes.
