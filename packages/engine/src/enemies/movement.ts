import type { GameEvent } from '../events/events.ts'
import { hexDistance, type Axial } from '../hex.ts'
import type { Step } from '../state/helpers.ts'
import type { Enemy, GameState } from '../state/types.ts'
import { pathNextTo } from './pathing.ts'
import { rankTargets, type Target } from './targets.ts'

/** Enemies in the order they act: oldest first (lowest id number, row 34). @rule 7.5, 7.11 */
export function byAge(enemies: readonly Enemy[]): Enemy[] {
  return [...enemies].sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)))
}

/**
 * Where 1 enemy goes: toward the first-ranked target it can reach. An enemy next to that
 * target stays (9.4; the path is empty). If every path to it is blocked it tries the next
 * (9.7, `blockedPathRule: "next-target"`); with `"wait"` it waits. No reachable target: null.
 *
 * @rule 9.3, 9.4, 9.7
 */
export function chooseRoute(
  state: GameState,
  enemy: Enemy,
): Readonly<{ target: Target; path: readonly Axial[] }> | null {
  const ranked = rankTargets(state, enemy.hex)
  const first = ranked[0]
  if (!first) return null
  // Next to the target, or on an outer Base tile hex with the base as target (row 16): stay.
  if (hexDistance(first.hex, enemy.hex) <= 1) return { target: first, path: [] }
  const candidates = state.config.rulings.blockedPathRule === 'wait' ? [first] : ranked
  for (const target of candidates) {
    const path = pathNextTo(state, enemy.hex, target.hex)
    if (path) return { target, path }
  }
  return null
}

/**
 * The target an enemy has now, read from the board (no hidden counter): the first-ranked target
 * when it is next to it, else the target its route leads to (9.7). Null when it has none.
 *
 * @rule 9.3, 9.7, core loop v2 (Combat steps 2, 5.4)
 */
export function currentTarget(state: GameState, enemy: Enemy): Target | null {
  return chooseRoute(state, enemy)?.target ?? null
}

/**
 * Combat step 7.5: each enemy, oldest first, moves up to `combat.enemyMoveHexes` hexes toward
 * its target and stops next to it.
 *
 * @rule 7.5, 9.3, 9.4, 9.7
 */
export function moveEnemies(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (const { id } of byAge(state.enemies)) {
    const enemy = current.enemies.find((e) => e.id === id)
    if (!enemy) continue
    const route = chooseRoute(current, enemy)
    if (!route || route.path.length === 0) continue
    const steps = route.path.slice(0, current.config.combat.enemyMoveHexes)
    const to = steps[steps.length - 1]
    if (!to) continue
    current = {
      ...current,
      enemies: current.enemies.map((e) => (e.id === id ? { ...e, hex: to } : e)),
    }
    events.push({
      type: 'enemyMoved',
      rule: '7.5',
      enemy: id,
      from: enemy.hex,
      to,
      target: route.target.id,
    })
  }
  return [current, events]
}
