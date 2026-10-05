import type { GameEvent } from '../events/events.ts'
import { enemyDef, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { levelForExperience } from './levels.ts'

/**
 * Raises the shared level to `level` (never down), up to `options.maxLevel` (18.1). Each new
 * level gives every player 1 action die (8.4).
 *
 * @rule 8.3, 8.4, 18.1
 */
export function raiseLevel(state: GameState, level: number, rule = '8.3'): Step {
  const cap = state.config.options.maxLevel ?? Number.POSITIVE_INFINITY
  const target = Math.min(level, cap)
  const events: GameEvent[] = []
  let players = state.players
  for (let reached = state.level + 1; reached <= target; reached++) {
    events.push({ type: 'levelReached', rule, level: reached })
    players = players.map((p) => ({ ...p, dice: p.dice + 1 }))
    for (const p of players)
      events.push({ type: 'diceGained', rule: '8.4', player: p.id, dice: p.dice })
  }
  if (events.length === 0) return [state, []]
  return [{ ...state, players, level: target }, events]
}

/**
 * Row 17 experiment (`experience.levelPerEliteSpawn`): an elite spawned (or a grunt turned into
 * an elite at the miniature limit), so the level rises by 1. Off: nothing happens.
 *
 * @rule 8.3, OPEN-QUESTIONS row 17 (experiment: 1 level per elite spawn)
 */
export function levelForEliteSpawn(state: GameState): Step {
  if (!state.config.experience.levelPerEliteSpawn) return [state, []]
  return raiseLevel(state, state.level + 1, '8.3, row 17')
}

/**
 * The rewards for a defeated enemy: its experience goes to the shared track (8.1), plus
 * `experience.eliteBonus` for an elite (row 17); its currency goes to the player who defeated
 * it (8.2), or for a Tower's defeat to the player who built the Tower (rows 40, 53).
 * Each new level gives every player 1 action die (8.4), up to `options.maxLevel` (18.1). With
 * `experience.levelPerEliteSpawn` the level comes from elite spawns instead (row 17).
 *
 * @param by - the player id, or the id of the Tower that defeated the enemy.
 * @rule 8.1, 8.2, 8.3, 8.4, 16.2, Table 5, OPEN-QUESTIONS rows 17, 40, 53
 */
export function gainForDefeat(state: GameState, kind: string, by: string): Step {
  const def = enemyDef(state, kind)
  const gained = def.experience + (kind === 'elite' ? state.config.experience.eliteBonus : 0)
  const experience = state.experience + gained
  const events: GameEvent[] = [
    { type: 'experienceGained', rule: '8.1', amount: gained, experience },
  ]
  let players = state.players
  const payee = state.defenses.find((d) => d.id === by)?.builder ?? by
  const killer = players.find((p) => p.id === payee)
  if (killer) {
    const currency = killer.currency + def.currency
    players = players.map((p) => (p.id === payee ? { ...p, currency } : p))
    const rule = payee === by ? '8.2' : '8.2, 12.3'
    events.push({ type: 'currencyGained', rule, player: payee, amount: def.currency, currency })
  }
  const progress =
    kind === 'elite'
      ? { ...state.progress, elitesDefeated: state.progress.elitesDefeated + 1 }
      : state.progress
  const paid: GameState = { ...state, experience, players, progress }
  if (state.config.experience.levelPerEliteSpawn) return [paid, events]
  const [levelled, more] = raiseLevel(paid, levelForExperience(experience, state.config))
  return [levelled, [...events, ...more]]
}
