# Survival Dice-Builder — Rules Specification (ASD-STE100), Spec v1 (Issue 005)

Writing standard: ASD-STE100 writing rules. Game terms are technical names.
Procedural sentences: 20 words maximum. Descriptive sentences: 25 words maximum.

## 1 General

1.1 This specification gives the rules for the game.
1.2 The players cannot win the game. The players try to stay alive for as many rounds as possible.
1.3 The players defend the base on the center tile. They go out to get materials and to fight.
1.4 Milestones show the progress of a run. Section 17 gives the milestones.
1.5 The game is for 1 to 4 players. Sections 1 to 15 give the rules for 1 player.
1.6 Section 16 gives the changes for 2 to 4 players.
1.7 Target: a typical solo run stops in rounds 10 to 12. 12 rounds take approximately 90 minutes.
1.8 No item stays from one run to the next run.

## 2 Components

2.1 Each player has these components:
- 1 player board with Skill slots.
- 1 figure.
- 1 health track. The maximum health is 15.
- 1 action die (d6) at the start.
- 6 starter cards.

2.2 The shared components are:
- Map tiles: 1 Base tile, countryside tiles, and core tiles.
- 1 base board with a health track and the upgrade track.
- Enemy miniatures: grunts and elites. The limit is 20 miniatures.
- Barricade tokens and Tower tokens.
- 1 experience track and 1 wave track.
- Materials and currency tokens.
- 3 card supplies (Level 1, 2, 3) and 3 Skill supplies (Level 1, 2, 3).

2.3 Each action die has 6 faces: Sword, Wand, Bow, Shield, Star, and Blank.
2.4 The Star face is wild. A Star counts as any one face of your choice.
2.5 The Blank face has no effect.
2.6 Each card has 2 halves. The top half is the Prepare effect.
2.7 The bottom half is upside down. The bottom half is the Combat effect.

## 3 Map tiles

3.1 Each map tile has 7 hexes: 1 center hex and 6 outer hexes.
3.2 A countryside tile has a green back. A core tile has a brown back.
3.3 Each hex has a terrain: plains, forest, hills, wasteland, lake, or mountain.
3.4 Figures and enemies cannot enter a lake hex or a mountain hex.
3.5 The sites are printed on the tiles. Table 1 gives the sites.
3.6 The center hex of the Base tile is the base.

Table 1 — Sites

| Site | Function | Where |
| --- | --- | --- |
| Base | The players defend this hex. Upgrades are bought here | Base tile, center hex |
| Gathering node | Gives 2 materials (Gather effect) | Base tile: 2. Countryside: 1 or 2. Core: 1 |
| Spawn node | Holds 1 grunt | Countryside: 1. Core: 1 |
| Elite spawn node | Holds 1 elite | Core: 1, center hex |

## 4 Setup

4.1 Put the Base tile in the center of the table.
4.2 Shuffle 5 countryside tiles. Put 5 shuffled core tiles below them. This stack is the tile deck.
4.3 Put 2 countryside tiles adjacent to the Base tile.
4.4 Put 1 enemy on each spawn node.
4.5 Set the base health to 20. Set the wave track to 0.
4.6 Put your figure on the base.
4.7 Get 1 action die.
4.8 Shuffle your 6 starter cards. Put them face down with the top half up. This stack is your deck.
4.9 Set your health to 15.
4.10 Put the 4 starter Skills on your player board (Table 3).
4.11 Set the experience track to 0. Set the level to 1.
4.12 Shuffle each card supply and each Skill supply.
4.13 Set the round counter to 1.

Table 2 — Starter cards (6)

| Quantity | Top half (Prepare) | Bottom half (Combat) |
| --- | --- | --- |
| 2 | Move 2 | Reroll 1 die |
| 2 | Gather | +1 damage |
| 1 | Build | +2 guard |
| 1 | Rest: heal 2 | Reroll all dice |

Table 3 — Starter Skills

| Skill | Faces | Effect |
| --- | --- | --- |
| Strike | Sword | 2 damage, range 1 |
| Shot | Bow | 1 damage, range 2 |
| Mend | Wand | Heal 1 |
| Guard | Shield | 2 guard |

## 5 Round sequence

5.1 Each round has 3 phases in this sequence: Prepare, Combat, Explore.
5.2 Your deck sets the length of the Prepare phase and the Combat phase.
5.3 Each round uses 2 passes through your deck.
5.4 Your deck can grow. Each new card makes Prepare longer and Combat longer.

## 6 Prepare phase

6.1 Draw 3 cards from your deck.
6.2 Play the top half of each card. Do the effect.
6.3 Put each played card in your discard pile.
6.4 When your hand is empty, draw 3 cards again.
6.5 If your deck has fewer than 3 cards, draw all the cards.
6.6 When your deck is empty and your hand is empty, the Prepare phase stops.

6.7 Top-half effects:
- Move: Move your figure the number of hexes that the card shows.
- Gather: Get the materials that the gathering node on your hex gives.
- Build: On the base, buy 1 base upgrade (Section 11). On other hexes, build 1 defense (Section 12).
- Rest: Heal the quantity that the card shows.

6.8 If your figure is on the base and the Shop is open, you can buy cards. Buying does not use a card.

6.9 Enemies are obstacles in the Prepare phase:
- You cannot gather or build on a hex that has an enemy.
- A move into a hex next to an enemy costs 2 hexes.

6.10 Skirmish: If you move into a hex with an enemy, a skirmish starts.
6.11 In a skirmish, roll your dice 1 time. Use only your Skills. Do not use cards.
6.12 Then each enemy in that hex attacks 1 time.
6.13 If all enemies in that hex are defeated, move your figure into the hex.

## 7 Combat phase

7.1 Shuffle your discard pile.
7.2 Turn the deck 180 degrees. The bottom halves are now up.
7.3 Put 1 enemy on each spawn node whose enemy was defeated.
7.4 If the wave track is more than 0, do the wave step (Section 10.4).
7.5 Each enemy moves 2 hexes toward the nearest target (Section 9.3).
7.6 Each Tower attacks (Section 12.3).
7.7 Do combat exchanges until your deck is empty.

7.8 For each combat exchange, do these steps in sequence:
1. Draw 3 cards.
2. Roll all your action dice.
3. Keep the dice that you want. Roll the other dice again.
4. Do step 3 one more time if necessary. The maximum is 3 rolls.
5. Play the bottom half of the cards in your hand.
6. Put dice on your Skills. Use each die 1 time only. Use each Skill 1 time only.
7. Do the Skills that have all their faces.
8. Each enemy next to you attacks you (Section 9.5).
9. Apply the enemy damage to your guard first. Apply the remaining damage to your health.
10. Remove all guard. Put the played cards in your discard pile.

7.9 If no enemy is within 2 hexes, discard your hand. The exchange has no effect.
7.10 When your deck is empty and your hand is empty, do the structure attack step.
7.11 Structure attack: Each enemy that is not next to a player attacks 1 adjacent structure.
7.12 A structure is a Barricade, a Tower, or the base. The enemy attacks the Barricade first, then the Tower, then the base.
7.13 Then the Combat phase stops.

## 8 Experience and levels

8.1 Each defeated enemy gives experience to all players.
8.2 The player who defeats the enemy also gets currency (Table 5).
8.3 When the experience track reaches the next threshold, the level increases by 1.
8.4 At each new level, each player gets 1 action die. There is no maximum.
8.5 Level 2 needs 5 experience. Each next level needs 5 more than the last step.

## 9 Enemies

9.1 Enemies stay on the map until a player defeats them.
9.2 A spawn node gets a new enemy only when its enemy is defeated.
9.3 Targets: Each enemy moves toward the nearest player, Barricade, Tower, or base.
9.4 An enemy stops when it is next to its target. An enemy cannot enter a hex with a Barricade.
9.5 Enemy attack: Each grunt gives 2 damage. Do not roll dice for grunts.
9.6 Each elite rolls 6 action dice. Table 4 gives the result of each die.

Table 4 — Enemy die results

| Face | Result |
| --- | --- |
| Sword, Wand, Bow | 1 damage |
| Star | 2 damage |
| Shield, Blank | No damage |

Table 5 — Enemies

| Enemy | Health | Attack | Experience | Currency |
| --- | --- | --- | --- | --- |
| Grunt | 2 | 2 damage, fixed | 1 | 1 |
| Elite | 14 | 6 dice | 4 | 4 |

## 10 Explore phase

10.1 Reveal 1 map tile. Put it adjacent to a tile on the map. You choose the position.
10.2 Put 1 enemy on each spawn node of the new tile.
10.3 If the tile deck is empty, add 1 to the wave track. Do not reveal a tile.
10.4 Wave step: Put 1 grunt on each spawn node. Do this 1 time for each point on the wave track.
10.5 If the miniature limit stops a new grunt, replace 1 grunt on the map with 1 elite.
10.6 Turn your discard pile 180 degrees. Do not shuffle it. The top halves are now up.
10.7 This pile is your deck for the next Prepare phase.
10.8 If the Training Ground is open and the round number is even, do the Skill draft (Section 11.6).
10.9 Add 1 to the round counter.
10.10 Examine the milestones (Section 17). Record each new milestone.

## 11 Base and upgrades

11.1 The base has 20 health at the start.
11.2 To buy an upgrade, your figure must be on the base. Play a Build card and pay the materials.
11.3 Each upgrade adds 5 to the maximum base health and 5 to the base health.
11.4 You must buy the upgrades of a track in sequence: I, then II, then III.

Table 6 — Base upgrades (paid with materials)

| Upgrade | Cost | Effect |
| --- | --- | --- |
| Shop I | 4 | The Shop opens. It shows 3 offers from the Level 1 card supply. |
| Shop II | 6 | New offers come from the Level 2 card supply. |
| Shop III | 8 | New offers come from the Level 3 card supply. |
| Training I | 3 | The Training Ground opens. The draft uses the Level 1 Skill supply. |
| Training II | 5 | The draft uses the Level 2 Skill supply. |
| Training III | 7 | The draft uses the Level 3 Skill supply. |

11.5 When you buy a card, replace the offer with a card from the highest open level supply.
11.6 Skill draft: Each player looks at the top 2 Skills of the highest open level Skill supply.
11.7 Keep 1 Skill. It is free. Put the other Skill at the bottom of its supply.
11.8 If that supply is empty, use the next lower level supply.

## 12 Defenses

12.1 Use the Build card to build 1 defense on your hex or on an adjacent hex.
12.2 You cannot build on the base, a lake, a mountain, or a hex with an enemy.

Table 7 — Defenses (paid with materials)

| Defense | Cost | Health | Effect |
| --- | --- | --- | --- |
| Barricade | 2 | 4 | Enemies cannot enter its hex. |
| Tower | 4 | 3 | Attacks in each Combat phase (12.3). |

12.3 Tower attack: The Tower gives 2 damage to the nearest enemy within 2 hexes.
12.4 A defense with 0 health is removed from the map.

## 13 Cards and Skills

Table 8 — Card supplies (cost in currency)

| Level | Card | Top half | Bottom half | Cost |
| --- | --- | --- | --- | --- |
| 1 | Sprint | Move 3 | Reroll 2 dice | 3 |
| 1 | Haul | Gather +2 | +2 damage | 3 |
| 1 | Mason | Build, cost −1 | +3 guard | 3 |
| 1 | Scout | Move 2 | +1 die for this exchange | 3 |
| 1 | Bandage | Rest: heal 3 | Heal 2 | 3 |
| 1 | Forage | Gather +1 | Heal 1 | 3 |
| 2 | Dash | Move 4 | Reroll 3 dice | 5 |
| 2 | Excavate | Gather +3 | +3 damage | 5 |
| 2 | Engineer | Build, cost −2 | +5 guard | 5 |
| 2 | Field Medic | Rest: heal 4 | Heal 3 | 5 |
| 3 | Blink | Move 5. No extra cost next to enemies | Reroll all dice, +1 die | 8 |
| 3 | Quarry | Gather +5 | +5 damage | 8 |
| 3 | Architect | Build 2 times | +8 guard | 8 |
| 3 | Sanctuary | Rest: heal 7 | Heal 5 | 8 |

Table 9 — Skill supplies (draft)

| Level | Skill | Faces | Effect |
| --- | --- | --- | --- |
| 1 | Cleave | Sword x2 | 5 damage, range 1 |
| 1 | Bulwark | Shield x2 | 5 guard |
| 1 | Renewal | Wand x2 | Heal 3 |
| 1 | Aimed Shot | Bow x2 | 3 damage, range 2 |
| 1 | Spellblade | Sword + Wand | 4 damage, range 1 |
| 1 | Dodge | Shield + Wand | Ignore 1 enemy hit |
| 1 | Spark Burst | Wand + Bow | 1 damage to each enemy, range 2 |
| 2 | Volley | Bow x3 | 2 damage to each enemy, range 2 |
| 2 | Flurry | Sword x3 | 9 damage, range 1 |
| 2 | Fortress | Shield x3 | 8 guard |
| 2 | Purify | Wand x3 | Heal 6 |
| 3 | Phalanx | Sword x2 + Shield x2 | 7 damage, range 1 |
| 3 | Meteor | Wand x2 + Sword x2 | 6 damage to each enemy, range 2 |
| 3 | Arcane Rain | Wand x3 + Bow x2 | 4 damage to each enemy, range 2 |

13.1 New cards go into your discard pile. Your deck grows by 1.

## 14 End of the run

14.1 The run stops if the base health is 0.
14.2 The run stops if the health of a player is 0.
14.3 Record the round number and the milestones.

## 15 Wave track

15.1 The wave track starts at 0.
15.2 The wave track increases only when the tile deck is empty (10.3).
15.3 The wave track keeps the danger high after the last tile.

## 16 Changes for 2 to 4 players

16.1 Each player has a deck, dice, and a player board.
16.2 All players share the experience track. All players get dice at the same time.
16.3 All hands are open. Players can discuss all cards.
16.4 Combat: The players do their exchanges in turn. Start with the first player. Continue clockwise.
16.5 In each exchange of a player, each enemy next to that player attacks that player.
16.6 Reveal 1 map tile for each player in the Explore phase.
16.7 If the health of one player is 0, the run stops for all players.

## 17 Milestones

- Survive to round 5.
- Survive to round 10.
- Survive to round 15.
- Defeat an elite.
- Fire Arcane Rain.
- Buy 3 base upgrades.
- Reveal 10 tiles.
- Reach level 5.

## 18 Configuration options (for playtests)

18.1 The desktop prototype must let you change these rules. The default is the rule in this specification.
- Exploration: forced reveal (default), optional reveal, or automatic reveal.
- Bought cards: add to the deck (default) or replace a starter card.
- Max level: no maximum (default) or a number.
- Skill uses: 1 time for each exchange (default) or unlimited.
- Starter deck and hand: 6 and 3 (default), 8 and 4, or 10 and 5.

## 19 Future: scenarios

19.1 This note is not a rule for Spec v1.
19.2 A later version can add scenarios with a win condition.
19.3 Example win condition: After the last tile, remove all enemies from the map.
19.4 Make the base game work first. Then design the scenarios.
