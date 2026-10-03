import { useEffect, useRef } from 'react'
import { exportFileName, exportRun } from './exportRun.ts'
import styles from './Play.module.css'
import type { Run } from './run.ts'

const MILESTONE_LABEL: Record<string, string> = {
  'survive-round-5': 'Survive to round 5',
  'survive-round-10': 'Survive to round 10',
  'survive-round-15': 'Survive to round 15',
  'defeat-elite': 'Defeat an elite',
  'buy-upgrades': 'Buy 3 base upgrades',
  'reveal-tiles': 'Reveal 10 tiles',
  'reach-level': 'Reach level 5',
}

type Props = Readonly<{ run: Run; baseCurve: readonly number[]; onNewRun: () => void }>

/** The end of the run: cause, round, level, milestones, base health by round, and the export. */
export function RunSummary({ run, baseCurve, onNewRun }: Props) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => ref.current?.focus(), [])
  const s = run.state
  const all = [
    ...s.config.milestones.surviveRounds.map((n) => `survive-round-${n}`),
    'defeat-elite',
    `fire-${s.config.milestones.skillFired}`,
    'buy-upgrades',
    'reveal-tiles',
    'reach-level',
  ]
  const download = () => {
    const data = exportRun(run)
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    )
    const a = document.createElement('a')
    a.href = url
    a.download = exportFileName(data)
    a.click()
    URL.revokeObjectURL(url)
  }
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
        {s.endedBecause === 'base' ? 'The base fell' : 'You fell'} in round {s.round}
      </h2>
      <p className={styles.muted}>
        Seed {run.seed} · {run.actions.length} actions · level {s.level} · {s.upgrades.length}{' '}
        upgrades
      </p>
      <h3 className={styles.subTitle}>Milestones</h3>
      <ul className={styles.milestones}>
        {all.map((id) => {
          const got = s.milestones.includes(id)
          return (
            <li key={id} className={got ? styles.got : styles.muted}>
              {got ? '✓' : '–'}{' '}
              {MILESTONE_LABEL[id] ??
                `Fire ${s.content.skills.find((k) => `fire-${k.id}` === id)?.name ?? id}`}
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
