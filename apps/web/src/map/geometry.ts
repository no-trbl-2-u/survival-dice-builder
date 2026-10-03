import type { Axial } from '@survival/engine'

/** Pixel position of a hex center. */
export type Point = Readonly<{ x: number; y: number }>

/**
 * Converts an axial hex to the pixel center of a flat-top hex of the given size.
 *
 * @param hex - axial coordinate.
 * @param size - distance from the hex center to a corner, in pixels.
 */
export function hexToPixel(hex: Axial, size: number): Point {
  return {
    x: size * 1.5 * hex.q,
    y: size * Math.sqrt(3) * (hex.r + hex.q / 2),
  }
}

/**
 * Returns the SVG `points` string for a flat-top hex polygon.
 *
 * @param center - pixel center.
 * @param size - distance from the center to a corner, in pixels.
 */
export function hexPolygonPoints(center: Point, size: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i)
    const x = center.x + size * Math.cos(angle)
    const y = center.y + size * Math.sin(angle)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}
