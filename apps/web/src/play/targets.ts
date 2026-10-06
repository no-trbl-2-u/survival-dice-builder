import { hexKey, type Action, type ActionType } from '@survival/engine'

type Of<T extends ActionType> = Extract<Action, { type: T }>

/** The legal actions of 1 type. */
export function ofType<T extends ActionType>(legal: readonly Action[], type: T): Of<T>[] {
  return legal.filter((a): a is Of<T> => a.type === type)
}

/** The first legal action of a type, if any. */
export function firstOf<T extends ActionType>(
  legal: readonly Action[],
  type: T,
): Of<T> | undefined {
  return ofType(legal, type)[0]
}

/** The map actions that point at 1 hex: a start hex, a step, or the defenses buildable there. */
export type HexTarget = Readonly<{
  key: string
  q: number
  r: number
  start?: Of<'placeFigure'>
  move?: Of<'moveTo'>
  builds: readonly Of<'build'>[]
}>

/** Groups the legal map actions by hex (`q,r`). */
export function hexTargets(legal: readonly Action[]): Map<string, HexTarget> {
  const out = new Map<string, HexTarget>()
  const at = (q: number, r: number): HexTarget => {
    const key = hexKey({ q, r })
    return out.get(key) ?? { key, q, r, builds: [] }
  }
  for (const a of legal) {
    if (a.type === 'moveTo') out.set(hexKey(a), { ...at(a.q, a.r), move: a })
    if (a.type === 'placeFigure') out.set(hexKey(a), { ...at(a.q, a.r), start: a })
    if (a.type === 'build') {
      const t = at(a.q, a.r)
      out.set(t.key, { ...t, builds: [...t.builds, a] })
    }
  }
  return out
}

/** The legal placements of 1 die (for highlighting the Skill slots it fits). */
export function placementsFor(legal: readonly Action[], die: number): Of<'assignDie'>[] {
  return ofType(legal, 'assignDie').filter((a) => a.die === die)
}

/**
 * The action types that have a dedicated control on /play; map targets and the next-step
 * banner (`bannerActions`) cover the rest.
 */
export const COVERED: ReadonlySet<ActionType> = new Set<ActionType>([
  'playCard',
  'discardCard',
  'toggleKeep',
  'roll',
  'stopRolling',
  'rerollDie',
  'endReroll',
  'assignDie',
  'unassignDie',
  'confirmAssignment',
  'buyCard',
  'buyUpgrade',
  'draftSkill',
  'replaceSkill',
  'returnStarter',
  'playOption',
  'engage',
  'resolveSkill',
])
