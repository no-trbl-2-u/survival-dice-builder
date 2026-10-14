import { defaultContent, miniatureLimitText } from '@survival/content'
import { createGame } from '@survival/engine'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PhaseBar } from './PhaseBar.tsx'

describe('PhaseBar', () => {
  it('hides the current-phase arrow from screen readers and names the miniature limit (10.5)', () => {
    const state = { ...createGame(defaultContent.config, 1), phase: 'prepare' as const }
    render(<PhaseBar state={state} />)
    const current = screen.getByText('Prepare').closest('li')!
    expect(current.getAttribute('aria-current')).toBe('step')
    const arrow = current.querySelector('[aria-hidden="true"]')
    expect(arrow?.textContent).toBe('▶ ')
    const limit = defaultContent.config.miniatureLimit
    const count = screen.getByTestId('enemy-count')
    expect(count.textContent).toBe(`Enemies 0 of ${limit} (map limit)`)
    expect(count.getAttribute('title')).toBe(miniatureLimitText(defaultContent.config))
  })
})
