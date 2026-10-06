# Engagement modal (Combat v3)

An Engage card option opens a modal that runs the whole engagement. Before, the
engagement was split across the Dice panel (under the map), the Skills panel
beside it, the banner at the top, and the map (to pick targets), so the player
scrolled between 4 places for 1 fight.

## Layout

```
+-----------------------------------------------------------------+
| Engagement vs elite e8      [Look at the board]  Health · Guard |
| (1 Roll) (2 Use dice) (3 Pick target) (4 Result)                |
+-----------------------------------------------------------------+
| What to do now, in one sentence                                  |
+--------------------------------------+--------------------------+
| Choose a target (only when needed)   | Skills                   |
| Enemy dice (locked)                  |  (scrolls with the body) |
| Your dice                            |                          |
| Cards you can add (only when legal)  |                          |
+--------------------------------------+--------------------------+
|                         [Roll again (n left)]  [Primary action]  |
+-----------------------------------------------------------------+
```

- **Desktop (1280x800):** 2 columns, 7:5. The dice side holds everything that
  changes from step to step; the Skills stay put on the right. Header, the
  instruction line, and the footer are fixed; only the body scrolls, and at
  1280x800 a normal hand of Skills fits.
- **Phone (375 wide):** full screen, 1 column in play order (target, enemy
  dice, your dice, Skills, then cards). A compact header keeps every step
  name. The footer buttons share the width and stay on screen. When a target
  pick appears, it scrolls into view (the body may be scrolled down to the
  Skills when it fires).
- **4 stages, not 5.** Cards are added while using dice (the engine offers
  them then), so "Add cards" is not its own stage. Stage 4 is the result.
- **Fixed height.** The modal does not resize as steps change, so buttons do
  not move under the cursor.
- **Targets in the modal.** A fired attack Skill lists its legal targets as
  buttons ("Strike hits elite e8 (health 14/14)"), so the map is never
  needed mid-engagement. The section sits first in the column and has an
  orange edge so it is the first thing the eye lands on.
- **Who you face.** The title names every enemy that rolled dice; health and
  guard sit top right, because the enemy dice hit them at the end.
- **One primary action.** Brass button, bottom right: Stop rolling: use these dice / Done
  adding cards / Stop rerolling / End engagement: enemy dice hit. During a
  target pick the target buttons are the primary actions.
- **The result.** When the engagement ends the modal stays open on
  "Engagement over" with a 1-line verdict ("You defeated 1 enemy and took no
  damage."), the enemy dice, the Skills that fired, damage dealt, hits taken
  (guard / health), rewards, and the full event list under a disclosure.
  "Back to the board" closes it and scrolls the page to the map.
- **"Can fire" is green in the modal**, not red (red read as a warning), and
  the Use dice instruction says a Star fits any slot and that the enemy dice
  hit once no die is left.

## Behaviour

- Native `<dialog>` with `showModal()`: the page behind is inert, focus is
  trapped, and the backdrop dims the board.
- Esc closes only the result screen. Mid-engagement it does nothing, since
  closing would hide choices the engine is waiting on.
- "Look at the board" hides the modal and leaves a bar at the bottom of the
  screen ("Back to the engagement"), for checking positions before a target.
- Focus: on open, the primary action; after each action, the new step's
  primary action (or first control); on close, back to where it was.
- Rules stay in the engine. Every button is a legal action; the step strip
  and the instruction only name `exchange.step`.

## Dev tooling (temporary)

`Force engagement (dev)` and `Force target pick (dev)` in the footer, dev
server only (`import.meta.env.DEV`), play the bot forward to an engagement
(or to a target pick). Remove them with `apps/web/src/play/devEngage.ts`
once the modal is signed off.

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
