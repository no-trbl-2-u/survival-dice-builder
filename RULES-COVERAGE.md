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
| 4.1-4.11 | `api/createGame.ts` `createGame` | `test/api.test.ts` "4 same config and seed...", "4.5-4.11 ...", "4.4 [006] ..." |
| 5.1, 5.4 | `phases/advance.ts` `advance`; `deck/deck.ts` `ownedCards` | `test/api.test.ts` "5.1, 10.6-10.9 ..."; `test/properties.test.ts` "5.4 owned cards are conserved" |
| 6.1-6.6 | `deck/deck.ts` `drawHand`, `discardFromHand`; `phases/advance.ts` `prepareStep` | `deck/deck.test.ts` "6.1 ...", "6.5 ...", "6.3 ..."; `test/api.test.ts` "6.2-6.4 ...", "6.6, 7.1-7.2 ..." |
| 6.2 [006] | `api/legalActions.ts` (`discardCard` when `rulings.mandatoryPlays` is false) | `test/api.test.ts` "6.2 [006] a card may be discarded unplayed", "6.2 discarding is not offered when plays are mandatory" |
| 6.7 (Rest) | `combat/cardEffects.ts` `applyTopEffect`, `healCurrent` | `test/api.test.ts` "6.7 Rest heals, never above maximum health" |
| 7.1, 7.2 | `deck/deck.ts` `rotateDeck`; `phases/advance.ts` `startCombat` | `deck/deck.test.ts` "7.1-7.2 ..."; `test/api.test.ts` "6.6, 7.1-7.2 ..." |
| 7.7, 7.8 steps 1-4 | `phases/advance.ts` `combatStep`, `rollAgain`; `dice/dice.ts` `rollDice`, `rerollUnkept`, `toggleKeep` | `test/api.test.ts` "7.8 steps 1-2 ...", "7.8 step 4 ...", "7.8 step 3 ..."; `dice/dice.test.ts` |
| 7.8 step 5 | `combat/cardEffects.ts` `applyBottomEffect`; `dice/dice.ts` `rerollOne` | `test/api.test.ts` "7.8 step 5 a +damage card..."; `dice/dice.test.ts` "7.8 step 5 ..." |
| 7.8 steps 6-7 | `skills/assign.ts` `legalPlacements`, `firedUses`; `combat/resolve.ts` `confirmAssignment`, `processQueue`, `chooseTarget` | `skills/assign.test.ts`; `test/api.test.ts` "7.8 step 7 Strike...", "7.8 step 7 a single-target Skill..."; `test/properties.test.ts` "7.8 step 6 a die is never on 2 Skill slots" |
| 7.8 steps 8-10, 9.5, 9.6, Table 4 | `combat/resolve.ts` `finishExchange` | `test/api.test.ts` "9.5 a grunt...", "9.6 an elite rolls 6 dice..." |
| 7.9 | `phases/advance.ts` `combatStep` | `test/api.test.ts` "7.9 with no enemy in range..." |
| 9.1 | `combat/resolve.ts` `damageEnemy` | `test/api.test.ts` "7.8 step 7 Strike ... defeats a grunt" |
| 10.6, 10.7, 10.9 | `deck/deck.ts` `rotateDeck`; `phases/advance.ts` `exploreStep` | `deck/deck.test.ts` "10.6 ..."; `test/api.test.ts` "5.1, 10.6-10.9 ..." |
| 14.2 | `combat/resolve.ts` `finishExchange` | `test/api.test.ts` "14.2 the run ends..." |
| 18.1 (Skill uses) | `skills/assign.ts` `openUses` | `skills/assign.test.ts` "18.1 unlimited Skill uses..." |
| 2.1 (max health) | `combat/cardEffects.ts` `healCurrent` | `test/properties.test.ts` "2.1 health never exceeds maximum" |
