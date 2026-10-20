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

  it('says what a player starts with and how a round turns over, before how a run goes', () => {
    render(<HomePage />)
    expect(screen.getAllByRole('heading', { name: 'What you have' })[0]).toBeTruthy()
    const start = screen.getAllByText(/^Each player starts with 15 health, 1 action die/)[0]
    expect(start?.textContent).toMatch(
      /Your deck holds 10 cards: 4 Move, 4 Gather, 1 Build and 1 Rest\./,
    )
    expect(start?.textContent).toMatch(/the top half is for Prepare, the bottom half for Combat\./)
    expect(screen.getAllByText(/^Each round is Prepare, then Combat/)[0]?.textContent).toMatch(
      /When 2 or more play, you share one screen/,
    )
  })

  it('names both Combat models the start panel offers', () => {
    render(<HomePage />)
    const combat = screen.getAllByText(
      /Play a card's Engage option \(on Move and Gather\) to roll/,
    )[0]
    expect(combat?.textContent).toMatch(/This is the Combat in the written rules \(on GitHub\)\./)
    expect(combat?.textContent).toMatch(
      /\(on GitHub\)\. Before a run, you can choose Exchanges instead, the older Combat kept for playtests\. In each exchange you roll, play cards and fire Skills\. Then each enemy/,
    )
    expect(combat?.textContent).not.toMatch(/[;:] (in each exchange|then each enemy)/)
    expect(combat?.textContent).not.toMatch(/Exchanges, the Combat in the written rules/)
  })

  it('says how the base and its defenses take damage when Combat ends', () => {
    render(<HomePage />)
    const combat = screen.getAllByText(
      /Play a card's Engage option \(on Move and Gather\) to roll/,
    )[0]
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

  it('says the game is co-op: every player defends one base', () => {
    render(<HomePage />)
    expect(
      screen.getAllByText(
        /A co-op survival dice-builder for 1 to 4 players on one screen: all players defend one base\./,
      )[0],
    ).toBeTruthy()
  })

  it('says how levels, the Shop and the Skill draft work, with numbers from config', () => {
    render(<HomePage />)
    expect(screen.getAllByText(/Level 2 needs 3 experience/)[0]).toBeTruthy()
    expect(
      screen.getAllByText(/Stand on the Base tile and buy Shop I .* 4 materials/)[0],
    ).toBeTruthy()
    expect(
      screen.getAllByText(
        /Stand on the Base tile and buy Training I \(a Build card and 3 materials\)/,
      )[0],
    ).toBeTruthy()
    expect(screen.queryByText(/Level up, buy cards in the Shop, and draft Skills/)).toBeNull()
  })

  it('links the Decisions page from the Also line', () => {
    render(<HomePage />)
    const link = screen.getAllByRole('link', { name: 'the open rules questions' })[0]
    expect(link?.getAttribute('href')).toBe('/decisions')
    expect(screen.queryByText(/wait on you/)).toBeNull()
  })

  it('names the tiles on the Also line as the map tiles, not proposed ones', () => {
    render(<HomePage />)
    const link = screen.getAllByRole('link', { name: 'the map tiles' })[0]
    expect(link?.getAttribute('href')).toBe('/tiles')
    expect(screen.queryByText(/proposed tiles/)).toBeNull()
  })

  it('links the written rules it cites, and says the link leaves the site for GitHub', () => {
    render(<HomePage />)
    const link = screen.getAllByRole('link', { name: 'written rules' })[0]
    expect(link?.getAttribute('href')).toBe(rulesUrl)
    expect(link?.nextSibling?.textContent).toMatch(/^ \(on GitHub\)\./)
    expect(rulesUrl).toMatch(/\/blob\/main\/spec\/01-spec-v2-rules\.md$/)
  })
})
