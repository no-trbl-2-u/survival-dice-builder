import type { GameEvent } from '../events/events.ts'
import { hexDistance } from '../hex.ts'
import { baseHexes } from '../map/base.ts'
import { nextInt } from '../rng/rng.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/** A boon a calendar day gives: heal and repair (Respite), or every gathering node back (Harvest). */
export type CalendarBoon = 'respite' | 'harvest'

/**
 * One Combat's calendar day: enemies at each active spawn node and elite spawn node, extra
 * elites at the active node nearest the base, and the boons. `faces` lists the threat dice.
 */
export type CalendarDay = Readonly<{
  name: string
  grunts: number
  elites: number
  extraElites: number
  boons: readonly CalendarBoon[]
  faces?: readonly string[]
}>

/** The calendar system in play: "off" when the config predates the experiment. */
export function calendarSystem(state: GameState): string {
  return state.config.calendar?.system ?? 'off'
}

/** The calendar settings. Throws for a config without the group (the system is then "off"). */
function settings(state: GameState): NonNullable<GameState['config']['calendar']> {
  const calendar = state.config.calendar
  if (!calendar) throw new Error('calendar settings missing: the Event Calendar is off')
  return calendar
}

/** A Sundial day that plays the written rule; never reached (the ring has at least 1 day). */
const WRITTEN_SUNDIAL_DAY = {
  name: 'written',
  grunts: 1,
  elites: 1,
  extraElites: 0,
  boon: 'none',
} as const

/** The written rule (7.3): every spawn node 1 grunt, every elite spawn node 1 elite, no boon. */
const WRITTEN_DAY: CalendarDay = {
  name: 'written',
  grunts: 1,
  elites: 1,
  extraElites: 0,
  boons: [],
}

/**
 * The Sundial day for this round: day `(round - 1) mod days`; each finished lap (`eraEvery`
 * rounds) adds 1 enemy to each day that spawns and 1 extra elite to each day that has one.
 *
 * @rule 7.3 (Event Calendar experiment: Sundial)
 */
export function sundialDay(state: GameState): CalendarDay {
  const { eraEvery, days } = settings(state).sundial
  const era = Math.floor((state.round - 1) / eraEvery)
  const day = days[(state.round - 1) % days.length] ?? WRITTEN_SUNDIAL_DAY
  const up = (n: number) => (n > 0 ? n + era : 0)
  return {
    name: day.name,
    grunts: up(day.grunts),
    elites: up(day.elites),
    extraElites: up(day.extraElites),
    boons: day.boon === 'none' ? [] : [day.boon],
  }
}

/** Threat dice rolled this round: `startDice`, plus 1 every `addDieEvery` rounds after round 1. */
export function threatDiceCount(state: GameState): number {
  const { startDice, addDieEvery } = settings(state).threatDice
  return startDice + Math.floor((state.round - 1) / addDieEvery)
}

/**
 * Rolls the threat dice. A milestone reached since the last roll sets 1 die to Boon without a
 * roll. Each Raid adds 1 enemy at each spawn node (elite spawn nodes spawn only on a day with a
 * Raid); each Elite face puts 1 elite at the node nearest the base; 1 Boon gives a Respite and 2
 * or more also a Harvest. Returns the day, the next RNG state, and the milestones counted.
 *
 * @rule 7.3 (Event Calendar experiment: threat dice)
 */
export function threatDiceDay(state: GameState): readonly [CalendarDay, number, number] {
  const { faces } = settings(state).threatDice
  const seen = state.calendarMark ?? 0
  const blessed = state.milestones.length > seen ? 1 : 0
  let rng = state.rng
  const rolled: string[] = blessed ? ['boon'] : []
  for (let i = blessed; i < threatDiceCount(state); i++) {
    const [f, next] = nextInt(rng, faces.length)
    rng = next
    rolled.push(faces[f] ?? 'calm')
  }
  const count = (face: string) => rolled.filter((f) => f === face).length
  const raids = count('raid')
  const boons = count('boon')
  const day: CalendarDay = {
    name: 'threat dice',
    grunts: raids,
    elites: raids > 0 ? 1 : 0,
    extraElites: count('elite'),
    boons: boons >= 2 ? ['respite', 'harvest'] : boons === 1 ? ['respite'] : [],
    faces: rolled,
  }
  return [day, rng, state.milestones.length]
}

/** The Notoriety rung: 1 every `rungEvery` rounds after round 1, plus 1 per milestone reached. */
export function notorietyRung(state: GameState): number {
  return (
    Math.floor((state.round - 1) / settings(state).notoriety.rungEvery) + state.milestones.length
  )
}

/**
 * The Notoriety day: each spawn node gets 1 enemy plus 1 per `rungsPerGrunt` rungs. A new rung
 * since the last Combat gives a Respite, and every `eliteEveryRungs`-th rung brings 1 elite to
 * the node nearest the base. Returns the day and the rung to remember.
 *
 * @rule 7.3 (Event Calendar experiment: Notoriety ladder)
 */
export function notorietyDay(state: GameState): readonly [CalendarDay, number] {
  const { rungsPerGrunt, eliteEveryRungs } = settings(state).notoriety
  const rung = notorietyRung(state)
  const last = state.calendarMark ?? 0
  const climbed = rung > last
  const crossed = Math.floor(rung / eliteEveryRungs) - Math.floor(last / eliteEveryRungs)
  const extra = Math.floor(rung / rungsPerGrunt)
  return [
    {
      name: `notoriety rung ${rung}`,
      grunts: 1 + extra,
      elites: 1 + extra,
      extraElites: climbed ? Math.max(0, crossed) : 0,
      boons: climbed ? ['respite'] : [],
    },
    Math.max(rung, last),
  ]
}

/**
 * This Combat's calendar day and the state with the calendar's memory (RNG, mark) updated.
 * With `calendar.system` "off" the day is the written rule and the state is unchanged.
 *
 * @rule 7.3 (Event Calendar experiment)
 */
export function calendarDay(state: GameState): readonly [CalendarDay, GameState] {
  switch (calendarSystem(state)) {
    case 'sundial':
      return [sundialDay(state), state]
    case 'threat-dice': {
      const [day, rng, mark] = threatDiceDay(state)
      return [day, { ...state, rng, calendarMark: mark }]
    }
    case 'notoriety': {
      const [day, mark] = notorietyDay(state)
      return [day, { ...state, calendarMark: mark }]
    }
    default:
      return [WRITTEN_DAY, state]
  }
}

/**
 * Applies a day's boons. Respite: each player on the map heals `respite.heal` and the base gets
 * `respite.repair`, never above the maximum. Harvest: every spent gathering node works again.
 *
 * @rule 7.3 (Event Calendar experiment: boons), 6.7 (Gather)
 */
export function applyBoons(state: GameState, boons: readonly CalendarBoon[]): Step {
  let current = state
  const events: GameEvent[] = []
  const rule = '7.3'
  for (const boon of boons) {
    if (boon === 'harvest') {
      current = { ...current, spentNodes: [] }
      continue
    }
    const { heal, repair } = settings(current).respite
    const players = current.players.map((p) => {
      if (p.knockedOut) return p
      const health = Math.min(p.maxHealth, p.health + heal)
      if (health > p.health)
        events.push({ type: 'healed', rule, player: p.id, amount: health - p.health, health })
      return { ...p, health }
    })
    const baseHealth = Math.min(current.base.maxHealth, current.base.health + repair)
    if (baseHealth > current.base.health)
      events.push({
        type: 'baseRepaired',
        rule,
        amount: baseHealth - current.base.health,
        health: baseHealth,
      })
    current = { ...current, players, base: { ...current.base, health: baseHealth } }
  }
  return [current, events]
}

/**
 * The active spawn node nearest the base (ties: map order), where a day's extra elites come.
 *
 * @rule 7.3 (Event Calendar experiment), 9.8
 */
export function nodeNearestBase<T extends { hex: { q: number; r: number } }>(
  state: GameState,
  nodes: readonly T[],
): T | undefined {
  const base = baseHexes(state)
  const distance = (n: T) => Math.min(...base.map((b) => hexDistance(b, n.hex)))
  return [...nodes].sort((a, b) => distance(a) - distance(b))[0]
}
