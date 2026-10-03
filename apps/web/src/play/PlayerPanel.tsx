import { experienceForLevel, type GameState } from '@survival/engine'
import styles from './Play.module.css'

type Props = Readonly<{ state: GameState }>

/** The player's tracks and the base, as numbers with labels (never a bar alone). */
export function PlayerPanel({ state }: Props) {
  const p = state.players[state.current]
  if (!p) return null
  const next = experienceForLevel(state.level + 1, state.config)
  const rows: [string, string, string][] = [
    ['Health', `${p.health} / ${p.maxHealth}`, styles.health ?? ''],
    ['Guard', String(p.guard), styles.guard ?? ''],
    ['Action dice', String(p.dice), ''],
    ['Materials', String(p.materials), styles.materials ?? ''],
    ['Currency', String(p.currency), styles.currency ?? ''],
    ['Experience', `${state.experience} / ${next} (level ${state.level})`, ''],
    ['Base', `${state.base.health} / ${state.base.maxHealth}`, styles.health ?? ''],
  ]
  return (
    <section className={styles.panel} aria-label="Player">
      <h2 className={styles.panelTitle}>You</h2>
      <dl className={styles.stats} data-testid="player-panel">
        {rows.map(([label, value, cls]) => (
          <div key={label} className={styles.stat}>
            <dt>{label}</dt>
            <dd className={cls}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
