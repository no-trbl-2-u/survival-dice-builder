import { z } from 'zod'
import { IdSchema } from './primitives.ts'

/** Hex terrain. Lake and mountain are impassable. @rule 3.3, 3.4 */
export const TerrainSchema = z.enum(['plains', 'forest', 'hills', 'wasteland', 'lake', 'mountain'])
export type Terrain = z.infer<typeof TerrainSchema>

/** Terrains that figures and enemies cannot enter. @rule 3.4 */
export const IMPASSABLE: readonly Terrain[] = ['lake', 'mountain']

/** Printed sites. @rule 3.5, Table 1 */
export const SiteSchema = z.enum(['base', 'gathering-node', 'spawn-node', 'elite-spawn-node'])
export type Site = z.infer<typeof SiteSchema>

/** One printed hex of a tile. */
export const TileHexSchema = z.object({
  terrain: TerrainSchema,
  site: SiteSchema.nullable().default(null),
})
export type TileHex = z.infer<typeof TileHexSchema>

/** Tile families. @rule 3.2, 2.2 */
export const TileKindSchema = z.enum(['base', 'countryside', 'core'])
export type TileKind = z.infer<typeof TileKindSchema>

/**
 * Site counts each tile kind must print, from Table 1: [min, max] per site. The Base tile has no
 * gathering nodes (core loop v2: the base centre and 6 plain hexes).
 */
const SITE_RULES: Record<TileKind, Record<Site, readonly [number, number]>> = {
  base: {
    base: [1, 1],
    'gathering-node': [0, 0],
    'spawn-node': [0, 0],
    'elite-spawn-node': [0, 0],
  },
  countryside: {
    base: [0, 0],
    'gathering-node': [1, 2],
    'spawn-node': [1, 1],
    'elite-spawn-node': [0, 0],
  },
  core: {
    base: [0, 0],
    'gathering-node': [1, 1],
    'spawn-node': [1, 1],
    'elite-spawn-node': [1, 1],
  },
}

/** The site a tile kind must print on its center hex, if any. @rule 3.6, Table 1 */
const CENTER_SITE: Record<TileKind, Site | null> = {
  base: 'base',
  countryside: null,
  core: 'elite-spawn-node',
}

/**
 * A 7-hex map tile. `hexes[0]` is the center; `hexes[1..6]` follow `AXIAL_DIRECTIONS`
 * (east, then counter-clockwise on screen). Validated against Table 1 and the Phase 1 spec:
 * at most 1 lake-or-mountain per tile, never on the center, and no site on lake or mountain.
 *
 * @rule 3.1, 3.3-3.6, Table 1, core loop v2 (Base tile)
 */
export const TileDefSchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1),
    kind: TileKindSchema,
    hexes: z.array(TileHexSchema).length(7, 'a tile has exactly 7 hexes (1 center + 6 outer)'),
  })
  .superRefine((tile, ctx) => {
    const impassable = tile.hexes
      .map((h, i) => ({ h, i }))
      .filter(({ h }) => IMPASSABLE.includes(h.terrain))
    if (impassable.length > 1) {
      ctx.addIssue({
        code: 'custom',
        message: `at most 1 lake or mountain per tile (found ${impassable.length})`,
        path: ['hexes'],
      })
    }
    for (const { h, i } of impassable) {
      if (i === 0)
        ctx.addIssue({
          code: 'custom',
          message: 'the center hex cannot be lake or mountain',
          path: ['hexes', 0, 'terrain'],
        })
      if (h.site)
        ctx.addIssue({
          code: 'custom',
          message: `a site (${h.site}) cannot be on ${h.terrain}`,
          path: ['hexes', i, 'site'],
        })
    }
    for (const [site, [min, max]] of Object.entries(SITE_RULES[tile.kind]) as [
      Site,
      readonly [number, number],
    ][]) {
      const count = tile.hexes.filter((h) => h.site === site).length
      if (count < min || count > max) {
        const want = min === max ? `${min}` : `${min}-${max}`
        ctx.addIssue({
          code: 'custom',
          message: `a ${tile.kind} tile needs ${want} ${site} (found ${count})`,
          path: ['hexes'],
        })
      }
    }
    const center = CENTER_SITE[tile.kind]
    if (center && tile.hexes[0]?.site !== center) {
      ctx.addIssue({
        code: 'custom',
        message: `a ${tile.kind} tile has its ${center} on the center hex`,
        path: ['hexes', 0, 'site'],
      })
    }
  })
export type TileDef = z.infer<typeof TileDefSchema>

/** `tiles.json`. */
export const TilesFileSchema = z.object({ tiles: z.array(TileDefSchema).min(1) })
