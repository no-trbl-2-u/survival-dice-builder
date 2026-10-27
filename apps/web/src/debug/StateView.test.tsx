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
    expect(text).toContain('Lake at (5,0)')
    expect(text).toContain('Mountain at (5,1)')
  })

  it('marks an elite spawn node "E", not a capital "S"', () => {
    render(<StateView state={withBlocks()} />)
    const map = screen.getByTestId('map')
    expect(map.querySelector('[data-hex="5,2"]')?.textContent).toBe('E')
    expect(map.getAttribute('aria-label')).toContain('E elite spawn node')
  })
})

describe('debug state in words', () => {
  it('says "1 tile" on a fresh map and names the phase', () => {
    render(<StateView state={createGame(defaultContent.config, 1)} />)
    expect(screen.getByTestId('map').getAttribute('aria-label')).toMatch(/^Map: 1 tile\./)
    expect(screen.getByTestId('state').textContent).toMatch(/Round \/ phase1 \/ (Setup|Prepare)/)
  })

  it('names upgrades, milestones and the end of the run, not their ids', () => {
    const game = createGame(defaultContent.config, 1)
    const ended: GameState = {
      ...game,
      phase: 'ended',
      endedBecause: 'base',
      upgrades: ['shop-1'],
      milestones: ['survive-round-5'],
    }
    render(<StateView state={ended} />)
    const text = screen.getByTestId('state').textContent ?? ''
    const shop = defaultContent.upgrades.find((u) => u.id === 'shop-1')?.name ?? ''
    expect(text).toContain(`Upgrades${shop}Shop offers`)
    expect(text).toContain('Survive to round 5')
    expect(text).toContain('Run over (the base fell)')
    expect(text).not.toMatch(/shop-1|survive-round-5|ended:/)
  })

  it('heads each player by number, says which halves are up, and names the exchange step', () => {
    const game = createGame(defaultContent.config, 1)
    const fighting: GameState = {
      ...game,
      players: [...game.players, { ...game.players[0]!, id: 'p2' }],
      phase: 'combat',
      exchange: {
        engage: null,
        step: 'targets',
        dice: [],
        rollsUsed: 1,
        assignments: [],
        bonusDamage: 0,
        ignoreHits: 0,
      } as unknown as GameState['exchange'],
    }
    render(<StateView state={fighting} />)
    const text = screen.getByTestId('state').textContent ?? ''
    expect(text).toContain('Player 1at')
    expect(text).toContain('Player 2at')
    expect(text).toContain('top halves up')
    expect(text).toContain('1 / Combat / Exchange: Pick targets')
    expect(text).not.toMatch(/Player p\d|orientation|: targets/)
  })

  it('lists the figures still to place by player number, apart from the tiles', () => {
    const game = createGame(defaultContent.config, 1)
    const two: GameState = {
      ...game,
      players: [...game.players, { ...game.players[0]!, id: 'p2' }],
      unplaced: ['p2'],
    }
    render(<StateView state={two} />)
    const text = screen.getByTestId('state').textContent ?? ''
    expect(text).toContain('Figures to placePlayer 2')
    expect(text).not.toMatch(/waiting to place|: p\d/)
  })

  it('drops the figures row once every figure is on the map', () => {
    render(<StateView state={{ ...createGame(defaultContent.config, 1), unplaced: [] }} />)
    expect(screen.getByTestId('state').textContent).not.toContain('Figures to place')
  })
})
