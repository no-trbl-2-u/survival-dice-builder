// Game icons from assets/icons/game (see ASSETS.md), inlined as SVG markup at build time.
const raw = import.meta.glob('../../../../assets/icons/game/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Icon name (file name without `.svg`) -> the inner markup of the 512x512 SVG. */
export const gameIcons: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(raw).map(([path, svg]) => [
    path.replace(/^.*\//, '').replace(/\.svg$/, ''),
    // Keep only the shapes: the caller places them with its own transform.
    svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''),
  ]),
)

/** The 512-unit size of every game-icons.net viewBox. */
export const ICON_VIEWBOX = 512
