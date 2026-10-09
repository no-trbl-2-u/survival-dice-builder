import { defaultContent } from '@survival/content'
import { legalActions } from '@survival/engine'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CardStrip, pressMove, stripCards } from './CardStrip.tsx'
import { forceEngagement } from './devEngage.ts'
import { newRun } from './run.ts'

/** An engagement after its rolls, with a card that can be added. */
function usingDice() {
  const config = {
    ...defaultContent.config,
    combat: { ...defaultContent.config.combat, model: 'engage' as const },
  }
  const run = forceEngagement(
    newRun(config, 5),
    (s) => s.exchange?.step === 'assign' && legalActions(s).some((a) => a.type === 'playOption'),
  )
  if (!run) throw new Error('no engagement came up')
  return run.state
}

describe('CardStrip', () => {
  it('lists every card in hand with only its legal options now', () => {
    const state = usingDice()
    const legal = legalActions(state)
    const cards = stripCards(state, legal)
    expect(cards.length).toBe(state.players[state.current]?.hand.length)
    for (const c of cards)
      for (const a of c.plays) expect(legal.some((l) => JSON.stringify(l) === JSON.stringify(a)))
  })

  it('plays a 1-option card on a tap and asks for the option of a 2-option card', () => {
    const state = usingDice()
    const legal = legalActions(state)
    const act = vi.fn()
    const choose = vi.fn()
    render(
      <CardStrip
        state={state}
        legal={legal}
        act={act}
        felt={{ current: null }}
        choose={choose}
        onDrag={() => {}}
        pending={null}
      />,
    )
    const buttons = screen.getAllByRole('button')
    stripCards(state, legal).forEach((card, i) => {
      fireEvent.click(buttons[i]!)
      if (card.plays.length === 1) expect(act).toHaveBeenLastCalledWith(card.plays[0])
      if (card.plays.length > 1) expect(choose).toHaveBeenLastCalledWith(card.id)
    })
    expect(act.mock.calls.length + choose.mock.calls.length).toBeGreaterThan(0)
  })

  it('nudges the first playable card only while the nudge is on', () => {
    const state = usingDice()
    const legal = legalActions(state)
    const first = stripCards(state, legal).find((c) => c.plays.length > 0)!
    const props = {
      state,
      legal,
      act: () => {},
      felt: { current: null },
      choose: () => {},
      onDrag: () => {},
      pending: null,
    }
    const { container, rerender } = render(<CardStrip {...props} nudge={first.id} />)
    const nudged = container.querySelectorAll('[data-nudge]')
    expect(nudged).toHaveLength(1)
    expect(nudged[0]?.getAttribute('aria-label')).toMatch(new RegExp(`^Play ${first.def.name}`))
    rerender(<CardStrip {...props} nudge={null} />)
    expect(container.querySelectorAll('[data-nudge]')).toHaveLength(0)
  })

  it('touch: a sideways move never lifts a card; a mostly upward one does', () => {
    expect(pressMove(3, -2)).toBe('press')
    expect(pressMove(30, -5)).toBe('scroll')
    expect(pressMove(-30, 10)).toBe('scroll')
    expect(pressMove(10, 10)).toBe('scroll')
    expect(pressMove(4, -20)).toBe('drag')
  })

  it('touch: a sideways pointer move then release plays nothing', () => {
    const state = usingDice()
    const legal = legalActions(state)
    const act = vi.fn()
    const choose = vi.fn()
    render(
      <CardStrip
        state={state}
        legal={legal}
        act={act}
        felt={{ current: null }}
        choose={choose}
        onDrag={() => {}}
        pending={null}
      />,
    )
    const card = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('data-playable') !== null)!
    card.setPointerCapture = () => {}
    fireEvent.pointerDown(card, { button: 0, clientX: 100, clientY: 500, pointerId: 1 })
    fireEvent.pointerMove(card, { clientX: 160, clientY: 495, pointerId: 1 })
    expect(card.getAttribute('data-lifted')).toBeNull()
    fireEvent.pointerUp(card, { clientX: 160, clientY: 495, pointerId: 1 })
    expect(act).not.toHaveBeenCalled()
    expect(choose).not.toHaveBeenCalled()
  })
})
