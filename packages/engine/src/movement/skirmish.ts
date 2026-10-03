import { rollDice } from '../dice/dice.ts'
import type { GameEvent } from '../events/events.ts'
import type { Axial } from '../hex.ts'
import { currentPlayer, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { enemyAt } from './move.ts'

/**
 * Starts a skirmish when a move enters an enemy's hex: the move cost is already paid; the
 * player rolls all action dice 1 time and goes straight to Skill placement (no cards, no
 * rerolls).
 *
 * @rule 6.10, 6.11, 6.15
 */
export function startSkirmish(state: GameState, to: Axial): Step {
  const player = currentPlayer(state)
  const enemy = enemyAt(state, to)
  if (!enemy) throw new Error('startSkirmish: no enemy on the target hex')
  const [faces, rng] = rollDice(state.rng, player.dice)
  const events: GameEvent[] = [
    { type: 'skirmishStarted', rule: '6.10', player: player.id, hex: to, enemy: enemy.id },
    { type: 'diceRolled', rule: '6.11', player: player.id, faces, roll: 1 },
  ]
  return [
    {
      ...state,
      rng,
      exchange: {
        step: 'assign',
        dice: faces.map((face) => ({ face, kept: false })),
        rollsUsed: 1,
        rerollsLeft: 0,
        rerolled: [],
        bonusDamage: 0,
        ignoreHits: 0,
        assignments: [],
        queue: [],
        skirmish: { hex: to, from: player.hex },
      },
    },
    events,
  ]
}
