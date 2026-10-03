import type { GameState } from '@survival/engine'
import { hexKey } from '@survival/engine'
import { hexPolygonPoints, hexToPixel } from '../map/geometry.ts'
import tileStyles from '../tiles/TileView.module.css'
import styles from './MapView.module.css'

const HEX_SIZE = 18

/** One-letter site marks; the text list beside the map names everything in full. */
const SITE_MARK: Record<string, string> = {
  base: 'B',
  'gathering-node': 'g',
  'spawn-node': 's',
  'elite-spawn-node': 'S',
}

type Props = Readonly<{ state: GameState }>

/**
 * A plain SVG of the map for the debug console: terrain colours, site letters, the player (P),
 * enemies (their id), and defenses (their id). Every mark is also listed in the state text, so
 * nothing here is hover-only.
 */
export function MapView({ state }: Props) {
  const keys = Object.keys(state.map.hexes)
  const points = keys.map((key) => {
    const [q = 0, r = 0] = key.split(',').map(Number)
    return { key, hex: { q, r }, center: hexToPixel({ q, r }, HEX_SIZE) }
  })
  const xs = points.map((p) => p.center.x)
  const ys = points.map((p) => p.center.y)
  const pad = HEX_SIZE * 1.2
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const width = Math.max(...xs) - minX + pad
  const height = Math.max(...ys) - minY + pad
  const marks = new Map<string, string[]>()
  const mark = (key: string, text: string) => marks.set(key, [...(marks.get(key) ?? []), text])
  state.players.forEach((p) => mark(hexKey(p.hex), 'P'))
  state.enemies.forEach((e) => mark(hexKey(e.hex), e.id))
  state.defenses.forEach((d) => mark(hexKey(d.hex), d.id))

  return (
    <svg
      className={styles.map}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      role="img"
      aria-label={`Map: ${state.map.tiles.length} tiles`}
      data-testid="map"
    >
      {points.map(({ key, center }) => {
        const hex = state.map.hexes[key]
        if (!hex) return null
        const here = marks.get(key)
        return (
          <g key={key} data-hex={key}>
            <polygon
              className={`${tileStyles.hex} ${tileStyles[hex.terrain] ?? ''}`}
              points={hexPolygonPoints(center, HEX_SIZE)}
            />
            {hex.site ? (
              <text className={styles.site} x={center.x} y={center.y - HEX_SIZE * 0.4}>
                {SITE_MARK[hex.site]}
              </text>
            ) : null}
            {here ? (
              <text className={styles.figure} x={center.x} y={center.y + HEX_SIZE * 0.35}>
                {here.join(' ')}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}
