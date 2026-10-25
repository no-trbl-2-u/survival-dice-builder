import { defaultContent, milestoneIds, milestoneOutOfReach } from '@survival/content'
import { createGame } from '@survival/engine'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BasePanel } from './BasePanel.tsx'

const config = defaultContent.config

afterEach(cleanup)

describe('milestones during a run (rules 1.4, 17)', () => {
  it('the base panel folds every milestone under a met count, with out-of-reach reasons', () => {
    const state = { ...createGame(config, 1), milestones: ['survive-round-5'] }
    render(<BasePanel state={state} legal={[]} act={() => {}} />)
    const box = screen.getByTestId('milestone-progress')
    const ids = milestoneIds(config.milestones)
    const total = ids.length
    const out = ids.filter((id) => milestoneOutOfReach(id, config, state.content)).length
    expect(out).toBe(3)
    expect(box.querySelector('summary')?.textContent).toBe(
      `Milestones: 1 of ${total} met (3 out of reach)`,
    )
    const items = within(box).getAllByRole('listitem', { hidden: true })
    expect(items).toHaveLength(total)
    expect(items[0]?.textContent).toBe('✓ Met: Survive to round 5')
    expect(box.textContent).toContain('– Not met: Survive to round 10')
    expect(box.textContent).toContain('Reveal 10 tiles (out of reach: the tile deck holds 8 tiles)')
    expect(box.hasAttribute('open')).toBe(false)
  })

  it('a screen reader hears met or not met, never the glyph (rule 17)', () => {
    const state = { ...createGame(config, 1), milestones: ['survive-round-5'] }
    render(<BasePanel state={state} legal={[]} act={() => {}} />)
    const items = within(screen.getByTestId('milestone-progress')).getAllByRole('listitem', {
      hidden: true,
    })
    const [met, notMet] = items
    expect(met?.querySelector('[aria-hidden="true"]')?.textContent).toBe('✓')
    expect(met?.querySelector('.visually-hidden')?.textContent).toBe('Met: ')
    expect(notMet?.querySelector('[aria-hidden="true"]')?.textContent).toBe('–')
    expect(notMet?.querySelector('.visually-hidden')?.textContent).toBe('Not met: ')
  })

  it('a met milestone never counts as out of reach, and the count drops at 0', () => {
    const base = createGame(config, 1)
    const ids = milestoneIds(config.milestones)
    const out = ids.filter((id) => milestoneOutOfReach(id, config, base.content))
    render(<BasePanel state={{ ...base, milestones: out }} legal={[]} act={() => {}} />)
    const summary = screen.getByTestId('milestone-progress').querySelector('summary')
    expect(summary?.textContent).toBe(`Milestones: ${out.length} of ${ids.length} met`)
  })
})
