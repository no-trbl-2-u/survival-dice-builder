import { useEffect, useRef } from 'react'
import { downloadRun } from './exportRun.ts'
import { milestoneIds, milestoneLabel } from './milestoneText.ts'
import styles from './Play.module.css'
import type { Run } from './run.ts'

type Props = Readonly<{ run: Run; baseCurve: readonly number[]; onNewRun: () => void }>

/** The end of the run: cause, round, level, milestones, base health by round, and the export. */
export function RunSummary({ run, baseCurve, onNewRun }: Props) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => ref.current?.focus(), [])
  const s = run.state
  const all = milestoneIds(s.config.milestones)
  const download = () => downloadRun(run, Date.now())
  const max = Math.max(1, ...baseCurve)
  return (
    <section
      ref={ref}
      tabIndex={-1}
      className={styles.summary}
      aria-labelledby="summary-title"
      data-testid="run-summary"
    >
      <h2 id="summary-title" className={styles.summaryTitle}>
        The base fell in round {s.round}
      </h2>
      <p className={styles.muted}>
        Seed {run.seed} · {run.actions.length} actions · level {s.level} · {s.upgrades.length}{' '}
        {s.upgrades.length === 1 ? 'upgrade' : 'upgrades'}
      </p>
      <h3 className={styles.subTitle}>Milestones</h3>
      <ul className={styles.milestones}>
        {all.map((id) => {
          const got = s.milestones.includes(id)
          return (
            <li key={id} className={got ? styles.got : styles.muted}>
              {got ? '✓' : '–'} {milestoneLabel(id, s.config.milestones, s.content)}
            </li>
          )
        })}
      </ul>
      <h3 className={styles.subTitle}>Base health at the start of each round</h3>
      <ol className={styles.curve} aria-label="Base health by round">
        {baseCurve.map((h, i) => (
          <li key={i} title={`Round ${i + 1}: ${h}`}>
            <span className={styles.bar} style={{ blockSize: `${(h / max) * 100}%` }} />
            <small>
              {i + 1}: {h}
            </small>
          </li>
        ))}
      </ol>
      <div className={styles.row}>
        <button type="button" className={styles.primary} onClick={download}>
          Download run (JSON)
        </button>
        <button type="button" onClick={onNewRun}>
          New run
        </button>
      </div>
    </section>
  )
}
