import {
  applyAction,
  hexKey,
  legalActions,
  type Action,
  type ActionType,
  type GameState,
} from '@survival/engine'

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
 * The placements that put every chosen die on 1 Skill, in order: each step is a legal
 * `assignDie` of the state the steps before it leave, so the engine still decides every
 * placement (a Skill that fills fires at once in Combat v3, so later dice cannot follow it).
 * Null when the dice do not all fit that Skill together.
 *
 * @param state - the state with the exchange in its assign step.
 * @param skill - the Skill id.
 * @param dice - the chosen dice (indexes), placed in this order.
 */
export function planPlacement(
  state: GameState,
  skill: string,
  dice: readonly number[],
): Of<'assignDie'>[] | null {
  if (dice.length === 0) return null
  const place = (s: GameState, left: readonly number[]): Of<'assignDie'>[] | null => {
    const [die, ...rest] = left
    if (die === undefined) return []
    for (const a of ofType(legalActions(s), 'assignDie')) {
      if (a.die !== die || a.skill !== skill) continue
      const after = place(applyAction(s, a).state, rest)
      if (after) return [a, ...after]
    }
    return null
  }
  return place(state, dice)
}

/**
 * True when dice are chosen and they fit no Skill of the current player together (no
 * `planPlacement` for any of them), so the board can say why no Skill takes them.
 *
 * @param state - the state with the exchange in its assign step.
 * @param dice - the chosen dice (indexes).
 */
export function fitsNoSkill(state: GameState, dice: readonly number[]): boolean {
  if (dice.length === 0) return false
  const skills = state.players[state.current]?.skills ?? []
  return skills.every((id) => planPlacement(state, id, dice) === null)
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
