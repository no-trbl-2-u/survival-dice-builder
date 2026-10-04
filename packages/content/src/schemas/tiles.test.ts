import { describe, expect, it } from 'vitest'
import { defaultContent } from '../content.ts'
import { TileDefSchema, type TileDef } from './tiles.ts'

function issues(tile: unknown): string[] {
  const r = TileDefSchema.safeParse(tile)
  return r.success ? [] : r.error.issues.map((i) => i.message)
}

const meadow = (): TileDef =>
  structuredClone(defaultContent.tiles.find((t) => t.id === 'meadowlands')!)

describe('tile constraints (Table 1, spec 1)', () => {
  it('every proposed tile passes', () => {
    for (const tile of defaultContent.tiles) expect(issues(tile)).toEqual([])
  })

  it('3.1 a tile must have 7 hexes', () => {
    const t = meadow()
    t.hexes.pop()
    expect(issues(t)).toContain('a tile has exactly 7 hexes (1 center + 6 outer)')
  })

  it('the center hex cannot be a lake or mountain', () => {
    const t = meadow()
    t.hexes[0] = { terrain: 'lake', site: null }
    expect(issues(t)).toContain('the center hex cannot be lake or mountain')
  })

  it('at most 1 lake or mountain per tile', () => {
    const t = meadow()
    t.hexes[2] = { terrain: 'mountain', site: null }
    expect(issues(t)).toContain('at most 1 lake or mountain per tile (found 2)')
  })

  it('3.4 no site on an impassable hex', () => {
    const t = meadow()
    t.hexes[5] = { terrain: 'lake', site: 'gathering-node' }
    expect(issues(t)).toContain('a site (gathering-node) cannot be on lake')
  })

  it('Table 1: a countryside tile has exactly 1 spawn node', () => {
    const t = meadow()
    t.hexes = t.hexes.map((h) => (h.site === 'spawn-node' ? { ...h, site: null } : h))
    expect(issues(t)).toContain('a countryside tile needs 1 spawn-node (found 0)')
  })

  it('Table 1: a core tile has the elite spawn node on its center hex', () => {
    const core = structuredClone(defaultContent.tiles.find((t) => t.kind === 'core')!)
    const centerSite = core.hexes[0]!.site
    core.hexes[0] = { ...core.hexes[0]!, site: null }
    core.hexes[6] = { ...core.hexes[6]!, site: centerSite }
    expect(issues(core)).toContain('a core tile has its elite-spawn-node on the center hex')
  })

  it('3.6, core loop v2: the base tile is the base centre and 6 plain hexes, no nodes', () => {
    const base = defaultContent.tiles.find((t) => t.kind === 'base')!
    expect(base.hexes[0]!.site).toBe('base')
    expect(base.hexes.slice(1).every((h) => h.site === null && h.terrain === 'plains')).toBe(true)
  })
})
