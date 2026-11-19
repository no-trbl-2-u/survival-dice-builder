import { defaultContent } from '@survival/content'
import { createGame, type GameState } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { describeAction } from '../debug/describeAction.ts'
import { materials, upgradeBuyLabel } from './upgradeLabel.ts'

/** A solo run with a Build of `level` active on the base, less `costReduction`. */
function building(costReduction: number, level: number): GameState {
  const game = createGame(defaultContent.config, 1)
  return {
    ...game,
    active: { kind: 'build', buildsLeft: 1, costReduction, level },
    players: game.players.map((p) => ({ ...p, materials: 10 })),
  }
}

describe('upgrade Buy labels (rules 11.2, 11.4)', () => {
  it('counts materials with "1 material" singular', () => {
    expect(materials(1)).toBe('1 material')
    expect(materials(0)).toBe('0 materials')
    expect(materials(4)).toBe('4 materials')
  })

  it('a plain Build reads the list price', () => {
    const state = building(0, 1)
    expect(upgradeBuyLabel(state, 'shop-1')).toBe('Buy Shop I (4 materials)')
    expect(upgradeBuyLabel(state, 'training-1')).toBe('Buy Training I (3 materials)')
  })

  it('an Engineer Build reads the price the engine charges after the cut', () => {
    const state = building(2, 2)
    expect(upgradeBuyLabel(state, 'shop-1')).toBe('Buy Shop I (2 materials)')
    expect(upgradeBuyLabel(state, 'training-1')).toBe('Buy Training I (1 material)')
  })

  it('the banner button reads the same as the Base panel button, price and all', () => {
    const state = building(2, 2)
    const action = { type: 'buyUpgrade', upgrade: 'training-1' } as const
    expect(describeAction(action, state)).toBe('Buy Training I (1 material)')
    expect(describeAction(action, state)).not.toContain('upgrade')
  })

  it('with no Build active it falls back to the list price', () => {
    expect(upgradeBuyLabel(createGame(defaultContent.config, 1), 'shop-1')).toBe(
      'Buy Shop I (4 materials)',
    )
  })
})
