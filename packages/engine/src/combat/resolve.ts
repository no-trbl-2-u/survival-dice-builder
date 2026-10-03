import type { Face } from '@survival/content'
import { clearTable } from '../deck/deck.ts'
import { rollDice } from '../dice/dice.ts'
import type { GameEvent } from '../events/events.ts'
import { hexDistance } from '../hex.ts'
import { adjacent, sameHex } from '../map/tiles.ts'
import { firedUses } from '../skills/assign.ts'
import {
  currentPlayer,
  enemyDef,
  skillDef,
  updateCurrentPlayer,
  type Step,
} from '../state/helpers.ts'
import type { Enemy, GameState, QueuedEffect } from '../state/types.ts'
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
 * The enemies a Skill can hit now: within its range of the player. In a skirmish only the
 * enemy in the entered hex can be hit (6.11).
 *
 * @rule 7.8 step 7, 6.11, Table 3, Table 9
 */
export function enemiesInRange(state: GameState, range: number): Enemy[] {
  const skirmish = state.exchange?.skirmish
  if (skirmish) return state.enemies.filter((e) => sameHex(e.hex, skirmish.hex))
  const from = currentPlayer(state).hex
  return state.enemies.filter((e) => hexDistance(from, e.hex) <= range)
}

/**
 * Confirms the dice on the Skill board: every full Skill use fires, in board order. The card
 * damage bonus (+N damage) is added to the first damage Skill that fires (OPEN-QUESTIONS
 * row 22). Then the effects resolve; a single-target damage Skill waits for a target when more
 * than 1 enemy is in its range.
 *
 * @rule 7.8 step 7, 6.11
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
 * an empty queue the exchange (or skirmish) finishes.
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
      const [done, more] = exchange.skirmish ? finishSkirmish(current) : finishExchange(current)
      return [done, [...events, ...more]]
    }
    const effect = skillDef(current, head.skill).effect
    let target: string | null = null
    if (effect.kind === 'damage' && effect.target === 'one') {
      const targets = enemiesInRange(current, effect.range)
      if (targets.length > 1) {
        return [updateExchange(current, (e) => ({ ...e, step: 'targets' })), events]
      }
      target = targets[0]?.id ?? null
    }
    const popped = updateExchange(current, (e) => ({ ...e, queue: rest }))
    const [after, more] = resolveEffect(popped, head, target)
    current = after
    events.push(...more)
  }
}

/**
 * The legal targets of the Skill at the head of the queue.
 *
 * @rule 7.8 step 7
 */
export function pendingTargets(state: GameState): Enemy[] {
  const head = state.exchange?.queue[0]
  if (!head) return []
  const effect = skillDef(state, head.skill).effect
  return effect.kind === 'damage' ? enemiesInRange(state, effect.range) : []
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
      for (const enemy of enemiesInRange(state, effect.range)) {
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
 * Each listed enemy attacks the current player once: grunts deal a fixed amount; elites roll
 * dice on the enemy die table. Damage goes to guard first, then health. "Ignore 1 hit" (Dodge)
 * skips whole attacks.
 *
 * @rule 7.8 steps 8-9, 6.12, 9.5, 9.6, Table 4
 */
function enemyAttacks(state: GameState, attackers: readonly Enemy[], rule: string): Step {
  const playerId = currentPlayer(state).id
  const events: GameEvent[] = []
  let current = state
  let ignore = state.exchange?.ignoreHits ?? 0
  for (const enemy of attackers) {
    if (ignore > 0) {
      ignore -= 1
      events.push({
        type: 'hitIgnored',
        rule: `${rule}, Table 9`,
        enemy: enemy.id,
        player: playerId,
      })
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
      rule: def.attack.kind === 'fixed' ? `${rule}, 9.5` : `${rule}, 9.6`,
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
  return [current, events]
}

/** Ends the run when the current player is at 0 health. @rule 14.2 */
function checkPlayerDown(state: GameState, events: GameEvent[]): GameState {
  if (currentPlayer(state).health > 0) return state
  events.push({ type: 'runEnded', rule: '14.2', because: 'player', round: state.round })
  return { ...state, phase: 'ended', endedBecause: 'player', active: null }
}

/**
 * Steps 8-10 of an exchange: each enemy next to the player attacks, guard is removed, and
 * played cards go to the discard pile. A player at 0 health ends the run.
 *
 * @rule 7.8 steps 8-10, 14.2
 */
export function finishExchange(state: GameState): Step {
  const player = currentPlayer(state)
  const attackers = state.enemies.filter((e) => adjacent(e.hex, player.hex))
  const [attacked, events] = enemyAttacks(state, attackers, '7.8')
  const out: GameEvent[] = [...events, { type: 'exchangeEnded', rule: '7.8', player: player.id }]
  let current: GameState = {
    ...updateCurrentPlayer(attacked, (p) => clearTable({ ...p, guard: 0 })),
    exchange: null,
  }
  current = checkPlayerDown(current, out)
  return [current, out]
}

/**
 * The end of a skirmish: the enemy in the entered hex attacks 1 time (if it is still there),
 * guard is removed, and the figure moves in only if that enemy is defeated; otherwise it stays
 * and the rest of the Move is lost.
 *
 * @rule 6.12, 6.13, 6.14, 14.2
 */
export function finishSkirmish(state: GameState): Step {
  const skirmish = state.exchange?.skirmish
  if (!skirmish) throw new Error('No skirmish in progress')
  const player = currentPlayer(state)
  const attackers = state.enemies.filter((e) => sameHex(e.hex, skirmish.hex))
  const [attacked, events] = enemyAttacks(state, attackers, '6.12')
  const won = !attacked.enemies.some((e) => sameHex(e.hex, skirmish.hex))
  let current: GameState = {
    ...updateCurrentPlayer(attacked, (p) => ({ ...p, guard: 0, hex: won ? skirmish.hex : p.hex })),
    exchange: null,
  }
  const loseMove = current.config.rulings.skirmishFail === 'stay-lose-move'
  if (!won && loseMove && current.active?.kind === 'move') current = { ...current, active: null }
  const out: GameEvent[] = [
    ...events,
    { type: 'skirmishEnded', rule: won ? '6.13' : '6.14', player: player.id, won },
  ]
  if (won) {
    out.push({
      type: 'moved',
      rule: '6.13',
      player: player.id,
      from: skirmish.from,
      to: skirmish.hex,
      cost: 0,
      hexesLeft: current.active?.kind === 'move' ? current.active.hexesLeft : 0,
    })
  }
  current = checkPlayerDown(current, out)
  return [current, out]
}
