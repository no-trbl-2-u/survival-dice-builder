import { defaultContent, type GameConfig } from '@survival/content'
import { createGame } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PlayerPanel } from './PlayerPanel.tsx'

afterEach(cleanup)

const heading = () =>
  (screen.getByRole('heading', { level: 2 }).textContent ?? '').replace(/\s+/g, ' ')

describe('PlayerPanel', () => {
  it('8.5 shows the experience the next level needs', () => {
    render(<PlayerPanel state={createGame(defaultContent.config, 1)} />)
    expect(heading()).toContain('level 1 · experience 0 (level 2 at 3) ·')
  })

  it('8.5 names the next level and its experience total, not a bare "/ total"', () => {
    const state = createGame(defaultContent.config, 1)
    render(<PlayerPanel state={{ ...state, level: 2, experience: 3 }} />)
    expect(heading()).toContain('level 2 · experience 3 (level 3 at 9) ·')
    expect(heading()).not.toMatch(/experience 3 \/ /)
  })

  it('18.1 at the maximum level names it and drops the next-level target', () => {
    const config: GameConfig = {
      ...defaultContent.config,
      options: { ...defaultContent.config.options, maxLevel: 1 },
    }
    render(<PlayerPanel state={createGame(config, 1)} />)
    expect(heading()).toContain('level 1 (maximum) · experience 0 ·')
    expect(heading()).not.toContain('(level 2 at')
  })

  it('row 17 with a level per elite spawn the experience has no level target', () => {
    const config: GameConfig = {
      ...defaultContent.config,
      experience: { ...defaultContent.config.experience, levelPerEliteSpawn: true },
    }
    render(<PlayerPanel state={createGame(config, 1)} />)
    expect(heading()).toContain('level 1 · experience 0 ·')
    expect(heading()).not.toContain('(maximum)')
  })
})
