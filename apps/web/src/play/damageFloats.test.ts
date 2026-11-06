import { defaultContent } from '@survival/content'
import type { GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { damageFloats } from './damageFloats.ts'
import { forceEliteEngagement } from './devEngage.ts'
import { newRun } from './run.ts'

/** A state with enemies on the board: the dev tool's forced elite engagement. */
function stateWithEnemies() {
  const run = forceEliteEngagement(newRun(defaultContent.config, 5))
  expect(run).not.toBeNull()
  const state = run!.state
  expect(state.enemies.length).toBeGreaterThan(0)
  return state
}

describe('damageFloats (the board damage number after a target pick)', () => {
  it('places one float per enemyDamaged event at the enemy hex, with its kind and amount', () => {
    const before = stateWithEnemies()
    const enemy = before.enemies[0]!
    const events: GameEvent[] = [
      { type: 'enemyDamaged', rule: '7.8', enemy: enemy.id, amount: 2, health: 1 },
    ]
    expect(damageFloats(before, events)).toEqual([
      { enemy: enemy.id, hex: enemy.hex, amount: 2, defeated: false, kind: enemy.kind },
    ])
  })

  it('marks the float defeated when the same action defeats the enemy', () => {
    const before = stateWithEnemies()
    const enemy = before.enemies[0]!
    const events: GameEvent[] = [
      { type: 'enemyDamaged', rule: '7.8', enemy: enemy.id, amount: 3, health: 0 },
      { type: 'enemyDefeated', rule: '9.1', enemy: enemy.id, kind: enemy.kind, by: 'p1' },
    ]
    const [float] = damageFloats(before, events)
    expect(float?.defeated).toBe(true)
    expect(float?.hex).toEqual(enemy.hex)
  })

  it('draws nothing for an enemy the state before the action does not have, or for other events', () => {
    const before = stateWithEnemies()
    const events: GameEvent[] = [
      { type: 'enemyDamaged', rule: '7.8', enemy: 'no-such-enemy', amount: 1, health: 0 },
      { type: 'healed', rule: '5.1', player: 'p1', amount: 1, health: 5 },
    ]
    expect(damageFloats(before, events)).toEqual([])
  })

  it('only marks the defeated enemy when one action damages two', () => {
    const state = stateWithEnemies()
    const a = state.enemies[0]!
    const b = { ...a, id: `${a.id}-second`, hex: { q: a.hex.q + 1, r: a.hex.r } }
    const before = { ...state, enemies: [a, b] }
    const events: GameEvent[] = [
      { type: 'enemyDamaged', rule: '7.8', enemy: a.id, amount: 1, health: 1 },
      { type: 'enemyDamaged', rule: '7.8', enemy: b.id, amount: 2, health: 0 },
      { type: 'enemyDefeated', rule: '9.1', enemy: b.id, kind: b.kind, by: 'p1' },
    ]
    expect(damageFloats(before, events).map((f) => [f.enemy, f.defeated])).toEqual([
      [a.id, false],
      [b.id, true],
    ])
    expect(damageFloats(before, events)[1]?.hex).toEqual(b.hex)
  })
})
