import type { SkillFace } from '@survival/content'

/**
 * A player decision. Each action is one atomic choice (bearings: step-by-step decisions);
 * `legalActions` never lists combinations.
 *
 * @rule 6.2, 7.8
 */
export type Action = Readonly<
  | { type: 'playCard'; card: string }
  | { type: 'discardCard'; card: string }
  | { type: 'toggleKeep'; die: number }
  | { type: 'roll' }
  | { type: 'stopRolling' }
  | { type: 'rerollDie'; die: number }
  | { type: 'endReroll' }
  | { type: 'assignDie'; die: number; skill: string; use: number; slot: number; asFace: SkillFace }
  | { type: 'unassignDie'; die: number }
  | { type: 'confirmAssignment' }
  | { type: 'chooseTarget'; enemy: string }
>

/** Action type names. */
export type ActionType = Action['type']

/** True when two actions are the same choice. */
export function sameAction(a: Action, b: Action): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Builds the error thrown when `applyAction` gets an action that is not legal now. The UI only
 * offers legal actions, so this signals a bug, not a game situation.
 *
 * @param action - the rejected action.
 * @param reason - why it is not legal.
 */
export function illegalAction(action: Action, reason: string): Error {
  const error = new Error(`Illegal action ${JSON.stringify(action)}: ${reason}`)
  error.name = 'IllegalActionError'
  return error
}
