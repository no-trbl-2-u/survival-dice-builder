import type { GameState } from '@survival/engine'
import { describeEvent } from './describeEvent.ts'
import styles from './Play.module.css'

const SHOWN = 60

type Props = Readonly<{ state: GameState }>

/** The event log: newest first, each line followed by a muted note of the rule behind it. */
export function PlayLog({ state }: Props) {
  const events = state.log.slice(-SHOWN).reverse()
  return (
    <section className={styles.panel} aria-label="Event log">
      <h2 className={styles.panelTitle}>What happened (newest first)</h2>
      <ol className={styles.log} data-testid="play-log">
        {events.map((e, i) => (
          <li key={`${state.log.length - i}`}>
            {describeEvent(e, state)}{' '}
            <span className={styles.rule} title={`Rules section ${e.rule}`}>
              rule {e.rule}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
