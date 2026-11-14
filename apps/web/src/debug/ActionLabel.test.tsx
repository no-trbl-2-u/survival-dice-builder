import { defaultContent } from '@survival/content'
import { applyAction, createGame, type Action, type GameState } from '@survival/engine'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ActionLabel } from './ActionLabel.tsx'
import { describeAction } from './describeAction.ts'

const config = defaultContent.config

/** A solo run with the figure placed on the base center, in Prepare with a hand. */
function placed(): GameState {
  return applyAction(createGame(config, 1), { type: 'placeFigure', q: 0, r: 0 }).state
}

function labelOf(action: Action, state: GameState, ids = false) {
  const { container } = render(<ActionLabel action={action} state={state} ids={ids} />)
  return container
}

describe('ActionLabel', () => {
  it('a placement gives the place name, then its map coordinate in a quiet span', () => {
    const state = createGame(config, 1)
    const action: Action = { type: 'placeFigure', q: 0, r: 0 }
    const container = labelOf(action, state)
    const coords = container.querySelectorAll('span.coords')
    expect(coords).toHaveLength(1)
    expect(coords[0]!.textContent).toBe(' (0,0)')
    expect(container.textContent).toBe(`${describeAction(action, state)} (0,0)`)
  })

  it('a move and a build carry their own coordinate, negative numbers included', () => {
    const state = placed()
    const move: Action = { type: 'moveTo', q: 1, r: -1 }
    expect(labelOf(move, state).querySelector('span.coords')!.textContent).toBe(' (1,-1)')
    const build: Action = { type: 'build', q: -1, r: 0, defense: 'barricade' }
    expect(labelOf(build, state).querySelector('span.coords')!.textContent).toBe(' (-1,0)')
  })

  it('an action with no hex gives the label alone, with no coordinate span', () => {
    const state = placed()
    const stop: Action = { type: 'stopMoving' }
    const container = labelOf(stop, state)
    expect(container.querySelector('span.coords')).toBeNull()
    expect(container.textContent).toBe(describeAction(stop, state))
  })

  it('shows engine ids only when asked, as /debug does', () => {
    const state = placed()
    const card = state.players[0]!.hand[0]!.id
    const back: Action = { type: 'returnStarter', card }
    const plain = labelOf(back, state).textContent!
    const withIds = labelOf(back, state, true).textContent!
    expect(plain).not.toContain(`[${card}]`)
    expect(withIds).toContain(`[${card}]`)
    expect(withIds).toBe(describeAction(back, state, { ids: true }))
    expect(plain).toBe(describeAction(back, state))
  })
})
