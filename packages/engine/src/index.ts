/**
 * @survival/engine — the pure rules engine. Phase 2 ships only hex geometry; phase 5 adds the
 * engine API (`createGame`, `legalActions`, `applyAction`, `serialize`, `deserialize`).
 */
export type { Axial } from './hex.ts'
export { AXIAL_DIRECTIONS, hexDistance, hexKey, hexNeighbors, tileHexes } from './hex.ts'
