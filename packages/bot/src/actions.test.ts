import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { ofType } from './actions.ts'

/** The round 1 Prepare actions: play and discard cards, mixed. */
function prepareActions() {
  const s = createGame(defaultContent.config, 1)
  return legalActions(applyAction(s, legalActions(s)[0]!).state)
}

describe('ofType', () => {
  it('keeps only the actions of one type, in legalActions order', () => {
    const actions = prepareActions()
    const plays = ofType(actions, 'playCard')
    expect(plays.length).toBeGreaterThan(0)
    expect(plays.every((a) => a.type === 'playCard')).toBe(true)
    expect(plays).toEqual(actions.filter((a) => a.type === 'playCard'))
    const discards = ofType(actions, 'discardCard')
    expect(discards.length).toBeGreaterThan(0)
    expect(plays.length + discards.length).toBe(actions.length)
  })

  it('returns an empty list when no action has the type', () => {
    expect(ofType(prepareActions(), 'buyCard')).toEqual([])
    expect(ofType([], 'playCard')).toEqual([])
  })

  it('does not change the list it reads', () => {
    const actions = prepareActions()
    const before = [...actions]
    ofType(actions, 'playCard')
    expect(actions).toEqual(before)
  })
})
