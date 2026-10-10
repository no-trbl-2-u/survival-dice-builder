import {
  combatModelLine,
  combatModelTag,
  defaultConfigMeta,
  defaultContent,
  flagSettings,
  openQuestions,
  parseQuestions,
  parseUserCalls,
  settingsCombatModel,
  statusLabel,
  type QuestionRow,
} from '@survival/content'
import questionsMd from '../../../../OPEN-QUESTIONS.md?raw'
import auditMd from '../../../../plan/AUDIT.md?raw'
import styles from './DecisionsPage.module.css'
import { Inline, RepoFile, rowId } from './Inline.tsx'

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
  const shown = new Set(open.map((q) => q.number))
  return (
    <div className={styles.page}>
      <p>
        {open.length} rule readings and {calls.length} checks wait on the designer. To change a
        value, follow its link to the Config page. The designer confirms a reading by changing its
        status in <RepoFile path="OPEN-QUESTIONS.md" />. The same list is in{' '}
        <RepoFile path="docs/DECISIONS.md" />.
      </p>
      <p>{combatModelLine(defaultContent.config)}</p>
      <nav aria-label="On this page">
        <a href="#readings">Rule readings</a> · <a href="#checks">Checks</a>
      </nav>

      <h2 id="readings">Rule readings</h2>
      <ol className={styles.list} data-testid="readings">
        {open.map((q) => {
          const model = settingsCombatModel(
            flagSettings(q.flag, defaultContent.config),
            defaultConfigMeta,
          )
          return (
            <li
              key={q.number}
              id={rowId(q.number)}
              className={styles.item}
              data-question={q.number}
            >
              <h3 className={styles.question}>
                {q.number}. <Inline text={q.question} rows={shown} />{' '}
                <span className={styles.muted}>(rule {q.rule})</span>
                {model ? (
                  <>
                    {' '}
                    <span className={styles.tag} data-testid="combat-model">
                      {combatModelTag(model)}
                    </span>
                  </>
                ) : null}
              </h3>
              <p className={styles.muted}>Status: {statusLabel(q.status)}</p>
              <p>
                <Inline text={q.reading} rows={shown} />
              </p>
              <p>
                Setting: <Settings row={q} />
              </p>
            </li>
          )
        })}
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
