import { defaultContent } from '@survival/content'
import { createGame } from '@survival/engine'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PlayLog } from './PlayLog.tsx'

afterEach(cleanup)

/** A solo run whose log holds `n` deck shuffles, the k-th with k cards, so each line is unique. */
const withShuffles = (n: number, rule = '7.1') => {
  const state = createGame(defaultContent.config, 1)
  const log = Array.from({ length: n }, (_, i) => ({
    type: 'deckShuffled',
    rule,
    player: state.players[0]?.id,
    cards: i + 1,
  }))
  return { ...state, log } as never
}

const lines = () => within(screen.getByTestId('play-log')).queryAllByRole('listitem')

describe('the /play event log', () => {
  it('is a labelled region with its heading and an empty list before anything happens', () => {
    render(<PlayLog state={withShuffles(0)} />)
    const region = screen.getByRole('region', { name: 'Event log' })
    expect(within(region).getByRole('heading', { level: 2 }).textContent).toBe(
      'What happened (newest first)',
    )
    expect(lines()).toHaveLength(0)
  })

  it('shows the newest line first, each followed by the rule behind it', () => {
    render(<PlayLog state={withShuffles(3)} />)
    expect(lines().map((li) => li.textContent)).toEqual([
      'Your deck shuffled (3 cards). rule 7.1',
      'Your deck shuffled (2 cards). rule 7.1',
      'Your deck shuffled (1 card). rule 7.1',
    ])
  })

  it('keeps only the 60 newest lines in a long run', () => {
    render(<PlayLog state={withShuffles(75)} />)
    const shown = lines()
    expect(shown).toHaveLength(60)
    expect(shown[0]?.textContent).toContain('(75 cards)')
    expect(shown[59]?.textContent).toContain('(16 cards)')
  })

  it('says "not in the written rules" for a tag that names no section', () => {
    render(<PlayLog state={withShuffles(1, 'Combat v3')} />)
    expect(lines()[0]?.textContent).toBe('Your deck shuffled (1 card). not in the written rules')
  })
})
