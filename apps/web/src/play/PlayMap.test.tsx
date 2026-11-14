import { defaultContent } from '@survival/content'
import { createGame, type GameState } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PlayMap } from './PlayMap.tsx'

afterEach(cleanup)

/** A run of `players` with every figure placed on the map. */
function placed(players: number): GameState {
  const game = createGame(defaultContent.config, 1, defaultContent, { players })
  return { ...game, unplaced: [] }
}

describe('figure names on the map', () => {
  it('a solo figure is "Your figure", named by its place, never by coordinates', () => {
    render(<PlayMap state={placed(1)} legal={[]} act={() => {}} />)
    const label = screen.getByRole('img', { name: /^Your figure on / }).getAttribute('aria-label')
    expect(label).toMatch(/the base center$/)
    expect(label).not.toMatch(/-?\d+,-?\d+/)
  })

  it('a co-op figure names the seat as "Player N", not "PN"', () => {
    render(<PlayMap state={placed(2)} legal={[]} act={() => {}} />)
    expect(screen.getByRole('img', { name: /^Player 1's figure on / })).toBeTruthy()
    expect(screen.getByRole('img', { name: /^Player 2's figure on / })).toBeTruthy()
    expect(screen.queryByLabelText(/^P2's figure/)).toBeNull()
  })
})

describe('defense names on the map', () => {
  it('each defense is an image named by its kind and health', () => {
    const game = placed(1)
    const state: GameState = {
      ...game,
      defenses: [
        { id: 'd1', kind: 'barricade', hex: { q: 1, r: 0 }, health: 3, builder: 'p1' },
        { id: 'd2', kind: 'tower', hex: { q: -1, r: 0 }, health: 2, builder: 'p1' },
      ],
    }
    render(<PlayMap state={state} legal={[]} act={() => {}} />)
    const barricade = state.content.defenses.find((d) => d.id === 'barricade')!.name
    const tower = state.content.defenses.find((d) => d.id === 'tower')!.name
    expect(screen.getByRole('img', { name: `${barricade}, 3 health` })).toBeTruthy()
    expect(screen.getByRole('img', { name: `${tower}, 2 health` })).toBeTruthy()
  })
})
