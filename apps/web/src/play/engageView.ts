import type { EnemyDieRoll, GameEvent, GameState } from '@survival/engine'

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

/** What the player does now, in the modal's words (no map: targets are picked in the modal). */
export function engageInstruction(state: GameState): string {
  const ex = state.exchange
  if (!ex) return ''
  switch (ex.step) {
    case 'roll':
      return 'Keep the dice you like and roll the rest again, or stop rolling and use them. After the last roll, you use them.'
    case 'cards':
      return 'Add a card from your hand (rerolls, heals), or choose Done adding cards.'
    case 'reroll':
      return 'Choose dice to reroll, or stop rerolling.'
    case 'assign':
      return 'Pick dice, then a Skill they fit (a Star fits any slot). A full Skill fires at once; when no die is left, the enemy dice hit.'
    case 'targets':
    case 'resolve': {
      const skill = state.content.skills.find((s) => s.id === ex.queue[0]?.skill)?.name
      return `${skill ?? 'Your Skill'} fires: choose the enemy it hits.`
    }
  }
}

/** The totals of 1 finished engagement, read from its events. */
export type EngageSummary = Readonly<{
  dealt: number
  defeated: number
  hitsTaken: number
  toGuard: number
  toHealth: number
  ignored: number
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
    if (e.type === 'healed') sum.healed += e.amount
    if (e.type === 'experienceGained') sum.experience += e.amount
    if (e.type === 'currencyGained') sum.currency += e.amount
  }
  return { ...sum, knockedOut, fired, enemyDice, events }
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
  const hurt = s.toHealth > 0 ? `took ${s.toHealth} damage` : 'took no damage'
  return `${won} and ${hurt}.`
}
