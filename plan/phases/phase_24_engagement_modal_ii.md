# Phase 24 — Engagement modal II

> Agent-facing brief. Ship without asking. Source: the `plan/CRITIQUE.md` engagement rows the
> designer decided on 2026-10-09 (each row's "suggested fix (user, 2026-10-09)"), plus the pass
> 10 rows on the same modal. Builds on phase 23: engagements are the default Combat model, and
> `cancelledEnemyDice` exists. Design reference: `design/engagement-modal.md`. `spec/` is not
> edited. No engine rule changes in this phase: everything here is presentation, tests, or dev
> tooling.

## Outcome

1. Picking dice starts with nothing selected.
2. After a target pick the modal steps aside, a damage number floats off the enemy on the main
   board, and the modal comes back on its own.
3. At 375x812 the felt and the Skills fit on screen together, under one short instruction line.
4. The first time cards become playable in a run, a card nudges toward the felt, with no words.
5. Enemies are named by kind and place, not engine id. The mini map shows the hovered enemy's
   name and health.
6. The result is read out to screen readers, and the headline counts damage the guard stopped.
7. The phone hand strip scrolls sideways, and a touch-emulated test proves dragging works.
8. The dev tools stay, and a new one forces an elite engagement. A blind round against elites
   closes the phase.

## Routes / API / CLI surface

- No new routes. `/play` only.
- Dev server only (`import.meta.env.DEV`): new footer button "Force elite engagement (dev)" next
  to "Force engagement (dev)" and "Force target pick (dev)". `?dice=N` is unchanged.
- Playwright: new project `mobile-touch` (`devices['Pixel 7']`: `isMobile`, `hasTouch`),
  `testMatch: /touch\.spec\.ts/`. The `chromium` project ignores `touch.spec.ts`.

## Content / data reads

| Helper | Call | Use |
|---|---|---|
| `legalActions(state)` | as now | every button stays a legal action |
| `cancelledEnemyDice(state)` (phase 23) | `EnemyDice` | unchanged here |
| `stepsAway(from, to)` (`map/places.ts`) | new `enemyLabel` | "grunt, 2 hexes north-east" |
| `run.lastEvents` | PlayPage → PlayMap | `enemyDamaged` / `enemyDefeated` events for the damage number |

## Components / handlers

### 1. No pre-selected die (`PlayPage.tsx`)

- Delete `firstFit`. `chosen = (picked ?? []).filter(fits)`.
- `SkillBoard` already shows "can fire" when nothing is selected (`selected.length === 0`), so
  every Skill the free dice can fill is marked green from the start.
- `firstFocus` order is unchanged (a target, else a die's Select toggle, else Roll again, else
  the primary action), so Enter still never ends the engagement first.

### 2. The damage number on the board (`EngagementModal.tsx`, `PlayPage.tsx`, `PlayMap.tsx`)

- **Trigger:** an action taken from the modal or the board whose `run.lastEvents` contain at
  least one `enemyDamaged` (from a `resolveSkill` or `chooseTarget`).
- **Step aside:** the modal closes (`dialog.close()`, as the peek does) with no paused bar. The
  enemy's `<g>` on the main map is scrolled into view (`scrollIntoView({ block: 'center' })`,
  instant). A number floats up from each damaged enemy: `-<amount>` in the danger token colour,
  bold, 0.9 s rise and fade. A defeated enemy shows `-<amount>` and its token fades out with it.
- **Positions:** PlayPage keeps the state the last action was applied to (`before`, a ref
  updated in `act`/`actAll`) and passes `PlayMap` `floats={damageFloats(before, lastEvents)}`:
  one `{ enemy, hex, amount, defeated }` per `enemyDamaged`, with the hex read from `before`
  (a defeated enemy is gone from the new state). `damageFloats` is a pure helper in
  `play/damageFloats.ts` with its own test.
- **Come back:** after 1200 ms the modal reopens on the next step (or on the result, if that pick
  ended the engagement), and `firstFocus` runs. No input is needed and none is offered. With
  reduced motion the number does not move or fade: it shows for the same 1200 ms.
- **Screen readers:** a visually hidden `role="status"` line in PlayPage (outside the dialog, so
  it is heard while the modal is closed): "Strike hit grunt, 1 hex east for 2. 1 health left." or
  "Strike defeated grunt, 1 hex east." Text built in `engageView.ts` `hitLine(before, events)`.
- **Not for:** heals, guard, or a Skill that fired with no enemy (no `enemyDamaged`): the modal
  stays.
- A pick on the main map during "Look at the board" runs the same step-aside (the board is
  already in view, so it only waits the 1200 ms before the modal returns).

### 3. Phone fit (`engageView.ts`, `EngagementModal.tsx`, `Play.module.css`)

- **Instructions, two lengths.** `engageInstruction(state)` (long, desktop) is rewritten in
  short sentences (pass 10 row):
  - roll: "Keep the dice you like. Roll the rest again, or stop and use them. After the last
    roll, you use them."
  - cards: "Add a card from your hand, or choose Done adding cards."
  - reroll: "Choose dice to reroll, or stop rerolling."
  - assign: "Select dice. Then choose a Skill they fit. A Star fits any slot. A full Skill fires
    at once. When no dice are left, the enemy dice hit." (+ " Each Skill fires once per
    engagement." when `skillUses` is not `unlimited`.)
  - targets/resolve: "<Skill> fires. Choose the enemy it hits."
- New `engageInstructionShort(state)`: roll "Keep dice, roll the rest, or use them." · cards
  "Add a card, or Done." · reroll "Pick dice to reroll, or stop." · assign "Pick dice, then a
  Skill." · targets "<Skill>: pick its target."
- Both render in the instruction `<p>`: the long one in a span hidden at `max-width: 760px`, the
  short one in a span shown only there and `aria-hidden="true"`, so screen readers always hear
  the long one once.
- **Compact Skills at ≤760px:** the Skill row becomes a 2-column grid, tile padding halves, the
  effect text is 0.75rem, and the in-range line shortens to "<n> in range" / "none in range"
  (same element, shorter text at that width via the same two-span pattern).
- **Target:** at 375x812 with 6 dice and the 4 starter Skills, during Use dice the last die and
  the whole Skill grid are inside the modal body's visible box without scrolling. An e2e test
  measures it (see Tests).

### 4. First-time card nudge (`CardStrip.tsx`, `Play.module.css`)

- When the strip first has a playable card in this run (PlayPage keeps a `nudged` ref, reset on
  a new run, not stored), the first playable card gets `data-nudge` for one animation: it rises
  14 px toward the felt, tilts -4deg, and settles back, 700 ms, once. Nothing else changes;
  greyed cards stay greyed; no text.
- Reduced motion: no nudge (the brass edge of a playable card is the cue).

### 5. Enemy names (`engageView.ts` or `map/places.ts`, `EngagementModal.tsx`, `PlayMap.tsx`)

- New `enemyLabel(state, id, from)`: `<kind>, <stepsAway(from, hex)>` ("grunt, 1 hex east";
  "here" becomes "grunt, on your hex"). When two enemies would get the same label, add " (1)",
  " (2)" in id order. `from` is the current player's hex. Defeated enemies (log only): the kind
  alone.
- Target buttons: "Strike hits grunt, 1 hex east (health 2/3)"; "Target grunt, 1 hex east
  (health 2/3)". The Tower is not named in Tower-target buttons (pass 10 row).
- Title: "Engagement vs 2 grunts and 1 elite" (counts by kind, in content order).
- Mini map: the highlighted target (hover or focus, on the map or on its button) shows a label
  beside its token: name line `grunt, 1 hex east` and `2/3` health, white text on the dark
  token-label background, placed right of the token or left when it would leave the viewBox.
  Orange rings keep meaning "in range"; no legend.
- `describeAction` keeps the engine id for `/debug`.

### 6. The result, read out (`EngagementModal.tsx`, `engageView.ts`)

- The result headline gets `role="status"` (pass 10 row).
- `engageHeadline`: when `toHealth === 0` and `toGuard > 0`, the second half is "your guard
  stopped <toGuard> damage" ("You defeated 1 enemy and your guard stopped 2 damage.").
  Otherwise unchanged.

### 7. Phone hand strip and touch drag (`CardStrip.tsx`, `Play.module.css`)

- `.cardStripList`: `overflow-x: auto`, `justify-content: safe center`, scroll snap off.
  `.stripOptions` at least 0.75rem (pass 10 row).
- Cards: `touch-action: pan-x` (the browser keeps sideways scrolling of the strip). A press
  becomes a drag only when the pointer has moved `DRAG_START` px **and** mostly upward
  (`-dy > |dx|`). A mostly sideways move never lifts the card.
- `pointercancel` (the browser took the gesture) drops the card back to the hand, as now.
- Long-press: `-webkit-touch-callout: none` and `user-select: none` on cards, and
  `onContextMenu` prevented on a card, so a held finger does not open a menu.

### 8. Dev tools stay; force elite (`devEngage.ts`, `PlayPage.tsx`)

- Replace the "TODO: remove" comments (devEngage.ts, PlayPage `?dice=N` and the buttons) with
  "DEV ONLY: kept for testing (designer 2026-10-09); never in a production build."
- New predicate `engagedWithElite(state)`: an engagement where at least one enemy die belongs to
  an elite (kind from `state.enemies`).
- New `forceEliteEngagement(run)`: `forceEngagement(run, engagedWithElite)`; when that returns
  null, play forward with `forceEngagement`'s loop to the first state where an Engage is legal,
  place one elite (content elite definition, full health, id `dev-elite`) on a free land hex next
  to the current player, then apply that Engage through the engine. Dev only: it edits state
  outside the engine on purpose, like `?dice=N`.
- Button "Force elite engagement (dev)" in the dev footer.

### 9. The elite blind round (last)

- After 1-8 pass verify, run blind round 4 as rounds 1-3 ran: two fresh sub-agents, given only
  the dev server URL and the three dev buttons, at 1280x800 and 375x812, each told to play two
  engagements, one of them against an elite ("Force elite engagement (dev)"). They report what
  confused them; they are not told what changed.
- Fix in this phase anything that blocks finishing an engagement or misreads a rule. File the
  rest as Pending rows in `plan/CRITIQUE.md` (`source: blind-round-4`).
- Write round 4 into `design/engagement-modal.md` "Blind usability rounds": what was confirmed
  (die picking, the board damage number, elite dice and labels) and what was fixed or filed.

## Cross-links

- In (verify): phase 23 shipped (`combat.model` default `engage`; `cancelledEnemyDice`).
- Out: `design/engagement-modal.md` sections Layout (no pre-select, phone fit), Card strip
  (nudge, sideways scroll, touch), Behaviour (step aside after a pick), Dev tooling (kept, force
  elite), Blind usability rounds (round 4).
- Retro-fit: `plan/CRITIQUE.md` moves every row this phase closes to Resolved with the phase
  commit, and the two won't-fix rows (Heal at full health; a Star shows as the slot's face) to
  Resolved as "won't fix (designer 2026-10-09)".

## SEO / metadata

None (in-app UI).

## Empty / loading / error states

- No playable card: no nudge; it waits for the first playable card in the run.
- A pick that deals 0 damage (an enemy with an ignore effect, if one is added later): no
  `enemyDamaged`, no step-aside.
- Force elite engagement finds no free hex next to the player: it moves on to the next legal
  Engage and tries again; null after `MAX_STEPS`, and the button shows the existing "no
  engagement came up" message.

## Decisions made upfront — DO NOT ASK

- **No pre-select** means nothing at all, not "remember the last die".
- **The step-aside is 1200 ms, fixed, not skippable.** Short enough not to need a skip; a skip
  would need a control and words.
- **The number floats on the main board, not the mini map**, because the designer asked for the
  board, and the modal closes anyway.
- **Hex of a defeated enemy comes from the state before the action** (PlayPage `before`), not
  from a new engine event field: presentation only, no engine change.
- **Phone breakpoint is 760 px** (the modal's existing phone rules use it).
- **The nudge is per run, not per browser.** No storage; the designer sees it again in each run,
  which is fine for a prototype.
- **Enemy labels use place, not ids,** everywhere a player reads them in the modal; `/debug`
  keeps ids.
- **Touch: sideways is scroll, upward is drag.** A card dragged sideways onto the felt is not a
  case (the felt is above the strip).
- **The touch test uses CDP `Input.dispatchTouchEvent`** (Playwright's `touchscreen` only taps).
- **The touch test reaches an engagement through play**, as `play.spec.ts` does: the dev buttons
  are not in the preview build the e2e runs against.
- **Blind round fixes in this phase** are limited to blockers and rule misreadings; everything
  else is filed, so the phase ends.
- **No changes to Heal or Star display** (won't fix, designer).

## Mobile reflow

Covered in 3 and 7. 1024x768 and 1280x800 keep the current layout apart from the shorter target
labels. No horizontal page scroll at 375 (existing e2e).

## Pages × tests

| Item | Unit (Vitest) | e2e (Playwright) |
|---|---|---|
| 1 no pre-select | PlayPage-level: `chosen` empty at Use dice (extract `chosenDice` helper to `targets.ts` and test it) | play.spec: at Use dice no die is `aria-pressed="true"` |
| 2 damage number | `damageFloats` (damaged, defeated, two enemies); `hitLine` text | play.spec: after a target pick the dialog closes, `[data-float]` shows on the map, the dialog is open again within 2 s |
| 3 phone fit | `engageInstruction`, `engageInstructionShort` per step | play.spec at 375x812: last die and Skill grid inside the modal body box at Use dice |
| 4 nudge | CardStrip: `data-nudge` on the first playable card once, not after | — |
| 5 names | `enemyLabel` (distance, bearing, "on your hex", duplicates, defeated) | play.spec: target buttons have no `e\d+` id |
| 6 result | `engageHeadline` guard case | play.spec: headline has `role="status"` |
| 7 touch | CardStrip: sideways move never lifts; upward does | touch.spec (`mobile-touch`): touch drag from a playable card to the felt plays it (hand count drops or option chips show) with `scrollY` unchanged; a sideways swipe on the strip scrolls it and plays nothing |
| 8 dev | `engagedWithElite`; `forceEliteEngagement` returns an engagement with an elite die (seeded) | — |

## Verify gate

`pnpm verify` (lint, typecheck, test:run, build, e2e with both Playwright projects), foreground,
then `pnpm deploy:check`. The blind round runs after a green verify, against the dev server;
its fixes get a second verify before the phase commit.

## Commit body template

```
feat: engagement modal II — phase 24

- No pre-selected die; Skills show "can fire" from the start
- After a target pick: the modal steps aside, -N floats off the enemy on the board, back in 1.2 s
- Phone: one short instruction line, compact Skills; felt and Skills fit at 375x812
- First-time card nudge; sideways swipe scrolls the hand, upward drags
- Enemies named by kind and place; mini-map hover label
- Result read out (role=status); guard damage in the headline
- touch.spec on a mobile-touch project; dev tools kept, plus Force elite engagement
- Blind round 4 (elites): <one line>

Decisions:
- <calls made while building>

Closes #<phase issue>
```

## DoD

- [ ] 1-8 shipped with their unit and e2e tests.
- [ ] Blind round 4 run; blockers fixed; the rest filed; design doc updated.
- [ ] CRITIQUE rows moved to Resolved (including the 2 won't-fix rows).
- [ ] Verify (both Playwright projects) and deploy gates green.
- [ ] The commit body asks the designer to try card drag on a real phone at the deployed URL.

## Follow-ups (out of scope)

- The designer's real-phone check of card drag (after deploy). Problems found there are filed
  as Pending rows.
- A remembered "seen the nudge" flag, if the nudge gets old.
- Per-grunt-type Special faces and elite special rules (content work).
