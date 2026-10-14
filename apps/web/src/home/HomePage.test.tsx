import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { rulesUrl } from '../decisions/Inline.tsx'
import { HomePage } from './HomePage.tsx'

describe('HomePage', () => {
  it('says that a revealed tile adds enemies at every Combat, and whom enemies head for', () => {
    render(<HomePage />)
    const prepare = screen.getByText(/new tile's spawn nodes add enemies at every Combat\./)
    expect(prepare.textContent).toMatch(
      /Enemies head for the nearest structure, and turn to a player only when the player is at least 2 hexes nearer\./,
    )
  })

  it('names both Combat models the start panel offers', () => {
    render(<HomePage />)
    const combat = screen.getAllByText(/Play Engage to roll/)[0]
    expect(combat?.textContent).toMatch(/This is the Combat in the written rules\./)
    expect(combat?.textContent).toMatch(/Or choose Exchanges, the older Combat kept for playtests/)
    expect(combat?.textContent).not.toMatch(/Exchanges, the Combat in the written rules/)
  })

  it('says how the base and its defenses take damage when Combat ends', () => {
    render(<HomePage />)
    const combat = screen.getAllByText(/Play Engage to roll/)[0]
    expect(combat?.textContent).toMatch(
      /Either way, when Combat ends, each enemy next to a Barricade/,
    )
    expect(combat?.textContent).toMatch(/a grunt deals 1 damage, an elite 3\./)
  })

  it('states the player count and knockout from config', () => {
    render(<HomePage />)
    expect(screen.getAllByText(/knocked out and comes back next round with half/)[0]).toBeTruthy()
    expect(screen.getAllByText(/for 1 to 4 players/)[0]).toBeTruthy()
  })

  it('says how levels, the Shop and the Skill draft work, with numbers from config', () => {
    render(<HomePage />)
    expect(screen.getAllByText(/Level 2 needs 3 experience/)[0]).toBeTruthy()
    expect(screen.getAllByText(/Buy Shop I on the base .* 4 materials/)[0]).toBeTruthy()
    expect(
      screen.getAllByText(/Training I \(3 materials\) opens the Training Ground/)[0],
    ).toBeTruthy()
    expect(screen.queryByText(/Level up, buy cards in the Shop, and draft Skills/)).toBeNull()
  })

  it('links the written rules it cites', () => {
    render(<HomePage />)
    const link = screen.getAllByRole('link', { name: 'written rules' })[0]
    expect(link?.getAttribute('href')).toBe(rulesUrl)
    expect(rulesUrl).toMatch(/\/blob\/main\/spec\/01-spec-v2-rules\.md$/)
  })
})
