import type { Site, TileDef } from '@survival/content'
import { hexKey, tileHexes } from '@survival/engine'
import { gameIcons, ICON_VIEWBOX, SITE_ICON } from '../icons/gameIcons.ts'
import { hexPolygonPoints, hexToPixel } from '../map/geometry.ts'
import styles from './TileView.module.css'

const HEX_SIZE = 40
const ICON_SIZE = 40

/** Plain-language site names for labels and tooltips. */
export const SITE_LABEL: Record<Site, string> = {
  base: 'Base',
  'gathering-node': 'Gathering node',
  'spawn-node': 'Spawn node',
  'elite-spawn-node': 'Elite spawn node',
}

/**
 * Where hex `i` of a tile sits, in words: the center, then `AXIAL_DIRECTIONS` order as drawn
 * with flat-top hexes. The words are the compass words /play uses for moves (`bearing` in
 * `map/places.ts`), so a hex on /tiles matches a move choice on /play.
 */
export const HEX_POSITION: readonly string[] = [
  'Center',
  'South-east',
  'North-east',
  'North',
  'North-west',
  'South-west',
  'South',
]

/**
 * The order the hex lists read a tile in: the center, then North and clockwise
 * (North-east, South-east, South, South-west, North-west). Values are hex indices.
 */
export const HEX_LIST_ORDER: readonly number[] = [0, 3, 2, 1, 6, 5, 4]

/** "plains" -> "Plains": a terrain or tile-kind id as a name, as the hex lists print it. */
export function capitalize(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1)
}

/** "Plains", "Plains, Base": a hex's terrain and site in words. */
export function hexLabel(hex: Readonly<{ terrain: string; site: Site | null }>): string {
  const terrain = capitalize(hex.terrain)
  return hex.site ? `${terrain}, ${SITE_LABEL[hex.site]}` : terrain
}

/**
 * A hex's site as the game plays it: every hex of the Base tile is the base, though the tile
 * prints the base icon on its center only.
 *
 * @rule 3.6, OPEN-QUESTIONS row 16
 */
export function playedSite(tile: Pick<TileDef, 'kind'>, site: Site | null): Site | null {
  return tile.kind === 'base' ? 'base' : site
}

/** "Plains, Base": a hex of a tile in words, with its site as the game plays it (3.6). */
export function tileHexLabel(
  tile: Pick<TileDef, 'kind'>,
  hex: Readonly<{ terrain: string; site: Site | null }>,
): string {
  return hexLabel({ terrain: hex.terrain, site: playedSite(tile, hex.site) })
}

type Props = Readonly<{ tile: TileDef }>

/**
 * Draws one printed tile: 7 hexes coloured by terrain, each site marked with its icon.
 * Hex `i` of the tile is drawn at `tileHexes(origin)[i]` (center, then `AXIAL_DIRECTIONS`).
 *
 * @rule 3.1, 3.3, 3.5, Table 1
 */
export function TileView({ tile }: Props) {
  const positions = tileHexes({ q: 0, r: 0 })
  const half = HEX_SIZE * 2.6
  return (
    <svg
      className={styles.tile}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      role="img"
      aria-label={`${tile.name}, ${capitalize(tile.kind)} tile`}
    >
      {tile.hexes.map((hex, i) => {
        const pos = positions[i]
        if (!pos) return null
        const center = hexToPixel(pos, HEX_SIZE)
        const label = tileHexLabel(tile, hex)
        return (
          <g key={hexKey(pos)} data-hex={i} data-terrain={hex.terrain} data-site={hex.site ?? ''}>
            <title>{label}</title>
            <polygon
              className={`${styles.hex} ${styles[hex.terrain] ?? ''}`}
              points={hexPolygonPoints(center, HEX_SIZE)}
            />
            {hex.site ? (
              <g
                className={styles.icon}
                transform={`translate(${center.x - ICON_SIZE / 2} ${center.y - ICON_SIZE / 2}) scale(${ICON_SIZE / ICON_VIEWBOX})`}
                // Trusted local markup from assets/icons/game (license-checked, see ASSETS.md).
                dangerouslySetInnerHTML={{ __html: gameIcons[SITE_ICON[hex.site]] ?? '' }}
              />
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}
