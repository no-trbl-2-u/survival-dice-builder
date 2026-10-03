import { defaultContent, type Site, type Terrain } from '@survival/content'
import { GameIcon } from '../icons/GameIcon.tsx'
import { HEX_POSITION, hexLabel, SITE_ICON, SITE_LABEL, TileView } from './TileView.tsx'
import styles from './TileSheet.module.css'

const TERRAINS: readonly Terrain[] = ['plains', 'forest', 'hills', 'wasteland', 'lake', 'mountain']
const SITES: readonly Site[] = ['base', 'gathering-node', 'spawn-node', 'elite-spawn-node']

/** Counts each site printed on a tile, for the caption. */
function siteSummary(sites: readonly (Site | null)[]): string {
  return SITES.map((s) => [s, sites.filter((x) => x === s).length] as const)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${n} ${SITE_LABEL[s].toLowerCase()}${n > 1 ? 's' : ''}`)
    .join(', ')
}

/**
 * The proposed tile layouts (spec phase 1) for designer review: every tile in
 * `tiles.json`, grouped by kind, with a terrain and site legend.
 */
export function TileSheet() {
  const { tiles } = defaultContent
  return (
    <section aria-labelledby="tiles-intro">
      <p id="tiles-intro">
        Proposed layouts for review: 1 Base tile, 3 countryside tiles, and 5 core tiles. Under each
        tile, its 7 hexes are listed by position with their terrain and site.
      </p>
      <ul className={styles.legend} aria-label="Terrain legend">
        {TERRAINS.map((t) => (
          <li key={t}>
            <span className={`${styles.swatch} ${styles[t] ?? ''}`} aria-hidden="true" />
            {t}
            {t === 'lake' || t === 'mountain' ? ' (impassable)' : ''}
          </li>
        ))}
      </ul>
      <ul className={`${styles.legend} ${styles.sites}`} aria-label="Site legend">
        {SITES.map((s) => (
          <li key={s} data-site-legend={s}>
            <GameIcon name={SITE_ICON[s]} className={styles.siteIcon} size="1.25rem" />
            {SITE_LABEL[s]}
          </li>
        ))}
      </ul>
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <figure key={tile.id} className={styles.card} data-tile={tile.id}>
            <TileView tile={tile} />
            <figcaption>
              <strong>{tile.name}</strong> <span className={styles.kind}>{tile.kind}</span>
              <br />
              {siteSummary(tile.hexes.map((h) => h.site))}
              <ul className={styles.hexList} aria-label={`${tile.name} hexes`}>
                {tile.hexes.map((hex, i) => (
                  <li key={i} data-hex-row={i}>
                    <span className={styles.position}>{HEX_POSITION[i]}:</span> {hexLabel(hex)}
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
