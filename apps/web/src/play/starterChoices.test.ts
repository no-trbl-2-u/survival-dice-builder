import { defaultContent } from '@survival/content'
import { createGame, type GameState } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { starterChoices } from './starterChoices.ts'

/** A started run with the current player's deck and discard swapped for the given cards. */
function withCards(cards: readonly [string, string][]): GameState {
  const state = createGame(defaultContent.config, 1)
  const player = state.players[state.current]!
  const owned = cards.map(([id, def]) => ({ id, def }))
  return {
    ...state,
    players: state.players.map((p) =>
      p.id === player.id ? { ...p, deck: owned.slice(0, 2), discard: owned.slice(2) } : p,
    ),
  }
}

describe('starterChoices', () => {
  it('gives one choice per card kind, counts the copies, and keeps the first copy', () => {
    const starters = defaultContent.cards.filter((c) => c.level === 0)
    const [a, b] = [starters[0]!, starters[1]!]
    const state = withCards([
      ['c1', a.id],
      ['c2', b.id],
      ['c3', a.id],
    ])
    const returns = ['c1', 'c2', 'c3'].map((card) => ({ type: 'returnStarter' as const, card }))
    const choices = starterChoices(state, returns)
    expect(choices.map((c) => [c.def.id, c.copies, c.action.card])).toEqual([
      [a.id, 2, 'c1'],
      [b.id, 1, 'c2'],
    ])
  })

  it('skips a card id the player does not own', () => {
    const state = withCards([])
    expect(starterChoices(state, [{ type: 'returnStarter', card: 'nope' }])).toEqual([])
  })
})
