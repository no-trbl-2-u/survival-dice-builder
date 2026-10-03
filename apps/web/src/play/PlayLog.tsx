import type { GameState } from '@survival/engine'
import { describeEvent } from './describeEvent.ts'
import styles from './Play.module.css'

const SHOWN = 60

type Props = Readonly<{ state: GameState }>

/** The event log: newest first, each line with the rule that produced it. */
export function PlayLog({ state }: Props) {
  const events = state.log.slice(-SHOWN).reverse()
  return (
    <section className={styles.panel} aria-label="Event log">
      <h2 className={styles.panelTitle}>What happened (newest first)</h2>
      <ol className={styles.log} data-testid="play-log">
        {events.map((e, i) => (
          <li key={`${state.log.length - i}`}>
            <span className={styles.rule}>{e.rule}</span> {describeEvent(e, state)}
          </li>
        ))}
      </ol>
    </section>
  )
}
