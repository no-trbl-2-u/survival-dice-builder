import type { GameEvent } from '../events/events.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/**
 * Every milestone reached so far, as ids: `survive-round-<n>`, `defeat-elite`,
 * `fire-<skill>`, `buy-upgrades`, `reveal-tiles`, `reach-level`. "Survive to round N" = the
 * round counter reached N.
 *
 * @rule 17
 */
export function reachedMilestones(state: GameState): string[] {
  const m = state.config.milestones
  return [
    ...m.surviveRounds.filter((n) => state.round >= n).map((n) => `survive-round-${n}`),
    ...(state.progress.elitesDefeated > 0 ? ['defeat-elite'] : []),
    ...(state.progress.firedSkills.includes(m.skillFired) ? [`fire-${m.skillFired}`] : []),
    ...(state.upgrades.length >= m.upgradesBought ? ['buy-upgrades'] : []),
    ...(state.progress.tilesRevealed >= m.tilesRevealed ? ['reveal-tiles'] : []),
    ...(state.level >= m.level ? ['reach-level'] : []),
  ]
}

/**
 * Records each newly reached milestone once (10.10; at the end of the run, 14.3).
 *
 * @rule 10.10, 14.3, 17
 */
export function checkMilestones(state: GameState, rule: string): Step {
  const fresh = reachedMilestones(state).filter((id) => !state.milestones.includes(id))
  if (fresh.length === 0) return [state, []]
  const events: GameEvent[] = fresh.map((milestone) => ({
    type: 'milestoneReached',
    rule,
    milestone,
    round: state.round,
  }))
  return [{ ...state, milestones: [...state.milestones, ...fresh] }, events]
}
