import { hexDistance, legalActions, type Action, type GameState } from '@survival/engine'
import {
  atGoal,
  cheapestUpgrade,
  enemyOn,
  goal,
  me,
  onBaseTile,
  siteAt,
  spent,
  type BotPolicy,
} from './goals.ts'

type Of<T extends Action['type']> = Extract<Action, { type: T }>

const ofType = <T extends Action['type']>(actions: readonly Action[], type: T): Of<T>[] =>
  actions.filter((a): a is Of<T> => a.type === type)

/** Skill effect order for dice placement: damage first, then guard, heal, and Dodge. */
const EFFECT_ORDER = ['damage', 'guard', 'heal', 'ignoreHit'] as const

/** Bot options: the play style (default: `default`). */
export type BotOptions = Readonly<{ policy?: BotPolicy }>

/**
 * The bot's choice for the current decision: always one of `legalActions(state)`, chosen by
 * fixed priorities (no randomness). Undefined when the run has ended.
 *
 * @param state - any engine state.
 * @param options - `policy: "turtle"` keeps the figure on the Base tile (phase 22 sim option).
 * @returns a legal action, or undefined when there is none.
 */
export function botChoice(state: GameState, options: BotOptions = {}): Action | undefined {
  const policy = options.policy ?? 'default'
  const actions = legalActions(state)
  if (actions.length === 0) return undefined
  return (
    required(state, actions, policy) ??
    ofType(actions, 'buyCard')[0] ??
    building(state, actions) ??
    moving(state, actions, policy) ??
    combat(state, actions) ??
    prepareCard(state, actions, policy) ??
    actions[0]
  )
}

/**
 * The start hex (also when returning from a knockout), Tower ties (the weakest enemy), starter
 * returns, and drafts: decisions that block everything else.
 */
function required(
  state: GameState,
  actions: readonly Action[],
  policy: BotPolicy,
): Action | undefined {
  const starts = ofType(actions, 'placeFigure')
  // The turtle starts on the base hex itself when it is free.
  const start =
    (policy === 'turtle' ? starts.find((a) => a.q === 0 && a.r === 0) : undefined) ?? starts[0]
  if (start) return start
  const health = (id: string) => state.enemies.find((e) => e.id === id)?.health ?? 0
  const shot = [...ofType(actions, 'chooseTowerTarget')].sort(
    (a, b) => health(a.enemy) - health(b.enemy),
  )[0]
  if (shot) return shot
  const returned = ofType(actions, 'returnStarter')[0]
  if (returned) return returned
  const drafts = ofType(actions, 'draftSkill')
  if (drafts.length > 0) {
    const damage = drafts.find(
      (a) => state.content.skills.find((s) => s.id === a.skill)?.effect.kind === 'damage',
    )
    return damage ?? drafts[0]
  }
  return ofType(actions, 'replaceSkill')[0]
}

/** An active Build: the cheapest upgrade on the base, else a Tower or Barricade near an enemy. */
function building(state: GameState, actions: readonly Action[]): Action | undefined {
  if (state.active?.kind !== 'build') return undefined
  const upgrades = ofType(actions, 'buyUpgrade')
  if (upgrades.length > 0) {
    const cost = (id: string) => state.content.upgrades.find((u) => u.id === id)?.cost ?? 0
    return [...upgrades].sort((a, b) => cost(a.upgrade) - cost(b.upgrade))[0]
  }
  const builds = ofType(actions, 'build')
  const towers = builds.filter((b) => b.defense === 'tower')
  const pool = towers.length > 0 ? towers : builds
  const nearEnemy = (b: Of<'build'>) =>
    Math.min(Number.POSITIVE_INFINITY, ...state.enemies.map((e) => hexDistance(e.hex, b)))
  const best = [...pool].sort((a, b) => nearEnemy(a) - nearEnemy(b))[0]
  return best ?? ofType(actions, 'stopBuilding')[0]
}

/**
 * An active Move: step closer to the goal (off the map edge to reveal a tile when the goal is
 * there), never into a skirmish; stop when no step helps. The turtle never steps off the Base
 * tile.
 */
function moving(
  state: GameState,
  actions: readonly Action[],
  policy: BotPolicy,
): Action | undefined {
  if (state.active?.kind !== 'move' || state.exchange) return undefined
  const target = goal(state, policy)
  const here = hexDistance(me(state).hex, target)
  const step = ofType(actions, 'moveTo')
    .filter((m) => !enemyOn(state, m))
    .filter((m) => policy !== 'turtle' || onBaseTile(state, m))
    .filter((m) => hexDistance(m, target) < here)
    .sort((a, b) => hexDistance(a, target) - hexDistance(b, target))[0]
  return step ?? ofType(actions, 'stopMoving')[0]
}

/** Combat and skirmish decisions: keep, roll, play, reroll, place dice, target. */
function combat(state: GameState, actions: readonly Action[]): Action | undefined {
  const exchange = state.exchange
  if (!exchange) return undefined
  switch (exchange.step) {
    case 'roll': {
      const keep = ofType(actions, 'toggleKeep').find((a) => {
        const die = exchange.dice[a.die]
        return die && !die.kept && die.face !== 'Blank'
      })
      if (keep) return keep
      const blank = exchange.dice.some((d) => !d.kept && d.face === 'Blank')
      return (blank ? ofType(actions, 'roll')[0] : undefined) ?? ofType(actions, 'stopRolling')[0]
    }
    case 'cards':
      return ofType(actions, 'playCard')[0]
    case 'reroll':
      return (
        ofType(actions, 'rerollDie').find((a) => exchange.dice[a.die]?.face === 'Blank') ??
        ofType(actions, 'endReroll')[0]
      )
    case 'assign': {
      const rank = (a: Of<'assignDie'>) => {
        const kind = state.content.skills.find((s) => s.id === a.skill)?.effect.kind ?? 'damage'
        return EFFECT_ORDER.indexOf(kind)
      }
      const place = [...ofType(actions, 'assignDie')].sort((a, b) => rank(a) - rank(b))[0]
      return place ?? ofType(actions, 'confirmAssignment')[0]
    }
    case 'targets': {
      const health = (id: string) => state.enemies.find((e) => e.id === id)?.health ?? 0
      return [...ofType(actions, 'chooseTarget')].sort(
        (a, b) => health(a.enemy) - health(b.enemy),
      )[0]
    }
  }
}

/**
 * A Prepare card: Build on the base when an upgrade is affordable (or off the base when every
 * upgrade is bought), Gather on an unspent gathering node (or anywhere when `gather.offNodeAmount`
 * gives materials, row 67), Rest when hurt, Move when away from the goal.
 * A card with no use is discarded (when discarding is allowed).
 */
function prepareCard(
  state: GameState,
  actions: readonly Action[],
  policy: BotPolicy,
): Action | undefined {
  const plays = ofType(actions, 'playCard')
  if (plays.length === 0) return undefined
  const player = me(state)
  const onBase = onBaseTile(state, player.hex)
  const topOf = (card: string) => {
    const def = player.hand.find((c) => c.id === card)?.def
    return state.content.cards.find((c) => c.id === def)?.top
  }
  const useful = (a: Of<'playCard'>): number => {
    const top = topOf(a.card)
    if (!top) return -1
    switch (top.kind) {
      case 'build': {
        const reduction = top.costReduction ?? 0
        const upgrade = cheapestUpgrade(state)
        if (onBase) return player.materials + reduction >= upgrade ? 4 : -1
        return upgrade === Number.POSITIVE_INFINITY && player.materials >= 2 ? 1 : -1
      }
      case 'gather':
        if (siteAt(state, player.hex) === 'gathering-node' && !spent(state, player.hex)) return 3
        return state.config.gather.offNodeAmount > 0 ? 0 : -1
      case 'rest':
        return player.health <= player.maxHealth - 3 ? 2 : -1
      case 'move':
        return atGoal(state, policy) ? -1 : 2
    }
  }
  const best = [...plays].sort((a, b) => useful(b) - useful(a))[0]
  if (best && useful(best) >= 0) return best
  return ofType(actions, 'discardCard')[0] ?? plays[0]
}
