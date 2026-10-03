import type { Site, TileDef } from '@survival/content'
import { hexKey, tileHexes } from '@survival/engine'
import { gameIcons, ICON_VIEWBOX } from '../icons/gameIcons.ts'
import { hexPolygonPoints, hexToPixel } from '../map/geometry.ts'
import styles from './TileView.module.css'

const HEX_SIZE = 40
const ICON_SIZE = 40

/** Which icon marks each printed site. */
const SITE_ICON: Record<Site, string> = {
  base: 'base',
  'gathering-node': 'gathering-node',
  'spawn-node': 'spawn-node',
  'elite-spawn-node': 'elite',
}

/** Plain-language site names for labels and tooltips. */
export const SITE_LABEL: Record<Site, string> = {
  base: 'Base',
  'gathering-node': 'Gathering node',
  'spawn-node': 'Spawn node',
  'elite-spawn-node': 'Elite spawn node',
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
      aria-label={`${tile.name}, ${tile.kind} tile`}
    >
      {tile.hexes.map((hex, i) => {
        const pos = positions[i]
        if (!pos) return null
        const center = hexToPixel(pos, HEX_SIZE)
        const label = hex.site ? `${hex.terrain}, ${SITE_LABEL[hex.site]}` : hex.terrain
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
