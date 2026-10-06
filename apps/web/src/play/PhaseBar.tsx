import type { GameState } from '@survival/engine'
import styles from './Play.module.css'

const PHASES = [
  { id: 'prepare', label: 'Prepare' },
  { id: 'combat', label: 'Combat' },
] as const

type Props = Readonly<{ state: GameState }>

/**
 * Round, the 2 phases (the current one filled and marked), and the board counters: tiles
 * left and enemy miniatures on the map.
 */
export function PhaseBar({ state }: Props) {
  return (
    <header className={styles.phaseBar} data-testid="phase-bar">
      <strong className={styles.round}>Round {state.round}</strong>
      {state.players.length > 1 && state.phase !== 'ended' ? (
        <strong className={styles.turn} data-testid="turn">
          Player {state.current + 1}&apos;s turn
        </strong>
      ) : null}
      <ol className={styles.phases} aria-label="Phases">
        {PHASES.map((p) => {
          const current = state.phase === p.id
          return (
            <li
              key={p.id}
              className={`${styles.phase} ${styles[p.id]} ${current ? styles.current : ''}`}
              aria-current={current ? 'step' : undefined}
            >
              {current ? '▶ ' : ''}
              {p.label}
            </li>
          )
        })}
      </ol>
      <span className={styles.counters}>
        Tiles left {state.tileDeck.length} · Enemies {state.enemies.length}/
        {state.config.miniatureLimit}
      </span>
    </header>
  )
}
