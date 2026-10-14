import { miniatureLimitText } from '@survival/content'
import type { GameState } from '@survival/engine'
import styles from './Play.module.css'

const PHASES = [
  { id: 'prepare', label: 'Prepare' },
  { id: 'combat', label: 'Combat' },
] as const

type Props = Readonly<{ state: GameState }>

/**
 * Round, the 2 phases (the current one filled and marked), and the board counters: tiles
 * left and enemy miniatures on the map against the miniature limit (rule 10.5). The arrow
 * on the current phase is decoration; `aria-current` already tells screen readers.
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
              {current ? <span aria-hidden="true">▶ </span> : null}
              {p.label}
            </li>
          )
        })}
      </ol>
      <span className={styles.counters}>
        Tiles left {state.tileDeck.length} ·{' '}
        <span data-testid="enemy-count" title={miniatureLimitText(state.config)}>
          Enemies {state.enemies.length} of {state.config.miniatureLimit} (map limit)
        </span>
      </span>
    </header>
  )
}
