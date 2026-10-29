import { ruleCitation } from '@survival/content'
import type { GameState } from '@survival/engine'
import { describeEvent } from './describeEvent.ts'
import styles from './Play.module.css'

const SHOWN = 60

type Props = Readonly<{ state: GameState }>

/**
 * The muted note after a log line: "rule 7.8" for a section of the written rules, and "not in
 * the written rules" for any other tag (engagements, a designer ruling), since it names no
 * section a reader can look up. The same reading as the /debug log's tag.
 */
export function logRuleNote(rule: string): string {
  const cited = ruleCitation(rule)
  return /^\d/.test(cited) ? `rule ${cited}` : 'not in the written rules'
}

/** The event log: newest first, each line followed by a muted note of the rule behind it. */
export function PlayLog({ state }: Props) {
  const events = state.log.slice(-SHOWN).reverse()
  return (
    <section className={styles.panel} aria-label="Event log">
      <h2 className={styles.panelTitle}>What happened (newest first)</h2>
      <ol className={styles.log} data-testid="play-log">
        {events.map((e, i) => (
          <li key={`${state.log.length - i}`}>
            {describeEvent(e, state)} <span className={styles.rule}>{logRuleNote(e.rule)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
