import type { GameState } from '@survival/engine'
import styles from './Play.module.css'

const PHASES = [
  { id: 'prepare', label: 'Prepare' },
  { id: 'combat', label: 'Combat' },
  { id: 'explore', label: 'Explore' },
] as const

type Props = Readonly<{ state: GameState }>

/**
 * Round, the 3 phases (the current one filled and marked), and the board counters: wave
 * track, tiles left, enemy miniatures on the map.
 */
export function PhaseBar({ state }: Props) {
  const step = state.exchange
    ? `${state.exchange.skirmish ? 'Skirmish' : 'Exchange'}: ${state.exchange.step}`
    : state.phase === 'setup'
      ? 'Setup: place the first countryside tile'
      : state.phase === 'ended'
        ? `Run ended: ${state.endedBecause === 'base' ? 'the base fell' : 'a player fell'}`
        : null
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
        Wave {state.waveTrack} · Tiles left {state.tileDeck.length} · Enemies {state.enemies.length}
        /{state.config.miniatureLimit}
      </span>
      {step ? <span className={styles.step}>{step}</span> : null}
    </header>
  )
}
