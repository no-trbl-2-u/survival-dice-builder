# @survival/engine

**Purpose:** the pure rules engine for Spec v1. Pure functions over plain data: no classes, no
mutation of inputs, no I/O, no `Date` or `Math.random` (enforced by ESLint). Every export has
TSDoc naming its rule section (`@rule`).

**Public API (phase 2):** `Axial`, `AXIAL_DIRECTIONS`, `hexKey`, `hexNeighbors`, `hexDistance`,
`tileHexes`. Phase 5 adds `createGame`, `legalActions`, `applyAction`, `serialize`,
`deserialize` (see `plan/bearings.md`, "Engine API contract").

**Tests:** `src/*.test.ts` (unit, names start with the rule id), `src/*.property.test.ts`
(fast-check). Run with `pnpm test:run` from the repo root.
