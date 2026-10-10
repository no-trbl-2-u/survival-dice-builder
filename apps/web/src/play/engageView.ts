import type { Axial, Enemy, EnemyDieRoll, GameEvent, GameState } from '@survival/engine'
import { stepsAway } from '../map/places.ts'

/**
 * The 4 stages of an engagement, in play order, as the modal's step strip names them. Cards are
 * added while using dice (the engine offers them then), so they share a stage.
 */
export const ENGAGE_STAGES = ['Roll', 'Use dice', 'Pick target', 'Result'] as const

type ExchangeStep = NonNullable<GameState['exchange']>['step']

/** Which stage an exchange step belongs to (0-2); the result is stage 3. */
export function engageStage(step: ExchangeStep): number {
  switch (step) {
    case 'roll':
      return 0
    case 'cards':
    case 'reroll':
    case 'assign':
      return 1
    case 'targets':
    case 'resolve':
      return 2
  }
}

/** The name of the Skill at the head of the queue (the one picking its target). */
function headSkill(state: GameState): string {
  const id = state.exchange?.queue[0]?.skill
  return state.content.skills.find((s) => s.id === id)?.name ?? 'Your Skill'
}

/**
 * What the player does now, in the modal's words, in short sentences (desktop; screen readers
 * always hear this one). No map: targets are picked in the modal.
 */
export function engageInstruction(state: GameState): string {
  const ex = state.exchange
  if (!ex) return ''
  switch (ex.step) {
    case 'roll':
      return 'Keep the dice you like. Roll the rest again, or stop and use them. After the last roll, you use them.'
    case 'cards':
      return 'Add a card from your hand, or choose Done adding cards.'
    case 'reroll':
      return 'Choose dice to reroll, or stop rerolling.'
    case 'assign':
      return `Select dice. Then choose a Skill they fit. A Star fits any slot. A full Skill fires at once. When no dice are left, the enemy dice hit.${
        state.config.options.skillUses === 'unlimited'
          ? ''
          : ' Each Skill fires once per engagement.'
      }`
    case 'targets':
    case 'resolve':
      return `${headSkill(state)} fires. Choose the enemy it hits.`
  }
}

/** The same instruction in one short line, for phones (760px and narrower). */
export function engageInstructionShort(state: GameState): string {
  const ex = state.exchange
  if (!ex) return ''
  switch (ex.step) {
    case 'roll':
      return 'Keep dice, roll the rest, or use them.'
    case 'cards':
      return 'Add a card, or Done.'
    case 'reroll':
      return 'Pick dice to reroll, or stop.'
    case 'assign':
      return 'Pick dice, then a Skill.'
    case 'targets':
    case 'resolve':
      return `${headSkill(state)}: pick its target.`
  }
}

/**
 * An enemy by its kind and place, seen from a hex, for players who cannot see engine ids:
 * "grunt, 1 hex east", "grunt, on your hex". Two enemies with the same name get " (1)", " (2)"
 * in id order. An enemy no longer on the map (defeated) is its kind alone.
 *
 * @param state - the game state whose enemies are named.
 * @param id - the enemy id.
 * @param from - the hex the player looks from (the current player's hex).
 */
export function enemyLabel(state: GameState, id: string, from: Axial): string {
  const place = (e: Enemy) => {
    const away = stepsAway(from, e.hex)
    return `${e.kind}, ${away === 'here' ? 'on your hex' : away}`
  }
  const enemy = state.enemies.find((e) => e.id === id)
  if (!enemy) {
    const kind = state.log.flatMap((ev) =>
      ev.type === 'enemyDefeated' && ev.enemy === id ? [ev.kind] : [],
    )[0]
    return kind ?? 'enemy'
  }
  const name = place(enemy)
  const same = state.enemies
    .filter((e) => place(e) === name)
    .map((e) => e.id)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  return same.length > 1 ? `${name} (${same.indexOf(id) + 1})` : name
}

/** The current player's hex (where enemy names are seen from). */
export function playerHex(state: GameState): Axial {
  return state.players[state.current]?.hex ?? { q: 0, r: 0 }
}

/**
 * The enemies of an engagement, counted by kind in content order: "2 grunts and 1 elite".
 * Empty when no enemy rolled dice.
 *
 * @param state - the game state in an engagement.
 */
export function engageFoes(state: GameState): string {
  const ids = new Set(state.exchange?.engage?.enemyDice.map((d) => d.enemy) ?? [])
  const kinds = [...ids].map(
    (id) =>
      state.enemies.find((e) => e.id === id)?.kind ??
      state.log.flatMap((ev) =>
        ev.type === 'enemyDefeated' && ev.enemy === id ? [ev.kind] : [],
      )[0] ??
      'enemy',
  )
  const order = state.content.enemies.enemies.map((d) => d.id)
  const parts = [...new Set(kinds)]
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((kind) => {
      const n = kinds.filter((k) => k === kind).length
      return `${n} ${kind}${n === 1 ? '' : 's'}`
    })
  return parts.length <= 1
    ? (parts[0] ?? '')
    : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
}

/**
 * What a target pick did, for screen readers while the modal steps aside: "Strike hit grunt,
 * 1 hex east for 2. 1 health left." or "Strike defeated grunt, 1 hex east." Empty when no
 * enemy took damage. Names are read from the state before the pick (a defeated enemy is gone
 * after it).
 *
 * @param before - the state the pick was applied to.
 * @param events - the events of the pick.
 */
export function hitLine(before: GameState, events: readonly GameEvent[]): string {
  const skill = headSkill(before)
  const from = playerHex(before)
  const defeated = new Set(events.flatMap((e) => (e.type === 'enemyDefeated' ? [e.enemy] : [])))
  return events
    .flatMap((e) => {
      if (e.type !== 'enemyDamaged') return []
      const name = enemyLabel(before, e.enemy, from)
      if (defeated.has(e.enemy)) return [`${skill} defeated ${name}.`]
      return [`${skill} hit ${name} for ${e.amount}. ${e.health} health left.`]
    })
    .join(' ')
}

/**
 * What comes next, shown on the board while the modal steps aside after a target pick: the
 * result when the pick ended the engagement, else the engagement again.
 *
 * @param ended - the pick ended the engagement.
 */
export function asideNote(ended: boolean): string {
  return ended ? 'Engagement over. The result comes next.' : 'Back to the engagement in a moment.'
}

/** The totals of 1 finished engagement, read from its events. */
export type EngageSummary = Readonly<{
  dealt: number
  defeated: number
  hitsTaken: number
  toGuard: number
  toHealth: number
  ignored: number
  /** Enemy dice that did not hit: their enemy was defeated (`defeatedDice: "cancelled"`). */
  cancelled: number
  healed: number
  experience: number
  currency: number
  knockedOut: boolean
  /** The Skills that fired, in order (names come from the content). */
  fired: readonly string[]
  /** The enemy dice as rolled at the start. */
  enemyDice: readonly EnemyDieRoll[]
  events: readonly GameEvent[]
}>

/**
 * The events of the latest engagement (from its `engaged` event to its `exchangeEnded`), or
 * null when the log has none. Labels only: the engine already resolved everything.
 */
export function lastEngagement(log: readonly GameEvent[]): EngageSummary | null {
  let start = -1
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i]?.type === 'engaged') {
      start = i
      break
    }
  }
  if (start < 0) return null
  const end = log.findIndex((e, i) => i > start && e.type === 'exchangeEnded')
  const events = log.slice(start, end < 0 ? log.length : end + 1)
  const sum = {
    dealt: 0,
    defeated: 0,
    hitsTaken: 0,
    toGuard: 0,
    toHealth: 0,
    ignored: 0,
    cancelled: 0,
    healed: 0,
    experience: 0,
    currency: 0,
  }
  // A knock-out follows the engagement's end at once.
  const knockedOut = end >= 0 && log[end + 1]?.type === 'playerKnockedOut'
  const fired: string[] = []
  let enemyDice: readonly EnemyDieRoll[] = []
  for (const e of events) {
    if (e.type === 'engaged') enemyDice = e.enemyDice
    if (e.type === 'skillFired') fired.push(e.skill)
    if (e.type === 'enemyDamaged') sum.dealt += e.amount
    if (e.type === 'enemyDefeated') sum.defeated += 1
    if (e.type === 'enemyAttacked') sum.hitsTaken += 1
    if (e.type === 'playerDamaged') {
      sum.toGuard += e.toGuard
      sum.toHealth += e.toHealth
    }
    if (e.type === 'hitIgnored') sum.ignored += 1
    if (e.type === 'enemyDieCancelled') sum.cancelled += 1
    if (e.type === 'healed') sum.healed += e.amount
    if (e.type === 'experienceGained') sum.experience += e.amount
    if (e.type === 'currencyGained') sum.currency += e.amount
  }
  return { ...sum, knockedOut, fired, enemyDice, events }
}

/** The result line for cancelled enemy dice, or null when none was cancelled. */
export function cancelledLine(s: EngageSummary): string | null {
  if (s.cancelled === 0) return null
  return `${s.cancelled} ${s.cancelled === 1 ? 'die' : 'dice'} of defeated enemies did not hit.`
}

/** The 1-line verdict at the top of the result. */
export function engageHeadline(s: EngageSummary): string {
  if (s.knockedOut) return 'You were knocked out.'
  const won =
    s.defeated > 0
      ? `You defeated ${s.defeated} ${s.defeated === 1 ? 'enemy' : 'enemies'}`
      : s.dealt > 0
        ? `You dealt ${s.dealt} damage`
        : 'You dealt no damage'
  const hurt =
    s.toHealth > 0
      ? `took ${s.toHealth} damage`
      : s.toGuard > 0
        ? `your guard stopped ${s.toGuard} damage`
        : 'took no damage'
  return `${won} and ${hurt}.`
}
