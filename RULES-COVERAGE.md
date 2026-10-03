# Rules coverage

Every rule in `spec/01-spec-v1-rules.md` maps to at least one function and one test.
A rule implemented without a row here is a failed review (`rules-lawyer`).

| Rule | Function(s) | Test(s) |
|---|---|---|
| 3.1 | `packages/engine/src/hex.ts` `hexNeighbors`, `tileHexes` | `packages/engine/src/hex.test.ts` "3.1 neighbours of the origin...", "3.1 a map tile has 7 hexes..."; `apps/web/src/map/HexTile.test.tsx` "3.1 renders exactly 7 hex polygons" |
| 2.2, 4.2-4.3 [006] | `packages/content/data/tiles.json`, `config.default.json` `tiles` | `packages/content/src/load.test.ts` "2.2 [006]: 9 tiles..." |
| 2.3-2.5 | `packages/content/src/schemas/primitives.ts` `FaceSchema`, `SkillFaceSchema` | `load.test.ts` "an unknown die face is rejected" |
| 3.3-3.6, Table 1 | `schemas/tiles.ts` `TileDefSchema` | `schemas/tiles.test.ts` (8 tests) |
| 8.3, 8.5, 18.1 (max level) | `packages/engine/src/progression/levels.ts` `experienceForLevel`, `levelForExperience` | `progression/levels.test.ts` "8.5 ...", "8.3 ...", "18.1 ...", "spec 1: changing a number..." |
| 11.4, Table 6 | `schemas/structures.ts` `UpgradesFileSchema`, `data/upgrades.json` | `load.test.ts` "a missing upgrade tier is rejected" |
| Table 2 | `data/cards.json` (starter), `config.default.json` `deck.presets` | `load.test.ts` "Table 2: the default starter deck..." |
| Tables 3, 9 | `data/skills.json` | `load.test.ts` "Tables 3 and 9..." |
| Table 4 | `data/enemies.json` `enemyDieDamage` | `load.test.ts` "Table 4..." |
| Table 8 | `data/cards.json` (supply) | `load.test.ts` "Table 8..." |
| Tables 5, 7 | `data/enemies.json`, `data/defenses.json` | schema validation only; behaviour tests in phases 6-7 |
| 2.4, 2.5 | `skills/canFire.ts` `canFire`; `skills/assign.ts` `legalPlacements` | `skills/canFire.test.ts` (incl. exhaustive-search property), `skills/assign.test.ts` "2.4 ...", "2.5 ..." |
| 4.1-4.11 | `api/createGame.ts` `createGame` | `test/api.test.ts` "4 same config and seed...", "4.1-4.2 [006] ...", "4.3 [006] ...", "4.5-4.11 ...", "4.4 [006] ..." |
| 3.1, 4.2, 10.1 (tile slots) | `map/tiles.ts` `TILE_SLOT_OFFSETS`, `placeTile`, `emptySlots`; `api/applyAction.ts` `placeTile` | `map/tiles.test.ts`; `test/world.test.ts` "4.2 the setup tile goes in the chosen slot..." |
| 3.4, 3.7, 3.8 | `map/tiles.ts` `isPassable`; `movement/move.ts` `blockedByFigure`, `enemyAt` | `test/world.test.ts` "3.4 lake and mountain hexes..."; `test/properties.test.ts` "3.4, 3.7 no figure stands on an impassable..." (3.8 needs 2 players: phase 12) |
| 4.4, 9.8 [006] | `map/spawn.ts` `placeTileAndSpawn`, `spawnEnemy`, `spawnHex` | `test/api.test.ts` "4.4 [006] ..."; `test/world.test.ts` "9.8 [006] a spawn on a taken hex spills..." |
| 6.7 (Move), 6.9, 6.15, Table 8 (Blink) | `movement/move.ts` `moveCost`, `legalMoves`; `api/applyAction.ts` `moveTo` | `test/world.test.ts` "6.7 a Move card...", "6.7 moving stops...", "6.7 the player may stop...", "6.9 a hex next to an enemy costs 2", "Table 8 a card that ignores..." |
| 6.10-6.15 | `movement/skirmish.ts` `startSkirmish`; `combat/resolve.ts` `enemiesInRange`, `finishSkirmish` | `test/world.test.ts` "6.10-6.11 ...", "6.13 ...", "6.12, 6.14 [006] ...", "6.11 only the enemy in the entered hex..." |
| 6.7 (Gather), Table 1 | `gather/gather.ts` `gather` | `test/world.test.ts` "6.7 Gather on a gathering node...", "6.7 Gather off a node..." |
| 12.1, 12.2, Table 7, Table 8 (Build cards) | `build/defenses.ts` `legalBuilds`, `canBuildOn`, `buildCost`, `buildDefense` | `test/world.test.ts` "12.1 ...", "12.2 ...", "Table 8 a cost reduction...", "Table 8 Architect builds twice"; `test/properties.test.ts` "12.1 materials never go below 0" |
| 12.4 | `build/defenses.ts` `damageDefense` | `test/enemies.test.ts` "12.4 a defense at 0 health is removed" |
| 7.3, 9.2, Table 1 | `enemies/spawning.ts` `spawnNodes`, `refillNodes`; `combat/resolve.ts` `damageEnemy` (`vacantNodes`) | `test/enemies.test.ts` "7.3, 9.2 a spawn node refills only...", "7.3 row 21 an elite spawn node refills..." |
| 7.4, 10.4 | `enemies/spawning.ts` `waveStep`; `phases/advance.ts` `startCombat` | `test/enemies.test.ts` "10.4 the wave step puts 1 grunt per spawn node..." |
| 2.2, 10.5, 15 | `map/spawn.ts` `spawnEnemy`, `miniatureCount`, `replaceGruntWithElite` | `test/enemies.test.ts` "2.2, 10.5 at the miniature limit a new grunt...", "2.2 row 32 ... a new elite is not placed"; `test/properties.test.ts` "2.2, 10.5 enemy miniatures never exceed..." |
| 7.5, 9.3, 9.4, 9.7 | `enemies/targets.ts` `rankTargets`; `enemies/pathing.ts` `pathNextTo`; `enemies/movement.ts` `chooseRoute`, `moveEnemies` | `test/enemies.test.ts` "9.3 ...", "7.5 ...", "9.4 ..." (3), "9.7 ..." (3), "3.4, 9.4 an enemy never steps onto..."; `test/properties.test.ts` "3.4, 9.4, 12 no enemy stands on..." |
| 7.6, 12.3 | `enemies/structures.ts` `towerAttacks` | `test/enemies.test.ts` "12.3 a Tower gives 2 damage...", "12.3 a Tower with no enemy..." |
| 7.10-7.12, 14.1 | `enemies/structures.ts` `structureAttacks`, `damageBase`; `combat/resolve.ts` `rollEnemyDamage` | `test/enemies.test.ts` "7.12 ...", "7.11 ...", "14.1 ...", "7.11 row 7 ... grunt-die"; `test/golden.test.ts` p7-full-run.json (ends on 14.1) |
| 10.1-10.3, 15.2, 18.1 (exploration) | `explore/explore.ts` `startExplore`, `revealTop`; `api/legalActions.ts`, `api/applyAction.ts` (`placeTile`, `revealTile`, `skipReveal`) | `test/enemies.test.ts` "10.1 forced ...", "10.2 ...", "18.1 automatic ...", "18.1 optional ...", "10.3, 15.2 ..." |
| 6.7, 11.2 (Build on base) | `combat/cardEffects.ts` `applyTopEffect`; `api/legalActions.ts` (upgrades on the base hex) | `test/world.test.ts` "6.7, 11.2 Build on the base hex offers base upgrades..." |
| 8.1-8.5, 16.2, Table 5 | `progression/experience.ts` `gainForDefeat`; `combat/resolve.ts` `damageEnemy` | `test/progression.test.ts` "8.1-8.2 ...", "8.2 row 40 ...", "8.3-8.5 ...", "Table 5 ..."; `test/properties.test.ts` "12.1, 8.2, 8.3 ..." |
| 18.1 (max level) | `progression/levels.ts` `levelForExperience` | `test/progression.test.ts` "18.1 a maximum level stops the level and the dice" |
| 4.12 | `progression/supplies.ts` `buildSupplies` | `test/progression.test.ts` "4.12 each level has its own shuffled card and Skill supply" |
| 11.1-11.4, Table 6 | `progression/upgrades.ts` `legalUpgrades`, `buyUpgrade` | `test/progression.test.ts` "11.2, 11.4 ...", "11.3, 11.5 Shop I ...", "11.4 tier II ...", "Table 8 row 42 Mason ...", "Table 8 Architect buys 2 upgrades" |
| 6.8, 11.5, 13.1 | `progression/shop.ts` `legalBuys`, `buyCard`, `refillOffers`; `progression/supplies.ts` `openLevel`, `drawLevel` | `test/progression.test.ts` "6.8 [006] ...", "6.8 not off the base...", "13.1, 11.5 ...", "11.5 with Shop II...", "11.5 row 41 ..." |
| 18.1 (bought cards) | `progression/shop.ts` `returnableStarters`, `returnStarter` | `test/progression.test.ts` "18.1 replace-starter ..." |
| 10.8, 11.6-11.9 | `progression/draft.ts` `draftDue`, `startDraft`, `keepSkill`, `replaceSkill`; `phases/advance.ts` `exploreStep` | `test/progression.test.ts` "10.8 ...", "11.6-11.7 ...", "11.8 ...", "11.9 [006] ...", "11.9 with fullBoardDraft skip ..." |
| 10.10, 14.3, 17 | `progression/milestones.ts` `reachedMilestones`, `checkMilestones`; `phases/advance.ts` | `test/progression.test.ts` "17 each milestone is recorded once", "14.3 ...", "10.10 ..."; `test/golden.test.ts` p8-builder-run.json |
| 5.1, 5.4 | `phases/advance.ts` `advance`; `deck/deck.ts` `ownedCards` | `test/api.test.ts` "5.1, 10.6-10.9 ..."; `test/properties.test.ts` "5.4 owned cards are conserved" |
| 6.1-6.6 | `deck/deck.ts` `drawHand`, `discardFromHand`; `phases/advance.ts` `prepareStep` | `deck/deck.test.ts` "6.1 ...", "6.5 ...", "6.3 ..."; `test/api.test.ts` "6.2-6.4 ...", "6.6, 7.1-7.2 ..." |
| 6.2 [006] | `api/legalActions.ts` (`discardCard` when `rulings.mandatoryPlays` is false) | `test/api.test.ts` "6.2 [006] a card may be discarded unplayed", "6.2 discarding is not offered when plays are mandatory" |
| 6.7 (Rest) | `combat/cardEffects.ts` `applyTopEffect`, `healCurrent` | `test/api.test.ts` "6.7 Rest heals, never above maximum health" |
| 7.1, 7.2 | `deck/deck.ts` `rotateDeck`; `phases/advance.ts` `startCombat` | `deck/deck.test.ts` "7.1-7.2 ..."; `test/api.test.ts` "6.6, 7.1-7.2 ..." |
| 7.7, 7.8 steps 1-4 | `phases/advance.ts` `combatStep`, `rollAgain`; `dice/dice.ts` `rollDice`, `rerollUnkept`, `toggleKeep` | `test/api.test.ts` "7.8 steps 1-2 ...", "7.8 step 4 ...", "7.8 step 3 ..."; `dice/dice.test.ts` |
| 7.8 step 5 | `combat/cardEffects.ts` `applyBottomEffect`; `dice/dice.ts` `rerollOne` | `test/api.test.ts` "7.8 step 5 a +damage card..."; `dice/dice.test.ts` "7.8 step 5 ..." |
| 7.8 steps 6-7 | `skills/assign.ts` `legalPlacements`, `firedUses`; `combat/resolve.ts` `confirmAssignment`, `processQueue`, `chooseTarget` | `skills/assign.test.ts`; `test/api.test.ts` "7.8 step 7 Strike...", "7.8 step 7 a single-target Skill..."; `test/properties.test.ts` "7.8 step 6 a die is never on 2 Skill slots" |
| 7.8 steps 8-10, 9.5, 9.6, Table 4 | `combat/resolve.ts` `finishExchange`, `enemyAttacks` | `test/api.test.ts` "9.5 a grunt...", "9.6 an elite rolls 6 dice..."; `test/world.test.ts` "7.8 step 8 only enemies next to the player attack" |
| 7.8 step 7 (range) | `combat/resolve.ts` `enemiesInRange`, `pendingTargets` | `test/world.test.ts` "7.8 step 7 a Skill only hits enemies within its range" |
| 7.9 | `phases/advance.ts` `combatStep` | `test/api.test.ts` "7.9 with no enemy in range..."; `test/world.test.ts` "7.9 an exchange is skipped when no enemy is within exchange range" |
| 9.1 | `combat/resolve.ts` `damageEnemy` | `test/api.test.ts` "7.8 step 7 Strike ... defeats a grunt" |
| 10.6, 10.7, 10.9 | `deck/deck.ts` `rotateDeck`; `phases/advance.ts` `exploreStep` | `deck/deck.test.ts` "10.6 ..."; `test/api.test.ts` "5.1, 10.6-10.9 ..." |
| 14.2 | `combat/resolve.ts` `finishExchange`, `finishSkirmish` | `test/api.test.ts` "14.2 the run ends..." |
| 18.1 (Skill uses) | `skills/assign.ts` `openUses` | `skills/assign.test.ts` "18.1 unlimited Skill uses..." |
| 2.1 (max health) | `combat/cardEffects.ts` `healCurrent` | `test/properties.test.ts` "2.1 health never exceeds maximum" |
| 16.1, 4.6 (co-op setup) | `api/createGame.ts` `createGame` (`setup.players`) | `test/coop.test.ts` "16.1 each player has an own shuffled deck...", "rejects a player count...", "a solo run is the same as before co-op" |
| 16.8, row 6 | `phases/advance.ts` `prepareStep`, `nextSeat` | `test/coop.test.ts` "16.8 row 6 Prepare: players alternate hands...", "16.8 full-turn ..." |
| 16.4, 16.5 | `phases/advance.ts` `combatStep`, `nextSeat`; `combat/resolve.ts` `finishExchange` | `test/coop.test.ts` "16.4 Combat: exchanges go in seat order", "16.5 in an exchange only enemies next to that player attack..." |
| 16.6, 10.3 (co-op) | `phases/advance.ts` `exploreStep` (`revealsLeft`) | `test/coop.test.ts` "16.6 each player reveals and places 1 tile, in seat order" |
| 10.8, 11.6 (co-op) | `progression/draft.ts` `draftDue`, `startDraft` (`draftedPlayers`) | `test/coop.test.ts` "10.8, 11.6 each player drafts in seat order" |
| 16.2, 16.7 | `progression/experience.ts` `gainForDefeat`; `combat/resolve.ts` `checkPlayerDown` | `test/progression.test.ts` "8.3-8.5 ..."; `test/coop.test.ts` "a 3-player run plays to the end" |
