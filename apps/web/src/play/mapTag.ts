/** A token drawn on the map: its centre and the radius it covers. */
export type Token = Readonly<{ x: number; y: number; r: number }>

/** An axis-aligned box in map pixels (`x`, `y` is the top-left corner). */
export type Box = Readonly<{ x: number; y: number; w: number; h: number }>

/**
 * The sides a mini map target tag can sit on, in the order tried. `below` clears the health
 * number under the token.
 */
const SIDES = [
  { side: 'right', at: (r: number, _w: number, h: number) => ({ x: r + 4, y: -h / 2 }) },
  { side: 'left', at: (r: number, w: number, h: number) => ({ x: -r - 4 - w, y: -h / 2 }) },
  { side: 'above', at: (r: number, w: number, h: number) => ({ x: -w / 2, y: -r - 4 - h }) },
  { side: 'below', at: (r: number, w: number) => ({ x: -w / 2, y: r + 12 }) },
] as const

export type TagSide = (typeof SIDES)[number]['side']

/** Whether a token's circle reaches into a box. */
const covers = (box: Box, t: Token) => {
  const nx = Math.max(box.x, Math.min(t.x, box.x + box.w))
  const ny = Math.max(box.y, Math.min(t.y, box.y + box.h))
  return (t.x - nx) ** 2 + (t.y - ny) ** 2 < t.r ** 2
}

const inside = (box: Box, frame: Box) =>
  box.x >= frame.x &&
  box.y >= frame.y &&
  box.x + box.w <= frame.x + frame.w &&
  box.y + box.h <= frame.y + frame.h

/**
 * Where the mini map's target tag goes: the first side (right, left, above, below) that stays
 * in the frame and covers no other token; else the side that leaves the frame least and covers
 * the fewest tokens. Labels only: no rule is decided here.
 *
 * @param at - the target token's centre and radius.
 * @param size - the tag's width and height.
 * @param frame - the visible part of the map.
 * @param others - every other token on the map (figures, enemies, defenses).
 * @returns the side and the tag's top-left corner relative to the token's centre.
 */
export function placeTag(
  at: Token,
  size: Readonly<{ w: number; h: number }>,
  frame: Box,
  others: readonly Token[],
): { side: TagSide; x: number; y: number } {
  const scored = SIDES.map(({ side, at: offset }) => {
    const o = offset(at.r, size.w, size.h)
    const box = { x: at.x + o.x, y: at.y + o.y, w: size.w, h: size.h }
    const cost = (inside(box, frame) ? 0 : 100) + others.filter((t) => covers(box, t)).length
    return { side, ...o, cost }
  })
  const best = scored.reduce((a, b) => (b.cost < a.cost ? b : a))
  return { side: best.side, x: best.x, y: best.y }
}
