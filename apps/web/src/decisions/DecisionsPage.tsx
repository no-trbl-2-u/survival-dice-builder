import {
  combatModelLine,
  combatModelTag,
  decidedDate,
  defaultConfigMeta,
  defaultContent,
  flagSettings,
  openQuestions,
  parseQuestions,
  parseUserCalls,
  proposalForRow,
  readingRuleText,
  RECENT_DATES,
  RECENT_NOTE,
  recentDecisions,
  settingsCombatModel,
  settingValueText,
  SPEC_V2_LINE,
  splitReading,
  statusLabel,
  unlistedSettingText,
  type QuestionRow,
} from '@survival/content'
import questionsMd from '../../../../OPEN-QUESTIONS.md?raw'
import auditMd from '../../../../plan/AUDIT.md?raw'
import styles from './DecisionsPage.module.css'
import { Inline, RepoFile, rowId } from './Inline.tsx'
import { ProposalTry } from './ProposalTry.tsx'

/** A reading, and on its own line the note on what the written rules changed, when the row has one. */
function Reading({ text, rows }: Readonly<{ text: string; rows: ReadonlySet<number> }>) {
  const { reading, specV2 } = splitReading(text)
  return (
    <>
      {reading ? (
        <p>
          <Inline text={reading} rows={rows} />
        </p>
      ) : null}
      {specV2 ? (
        <p data-testid="spec-v2">
          <strong>{SPEC_V2_LINE}:</strong> <Inline text={specV2} rows={rows} />
        </p>
      ) : null}
    </>
  )
}

/** The config field id on /config for a dotted path (`rulings.enemiesPerHex`). */
const fieldId = (path: string) => `cfg-${path.split('.').join('-')}`

/** The settings line of a reading: each setting's label links to its /config field. */
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
              <a href={`/config#${fieldId(s.path)}`}>
                {defaultConfigMeta[s.path]?.label ?? s.path}
              </a>
              : {settingValueText(s.path, s.current ?? '', defaultConfigMeta)}
              {s.differs && s.named ? (
                <strong className={styles.differs}>
                  {' '}
                  (This row names {settingValueText(s.path, s.named, defaultConfigMeta)}; the game
                  uses {settingValueText(s.path, s.current ?? '', defaultConfigMeta)}.)
                </strong>
              ) : null}
            </>
          ) : (
            unlistedSettingText(s.key)
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
  const questions = parseQuestions(questionsMd)
  const open = openQuestions(questions)
  const recent = recentDecisions(questions)
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
        <a href="#readings">Rule readings</a> · <a href="#recent">Decided recently</a> ·{' '}
        <a href="#checks">Checks</a>
      </nav>

      <h2 id="readings">Rule readings</h2>
      <ol className={styles.list} data-testid="readings">
        {open.map((q) => {
          const proposal = proposalForRow(q.number)
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
                <span className={styles.muted}>({readingRuleText(q.rule)})</span>
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
              <Reading text={q.reading} rows={shown} />
              <p>
                Setting: <Settings row={q} />
              </p>
              {proposal ? <ProposalTry proposal={proposal} /> : null}
            </li>
          )
        })}
      </ol>

      <h2 id="recent">Decided recently</h2>
      <p>
        Readings the designer decided on the last {RECENT_DATES} decision dates, newest first.{' '}
        {RECENT_NOTE}
      </p>
      <ol className={styles.list} data-testid="recent">
        {recent.map((q) => (
          <li key={q.number} className={styles.item} data-decided={q.number}>
            <h3 className={styles.question}>
              {q.number}. <Inline text={q.question} rows={shown} />{' '}
              <span className={styles.muted}>
                ({readingRuleText(q.rule)}, decided {decidedDate(q.status)})
              </span>
            </h3>
            <Reading text={q.reading} rows={shown} />
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
