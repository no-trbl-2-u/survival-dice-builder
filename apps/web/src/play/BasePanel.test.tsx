import { defaultContent } from '@survival/content'
import { createGame, type GameState } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BasePanel } from './BasePanel.tsx'

afterEach(cleanup)

/** A solo run with a Build of `level` active on the base, less `costReduction`. */
function building(costReduction: number, level: number): GameState {
  const game = createGame(defaultContent.config, 1)
  return {
    ...game,
    active: { kind: 'build', buildsLeft: 1, costReduction, level },
    players: game.players.map((p) => ({ ...p, materials: 10 })),
  }
}

const legal = [
  { type: 'buyUpgrade', upgrade: 'shop-1' },
  { type: 'buyUpgrade', upgrade: 'training-1' },
] as const

describe('base upgrade prices (rules 11.2, 11.4; row 42)', () => {
  it('a plain Build shows the list price', () => {
    render(<BasePanel state={building(0, 1)} legal={legal} act={() => {}} />)
    expect(screen.getByRole('button', { name: 'Buy Shop I (4 materials)' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Buy Training I (3 materials)' })).toBeTruthy()
  })

  it('an Engineer Build shows the price it charges, with "1 material" singular', () => {
    render(<BasePanel state={building(2, 2)} legal={legal} act={() => {}} />)
    expect(screen.getByRole('button', { name: 'Buy Shop I (2 materials)' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Buy Training I (1 material)' })).toBeTruthy()
    expect(screen.getByText('Shop II: 6 materials')).toBeTruthy()
  })
})
