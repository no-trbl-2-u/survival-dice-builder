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

describe('PlayerPanel Skills', () => {
  it('7.8 lists each player Skill with its faces and its range, outside an exchange', () => {
    const state = createGame(defaultContent.config, 1)
    expect(state.exchange).toBeFalsy()
    render(<PlayerPanel state={state} />)
    const panel = screen.getByTestId('player-panel')
    const items = panel.querySelectorAll('li')
    const skills = state.players[0]?.skills ?? []
    expect(skills.length).toBeGreaterThan(0)
    expect(items).toHaveLength(skills.length)
    const first = defaultContent.skills.find((s) => s.id === skills[0])
    expect(first).toBeDefined()
    expect(items[0]?.textContent).toContain(`${first?.name}:`)
    expect(items[0]?.querySelectorAll('[role="img"]')).toHaveLength(first?.faces.length ?? -1)
    const attack = skills
      .map((id) => defaultContent.skills.find((s) => s.id === id))
      .find((s) => s?.effect.kind === 'damage')
    if (attack) expect(panel.textContent).toMatch(/within \d+ hex/)
  })

  it('16.3 shows every seat its own Skills in co-op', () => {
    const state = createGame(defaultContent.config, 2)
    render(<PlayerPanel state={state} />)
    const total = state.players.reduce((n, p) => n + p.skills.length, 0)
    expect(screen.getByTestId('player-panel').querySelectorAll('li')).toHaveLength(total)
  })
})
