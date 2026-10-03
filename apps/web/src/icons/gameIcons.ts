// Game and die-face icons from assets/icons (see ASSETS.md), inlined as SVG markup at build time.
const game = import.meta.glob('../../../../assets/icons/game/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>
const dice = import.meta.glob('../../../../assets/icons/dice/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** File name without `.svg` -> the inner markup of the 512x512 SVG. */
function inner(raw: Record<string, string>, prefix = ''): Record<string, string> {
  return Object.fromEntries(
    Object.entries(raw).map(([path, svg]) => [
      prefix + path.replace(/^.*\//, '').replace(/\.svg$/, ''),
      // Keep only the shapes: the caller places them with its own transform.
      svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''),
    ]),
  )
}

/**
 * Icon name -> the inner markup of the 512x512 SVG. Game icons by file name (`health`,
 * `tower`); die faces as `face-<name>` (`face-sword`).
 */
export const gameIcons: Readonly<Record<string, string>> = {
  ...inner(game),
  ...inner(dice, 'face-'),
}

/** The icon name of a die face (`Sword` -> `face-sword`). */
export const faceIcon = (face: string) => `face-${face.toLowerCase()}`

/** The 512-unit size of every game-icons.net viewBox. */
export const ICON_VIEWBOX = 512
