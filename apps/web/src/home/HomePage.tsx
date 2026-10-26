import {
  combatText,
  defaultContent,
  defenseText,
  goalText,
  knockoutText,
  levelText,
  playersText,
  revealText,
  roundText,
  shopText,
  siegeText,
  spawnText,
  startText,
  targetText,
  trainingText,
} from '@survival/content'
import { rulesUrl } from '../decisions/Inline.tsx'
import { HexTile } from '../map/HexTile.tsx'
import styles from './HomePage.module.css'

/** `/` describes the default rules: every rule phrase comes from `ruleText`. */
const config = defaultContent.config

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

/** `/`: what the game is, what you start with, how a run goes, and the way in. */
export function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.text}>
        <p className={styles.pitch}>
          Defend the base, build your dice, survive one more round. A co-op survival dice-builder
          for {playersText(config)} on one screen: all players defend one base.
        </p>
        <a className={styles.start} href="/play">
          Start a run
        </a>
        <h2 className={styles.heading}>What you have</h2>
        <p>{startText(config, defaultContent)}</p>
        <h2 className={styles.heading}>How a run goes</h2>
        <p>{roundText(config)}</p>
        <ol className={styles.steps}>
          <li>
            <strong>Prepare:</strong> play the top halves of your cards to move, gather materials
            and build Barricades and Towers.
          </li>
          <li>
            <strong>Combat:</strong> {combatText(config, 'engage', defaultContent)} This is the
            Combat in the <a href={rulesUrl}>written rules</a> (on GitHub). Before a run, you can
            choose Exchanges instead, the older Combat kept for playtests.{' '}
            {combatText(config, 'exchange', defaultContent)} Either way,{' '}
            {lower(siegeText(defaultContent))}
          </li>
        </ol>
        <ul className={styles.steps}>
          <li>
            <strong>Defenses:</strong> {defenseText(config, defaultContent)}
          </li>
          <li>
            <strong>The map:</strong> {revealText(config)}
          </li>
          <li>
            <strong>Enemies:</strong> {spawnText(config)} {targetText(config)}
          </li>
        </ul>
        <p>
          {goalText()} {knockoutText(config)}
        </p>
        <h2 className={styles.heading}>How you grow</h2>
        <ul className={styles.steps}>
          <li>
            <strong>Levels:</strong> {levelText(config, defaultContent)}
          </li>
          <li>
            <strong>Shop:</strong> {shopText(config, defaultContent)}
          </li>
          <li>
            <strong>Skills:</strong> {trainingText(config, defaultContent)}
          </li>
        </ul>
        <p className={styles.more}>
          Also: <a href="/tiles">the map tiles</a>, <a href="/config">the rules config</a>,{' '}
          <a href="/decisions">the Decisions page</a> (rule readings that wait on the designer) and{' '}
          <a href="/credits">credits</a>.
        </p>
      </div>
      <div className={styles.art} aria-hidden="true">
        <HexTile center={{ q: 0, r: 0 }} />
      </div>
    </div>
  )
}
