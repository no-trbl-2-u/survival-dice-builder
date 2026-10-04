# Core loop v2 (designer walkthrough, 2026-10-04)

The designer walked through setup and one full round with the loop on
2026-10-04 and settled the base engine. Cards, Skills, elites, and Towers
were left out on purpose. This page records the agreed loop in play
order. It is a working record for the engine (phases 20 and 21); the
designer owns `spec/` and folds it into the next rules issue.

## Setup

1. Put the Base tile on the table. It has 7 hexes: the base at the
   centre and 6 plain hexes. It has no gathering nodes. **The whole
   tile is the base**: buying, upgrades, and enemy attacks on the base
   work from any of its 7 hexes.
2. There is no other tile at the start. Shuffle the countryside tiles
   and put them on top of the shuffled core tiles. This is the tile
   deck. (The designer will add more tiles.)
3. Each player puts their figure on a free base hex (1 figure per hex,
   on the base tile too).
4. Base health 20. There is no wave track.
5. Each player: health 15, 1 action die, 0 materials, 0 currency, the
   4 starter Skills, and a **10-card starter deck** (4 Move 2, 4 Gather
   2, 1 Build, 1 Rest), shuffled, top halves up. A deck never has fewer
   than 10 cards.
6. Experience 0, level 1, round 1. Supplies: 2 copies of each supply
   card, 1 of each Skill. The Shop and the Training Ground are closed
   until their first upgrade is bought.

## Round: Prepare, then Combat

There is no Explore phase. Each round has 2 phases, and the deck is
played twice: top halves in Prepare, bottom halves in Combat.

### Prepare

1. Draw 3 cards. Play a top half, or discard the card without its
   effect. Draw 3 again when the hand is empty; Prepare ends when the
   deck and the hand are empty.
2. **Move N**: each step costs 1. A step onto a hex next to an enemy
   costs 2. A step into an enemy's hex (a skirmish) costs 1.
3. **Exploring**: a step off the edge of the map reveals the top tile of
   the tile deck, placed so that it covers the hex you step into
   (fixed rotation). It costs 1, and you may keep moving. The new
   tile's enemies do **not** appear until the next Combat.
4. **Gather N**: on a gathering node, take N materials (the card sets
   the amount). Each node can be used **once**; a used node is spent.
   All nodes are alike. Haul gathers 2 in total.
5. **Build**: on the base, buy an upgrade; elsewhere, a defense on your
   hex or next to it. (Build and Repair will be separated later.)
6. **Rest**: heal.
7. **Shop**: buy at any moment while your figure is on the base tile.
   Buying does not use a card.
8. Enemies do not move or act during Prepare; they are obstacles.

### Combat

1. Shuffle the discard pile; turn the deck so the bottom halves are up.
2. **Enemies move**: each enemy moves up to 2 hexes. Enemies head for
   the nearest structure (Barricade, Tower, or the base tile); they turn
   to a player only when that player is at least 2 hexes nearer than
   the nearest structure. An enemy stops next to its target, cannot
   enter a hex with an enemy, a Barricade, or a Tower, and takes the
   next target when every path is blocked.
3. **Enemies spawn** (after moving): every spawn node gets 1 grunt and
   every elite spawn node gets 1 elite, every Combat, on every revealed
   tile. If the node is occupied, the enemy spills to the nearest empty
   hex. The map limit is 20 enemy miniatures: a spawn that would pass it
   instead turns the grunt nearest the base into an elite.
4. Each Tower attacks.
5. **Exchanges** until the deck is empty:
   1. Draw 3. Roll all your dice; keep and reroll, up to 3 rolls.
   2. Play bottom halves (or discard them). Non-attack halves (heal,
      guard, reroll) work even when no enemy is near; damage needs a
      target in range.
   3. Put dice on Skills; fire every Skill whose faces are all covered.
   4. Each enemy next to you that has you as its target attacks you
      (grunt: 2 damage). Guard takes damage first, then health. Guard
      is removed; played cards go to the discard pile.
6. **Structure attack** (once): each enemy that is not next to a player
   attacks 1 adjacent structure: Barricade first, then Tower, then the
   base.
7. Players do not move during Combat.

### End of round

1. Turn the discard pile so the top halves are up: the next Prepare deck.
2. If the Training Ground is open and the round is even, do the Skill
   draft.
3. Add 1 to the round counter. Examine the milestones.

## Experience, defeat, and the end

- Each defeated enemy gives shared experience; the player who defeats it
  gets its currency. A Tower's defeat pays currency to the Tower's
  builder. Each new level gives every player 1 more die.
- A player at 0 health is **knocked out**: at the start of the next round
  the figure returns to a free base hex. (Proposed: at half health,
  losing the materials they carried. Values to confirm.)
- The run ends when the base reaches 0 health. There is no win yet: the
  score is the rounds survived and the milestones. Scenarios are an idea
  for after the base engine is ready.

## Still open

- New tiles: how many, and what is on them (the designer will add more).
- Knockout details: health on return, and the penalty.
- The experience curve (bot experiments, phase 22).
- Elites (structure damage, ranged retaliation), Towers, cards, and
  Skills (upgraded tiers, caps, heal targets), and Build versus Repair:
  outside this walkthrough by design.
- Milestones that relied on the old structure ("Reveal 7 tiles") need a
  review once the tile set is known.
- Scenarios (rules section 19): a later brainstorm.
