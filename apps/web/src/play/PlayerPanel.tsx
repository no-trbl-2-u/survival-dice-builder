import { experienceForLevel, type GameState } from '@survival/engine'
import { GameIcon } from '../icons/GameIcon.tsx'
import styles from './Play.module.css'

type Props = Readonly<{ state: GameState }>

/** The display name of a seat: "You" in a solo run, "Player N" in co-op. */
export function seatName(state: GameState, seat: number): string {
  return state.players.length === 1 ? 'You' : `Player ${seat + 1}`
}

/**
 * Every player's tracks (the current player first in bold, marked "turn"), the shared level,
 * and the base, as numbers with labels (never a bar alone). All hands are open (16.3).
 */
export function PlayerPanel({ state }: Props) {
  const next = experienceForLevel(state.level + 1, state.config)
  return (
    <section className={styles.panel} aria-label="Players">
      <h2 className={styles.panelTitle}>
        {state.players.length === 1 ? 'You' : 'Players'} ·{' '}
        <span key={state.level} className={state.level > 1 ? styles.levelUp : undefined}>
          level {state.level}
        </span>{' '}
        · <GameIcon name="experience" /> experience {state.experience} / {next} · base{' '}
        {state.base.health} / {state.base.maxHealth}
      </h2>
      <div data-testid="player-panel" className={styles.playerList}>
        {state.players.map((p, seat) => {
          const current = seat === state.current
          const rows: [string, string, string, string][] = [
            ['Health', `${p.health} / ${p.maxHealth}`, styles.health ?? '', 'health'],
            ['Guard', String(p.guard), styles.guard ?? '', 'guard'],
            ['Action dice', String(p.dice), '', 'face-star'],
            ['Materials', String(p.materials), styles.materials ?? '', 'materials'],
            ['Currency', String(p.currency), styles.currency ?? '', 'currency'],
          ]
          return (
            <div
              key={p.id}
              className={`${styles.playerCard} ${current ? styles.currentPlayer : ''}`}
              aria-current={current && state.players.length > 1 ? 'true' : undefined}
            >
              {state.players.length > 1 ? (
                <h3 className={styles.subTitle}>
                  {seatName(state, seat)}
                  {current ? ' — turn' : ''} · hand {p.hand.length} · deck {p.deck.length}
                </h3>
              ) : null}
              <dl className={styles.stats}>
                {rows.map(([label, value, cls, icon]) => (
                  <div key={label} className={styles.stat}>
                    <dt>
                      <GameIcon name={icon} className={cls} /> {label}
                    </dt>
                    <dd className={cls}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}
      </div>
    </section>
  )
}
