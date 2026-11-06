import { defaultContent } from '@survival/content'
import { applyAction, createGame, type Action, type GameState } from '@survival/engine'
import { fireEvent, render, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NextStepBanner } from './NextStepBanner.tsx'
import styles from './Play.module.css'

const config = defaultContent.config

/** A solo run with the figure placed on the base center. */
function placed(): GameState {
  return applyAction(createGame(config, 1), { type: 'placeFigure', q: 0, r: 0 }).state
}

describe('NextStepBanner', () => {
  it('shows the phase and step, with no buttons when nothing has to be clicked here', () => {
    const s = createGame(config, 3)
    const legal: Action[] = [{ type: 'placeFigure', q: 0, r: 0 }]
    const { container } = render(<NextStepBanner state={s} legal={legal} act={() => {}} />)
    const banner = within(container).getByTestId('next-step')
    expect(banner.textContent).toBe('Setup: Click a highlighted base hex to place your figure')
    expect(within(banner).queryAllByRole('button')).toHaveLength(0)
    expect(banner.className).toContain(styles.bannerPrepare)
    expect(banner.className).not.toContain(styles.bannerCombat)
    expect(banner.getAttribute('aria-live')).toBe('polite')
  })

  it('offers stop moving as a button that sends exactly that action, and no map move', () => {
    const s = {
      ...placed(),
      active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false },
    } as GameState
    const stop: Action = { type: 'stopMoving' }
    const legal: Action[] = [{ type: 'moveTo', q: 0, r: -1 }, stop]
    const act = vi.fn()
    const { container } = render(<NextStepBanner state={s} legal={legal} act={act} />)
    const buttons = within(within(container).getByTestId('next-step')).getAllByRole('button')
    expect(buttons).toHaveLength(1)
    fireEvent.click(buttons[0]!)
    expect(act).toHaveBeenCalledTimes(1)
    expect(act).toHaveBeenCalledWith(stop)
  })

  it('a Tower target button names the enemy and its health, and turns the banner to combat', () => {
    const s = {
      ...placed(),
      phase: 'combat' as const,
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 0, r: -1 }, health: 3, builder: 'p1' }],
      enemies: [{ id: 'e1', kind: 'grunt', hex: { q: 0, r: -3 }, health: 1 }],
    } as GameState
    const shoot: Action = { type: 'chooseTowerTarget', tower: 'd1', enemy: 'e1' }
    const act = vi.fn()
    const { container } = render(<NextStepBanner state={s} legal={[shoot]} act={act} />)
    const banner = within(container).getByTestId('next-step')
    expect(banner.className).toContain(styles.bannerCombat)
    const button = within(banner).getByRole('button')
    expect(button.textContent).toMatch(/^Shoot .+ of the Tower \(health 1\/\d+\)$/)
    expect(button.textContent).not.toContain('d1')
    expect(button.textContent).not.toContain('e1')
    fireEvent.click(button)
    expect(act).toHaveBeenCalledWith(shoot)
  })
})
