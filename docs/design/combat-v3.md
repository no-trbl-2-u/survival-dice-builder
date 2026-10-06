# Combat v3 (designer playtest, 2026-10-06)

The designer played /play on 2026-10-06 and found that the Combat in
Spec v1 (7.8) is not the Combat they intend. Spec v1 gives a starting
player at most 2 single-target hits per Combat (1 die, 2 exchanges)
against a board of up to 20 enemies, and every adjacent enemy attacks
once per exchange whatever the player does. This page records the
replacement as agreed so far. It is a working record; the designer owns
`spec/` and folds it in once the Combat deck is designed. Nothing here
is in the engine yet.

## Agreed

1. **Combat uses the whole deck, a hand at a time** (hand of 5, as now).
   Every card in hand must be played or discarded before the next hand
   is drawn; when the deck is empty, Combat ends and the round moves on.
2. **Playing cards is not a gate to attacking.** A player does not have
   to play every Combat card before they may roll to attack.
3. **An engagement is the attack.** Each engagement costs 1 **Engage**
   play: an Engage card, or the Engage option of a card that offers a
   choice. (Test reading; the alternatives were 1 free engagement per
   Combat, or free unlimited engagements.)
4. **Engagement sequence** (revised 2026-10-06: Engage has no target):
   1. Play Engage from anywhere, even with no enemy near.
   2. Roll your action dice **and 1 enemy die for each enemy adjacent
      to you.** An enemy further away rolls nothing.
   3. Reroll your own dice (up to the roll limit), then stop rolling.
      **Enemy dice are never rerolled.**
   4. **Use the dice 1 at a time, in any order:** select a die, select a
      Skill slot; when a Skill's slots are full it fires at once, and an
      attack on 1 enemy asks you to click its target on the map. Repeat
      (Wand before Sword if you like). Cards (rerolls, heals) can be
      added at any point.
   5. **The enemy dice resolve last**, when you are done (or no die can
      be used), so only the damage your Skills did not stop (guard,
      Dodge) reaches you.

   The gamble: engage from 2 hexes away. Nothing rolls back at you,
   but without a Bow the Engage play is wasted.
5. **Enemy die (grunt):** 6 faces: **2 Hit, 3 Miss, 1 Special.** What
   Special does depends on the grunt type.
6. **No enemy attack phase.** Enemies hurt players only through
   engagements.
7. **Siege phase** (new): each enemy adjacent to a structure (the base,
   a Tower, a Barricade) deals **1 damage** to it. Elites have a special
   siege rule instead.
8. **Combat cards change.** The +damage and +guard bottom halves go.
   Starter cards get **"Move 2 / Engage"** style Combat sides: a card
   can offer a choice of options, and Engage is one of them, so more
   cards get used.
9. **Starter Combat sides** (10-card deck): Move x4 "Move 2 / Engage";
   Gather x4 "Engage / Reroll 1 die"; Build x1 "Repair 2"; Rest x1
   "Heal 2 / Reroll all dice".

## Playtest build (2026-10-06)

`/play` runs this as `combat.model: "engage"` (the start panel's Combat
choice; `?combat=engage` for a seeded run). Spec v1 exchanges stay the
default everywhere else. Readings the build had to pick for the open
points below (all config numbers under `combat.engage`):

- **Resolving:** an attack with no enemy in range fires with no
  effect. The engagement ends by itself when no die can be used and no
  card in hand can reroll one; otherwise "Done with dice" ends it.
- **Enemy dice:** Hit = 1 damage, Special = 2 damage (placeholder for
  per-grunt Specials); an elite rolls 2 enemy dice. Guard soaks first;
  Dodge ignores 1 die.
- **Skills:** as today, every Skill your dice fill fires.
- **Adding cards:** play the reroll or heal options of other cards
  while you use the dice ("Reroll all" rerolls only unused dice).
- **Between engagements:** Move (never into an enemy), Heal, Repair, or
  discard. Reroll options only work inside an engagement.
- **Repair:** on the Base tile it repairs the base; elsewhere the most
  damaged defense on or next to your hex.
- **Siege:** once, at the end of Combat; grunt 1, elite 3 (placeholder).
- **Unchanged:** enemies still move and spawn at Combat start, Towers
  still fire, and Prepare skirmishes still use the v1 exchange.
- **Bought cards** got placeholder options in the same pattern (see
  `cards.json`, field `combat`).

## Open

- What the Combat deck looks like: which options exist besides Move and
  Engage, how many Engage plays a 10-card starter deck holds, and what
  bought cards add. (Next: brainstorm.)
- What a Hit does: 1 damage each? Does guard still soak Hits?
- How dice "fire a Skill" in an engagement: 1 Skill per engagement, or
  every Skill the dice fill (today's rule)?
- Each grunt type's Special, and each elite's siege rule.
- Siege timing: once per Combat (start or end), or once per hand.
- Do enemies still move 2 hexes at Combat start (7.5), and do Towers
  still fire (7.6)?
- Move in Combat: can a player walk into a new adjacency mid-Combat,
  and does leaving an adjacent enemy cost anything?
