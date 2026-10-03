# Rules coverage

Every rule in `spec/01-spec-v1-rules.md` maps to at least one function and one test.
A rule implemented without a row here is a failed review (`rules-lawyer`).

| Rule | Function(s) | Test(s) |
|---|---|---|
| 3.1 | `packages/engine/src/hex.ts` `hexNeighbors`, `tileHexes` | `packages/engine/src/hex.test.ts` "3.1 neighbours of the origin...", "3.1 a map tile has 7 hexes..."; `apps/web/src/map/HexTile.test.tsx` "3.1 renders exactly 7 hex polygons" |
