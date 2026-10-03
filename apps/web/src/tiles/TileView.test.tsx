import { defaultContent } from '@survival/content'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TileSheet } from './TileSheet.tsx'
import { TileView } from './TileView.tsx'

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
})
