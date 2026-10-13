# Phase 41 — The engine on Spec v2

> Agent-facing brief. Ship without asking. Source: `plan/steps/01_build_plan.md` row 41 (added via
> oversight 2026-10-11; unblocked 2026-10-12, Spec v2 signed off). The 10 changes are the list
> "What the rulings change in the game" in `docs/spec-v2-draft/RULINGS.md`; the rules text is
> `spec/01-spec-v2-rules.md`, which beats every other file.

## Outcome

The engine plays Spec v2. Each of the 10 changes ships with tests and a `RULES-COVERAGE.md` row
that cites the Spec v2 rule:

1. **Presets (ruling 7, 18.1).** `deck.presets` keeps only `deck-10-hand-5`; the 6/3, 8/4 and
   10/3 presets go (ruling 7 drops "the 8-card / hand-of-3 option": every preset with 8 cards or a
   hand of 3).
2. **No skirmish (ruling 12; 6.9, 6.10-6.15, 7.8).** A figure cannot move into an enemy's hex, in
   any phase, with any card (Blink included). `movement/skirmish.ts`, `exchange.skirmish`,
   `rulings.skirmishFail` and the skirmish events go. A card top half may be `{ kind: "engage" }`
   (6.7): playing it in Prepare runs 1 engagement (7.8) from the player's hex. No card in
   `cards.json` has one yet (v2 open); a test card proves it.
3. **Gather amounts (ruling 13, Table 8).** Haul 3, Forage 2, Excavate 4, Quarry 6.
4. **Enemy dice and siege from the record (rulings 15, 17; 9.6, Table 5, 7.11).** Each enemy in
   `enemies.json` carries `dice` (grunt 1, elite 2) and `siege` (grunt 1, elite 3). The engine
   reads them; `combat.engage.eliteDice`, `siegeDamage`, `eliteSiegeDamage` leave the config.
5. **v1 enemy damage out (ruling 18; 9.5).** The enemy record's `attack` (grunt fixed 2, elite 6
   action dice), `enemyDieDamage`, `combat.enemyAttacks` (row 65), `combat.adjacentAttack`
   (row 69), `rulings.structureDamage` (row 7) and `Enemy.attackedThisCombat` go. Siege (7.11) is
   the only structure damage under both Combat models.
6. **Experience steps of 3 (ruling 20, 8.5).** `experience.firstStep: 3`, `stepIncrease: 3`
   (levels at 3, 9, 18, 30); the knobs stay.
7. **Levelled Build (ruling 25; 6.7, 11.4, 12.1, 12.5).** A Build effect has a `level`
   (default 1). It buys an upgrade only when its tier is at most that level, and builds a defense
   only when the defense's `level` (new in `defenses.json`: Barricade 1, Tower 1) is at most
   that level. Repair stays the Combat option it is today (12.5).
8. **Draft (rulings 26, 28; 11.6-11.8).** Already played: `draft.reveal` new Skills per player
   plus that player's pool; an empty supply falls back to the next lower level. Tests and
   coverage rows against v2 only.
9. **Knockout loses currency (ruling 30, 14.2).** New `knockout.loseCurrency` (default true).
10. **Skill uses (ruling 31, 18.1).** `options.skillUses` goes; a Skill fires again whenever the
    dice fill it again, under both Combat models.

Then the code that reads Spec v1 reads Spec v2 (`packages/content/src/rulesAsPlayed.ts`,
`tools/sim/src/cli.ts`, `apps/web/src/decisions/Inline.tsx`, their tests), and
`docs/RULES-AS-PLAYED.md` is regenerated against Spec v2.

## Routes / API / CLI surface

- `@survival/content`: `EnemyDefSchema` `{ dice, siege }`; `PrepareEffectSchema` gains
  `engage` and `build.level`; `DefenseDefSchema.level`; config keys removed/added as above;
  `CONFIG_HISTORY` version 5 (deck presets, experience steps).
- `@survival/engine`: `MoveOption.skirmish` and `startSkirmish` removed; `enemyDice(state,
  enemy)`, `siegeDamage(state, enemy)` exported.
- No new routes. /config loses the removed fields; /play loses the skirmish copy.

## Tests

- `packages/engine/test/spec-v2.test.ts`: one describe block per change (1-10), named by Spec
  v2 rule id.
- Existing tests that set a removed key or play a skirmish are rewritten or deleted with the
  rule they tested. Goldens are regenerated (`UPDATE_GOLDEN=1`).
- `packages/content` load / config tests: new amounts, enemy records, presets, defaults.

## Decisions made upfront — DO NOT ASK

- **The exchange Combat model stays** as a non-default playtest option: Spec v2 drops only its
  v1 enemy numbers. Under exchanges an enemy now rolls its record's enemy dice (Table 4) at the
  end of the exchange, only when it targets the player (the old default), and the end of Combat
  is the siege step. Removing the model is a separate candidate.
- **Levelled Build ships as the rule**, which leaves Shop II/III and Training II/III unbuyable
  until Build II/III cards exist (v2 open). A new `rulings.buildLevels: "levelled" | "any"`
  (default `levelled`) lets a playtest turn it off. `OPEN-QUESTIONS.md` gets a row.
- **A Prepare engagement** takes no card adds (hand cards show top halves there): roll, keep,
  put dice on Skills, then the enemy dice hit.
- `ignoreEnemyCost` stays (the 6.9 surcharge stays a config option, ruling 11).
- The milestone "Reveal 10 tiles" stays (v2 open).
