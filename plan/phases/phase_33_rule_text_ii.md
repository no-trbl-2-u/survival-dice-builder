# Phase 33 — Rule text II

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Rule text II"
> (score 4.5, discovery pass 1), promoted via oversight 2026-10-11 to close the critique pass 12
> rule-text cluster (rows 1-5: 1 HIGH, 3 MED, 1 LOW). Phase 25 moved rule numbers into
> `ruleText`; this phase does the same for rule sentences in words. `spec/` is not edited. No rule
> value or default changes: this phase only moves and rewrites copy.

## Outcome

1. `ruleText` builds the sentences the pass 12 rows found wrong or missing, from config:
   - the Exchanges sentence reads `combat.adjacentAttack` ("then each enemy next to you that
     targets you attacks" for `target-only`; "then every enemy next to you attacks" for
     `any-adjacent`) — HIGH row 1;
   - the hand-emptying line reads `rulings.mandatoryPlays` ("Play or discard each card ..." when
     discarding is allowed, "Play each card ..." when it is not) — MED row 4;
   - a new `targetOrderText` says enemies head for the nearest structure, turn to a player only
     when the player is `rulings.playerPullDistance` hexes nearer, and use
     `rulings.targetTieBreak` only between equally near targets — MED row 3;
   - a new `cardStepText` for the card step of an exchange and of an engagement Combat;
   - a new `returnStarterText` for the starter-return dialog;
   - a new `ruleCitation` that shows a rule tag in player words ("Combat v3" -> "engagements",
     "core loop v2" -> "core loop").
2. `nextStep` (the exchange card step and the engagement Combat line), `DecisionDialog` (the
   starter-return line), and `EngagementModal` (the end-of-engagement hand line) read those
   phrases. The /play log and the /config rules note show tags through `ruleCitation`.
3. `config.meta.json` help no longer restates rules the live line builds: `combat.model`,
   `combat.adjacentAttack`, `rulings.targetTieBreak`, `rulings.playerPullDistance`,
   `rulings.mandatoryPlays` describe the setting; `ruleLineFor` gives each its live phrase.
   The Combat model help no longer says "each enemy rolls a die back" (the live line says 1 die
   per grunt and `combat.engage.eliteDice` per elite) — MED row 2.
4. No help text starts with "Row N:" — LOW row 5. The open-question number stays in the
   field's `rule` (the source field), which /config shows as "Rules 9.2 (open question 66)" and
   /decisions already links to the field.
5. Scans:
   - `apps/web/src/ruleNumbers.test.ts` also catches number words ("one round", "two dice").
   - a content test scans every `config.meta.json` label, help, option phrase, and placeholder
     for rule numbers (digits or words) with a short allow-list for option definitions (a
     setting's own formula, not a config value).
   - a build-word scan (`Row N`, `phase N`, `Combat v3`, `core loop v2`, `Spec v1`) over web
     player text, `config.meta.json` text, and every `ruleCitation` of an engine log tag and a
     meta `rule`.

## Routes / API / CLI surface

- No new routes. `/`, `/play`, `/config` change copy only.
- `@survival/content` exports `targetOrderText`, `cardStepText`, `returnStarterText`,
  `ruleCitation`; `combatEndText` takes the config.

## Content / data reads

| Phrase | Config read |
|---|---|
| `combatText(config, 'exchange')` | `combat.adjacentAttack` |
| `combatEndText(config)` | `rulings.mandatoryPlays` |
| `cardStepText(config, model)` | `rulings.mandatoryPlays` |
| `targetOrderText(config)` | `rulings.playerPullDistance`, `rulings.targetTieBreak` |
| `returnStarterText()` | none (the dialog shows only when `options.boughtCards` is `replace-starter`) |
| `ruleLineFor` adds | `combat.model`, `combat.adjacentAttack`, `rulings.targetTieBreak`, `rulings.playerPullDistance`, `rulings.mandatoryPlays` |

## Tests

- `packages/content/src/ruleText.test.ts`: each new or changed phrase under both values of the
  config it reads; `ruleCitation` maps both tags and passes section numbers through.
- `packages/content/src/configMetaText.test.ts`: the meta rule-number and build-word scans,
  each with a self-test that a planted phrase is caught.
- `apps/web/src/ruleNumbers.test.ts`: number words; a build-word scan with a self-test.
- `apps/web/src/play/nextStep.test.ts`: the card step follows `rulings.mandatoryPlays`.
- Regenerate `docs/RULES-AS-PLAYED.md` and the playtest kit sections (their freshness tests
  pin the text).
- e2e: existing home, play, and config specs stay green.

## Decisions made upfront — DO NOT ASK

- Engine log tags (`rule: 'Combat v3'`) stay as they are: they are data, and engine tests pin
  them. Only their display goes through `ruleCitation`.
- `config.meta.json` `rule` fields keep their citations ("Combat v3", "open question 65"): they
  are the source field. /config shows them through `ruleCitation`.
- "1 enemy die for each grunt" stays fixed in `ruleText`: a grunt's one die is not a config
  value (only `combat.engage.eliteDice` is).
- Option phrases that define the option itself ("Each grunt rolls 1 die", "1 enemy per 2
  seats") are allow-listed, not rewritten.
