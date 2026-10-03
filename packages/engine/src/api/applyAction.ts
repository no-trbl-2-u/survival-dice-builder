import { applyBottomEffect, applyTopEffect, updateExchange } from '../combat/cardEffects.ts'
import { chooseTarget, confirmAssignment } from '../combat/resolve.ts'
import { discardFromHand, playToTable } from '../deck/deck.ts'
import { rerollOne, toggleKeep } from '../dice/dice.ts'
import type { GameEvent } from '../events/events.ts'
import { advance, rollAgain } from '../phases/advance.ts'
import {
  cardDef,
  currentPlayer,
  updateCurrentPlayer,
  withLog,
  type Step,
} from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { illegalAction, sameAction, type Action } from './actions.ts'
import { legalActions } from './legalActions.ts'

/**
 * Applies one player action, then resolves automatic steps until the next decision. Pure: the
 * input state is not changed.
 *
 * @param state - the current state.
 * @param action - one of `legalActions(state)`.
 * @returns the new state and the events, in order.
 * @throws IllegalActionError when the action is not legal now.
 * @rule 6, 7.8
 */
export function applyAction(
  state: GameState,
  action: Action,
): { state: GameState; events: GameEvent[] } {
  if (!legalActions(state).some((a) => sameAction(a, action))) {
    throw illegalAction(
      action,
      `not legal in ${state.phase}${state.exchange ? `/${state.exchange.step}` : ''}`,
    )
  }
  const [acted, actionEvents] = act(state, action)
  const [ready, autoEvents] = advance(acted)
  const events = [...actionEvents, ...autoEvents]
  return { state: withLog(ready, events), events }
}

/** Applies the action itself, before automatic steps. */
function act(state: GameState, action: Action): Step {
  const player = currentPlayer(state)
  switch (action.type) {
    case 'playCard': {
      const def = cardDef(state, findCard(state, action.card))
      if (state.phase === 'prepare') {
        const moved = updateCurrentPlayer(state, (p) => discardFromHand(p, action.card))
        const [after, events] = applyTopEffect(moved, def.top)
        return [
          after,
          [
            { type: 'cardPlayed', rule: '6.2', player: player.id, card: action.card, half: 'top' },
            ...events,
          ],
        ]
      }
      let current = updateCurrentPlayer(state, (p) => playToTable(p, action.card))
      const events: GameEvent[] = [
        { type: 'cardPlayed', rule: '7.8', player: player.id, card: action.card, half: 'bottom' },
      ]
      for (const effect of def.bottom) {
        const [next, more] = applyBottomEffect(current, effect)
        current = next
        events.push(...more)
      }
      return [current, events]
    }
    case 'discardCard':
      return [
        updateCurrentPlayer(state, (p) => discardFromHand(p, action.card)),
        [
          {
            type: 'cardDiscarded',
            rule: '6.2',
            player: player.id,
            card: action.card,
            unplayed: true,
          },
        ],
      ]
    case 'toggleKeep': {
      const next = updateExchange(state, (e) => ({ ...e, dice: toggleKeep(e.dice, action.die) }))
      const kept = next.exchange?.dice[action.die]?.kept ?? false
      return [next, [{ type: 'dieKept', rule: '7.8', player: player.id, die: action.die, kept }]]
    }
    case 'roll':
      return rollAgain(state)
    case 'stopRolling':
      return [updateExchange(state, (e) => ({ ...e, step: 'cards' })), []]
    case 'rerollDie': {
      const exchange = state.exchange
      if (!exchange) throw illegalAction(action, 'no exchange')
      const [dice, rng] = rerollOne(state.rng, exchange.dice, action.die)
      const next = updateExchange({ ...state, rng }, (e) => ({
        ...e,
        dice,
        rerollsLeft: e.rerollsLeft - 1,
        rerolled: [...e.rerolled, action.die],
      }))
      const face = dice[action.die]?.face ?? 'Blank'
      return [
        next,
        [{ type: 'dieRerolled', rule: '7.8', player: player.id, die: action.die, face }],
      ]
    }
    case 'endReroll':
      return [updateExchange(state, (e) => ({ ...e, rerollsLeft: 0 })), []]
    case 'assignDie': {
      const { die, skill, use, slot, asFace } = action
      const next = updateExchange(state, (e) => ({
        ...e,
        assignments: [...e.assignments, { die, skill, use, slot, asFace }],
      }))
      return [next, [{ type: 'dieAssigned', rule: '7.8', player: player.id, die, skill, asFace }]]
    }
    case 'unassignDie': {
      const next = updateExchange(state, (e) => ({
        ...e,
        assignments: e.assignments.filter((a) => a.die !== action.die),
      }))
      return [next, [{ type: 'dieUnassigned', rule: '7.8', player: player.id, die: action.die }]]
    }
    case 'confirmAssignment':
      return confirmAssignment(state)
    case 'chooseTarget':
      return chooseTarget(state, action.enemy)
  }
}

/** The definition id of a card in the current hand. */
function findCard(state: GameState, cardId: string): string {
  const card = currentPlayer(state).hand.find((c) => c.id === cardId)
  if (!card) throw new Error(`Card "${cardId}" is not in hand`)
  return card.def
}
