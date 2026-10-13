import { clearTable } from '../deck/deck.ts'
import { gainForDefeat } from '../progression/experience.ts'
import type { GameEvent } from '../events/events.ts'
import { hexDistance } from '../hex.ts'
import { byAge, currentTarget } from '../enemies/movement.ts'
import { adjacent } from '../map/tiles.ts'
import { firedUses, isFull } from '../skills/assign.ts'
import { currentPlayer, skillDef, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { Enemy, GameState, QueuedEffect } from '../state/types.ts'
import { healCurrent, updateExchange } from './cardEffects.ts'
import { enemyDieDamage, finishEngagement, rollEnemyDice } from './engage.ts'
import { knockOut } from './knockout.ts'

/**
 * Deals damage to one enemy and removes it at 0 health; its experience and currency are paid
 * (8.1-8.2).
 *
 * @rule 9.1, 7.8 step 7, 8.1, 8.2
 */
export function damageEnemy(
  state: GameState,
  enemyId: string,
  amount: number,
  by: string,
  rule = '7.8',
): Step {
  const enemy = state.enemies.find((e) => e.id === enemyId)
  if (!enemy || amount <= 0) return [state, []]
  const health = Math.max(0, enemy.health - amount)
  const events: GameEvent[] = [{ type: 'enemyDamaged', rule, enemy: enemy.id, amount, health }]
  if (health > 0) {
    return [
      { ...state, enemies: state.enemies.map((e) => (e.id === enemyId ? { ...e, health } : e)) },
      events,
    ]
  }
  events.push({ type: 'enemyDefeated', rule: '9.1', enemy: enemy.id, kind: enemy.kind, by })
  const removed: GameState = { ...state, enemies: state.enemies.filter((e) => e.id !== enemyId) }
  const [rewarded, more] = gainForDefeat(removed, enemy.kind, by)
  return [rewarded, [...events, ...more]]
}

/**
 * The enemies a Skill can hit now: within its range of the player.
 *
 * @rule 7.8 steps 4-5, Table 3, Table 9
 */
export function enemiesInRange(state: GameState, range: number): Enemy[] {
  const from = currentPlayer(state).hex
  return state.enemies.filter((e) => hexDistance(from, e.hex) <= range)
}

/**
 * Confirms the dice on the Skill board: every full Skill use fires, in board order. The card
 * damage bonus (+N damage) is added to the first damage Skill that fires (OPEN-QUESTIONS
 * row 22). Then the effects resolve; a single-target damage Skill waits for a target when more
 * than 1 enemy is in its range.
 *
 * @rule 7.8, 17 (fired Skills)
 */
export function confirmAssignment(state: GameState): Step {
  const exchange = state.exchange
  if (!exchange) throw new Error('No exchange in progress')
  // Combat v3: every full Skill already fired; done using dice, so the enemy dice hit now.
  if (exchange.engage) return finishEngagement(state)
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
  const firedSkills = [...new Set([...state.progress.firedSkills, ...fired.map((f) => f.skill)])]
  const tracked: GameState = { ...state, progress: { ...state.progress, firedSkills } }
  const next = updateExchange(tracked, (e) => ({ ...e, step: 'targets', queue }))
  const [resolved, more] = processQueue(next)
  return [resolved, [...events, ...more]]
}

/**
 * Resolves queued Skill effects until one needs a target choice or the queue is empty. With
 * an empty queue the exchange finishes.
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
      const [done, more] = exchange.engage ? finishEngagement(current) : finishExchange(current)
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
 * Combat v3: the fired Skills still to resolve, each with every target it can hit now (a
 * single-target attack: 1 choice per enemy in its range, or none in range: no effect).
 *
 * @rule Combat v3 (the player resolves dice and Skills in any order)
 */
export function resolveChoices(state: GameState): { skill: string; use: number; enemy?: string }[] {
  return (state.exchange?.queue ?? []).flatMap(({ skill, use }) => {
    const effect = skillDef(state, skill).effect
    if (effect.kind !== 'damage' || effect.target !== 'one') return [{ skill, use }]
    const targets = enemiesInRange(state, effect.range)
    return targets.length === 0
      ? [{ skill, use }]
      : targets.map((e) => ({ skill, use, enemy: e.id }))
  })
}

/**
 * Combat v3: when the dice now fill a Skill use, it fires at once. An attack on 1 enemy with an
 * enemy in its range waits for the player to pick the target (`resolve`); anything else
 * (heal, guard, an attack on each enemy, an attack with no enemy in range) resolves now.
 *
 * @rule Combat v3 (select a die, a Skill, a target; repeat)
 */
export function fireIfFull(state: GameState, skill: string, use: number): Step {
  const def = skillDef(state, skill)
  const exchange = state.exchange
  if (!exchange || !isFull(def, exchange.assignments, use)) return [state, []]
  const player = currentPlayer(state)
  const firedSkills = [...new Set([...state.progress.firedSkills, skill])]
  const fired = updateExchange({ ...state, progress: { ...state.progress, firedSkills } }, (e) => ({
    ...e,
    step: 'resolve',
    queue: [{ skill, use, bonusDamage: 0 }],
  }))
  const events: GameEvent[] = [{ type: 'skillFired', rule: 'Combat v3', player: player.id, skill }]
  const choices = resolveChoices(fired)
  const only = choices.length === 1 ? choices[0] : undefined
  if (only && !only.enemy) {
    const [after, more] = resolveQueued(fired, skill, use, null)
    return [after, [...events, ...more]]
  }
  return [fired, events]
}

/**
 * Combat v3: resolves 1 fired Skill now, on the chosen enemy (single-target attacks).
 *
 * @rule Combat v3 (the player resolves dice and Skills in any order)
 */
export function resolveQueued(
  state: GameState,
  skill: string,
  use: number,
  enemy: string | null,
): Step {
  const queue = state.exchange?.queue ?? []
  const index = queue.findIndex((q) => q.skill === skill && q.use === use)
  const queued = queue[index]
  if (!queued) throw new Error(`Skill "${skill}" is not waiting to resolve`)
  const popped = updateExchange(state, (e) => ({
    ...e,
    step: 'assign',
    queue: e.queue.filter((_, i) => i !== index),
  }))
  return resolveEffect(popped, queued, enemy)
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
 * Each listed enemy (exchange model) rolls its record's enemy dice at the current player; each
 * Hit or Special face deals its damage (Table 4). Damage goes to guard first, then health.
 * "Ignore 1 hit" (Dodge) skips whole attacks.
 *
 * @rule Spec v2 9.5, 9.6, Table 4, Table 5
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
    const [rolls, rng] = rollEnemyDice(current, current.rng, [enemy])
    current = { ...current, rng }
    const damage = rolls.reduce((sum, r) => sum + enemyDieDamage(current, r.face), 0)
    events.push({
      type: 'enemyAttacked',
      rule: `${rule}, 9.5`,
      enemy: enemy.id,
      player: playerId,
      damage,
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

/** Knocks out the current player at 0 health (core loop v2; the run goes on). @rule 14.2 */
function checkPlayerDown(state: GameState, events: GameEvent[]): GameState {
  const player = currentPlayer(state)
  if (player.health > 0) return state
  const [out, more] = knockOut(state, player.id)
  events.push(...more)
  return out
}

/**
 * The enemies that attack the current player at the end of an exchange (exchange model), oldest
 * first: next to the figure and with this player as their target.
 *
 * @rule 7.8, 9.3, 9.5
 */
export function exchangeAttackers(state: GameState): Enemy[] {
  const player = currentPlayer(state)
  return byAge(state.enemies).filter(
    (e) => adjacent(e.hex, player.hex) && currentTarget(state, e)?.id === player.id,
  )
}

/**
 * The end of an exchange (exchange model): each enemy next to the player that targets the
 * player rolls its enemy dice at the player (`exchangeAttackers`), guard is removed, and played
 * cards go to the discard pile. A player at 0 health is knocked out.
 *
 * @rule 7.8, 9.5, 14.2
 */
export function finishExchange(state: GameState): Step {
  const player = currentPlayer(state)
  const [attacked, events] = enemyAttacks(state, exchangeAttackers(state), '7.8')
  const out: GameEvent[] = [...events, { type: 'exchangeEnded', rule: '7.8', player: player.id }]
  let current: GameState = {
    ...updateCurrentPlayer(attacked, (p) => clearTable({ ...p, guard: 0 })),
    exchange: null,
  }
  current = checkPlayerDown(current, out)
  return [current, out]
}
