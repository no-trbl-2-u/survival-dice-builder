import { defaultContent } from '@survival/content'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TileSheet } from './TileSheet.tsx'
import { HEX_POSITION, hexLabel, TileView } from './TileView.tsx'

describe('TileView', () => {
  it('3.1 draws 7 hexes with each terrain and site from the tile', () => {
    const tile = defaultContent.tiles.find((t) => t.kind === 'core')!
    const { container } = render(<TileView tile={tile} />)
    const hexes = container.querySelectorAll('[data-hex]')
    expect(hexes).toHaveLength(7)
    hexes.forEach((g, i) => {
      expect(g.getAttribute('data-terrain')).toBe(tile.hexes[i]!.terrain)
      expect(g.getAttribute('data-site')).toBe(tile.hexes[i]!.site ?? '')
    })
  })

  it('marks every site with an icon', () => {
    const tile = defaultContent.tiles.find((t) => t.kind === 'base')!
    const { container } = render(<TileView tile={tile} />)
    const sites = tile.hexes.filter((h) => h.site).length
    expect(container.querySelectorAll('g[transform] path').length).toBeGreaterThanOrEqual(sites)
  })
})

describe('TileSheet', () => {
  it('shows all 9 proposed tiles', () => {
    const { container } = render(<TileSheet />)
    expect(container.querySelectorAll('[data-tile]')).toHaveLength(9)
  })

  it('says /play builds its map from these tiles, counted per kind with the heading capitals', () => {
    const { container } = render(<TileSheet />)
    expect(container.querySelector('#tiles-intro')!.textContent).toMatch(
      /^The game on the Play page builds its map from these 9 tiles: 1 Base tile, 3 Countryside tiles, and 5 Core tiles\. The Base tile starts in the center; the Countryside tiles are drawn before the Core tiles\./,
    )
  })

  it('groups the tiles under an H2 per kind, each tile name an H3', () => {
    const { container } = render(<TileSheet />)
    const h2s = [...container.querySelectorAll('h2')].map((h) => h.textContent)
    expect(h2s).toEqual(['Base tile', 'Countryside tiles', 'Core tiles'])
    for (const kind of ['base', 'countryside', 'core'] as const) {
      const names = [...container.querySelectorAll(`[data-tile-kind="${kind}"] h3`)].map(
        (h) => h.textContent,
      )
      expect(names).toEqual(defaultContent.tiles.filter((t) => t.kind === kind).map((t) => t.name))
    }
  })
})

describe('TileSheet hex list', () => {
  it('lists every hex of every tile as text, by position', () => {
    const { container } = render(<TileSheet />)
    expect(container.querySelectorAll('[data-hex-row]')).toHaveLength(63)
    const tile = defaultContent.tiles[0]!
    const rows = container.querySelectorAll(`[data-tile="${tile.id}"] [data-hex-row]`)
    rows.forEach((row, i) => {
      expect(row.textContent).toBe(`${HEX_POSITION[i]}: ${hexLabel(tile.hexes[i]!)}`)
    })
  })

  it('capitalises terrain and names the site', () => {
    expect(hexLabel({ terrain: 'plains', site: 'base' })).toBe('Plains, Base')
    expect(hexLabel({ terrain: 'lake', site: null })).toBe('Lake')
  })
})

describe('TileSheet site legend', () => {
  it('shows each of the 4 site icons with its name', () => {
    const { container } = render(<TileSheet />)
    const legend = container.querySelector('[aria-label="Site legend"]')!
    expect(legend.querySelectorAll('li')).toHaveLength(4)
    expect(legend.querySelectorAll('svg[data-icon]')).toHaveLength(4)
    expect(legend.textContent).toBe('BaseGathering nodeSpawn nodeElite spawn node')
  })
})
