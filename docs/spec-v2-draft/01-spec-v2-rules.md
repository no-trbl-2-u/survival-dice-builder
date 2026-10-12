# Survival Dice-Builder — Rules Specification (ASD-STE100), Spec v2 (DRAFT)

> Draft, 2026-10-11 (phase 34). Written from Spec v1 (Issue 006) and the designer's 32 rulings
> in `docs/spec-v2-draft/RULINGS.md`. Spec v1 rule ids are kept; a deleted rule stays as a
> one-line entry. **[v2]** marks a changed rule. **[v2 open: ...]** marks a rule the designer
> left open; the engine plays the reading shown. The designer reviews this draft at
> `/oversight`, then it moves to `spec/`.

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

2.1 Each player has these components: **[v2]**
- 1 player board with 4 starter Skill slots and 6 draft Skill slots. **[v2 open: Skill caps and upgraded Skill tiers. The Skills session decides (ruling 27).]**
- 1 figure.
- 1 health track. The maximum health is 15.
- 1 action die (d6) at the start.
- 10 starter cards (Table 2).

2.2 The shared components are: **[v2]**
- Map tiles: 1 Base tile (the Broken Village), 3 countryside tiles, and 5 core tiles.
- 1 base board with a health track and the upgrade track.
- Enemy miniatures: grunts and elites. The limit is 20 miniatures on the map (10.5).
- Barricade tokens and Tower tokens.
- 1 experience track.
- Materials and currency tokens.
- 3 card supplies (Level 1, 2, 3) with 2 copies of each card.
- 3 Skill supplies (Level 1, 2, 3) with 1 copy of each Skill.
- Enemy dice (Table 4).

2.3 Each action die has 6 faces: Sword, Wand, Bow, Shield, Star, and Blank.
2.4 The Star face is wild. A Star counts as any one face of your choice.
2.5 The Blank face has no effect.
2.6 Each card has 2 halves. The top half is the Prepare effect.
2.7 The bottom half is upside down. The bottom half is the Combat effect.
2.8 A half can show 2 options. When you play that half, do 1 of the options. **[v2]**

## 3 Map tiles

3.1 Each map tile has 7 hexes: 1 center hex and 6 outer hexes.
3.2 A countryside tile has a green back. A core tile has a brown back.
3.3 Each hex has a terrain: plains, forest, hills, wasteland, lake, or mountain.
3.4 Figures and enemies cannot enter a lake hex or a mountain hex. A figure can enter a hex with a Barricade or a Tower. **[v2]**
3.5 The sites are printed on the tiles. Table 1 gives the sites.
3.6 All 7 hexes of the Base tile are the base. **[v2]**
3.7 A hex can hold 1 enemy at most.
3.8 A hex can hold 1 figure at most. This rule also applies on the base. **[v2]**

Table 1 — Sites **[v2]**

| Site | Function | Where |
| --- | --- | --- |
| Base | The players defend this tile. Upgrades and cards are bought here | Base tile, all 7 hexes |
| Gathering node | Gives materials 1 time (Gather effect, 6.7) | Countryside: 1 or 2. Core: 1 |
| Spawn node | Gets 1 grunt in each Combat (7.3) | Countryside: 1. Core: 1 |
| Elite spawn node | Gets 1 elite in each Combat (7.3) | Core: 1, center hex |

## 4 Setup

4.1 Put the Base tile in the center of the table.
4.2 Do not put other tiles on the map. **[v2]**
4.3 Shuffle the 3 countryside tiles. Shuffle the 5 core tiles. Put the countryside tiles on the core tiles. This stack is the tile deck. **[v2]**
4.4 Do not put enemies on the map. **[v2]**
4.5 Set the base health to 20. **[v2]**
4.6 Put your figure on an empty base hex. **[v2]**
4.7 Get 1 action die.
4.8 Shuffle your 10 starter cards. Put them face down with the top half up. This stack is your deck. **[v2]**
4.9 Set your health to 15.
4.10 Put the 4 starter Skills on your player board (Table 3).
4.11 Set the experience track to 0. Set the level to 1.
4.12 Shuffle each card supply and each Skill supply.
4.13 Set the round counter to 1.

Table 2 — Starter cards (10) **[v2]**

| Quantity | Top half (Prepare) | Bottom half (Combat) |
| --- | --- | --- |
| 4 | Move 2 | Move 2, or Engage |
| 4 | Gather 2 | Engage, or Reroll 1 die |
| 1 | Build I | Repair 2 |
| 1 | Rest: heal 2 | Heal 2, or Reroll all dice |

Table 3 — Starter Skills

| Skill | Faces | Effect |
| --- | --- | --- |
| Strike | Sword | 2 damage, range 1 |
| Shot | Bow | 1 damage, range 2 |
| Mend | Wand | Heal 1 |
| Guard | Shield | 2 guard |

## 5 Round sequence

5.1 Each round has 2 phases in this sequence: Prepare, Combat. **[v2]**
5.2 Your deck sets the length of the Prepare phase and the Combat phase.
5.3 Each round uses 2 passes through your deck.
5.4 Your deck can grow. Each new card makes Prepare longer and Combat longer.

## 6 Prepare phase

6.1 Draw 5 cards from your deck.
6.2 Play the top half of a card. Do the effect. Or discard the card. Do not do the effect.
6.3 Put each played card in your discard pile.
6.4 When your hand is empty, draw 5 cards again.
6.5 If your deck has fewer than 5 cards, draw all the cards.
6.6 When your deck is empty and your hand is empty, the Prepare phase stops.

6.7 Top-half effects: **[v2]**
- Move N: Move your figure up to N hexes. Each step costs 1.
- Explore: A step off the edge of the map reveals the top tile of the tile deck. Put the tile so that it covers the hex you step into. Do not rotate the tile. The step costs 1. You can continue the move.
- If the revealed hex under the step is a lake or a mountain, your figure stays on its hex. You can continue the move.
- Gather N: On a gathering node that is not spent, get N materials. The node is then spent. **[Note: the Event Calendar experiment can change this rule (ruling 9).]**
- Build N: On the base, buy 1 base upgrade (Section 11). On other hexes, build 1 defense (Section 12). The level of the Build limits what you can buy or build (11.4, 12.1).
- Rest: Heal the quantity that the card shows.
- Engage: Do 1 engagement (7.8). A card can show Engage on its top half. **[v2 open: no card shows Engage on its top half yet.]**

6.8 If your figure is on the base and the Shop is open, you can buy cards. Buying does not use a card. **[v2]**
You can buy in each phase, at each moment that your figure is on the base. In a game with 2 to 4 players, only the player who must make a decision can buy.

6.9 Enemies are obstacles in the Prepare phase: **[v2]**
- You cannot gather or build on a hex that has an enemy.
- You cannot move into a hex that has an enemy.
- A step into a hex next to an enemy costs 1, the same as each step.

6.10 Deleted in Spec v2: the skirmish. Engage is the only way to attack an enemy (7.8). **[v2]**
6.11 Deleted in Spec v2 (the skirmish).
6.12 Deleted in Spec v2 (the skirmish).
6.13 Deleted in Spec v2 (the skirmish).
6.14 Deleted in Spec v2 (the skirmish).
6.15 Deleted in Spec v2 (the skirmish).

## 7 Combat phase

7.1 Shuffle your discard pile.
7.2 Turn the deck 180 degrees. The bottom halves are now up.
7.5 Each enemy moves 2 hexes toward its target (Section 9.3).
7.3 Then each spawn node gets 1 grunt. Each elite spawn node gets 1 elite. This applies to each tile on the map. **[v2]** **[Note: the Event Calendar experiment can change this rule (ruling 14).]**
7.4 Deleted in Spec v2 (the wave track).
7.6 Each Tower attacks (Section 12.3).

7.7 Draw 5 cards. Play 1 option of the bottom half of each card, or discard the card. A card you do not play stays in your hand. When your hand is empty, draw 5 cards again. **[v2]**
Bottom-half options:
- Engage: Do 1 engagement (7.8).
- Move N: Move your figure up to N hexes (6.7, 6.9).
- Heal N: Heal N.
- Repair N: Repair N (12.5).
- Reroll: Use only in an engagement (7.8 step 5).

7.8 For each engagement, do these steps in sequence: **[v2]**
1. Play an Engage option. You can engage from any hex.
2. Roll all your action dice. Roll the enemy dice of each enemy next to you (Table 5).
3. Keep the dice that you want. Roll your other dice again. The maximum is 3 rolls. Do not roll enemy dice again.
4. Put your dice on your Skills, 1 die at a time, in any order. Use each die 1 time only.
5. When all the faces of a Skill have dice, the Skill fires immediately. A Skill can fire again when dice fill it again.
6. You can play the Reroll and Heal options of the cards in your hand at any time in the engagement. A card reroll does not count as a roll in step 3.
7. When you stop, the enemy dice hit you (Table 4). An enemy that you defeated in this engagement also hits you.
8. Apply the enemy damage to your guard first. Apply the remaining damage to your health.
9. Remove all guard. Put the played cards in your discard pile.

7.9 If no enemy is next to you, no enemy dice roll. **[v2]**
7.10 When your deck is empty and your hand is empty, do the siege step. **[v2]**
7.11 Siege: Each enemy next to a structure gives its siege damage (Table 5) to 1 adjacent structure. An enemy next to a player also does the siege. **[v2]**
7.12 A structure is a Barricade, a Tower, or the base. The enemy attacks the Barricade first, then the Tower, then the base.
7.13 Then the Combat phase stops.

## 8 Experience and levels

8.1 Each defeated enemy gives experience to all players.
8.2 The player who defeats the enemy also gets currency (Table 5). If a Tower defeats the enemy, the player who built the Tower gets the currency. **[v2]**
8.3 When the experience track reaches the next threshold, the level increases by 1.
8.4 At each new level, each player gets 1 action die. There is no maximum. The new die is used from the next roll. The dice that you rolled stay as they are. **[v2]**
8.5 Level 2 needs 3 experience. Each next level needs 3 more than the last step (3, 9, 18, 30). **[v2]** **[v2 open: the step stays a configuration option for playtests (ruling 20).]**

## 9 Enemies

9.1 Enemies stay on the map until a player defeats them.
9.2 Deleted in Spec v2: each spawn node gets an enemy in each Combat (7.3). **[v2]**
9.3 Targets: Each enemy moves toward the nearest structure: a Barricade, a Tower, or the base. An enemy moves toward a player only when that player is 2 or more hexes nearer than the nearest structure. **[v2]**
9.4 An enemy stops when it is next to its target. **[v2]**
9.7 An enemy can only enter an empty hex. Enemies, figures, Barricades, Towers, lakes, and mountains block an enemy. If each path to its target is blocked, the enemy moves toward the next nearest target. If no path goes to a target, the enemy does not move. **[v2]**
9.8 Spill-over: If a spawn node has an enemy, put the new enemy on the nearest empty hex that enemies can enter. The center hex of the Base tile is not empty for spill-over. Use the hex distance. If 2 hexes are equally near, use the hex nearest to the base. **[v2]**
9.5 Enemy attack: An enemy attacks a player only with its enemy dice, in an engagement of that player (7.8). An enemy attacks a structure only in the siege step (7.11). **[v2]**
9.6 Each enemy record gives its enemy dice and its siege damage (Table 5). An elite can have its own effect. **[v2]** **[v2 open: elite types and their effects (rulings 15, 23).]**

Table 4 — Enemy die **[v2]**

| Faces | Result |
| --- | --- |
| 2 Hit | 1 damage |
| 3 Miss | No damage |
| 1 Special | 2 damage **[v2 open: each grunt type sets its own Special.]** |

Table 5 — Enemies **[v2]**

| Enemy | Health | Enemy dice | Siege damage | Experience | Currency |
| --- | --- | --- | --- | --- | --- |
| Grunt | 2 | 1 | 1 | 1 | 1 |
| Elite | 14 | 2 (its effect: roll 1 more die) | 3 | 4 | 4 |

## 10 End of the round

10.1 Deleted in Spec v2: tiles are revealed when a figure steps off the map (6.7). **[v2]**
10.2 Deleted in Spec v2: a new tile gets its enemies in the next Combat (7.3). **[v2]**
10.3 When the tile deck is empty, a step off the map reveals no tile. **[v2]**
10.4 Deleted in Spec v2 (the wave track).
10.5 Miniature limit: 20 enemies can be on the map at most. If the limit stops a new grunt or a new elite, the grunt nearest to the base becomes an elite. **[v2]** **[v2 open: which elite type (ruling 23).]**
10.6 Turn your discard pile 180 degrees. Do not shuffle it. The top halves are now up.
10.7 This pile is your deck for the next Prepare phase.
10.8 If the Training Ground is open and the round number is even, do the Skill draft (Section 11.6).
10.9 Add 1 to the round counter.
10.10 Examine the milestones (Section 17). Record each new milestone.

## 11 Base and upgrades

11.1 The base has 20 health at the start.
11.2 To buy an upgrade, your figure must be on the base. Play a Build card and pay the materials. A Build card with a cost reduction lowers the cost of each upgrade it buys. The minimum cost is 0. **[v2]**
11.3 Each upgrade adds 5 to the maximum base health and 5 to the base health.
11.4 You must buy the upgrades of a track in sequence: I, then II, then III. A Build card has a level. Build I buys level I upgrades. Build II buys level I or II upgrades. Build III buys each upgrade. **[v2]** **[v2 open: the Build II and Build III cards are not designed.]**

Table 6 — Base upgrades (paid with materials)

| Upgrade | Cost | Effect |
| --- | --- | --- |
| Shop I | 4 | The Shop opens. It shows 3 offers from the Level 1 card supply. |
| Shop II | 6 | New offers come from the Level 2 card supply. |
| Shop III | 8 | New offers come from the Level 3 card supply. |
| Training I | 3 | The Training Ground opens. The draft uses the Level 1 Skill supply. |
| Training II | 5 | The draft uses the Level 2 Skill supply. |
| Training III | 7 | The draft uses the Level 3 Skill supply. |

11.5 When you buy a card, replace the offer immediately with a card from the highest open level supply. If that supply is empty, use the next lower level supply. If all open supplies are empty, the Shop shows fewer than 3 offers. When Shop II or Shop III opens, the offers on the Shop do not change. **[v2]**
11.6 Skill draft: Each player looks at the top 2 Skills of the highest open level Skill supply. Each player also looks at the Skills in their draft pool. **[v2]**
11.7 Keep 1 Skill. It is free. Put the other Skills in your draft pool. **[v2]**
11.8 If that supply is empty, use the next lower level supply.
11.9 A player can have 6 draft Skills at most. If the draft slots are full, the drafted Skill replaces 1 draft Skill. Put the replaced Skill at the bottom of its supply. **[v2 open: Skill caps and upgraded Skill tiers (ruling 27).]**

## 12 Defenses

12.1 Use a Build card to build 1 defense on your hex or on an adjacent hex. The level of the Build must be at least the level of the defense. **[v2]**
12.2 You cannot build on the base, a lake, a mountain, or a hex with an enemy. A hex can hold 1 defense at most. **[v2]**

Table 7 — Defenses (paid with materials) **[v2]**

| Defense | Level | Cost | Health | Effect |
| --- | --- | --- | --- | --- |
| Barricade | I | 2 | 4 | Enemies cannot enter its hex. |
| Tower | I | 4 | 3 | Attacks in each Combat phase (12.3). |

12.3 Tower attack: The Tower gives 2 damage to the nearest enemy within 2 hexes. If 2 enemies are equally near, the players choose. **[v2]**
12.4 A defense with 0 health is removed from the map.
12.5 Repair N: On the base, the base gets N health. On other hexes, the most damaged defense on your hex or an adjacent hex gets N health. Health cannot go above the maximum. **[v2]**

## 13 Cards and Skills

Table 8 — Card supplies (cost in currency) **[v2]**

| Level | Card | Top half | Bottom half | Cost |
| --- | --- | --- | --- | --- |
| 1 | Sprint | Move 3 | Move 3, or Engage | 3 |
| 1 | Haul | Gather 3 | Engage, or Reroll 2 dice | 3 |
| 1 | Mason | Build I, cost −1 | Repair 3 | 3 |
| 1 | Scout | Move 2 | Move 2, or Engage | 3 |
| 1 | Bandage | Rest: heal 3 | Heal 2, or Reroll 1 die | 3 |
| 1 | Forage | Gather 2 | Engage, or Heal 1 | 3 |
| 2 | Dash | Move 4 | Move 4, or Engage | 5 |
| 2 | Excavate | Gather 4 | Engage, or Reroll 3 dice | 5 |
| 2 | Engineer | Build I, cost −2 | Repair 5 | 5 |
| 2 | Field Medic | Rest: heal 4 | Heal 3, or Reroll all dice | 5 |
| 3 | Blink | Move 5 | Move 5, or Engage | 8 |
| 3 | Quarry | Gather 6 | Engage, or Reroll all dice | 8 |
| 3 | Architect | Build I 2 times | Repair 8 | 8 |
| 3 | Sanctuary | Rest: heal 7 | Heal 5, or Reroll all dice | 8 |

**[v2 open: the Build levels of Mason, Engineer, and Architect, and the new Build II, Build III, and Repair cards (ruling 25).]**

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

14.1 The run stops if the base health is 0. **[v2]**
14.2 Knockout: If the health of a player is 0, that player is knocked out. The player loses all materials and all currency. Put all the cards of that player in their discard pile. **[v2]**
14.4 At the start of the next round, put the figure on an empty base hex. Its health is half of the maximum health. Round up. If no base hex is empty, the player stays out for 1 more round. **[v2]**
14.3 Record the round number and the milestones.

## 15 Wave track

15.1 Deleted in Spec v2: there is no wave track. **[v2]**
15.2 Deleted in Spec v2 (the wave track).
15.3 Deleted in Spec v2 (the wave track).

## 16 Changes for 2 to 4 players

16.1 Each player has a deck, dice, and a player board.
16.2 All players share the experience track. All players get dice at the same time.
16.3 All hands are open. Players can discuss all cards.
16.8 Prepare: The players play 1 hand of 5 cards in turn. Start with the first player. Continue clockwise. Continue until each deck is empty.
16.4 Combat: The players do their engagements in turn. Start with the first player. Continue clockwise. **[v2]**
16.5 In each engagement of a player, each enemy next to that player rolls its enemy dice. **[v2]**
16.6 Deleted in Spec v2: there is no Explore phase (6.7). **[v2]**
16.7 Deleted in Spec v2: a knocked-out player does not stop the run (14.2). **[v2]**

## 17 Milestones

- Survive to round 5.
- Survive to round 10.
- Survive to round 15.
- Defeat an elite.
- Fire Arcane Rain.
- Buy 3 base upgrades.
- Reveal 10 tiles. **[v2 open: 8 tiles can be revealed. The designer sets a new number.]**
- Reach level 5.

## 18 Configuration options (for playtests)

18.1 The desktop prototype must let you change these rules. The default is the rule in this specification. **[v2]**
- Bought cards: add to the deck (default) or replace a starter card. The player chooses the starter card from the deck or the discard pile.
- Max level: no maximum (default) or a number.
- Experience step: 3 (default) or another number.
- Knockout: the health on return and the losses.
- The /config page lists each other option.

## 19 Future: scenarios

19.1 This note is not a rule for Spec v2.
19.2 A later version can add scenarios with a win condition.
19.3 Example win condition: After the last tile, remove all enemies from the map.
19.4 Make the base game work first. Then design the scenarios.

## Review table

Each rule that changes from Spec v1, with its ruling in `RULINGS.md`. "Carried, check" marks
a rule no ruling named that this draft updated to match the rest.

| Rule | Ruling | Change |
| --- | --- | --- |
| 2.1 | 7, 27 | 10 starter cards; Skill cap stays open |
| 2.2 | 1, 5, 23 | 2 copies per card; no wave track; enemy dice; limit on the map |
| 2.8 | 12 | New: a half can show 2 options (carried, check) |
| 3.4 | 2 | Figures can enter defense hexes |
| 3.6, 3.8 | 3 | The base is the whole Base tile; 1 figure per hex there too |
| Table 1 | 3, 9, 14 | Base tile has no node; nodes spend; spawns each Combat (carried, check) |
| 4.2-4.4 | 4 | Base tile alone; tile deck; no enemies at setup |
| 4.5 | 5 | No wave track |
| 4.6 | 3 | Start on an empty base hex |
| 4.8, Table 2 | 7 | 10-card deck with Combat options (Table 2 from `cards.json`) |
| 5.1 | 6 | 2 phases |
| 6.7 | 4, 9, 12, 13, 25 | Explore step; Gather N spends a node; levelled Build; Engage |
| 6.8 | 10 | Buy at any moment on the base; the deciding player |
| 6.9 | 11, 12 | No surcharge; no move into an enemy's hex |
| 6.10-6.15 | 12 | Skirmish deleted |
| 7.3-7.5 | 14 | Enemies move, then every node spawns; no wave step |
| 7.7-7.10 | 15, 31 | Engagements; Skills fire again; defeated enemies still hit |
| 7.11 | 17 | Siege from each enemy record; enemies next to players siege too |
| 8.2 | 16 | Tower currency to its builder |
| 8.4 | 19 | New die from the next roll |
| 8.5 | 20 | Steps of 3; open for playtest |
| 9.2-9.8 | 14, 18, 21, 22 | Spawning, structure-first targets, blocking, spill-over, enemy dice |
| Tables 4-5 | 15, 17, 18 | Enemy die; per-record dice and siege |
| 10.1-10.5 | 4, 5, 23 | No Explore phase; miniature limit |
| 11.2 | 24 | Build reduction lowers upgrade costs |
| 11.4 | 25 | Levelled Build; cards open |
| 11.5 | 10 | Lower-level refill; Shop II/III keep offers |
| 11.6-11.8 | 26, 28 | 2 Skills per player plus the pool; lower-level fallback |
| 11.9 | 27 | Open: Skills session |
| 12.1, 12.5 | 25 | Levelled Build; Repair |
| 12.2 | 29 | 1 defense per hex |
| 12.3 | 16 | Players choose between equal targets |
| Table 8 | 13, 25 | Gather +1 on bought cards; Combat options from `cards.json`; Build levels open |
| 14.1-14.4 | 30 | Knockout; materials and currency lost |
| 15.1-15.3 | 5 | Wave track deleted |
| 16.4-16.7 | 6, 15, 30 | Engagements in turn; no Explore; knockout does not end the run |
| 17 | — | Tile milestone stays open (carried, check) |
| 18.1 | 7, 31, 32 | 8/3 preset and once-per-engagement Skills removed; list updated |
