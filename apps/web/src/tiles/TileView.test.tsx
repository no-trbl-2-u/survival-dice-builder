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

  it("counts each tile's sites under its name, written as the site legend writes them", () => {
    const { container } = render(<TileSheet />)
    const summaries = defaultContent.tiles.map((tile) => {
      const name = container.querySelector(`[data-tile="${tile.id}"] h3`)!
      return name.nextSibling?.textContent ?? ''
    })
    const base = defaultContent.tiles.findIndex((t) => t.kind === 'base')
    expect(summaries[base]).toMatch(/^1 Base\b/)
    expect(summaries.join(', ')).toMatch(/Gathering node/)
    for (const summary of summaries) {
      expect(summary).not.toMatch(/\d (base|gathering|spawn|elite)/)
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

describe('TileSheet terrain legend', () => {
  it("3.4 names each terrain with the hex lists' capitals and says what it does to moves", () => {
    const { container } = render(<TileSheet />)
    const legend = container.querySelector('[aria-label="Terrain legend"]')!
    const names = [...legend.querySelectorAll('li')].map((li) => li.textContent)
    expect(names).toEqual([
      'Plains (no effect on moves)',
      'Forest (no effect on moves)',
      'Hills (no effect on moves)',
      'Wasteland (no effect on moves)',
      'Lake (impassable)',
      'Mountain (impassable)',
    ])
  })

  it('capitalises the tile kind in each tile drawing label', () => {
    const { container } = render(<TileSheet />)
    const labels = [...container.querySelectorAll('svg[role="img"]')].map((svg) =>
      svg.getAttribute('aria-label'),
    )
    expect(labels.length).toBeGreaterThan(0)
    for (const label of labels) expect(label).toMatch(/, (Base|Countryside|Core) tile$/)
  })
})

describe('TileSheet site legend', () => {
  it('Table 1: shows each of the 4 site icons with its name and what it does', () => {
    const { container } = render(<TileSheet />)
    const legend = container.querySelector('[aria-label="Site legend"]')!
    expect(legend.querySelectorAll('li')).toHaveLength(4)
    expect(legend.querySelectorAll('svg[data-icon]')).toHaveLength(4)
    expect([...legend.querySelectorAll('li')].map((li) => li.textContent)).toEqual([
      'Base (the players defend it; upgrades are bought here, and cards once Shop I is built)',
      'Gathering node (a Gather card here gets its materials, once)',
      'Spawn node (gets 1 grunt at each Combat)',
      'Elite spawn node (gets 1 elite at each Combat)',
    ])
  })
})
