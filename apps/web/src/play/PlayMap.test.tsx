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
  it('a solo figure is "Your figure"', () => {
    render(<PlayMap state={placed(1)} legal={[]} act={() => {}} />)
    expect(screen.getByLabelText(/^Your figure at /)).toBeTruthy()
  })

  it('a co-op figure names the seat as "Player N", not "PN"', () => {
    render(<PlayMap state={placed(2)} legal={[]} act={() => {}} />)
    expect(screen.getByLabelText(/^Player 1's figure at /)).toBeTruthy()
    expect(screen.getByLabelText(/^Player 2's figure at /)).toBeTruthy()
    expect(screen.queryByLabelText(/^P2's figure/)).toBeNull()
  })
})
