import { botChoice } from '@survival/bot'
import { applyAction, legalActions, type GameState } from '@survival/engine'
import { step, type Run } from './run.ts'

const MAX_STEPS = 4000

/**
 * DEV ONLY (TODO: remove with the "Force engagement" button once the engagement modal is
 * signed off). Plays the bot forward until the current player is in an engagement with at least
 * one enemy die. Each legal Engage is tried on a scratch copy and taken only when enemies roll
 * back; otherwise the bot plays on. `until` picks the moment to stop (default: the engagement's
 * first roll; `atTarget`: a fired Skill waiting for its enemy). Null when it never comes.
 */
export function forceEngagement(run: Run, until = engagedWithEnemies): Run | null {
  let current = run
  for (let i = 0; i < MAX_STEPS; i++) {
    const state = current.state
    if (until(state)) return current
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

/** An engagement where at least 1 enemy rolled dice back. */
export function engagedWithEnemies(state: GameState): boolean {
  return (state.exchange?.engage?.enemyDice.length ?? 0) > 0
}

/** An engagement waiting for the player to pick the enemy a fired Skill hits. */
export function atTarget(state: GameState): boolean {
  return (
    engagedWithEnemies(state) &&
    legalActions(state).some((a) => a.type === 'resolveSkill' && a.enemy !== undefined)
  )
}
