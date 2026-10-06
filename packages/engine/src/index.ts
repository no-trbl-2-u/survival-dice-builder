/**
 * @survival/engine — the pure rules engine. The public surface is the 5 API functions plus the
 * types they use; everything else is internal.
 */
export type { Action, ActionType } from './api/actions.ts'
export { sameAction } from './api/actions.ts'
export { applyAction } from './api/applyAction.ts'
export { createGame, type GameSetup } from './api/createGame.ts'
export { legalActions } from './api/legalActions.ts'
export { deserialize, serialize } from './api/serialize.ts'
export type { GameEvent, GameEventType } from './events/events.ts'
export type { Axial } from './hex.ts'
export { AXIAL_DIRECTIONS, hexDistance, hexKey, hexNeighbors, tileHexes } from './hex.ts'
export { experienceForLevel, levelForExperience } from './progression/levels.ts'
export { canFire } from './skills/canFire.ts'
export { enemiesInRange } from './combat/resolve.ts'
export type {
  Assignment,
  CardInstance,
  Die,
  Enemy,
  Exchange,
  GameState,
  Orientation,
  Phase,
  Player,
} from './state/types.ts'
export { DIE_FACES } from './dice/dice.ts'
