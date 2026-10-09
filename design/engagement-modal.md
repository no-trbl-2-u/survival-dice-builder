# Engagement modal (Combat v3)

An Engage card option opens a modal that runs the whole engagement. Before, the
engagement was split across the Dice panel (under the map), the Skills panel
beside it, the banner at the top, and the map (to pick targets), so the player
scrolled between 4 places for 1 fight.

## Layout

```
+-----------------------------------------------------------------+
| Engagement vs 2 grunts and 1 elite  [Look at the board]  Health |
| (1 Roll) (2 Use dice) (3 Pick target) (4 Result)                |
+-----------------------------------------------------------------+
| What to do now: short sentences (one short line on phones)      |
+-----------------------------------------------------------------+
| Choose a target (only when needed)                              |
+-----------------------------------------------------------------+
| felt: [enemy dice] | [your dice]               Rolls: [x][ ][ ]  |
+-----------------------------------------------------------------+
| Skills: [Strike] [Shot] [Mend] [Guard] ... (wrapping row)        |
+-----------------------------------------------------------------+
+-----------------------------------------------------------------+
            [card] [card] [card] [card]   <- hand strip, pinned to
                                             the screen bottom
|                         [Roll again (n left)]  [Primary action]  |
+-----------------------------------------------------------------+
```

- **Desktop (1280x800):** 1 felt for the roll: the black enemy dice, a seam,
  then your dice (black vs off-white is enough to tell them apart, so there
  are no panel titles). The roll counter sits in the felt's top right corner
  ("Rolls:" and 1 pip per roll, filled once used). The Skills sit under it
  as a horizontal, wrapping row of tiles, then cards to add. Header,
  instruction line, and footer are fixed; only the body scrolls.
- **Phone (375 wide):** still 1 felt, but stacked: the enemy dice above, the
  seam across, your dice below (4 to a row with tighter buttons, so 8 dice
  take 2 rows). Full screen, 1 column in play order (target, enemy
  dice, your dice, Skills, then cards). A compact header keeps every step
  name. The footer buttons share the width and stay on screen. When a target
  pick appears, it scrolls into view (the body may be scrolled down to the
  Skills when it fires).
- **4 stages, not 5.** Cards are added while using dice (the engine offers
  them then), so "Add cards" is not its own stage. Stage 4 is the result.
- **Fixed height.** The modal does not resize as steps change, so buttons do
  not move under the cursor.
- **Targets on a mini map.** When a fired attack Skill needs a target, the
  target box at the top of the body shows a small, fixed map framed on the
  player (radius: the Skill's range + 1) beside one button per target
  ("Strike hits elite, 1 hex east (health 14/14)"). Enemies in range glow orange and
  are clickable; the rest of the map is drawn but inert. Hovering or
  focusing an enemy or its button lights both up (white ring, green glow),
  and the highlighted enemy gets a label beside its token: its name
  ("grunt, 1 hex east") and health, right of the token or left near the
  edge. Orange rings keep meaning "in range"; no legend.
  The buttons stay as the keyboard and screen-reader way. It reuses PlayMap
  (new props: `around`, `fixed`, `highlight`, `onHighlight`). On a phone the
  buttons come first, the map under them. Several fired Skills resolve one
  at a time, the queue's head first.
- **Board clicks count.** A target clicked on the main map during "Look at
  the board" resolves too, and the modal comes back to show the next step or
  the result (after the 1.2s step-aside when the pick dealt damage).
- **Who you face.** The title counts the enemies that rolled dice by kind
  ("vs 2 grunts and 1 elite"); health and guard sit top right, because the
  enemy dice hit them at the end. Enemies are named by kind and place
  ("grunt, 1 hex east"; "grunt, on your hex"; " (1)", " (2)" when two share
  a name) everywhere in the modal; `/debug` keeps engine ids.
- **No pre-selected die** (designer 2026-10-09). At Use dice nothing is
  selected until the player taps dice, then a Skill; meanwhile every Skill
  the free dice can fill shows "can fire".
- **One primary action.** Brass button, bottom right: Stop rolling: use these dice / Done
  adding cards / Stop rerolling / End engagement: enemy dice hit. During a
  target pick the target buttons are the primary actions.
- **The result.** When the engagement ends the modal stays open on
  "Engagement over" with a 1-line verdict ("You defeated 1 enemy and took no
  damage."; "... and your guard stopped 2 damage." when only the guard was
  hit), read out to screen readers (`role="status"`), the enemy dice, the Skills that fired, damage dealt, hits taken
  (guard / health), rewards, and the full event list under a disclosure.
  "Back to the board" closes it and scrolls the page to the map.
- **Phone fit (760px and narrower).** One short instruction line ("Pick dice,
  then a Skill."; screen readers still hear the long one), the Skills in a
  2-column grid with half padding, a 0.75rem effect text and "2 in range" /
  "none in range", and the Skills heading heard but not shown. At 375x812
  with 6 dice and the 4 starter Skills, the last die and the whole Skill
  grid are on screen together at Use dice (an e2e test measures it).
- **"Can fire" is green in the modal**, not red (red read as a warning), and
  the Use dice instruction says a Star fits any slot and that the enemy dice
  hit once no die is left.

## Card strip (drag to the felt)

- The hand sits in a strip pinned to the bottom of the screen, over the
  modal, cards peeking up with their Combat side showing (name and options).
  The modal ends above the peek. A card the engine offers now has a brass
  edge and rises on hover or focus; the others are greyed (cards cannot be
  added while rolling: an engine rule).
- Play a card by dragging it up onto the felt. Pointer events, so mouse and
  touch work alike. While a card is in the air, with no words: the felt
  glows gold and pulses, a dashed card-shaped slot opens in its corner, and
  everything else in the modal fades back. Over the felt, the felt, slot
  and card all turn green. Dropped anywhere else, the card returns to the
  hand.
- A card with 2 options (Rest: Heal 2 / Reroll all dice) shows its options
  as chips over the felt once dropped: the card names both, so asking after
  the drop keeps the drag a single gesture and the choice in the place the
  player is already looking. A × keeps the card in hand.
- Not drag-only: a tap, Enter or Space on a card plays it the same way (or
  opens the chips), and each card's label names its options.
- Reduced motion: no pulse, no card slide, no nudge.
- **First-time nudge.** The first time cards become playable in a run, the
  first playable card rises 14px toward the felt, tilts, and settles back
  (700ms, once, no words). Per run, not stored.
- **Phones and touch.** The hand scrolls sideways when it overflows. On a
  card, sideways is scroll (`touch-action: pan-x`) and mostly-upward is
  drag: a press lifts the card only after it has moved 6px and more up than
  sideways. A held finger opens no menu (no callout, no selection, context
  menu prevented). `touch.spec.ts` drags with real touch events on a
  `mobile-touch` Playwright project (Pixel 7).

## Behaviour

- Native `<dialog>` with `showModal()`: the page behind is inert, focus is
  trapped, and the backdrop dims the board.
- Esc closes only the result screen. Mid-engagement it does nothing, since
  closing would hide choices the engine is waiting on.
- **Step aside after a target pick.** When a pick damages an enemy, the modal
  closes (no paused bar), the board scrolls the enemy into view, and the
  damage floats up off it in red ("-2", 0.9s rise and fade; a defeated
  enemy's token fades with it). After 1.2s the modal comes back on the next
  step or the result. Fixed, not skippable, no controls. A hidden status
  line outside the dialog reads it out ("Strike hit grunt, 1 hex east for 2.
  1 health left."). Reduced motion: the number shows, still, for the same
  1.2s. Heals, guard, and a Skill with no enemy do not step aside.
- "Look at the board" hides the modal and leaves a bar at the bottom of the
  screen ("Back to the engagement"), for checking positions before a target.
- Focus: on open, the primary action; after each action, the new step's
  primary action (or first control); on close, back to where it was.
- Rules stay in the engine. Every button is a legal action; the step strip
  and the instruction only name `exchange.step`.

## Dev tooling (kept)

Kept for testing (designer 2026-10-09); never in a production build.
`Force engagement (dev)`, `Force target pick (dev)`, and `Force elite
engagement (dev)` in the footer, dev server only (`import.meta.env.DEV`),
play the bot forward to an engagement (to a target pick; to an engagement
with an elite die). When no elite comes up, Force elite engagement places
one elite (full health, id `dev-elite`) next to the player at the first
legal Engage and applies that Engage through the engine. `?dice=N` (dev server only) starts each player
with N dice, to see a crowded felt: 8 dice fit 1 row at 1024 and 1280 wide,
2 rows on a 375 phone.

## Blind usability rounds

Two fresh agents, given only the URL and the dev button, played full
engagements at 1280x800 and 375x812.

- Round 1 found: the phone target pick scrolled out of view (blocker); the
  5-stage strip showed an "Add cards" stage that never ran; the modal
  jumped in size per step; red "can fire" read as a warning; Stars were
  not explained; no win/lose headline; rewards hidden; "Back to the board"
  left the page far from the map. All fixed.
- Round 2 confirmed those fixes and found: focus landed on "End engagement"
  (Enter would skip the attack); the Special face and enemy damage were
  unexplained; a defeated enemy's die still hitting felt unfair. Fixed with
  a die-toggle-first focus order, "Hit: 1 dmg" / "Special: 2 dmg" labels,
  and a "Locked: every die hits at the end, even if you defeat the enemy"
  note.
- Left open: the Miss face is an empty black die by design; on phones the
  Skills sit below the dice (scroll needed); a Star placed on a Skill shows
  as the slot's face; elites were not met in either blind run.
- Round 3 (card strip and mini map), with 8 and 6 dice. Confirmed: the drop
  target was obvious without words once a drag started (gold glow, dashed
  slot, green when over); dragging and map-clicking targets both worked.
  Fixed: a card with 2 options looked like it snapped back while its chips
  showed (it now leaves the hand until chosen); "fires" in red read as
  "ready" (engagements now say "fired", muted); "each Skill once per
  engagement" was never said (the Use dice line says it unless skillUses is
  unlimited); the mini map's zoom changed per Skill (fixed radius 3 now);
  a defeated enemy turned into "enemy e8" in the title (its kind now comes
  from the log); keeping a die thickened its border and reflowed the tray
  (a ring now, same size).
- Left open after round 3 (rules or bigger calls): a defeated enemy's die
  still hits (rule); Heal is offered at full health; the auto-selected die
  is often not the one wanted; no in-modal damage note after a target pick;
  on phones, cards peek under the footer and the felt plus Skills need
  scrolling; real touch (long-press vs scroll) is untested.
- Round 4 (phase 24: elites, die picking, the board damage number), at
  1280x800 and 375x812, each tester playing two engagements, one against an
  elite (Force elite engagement). Both finished every engagement; nothing
  blocked, and no rule was misread (a defeated grunt's die still hitting is
  the designer's rule, `defeatedDice: "hit"`). Confirmed: nothing
  pre-selected and "can fire" from the start; place names on target buttons
  and enemy dice ("Strike hits elite, 1 hex north-west (health 14/14)");
  the elite's 2 dice and gold labels; the step strip and one-line prompts;
  at 375 the dice and the 4 starter Skills fit together. Filed as
  `blind-round-4` rows in `plan/CRITIQUE.md`: the step-aside before the
  result can read as a skipped result; a 2-slot Skill at 1 die gives no
  hint; the result does not name who took damage or their health after;
  "in range" counts versus the engaged enemies; card timing, Special, and
  Star meanings come late; a fifth Skill and the target pick still need
  scrolling on phones; the mini-map label can cover tokens; Roll again
  stays on with every die kept.
- Next round: give each tester its own browser context. In round 4 both
  agents drove one shared Playwright tab for a while (one page jumped to the
  other's seed), and each had to discard those runs.
