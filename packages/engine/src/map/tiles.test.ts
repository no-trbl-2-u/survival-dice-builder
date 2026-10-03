import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { hexDistance, hexKey } from '../hex.ts'
import { EMPTY_MAP, TILE_SLOT_OFFSETS, emptySlots, isPassable, placeTile } from './tiles.ts'

const tile = (id: string) => defaultContent.tiles.find((t) => t.id === id)!
const base = () => placeTile(EMPTY_MAP, tile('broken-village'), { q: 0, r: 0 })

describe('map tiles', () => {
  it('3.1 placing a tile adds its 7 hexes', () => {
    const map = base()
    expect(Object.keys(map.hexes)).toHaveLength(7)
    expect(map.hexes['0,0']).toMatchObject({ site: 'base', tile: 'broken-village' })
  })

  it('10.1 tiles in the 6 slots touch the center tile and never overlap', () => {
    let map = base()
    TILE_SLOT_OFFSETS.forEach((center, i) => {
      map = placeTile(map, tile(i % 2 ? 'old-woods' : 'meadowlands'), center)
    })
    expect(Object.keys(map.hexes)).toHaveLength(49)
    for (const center of TILE_SLOT_OFFSETS) expect(hexDistance(center, { q: 0, r: 0 })).toBe(3)
  })

  it('4.2 a lone base tile has 6 empty slots; a placed slot is no longer offered', () => {
    expect(emptySlots(base())).toHaveLength(6)
    const map = placeTile(base(), tile('meadowlands'), TILE_SLOT_OFFSETS[0]!)
    const slots = emptySlots(map).map(hexKey)
    expect(slots).not.toContain(hexKey(TILE_SLOT_OFFSETS[0]!))
    expect(slots.length).toBeGreaterThan(6)
  })

  it('3.4 lake and mountain hexes are impassable; off-map hexes too', () => {
    const map = placeTile(base(), tile('meadowlands'), { q: 2, r: 1 })
    const lake = Object.entries(map.hexes).find(([, h]) => h.terrain === 'lake')![0]
    const [q, r] = lake.split(',').map(Number)
    expect(isPassable(map, { q: q!, r: r! })).toBe(false)
    expect(isPassable(map, { q: 0, r: 0 })).toBe(true)
    expect(isPassable(map, { q: 40, r: 40 })).toBe(false)
  })
})
