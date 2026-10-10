import {
  combatText,
  defaultContent,
  goalText,
  knockoutText,
  playersText,
  revealText,
  spawnText,
} from '@survival/content'
import { rulesUrl } from '../decisions/Inline.tsx'
import { HexTile } from '../map/HexTile.tsx'
import styles from './HomePage.module.css'

/** `/` describes the default rules: every rule phrase comes from `ruleText`. */
const config = defaultContent.config

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

/** `/`: what the game is, how a run goes, and the way in. */
export function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.text}>
        <p className={styles.pitch}>
          Defend the base, build your dice, survive one more round. A survival dice-builder for{' '}
          {playersText(config)}, on one screen.
        </p>
        <a className={styles.start} href="/play">
          Start a run
        </a>
        <h2 className={styles.heading}>How a run goes</h2>
        <ol className={styles.steps}>
          <li>
            <strong>Prepare:</strong> play the top halves of your cards to move, gather materials,
            and build Barricades and Towers. {revealText(config)} {spawnText(config)}
          </li>
          <li>
            <strong>Combat:</strong> {combatText(config, 'engage')} Or choose Exchanges, the Combat
            in the <a href={rulesUrl}>written rules</a>, on the start panel:{' '}
            {lower(combatText(config, 'exchange'))}
          </li>
        </ol>
        <p>
          {goalText()} {knockoutText(config)} Level up, buy cards in the Shop, and draft Skills to
          last longer.
        </p>
        <p className={styles.more}>
          Also: <a href="/tiles">the proposed tiles</a>, <a href="/config">the rules config</a>, and{' '}
          <a href="/credits">credits</a>.
        </p>
      </div>
      <div className={styles.art} aria-hidden="true">
        <HexTile center={{ q: 0, r: 0 }} />
      </div>
    </div>
  )
}
