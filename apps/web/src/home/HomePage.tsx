import { HexTile } from '../map/HexTile.tsx'
import styles from './HomePage.module.css'

/** `/`: what the game is, how a run goes, and the way in. */
export function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.text}>
        <p className={styles.pitch}>
          Defend the base, build your dice, survive one more round. A survival dice-builder for 1 to
          4 players, on one screen.
        </p>
        <a className={styles.start} href="/play">
          Start a run
        </a>
        <h2 className={styles.heading}>How a run goes</h2>
        <ol className={styles.steps}>
          <li>
            <strong>Prepare:</strong> play the top halves of your cards to move, gather materials,
            and build Barricades and Towers. Step off the edge of the map to reveal a new tile. Each
            new tile's spawn nodes add enemies at every Combat, and enemies go for the nearest
            structure first.
          </li>
          <li>
            <strong>Combat:</strong> play Engage to roll your dice, plus 1 enemy die for each enemy
            next to you. Put your dice on your Skills one at a time; the enemy dice hit last, after
            your guard.
          </li>
        </ol>
        <p>
          A player at 0 health is knocked out and comes back next round. The run ends when the base
          falls. Level up, buy cards in the Shop, and draft Skills to last longer.
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
