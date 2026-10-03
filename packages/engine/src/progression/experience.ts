import type { GameEvent } from '../events/events.ts'
import { enemyDef, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { levelForExperience } from './levels.ts'

/**
 * The rewards for a defeated enemy: its experience goes to the shared track (8.1); its
 * currency goes to the player who defeated it (8.2) — a Tower defeat gives none (row 40).
 * Each new level gives every player 1 action die (8.4), up to `options.maxLevel` (18.1).
 *
 * @rule 8.1, 8.2, 8.3, 8.4, 16.2, Table 5
 */
export function gainForDefeat(state: GameState, kind: string, by: string): Step {
  const def = enemyDef(state, kind)
  const experience = state.experience + def.experience
  const events: GameEvent[] = [
    { type: 'experienceGained', rule: '8.1', amount: def.experience, experience },
  ]
  let players = state.players
  const killer = players.find((p) => p.id === by)
  if (killer) {
    const currency = killer.currency + def.currency
    players = players.map((p) => (p.id === by ? { ...p, currency } : p))
    events.push({ type: 'currencyGained', rule: '8.2', player: by, amount: def.currency, currency })
  }
  const level = levelForExperience(experience, state.config)
  for (let reached = state.level + 1; reached <= level; reached++) {
    events.push({ type: 'levelReached', rule: '8.3', level: reached })
    players = players.map((p) => ({ ...p, dice: p.dice + 1 }))
    for (const p of players)
      events.push({ type: 'diceGained', rule: '8.4', player: p.id, dice: p.dice })
  }
  const progress =
    kind === 'elite'
      ? { ...state.progress, elitesDefeated: state.progress.elitesDefeated + 1 }
      : state.progress
  return [{ ...state, experience, level, players, progress }, events]
}
