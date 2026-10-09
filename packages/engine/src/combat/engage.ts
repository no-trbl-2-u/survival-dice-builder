import type { CombatOption } from '@survival/content'
import { clearTable, discardFromHand, playToTable } from '../deck/deck.ts'
import { rerollUnkept, rollDice } from '../dice/dice.ts'
import { byAge } from '../enemies/movement.ts'
import { adjacentStructures, damageBase } from '../enemies/structures.ts'
import { damageDefense } from '../build/defenses.ts'
import type { GameEvent } from '../events/events.ts'
import { onBaseTile } from '../map/base.ts'
import { legalPlacements } from '../skills/assign.ts'
import { adjacent, sameHex } from '../map/tiles.ts'
import { nextInt } from '../rng/rng.ts'
import {
  cardDef,
  currentPlayer,
  enemyDef,
  skillDef,
  updateCurrentPlayer,
  type Step,
} from '../state/helpers.ts'
import type { Enemy, EnemyDieRoll, GameState } from '../state/types.ts'
import { applyBottomEffect, healCurrent, updateExchange } from './cardEffects.ts'
import { knockOut } from './knockout.ts'

/** True when Combat is played as Combat v3 engagements. @rule Combat v3 */
export function engageMode(state: GameState): boolean {
  return state.config.combat.model === 'engage'
}

/**
 * The Combat-side options of a card (Combat v3). A card without its own list offers Engage.
 *
 * @rule Combat v3
 */
export function combatOptions(state: GameState, defId: string): readonly CombatOption[] {
  return cardDef(state, defId).combat ?? [{ kind: 'engage' }]
}

/** True when an enemy is an elite: it rolls dice on the enemy die table (Table 5). */
function isElite(state: GameState, enemy: Enemy): boolean {
  return enemyDef(state, enemy.kind).attack.kind === 'dice'
}

/** Rolls the enemy dice: 1 per grunt, `eliteDice` per elite. Never rerolled. */
function rollEnemyDice(
  state: GameState,
  rng: number,
  enemies: readonly Enemy[],
): readonly [EnemyDieRoll[], number] {
  const faces = state.config.combat.engage.enemyDie
  const out: EnemyDieRoll[] = []
  let current = rng
  for (const enemy of enemies) {
    const count = isElite(state, enemy) ? state.config.combat.engage.eliteDice : 1
    for (let i = 0; i < count; i++) {
      const [index, next] = nextInt(current, faces.length)
      current = next
      out.push({ enemy: enemy.id, face: faces[index] ?? 'miss' })
    }
  }
  return [out, current]
}

/**
 * Plays a card's Engage option, from anywhere: the card goes on the table, every enemy next to
 * the player rolls its enemy dice (an enemy further away rolls nothing), and the player rolls
 * their action dice (roll 1). The exchange machinery runs the rest: keep and reroll, add cards,
 * put dice on Skills; each fired Skill then picks its target in its own range.
 *
 * @rule Combat v3 (engagement steps 1-2)
 */
export function startEngagement(state: GameState, card: string): Step {
  const player = currentPlayer(state)
  const near = byAge(state.enemies).filter((e) => adjacent(e.hex, player.hex))
  const [enemyDice, afterEnemy] = rollEnemyDice(state, state.rng, near)
  const [faces, rng] = rollDice(afterEnemy, player.dice)
  const played = updateCurrentPlayer(state, (p) => playToTable(p, card))
  return [
    {
      ...played,
      rng,
      exchange: {
        step: 'roll',
        dice: faces.map((face) => ({ face, kept: false })),
        rollsUsed: 1,
        rerollsLeft: 0,
        rerolled: [],
        bonusDamage: 0,
        ignoreHits: 0,
        assignments: [],
        queue: [],
        skirmish: null,
        engage: { enemyDice },
      },
    },
    [
      { type: 'cardPlayed', rule: 'Combat v3', player: player.id, card, half: 'bottom' },
      { type: 'engaged', rule: 'Combat v3', player: player.id, card, enemyDice },
      { type: 'diceRolled', rule: 'Combat v3', player: player.id, faces, roll: 1 },
    ],
  ]
}

/** "Reroll all dice" in an engagement: every die not yet used on a Skill rolls again. */
function rerollFree(state: GameState): Step {
  const exchange = state.exchange
  if (!exchange) return [state, []]
  const used = new Set(exchange.assignments.map((a) => a.die))
  const [rolled, rng] = rerollUnkept(
    state.rng,
    exchange.dice.map((d, i) => ({ ...d, kept: used.has(i) })),
  )
  const dice = rolled.map((d, i) => ({ ...d, kept: exchange.dice[i]?.kept ?? false }))
  const player = currentPlayer(state).id
  return [
    { ...updateExchange(state, (e) => ({ ...e, dice })), rng },
    dice.flatMap((d, die) =>
      used.has(die)
        ? []
        : [{ type: 'dieRerolled' as const, rule: 'Combat v3', player, die, face: d.face }],
    ),
  ]
}

/**
 * Plays a card's non-Engage option. Inside an engagement (reroll, heal) the card goes on the
 * table and adds to the engagement; outside one (move, heal, repair) it is discarded and its
 * effect resolves.
 *
 * @rule Combat v3
 */
export function playOption(state: GameState, card: string, option: CombatOption): Step {
  const player = currentPlayer(state)
  const played: GameEvent = {
    type: 'cardPlayed',
    rule: 'Combat v3',
    player: player.id,
    card,
    half: 'bottom',
  }
  if (state.exchange) {
    const tabled = updateCurrentPlayer(state, (p) => playToTable(p, card))
    const [after, events] =
      option.kind === 'reroll' && option.dice === 'all'
        ? rerollFree(tabled)
        : option.kind === 'reroll'
          ? applyBottomEffect(tabled, { kind: 'reroll', dice: option.dice })
          : option.kind === 'heal'
            ? healCurrent(tabled, option.amount, 'Combat v3')
            : [tabled, []]
    return [after, [played, ...events]]
  }
  const discarded = updateCurrentPlayer(state, (p) => discardFromHand(p, card))
  switch (option.kind) {
    case 'move':
      return [
        {
          ...discarded,
          active: { kind: 'move', hexesLeft: option.hexes, ignoreEnemyCost: false },
        },
        [played],
      ]
    case 'heal': {
      const [after, events] = healCurrent(discarded, option.amount, 'Combat v3')
      return [after, [played, ...events]]
    }
    case 'repair': {
      const [after, events] = repair(discarded, option.amount)
      return [after, [played, ...events]]
    }
    case 'engage':
    case 'reroll':
      return [discarded, [played]]
  }
}

/**
 * Repair: on the Base tile the base gets `amount` health back (up to its maximum); elsewhere
 * the most damaged defense on or next to the player's hex does. Nothing to repair: no effect.
 *
 * @rule Combat v3 (Build card Combat side)
 */
export function repair(state: GameState, amount: number): Step {
  const player = currentPlayer(state)
  if (onBaseTile(state, player.hex) && state.base.health < state.base.maxHealth) {
    const health = Math.min(state.base.maxHealth, state.base.health + amount)
    return [
      { ...state, base: { ...state.base, health } },
      [
        {
          type: 'repaired',
          rule: 'Combat v3',
          player: player.id,
          structure: 'base',
          amount: health - state.base.health,
          health,
        },
      ],
    ]
  }
  const damaged = state.defenses
    .filter((d) => sameHex(d.hex, player.hex) || adjacent(d.hex, player.hex))
    .map((d) => ({ d, max: state.content.defenses.find((x) => x.id === d.kind)?.health ?? 0 }))
    .filter(({ d, max }) => d.health < max)
    .sort((a, b) => b.max - b.d.health - (a.max - a.d.health) || a.d.id.localeCompare(b.d.id))[0]
  if (!damaged) return [state, []]
  const health = Math.min(damaged.max, damaged.d.health + amount)
  return [
    {
      ...state,
      defenses: state.defenses.map((d) => (d.id === damaged.d.id ? { ...d, health } : d)),
    },
    [
      {
        type: 'repaired',
        rule: 'Combat v3',
        player: player.id,
        structure: damaged.d.id,
        amount: health - damaged.d.health,
        health,
      },
    ],
  ]
}

/**
 * The enemy dice of the current engagement that will not hit: the indexes into
 * `exchange.engage.enemyDice` whose enemy was defeated during it. Always empty under
 * `combat.engage.defeatedDice: "hit"` (the rule: every die rolled hits, all at once).
 *
 * @rule Combat v3 (designer 2026-10-09)
 */
export function cancelledEnemyDice(state: GameState): number[] {
  const engage = state.exchange?.engage
  if (!engage || state.config.combat.engage.defeatedDice !== 'cancelled') return []
  const alive = new Set(state.enemies.map((e) => e.id))
  return engage.enemyDice.flatMap((roll, i) => (alive.has(roll.enemy) ? [] : [i]))
}

/**
 * The end of an engagement, after the Skills resolved: every enemy die rolled hits the player
 * (Hit and Special faces; guard first, an "ignore 1 hit" skips a die), played cards go to the
 * discard pile, and guard is removed. A player at 0 health is knocked out. Under
 * `defeatedDice: "cancelled"` a die of an enemy defeated during the engagement does not hit
 * and does not use up an "ignore 1 hit".
 *
 * @rule Combat v3 (engagement step 6, designer 2026-10-09), 14.2
 */
export function finishEngagement(state: GameState): Step {
  const engage = state.exchange?.engage
  if (!engage) throw new Error('No engagement in progress')
  const cfg = state.config.combat.engage
  const playerId = currentPlayer(state).id
  const events: GameEvent[] = []
  let current = state
  let ignore = state.exchange?.ignoreHits ?? 0
  const cancelled = new Set(cancelledEnemyDice(state))
  for (const [i, roll] of engage.enemyDice.entries()) {
    const damage =
      roll.face === 'hit' ? cfg.hitDamage : roll.face === 'special' ? cfg.specialDamage : 0
    if (damage === 0) continue
    if (cancelled.has(i)) {
      events.push({
        type: 'enemyDieCancelled',
        rule: 'Combat v3',
        enemy: roll.enemy,
        player: playerId,
      })
      continue
    }
    if (ignore > 0) {
      ignore -= 1
      events.push({ type: 'hitIgnored', rule: 'Combat v3', enemy: roll.enemy, player: playerId })
      continue
    }
    events.push({
      type: 'enemyAttacked',
      rule: 'Combat v3',
      enemy: roll.enemy,
      player: playerId,
      damage,
    })
    const player = currentPlayer(current)
    const toGuard = Math.min(player.guard, damage)
    const health = Math.max(0, player.health - (damage - toGuard))
    current = updateCurrentPlayer(current, (p) => ({ ...p, guard: p.guard - toGuard, health }))
    events.push({
      type: 'playerDamaged',
      rule: 'Combat v3',
      player: playerId,
      toGuard,
      toHealth: damage - toGuard,
      health,
    })
  }
  events.push({ type: 'exchangeEnded', rule: 'Combat v3', player: playerId })
  current = {
    ...updateCurrentPlayer(current, (p) => clearTable({ ...p, guard: 0 })),
    exchange: null,
  }
  if (currentPlayer(current).health <= 0) {
    const [out, more] = knockOut(current, playerId)
    return [out, [...events, ...more]]
  }
  return [current, events]
}

/**
 * Siege, at the end of Combat (Combat v3 replaces the enemy attack phase): each enemy next to a
 * structure, oldest first, deals `siegeDamage` to it (an elite: `eliteSiegeDamage`) — a
 * Barricade first, then a Tower, then the base. The base at 0 ends the run.
 *
 * @rule Combat v3 (siege), 7.12, 14.1
 */
export function siege(state: GameState): Step {
  const cfg = state.config.combat.engage
  let current = state
  const events: GameEvent[] = []
  for (const { id } of byAge(state.enemies)) {
    if (current.phase === 'ended') break
    const enemy = current.enemies.find((e) => e.id === id)
    if (!enemy) continue
    const structure = adjacentStructures(current, enemy.hex)[0]
    if (!structure) continue
    const damage = isElite(current, enemy) ? cfg.eliteSiegeDamage : cfg.siegeDamage
    if (damage <= 0) continue
    events.push({
      type: 'structureAttacked',
      rule: 'Combat v3 (siege)',
      enemy: enemy.id,
      structure: structure.id,
      damage,
    })
    const [next, more] =
      structure.kind === 'base'
        ? damageBase(current, damage)
        : damageDefense(current, structure.id, damage)
    current = next
    events.push(...more)
  }
  return [current, events]
}

/**
 * True while the player can still do something with the engagement dice: put a die on a Skill,
 * or reroll with a card. Otherwise the engagement ends and the enemy dice hit.
 *
 * @rule Combat v3 (repeat until all dice are resolved)
 */
export function engagementMoves(state: GameState): boolean {
  const exchange = state.exchange
  if (!exchange) return false
  const player = currentPlayer(state)
  const skills = player.skills.map((id) => skillDef(state, id))
  const unlimited = state.config.options.skillUses === 'unlimited'
  if (legalPlacements(exchange.dice, skills, exchange.assignments, unlimited).length > 0) {
    return true
  }
  const free = exchange.dice.some((_, i) => !exchange.assignments.some((a) => a.die === i))
  return (
    free && player.hand.some((c) => combatOptions(state, c.def).some((o) => o.kind === 'reroll'))
  )
}

/** Ends the "add cards" step of an engagement: on to putting dice on Skills. */
export function endCards(state: GameState): Step {
  return [updateExchange(state, (e) => ({ ...e, step: 'assign' })), []]
}
