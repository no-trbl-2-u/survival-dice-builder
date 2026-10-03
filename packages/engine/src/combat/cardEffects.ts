import type { CombatEffect, PrepareEffect } from '@survival/content'
import { rerollUnkept, rollDice } from '../dice/dice.ts'
import type { GameEvent } from '../events/events.ts'
import { currentPlayer, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { Exchange, GameState } from '../state/types.ts'

/**
 * Heals the current player, never above maximum health.
 *
 * @rule 6.7 (Rest), Table 8 (Heal), 2.1
 */
export function healCurrent(state: GameState, amount: number, rule: string): Step {
  const before = currentPlayer(state)
  const health = Math.min(before.maxHealth, before.health + amount)
  const next = updateCurrentPlayer(state, (p) => ({ ...p, health }))
  return [
    next,
    [{ type: 'healed', rule, player: before.id, amount: health - before.health, health }],
  ]
}

/**
 * Applies a card's top half (Prepare). Move, Gather, and Build need the map and base, which
 * arrive in phases 6-8: until then they resolve as `effectDeferred` events and change nothing.
 *
 * @rule 6.2, 6.7
 */
export function applyTopEffect(state: GameState, effect: PrepareEffect): Step {
  const player = currentPlayer(state)
  switch (effect.kind) {
    case 'rest':
      return healCurrent(state, effect.amount, '6.7')
    case 'move':
    case 'gather':
    case 'build':
      return [
        state,
        [
          {
            type: 'effectDeferred',
            rule: '6.7',
            player: player.id,
            effect: effect.kind,
            reason: 'needs the map (phase 6)',
          },
        ],
      ]
  }
}

/** Returns the state with the exchange replaced by `fn(exchange)`. */
export function updateExchange(state: GameState, fn: (e: Exchange) => Exchange): GameState {
  if (!state.exchange) throw new Error('No exchange in progress')
  return { ...state, exchange: fn(state.exchange) }
}

/**
 * Applies one bottom-half (Combat) effect during step 5 of an exchange.
 * A numbered reroll opens the `reroll` decision; "reroll all" rolls every die again at once.
 *
 * @rule 7.8 step 5, Table 2, Table 8
 */
export function applyBottomEffect(state: GameState, effect: CombatEffect): Step {
  const player = currentPlayer(state)
  const exchange = state.exchange
  if (!exchange) throw new Error('No exchange in progress')
  const events: GameEvent[] = []
  switch (effect.kind) {
    case 'reroll': {
      if (effect.dice === 'all') {
        const [dice, rng] = rerollUnkept(
          state.rng,
          exchange.dice.map((d) => ({ ...d, kept: false })),
        )
        dice.forEach((d, i) =>
          events.push({
            type: 'dieRerolled',
            rule: '7.8',
            player: player.id,
            die: i,
            face: d.face,
          }),
        )
        return [{ ...updateExchange(state, (e) => ({ ...e, dice })), rng }, events]
      }
      // "Reroll N dice": N different dice, chosen one at a time (OPEN-QUESTIONS row 23).
      const next = updateExchange(state, (e) => ({
        ...e,
        step: e.dice.length > 0 ? 'reroll' : e.step,
        rerollsLeft: Math.min(Number(effect.dice), e.dice.length),
        rerolled: [],
      }))
      return [next, events]
    }
    case 'damage': {
      const next = updateExchange(state, (e) => ({
        ...e,
        bonusDamage: e.bonusDamage + effect.amount,
      }))
      return [
        next,
        [{ type: 'damageBonus', rule: '7.8', player: player.id, amount: effect.amount }],
      ]
    }
    case 'guard': {
      const guard = player.guard + effect.amount
      const next = updateCurrentPlayer(state, (p) => ({ ...p, guard }))
      return [
        next,
        [{ type: 'guardGained', rule: '7.8', player: player.id, amount: effect.amount, guard }],
      ]
    }
    case 'heal':
      return healCurrent(state, effect.amount, '7.8')
    case 'extraDie': {
      const [faces, rng] = rollDice(state.rng, effect.dice)
      const next = updateExchange(state, (e) => ({
        ...e,
        dice: [...e.dice, ...faces.map((face) => ({ face, kept: false }))],
      }))
      return [{ ...next, rng }, [{ type: 'extraDice', rule: '7.8', player: player.id, faces }]]
    }
  }
}
