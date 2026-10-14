import {
  combatText,
  defaultContent,
  goalText,
  knockoutText,
  levelText,
  playersText,
  revealText,
  shopText,
  siegeText,
  spawnText,
  targetText,
  trainingText,
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
            and build Barricades and Towers. {revealText(config)} {spawnText(config)}{' '}
            {targetText(config)}
          </li>
          <li>
            <strong>Combat:</strong> {combatText(config, 'engage')} This is the Combat in the{' '}
            <a href={rulesUrl}>written rules</a>. Or choose Exchanges, the older Combat kept for
            playtests, on the start panel: {lower(combatText(config, 'exchange'))} Either way,{' '}
            {lower(siegeText(defaultContent))}
          </li>
        </ol>
        <p>
          {goalText()} {knockoutText(config)}
        </p>
        <h2 className={styles.heading}>How you grow</h2>
        <ul className={styles.steps}>
          <li>
            <strong>Levels:</strong> {levelText(config)}
          </li>
          <li>
            <strong>Shop:</strong> {shopText(config, defaultContent)}
          </li>
          <li>
            <strong>Skills:</strong> {trainingText(config, defaultContent)}
          </li>
        </ul>
        <p className={styles.more}>
          Also: <a href="/tiles">the proposed tiles</a>, <a href="/config">the rules config</a>,{' '}
          <a href="/decisions">the rules questions that wait on you</a>, and{' '}
          <a href="/credits">credits</a>.
        </p>
      </div>
      <div className={styles.art} aria-hidden="true">
        <HexTile center={{ q: 0, r: 0 }} />
      </div>
    </div>
  )
}
