import {
  defaultConfigMeta,
  defaultContent,
  flagSettings,
  openQuestions,
  parseQuestions,
  parseUserCalls,
  type QuestionRow,
} from '@survival/content'
import questionsMd from '../../../../OPEN-QUESTIONS.md?raw'
import auditMd from '../../../../plan/AUDIT.md?raw'
import styles from './DecisionsPage.module.css'
import { Inline } from './Inline.tsx'

/** The config field id on /config for a dotted path (`rulings.enemiesPerHex`). */
const fieldId = (path: string) => `cfg-${path.split('.').join('-')}`

/** The settings line of a reading: each setting links to its /config field. */
function Settings({ row }: Readonly<{ row: QuestionRow }>) {
  if (row.flag.startsWith('(engine')) return <>engine code, not a setting</>
  const settings = flagSettings(row.flag, defaultContent.config)
  if (settings.length === 0) return <>not a config setting</>
  return (
    <>
      {settings.map((s, i) => (
        <span key={s.key}>
          {i > 0 ? '; ' : null}
          {s.path ? (
            <>
              {defaultConfigMeta[s.path]?.label ?? null} (
              <a href={`/config#${fieldId(s.path)}`}>
                <code>{s.path}</code>
              </a>
              ) = {(s.current ?? '').length > 40 ? 'a list or table' : <code>{s.current}</code>}
              {s.differs ? (
                <strong className={styles.differs}> (the row says {s.named}: differs)</strong>
              ) : null}
            </>
          ) : (
            <>
              <code>{s.key}</code>: no config field
            </>
          )}
        </span>
      ))}
    </>
  )
}

/**
 * Everything waiting on the designer: open rule readings with their current config values, and
 * the pending checks. Read-only: values change on /config, statuses in OPEN-QUESTIONS.md.
 */
export function DecisionsPage() {
  const open = openQuestions(parseQuestions(questionsMd))
  const calls = parseUserCalls(auditMd)
  return (
    <div className={styles.page}>
      <p>
        {open.length} rule readings and {calls.length} checks wait on the designer. To change a
        value, follow its link to the Config page. To confirm a reading, change its status in{' '}
        <code>OPEN-QUESTIONS.md</code>. The same list is in <code>docs/DECISIONS.md</code>.
      </p>
      <nav aria-label="On this page">
        <a href="#readings">Rule readings</a> · <a href="#checks">Checks</a>
      </nav>

      <h2 id="readings">Rule readings</h2>
      <ol className={styles.list} data-testid="readings">
        {open.map((q) => (
          <li key={q.number} className={styles.item} data-question={q.number}>
            <h3 className={styles.question}>
              {q.number}. <Inline text={q.question} />{' '}
              <span className={styles.muted}>(rule {q.rule})</span>
            </h3>
            <p className={styles.muted}>Status: {q.status}</p>
            <p>
              <Inline text={q.reading} />
            </p>
            <p>
              Setting: <Settings row={q} />
            </p>
          </li>
        ))}
      </ol>

      <h2 id="checks">Checks</h2>
      <ul className={styles.list} data-testid="checks">
        {calls.map((c) => (
          <li key={c.title + c.body} className={styles.item}>
            {c.title ? (
              <>
                <strong>
                  <Inline text={c.title} />
                </strong>{' '}
              </>
            ) : null}
            <Inline text={c.body} />
          </li>
        ))}
      </ul>
    </div>
  )
}
