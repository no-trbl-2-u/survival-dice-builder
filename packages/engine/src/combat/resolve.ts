import type { Face } from '@survival/content'
import { clearTable } from '../deck/deck.ts'
import { rollDice } from '../dice/dice.ts'
import type { GameEvent } from '../events/events.ts'
import { firedUses } from '../skills/assign.ts'
import {
  currentPlayer,
  enemyDef,
  skillDef,
  updateCurrentPlayer,
  type Step,
} from '../state/helpers.ts'
import type { GameState, QueuedEffect } from '../state/types.ts'
import { healCurrent, updateExchange } from './cardEffects.ts'

/**
 * Deals damage to one enemy and removes it at 0 health.
 * Experience and currency for the defeat arrive in phase 8.
 *
 * @rule 9.1, 7.8 step 7
 */
export function damageEnemy(state: GameState, enemyId: string, amount: number, by: string): Step {
  const enemy = state.enemies.find((e) => e.id === enemyId)
  if (!enemy || amount <= 0) return [state, []]
  const health = Math.max(0, enemy.health - amount)
  const events: GameEvent[] = [
    { type: 'enemyDamaged', rule: '7.8', enemy: enemy.id, amount, health },
  ]
  if (health > 0) {
    return [
      { ...state, enemies: state.enemies.map((e) => (e.id === enemyId ? { ...e, health } : e)) },
      events,
    ]
  }
  events.push({ type: 'enemyDefeated', rule: '9.1', enemy: enemy.id, kind: enemy.kind, by })
  return [{ ...state, enemies: state.enemies.filter((e) => e.id !== enemyId) }, events]
}

/**
 * Confirms the dice on the Skill board: every full Skill use fires, in board order. The card
 * damage bonus (+N damage) is added to the first damage Skill that fires (OPEN-QUESTIONS
 * row 22). Then the effects resolve; a single-target damage Skill waits for a target when more
 * than 1 enemy is in range.
 *
 * @rule 7.8 step 7
 */
export function confirmAssignment(state: GameState): Step {
  const exchange = state.exchange
  if (!exchange) throw new Error('No exchange in progress')
  const player = currentPlayer(state)
  const skills = player.skills.map((id) => skillDef(state, id))
  const fired = firedUses(skills, exchange.assignments)
  let bonusLeft = exchange.bonusDamage
  const queue: QueuedEffect[] = fired.map(({ skill, use }) => {
    const isDamage = skillDef(state, skill).effect.kind === 'damage'
    const bonusDamage = isDamage ? bonusLeft : 0
    if (isDamage) bonusLeft = 0
    return { skill, use, bonusDamage }
  })
  const events: GameEvent[] = fired.map(({ skill }) => ({
    type: 'skillFired',
    rule: '7.8',
    player: player.id,
    skill,
  }))
  const next = updateExchange(state, (e) => ({ ...e, step: 'targets', queue }))
  const [resolved, more] = processQueue(next)
  return [resolved, [...events, ...more]]
}

/**
 * Resolves queued Skill effects until one needs a target choice or the queue is empty. With
 * an empty queue the exchange finishes (enemy attacks, damage, cleanup).
 *
 * @rule 7.8 steps 7-10
 */
export function processQueue(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (;;) {
    const exchange = current.exchange
    if (!exchange) return [current, events]
    const [head, ...rest] = exchange.queue
    if (!head) {
      const [done, more] = finishExchange(current)
      return [done, [...events, ...more]]
    }
    const effect = skillDef(current, head.skill).effect
    if (effect.kind === 'damage' && effect.target === 'one' && current.enemies.length > 1) {
      return [updateExchange(current, (e) => ({ ...e, step: 'targets' })), events]
    }
    const popped = updateExchange(current, (e) => ({ ...e, queue: rest }))
    const [after, more] = resolveEffect(popped, head, current.enemies[0]?.id ?? null)
    current = after
    events.push(...more)
  }
}

/**
 * Applies the target choice for the Skill at the head of the queue, then continues.
 *
 * @rule 7.8 step 7
 */
export function chooseTarget(state: GameState, enemyId: string): Step {
  const exchange = state.exchange
  const head = exchange?.queue[0]
  if (!exchange || !head) throw new Error('No Skill is waiting for a target')
  const popped = updateExchange(state, (e) => ({ ...e, queue: e.queue.slice(1) }))
  const [after, events] = resolveEffect(popped, head, enemyId)
  const [done, more] = processQueue(after)
  return [done, [...events, ...more]]
}

/** Applies one fired Skill's effect. `target` is used by single-target damage only. */
function resolveEffect(state: GameState, queued: QueuedEffect, target: string | null): Step {
  const player = currentPlayer(state)
  const effect = skillDef(state, queued.skill).effect
  switch (effect.kind) {
    case 'damage': {
      const amount = effect.amount + queued.bonusDamage
      if (effect.target === 'one') {
        return target ? damageEnemy(state, target, amount, player.id) : [state, []]
      }
      let current = state
      const events: GameEvent[] = []
      for (const enemy of state.enemies) {
        const [next, more] = damageEnemy(current, enemy.id, amount, player.id)
        current = next
        events.push(...more)
      }
      return [current, events]
    }
    case 'guard': {
      const guard = player.guard + effect.amount
      return [
        updateCurrentPlayer(state, (p) => ({ ...p, guard })),
        [{ type: 'guardGained', rule: '7.8', player: player.id, amount: effect.amount, guard }],
      ]
    }
    case 'heal':
      return healCurrent(state, effect.amount, '7.8')
    case 'ignoreHit':
      return [updateExchange(state, (e) => ({ ...e, ignoreHits: e.ignoreHits + effect.hits })), []]
  }
}

/**
 * Steps 8-10: each enemy next to the player attacks (grunts deal a fixed amount; elites roll
 * dice on the enemy die table), damage goes to guard first and then health, guard is removed,
 * and played cards go to the discard pile. A player at 0 health ends the run.
 * Phase 5 has no map: every enemy in the abstract list counts as next to the player.
 *
 * @rule 7.8 steps 8-10, 9.5, 9.6, 14.2
 */
export function finishExchange(state: GameState): Step {
  const exchange = state.exchange
  if (!exchange) throw new Error('No exchange in progress')
  const playerId = currentPlayer(state).id
  const events: GameEvent[] = []
  let current = state
  let ignore = exchange.ignoreHits
  for (const enemy of state.enemies) {
    if (ignore > 0) {
      ignore -= 1
      events.push({ type: 'hitIgnored', rule: '7.8', enemy: enemy.id, player: playerId })
      continue
    }
    const def = enemyDef(current, enemy.kind)
    let damage: number
    let faces: readonly Face[] | undefined
    if (def.attack.kind === 'fixed') {
      damage = def.attack.damage
    } else {
      const [rolled, rng] = rollDice(current.rng, def.attack.dice)
      current = { ...current, rng }
      faces = rolled
      damage = rolled.reduce((sum, f) => sum + (current.content.enemies.enemyDieDamage[f] ?? 0), 0)
    }
    events.push({
      type: 'enemyAttacked',
      rule: def.attack.kind === 'fixed' ? '9.5' : '9.6',
      enemy: enemy.id,
      player: playerId,
      damage,
      ...(faces ? { faces } : {}),
    })
    const player = currentPlayer(current)
    const toGuard = Math.min(player.guard, damage)
    const toHealth = damage - toGuard
    const health = Math.max(0, player.health - toHealth)
    current = updateCurrentPlayer(current, (p) => ({ ...p, guard: p.guard - toGuard, health }))
    events.push({ type: 'playerDamaged', rule: '7.8', player: playerId, toGuard, toHealth, health })
  }
  current = updateCurrentPlayer(current, (p) => clearTable({ ...p, guard: 0 }))
  current = { ...current, exchange: null }
  events.push({ type: 'exchangeEnded', rule: '7.8', player: playerId })
  if (currentPlayer(current).health <= 0) {
    current = { ...current, phase: 'ended', endedBecause: 'player' }
    events.push({ type: 'runEnded', rule: '14.2', because: 'player', round: current.round })
  }
  return [current, events]
}
