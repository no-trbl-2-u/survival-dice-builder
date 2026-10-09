# Phase 23 — Engagements by default; defeated enemies' dice

> Agent-facing brief. Ship without asking. Source: two `plan/CRITIQUE.md` rows the designer
> decided on 2026-10-09 ("Config Start run always starts an engagement run, whatever Combat model
> is saved" and "a defeated enemy's die still hits, and nothing says so"). `spec/` is not edited.
> This is a rules and config phase. The engagement modal UI rows (no pre-selected die, the board
> damage number, phone fit, card nudge, mini-map names, touch test, elite blind round) are the
> next phase, planned after this one ships.

## Outcome

1. A new run plays Combat as engagements (Combat v3) unless the config says `exchange`.
   Config's Start run follows the saved config: no URL override.
2. `combat.engage.defeatedDice` exists. Default `"hit"` keeps the designer's rule: every enemy
   die rolled hits at the end of the engagement, all at once, including the dice of an enemy the
   player defeated during it. `"cancelled"` is the sim experiment: a defeated enemy's dice do not
   hit.
3. The sim baseline is re-pinned for the engagement default, and
   `docs/reports/phase-23-defeated-dice.md` compares `"hit"` with `"cancelled"`.

## Routes / API / CLI surface

- No new routes. `/play?combat=engage` keeps working; `/play?combat=exchange` is added, so both
  models stay reachable by URL (e2e and the designer's links).
- `/config` Start run goes to `/play?seed=<n>` (no `&combat=`).
- `pnpm sim` and `pnpm sim -- compare` are unchanged; the comparison uses a partial config file.

## Content / data (packages/content)

| File | Change |
|---|---|
| `data/config.default.json` | `combat.model: "engage"`. `combat.engage.defeatedDice: "hit"`. |
| `src/schemas/config.ts` | `model` `.default('engage')` (a stored config without the key now gets engagements). `engage.defeatedDice: z.enum(['hit', 'cancelled'])`, default `'hit'` in the engage block default too. |
| `data/config.meta.json` | `combat.model` help: engagements first ("Engagements (default, designer 2026-10-09)"), exchanges as the written-rules option. New `combat.engage.defeatedDice`: label "Defeated enemies' dice", help "Hit: every enemy die rolled hits at the end of the engagement, all at once, even the dice of an enemy you defeated (designer rule, 2026-10-09). Cancelled: a defeated enemy's dice do not hit (experiment).", rule "Combat v3", options `{ "hit": "Still hit (default)", "cancelled": "Cancelled (experiment)" }`. |
| `docs/reports/phase-23/cancelled.json` | `{ "combat": { "engage": { "defeatedDice": "cancelled" } } }` |

## Engine (packages/engine)

| Area | Change |
|---|---|
| `combat/engage.ts` `finishEngagement` | Before the ignore check: when `cfg.defeatedDice === 'cancelled'` and `roll.enemy` is no longer in `current.enemies`, push `{ type: 'enemyDieCancelled', rule: 'Combat v3', enemy, player }` and `continue`. A cancelled die does not use up an "ignore 1 hit". Miss faces stay silent as now. |
| `combat/engage.ts` new `cancelledEnemyDice(state): number[]` | Indexes into `exchange.engage.enemyDice` of the dice that will not hit: empty when `defeatedDice` is `'hit'`, else the dice whose enemy is gone. Exported from the package index. TSDoc `@rule Combat v3 (designer 2026-10-09)`. |
| `events/events.ts` | Adds `{ type: 'enemyDieCancelled'; enemy: string; player: string }`. |
| `apps/web/src/play/describeEvent.ts` (log text) | "A die of grunt e3 is cancelled: grunt e3 was defeated." |

No state version bump: the new config key has a default and no state field is added. A save
from before this phase loads with `defeatedDice: "hit"` through the schema default.

## Bot and sim

- The bot needs no change: it already plays engagements (200 runs, 0 errors, 0 stalls, checked
  while planning).
- `tools/sim/src/run.test.ts` "the default batch": re-pin to the engagement numbers. Measured
  while planning on seeds 1-200: median end round 7, middle half 6-7, range 5-12, causes
  `{ base: 200 }`, milestones `survive-round-5: 200, buy-upgrades: 90, survive-round-10: 11`
  (re-measure in the phase; pin what the run gives, and name the describe block "the default
  batch (engagements, designer 2026-10-09)").
- Add a second pinned batch for `combat.model: "exchange"` with the old numbers (median 6,
  [5, 7], 5-16, the current milestones), so the exchange model keeps a regression net.
- `decisions.test.ts` and any sim test that assumed exchanges: pin `model: 'exchange'` where the
  test is about exchanges; otherwise update the expectation.

## The report (`docs/reports/phase-23-defeated-dice.md`)

`pnpm sim -- compare --a default --b docs/reports/phase-23/cancelled.json --runs 200` solo, and
again with `--seats 2`. Each: the compare table, three lines of reading (end round, hits taken,
level), and one line: "Default stays `hit` (designer rule); `cancelled` is the measured
alternative." Top: the weak-bot caveat (the bot does not pick targets to kill before the dice
hit, so the gap is a floor) and the 8-14 target band.

## Web (apps/web)

- `config/ConfigPage.tsx`: Start run href `/play?seed=${Date.now() % 100000}`.
- `play/PlayPage.tsx`: `?combat=` accepts `engage` and `exchange`; anything else uses the
  config's model.
- `play/StartPanel.tsx`: the Combat select starts at the config's model (prop from PlayPage),
  not a hard-coded `'engage'`.
- `play/DiceTray.tsx` `EnemyDice`: a die in `cancelledEnemyDice(state)` gets
  `data-cancelled` (CSS: 40% opacity, no glyph change) and its aria-label ends ", cancelled:
  its enemy was defeated". The UI reads the engine helper; it never checks the config itself.
- `play/engageView.ts` `lastEngagement`: counts `enemyDieCancelled` as `cancelled`; the summary
  line reads "<n> dice of defeated enemies did not hit" only when n > 0.
- With the default (`"hit"`) nothing on screen changes. No "Locked" note comes back (the
  designer removed it).

## Decisions made upfront — DO NOT ASK

- **Engagements are the default; exchanges stay.** The exchange model is the written rules
  (Spec v1 7.8) and stays selectable in `/config`, on the start panel, and by URL.
- **Saved configs are not migrated.** A config saved in `/config` before this phase keeps its
  explicit `"exchange"` (and any explicit `skillUses`). Only a missing key takes the new default.
  The phase commit body says so, and the designer resets `/config` once.
- **The rule stays `hit`.** The designer: everything happens at the same time at the end, so the
  player still has to defend against a defeated enemy's attack. `cancelled` exists for the sim.
- **An enum, not a boolean** (`"hit" | "cancelled"`), matching `combat.enemyAttacks` and
  `combat.adjacentAttack`: the value names the rule.
- **"Defeated" means "not in `state.enemies` at the end"**: `damageEnemy` removes an enemy at 0
  health, and nothing else removes one during an engagement.
- **A cancelled die is checked before "ignore 1 hit"**, so the ignore is not wasted on a die that
  would not hit anyway.
- **Only engagements.** The exchange model rolls no enemy dice ahead of time, so the key does
  nothing there; the help text says it is a Combat v3 number (it sits in `combat.engage`).
- **Goldens stay exchange replays.** The four golden configs have no `model` key and
  `createGame` does not apply schema defaults, so they still replay as exchanges and their hashes
  hold. Write `"model": "exchange"` into each golden's `config.combat` (the hash ignores `model`
  via `withoutCombatV3`), and make the `UPDATE_GOLDEN` path build its config with
  `model: 'exchange'`, so a regeneration never switches them by accident.
- **One new golden for engagements:** `p23-engage-run.json`, a full solo run to the end, seed
  23, builder policy, default config (engagements). Its hash is the plain `serialize` hash (no
  `withoutCombatV3`).
- **Tests that are about exchanges get an exchange config**, not new expectations: a shared
  `exchangeConfig` in `packages/engine/test/helpers/` (default config with `model: 'exchange'`),
  used by every engine and bot test that fails after the flip because it walks the exchange
  steps. A test that is about something else (map, progression) and only fails on a number moves
  to the new number with a one-line comment.

## Tests

- **Engine unit (`engage.test.ts`):** `finishEngagement` with an enemy defeated mid-engagement:
  `"hit"` → its dice hit (current behaviour, now asserted); `"cancelled"` → `enemyDieCancelled`
  per die, no damage from them, the other enemy's dice still hit; a cancelled die does not use
  an "ignore 1 hit"; `cancelledEnemyDice` empty under `"hit"`, the right indexes under
  `"cancelled"`.
- **Content:** the schema default for `defeatedDice` and for `model` when the key is missing.
- **Goldens:** the four exchange goldens unchanged; `p23-engage-run.json` added.
- **Sim:** the two pinned batches (engagements default, exchanges).
- **Web unit:** `EnemyDice` marks a cancelled die (`data-cancelled`, aria-label) only under
  `"cancelled"`; `lastEngagement` counts cancelled dice.
- **e2e:** `config.spec.ts` Start run URL matches `/\/play\?seed=\d+$/`; the existing full solo
  run (`play-full.spec.ts`) plays to the end under the new default (switch it to
  `?combat=exchange` only if it is an exchange walk-through, and add an engagement full run in
  that case); `a11y.spec.ts` keeps selecting `exchange` explicitly.

## Docs

- `OPEN-QUESTIONS.md` row 72: config cell `combat.model: "engage"` (default since 2026-10-09,
  designer), `"exchange"` is the written-rules option; status "decided 2026-10-09 (default)". A
  new paragraph under "Designer change 2026-10-09": defeated enemies' dice still hit (rule),
  `combat.engage.defeatedDice` measures the alternative, link to the report.
- `design/one-pagers/v2/FACTS.md`: one fact each for the default model and the defeated-dice
  rule, citing `config.default.json`.
- `RULES-COVERAGE.md`: a row for `defeatedDice` (Combat v3 → `finishEngagement`,
  `cancelledEnemyDice` → `engage.test.ts`).
- `plan/CRITIQUE.md`: move the two source rows to Resolved with the phase commit.
- `docs/DECISIONS.md` regenerated (`pnpm sim -- decisions`).

## Mobile / output limits

No layout change. A cancelled enemy die keeps its size; only opacity changes, so the felt does
not reflow.

## Pages × tests

| Surface | Unit | e2e |
|---|---|---|
| `/config` Start run | — | URL without `combat` |
| `/play` default run | engine goldens, sim batch | full run still reaches the summary |
| `/play` enemy dice (cancelled) | DiceTray, engageView | — |
| sim | run.test (2 batches) | — |

## Verify gate

`pnpm verify` (lint, typecheck, test:run, build, e2e), foreground, then `pnpm deploy:check`.
The report batches run before the gate, in foreground calls.

## Commit body template

```
feat: engagements by default, and a switch for defeated enemies' dice — phase 23

- combat.model defaults to "engage"; Start run follows the saved config
- combat.engage.defeatedDice: "hit" (default, designer rule) | "cancelled"
- Sim baseline: engagements median <n> (exchanges kept as a second pinned batch)
- docs/reports/phase-23-defeated-dice.md: <one line>
- Saved configs are not migrated: reset /config once to pick up the new defaults

Decisions:
- <calls made while building>

Closes #<phase issue>
```

## DoD

- [ ] A fresh run (no saved config) plays engagements; exchanges still selectable.
- [ ] Start run has no URL override.
- [ ] `defeatedDice` in content, engine, UI (cancelled dice greyed only when on), with tests.
- [ ] Sim: two pinned batches; report written.
- [ ] Exchange goldens unchanged, engagement golden added.
- [ ] OPEN-QUESTIONS, FACTS, RULES-COVERAGE, CRITIQUE, DECISIONS updated; verify and deploy
      gates green.

## Follow-ups (out of scope)

- The engagement modal UI phase (next): no pre-selected die, board damage number after a target
  pick, phone fit, first-time card nudge, mini-map names on hover, touch-emulated drag test, a
  dev tool to force an elite engagement, and the elite blind round at the end.
- A bot that picks targets to defeat enemies before their dice hit (would sharpen the
  comparison).
- Migrating saved configs (only if the designer asks).
