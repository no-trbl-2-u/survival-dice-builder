# FACTS: Survival Dice-Builder v2 core loop, fact sheet for the 15 one-page design sheets

Compiled 2026-10-05 from the repository sources named below. Every number and rule on the
fifteen sheets must trace to one fact id in this file.

## 1. How to read this file

- Tags: `[v2 <heading>]` = `docs/design/core-loop-v2.md` (designer walkthrough, 2026-10-04); `[OQ <row> <status>]` = `OPEN-QUESTIONS.md` row dated 2026-10-04 and its matching entry in `docs/DECISIONS.md`; `[Spec v1 <rule id or table>]` = `spec/01-spec-v1-rules.md`; `[prototype value <json key>]` = `packages/content/data/config.default.json` or `packages/content/data/*.json`, used only where no higher source gives the number; `[bot batch]` = `docs/reports/phase-9-bot-batch.md`; `[PROTOCOL]` = `docs/playtests/PROTOCOL.md` (teach order only).
- Priority: v2 beats OQ beats Spec v1 beats prototype value. Where two sources disagree the winner's value is given and the loser is named with "(overrides <loser tag>)". A value absent from every source is written "not stated". Status words from OQ rows (decided, superseded, proposed, pending-spec) are kept; a `proposed` or `pending-spec` item is not designed yet and the sheets name it "to be designed".

## 2. Vocabulary map

Terms that appear in the sources and the tabletop term the sheets use instead. Banned words from the brief that a source uses are marked (banned).

| Source term | Where it appears | Sheet term |
| --- | --- | --- |
| engine (banned) | v2, OQ, DECISIONS, Spec v1 18 | the rules; "the rules say" |
| bot, bot batch, bot report, bot data (banned) | v2, OQ 13, 17, DECISIONS, bot batch report | trial runs of the digital prototype (Designer sheets only); omitted on Playtester and Publisher sheets |
| config, config flag, flag, `rulings.*`, setting (banned: config, flag) | OQ, DECISIONS, Spec v1 18 | rule option; "the standard rules" |
| UI, live UI, screen, main-screen.svg, SVG (banned: UI, screen, SVG) | DECISIONS checks | omitted; drawings on the sheets are "illustrations" |
| export, re-export, Save run, Download run (banned: export, save file) | DECISIONS, PROTOCOL, Spec v1 18 "desktop prototype" | omitted; the sheets describe the table only |
| version 2, v2, Spec v2, core loop v2, Issue 005/006 (banned: version 2) | v2, OQ, DECISIONS | "the current rules" in body text; `core-loop-v2` and `Spec v1` only in the `src:` footer |
| phase 20, 21, 22 (build phases) | v2, OQ, DECISIONS | "later"; never a phase number (the only phases on a sheet are Prepare and Combat) |
| reading, ruling, decided, superseded, proposed, pending-spec | OQ, DECISIONS | "rule" (settled); "to be designed" (proposed, pending-spec); Publisher sheets: "final content in progress" |
| desktop prototype, live build, live site, /play, /decisions, /tiles, seed | Spec v1 18, DECISIONS, PROTOCOL | omitted |
| hot-seat | DECISIONS (phase 13) | co-op: people at one table |
| solo | Spec v1 1.5, bot batch | solo: one person at the table |
| player, figure, "your figure", pawn | all | figure (the player piece); never pawn, token, or avatar |
| enemy miniature, miniature limit, miniatures | Spec v1 2.2, OQ 32 | miniature (an enemy piece); "miniature limit" stays |
| grunt, elite | all | grunt, elite (stay) |
| tile deck, countryside tile, core tile, Base tile, Broken Village | v2, Spec v1 2.2, 3, 4 | tile deck, countryside tile, core tile, Base tile (stay); "the Base tile is the base" |
| slot (tile slot, empty slot) | OQ 5, 25, 37 | space next to the map (v2: the tile covers the hex you step into) |
| spawn node, elite spawn node, gathering node, site | v2, Spec v1 Table 1 | spawn node, elite spawn node, gathering node (stay); "site" becomes "printed on the tile" |
| spill, spill-over, spills to | v2, OQ 1, 27 | "is placed on the nearest empty hex" |
| promote, promotion, elite replacement | OQ 13, 32 | "the grunt nearest the base is replaced by an elite" |
| refill (spawn node) | Spec v1 7.3, 9.2, OQ 21, 36 | spawn (every spawn node spawns every Combat) |
| refill (Shop offers) | Spec v1 11.5, OQ 11, 41 | "the bought card is replaced at once" |
| turn the deck 180 degrees | Spec v1 7.2, 10.6 | turn the deck so the bottom halves are up (or the top halves) |
| top half, bottom half, upside down | Spec v1 2.6, 2.7, v2 | card halves: top half up in Prepare, bottom half up in Combat |
| deck preset, deck-10-hand-3, hand size | config, OQ 19, Spec v1 18.1 | the 10-card starter deck; a hand of 3 |
| player board, Skill slot, draft slot | Spec v1 2.1, 11.9 | player board, Skill slot (physical, stay) |
| wave track, wave step, wave | Spec v1 7.4, 10.3, 10.4, 15, OQ 38, 51, 62 | omitted: removed by v2 (no wave track) |
| Explore phase, reveal step, automatic exploration, forced reveal | Spec v1 5.1, 10, 18.1, OQ 37, 51 | omitted: removed by v2; a tile is revealed by stepping off the map edge in Prepare |
| run, end of the run | all | run (one game at the table); "the run ends" |
| exchange, combat exchange | Spec v1 7.8, v2 | exchange (stays) |
| structure, defense | Spec v1 7.12, 12, v2 | structure (Barricade, Tower, the base); defense (Barricade, Tower) |
| track (health, experience, upgrade) | Spec v1 2.1, 2.2 | track (a printed track with a marker) |
| round counter | Spec v1 4.13, 10.9, v2 | round counter (a track or dial on the base board) |
| Level 1/2/3 card supply, Skill supply | Spec v1 2.2, 11 | Level 1/2/3 supply (a face-down stack of cards or Skills) |
| currency | Spec v1 8.2, Table 5 | currency tokens (no coin name is stated) |
| materials | Spec v1 6.7, OQ 54 | material tokens |
| guard | Spec v1 7.8, Table 3 | guard (a temporary value; its token or marker is not stated, see F-049) |
| knocked out, knockout | v2, OQ 55 | knocked out (stays) |
| milestone | Spec v1 17, v2 | milestone (stays) |

## 3. Components (physical)

### Tiles

- F-001 [Spec v1 2.2]: Map tiles: 1 Base tile (the Broken Village), 3 countryside tiles, and 5 core tiles: 9 tiles in all.
- F-002 [OQ 57 pending-spec]: The designer will add more tiles; how many, and what is on them, is to be designed. The current 3 countryside and 5 core tiles stand until the new set exists.
- F-003 [Spec v1 3.1]: Each map tile has 7 hexes: 1 centre hex and 6 outer hexes.
- F-004 [Spec v1 3.2]: A countryside tile has a green back. A core tile has a brown back.
- F-005 [Spec v1 3.3, 3.4]: Terrains: plains, forest, hills, wasteland, lake, mountain. Figures and enemies cannot enter a lake hex or a mountain hex.
- F-006 [v2 Setup]: The Base tile has 7 hexes: the base at the centre and 6 plain hexes. It has no gathering nodes (overrides Spec v1 Table 1 "Base tile: 2" gathering nodes). The whole tile is the base.
- F-007 [prototype value tiles.json broken-village]: Base tile "Broken Village": all 7 hexes plains; centre hex carries the base site; the 6 outer hexes carry no site.
- F-008 [prototype value tiles.json meadowlands]: Countryside tile "Meadowlands": centre plains; outer hexes: plains with gathering node, forest, hills with spawn node, plains, lake, forest with gathering node. Totals: 2 gathering nodes, 1 spawn node, 1 lake.
- F-009 [prototype value tiles.json old-woods]: Countryside tile "Old Woods": centre forest; outer hexes: forest, forest with spawn node, plains, hills with gathering node, forest, mountain. Totals: 1 gathering node, 1 spawn node, 1 mountain.
- F-010 [prototype value tiles.json stony-fields]: Countryside tile "Stony Fields": centre hills with gathering node; outer hexes: plains, wasteland, plains with spawn node, hills, plains with gathering node, forest. Totals: 2 gathering nodes, 1 spawn node.
- F-011 [prototype value tiles.json ash-waste]: Core tile "Ash Waste": centre wasteland with elite spawn node; outer hexes: wasteland with spawn node, hills, mountain, wasteland with gathering node, plains, wasteland. Totals: 1 elite spawn node, 1 spawn node, 1 gathering node, 1 mountain.
- F-012 [prototype value tiles.json black-fen]: Core tile "Black Fen": centre forest with elite spawn node; outer hexes: lake, forest with gathering node, forest, plains with spawn node, wasteland, forest. Totals: 1 elite spawn node, 1 spawn node, 1 gathering node, 1 lake.
- F-013 [prototype value tiles.json broken-ridge]: Core tile "Broken Ridge": centre hills with elite spawn node; outer hexes: hills, mountain, hills with spawn node, plains, hills with gathering node, wasteland. Totals: 1 elite spawn node, 1 spawn node, 1 gathering node, 1 mountain.
- F-014 [prototype value tiles.json dead-grove]: Core tile "Dead Grove": centre forest with elite spawn node; outer hexes: wasteland with gathering node, forest, forest, wasteland, forest with spawn node, plains. Totals: 1 elite spawn node, 1 spawn node, 1 gathering node.
- F-015 [prototype value tiles.json scorched-plain]: Core tile "Scorched Plain": centre plains with elite spawn node; outer hexes: wasteland, plains with spawn node, wasteland, lake, wasteland with gathering node, plains. Totals: 1 elite spawn node, 1 spawn node, 1 gathering node, 1 lake.
- F-016 [prototype value tiles.json, summed]: Across the 8 non-base tiles: 10 gathering nodes (5 countryside, 5 core), 8 spawn nodes (1 per tile), 5 elite spawn nodes (1 per core tile, on its centre hex). Matches Spec v1 Table 1 ("Countryside: 1 or 2" gathering nodes, "Core: 1"; spawn node 1 per tile; elite spawn node core centre hex).
- F-017 [Spec v1 Table 1]: Site functions: Base: the players defend it and buy upgrades there. Gathering node: gives materials to a Gather effect. Spawn node: holds 1 grunt. Elite spawn node: holds 1 elite.
- F-018 [v2 Setup]: Tile deck: shuffled countryside tiles on top of shuffled core tiles, so 3 countryside on 5 core = 8 tiles (overrides Spec v1 4.2-4.3: 1 countryside placed at setup, 2 on 5 core; OQ 3 superseded).

### Player pieces and dice

- F-019 [Spec v1 2.1]: Each player has 1 player board with 4 starter Skill slots and 6 draft Skill slots, 1 figure, 1 health track (maximum 15), and 1 action die at the start.
- F-020 [v2 Setup]: Player figures: 1 per player, placed on a free base hex, 1 figure per hex, on the Base tile too.
- F-021 [Spec v1 2.3]: Each action die has 6 faces: Sword, Wand, Bow, Shield, Star, Blank.
- F-022 [Spec v1 2.4, 2.5]: Star is wild and counts as any one face of the player's choice. Blank has no effect.
- F-023 [Spec v1 8.4, v2 Experience]: Dice per player: 1 at the start, +1 for every new level, no maximum. The count of dice in the box is not stated.
- F-024 [Spec v1 9.6]: An elite rolls 6 action dice when it attacks, so the table needs at least 6 dice for enemies (the dice used are the same action dice; a separate enemy die set is not stated).

### Cards

- F-025 [Spec v1 2.6, 2.7]: Each card has 2 halves. The top half is the Prepare effect. The bottom half is printed upside down and is the Combat effect.
- F-026 [v2 Setup; OQ 19 decided]: Starter deck: 10 cards per player: 4 Move 2, 4 Gather 2, 1 Build, 1 Rest (overrides Spec v1 2.1 and Table 2: 6 starter cards). A deck never has fewer than 10 cards.
- F-027 [Spec v1 Table 2 (effects); prototype value cards.json starter-move; copies: v2 Setup, prototype value config.default.json deck.presets deck-10-hand-3]: Starter card "Move": top Move 2; bottom Reroll 1 die. 4 copies per player.
- F-028 [Spec v1 Table 2 (effects); prototype value cards.json starter-gather; copies: v2 Setup, prototype value config.default.json deck.presets deck-10-hand-3]: Starter card "Gather": top Gather 2 (amount from v2 Setup "Gather 2"); bottom +1 damage. 4 copies per player.
- F-029 [Spec v1 Table 2; prototype value cards.json starter-build]: Starter card "Build": top Build; bottom +2 guard. 1 copy per player.
- F-030 [Spec v1 Table 2; prototype value cards.json starter-rest]: Starter card "Rest": top Rest: heal 2; bottom Reroll all dice. 1 copy per player.
- F-031 [prototype value config.default.json deck.preset, handSize]: Hand size 3 (the "deck-10-hand-3" preset). Matches v2 Prepare "Draw 3 cards".
- F-032 [v2 Setup; OQ 18 decided]: Supplies: 2 copies of each supply card (overrides Spec v1 Table 8, which lists each once).
- F-033 [Spec v1 Table 8; OQ 60 proposed]: Level 1 supply cards, cost 3 currency each: Sprint (Move 3 / Reroll 2 dice); Haul (Gather 2 in total / +2 damage); Mason (Build, cost -1 / +3 guard); Scout (Move 2 / +1 die for this exchange); Bandage (Rest: heal 3 / Heal 2); Forage (Gather 1 in total / Heal 1). 6 cards x 2 copies = 12.
- F-034 [Spec v1 Table 8; OQ 60 proposed]: Level 2 supply cards, cost 5 currency each: Dash (Move 4 / Reroll 3 dice); Excavate (Gather 3 in total / +3 damage); Engineer (Build, cost -2 / +5 guard); Field Medic (Rest: heal 4 / Heal 3). 4 cards x 2 copies = 8.
- F-035 [Spec v1 Table 8; OQ 60 proposed]: Level 3 supply cards, cost 8 currency each: Blink (Move 5, no extra cost next to enemies / Reroll all dice, +1 die); Quarry (Gather 5 in total / +5 damage); Architect (Build 2 times / +8 guard); Sanctuary (Rest: heal 7 / Heal 5). 4 cards x 2 copies = 8.
- F-036 [OQ 20 decided; OQ 60 proposed]: "Gather +N" on a supply card means N materials in total, not node amount plus N: Haul 2 (decided), Forage 1, Excavate 3, Quarry 5 (proposed). Forage gathers less than the starter card; the designer may re-price it.
- F-037 [Spec v1 Table 8, summed]: Supply cards in the box: 14 distinct cards, 28 with 2 copies each; 3 supplies (Level 1, 2, 3).
- F-038 [Spec v1 2.2]: 3 card supplies (Level 1, 2, 3) and 3 Skill supplies (Level 1, 2, 3).

### Skills

- F-039 [v2 Setup; Spec v1 Table 3]: The 4 starter Skills, 1 set per player: Strike (Sword: 2 damage, range 1); Shot (Bow: 1 damage, range 2); Mend (Wand: Heal 1); Guard (Shield: 2 guard).
- F-040 [OQ 9 pending-spec]: All Skills are placeholders still to design; upgraded Skill tiers (for example Fireball III) and Skill caps are to be designed. The names and values below are the current placeholders.
- F-041 [v2 Setup; OQ 18 decided]: 1 copy of each supply Skill.
- F-042 [Spec v1 Table 9]: Level 1 Skill supply (placeholder, 7 Skills): Cleave (Sword x2: 5 damage, range 1); Bulwark (Shield x2: 5 guard); Renewal (Wand x2: Heal 3); Aimed Shot (Bow x2: 3 damage, range 2); Spellblade (Sword + Wand: 4 damage, range 1); Dodge (Shield + Wand: Ignore 1 enemy hit); Spark Burst (Wand + Bow: 1 damage to each enemy, range 2).
- F-043 [Spec v1 Table 9]: Level 2 Skill supply (placeholder, 4 Skills): Volley (Bow x3: 2 damage to each enemy, range 2); Flurry (Sword x3: 9 damage, range 1); Fortress (Shield x3: 8 guard); Purify (Wand x3: Heal 6).
- F-044 [Spec v1 Table 9]: Level 3 Skill supply (placeholder, 3 Skills): Phalanx (Sword x2 + Shield x2: 7 damage, range 1); Meteor (Wand x2 + Sword x2: 6 damage to each enemy, range 2); Arcane Rain (Wand x3 + Bow x2: 4 damage to each enemy, range 2).
- F-045 [Spec v1 Table 9, summed]: Supply Skills in the box: 14, 1 copy each; plus 4 starter Skills per player.
- F-046 [Spec v1 2.1, 11.9; OQ 9 pending-spec]: A player holds the 4 fixed starter Skills and at most 6 drafted Skills (current rule; the cap is under experiment).

### Structures and base upgrades

- F-047 [Spec v1 Table 7; prototype value defenses.json]: Barricade: cost 2 materials, health 4, enemies cannot enter its hex. Tower: cost 4 materials, health 3, attacks in each Combat phase (2 damage to the nearest enemy within 2 hexes) (defenses.json marks the Tower as not blocking enemies; overridden by OQ 33 and v2 Combat 2, see F-107). Barricade tokens and Tower tokens are shared components (Spec v1 2.2); their counts are not stated.
- F-048 [Spec v1 2.2, Table 6; prototype value upgrades.json]: Base board with a health track and the upgrade track. Upgrades, paid with materials: Shop I 4, Shop II 6, Shop III 8, Training I 3, Training II 5, Training III 7. No other upgrade exists in any source.
- F-049 [Spec v1 2.2, 4.13, 7.8 step 10]: Tokens and markers: material tokens, currency tokens, 1 experience track, a health track per player, a base health track, a round counter. Guard is a temporary value removed at the end of each exchange; its token or marker is not stated. Counts of tokens are not stated.
- F-050 [v2 Setup]: No wave track (overrides Spec v1 2.2 "1 wave track", 4.5, 15).

### Enemies

- F-051 [Spec v1 Table 5; prototype value enemies.json]: Grunt: health 2, attack 2 damage fixed (no dice), experience 1, currency 1.
- F-052 [Spec v1 Table 5; prototype value enemies.json]: Elite: health 14, attack 6 action dice, experience 4, currency 4.
- F-053 [Spec v1 Table 4]: Enemy die results: Sword, Wand, Bow = 1 damage; Star = 2 damage; Shield, Blank = no damage.
- F-054 [v2 Combat]: Enemy movement: each enemy moves up to 2 hexes in the enemy move step (overrides Spec v1 7.5 "moves 2 hexes").
- F-055 [Spec v1 2.2; v2 Combat; OQ 32 decided]: Enemy miniatures: grunts and elites. The map limit is 20 enemy miniatures, counting every enemy miniature (grunts and elites).
- F-056 [Spec v1 3.7; OQ 1 decided]: A hex holds 1 enemy at most.

## 4. Setup

- F-057 [v2 Setup 1]: Put the Base tile on the table. It has 7 hexes: the base at the centre and 6 plain hexes. It has no gathering nodes. The whole tile is the base: buying, upgrades, and enemy attacks on the base work from any of its 7 hexes (overrides Spec v1 3.6 and Table 1 "Base tile, center hex"; OQ 16 decided).
- F-058 [v2 Setup 2]: There is no other tile at the start. Shuffle the countryside tiles and put them on top of the shuffled core tiles: this is the tile deck (overrides Spec v1 4.2, 4.3; OQ 3 and 25 superseded).
- F-059 [v2 Setup 3]: Each player puts their figure on a free base hex (1 figure per hex, on the Base tile too) (overrides Spec v1 4.6 "put your figure on the base"; OQ 16 decided).
- F-060 [v2 Setup 4]: Base health 20. There is no wave track (overrides Spec v1 4.5 "set the wave track to 0").
- F-061 [v2 Setup 5]: Each player: health 15, 1 action die, 0 materials, 0 currency, the 4 starter Skills, and a 10-card starter deck (4 Move 2, 4 Gather 2, 1 Build, 1 Rest), shuffled, top halves up. A deck never has fewer than 10 cards (overrides Spec v1 4.8 "6 starter cards").
- F-062 [v2 Setup 6]: Experience 0, level 1, round 1. Supplies: 2 copies of each supply card, 1 of each Skill. The Shop and the Training Ground are closed until their first upgrade is bought.
- F-063 [v2 Setup 1, 2 and Combat 3, inferred; prototype value tiles.json broken-village]: No enemy is on the table at setup: no tile but the Base is out, enemies enter only in the Combat spawn step, and the Base tile's hexes carry no spawn node in the prototype data (v2 says only "6 plain hexes" and "no gathering nodes") (overrides Spec v1 4.4 "put 1 enemy on each spawn node").
- F-064 [Spec v1 4.12]: Shuffle each card supply and each Skill supply (not contradicted by v2).
- F-065 [Spec v1 3.8; OQ 16 decided]: 1 figure per hex, on base hexes too.

## 5. Round structure

- F-066 [v2 Round]: There is no Explore phase. Each round has 2 phases, Prepare then Combat, and the deck is played twice: top halves in Prepare, bottom halves in Combat (overrides Spec v1 5.1 "3 phases: Prepare, Combat, Explore" and Section 10).
- F-067 [Spec v1 5.2-5.4]: The deck sets the length of Prepare and Combat; each round uses 2 passes through the deck; each new card makes Prepare and Combat longer.

### Prepare

- F-068 [v2 Prepare 1]: Draw 3 cards. Play a top half, or discard the card without its effect. Draw 3 again when the hand is empty; Prepare ends when the deck and the hand are empty.
- F-069 [OQ 10 decided; Spec v1 6.2]: A card may be discarded unplayed. Played effects resolve as written.
- F-070 [Spec v1 6.3, 6.5]: Played cards go to the discard pile. If the deck has fewer than 3 cards, draw all of them.
- F-071 [v2 Prepare 2]: Move N: each step costs 1. A step onto a hex next to an enemy costs 2. A step into an enemy's hex (a skirmish) costs 1.
- F-072 [OQ 26 decided; OQ 28 decided]: The step into an enemy's hex costs 1, like a normal step; the surcharge of 2 applies only to entering a hex next to an enemy; the full cost is paid before the skirmish. Blink pays 1 to enter an enemy's hex too.
- F-073 [Spec v1 6.10-6.13]: Skirmish: moving into a hex with an enemy starts a skirmish. Roll your dice 1 time, use only Skills, no cards. Spec v1 6.12 has the enemy attack once after your roll (a hex holds 1 enemy, F-056, so "each enemy in that hex" is 1 enemy); v2 Prepare 8 (enemies do not act during Prepare) overrides this unless the designer confirms the skirmish counterattack. The sheets print the skirmish as: roll once, Skills only, no enemy attack. If the enemy in the hex is defeated, move the figure in. v2 Prepare 2 names the skirmish but does not describe it.
- F-074 [Spec v1 6.14; OQ 8 decided]: A skirmish that does not clear the hex: the figure stays on the hex it came from and the rest of the Move is lost.
- F-075 [OQ 31 decided]: In a skirmish Dodge works, and a defeated enemy pays experience and currency as any defeat.
- F-076 [OQ 29 decided]: A figure may enter a Barricade or Tower hex; defenses block enemies only.
- F-077 [v2 Prepare 3]: Exploring: a step off the edge of the map reveals the top tile of the tile deck, placed so that it covers the hex you step into (fixed rotation). It costs 1, and you may keep moving. The new tile's enemies do not appear until the next Combat (overrides Spec v1 10.1, 10.2; OQ 37 superseded).
- F-078 [OQ 5 decided]: Tile rotation is fixed (no rotating a revealed tile).
- F-079 [OQ 61 proposed]: If the hex under the step on the revealed tile is lake or mountain: the tile is placed, the step's cost is paid, the figure stays where it was and may keep moving.
- F-080 [prototype value config.default.json tiles.revealMoveCost]: Movement a step off the map edge costs: 1 (matches v2 Prepare 3).
- F-081 [v2 Prepare 4]: Gather N: on a gathering node, take N materials (the card sets the amount). Each node can be used once; a used node is spent. All nodes are alike. Haul gathers 2 in total (overrides Spec v1 6.7, Table 1 "gives 2 materials").
- F-082 [v2 Prepare 4; OQ 59 proposed, settled by v2]: The node is needed for every Gather card, and a used node is spent.
- F-083 [Spec v1 6.9]: You cannot gather or build on a hex that has an enemy.
- F-084 [v2 Prepare 5]: Build: on the base, buy an upgrade; elsewhere, a defense on your hex or next to it. (Build and Repair will be separated later.)
- F-085 [Spec v1 12.1, 12.2]: Build 1 defense on your hex or an adjacent hex. You cannot build on the base, a lake, a mountain, or a hex with an enemy (v2 Setup 1: "the base" is the whole Base tile, so no defense on any of its 7 hexes, and a figure on a base hex buys an upgrade instead of building a defense; overrides the 1-hex reading).
- F-086 [OQ 24 decided]: 1 defense per hex.
- F-087 [OQ 14 decided]: A defense may stand on a gathering node hex; the node still works.
- F-088 [OQ 42 decided]: Build cost reductions (Mason -1, Engineer -2) and Architect's "Build 2 times" apply to base upgrades too: the reduction lowers each upgrade's material cost (minimum 0), Architect buys 2.
- F-089 [OQ 30 pending-spec; OQ 49 pending-spec]: Build versus Repair is to be designed: Repair restores structures; Build is levelled (Build I builds level 1 structures you can afford, Build II level 1 or 2, and so on). Current rule: on the base Build means a base upgrade; each Build is a separate purchase.
- F-090 [Spec v1 11.2-11.4]: To buy an upgrade, play a Build card on the base and pay the materials (v2 Setup 1: "the base" is the whole Base tile, so a figure on any of its 7 hexes buys an upgrade instead of building a defense; overrides the 1-hex reading). Each upgrade adds 5 to the maximum base health and 5 to the base health. Upgrades of a track are bought in sequence: I, then II, then III.
- F-091 [Spec v1 Table 6]: Shop I (4): the Shop opens, showing 3 offers from the Level 1 card supply. Shop II (6): new offers come from the Level 2 supply. Shop III (8): from the Level 3 supply. Training I (3): the Training Ground opens, the draft uses the Level 1 Skill supply. Training II (5): Level 2. Training III (7): Level 3.
- F-092 [v2 Prepare 6]: Rest: heal. Starter Rest heals 2 (Spec v1 Table 2).
- F-093 [OQ 12 pending-spec]: Heal targets in co-op (Mend, Rest, Renewal, Purify) are to be designed per action: self, an ally within N hexes, or an ally on the same tile. Until then every heal is self only.
- F-094 [v2 Prepare 7]: Shop: buy at any moment while your figure is on the base tile. Buying does not use a card.
- F-095 [OQ 11 decided; OQ 43 decided]: Buy at any time in any phase while the figure is on the base tile, at every decision, including mid-exchange, except while a draft or a starter return is waiting. Offers are shared; a bought card is replaced at once so 3 offers are always shown.
- F-096 [Spec v1 11.5; prototype value config.default.json shop.offers]: The Shop always shows 3 offers; a bought offer is replaced from the highest open level supply.
- F-097 [OQ 41 decided]: If the highest open level supply is empty, draw the replacement from the next lower level; with no cards at any open level, fewer than 3 offers. Shop II and III do not replace offers already shown.
- F-098 [Spec v1 13.1]: A bought card goes into the discard pile; the deck grows by 1.
- F-099 [Spec v1 18.1; OQ 44 decided; prototype value config.default.json options.boughtCards]: Playtest option: a bought card may instead replace a starter card (the player chooses 1 starter card from the deck or discard pile, not hand or table). Standard rule: add to the deck. The deck never drops below 10 cards (v2 Setup 5).
- F-100 [v2 Prepare 8]: Enemies do not move or act during Prepare; they are obstacles.

### Combat

- F-101 [v2 Combat 1]: Shuffle the discard pile; turn the deck so the bottom halves are up.
- F-102 [v2 Combat 2]: Enemies move: each enemy moves up to 2 hexes. Enemies head for the nearest structure (Barricade, Tower, or the base tile); they turn to a player only when that player is at least 2 hexes nearer than the nearest structure. An enemy stops next to its target, cannot enter a hex with an enemy, a Barricade, or a Tower, and takes the next target when every path is blocked (overrides Spec v1 9.3 "nearest player, Barricade, Tower, or base" and the player-first order of OQ 15).
- F-103 [v2 Combat 2; OQ 56 proposed, settled by v2]: The pull distance is 2 or more hexes nearer than the nearest structure.
- F-104 [OQ 15 decided (brief, undated); v2 Combat 6]: Tie-break among equally near targets: OQ 15 says Tower, then Barricade, then base, then lowest health. v2 Combat 6 orders structures Barricade, Tower, base for the structure attack; v2 does not state a tie-break for choosing a movement target. Which order applies to targeting is not stated; the "player first" part of OQ 15 is overridden by v2 Combat 2. [prototype value config.default.json rulings.targetTieBreak]: the prototype breaks ties player, then Tower, then Barricade, then base; the "player" entry is overridden by v2 Combat 2, so the prototype order for structures is Tower, Barricade, base (same as OQ 15).
- F-105 [OQ 34 decided]: "Nearest" is straight hex distance; the enemy then walks the shortest open path. Enemies move oldest first.
- F-106 [OQ 2 decided; OQ 39 decided]: Blockers that make an enemy switch to its next nearest target: enemies, Barricades, Towers, figures, lake, mountain. If no open path reaches any target, the enemy waits. v2 Combat 2 names only enemies, Barricades, and Towers as hexes an enemy cannot enter; whether a figure blocks an enemy's path is not stated in v2 (OQ 2/39 reading kept until confirmed).
- F-107 [OQ 33 decided]: An enemy cannot enter a Tower hex; a Tower is a target, so enemies stop next to it and attack it in the structure step (overrides Spec v1 9.4, which names only the Barricade, and prototype value defenses.json tower.blocksEnemies = false).
- F-108 [v2 Combat 3]: Enemies spawn (after moving): every spawn node gets 1 grunt and every elite spawn node gets 1 elite, every Combat, on every revealed tile (overrides Spec v1 7.3, 9.2, 10.2, 10.4; OQ 36 superseded; OQ 21 decided (reads "a new elite only when its elite is defeated") is overridden by v2 Combat 3 and not yet marked superseded in OPEN-QUESTIONS.md).
- F-109 [v2 Combat 3; OQ 1 decided; OQ 27 decided]: If the node is occupied, the enemy is placed on the nearest empty hex (v2 Combat 3). OQ 1/27 reading, written for the one-hex base: empty = passable, no enemy, figure, or defense, not the base centre hex, an outer base hex allowed; nearest = straight hex distance, ties nearest the base then a fixed order. Whether a spill may land on any of the 7 base hexes under v2 Setup 1 ("the whole tile is the base") is not stated.
- F-110 [v2 Combat 3; OQ 13 decided; OQ 32 decided]: The map limit is 20 enemy miniatures: a spawn that would pass it instead turns the grunt nearest the base into an elite (ties: the oldest grunt); the elite keeps the grunt's hex. A blocked elite spawn also replaces the grunt nearest the base.
- F-111 [v2 Combat 4]: Each Tower attacks.
- F-112 [Spec v1 12.3; OQ 35 decided; OQ 34 decided]: Tower attack: 2 damage to the nearest enemy within 2 hexes; the players choose between equally near enemies; Towers attack oldest first.
- F-113 [v2 Combat 5]: Exchanges until the deck is empty.
- F-114 [v2 Combat 5.1; Spec v1 7.8 steps 1-4]: Draw 3. Roll all your dice; keep and reroll, up to 3 rolls (roll, reroll the unkept dice, reroll once more at most).
- F-115 [OQ 23 decided]: A Combat draw with fewer than 3 cards left draws them all.
- F-116 [v2 Combat 5.2]: Play bottom halves (or discard them). Non-attack halves (heal, guard, reroll) work even when no enemy is near; damage needs a target in range (overrides Spec v1 7.9 "if no enemy is within 2 hexes, discard your hand; the exchange has no effect").
- F-117 [OQ 23 decided]: Cards are played one at a time in any order. "Reroll N dice" rerolls that many different dice, picked one at a time; the player may stop early. "Reroll all" rerolls every die, kept or not. Card rerolls do not count toward the 3-roll maximum.
- F-118 [OQ 22 decided]: A card's "+N damage" is added once to the first damage Skill that fires this exchange (to each of its targets); it is lost if no damage Skill fires.
- F-119 [v2 Combat 5.3; Spec v1 7.8 steps 6-7]: Put dice on Skills; use each die 1 time only and each Skill 1 time only; fire every Skill whose faces are all covered.
- F-120 [prototype value config.default.json options.skillUses]: Each Skill fires once per exchange (standard); unlimited is a playtest option (Spec v1 18.1).
- F-121 [Spec v1 Table 3, Table 9]: Range: Strike range 1, Shot range 2; supply Skill ranges as listed in F-042 to F-044. "Each enemy, range 2" Skills hit every enemy within 2 hexes.
- F-122 [v2 Combat 5.4]: Each enemy next to you that has you as its target attacks you (grunt: 2 damage). Guard takes damage first, then health. Guard is removed; played cards go to the discard pile (overrides Spec v1 7.8 step 8 "each enemy next to you attacks you").
- F-123 [Spec v1 9.5, 9.6, Table 4]: Grunt attack 2 damage fixed, no dice. Elite attack: roll 6 action dice; Sword, Wand, Bow 1 damage each; Star 2; Shield, Blank 0.
- F-124 [OQ 47 decided]: A level reached mid-exchange: the new die is used from the next roll of dice (the next exchange or skirmish).
- F-125 [v2 Combat 6]: Structure attack (once): each enemy that is not next to a player attacks 1 adjacent structure: Barricade first, then Tower, then the base.
- F-126 [Spec v1 7.10, 7.11, 7.12]: The structure attack happens when the deck and the hand are empty. A structure is a Barricade, a Tower, or the base.
- F-127 [OQ 7 pending-spec]: Enemy damage to structures: the designer intends 1 die (Table 4) per grunt and special rules for elites (unwritten). Until then the Spec v1 reading applies: grunt 2 fixed, elite 6 dice.
- F-128 [Spec v1 12.4]: A defense with 0 health is removed from the map.
- F-129 [v2 Combat 7]: Players do not move during Combat.
- F-130 [prototype value config.default.json combat.exchangeRange]: Exchange range 2 (the "within 2 hexes" of Spec v1 7.9; v2 keeps only "damage needs a target in range").

### End of round

- F-131 [v2 End of round 1]: Turn the discard pile so the top halves are up: the next Prepare deck. Do not shuffle it [Spec v1 10.6 only; Section 10 is removed by v2 and v2 End of round 1 does not restate this: treat as a carried-over reading, not a v2 rule] (F-193 moves 10.6-10.10 to the End of round; listed for the designer to confirm as F-222).
- F-132 [v2 End of round 2]: If the Training Ground is open and the round is even, do the Skill draft.
- F-133 [Spec v1 11.6, 11.7]: Skill draft: each player looks at the top 2 Skills of the highest open level Skill supply, keeps 1 (free), and puts the other at the bottom of its supply.
- F-134 [Spec v1 11.8; OQ 50 pending-spec]: If that supply is empty, use the next lower level supply. Every open supply empty: no draft that round (current rule; to be revisited with the Skill design).
- F-135 [Spec v1 11.9; OQ 46 pending-spec]: 6 draft Skills at most; with full slots the kept Skill must replace 1 drafted Skill, which goes to the bottom of its supply (current rule; under the Skill-cap experiment).
- F-136 [prototype value config.default.json draft]: Draft reveals 2, keeps 1, every 2 rounds (matches Spec v1 11.6, 11.7, 10.8).
- F-137 [v2 End of round 3]: Add 1 to the round counter. Examine the milestones.
- F-138 [OQ 45 decided]: "Survive to round N" is reached when the round counter reaches N, checked at the end of the round and at the end of the run.

## 6. Experience and levels

- F-139 [v2 Experience; Spec v1 8.1, 16.2]: Experience is a shared track: each defeated enemy gives shared experience to all players.
- F-140 [v2 Experience; Spec v1 8.2]: The player who defeats an enemy gets its currency. A Tower's defeat pays currency to the Tower's builder; experience goes to the shared track (OQ 40, 53 decided).
- F-141 [v2 Experience; Spec v1 8.3, 8.4]: When the experience track reaches the next threshold the level rises by 1. Each new level gives every player 1 more die. There is no maximum level (playtest option: a cap, Spec v1 18.1).
- F-142 [Spec v1 8.5; OQ 17 pending-spec]: Current step values, under review: level 2 at 5 experience, level 3 at 15, level 4 at 30, level 5 at 50 (first step 5, each next step 5 more than the last). The designer compares: steps of 3; steps of 5 with more experience from elites; 1 level per elite that spawns.
- F-143 [prototype value config.default.json experience]: firstStep 5, stepIncrease 5 (the same values as F-142).
- F-144 [Spec v1 Table 5]: Experience per defeat: grunt 1, elite 4. Currency per defeat: grunt 1, elite 4.
- F-145 [OQ 48 decided]: Any defeat of an elite, including by a Tower, counts for "Defeat an elite".

## 7. Knockout, run end, scoring

- F-146 [v2 Experience, defeat, and the end]: A player at 0 health is knocked out: at the start of the next round the figure returns to a free base hex (overrides Spec v1 14.2 "the run stops if the health of a player is 0" and 16.7).
- F-147 [OQ 55 proposed]: Knockout values, to be designed: proposed return at half health (rounded up), and the materials they carried are lost.
- F-148 [v2 Experience, defeat, and the end; Spec v1 14.1]: The run ends when the base reaches 0 health.
- F-149 [v2 Experience, defeat, and the end; Spec v1 1.2]: There is no win condition yet. The score is the rounds survived and the milestones (Spec v1 14.3: record the round number and the milestones).
- F-150 [Spec v1 1.8]: No item stays from one run to the next.
- F-151 [OQ 58 pending-spec; Spec v1 19]: Scenarios with a win condition are an idea for after the base engine is ready (example in Spec v1 19.3: after the last tile, remove all enemies from the map). Not a rule.

## 8. Milestones

- F-152 [Spec v1 17; prototype value config.default.json milestones.surviveRounds]: Survive to round 5. Survive to round 10. Survive to round 15. (current Spec v1 milestone; the milestone set as a whole is under review, see F-184)
- F-153 [Spec v1 17]: Defeat an elite. (current Spec v1 milestone; the milestone set as a whole is under review, see F-184)
- F-154 [Spec v1 17; OQ 9 pending-spec]: Fire Arcane Rain (names a placeholder Skill; the Skill set is to be designed).
- F-155 [Spec v1 17; prototype value config.default.json milestones.upgradesBought]: Buy 3 base upgrades. (current Spec v1 milestone; the milestone set as a whole is under review, see F-184)
- F-156 [OQ 4 pending-spec]: Reveal N tiles: under review until the new tile set is known. Spec v1 17 says 10 (8 non-base tiles exist); the OQ reading was 7; the prototype value milestones.tilesRevealed is 10 (DECISIONS notes the row and the setting differ).
- F-157 [Spec v1 17; prototype value config.default.json milestones.level]: Reach level 5. (current Spec v1 milestone; the milestone set as a whole is under review, see F-184)
- F-158 [v2 Still open]: Milestones that relied on the old structure ("Reveal 7 tiles") need a review once the tile set is known; the milestone set as a whole is listed as still to design in DECISIONS (row 4).

## 9. Co-op rules (1 to 4 players)

- F-159 [Spec v1 1.5, 1.6; prototype value config.default.json players]: 1 to 4 players. Sections 1 to 15 of Spec v1 are the solo rules; Section 16 gives the changes for 2 to 4.
- F-160 [Spec v1 16.1; OQ 54 decided]: Each player has a deck, dice, a player board, and their own materials: each player gathers and spends their own materials.
- F-161 [Spec v1 16.2]: All players share the experience track and the level; all players get their new die at the same time.
- F-162 [Spec v1 16.3]: All hands are open. Players can discuss all cards (table talk).
- F-163 [Spec v1 16.8; OQ 6 decided]: Prepare in co-op: players alternate hands of 3 in seat order, starting with the first player and continuing clockwise, until every deck is empty. How the first player is chosen is not stated.
- F-164 [Spec v1 16.4, 16.5; v2 Combat 5.4]: Combat in co-op: players do their exchanges in turn, first player then clockwise; in each player's exchange, each enemy next to that player that has that player as its target attacks that player.
- F-165 [OQ 52 decided]: Who buys: the player whose decision it is, while their figure is on the base tile. Other players buy on their own turn.
- F-166 [OQ 53 decided; OQ 40 decided]: In co-op a Tower defeat pays its currency to the Tower's builder.
- F-167 [v2 Experience, defeat, and the end]: In co-op a knocked-out player returns at the next round start; the run does not stop when one player falls (overrides Spec v1 16.7 "if the health of one player is 0, the run stops for all players").
- F-168 [v2 Round]: Spec v1 16.6 "reveal 1 map tile for each player in the Explore phase" is removed: each figure reveals tiles by stepping off the map edge (OQ 51 superseded).
- F-169 [Spec v1 3.8; v2 Setup 3]: 1 figure per hex also on the Base tile; at setup each player takes a free base hex (6 outer hexes and the centre, so 4 players fit).

## 10. Numbers the sheets will want that no source states

- F-170 [not stated]: Suggested age: not stated in any source.
- F-171 [Spec v1 1.7]: Play time: Spec v1 states a target of a typical solo run stopping in rounds 10 to 12, and "12 rounds take approximately 90 minutes". No v2 source states a play time; the Spec v1 figure predates the v2 loop (no Explore phase, 10-card deck).
- F-172 [not stated]: Box size: not stated in any source.
- F-173 [bot batch]: Duration evidence: 200 trial runs of the digital prototype (phase 9, Spec v1 rules with the Explore phase and wave track): median end round 14, middle half 10-17, range 9-25; base fell in 117 runs (median round 16), player fell in 83 (median round 10); no run ended before round 9; 0 runs reached level 5.
- F-174 [bot batch (DECISIONS checks, interim after the first v2 rules, 2026-10-04)]: Under the interim v2 rules (before knockout, spawn-every-Combat, and structure-first targeting) the same 200-run batch ends at a median of round 5 (middle half 4-6); 199 of 200 runs end when the player falls. To be re-measured; not a balance verdict.
- F-175 [not stated]: Minutes per round at a real table: no real-run timing exists (docs/playtests/runs holds no run files).
- F-176 [not stated]: Counts of dice, material tokens, currency tokens, Barricade tokens, Tower tokens in the box: not stated.
- F-177 [PROTOCOL]: Teach order for Playtester sheets (docs/playtests/PROTOCOL.md): the base; the deck that turns over (Prepare halves, then Combat halves); rolling and keeping dice; putting dice on Skills; the wave track (removed by v2, skip); how the run ends. The protocol still says "6-card deck"; the sheets use the v2 10-card deck.

## 11. To be designed

- F-178 [OQ 57 pending-spec]: New tile set: how many tiles and what is on them (row 57).
- F-179 [OQ 55 proposed]: Knockout values: health on return and the penalty (row 55).
- F-180 [OQ 7 pending-spec]: Elite structure damage and the grunt 1-die structure rule (row 7).
- F-181 [OQ 12 pending-spec]: Per-card heal targets in co-op (row 12).
- F-182 [OQ 9 pending-spec; OQ 46 pending-spec; OQ 50 pending-spec]: Real Skills, upgraded Skill tiers, and Skill caps (rows 9, 46, 50).
- F-183 [OQ 30 pending-spec; OQ 49 pending-spec]: Build versus Repair levels (rows 30, 49).
- F-184 [OQ 4 pending-spec]: Milestone set, starting with "Reveal N tiles" (row 4).
- F-185 [OQ 58 pending-spec]: Scenarios with a win condition (row 58).
- F-186 [OQ 17 pending-spec]: Experience curve: step values under comparison (row 17).
- F-189 [OQ 60 proposed]: Supply Gather cards give N in total: Forage 1, Excavate 3, Quarry 5; Forage may be re-priced (row 60).
- F-190 [OQ 61 proposed]: Revealed tile with lake or mountain under the step: tile placed, cost paid, figure stays (row 61).
- F-191 [OQ 62 proposed]: Wave track timing with no Explore phase: an interim rule only, replaced by the v2 spawn rule (row 62); the sheets do not show a wave track.
- F-222 [Spec v1 10.6; v2 End of round 1]: The End of round deck turn without a shuffle (F-131) has Spec v1 10.6 as its only source; Section 10 is removed by v2 (F-193) and v2 End of round 1 does not restate "do not shuffle". For the designer to confirm.

## 12. Conflicts resolved

- F-192 [v2 Round]: Spec v1 5.1 "3 phases: Prepare, Combat, Explore": replaced by 2 phases, Prepare then Combat.
- F-193 [v2 Round; v2 Prepare 3]: Spec v1 10 Explore phase (10.1-10.5): removed by v2; tiles are revealed by stepping off the map edge during Prepare; 10.6-10.10 become the End of round.
- F-194 [v2 Setup 4]: Spec v1 2.2, 4.5, 7.4, 10.3, 10.4, 15 wave track and wave step: removed by v2 (OQ 38, 51, 62 superseded or interim).
- F-195 [v2 Setup 5]: Spec v1 2.1, 4.8, Table 2 "6 starter cards": 10-card starter deck (4 Move 2, 4 Gather 2, 1 Build, 1 Rest).
- F-196 [v2 Setup 1]: Spec v1 3.6, Table 1 ("Base tile, center hex"), 11.2 "the centre hex is the base": the whole 7-hex Base tile is the base (OQ 16 decided).
- F-197 [v2 Setup 1]: Spec v1 Table 1 "Base tile: 2 gathering nodes": the Base tile has no gathering nodes.
- F-198 [v2 Setup 2]: Spec v1 4.2, 4.3 "1 countryside tile placed at setup; 2 countryside on 5 core": the Base tile alone; all 3 countryside on 5 core (OQ 3, 25 superseded).
- F-199 [v2 Setup 1, 2 and Combat 3, inferred; prototype value tiles.json broken-village]: Spec v1 4.4 "put 1 enemy on each spawn node" at setup: removed; no enemies at setup (no tile but the Base is out, enemies enter only in the Combat spawn step, and the Base tile carries no spawn node in the prototype data).
- F-200 [v2 Setup 3]: Spec v1 4.6 "put your figure on the base": each figure on a free base hex, 1 per hex.
- F-201 [v2 Prepare 4]: Spec v1 6.7 Gather "get the materials that the node gives" and Table 1 "gives 2 materials": the card sets the amount; the node is spent after one use.
- F-202 [OQ 20 decided; OQ 60 proposed]: Spec v1 Table 8 "Gather +N": N in total, not node amount plus N.
- F-203 [v2 Prepare 2; OQ 26 decided]: Spec v1 6.9, 6.15 cost of entering an enemy's hex: 1 (the surcharge of 2 applies only next to an enemy).
- F-204 [v2 Prepare 3]: Spec v1 10.2 "put 1 enemy on each spawn node of the new tile" at reveal: the new tile's enemies do not appear until the next Combat.
- F-205 [v2 Combat 2]: Spec v1 7.5 "each enemy moves 2 hexes": up to 2 hexes.
- F-206 [v2 Combat 2]: Spec v1 9.3 "nearest player, Barricade, Tower, or base" and OQ 15 "player first": enemies head for the nearest structure; a player draws them only when at least 2 hexes nearer [v2 Combat 2; OQ 56 proposed, settled by v2].
- F-207 [v2 Combat 3]: Spec v1 7.3, 9.2 "a spawn node gets a new enemy only when its enemy is defeated" and OQ 21, 36: every spawn node and elite spawn node spawns every Combat, after enemies move (OQ 36 superseded; OQ 21 decided (reads "a new elite only when its elite is defeated") is overridden by v2 Combat 3 and not yet marked superseded in OPEN-QUESTIONS.md).
- F-208 [v2 Combat 5.2]: Spec v1 7.9 "no enemy within 2 hexes: discard the hand, the exchange has no effect": non-attack halves work without an enemy near; damage needs a target in range.
- F-209 [v2 Combat 5.4]: Spec v1 7.8 step 8 "each enemy next to you attacks": only enemies that have you as their target attack.
- F-210 [v2 Experience, defeat, and the end]: Spec v1 14.2 and 16.7 "the run stops if a player's health is 0": knockout; the figure returns to a free base hex at the next round start.
- F-211 [v2 Round]: Spec v1 16.6 "reveal 1 map tile for each player in the Explore phase": removed.
- F-212 [v2 Round]: Spec v1 18.1 exploration options (forced, optional, automatic reveal) and OQ 37: removed with the Explore phase.
- F-213 [OQ 4 pending-spec]: Spec v1 17 "Reveal 10 tiles": under review (OQ reading 7; prototype value 10).
- F-214 [OQ 18 decided]: Spec v1 Table 8 listing each supply card once: 2 copies of each supply card; 1 of each Skill.
- F-215 [OQ 32 decided]: Spec v1 10.5 "replace 1 grunt with 1 elite" when the limit stops a grunt: also when the limit stops an elite; the grunt nearest the base is replaced.
- F-216 [OQ 35 decided]: Spec v1 12.3 Tower target with 2 equally near enemies: the players choose.
- F-217 [OQ 40 decided; OQ 53 decided]: Spec v1 8.2 "the player who defeats the enemy gets currency" for a Tower defeat: the Tower's builder gets the currency.
- F-218 [OQ 7 pending-spec]: Spec v1 7.11 structure damage: not overridden; the v1 reading (grunt 2, elite 6 dice) stays until the elite rule is written.
- F-219 [OQ 12 pending-spec]: Spec v1 Table 3 and 6.7 heal effects: not overridden; self only until per-card targets are assigned.
- F-220 [prototype value config.default.json milestones.tilesRevealed]: The prototype value (10) and the OQ 4 reading (7) differ; neither is final (F-156).
- F-187 [v2 Combat 2; OQ 56 proposed]: Enemies head for the nearest structure; a player draws an enemy only when at least 2 hexes nearer than the nearest structure (v2 rule, in force; moved from section 11). The proposed status covers only the rule option `rulings.playerPullDistance` (no config field); the sheets print the v2 rule.
- F-188 [v2 Prepare 4; OQ 59 proposed]: Gather needs a gathering node and the node is spent (v2 rule, in force; moved from section 11). The proposed status covers only the rule option `rulings.gatherNeedsNode` that restores OQ 20's off-node reading; the sheets print the v2 rule.
- F-221 [v2 Still open]: Elite ranged retaliation has no rule in any source. The Spec v1 values for elites (F-052), Towers (F-047), supply cards (F-033 to F-035) and Skills (F-042 to F-044) stand until the designer revisits them; the Tower and supply-card rules decided in OQ 24, 29, 33, 35, 40, 41, 42, 43, 53 (F-076, F-086, F-088, F-095, F-097, F-107, F-112, F-140) are settled (moved from section 11).
