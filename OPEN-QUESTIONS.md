# Open questions

Rule readings the engine needs that `spec/01-spec-v1-rules.md`
(Issue 005) does not settle. Each row: the rule id, the
reading the engine implements, the config flag that carries
it, and its status.

Status vocabulary: `decided` (designer answered; the spec
text should be updated to match), `proposed` (loop's reading,
awaiting the designer), `pending-spec` (designer intends a new
rule but has not written it yet; the engine uses the v1 text
until then).

| # | Rule | Question | Reading implemented | Flag | Status |
|---|---|---|---|---|---|
| 1 | 10.4, Table 1 | Can enemies share a hex? | **One enemy per hex.** A spawn whose node is occupied spills to the nearest empty passable hex (nearest to the base on ties). | `enemiesPerHex: 1` | decided 2026-10-02 |
| 2 | 9.3–9.4 | What does an enemy do when another enemy blocks its path? | It moves toward the **next nearest target** instead. | `blockedPathRule: "next-target"` | decided 2026-10-02 |
| 3 | 4.2–4.3 | Tile count and setup. | **9 tiles:** Broken Village (base), 3 countryside, 5 core. Setup: base + 1 countryside tile. Deck: 2 countryside on top of 5 core (7 tiles). Solo waves start in round 8. **Superseded:** Setup is the Base tile alone; tiles are revealed by moving off the map edge. | `tiles.setupCountryside: 1`, `tiles.countryside: 3`, `tiles.core: 5` | superseded 2026-10-04 (core loop v2, `docs/design/core-loop-v2.md`) |
| 4 | 17 | "Reveal 10 tiles" is unreachable with 8 non-base tiles. | **Reveal 7** (the whole tile deck): the milestone fires when exploration empties the deck. **Superseded:** "Reveal 7 tiles" is under review until the new tile set is known. | `milestones.tilesRevealed: 7` | pending-spec 2026-10-04 (review with the new tile set) |
| 5 | 10.1 | Where can a revealed tile go? | Any empty slot adjacent to an existing tile where the 7-hex shapes tessellate; **fixed rotation**; the player picks the slot. | `tileRotation: false` | decided 2026-10-02 |
| 6 | 16 | Co-op Prepare order (16.4 covers Combat only). | Players **alternate hands of 3** in seat order until every deck is empty. | `coopPrepareOrder: "alternate-hands"` | decided 2026-10-02 |
| 7 | 7.11, 9.5 | Enemy damage to structures. | Designer intends: **1 die (Table 4) per grunt; elites get special rules** (unwritten). Until the spec carries that text the engine uses the v1 reading: grunt 2 fixed, elite 6 dice. | `structureDamage: "v1"` (future `"grunt-die"`) | pending-spec (2026-10-04: keep the v1 reading until the designer writes the elite rule) |
| 8 | 6.10–6.13 | Skirmish that does not clear the hex. | Figure **stays on the hex it came from**; the rest of the Move is lost. Entering costs movement as normal, including the 6.9 surcharge, and needs the full cost available. | `skirmishFail: "stay-lose-move"` | decided 2026-10-02 |
| 9 | 2.1 | Skill capacity. | The 4 starter Skills are fixed; at most 6 drafted Skills; when full, the kept Skill replaces one (current engine). **Designer 2026-10-04:** experiment with Skill caps (phase 21), and add upgraded Skill tiers (for example Fireball III) so a late draft is never wasted. The Skills themselves are placeholders still to design. | `draftSlots: 6`, `fullBoardDraft: "swap"` | pending-spec 2026-10-04 (Skill design) |
| 10 | 6.2, 7.8 step 5 | Must every card be played (Prepare top halves and Combat bottom halves)? | **A card may be discarded unplayed.** Played effects resolve as written. | `mandatoryPlays: false` | decided 2026-10-02 |
| 11 | 6.8, 11.5 | Shop timing and refill. | **Buy at any time in any phase while the figure is on the base.** Offers are shared; a bought card is **replaced immediately** so 3 offers are always shown. Assumption to confirm: the on-base requirement from 6.8 still holds. | `shopTiming: "any-time-on-base"`, `shopRefill: "immediate"` | decided 2026-10-04 (on-base: yes, anywhere on the base tile, see row 16) |
| 12 | Table 3, 6.7 | Heal targets in co-op (Mend, Rest, Renewal, Purify). | **Per action** (designer 2026-10-04): each heal effect names its target: self, an ally within N hexes, or an ally on the same tile. The value for each card is still to assign; until then the engine keeps self only. | `healTargets: "self"` | pending-spec 2026-10-04 (per-card targets) |
| 13 | 10.5 | Which grunt becomes the elite? | The grunt **nearest the base** (ties: the oldest grunt). The elite keeps the grunt's hex and spawn node. Bot data 2026-10-04: the 20-miniature cap is reached at the first wave (round 9 median) in all 200 runs, with about 15 promotions per run, so promotion is the late-game difficulty curve. | `eliteReplacement: "nearest-base"` | decided 2026-10-04 |
| 14 | Brief | Defense on a gathering node hex. | **Allowed**; the node still works. | `buildOnNode: true` | decided (brief) |
| 15 | 9.3 | Enemy target tie-break. | Player, then Tower, then Barricade, then base; then lowest health. | `targetTieBreak` | decided (brief) |
| 16 | 3.8, 4.6 | Issue 006 rule 3.8 (1 figure per hex) conflicts with 4.6 (every figure starts on the base) in co-op. | **The base is the whole 7-hex Broken Village tile** (designer 2026-10-04). Buying and upgrades work on any base hex, and an enemy next to any base hex attacks the base. The 1-figure limit (3.8) holds on base hexes too: each player places their start figure on a free base hex. | (engine, `onBaseTile`, `blockedByFigure`; the `baseHexFigureLimitExempt` flag is gone) | decided 2026-10-04 (engine: phase 20, shipped) |
| 17 | 8.5 | "Each next level needs 5 more than the last step." | Current engine: steps grow by 5 (level 2 at 5, 3 at 15, 4 at 30, 5 at 50). **Designer 2026-10-04:** compare models before deciding: steps of 3; steps of 5 with more experience from elites; 1 level for each elite that spawns (phase 21 bot report). | `experience.firstStep: 5`, `experience.stepIncrease: 5` | pending-spec 2026-10-04 (experiment: phase 21) |
| 18 | 2.2, 4.12, Tables 8-9 | How many copies of each supply card and Skill? The tables list each once. | **2 copies of each supply card**; 1 copy of each Skill. | `supplies.copiesPerCard: 2`, `supplies.copiesPerSkill: 1` | decided 2026-10-04 (engine: phase 20, shipped) |
| 19 | 18.1 | Which cards make the 8-card and 10-card starter decks? | 8 cards: 3 Move, 3 Gather, 1 Build, 1 Rest. 10 cards: 4 Move, 4 Gather, 1 Build, 1 Rest. | `deck.presets` | decided 2026-10-04 |
| 20 | 6.7, Table 8 | "Gather +2" (Haul): node amount plus 2, or 2 total? | **2 total**: Haul gathers 2 materials, on a node or off one. Phase 20: the amount is shipped; "off one" sits behind a flag, see row 59. | `PrepareEffect gather.amount` | decided 2026-10-04 (engine: phase 20, shipped) |
| 21 | Table 1, 9.2 | The elite spawn node "holds 1 elite": does it refill (9.2) like a spawn node? | **Yes**: an elite spawn node gets a new elite only when its elite is defeated, the same as 9.2. | (engine, phase 7) | decided 2026-10-04 |
| 22 | 7.8 step 5, Tables 2, 8 | Where does a card's "+N damage" go? | Added once to the **first damage Skill that fires** this exchange (to each of its targets). Lost if no damage Skill fires. | (engine, `confirmAssignment`) | decided 2026-10-04 |
| 23 | 7.8 step 5 | Order of card bottom halves and their reroll effects. | The player plays cards one at a time in any order; a numbered reroll ("Reroll 2 dice") rerolls that many **different** dice, picked one at a time; the player may stop early. "Reroll all" rerolls every die, kept or not. Card rerolls do **not** count toward the 3-roll maximum (7.8 step 4). A Combat draw with fewer than 3 cards left draws them all, as 6.5. | (engine) | decided 2026-10-04 |
| 24 | 12.2 | How many defenses may stand on one hex? | **1 per hex** (physical edition: one token fits). | (engine, `canBuildOn`) | decided 2026-10-04 |
| 25 | 4.2 [006] | Who chooses where the setup countryside tile goes? | **The player**, from the 6 slots next to the Base tile (the same choice as 10.1 Explore). **Superseded:** No setup tile: the first tile is revealed by a figure stepping off the Base tile. | (engine, `placeTile`) | superseded 2026-10-04 (core loop v2, `docs/design/core-loop-v2.md`) |
| 26 | 6.9, 6.15 | What does it cost to enter a hex that holds an enemy? | **1**: the step into an enemy's hex (the skirmish) costs 1, like a normal step. The 6.9 surcharge applies only to entering a hex next to an enemy. The full cost is paid before the skirmish. | (engine, `moveCost`) | decided 2026-10-04 (engine: phase 20, shipped) |
| 27 | 9.8 [006] | What is an "empty" hex for spill-over, and how is "nearest" measured? | **Empty** = passable, not the base **centre** hex, and no enemy, figure, or defense (the outer base hexes can take a spill-over, designer 2026-10-04). **Nearest** = straight hex distance (ties: nearest the base, then a fixed order). | (engine, `spawnHex`) | decided 2026-10-04 |
| 28 | 6.15, Table 8 (Blink) | Does "no extra cost" also apply when entering an enemy's hex? | **Yes**: Blink pays 1 to enter an enemy's hex (as row 26), then the skirmish starts. | (engine, `moveCost`) | decided 2026-10-04 |
| 29 | 3.4, 12 | May a figure enter a Barricade or Tower hex? | **Yes**: defenses block enemies only. | (engine, `legalMoves`) | decided 2026-10-04 |
| 30 | 6.7, 12.1 | On the base hex, Build is always a base upgrade (never a defense on an adjacent hex)? | Current engine: on the base hex Build means a base upgrade. **Designer 2026-10-04:** separate Build from Repair; see row 49. | (engine, `applyTopEffect`) | pending-spec 2026-10-04 (Build and Repair) |
| 31 | 6.11, Table 9, 8.1 | In a skirmish, does Dodge work, and does a won skirmish give experience and currency? | **Yes to both**: a skirmish uses Skills as an exchange does (Dodge ignores the enemy's 1 attack); defeating the enemy pays as any defeat (from phase 8). | (engine) | decided 2026-10-04 |
| 32 | 2.2, 10.5 | What does the miniature limit count, and what happens to an elite over it? | **Every enemy miniature** (grunts and elites, 2.2: 20). A grunt the limit stops promotes the grunt nearest the base (10.5); **an elite the limit stops also promotes the grunt nearest the base** (designer 2026-10-04). | `miniatureLimit` | decided 2026-10-04 (engine: phase 20) |
| 33 | 9.3, 9.4, 12 | May an enemy enter a Tower hex? | **No**: enemies stand only on empty hexes (row 27). A Tower is a target, so enemies stop next to it and attack it in the structure step. | (engine, `enemyCanEnter`) | decided 2026-10-04 |
| 34 | 9.3 | "Nearest" for a target: straight distance or walking distance? In what order do enemies move? | **Straight hex distance** ranks targets; the enemy then walks the shortest open path (9.7 when blocked). Enemies move **oldest first**; Towers attack oldest first. | (engine, `rankTargets`, `moveEnemies`) | decided 2026-10-04 |
| 35 | 12.3 | Which enemy does a Tower hit when 2 are equally near? | **The players choose** between equally near enemies (designer 2026-10-04). | (engine, `towerAttacks`) | decided 2026-10-04 (engine: phase 20) |
| 36 | 9.2, 7.3 | Does a spawn node refill when its enemy walked away? | **Whenever the node hex is empty**: at the refill step a spawn node gets a new grunt if no enemy stands on it (designer 2026-10-04). Wave grunts belong to no node. **Superseded:** Every spawn node spawns at every Combat start, after enemies move. | (engine, `vacantNodes`, `refillNodes`) | superseded 2026-10-04 (core loop v2, `docs/design/core-loop-v2.md`) |
| 37 | 18.1 | Automatic exploration: where does the tile go? | **The player chooses** the empty slot (designer 2026-10-04). **Superseded:** There is no Explore phase, so no automatic exploration. | (engine, `startExplore`) | superseded 2026-10-04 (core loop v2, `docs/design/core-loop-v2.md`) |
| 38 | 7.4, 10.3, 10.4 | When does the wave step happen? | In **Combat** (7.4), at the start of each Combat phase while the wave track is above 0. 10.4 defines the step; it is not repeated in Explore. With the 7-tile deck the track first rises in round 8 Explore, so the first wave arrives in round 9 Combat. **Superseded:** There is no wave track; spawn nodes on revealed tiles are the pressure. | (engine, `startCombat`) | superseded 2026-10-04 (core loop v2, `docs/design/core-loop-v2.md`) |
| 39 | 9.7 | Which blockers make an enemy switch target? | **Any**: enemies, Barricades, Towers, figures, lake, and mountain. If no open path reaches any target, the enemy waits. | `blockedPathRule` | decided 2026-10-04 |
| 40 | 8.2, 12.3 | Who gets the currency when a Tower defeats an enemy? | **The player who built the Tower** gets the currency; experience goes to the shared track (designer 2026-10-04). Towers carry their builder. | (engine, `gainForDefeat`) | decided 2026-10-04 (engine: phase 20) |
| 41 | 11.5 | The Shop's highest open level supply is empty. | Draw from the **next lower level** (as 11.8 for the draft); no cards left at any open level: fewer than 3 offers. Shop II and III do not replace offers already shown. | (engine, `refillOffers`) | decided 2026-10-04 |
| 42 | 6.7, 11.2, Table 8 | Do Build cost reductions (Mason, Engineer) and Architect's "Build 2 times" apply to base upgrades? | **Yes**: a Build on the base buys upgrades with the same card: the reduction lowers each upgrade's material cost (minimum 0), and Architect buys 2. | (engine, `legalUpgrades`) | decided 2026-10-04 |
| 43 | 6.8 | May a player buy at every decision while on the base, including mid-exchange? | **Yes** ("at each moment", 6.8 [006]): buying is offered at every decision while the figure is on the base, except while a draft or a starter return is waiting. | `shopTiming` | decided 2026-10-04 |
| 44 | 18.1 | Replace-starter mode: which starter card leaves? | The **player chooses** 1 starter card from the deck or discard pile (not hand or table). No starter there: nothing leaves. | `options.boughtCards` | decided 2026-10-04 |
| 45 | 17 | When is "Survive to round N" reached? | When the **round counter reaches N** (10.9), checked at 10.10 and at the end of the run. | (engine, `reachedMilestones`) | decided 2026-10-04 |
| 46 | 11.9, row 9 | With full draft slots, must the kept Skill replace a drafted Skill, or may the player decline? | **Must** (11.9) in the current engine. **Designer 2026-10-04:** see row 9 (Skill caps experiment and upgraded Skill tiers). | `fullBoardDraft` | pending-spec 2026-10-04 (Skill design) |
| 47 | 8.4 | A level reached mid-exchange: when can the new die be used? | From the **next roll of dice** (the next exchange or skirmish); the dice already rolled stay as they are. | (engine, `player.dice`) | decided 2026-10-04 |
| 48 | 17 | Does a Tower's elite defeat count for "Defeat an elite"? | **Yes**: any defeat of an elite counts. | (engine, `progress.elitesDefeated`) | decided 2026-10-04 |
| 49 | 11.4, Table 8 | May Architect ("Build 2 times") buy tier I and tier II of a track with one card? | Current engine: yes, each Build is a separate purchase. **Designer 2026-10-04:** separate Build from Repair. Repair restores structures; Build is levelled: Build I builds level 1 structures you can afford, Build II builds level 1 or 2 structures, and so on. To write into Spec v2. | (engine, `legalUpgrades`) | pending-spec 2026-10-04 (Build and Repair) |
| 50 | 11.8 | Every open Skill supply is empty at a draft. | Current engine: no draft that round. **Designer 2026-10-04:** the Skills are placeholders still to design; revisit with the Skill design. | (engine, `startDraft`) | pending-spec 2026-10-04 (Skill design) |
| 51 | 10.3, 16.6 | With 2-4 players, how often does an empty tile deck raise the wave track, and in what order are reveals done? | **+1 once per Explore phase**, at the first reveal that finds the deck empty (so if the deck runs out partway through, the wave rises that same round). Reveals go round the seats (p1, p2, ..., then again when `revealPerPlayer` > 1). **Superseded:** There is no wave track or Explore phase. | (engine, `exploreStep`) | superseded 2026-10-04 (core loop v2, `docs/design/core-loop-v2.md`) |
| 52 | 6.8, 16 | In co-op, who may buy cards? | **The player whose decision it is**, while their figure is on the base. Other players buy on their own turn. | `shopTiming` | decided 2026-10-04 |
| 53 | 8.2, 12.3, 16 | In co-op, does a Tower defeat give currency to anyone? | **The builder of the Tower** gets the currency (as row 40). | (engine, `gainForDefeat`) | decided 2026-10-04 (engine: phase 20) |
| 54 | 16, 6.7, 12.1 | Are materials per player or shared? | **Per player**: each player gathers and spends their own materials (16.1 "each player has a player board"). Experience and level are shared (16.2). | (engine, `Player.materials`) | decided 2026-10-04 |
| 55 | Core loop v2 | A knocked-out player (0 health) returns to a free base hex at the next round start. With what health, and what do they lose? | **Half health (rounded up), and the materials they carried are lost.** | (engine, phase 21) | proposed 2026-10-04 |
| 56 | Core loop v2 | Enemies prefer structures; how much nearer must a player be to draw an enemy instead? | **2 or more hexes nearer** than the nearest structure. | `rulings.playerPullDistance: 2` (phase 21) | proposed 2026-10-04 |
| 57 | Core loop v2 | The designer will add more tiles. How many, and what is on them? | The current 3 countryside and 5 core tiles until the new set exists. | `tiles.json` | pending-spec 2026-10-04 |
| 58 | 19 | Scenarios. | Not in scope until the base engine is ready; a later brainstorm. | (none) | pending-spec 2026-10-04 (later) |
| 59 | 6.7, Table 8, row 20 | Row 20 says Haul gathers 2 "on a node or off one"; the core loop v2 walkthrough says Gather takes N **on a gathering node** and spends it. Which wins? | **The node is needed** for every Gather card, and a used node is spent (the walkthrough, which makes nodes scarce). The flag restores row 20's literal reading: off a node Gather also gives its amount and spends nothing; a Gather on a node still spends that node. | `rulings.gatherNeedsNode: true` | proposed 2026-10-04 (phase 20) |
| 60 | Table 8, row 20 | Row 20 reads "Gather +2" (Haul) as 2 in total. The other "Gather +N" cards? | **N in total for each card**: Forage 1, Excavate 3, Quarry 5 (starter Gather 2). Forage now gathers less than the starter card; the designer may want to re-price it. | `cards.json` `gather.amount` | proposed 2026-10-04 (phase 20) |
| 61 | Core loop v2 | A step off the map edge reveals a tile whose hex under the step is lake or mountain. | **The tile is placed and the step's cost is paid; the figure stays where it was** (3.4) and may keep moving. | (engine, `moveTo`) | proposed 2026-10-04 (phase 20) |
| 62 | 10.3, core loop v2 | With no Explore phase, when does an empty tile deck raise the wave track? | **At the end of each round** (after the Combat structure attack) while the tile deck is empty, until phase 21 removes the wave track. Note: until phase 21 spawns at every node each Combat, a run where nobody steps off the Base tile has no enemies and does not end. | (engine, `combatStep`) | proposed 2026-10-04 (phase 20; phase 21 replaces it) |
| 63 | Core loop v2 | No clock: enemies spawn only on revealed tiles, and only players reveal tiles. The score is rounds survived. A run where nobody steps off the Base tile never ends (row 62). What replaces the wave track as the clock? | **None yet.** Candidates: a forced reveal every N rounds, spawn nodes on the Base tile's edge after round N, or a round cap in the score. Structural: no card, Skill, elite, or structure fixes it. | (none) | proposed 2026-10-05 (structural; plan-a-phase) |
| 64 | Core loop v2 | Difficulty is a function of map state, not time: spawns per Combat equal revealed spawn nodes (0 to 13 with 8 tiles), chosen by the players. How does pressure ramp with the round? | **None yet.** Candidates: spawn count per node tied to the round, or a reveal schedule. Structural. | (none) | proposed 2026-10-05 (structural; plan-a-phase) |
| 65 | 7.8 step 8, core loop v2 | Exchange count is coupled to deck size: deck 10 with hand 3 gives 4 exchanges per Combat (deck 6 gave 2), and enemies attack once per exchange. One adjacent grunt deals 8 per round against 15 health, and every bought card adds an exchange. Phase 20 batch: median end round 5, 199 of 200 runs end by player death. Intended? | **Open.** Candidates: enemies attack once per Combat, or once per N exchanges, or a fixed exchange count. Structural. | `combat.exchangeRange`, deck preset | proposed 2026-10-05 (structural; plan-a-phase) |
| 66 | Core loop v2 | A tile revealed in Prepare spawns at that same round's Combat, and players do not move in Combat. The explorer ends Prepare on a fresh tile and is pinned next to new spawns for every exchange. Is that the intended cost of exploring? | **Open.** Candidates: new tiles spawn one round later, or players may step once at Combat start. Structural (ordering). | (none) | proposed 2026-10-05 (structural; plan-a-phase) |
| 67 | 6.7, Table 6, core loop v2 | Materials are a fixed budget: 10 single-use nodes give 20 materials per run with starter Gather, and the 6 upgrades cost 33. In 4-player, 2.5 nodes each is below Shop I. Spent nodes leave 4 of 10 starter cards dead in Prepare, and the 10-card minimum forbids thinning them. | **Open.** Candidates: nodes recharge every N rounds, more tiles, Gather off a node for 1, or the minimum deck excluding Gather. Tiles raise the cap; cards and Skills cannot. | `deck.minimumSize`, `rulings.gatherNeedsNode`, `tiles.json` | proposed 2026-10-05 (structural; plan-a-phase) |
| 68 | 16, core loop v2 | Co-op does not scale pressure: spawns per node are fixed per Combat regardless of seats, player damage scales with seats, and materials per player fall with seats (row 67). | **Open.** Candidates: spawns per node equal to the seat count, or a seat-count tile deck. Structural. | (none) | proposed 2026-10-05 (structural; plan-a-phase) |
| 69 | 9.3, core loop v2 | Structure-first targeting makes the Base tile a safe firing position: enemies next to the base target the base, not the player beside them, and a player on the Base tile can never be 2 hexes nearer than a structure (row 56). The player hits them every exchange and is never attacked. Turtling plus row 63 is the dominant line. | **Open; not yet measured** (the bot does not turtle). Candidates: enemies next to a player attack that player too, or the pull distance is 0 on the Base tile. Structural. | `rulings.playerPullDistance` | proposed 2026-10-05 (structural; plan-a-phase) |
| 70 | Core loop v2, physical edition | Table upkeep per Combat: up to 13 placements, each with spill-over to the nearest empty hex and a nearest-grunt promotion at the 20 cap, every round. | **Open.** Candidates: spawn every other round, or spawn only on nodes within N hexes of a player or structure. Structural. | `miniatureLimit` | proposed 2026-10-05 (structural; plan-a-phase) |

## Structural questions (rows 63-70)

Rows 63-70 are issues in the round sequence, the economy, or the
scoring rule that no new card, Skill, elite, or structure can fix.
They need a design answer before phase 21 locks enemies and Combat.
**Next step: run `/plan-a-phase` on phase 21 to answer rows 63-70**
(or split a phase for them); do not ship phase 21 around them.

## Spec amendments owed

Rows marked `decided` change or extend the Issue 005 text.
The designer owns `spec/`; fold these into the next issue of
the rules (and the Claude design doc) so the spec and the
engine agree: 1, 2, 3, 5, 6, 8, 9, 10, 11, and the new
structure-damage rule for 7.

## Spec v2 changes decided 2026-10-04

The designer settled these in a review on 2026-10-04. They change the
Issue 005/006 text; the engine follows them in phase 20 and the
designer folds them into the next rules issue:

- Rule 17: "Reveal 10 tiles" becomes "Reveal 7 tiles" (row 4).
- Rules 3.8, 4.6, 6.8, 9.3-9.5: the base is the whole 7-hex Base tile (row 16).
- Rule 2.2 / Table 8: 2 copies of each supply card (row 18).
- Table 8 (Haul): "Gather +2" means 2 materials in total (row 20).
- Rules 6.9, 6.15: the step into an enemy's hex costs 1 (rows 26, 28).
- Rules 2.2, 10.5: a blocked elite promotes the grunt nearest the base (row 32).
- Rule 12.3: the players choose between equally near enemies (row 35).
- Rule 9.2: a spawn node refills whenever its hex is empty (row 36).
- Rule 18.1: automatic exploration lets the player choose the slot (row 37).
- Rules 8.2, 12.3: a Tower's defeat pays currency to its builder (rows 40, 53).

Still to design (pending-spec): the elite structure-damage rule (row 7),
per-card heal targets (row 12), the experience curve (row 17, after the
phase 21 experiments), upgraded Skill tiers and Skill caps (rows 9, 46,
50), and Build versus Repair (rows 30, 49).

## Physical edition constraint (standing)

The designer intends a physical board game. Every reading
above must be trackable with miniatures, tokens, and printed
boards: no hidden counters, no fractional values, no
unlimited piles on one hex. See `plan/bearings.md`.
