import { defaultContent, milestoneIds } from '@survival/content'
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
    const total = milestoneIds(config.milestones).length
    expect(within(box).getByText(`Milestones: 1 of ${total} met`)).toBeTruthy()
    const items = within(box).getAllByRole('listitem', { hidden: true })
    expect(items).toHaveLength(total)
    expect(items[0]?.textContent).toBe('✓ Survive to round 5')
    expect(box.textContent).toContain('– Survive to round 10')
    expect(box.textContent).toContain('Reveal 10 tiles (out of reach: the tile deck holds 8 tiles)')
    expect(box.hasAttribute('open')).toBe(false)
  })
})
