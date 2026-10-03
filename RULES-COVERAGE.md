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
