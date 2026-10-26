import { defaultContent } from '@survival/content'
import { createGame, type GameState } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { StateView } from './StateView.tsx'

afterEach(cleanup)

/** A solo run with `materials` in hand and a Move of `hexesLeft` in progress. */
function moving(materials: number, hexesLeft: number): GameState {
  const game = createGame(defaultContent.config, 1)
  return {
    ...game,
    active: { kind: 'move', hexesLeft, ignoreEnemyCost: false },
    players: game.players.map((p) => ({ ...p, materials })),
  }
}

describe('debug state counts', () => {
  it('says "1 material" and "1 hex left" for a count of 1', () => {
    render(<StateView state={moving(1, 1)} />)
    const text = screen.getByTestId('state').textContent ?? ''
    expect(text).toContain('Move: 1 hex left')
    expect(text).toContain(', 1 material,')
  })

  it('keeps the plural for other counts', () => {
    render(<StateView state={moving(4, 2)} />)
    const text = screen.getByTestId('state').textContent ?? ''
    expect(text).toContain('Move: 2 hexes left')
    expect(text).toContain(', 4 materials,')
  })
})

describe('debug map marks in text', () => {
  /** A solo run with one lake and one mountain hex added beside the start. */
  function withBlocks(): GameState {
    const game = createGame(defaultContent.config, 1)
    return {
      ...game,
      map: {
        ...game.map,
        hexes: {
          ...game.map.hexes,
          '5,0': { terrain: 'lake', site: null, tile: 't' },
          '5,1': { terrain: 'mountain', site: null, tile: 't' },
          '5,2': { terrain: 'forest', site: 'elite-spawn-node', tile: 't' },
        },
      },
    }
  }

  it('lists the lake and mountain hexes, not only their colour', () => {
    render(<StateView state={withBlocks()} />)
    const text = screen.getByTestId('state').textContent ?? ''
    expect(text).toContain('lake at (5,0)')
    expect(text).toContain('mountain at (5,1)')
  })

  it('marks an elite spawn node "E", not a capital "S"', () => {
    render(<StateView state={withBlocks()} />)
    const map = screen.getByTestId('map')
    expect(map.querySelector('[data-hex="5,2"]')?.textContent).toBe('E')
    expect(map.getAttribute('aria-label')).toContain('E elite spawn node')
  })
})
