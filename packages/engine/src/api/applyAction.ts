import { buildDefense, legalBuilds } from '../build/defenses.ts'
import { applyBottomEffect, applyTopEffect, updateExchange } from '../combat/cardEffects.ts'
import { combatOptions, endCards, playOption, startEngagement } from '../combat/engage.ts'
import { chooseTarget, confirmAssignment, fireIfFull, resolveQueued } from '../combat/resolve.ts'
import { towerAttacks, towerShoots } from '../enemies/structures.ts'
import { discardFromHand, playToTable } from '../deck/deck.ts'
import { rerollOne, toggleKeep } from '../dice/dice.ts'
import type { GameEvent } from '../events/events.ts'
import { revealUnder } from '../explore/explore.ts'
import { isPassable } from '../map/tiles.ts'
import { legalMoves } from '../movement/move.ts'
import { startSkirmish } from '../movement/skirmish.ts'
import { advance, rollAgain } from '../phases/advance.ts'
import { keepSkill, replaceSkill } from '../progression/draft.ts'
import { buyCard, returnStarter } from '../progression/shop.ts'
import { buyUpgrade, legalUpgrades } from '../progression/upgrades.ts'
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
      // Combat v3: straight on to using the dice (cards can be added while using them).
      return [updateExchange(state, (e) => ({ ...e, step: e.engage ? 'assign' : 'cards' })), []]
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
      const events: GameEvent[] = [
        { type: 'dieAssigned', rule: '7.8', player: player.id, die, skill, asFace },
      ]
      if (!state.exchange?.engage) return [next, events]
      // Combat v3: a Skill whose slots are now full fires at once.
      const [fired, more] = fireIfFull(next, skill, use)
      return [fired, [...events, ...more]]
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
    case 'chooseTowerTarget': {
      const [shot, events] = towerShoots(state, action.enemy)
      const [rest, more] = towerAttacks(shot)
      return [rest, [...events, ...more]]
    }
    case 'placeFigure': {
      const hex = { q: action.q, r: action.r }
      const placed = updateCurrentPlayer(state, (p) => ({ ...p, hex }))
      const unplaced = state.unplaced.filter((id) => id !== player.id)
      // A returning figure placed last hands the round back to seat 1 (core loop v2, knockout).
      const restart = state.phase === 'prepare' && unplaced.length === 0
      return [
        { ...placed, unplaced, ...(restart ? { current: 0, turnFresh: true } : {}) },
        [{ type: 'figurePlaced', rule: '4.6', player: player.id, hex }],
      ]
    }
    case 'moveTo':
      return moveTo(state, action)
    case 'buyCard':
      return buyCard(state, action.card)
    case 'returnStarter':
      return returnStarter(state, action.card)
    case 'buyUpgrade': {
      const active = state.active
      if (active?.kind !== 'build') throw illegalAction(action, 'no Build in progress')
      const option = legalUpgrades(state, active.costReduction).find(
        (u) => u.upgrade === action.upgrade,
      )
      if (!option) throw illegalAction(action, 'not a legal upgrade')
      const [bought, events] = buyUpgrade(state, option.upgrade, option.cost)
      return [{ ...bought, active: { ...active, buildsLeft: active.buildsLeft - 1 } }, events]
    }
    case 'draftSkill':
      return keepSkill(state, action.skill)
    case 'replaceSkill':
      return replaceSkill(state, action.skill)
    case 'playOption': {
      const option = combatOptions(state, findCard(state, action.card))[action.option]
      if (!option) throw illegalAction(action, 'no such option')
      return playOption(state, action.card, option)
    }
    case 'engage':
      return startEngagement(state, action.card)
    case 'endCards':
      return endCards(state)
    case 'resolveSkill':
      return resolveQueued(state, action.skill, action.use, action.enemy ?? null)
    case 'stopMoving':
    case 'stopBuilding':
      return [{ ...state, active: null }, []]
    case 'build': {
      const active = state.active
      if (active?.kind !== 'build') throw illegalAction(action, 'no Build in progress')
      const hex = { q: action.q, r: action.r }
      const option = legalBuilds(state, active.costReduction).find(
        (b) => b.defense === action.defense && b.hex.q === hex.q && b.hex.r === hex.r,
      )
      if (!option) throw illegalAction(action, 'not a legal build')
      const [built, events] = buildDefense(state, action.defense, hex, option.cost)
      return [{ ...built, active: { ...active, buildsLeft: active.buildsLeft - 1 } }, events]
    }
  }
}

/**
 * One step of a Move: pay the hex's cost (2 next to an enemy, 6.9). Entering an enemy's hex
 * starts a skirmish instead of moving (6.10). A step off the map edge reveals the next tile
 * under the hex entered, then the figure enters it; a lake or mountain there leaves the figure
 * where it was, with the cost paid (row 61).
 *
 * @rule 6.7, 6.9, 6.10, 6.15, 10.1, core loop v2 (exploring), OPEN-QUESTIONS row 61
 */
function moveTo(state: GameState, action: Extract<Action, { type: 'moveTo' }>): Step {
  const active = state.active
  if (active?.kind !== 'move') throw illegalAction(action, 'no Move in progress')
  const to = { q: action.q, r: action.r }
  const option = legalMoves(state, active.hexesLeft, active.ignoreEnemyCost).find(
    (m) => m.to.q === to.q && m.to.r === to.r,
  )
  if (!option) throw illegalAction(action, 'not a legal move')
  const hexesLeft = active.hexesLeft - option.cost
  const paid: GameState = { ...state, active: { ...active, hexesLeft } }
  if (option.skirmish) return startSkirmish(paid, to)
  const player = currentPlayer(state)
  const [revealed, revealEvents] = option.reveal ? revealUnder(paid, to) : [paid, []]
  if (!isPassable(revealed.map, to)) {
    return [
      revealed,
      [
        ...revealEvents,
        { type: 'revealStepBlocked', rule: '3.4', player: player.id, hex: to, hexesLeft },
      ],
    ]
  }
  return [
    updateCurrentPlayer(revealed, (p) => ({ ...p, hex: to })),
    [
      ...revealEvents,
      {
        type: 'moved',
        rule: '6.7',
        player: player.id,
        from: player.hex,
        to,
        cost: option.cost,
        hexesLeft,
      },
    ],
  ]
}

/** The definition id of a card in the current hand. */
function findCard(state: GameState, cardId: string): string {
  const card = currentPlayer(state).hand.find((c) => c.id === cardId)
  if (!card) throw new Error(`Card "${cardId}" is not in hand`)
  return card.def
}
