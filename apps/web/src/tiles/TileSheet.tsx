import {
  defaultContent,
  IMPASSABLE,
  siteText,
  type Site,
  type Terrain,
  type TileDef,
} from '@survival/content'
import { GameIcon } from '../icons/GameIcon.tsx'
import {
  capitalize,
  HEX_LIST_ORDER,
  HEX_POSITION,
  hexLabel,
  SITE_ICON,
  SITE_LABEL,
  TileView,
} from './TileView.tsx'
import styles from './TileSheet.module.css'

const TERRAINS: readonly Terrain[] = ['plains', 'forest', 'hills', 'wasteland', 'lake', 'mountain']
const SITES: readonly Site[] = ['base', 'gathering-node', 'spawn-node', 'elite-spawn-node']
const KINDS: readonly (readonly [TileDef['kind'], string])[] = [
  ['base', 'Base tile'],
  ['countryside', 'Countryside tiles'],
  ['core', 'Core tiles'],
]

/** "1 Base tile, 3 Countryside tiles and 5 Core tiles", counted from the content. */
function kindSummary(tiles: readonly TileDef[]): string {
  const parts = KINDS.map(([kind, heading]) => {
    const n = tiles.filter((t) => t.kind === kind).length
    return `${n} ${n === 1 ? heading.replace(/s$/, '') : heading.replace(/(tile)$/, '$1s')}`
  })
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

/** Counts each site printed on a tile, for the caption, named as the site legend names it. */
function siteSummary(sites: readonly (Site | null)[]): string {
  return SITES.map((s) => [s, sites.filter((x) => x === s).length] as const)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${n} ${SITE_LABEL[s]}${n > 1 ? 's' : ''}`)
    .join(', ')
}

/**
 * The tile layouts (spec phase 1) the game on the Play page builds its map from: every tile
 * in `tiles.json`, grouped by kind, with a terrain and site legend. Terrain only matters for
 * entering a hex (rule 3.4), so the legend says which terrains block moves and that the rest do not.
 */
export function TileSheet() {
  const { tiles } = defaultContent
  return (
    <section aria-labelledby="tiles-intro">
      <p id="tiles-intro">
        The game on the Play page builds its map from these {tiles.length} tiles:{' '}
        {kindSummary(tiles)}. The Base tile starts in the center; the Countryside tiles are drawn
        before the Core tiles. Under each tile, its 7 hexes are listed by position with their
        terrain and site.
      </p>
      <ul className={styles.legend} aria-label="Terrain legend">
        {TERRAINS.map((t) => (
          <li key={t}>
            <span className={`${styles.swatch} ${styles[t] ?? ''}`} aria-hidden="true" />
            {capitalize(t)}
            {IMPASSABLE.includes(t) ? ' (impassable)' : ' (no effect on moves)'}
          </li>
        ))}
      </ul>
      <ul className={`${styles.legend} ${styles.sites}`} aria-label="Site legend">
        {SITES.map((s) => (
          <li key={s} data-site-legend={s}>
            <GameIcon name={SITE_ICON[s]} className={styles.siteIcon} size="1.25rem" />
            {SITE_LABEL[s]} ({siteText(s, defaultContent.config, defaultContent)})
          </li>
        ))}
      </ul>
      {KINDS.map(([kind, heading]) => (
        <section key={kind} aria-labelledby={`tiles-${kind}`} data-tile-kind={kind}>
          <h2 id={`tiles-${kind}`}>{heading}</h2>
          <div className={styles.grid}>
            {tiles
              .filter((tile) => tile.kind === kind)
              .map((tile) => (
                <figure key={tile.id} className={styles.card} data-tile={tile.id}>
                  <TileView tile={tile} />
                  <figcaption>
                    <h3 className={styles.name}>{tile.name}</h3>
                    {siteSummary(tile.hexes.map((h) => h.site))}
                    <ul className={styles.hexList} aria-label={`${tile.name} hexes`}>
                      {HEX_LIST_ORDER.map((i) => {
                        const hex = tile.hexes[i]
                        return hex ? (
                          <li key={i} data-hex-row={i}>
                            <span className={styles.position}>{HEX_POSITION[i]}:</span>{' '}
                            {hexLabel(hex)}
                          </li>
                        ) : null
                      })}
                    </ul>
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      ))}
    </section>
  )
}
