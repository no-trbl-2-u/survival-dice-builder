import { damageEnemy } from '../combat/resolve.ts'
import type { GameEvent } from '../events/events.ts'
import { hexDistance } from '../hex.ts'
import { canAttackBase } from '../map/base.ts'
import { adjacent } from '../map/tiles.ts'
import type { Step } from '../state/helpers.ts'
import type { Enemy, GameState } from '../state/types.ts'

/**
 * Damages the base. At 0 health the run ends (14.1).
 *
 * @rule 11.1, 14.1
 */
export function damageBase(state: GameState, amount: number): Step {
  const health = Math.max(0, state.base.health - amount)
  const next: GameState = { ...state, base: { ...state.base, health } }
  const events: GameEvent[] = [{ type: 'baseDamaged', rule: '7.11', amount, health }]
  if (health > 0) return [next, events]
  events.push({ type: 'runEnded', rule: '14.1', because: 'base', round: state.round })
  return [{ ...next, phase: 'ended', endedBecause: 'base', active: null }, events]
}

/**
 * The enemies a Tower may shoot now: those within its range at the smallest distance. More
 * than 1 is a tie the players decide (row 35).
 *
 * @rule 12.3, Table 7, OPEN-QUESTIONS row 35
 */
export function towerTargets(state: GameState, towerId: string): Enemy[] {
  const tower = state.defenses.find((d) => d.id === towerId)
  const attack = state.content.defenses.find((d) => d.id === tower?.kind)?.attack
  if (!tower || !attack) return []
  const inRange = state.enemies.filter((e) => hexDistance(e.hex, tower.hex) <= attack.range)
  const nearest = Math.min(...inRange.map((e) => hexDistance(e.hex, tower.hex)))
  return inRange.filter((e) => hexDistance(e.hex, tower.hex) === nearest)
}

/**
 * The Tower at the head of `towerQueue` shoots `enemyId`, and leaves the queue. A defeat pays
 * currency to the Tower's builder (rows 40, 53).
 *
 * @rule 7.6, 12.3, Table 7, OPEN-QUESTIONS rows 40, 53
 */
export function towerShoots(state: GameState, enemyId: string): Step {
  const [towerId, ...rest] = state.towerQueue
  const tower = state.defenses.find((d) => d.id === towerId)
  const attack = state.content.defenses.find((d) => d.id === tower?.kind)?.attack
  const popped: GameState = { ...state, towerQueue: rest }
  if (!tower || !attack) return [popped, []]
  const [next, events] = damageEnemy(popped, enemyId, attack.damage, tower.id, '12.3')
  return [
    next,
    [
      {
        type: 'towerAttacked',
        rule: '12.3',
        tower: tower.id,
        enemy: enemyId,
        damage: attack.damage,
      },
      ...events,
    ],
  ]
}

/**
 * Combat start, after spawning: each Tower in `towerQueue` (oldest first) shoots the nearest
 * enemy within its range. When 2 or more are equally near, the queue stops and the Tower's
 * builder chooses (`chooseTowerTarget`, row 35); the builder's seat becomes current. When the
 * queue is empty, seat 1 is current again for the exchanges.
 *
 * @rule 7.6, 12.3, Table 7, OPEN-QUESTIONS row 35
 */
export function towerAttacks(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (;;) {
    const head = current.towerQueue[0]
    if (!head) return [{ ...current, current: 0 }, events]
    const targets = towerTargets(current, head)
    if (targets.length > 1) {
      const builder = current.defenses.find((d) => d.id === head)?.builder
      const seat = current.players.findIndex((p) => p.id === builder)
      return [{ ...current, current: seat >= 0 ? seat : 0 }, events]
    }
    const target = targets[0]
    const [next, more] = target
      ? towerShoots(current, target.id)
      : [{ ...current, towerQueue: current.towerQueue.slice(1) }, []]
    current = next
    events.push(...more)
  }
}

type StructureKind = 'barricade' | 'tower' | 'base'

/** Structure priority for 7.12: Barricade, then Tower, then the base. */
const STRUCTURE_ORDER: readonly StructureKind[] = ['barricade', 'tower', 'base']

/** The structures next to a hex, in the order an enemy attacks them (7.12; ties: id). */
export function adjacentStructures(
  state: GameState,
  hex: GameState['enemies'][number]['hex'],
): { id: string; kind: StructureKind }[] {
  const defenses = state.defenses
    .filter((d) => adjacent(d.hex, hex))
    .map((d) => {
      const blocks = state.content.defenses.find((x) => x.id === d.kind)?.blocksEnemies
      const kind: StructureKind = blocks ? 'barricade' : 'tower'
      return { id: d.id, kind }
    })
  const base = canAttackBase(state, hex) ? [{ id: 'base', kind: 'base' as StructureKind }] : []
  return [...defenses, ...base].sort(
    (a, b) =>
      STRUCTURE_ORDER.indexOf(a.kind) - STRUCTURE_ORDER.indexOf(b.kind) || a.id.localeCompare(b.id),
  )
}
