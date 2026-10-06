import { botChoice } from '@survival/bot'
import { applyAction, legalActions } from '@survival/engine'
import { step, type Run } from './run.ts'

const MAX_STEPS = 4000

/**
 * DEV ONLY (TODO: remove with the "Force engagement" button once the engagement modal is
 * signed off). Plays the bot forward until the current player is in an engagement with at least
 * one enemy die. Each legal Engage is tried on a scratch copy and taken only when enemies roll
 * back; otherwise the bot plays on. Returns null when no such engagement comes up in time.
 */
export function forceEngagement(run: Run): Run | null {
  let current = run
  for (let i = 0; i < MAX_STEPS; i++) {
    const state = current.state
    if (state.exchange?.engage && state.exchange.engage.enemyDice.length > 0) return current
    if (state.phase === 'ended') return null
    const engage = legalActions(state).find(
      (a) =>
        a.type === 'engage' &&
        (applyAction(state, a).state.exchange?.engage?.enemyDice.length ?? 0) > 0,
    )
    const action = engage ?? botChoice(state)
    if (!action) return null
    current = step(current, action)
  }
  return null
}
