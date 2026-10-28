import { enemyHitText } from '@survival/content'
import type { Axial, EnemyDieRoll, GameEvent, GameState } from '@survival/engine'
import { enemyName } from '../names/pieceNames.ts'

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
      return `Keep the dice you like. Roll the rest again, or stop and use them. After the last roll, you use them. ${
        ex.engage
          ? 'You can add cards from your hand when you use the dice.'
          : 'Then you can add cards from your hand.'
      } A Star fits any Skill slot.`
    case 'cards':
      return 'Add a card from your hand, or choose Done adding cards.'
    case 'reroll':
      return 'Choose dice to reroll, or stop rerolling.'
    case 'assign':
      return `Select dice. Then choose a Skill they fit. A Star fits any slot. A full Skill fires at once. ${enemyHitText(state.config)}`
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
      return 'Keep or roll dice. Cards come after.'
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
  return enemyName(state, id, from)
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
 * 1 hex east: 2 damage, 1 health left." or "Strike defeated grunt, 1 hex east." Empty when no
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
      return [`${skill} hit ${name}: ${e.amount} damage, ${e.health} health left.`]
    })
    .join(' ')
}

/**
 * The "Roll again" button's text, and whether it is off: a roll rolls only the dice not kept, so
 * with every die kept it would roll nothing. The engine still offers the roll; the UI says why
 * the button does nothing.
 *
 * @param dice - the exchange's dice.
 * @param rollsLeft - rolls left this engagement.
 */
export function rollAgain(
  dice: readonly Readonly<{ kept: boolean }>[],
  rollsLeft: number,
): Readonly<{ text: string; off: boolean }> {
  const off = dice.length > 0 && dice.every((d) => d.kept)
  return { text: off ? 'Roll again: every die is kept' : `Roll again (${rollsLeft} left)`, off }
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
  /** Each damaged enemy, in the order first hit: the damage it took and its health after. */
  hits: readonly EnemyHit[]
  events: readonly GameEvent[]
}>

/** The damage 1 enemy took in an engagement, read from its events. */
export type EnemyHit = Readonly<{
  enemy: string
  amount: number
  health: number
  defeated: boolean
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
  const hits = new Map<string, EnemyHit>()
  for (const e of events) {
    if (e.type === 'engaged') enemyDice = e.enemyDice
    if (e.type === 'skillFired') fired.push(e.skill)
    if (e.type === 'enemyDamaged') {
      sum.dealt += e.amount
      const was = hits.get(e.enemy)
      hits.set(e.enemy, {
        enemy: e.enemy,
        amount: (was?.amount ?? 0) + e.amount,
        health: e.health,
        defeated: was?.defeated ?? false,
      })
    }
    if (e.type === 'enemyDefeated') {
      sum.defeated += 1
      const was = hits.get(e.enemy)
      if (was) hits.set(e.enemy, { ...was, defeated: true })
    }
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
  return { ...sum, knockedOut, fired, enemyDice, hits: [...hits.values()], events }
}

const upper = (text: string) => `${text[0]?.toUpperCase() ?? ''}${text.slice(1)}`

/**
 * Who took the damage, for the result: "elite, 1 hex north took 2 damage: 12 health left."
 * or "grunt took 3 damage and was defeated." Null when no enemy took damage.
 *
 * @param s - the engagement's totals.
 * @param name - an enemy's label (a defeated enemy is gone from the state; its kind is kept).
 */
export function hitsLine(s: EngageSummary, name: (enemy: string) => string): string | null {
  if (s.hits.length === 0) return null
  return s.hits
    .map(
      (h) =>
        `${upper(name(h.enemy))} took ${h.amount} damage${h.defeated ? ' and was defeated' : `: ${h.health} health left`}.`,
    )
    .join(' ')
}

/** The result line for cancelled enemy dice, or null when none was cancelled. */
export function cancelledLine(s: EngageSummary): string | null {
  if (s.cancelled === 0) return null
  return `${s.cancelled} ${s.cancelled === 1 ? 'die' : 'dice'} of defeated enemies did not hit.`
}

/**
 * The 1-line verdict at the top of the result.
 *
 * @param s - the engagement's totals.
 * @param seat - who engaged in co-op ("Player 2"); null solo, where the verdict says "You".
 */
export function engageHeadline(s: EngageSummary, seat: string | null = null): string {
  const who = seat ?? 'You'
  if (s.knockedOut) return `${who} ${seat ? 'was' : 'were'} knocked out.`
  const won =
    s.defeated > 0
      ? `${who} defeated ${s.defeated} ${s.defeated === 1 ? 'enemy' : 'enemies'}`
      : s.dealt > 0
        ? `${who} dealt ${s.dealt} damage`
        : `${who} dealt no damage`
  const hurt =
    s.toHealth > 0
      ? `took ${s.toHealth} damage`
      : s.toGuard > 0
        ? `${seat ? 'their' : 'your'} guard stopped ${s.toGuard} damage`
        : 'took no damage'
  return `${won} and ${hurt}.`
}

/**
 * The result lines for what the engaged player dealt, healed, gained and took. In co-op they
 * name the seat ("Player 2 dealt 3 damage."), and experience, which is shared (8.1), goes to
 * all players while currency (8.2) goes to the seat, as the log says.
 *
 * @param s - the engagement's totals.
 * @param seat - who engaged in co-op ("Player 2"); null solo, where the lines say "You".
 */
export function resultLines(
  s: EngageSummary,
  seat: string | null = null,
): Readonly<{ dealt: string; healed: string | null; gained: string[]; hit: string }> {
  const who = seat ?? 'You'
  const dealt =
    s.dealt > 0
      ? `${who} dealt ${s.dealt} damage${s.defeated > 0 ? ` and defeated ${s.defeated} ${s.defeated === 1 ? 'enemy' : 'enemies'}` : ''}.`
      : `${who} dealt no damage.`
  const healed = s.healed > 0 ? `${who} healed ${s.healed} health.` : null
  const experience = s.experience > 0 ? `${s.experience} experience` : ''
  const currency = s.currency > 0 ? `${s.currency} currency` : ''
  const gained = seat
    ? [
        experience ? `All players gained ${experience}.` : '',
        currency ? `${seat} gained ${currency}.` : '',
      ].filter(Boolean)
    : experience || currency
      ? [`You gained ${[experience, currency].filter(Boolean).join(' and ')}.`]
      : []
  const target = seat ?? 'you'
  const ignored = s.ignored > 0 ? ` (${s.ignored} ignored)` : ''
  const hit =
    s.hitsTaken === 0
      ? `No enemy die hit ${target}${ignored}.`
      : `${s.hitsTaken} enemy ${s.hitsTaken === 1 ? 'die' : 'dice'} hit ${target}: ${s.toGuard} to guard, ${s.toHealth} to health${ignored}.`
  return { dealt, healed, gained, hit }
}
