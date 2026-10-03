import { hexKey, tileHexes, type Axial } from '@survival/engine'
import { hexPolygonPoints, hexToPixel } from './geometry.ts'
import styles from './HexTile.module.css'

const HEX_SIZE = 40

type Props = Readonly<{ center: Axial }>

/** Renders one 7-hex map tile (rule 3.1) as SVG: the center hex plus its 6 neighbours. */
export function HexTile({ center }: Props) {
  const hexes = tileHexes(center)
  const centerPx = hexToPixel(center, HEX_SIZE)
  // The tile spans 3 hexes across; pad so the outer corners stay inside the view box.
  const half = HEX_SIZE * 2.6
  const viewBox = `${centerPx.x - half} ${centerPx.y - half} ${half * 2} ${half * 2}`

  return (
    <svg className={styles.tile} viewBox={viewBox} role="img" aria-label="Map tile with 7 hexes">
      {hexes.map((hex, i) => (
        <polygon
          key={hexKey(hex)}
          data-hex={hexKey(hex)}
          className={i === 0 ? styles.centerHex : styles.hex}
          points={hexPolygonPoints(hexToPixel(hex, HEX_SIZE), HEX_SIZE)}
        />
      ))}
    </svg>
  )
}
