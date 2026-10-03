import { HexTile } from '../map/HexTile.tsx'
import styles from './HomePage.module.css'

/** `/`: what the game is, how a run goes, and the way in. */
export function HomePage() {
  return (
    <div className={styles.home}>
      <p className={styles.pitch}>
        Defend the base, build your dice, survive one more round. A survival dice-builder for 1 to 4
        players, on one screen.
      </p>
      <a className={styles.start} href="/play">
        Start a run
      </a>
      <h2 className={styles.heading}>How a run goes</h2>
      <ol className={styles.steps}>
        <li>
          <strong>Prepare:</strong> play the top halves of your cards to move, gather materials, and
          build Barricades and Towers.
        </li>
        <li>
          <strong>Combat:</strong> roll your dice, keep the faces you want, and put them on your
          Skills to hit the grunts and elites near you.
        </li>
        <li>
          <strong>Explore:</strong> reveal new tiles. The wave track rises and more enemies come.
        </li>
      </ol>
      <p>
        The run ends when the base or a player falls. Level up, buy cards in the Shop, and draft
        Skills to last longer.
      </p>
      <p className={styles.more}>
        Also: <a href="/tiles">the proposed tiles</a>, <a href="/config">the rules config</a>, and{' '}
        <a href="/credits">credits</a>.
      </p>
      <div className={styles.art} aria-hidden="true">
        <HexTile center={{ q: 0, r: 0 }} />
      </div>
    </div>
  )
}
