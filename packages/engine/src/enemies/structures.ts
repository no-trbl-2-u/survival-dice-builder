import { damageDefense } from '../build/defenses.ts'
import { damageEnemy, rollEnemyDamage } from '../combat/resolve.ts'
import type { GameEvent } from '../events/events.ts'
import { hexDistance } from '../hex.ts'
import { canAttackBase } from '../map/base.ts'
import { adjacent } from '../map/tiles.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { byAge } from './movement.ts'

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
 * Combat step 7.6: each Tower (oldest first) gives its damage to the nearest enemy within its
 * range; ties: lowest health, then id.
 *
 * @rule 7.6, 12.3, Table 7
 */
export function towerAttacks(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (const tower of state.defenses) {
    const attack = state.content.defenses.find((d) => d.id === tower.kind)?.attack
    if (!attack) continue
    const target = current.enemies
      .filter((e) => hexDistance(e.hex, tower.hex) <= attack.range)
      .sort(
        (a, b) =>
          hexDistance(a.hex, tower.hex) - hexDistance(b.hex, tower.hex) ||
          a.health - b.health ||
          Number(a.id.slice(1)) - Number(b.id.slice(1)),
      )[0]
    if (!target) continue
    events.push({
      type: 'towerAttacked',
      rule: '12.3',
      tower: tower.id,
      enemy: target.id,
      damage: attack.damage,
    })
    const [next, more] = damageEnemy(current, target.id, attack.damage, tower.id, '12.3')
    current = next
    events.push(...more)
  }
  return [current, events]
}

type StructureKind = 'barricade' | 'tower' | 'base'

/** Structure priority for 7.12: Barricade, then Tower, then the base. */
const STRUCTURE_ORDER: readonly StructureKind[] = ['barricade', 'tower', 'base']

/** The structures next to a hex, in the order an enemy attacks them (7.12; ties: id). */
function adjacentStructures(
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

/**
 * Structure attack step: each enemy (oldest first) that is not next to a player attacks 1
 * adjacent structure — a Barricade first, then a Tower, then the base (next to any Base tile
 * hex, row 16). Damage follows
 * `rulings.structureDamage` (row 7). The base at 0 ends the run (14.1).
 *
 * @rule 7.10, 7.11, 7.12, 12.4, 14.1, OPEN-QUESTIONS row 16
 */
export function structureAttacks(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (const { id } of byAge(state.enemies)) {
    if (current.phase === 'ended') break
    const enemy = current.enemies.find((e) => e.id === id)
    if (!enemy || current.players.some((p) => adjacent(p.hex, enemy.hex))) continue
    const structure = adjacentStructures(current, enemy.hex)[0]
    if (!structure) continue
    const [rolled, damage, faces] = rollEnemyDamage(current, enemy.kind, true)
    events.push({
      type: 'structureAttacked',
      rule: '7.11',
      enemy: enemy.id,
      structure: structure.id,
      damage,
      ...(faces ? { faces } : {}),
    })
    const [next, more] =
      structure.kind === 'base'
        ? damageBase(rolled, damage)
        : damageDefense(rolled, structure.id, damage)
    current = next
    events.push(...more)
  }
  return [current, events]
}
