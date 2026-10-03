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
| 3 | 4.2–4.3 | Tile count and setup. | **9 tiles:** Broken Village (base), 3 countryside, 5 core. Setup: base + 1 countryside tile. Deck: 2 countryside on top of 5 core (7 tiles). Solo waves start in round 8. | `tiles.setupCountryside: 1`, `tiles.countryside: 3`, `tiles.core: 5` | decided 2026-10-02 |
| 4 | 17 | "Reveal 10 tiles" is unreachable with 8 non-base tiles. | Milestone kept as written and never fires. Designer to pick a new number (reveal 8? reveal all?). | `milestones.revealTiles: 10` | proposed |
| 5 | 10.1 | Where can a revealed tile go? | Any empty slot adjacent to an existing tile where the 7-hex shapes tessellate; **fixed rotation**; the player picks the slot. | `tileRotation: false` | decided 2026-10-02 |
| 6 | 16 | Co-op Prepare order (16.4 covers Combat only). | Players **alternate hands of 3** in seat order until every deck is empty. | `coopPrepareOrder: "alternate-hands"` | decided 2026-10-02 |
| 7 | 7.11, 9.5 | Enemy damage to structures. | Designer intends: **1 die (Table 4) per grunt; elites get special rules** (unwritten). Until the spec carries that text the engine uses the v1 reading: grunt 2 fixed, elite 6 dice. | `structureDamage: "v1"` (future `"grunt-die"`) | pending-spec |
| 8 | 6.10–6.13 | Skirmish that does not clear the hex. | Figure **stays on the hex it came from**; the rest of the Move is lost. Entering costs movement as normal, including the 6.9 surcharge, and needs the full cost available. | `skirmishFail: "stay-lose-move"` | decided 2026-10-02 |
| 9 | 2.1 | Skill capacity. | The 4 starter Skills are fixed. **At most 6 drafted Skills.** When full, a draft may replace one drafted Skill (proposed reading of "at most"). | `draftSlots: 6`, `fullBoardDraft: "swap"` | decided 2026-10-02 (swap detail: proposed) |
| 10 | 6.2, 7.8 step 5 | Must every card be played (Prepare top halves and Combat bottom halves)? | **A card may be discarded unplayed.** Played effects resolve as written. | `mandatoryPlays: false` | decided 2026-10-02 |
| 11 | 6.8, 11.5 | Shop timing and refill. | **Buy at any time in any phase while the figure is on the base.** Offers are shared; a bought card is **replaced immediately** so 3 offers are always shown. Assumption to confirm: the on-base requirement from 6.8 still holds. | `shopTiming: "any-time-on-base"`, `shopRefill: "immediate"` | decided 2026-10-02 (on-base assumption: proposed) |
| 12 | Table 3, 6.7 | Heal targets in co-op (Mend, Rest, Renewal, Purify). | **Self only** for v1. | `healTargets: "self"` | proposed |
| 13 | 10.5 | Which grunt becomes the elite? | The grunt **nearest the base** (ties: the oldest grunt; spawn nodes carry no printed id). The elite keeps the grunt's hex and spawn node. | `eliteReplacement: "nearest-base"` | proposed |
| 14 | Brief | Defense on a gathering node hex. | **Allowed**; the node still works. | `buildOnNode: true` | decided (brief) |
| 15 | 9.3 | Enemy target tie-break. | Player, then Tower, then Barricade, then base; then lowest health. | `targetTieBreak` | decided (brief) |
| 16 | 3.8, 4.6 | Issue 006 rule 3.8 (1 figure per hex) conflicts with 4.6 (every figure starts on the base) in co-op. | The **base hex is exempt** from the 1-figure limit. | `rulings.baseHexFigureLimitExempt: true` | proposed (phase 4) |
| 17 | 8.5 | "Each next level needs 5 more than the last step." | Steps grow by 5: 5, 10, 15 ... so level 2 at 5, level 3 at 15, level 4 at 30, level 5 at 50. | `experience.firstStep: 5`, `experience.stepIncrease: 5` | proposed (phase 4) |
| 18 | 2.2, 4.12, Tables 8-9 | How many copies of each supply card and Skill? The tables list each once. | **1 copy each** (6 Level 1 cards, 4 Level 2, 4 Level 3). | `supplies.copiesPerCard: 1`, `supplies.copiesPerSkill: 1` | proposed (phase 4) |
| 19 | 18.1 | Which cards make the 8-card and 10-card starter decks? | 8 cards: 3 Move, 3 Gather, 1 Build, 1 Rest. 10 cards: 4 Move, 4 Gather, 1 Build, 1 Rest. | `deck.presets` | proposed (phase 4) |
| 20 | 6.7, Table 8 | "Gather +2" (Haul): node amount plus 2, or 2 total? | **Node amount plus the bonus** (a 2-material node gives 4 with Haul). | `PrepareEffect gather.bonus` | proposed (phase 4) |
| 21 | Table 1, 9.2 | The elite spawn node "holds 1 elite": does it refill (9.2) like a spawn node? | **Yes**: an elite spawn node gets a new elite only when its elite is defeated, the same as 9.2. | (engine, phase 7) | proposed (phase 4) |
| 22 | 7.8 step 5, Tables 2, 8 | Where does a card's "+N damage" go? | Added once to the **first damage Skill that fires** this exchange (to each of its targets). Lost if no damage Skill fires. | (engine, `confirmAssignment`) | proposed (phase 5) |
| 23 | 7.8 step 5 | Order of card bottom halves and their reroll effects. | The player plays cards one at a time in any order; a numbered reroll ("Reroll 2 dice") rerolls that many **different** dice, picked one at a time; the player may stop early. "Reroll all" rerolls every die, kept or not. Card rerolls do **not** count toward the 3-roll maximum (7.8 step 4). A Combat draw with fewer than 3 cards left draws them all, as 6.5. | (engine) | proposed (phase 5) |
| 24 | 12.2 | How many defenses may stand on one hex? | **1 per hex** (physical edition: one token fits). | (engine, `canBuildOn`) | proposed (phase 6) |
| 25 | 4.2 [006] | Who chooses where the setup countryside tile goes? | **The player**, from the 6 slots next to the Base tile (the same choice as 10.1 Explore). | (engine, `placeTile`) | proposed (phase 6) |
| 26 | 6.9, 6.15 | What does it cost to enter a hex that holds an enemy? | The same as a hex next to an enemy: **2** (`combat.moveCostNextToEnemy`), unless the card ignores the surcharge (Blink). The full cost is paid before the skirmish. | (engine, `moveCost`) | proposed (phase 6) |
| 27 | 9.8 [006] | What is an "empty" hex for spill-over, and how is "nearest" measured? | **Empty** = passable, not the base hex, and no enemy, figure, or defense. **Nearest** = straight hex distance (ties: nearest the base, then a fixed order). | (engine, `spawnHex`) | proposed (phase 6) |
| 28 | 6.15, Table 8 (Blink) | Does "no extra cost" also apply when entering an enemy's hex? | **Yes**: Blink pays 1 to enter an enemy's hex, then the skirmish starts. | (engine, `moveCost`) | proposed (phase 6) |
| 29 | 3.4, 12 | May a figure enter a Barricade or Tower hex? | **Yes**: defenses block enemies only. | (engine, `legalMoves`) | proposed (phase 6) |
| 30 | 6.7, 12.1 | On the base hex, Build is always a base upgrade (never a defense on an adjacent hex)? | **Yes**: on the base hex Build means a base upgrade (11.2). | (engine, `applyTopEffect`) | proposed (phase 6) |
| 31 | 6.11, Table 9, 8.1 | In a skirmish, does Dodge work, and does a won skirmish give experience and currency? | **Yes to both**: a skirmish uses Skills as an exchange does (Dodge ignores the enemy's 1 attack); defeating the enemy pays as any defeat (from phase 8). | (engine) | proposed (phase 6) |
| 32 | 2.2, 10.5 | What does the miniature limit count, and what happens to an elite over it? | **Every enemy miniature** (grunts and elites, 2.2: 20). A grunt the limit stops turns the grunt nearest the base into an elite (10.5); an elite the limit stops is not placed and its node stays vacant until the next refill. | `miniatureLimit` | proposed (phase 7) |
| 33 | 9.3, 9.4, 12 | May an enemy enter a Tower hex? | **No**: enemies stand only on empty hexes (row 27). A Tower is a target, so enemies stop next to it and attack it in the structure step. | (engine, `enemyCanEnter`) | proposed (phase 7) |
| 34 | 9.3 | "Nearest" for a target: straight distance or walking distance? In what order do enemies move? | **Straight hex distance** ranks targets; the enemy then walks the shortest open path (9.7 when blocked). Enemies move **oldest first**; Towers attack oldest first. | (engine, `rankTargets`, `moveEnemies`) | proposed (phase 7) |
| 35 | 12.3 | Which enemy does a Tower hit when 2 are equally near? | The one with the **lowest health**, then the oldest. | (engine, `towerAttacks`) | proposed (phase 7) |
| 36 | 9.2, 7.3 | Does a spawn node refill when its enemy walked away? | **No**: a node refills only after the enemy it spawned is defeated (9.2), even if the node hex is now empty. Wave grunts belong to no node. An elite that replaced a grunt (10.5) keeps that grunt's node. | (engine, `vacantNodes`, `refillNodes`) | proposed (phase 7) |
| 37 | 18.1 | Automatic exploration: where does the tile go? | In the **empty slot nearest the base** (ties: slot order). | (engine, `startExplore`) | proposed (phase 7) |
| 38 | 7.4, 10.3, 10.4 | When does the wave step happen? | In **Combat** (7.4), at the start of each Combat phase while the wave track is above 0. 10.4 defines the step; it is not repeated in Explore. With the 7-tile deck the track first rises in round 8 Explore, so the first wave arrives in round 9 Combat. | (engine, `startCombat`) | proposed (phase 7) |
| 39 | 9.7 | Which blockers make an enemy switch target? | **Any**: enemies, Barricades, Towers, figures, lake, and mountain. If no open path reaches any target, the enemy waits. | `blockedPathRule` | proposed (phase 7) |
| 40 | 8.2, 12.3 | Who gets the currency when a Tower defeats an enemy? | **Nobody**: the experience goes to the shared track (8.1), but currency needs a player who defeated it (8.2). | (engine, `gainForDefeat`) | proposed (phase 8) |
| 41 | 11.5 | The Shop's highest open level supply is empty. | Draw from the **next lower level** (as 11.8 for the draft); no cards left at any open level: fewer than 3 offers. Shop II and III do not replace offers already shown. | (engine, `refillOffers`) | proposed (phase 8) |
| 42 | 6.7, 11.2, Table 8 | Do Build cost reductions (Mason, Engineer) and Architect's "Build 2 times" apply to base upgrades? | **Yes**: a Build on the base buys upgrades with the same card: the reduction lowers each upgrade's material cost (minimum 0), and Architect buys 2. | (engine, `legalUpgrades`) | proposed (phase 8) |
| 43 | 6.8 | May a player buy at every decision while on the base, including mid-exchange? | **Yes** ("at each moment", 6.8 [006]): buying is offered at every decision while the figure is on the base, except while a draft or a starter return is waiting. | `shopTiming` | proposed (phase 8) |
| 44 | 18.1 | Replace-starter mode: which starter card leaves? | The **player chooses** 1 starter card from the deck or discard pile (not hand or table). No starter there: nothing leaves. | `options.boughtCards` | proposed (phase 8) |
| 45 | 17 | When is "Survive to round N" reached? | When the **round counter reaches N** (10.9), checked at 10.10 and at the end of the run. | (engine, `reachedMilestones`) | proposed (phase 8) |
| 46 | 11.9, row 9 | With full draft slots, must the kept Skill replace a drafted Skill, or may the player decline? | **Must** (11.9 [006]: "the drafted Skill replaces 1 draft Skill"). To decline, set `fullBoardDraft: "skip"`. Row 9's "may" is read as the choice of which Skill. | `fullBoardDraft` | proposed (phase 8) |
| 47 | 8.4 | A level reached mid-exchange: when can the new die be used? | From the **next roll of dice** (the next exchange or skirmish); the dice already rolled stay as they are. | (engine, `player.dice`) | proposed (phase 8) |
| 48 | 17 | Does a Tower's elite defeat count for "Defeat an elite"? | **Yes**: any defeat of an elite counts. | (engine, `progress.elitesDefeated`) | proposed (phase 8) |
| 49 | 11.4, Table 8 | May Architect ("Build 2 times") buy tier I and tier II of a track with one card? | **Yes**: each Build is a separate purchase in sequence (11.4). | (engine, `legalUpgrades`) | proposed (phase 8) |
| 50 | 11.8 | Every open Skill supply is empty at a draft. | **No draft** that round (`draftSkipped` event). | (engine, `startDraft`) | proposed (phase 8) |

## Spec amendments owed

Rows marked `decided` change or extend the Issue 005 text.
The designer owns `spec/`; fold these into the next issue of
the rules (and the Claude design doc) so the spec and the
engine agree: 1, 2, 3, 5, 6, 8, 9, 10, 11, and the new
structure-damage rule for 7.

## Physical edition constraint (standing)

The designer intends a physical board game. Every reading
above must be trackable with miniatures, tokens, and printed
boards: no hidden counters, no fractional values, no
unlimited piles on one hex. See `plan/bearings.md`.
