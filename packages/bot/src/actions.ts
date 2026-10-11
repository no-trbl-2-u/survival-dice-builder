import type { Action } from '@survival/engine'

/** One action type, narrowed. */
export type Of<T extends Action['type']> = Extract<Action, { type: T }>

/** The actions of one type, in `legalActions` order. */
export const ofType = <T extends Action['type']>(actions: readonly Action[], type: T): Of<T>[] =>
  actions.filter((a): a is Of<T> => a.type === type)
