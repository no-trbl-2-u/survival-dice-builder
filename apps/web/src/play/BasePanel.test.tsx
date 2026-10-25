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
    expect(screen.getByText('Shop II: out of reach')).toBeTruthy()
  })
})

describe('upgrade tiers no Build card can buy (rules 11.4, 17; row 78)', () => {
  it('reads "out of reach" with the reason, not a price', () => {
    render(<BasePanel state={createGame(defaultContent.config, 1)} legal={[]} act={() => {}} />)
    expect(screen.getByText('Shop I: 4 materials')).toBeTruthy()
    for (const name of ['Shop II', 'Shop III', 'Training II', 'Training III'])
      expect(screen.getByText(`${name}: out of reach`)).toBeTruthy()
    expect(screen.getByTestId('upgrade-reach').textContent).toBe(
      'Out of reach: Build cards can buy only Shop I and Training I.',
    )
    expect(screen.getByTestId('upgrade-hint')).toBeTruthy()
  })

  it('the Build-card hint counts materials with "1 material" singular', () => {
    const game = createGame(defaultContent.config, 1)
    const one = { ...game, players: game.players.map((p) => ({ ...p, materials: 1 })) }
    render(<BasePanel state={one} legal={[]} act={() => {}} />)
    expect(screen.getByTestId('upgrade-hint').textContent).toContain('You have 1 material.')
    cleanup()
    const two = { ...game, players: game.players.map((p) => ({ ...p, materials: 2 })) }
    render(<BasePanel state={two} legal={[]} act={() => {}} />)
    expect(screen.getByTestId('upgrade-hint').textContent).toContain('You have 2 materials.')
  })

  it('drops the Build-card hint once every tier in reach is bought', () => {
    const game = createGame(defaultContent.config, 1)
    const state = { ...game, upgrades: ['shop-1', 'training-1'] }
    render(<BasePanel state={state} legal={[]} act={() => {}} />)
    expect(screen.queryByTestId('upgrade-hint')).toBeNull()
  })

  it('with buildLevels "any" every tier shows its price and no reason', () => {
    const config = {
      ...defaultContent.config,
      rulings: { ...defaultContent.config.rulings, buildLevels: 'any' as const },
    }
    render(<BasePanel state={createGame(config, 1)} legal={[]} act={() => {}} />)
    expect(screen.getByText('Shop II: 6 materials')).toBeTruthy()
    expect(screen.queryByTestId('upgrade-reach')).toBeNull()
  })
})
