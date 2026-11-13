import { defaultContent } from '@survival/content'
import { createGame, type GameState } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MapView } from './MapView.tsx'

afterEach(cleanup)

/** A solo run with one more tile's worth of hexes: a gathering node and a spawn node beside it. */
function twoTiles(): GameState {
  const game = createGame(defaultContent.config, 1)
  return {
    ...game,
    map: {
      ...game.map,
      tiles: [...game.map.tiles, { ...game.map.tiles[0]!, id: 'extra' }],
      hexes: {
        ...game.map.hexes,
        '6,0': { terrain: 'forest', site: 'gathering-node', tile: 'extra' },
        '6,1': { terrain: 'plains', site: 'spawn-node', tile: 'extra' },
      },
    },
  } as GameState
}

/** The text drawn on one hex of the rendered map, or null when the hex is not drawn. */
function hexText(key: string): string | null {
  const g = screen.getByTestId('map').querySelector(`[data-hex="${key}"]`)
  return g ? (g.textContent ?? '') : null
}

describe('debug map view', () => {
  it('draws one hex polygon per map hex', () => {
    const state = twoTiles()
    render(<MapView state={state} />)
    const map = screen.getByTestId('map')
    const count = Object.keys(state.map.hexes).length
    expect(map.querySelectorAll('g[data-hex]')).toHaveLength(count)
    expect(map.querySelectorAll('polygon')).toHaveLength(count)
  })

  it('says "2 tiles" in its label once a second tile is placed', () => {
    render(<MapView state={twoTiles()} />)
    const label = screen.getByRole('img').getAttribute('aria-label') ?? ''
    expect(label).toMatch(/^Map: 2 tiles\./)
    expect(label).toContain('B base, g gathering node, s spawn node, E elite spawn node, P player')
  })

  it('marks the base "B", a gathering node "g" and a spawn node "s"', () => {
    const state = twoTiles()
    render(<MapView state={state} />)
    const base = Object.entries(state.map.hexes).find(([, h]) => h.site === 'base')?.[0] ?? ''
    expect(base).not.toBe('')
    expect(hexText(base)).toContain('B')
    expect(hexText('6,0')).toBe('g')
    expect(hexText('6,1')).toBe('s')
  })

  it('stacks the player, enemies and defenses on a shared hex, in that order', () => {
    const game = twoTiles()
    const crowded: GameState = {
      ...game,
      players: game.players.map((p) => ({ ...p, hex: { q: 6, r: 0 } })),
      enemies: [{ id: 'e3', kind: 'grunt', health: 2, hex: { q: 6, r: 0 } }],
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 6, r: 0 }, health: 3, builder: 'p1' }],
    }
    render(<MapView state={crowded} />)
    expect(hexText('6,0')).toBe('gP e3 d1')
  })

  it('draws no figure text on an empty hex', () => {
    const game = twoTiles()
    render(<MapView state={{ ...game, enemies: [], defenses: [] }} />)
    const g = screen.getByTestId('map').querySelector('[data-hex="6,1"]')
    expect(g?.querySelectorAll('text')).toHaveLength(1)
  })
})
