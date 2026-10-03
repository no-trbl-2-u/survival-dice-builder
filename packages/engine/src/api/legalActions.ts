import { legalPlacements } from '../skills/assign.ts'
import { currentPlayer, skillDef } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import type { Action } from './actions.ts'

/**
 * What the current decision-maker may do now. Empty when the run has ended.
 * The action that moves the game forward comes first, so "take the first legal action"
 * always makes progress (used by the debug console and tests).
 *
 * @rule 6.2, 7.8
 */
export function legalActions(state: GameState): Action[] {
  if (state.phase === 'ended') return []
  const player = currentPlayer(state)
  const mayDiscard = !state.config.rulings.mandatoryPlays
  const cardChoices = (): Action[] => [
    ...player.hand.map((c): Action => ({ type: 'playCard', card: c.id })),
    ...(mayDiscard ? player.hand.map((c): Action => ({ type: 'discardCard', card: c.id })) : []),
  ]

  if (state.phase === 'prepare') return cardChoices()

  const exchange = state.exchange
  if (state.phase !== 'combat' || !exchange) return []
  switch (exchange.step) {
    case 'roll':
      return [
        { type: 'stopRolling' },
        ...(exchange.rollsUsed < state.config.combat.maxRolls ? [{ type: 'roll' } as const] : []),
        ...exchange.dice.map((_, die): Action => ({ type: 'toggleKeep', die })),
      ]
    case 'cards':
      return cardChoices()
    case 'reroll':
      return [
        { type: 'endReroll' },
        ...exchange.dice.flatMap((_, die): Action[] =>
          exchange.rerolled.includes(die) ? [] : [{ type: 'rerollDie', die }],
        ),
      ]
    case 'assign': {
      const skills = player.skills.map((id) => skillDef(state, id))
      const unlimited = state.config.options.skillUses === 'unlimited'
      return [
        { type: 'confirmAssignment' },
        ...legalPlacements(exchange.dice, skills, exchange.assignments, unlimited).map(
          (a): Action => ({ type: 'assignDie', ...a }),
        ),
        ...exchange.assignments.map((a): Action => ({ type: 'unassignDie', die: a.die })),
      ]
    }
    case 'targets':
      return state.enemies.map((e): Action => ({ type: 'chooseTarget', enemy: e.id }))
  }
}
