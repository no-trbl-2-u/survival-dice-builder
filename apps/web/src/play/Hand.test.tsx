import { defaultContent } from '@survival/content'
import { createGame } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Hand } from './Hand.tsx'

afterEach(cleanup)

describe('the Hand heading names whose hand it is (16.3)', () => {
  it('reads "Your hand" solo', () => {
    render(<Hand state={createGame(defaultContent.config, 1)} legal={[]} act={() => {}} />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/^Your hand — /)
  })

  it('reads "Player 2\'s hand" on the second player\'s turn in co-op', () => {
    const game = {
      ...createGame(defaultContent.config, 1, defaultContent, { players: 3 }),
      current: 1,
    }
    render(<Hand state={game} legal={[]} act={() => {}} />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/^Player 2's hand — /)
  })
})
