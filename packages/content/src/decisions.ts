import type { GameConfig } from './schemas/config.ts'

/** One row of the `OPEN-QUESTIONS.md` table (cells keep their markdown). */
export type QuestionRow = Readonly<{
  number: number
  rule: string
  question: string
  reading: string
  flag: string
  status: string
}>

/** One config setting named by a row's Flag column, read against a config. */
export type FlagSetting = Readonly<{
  /** The key as the row writes it. */
  key: string
  /** The config path it resolves to, or null when no config field matches. */
  path: string | null
  /** The value the row names (`key: value`), as JSON text, or null when it names none. */
  named: string | null
  /** The config's current value as JSON text, or null when the key does not resolve. */
  current: string | null
  /** True when the row names a value and the config holds a different one. */
  differs: boolean
}>

/** A `[needs-user-call]` check from `plan/AUDIT.md`. */
export type UserCall = Readonly<{ title: string; body: string }>

/** Splits a markdown table line into trimmed cells (outer pipes dropped). */
function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim())
}

/**
 * Reads the open-questions table: every row whose first cell is a number.
 *
 * @param md - the text of `OPEN-QUESTIONS.md`.
 */
export function parseQuestions(md: string): QuestionRow[] {
  return md.split('\n').flatMap((line) => {
    if (!line.startsWith('|')) return []
    const [n, rule, question, reading, flag, status] = cells(line)
    const number = Number(n)
    if (!Number.isInteger(number) || number <= 0) return []
    return [
      {
        number,
        rule: rule ?? '',
        question: question ?? '',
        reading: reading ?? '',
        flag: flag ?? '',
        status: status ?? '',
      },
    ]
  })
}

/** Status words that mean the designer has not settled the row (in part or in full). */
const OPEN = /proposed|pending-spec/

/**
 * The rows still waiting on the designer, `pending-spec` first, then by number.
 *
 * @param rows - every question row.
 */
export function openQuestions(rows: readonly QuestionRow[]): QuestionRow[] {
  const rank = (r: QuestionRow) => (r.status.includes('pending-spec') ? 0 : 1)
  return rows
    .filter((r) => OPEN.test(r.status))
    .sort((a, b) => rank(a) - rank(b) || a.number - b.number)
}

/**
 * A row's status in plain words for the designer: what it waits on, with no dates, phase
 * numbers or build terms. A note in brackets is kept only when it names a topic
 * (`(Skill design)`); notes about the build (`(engine: phase 21, shipped)`) become a plain
 * sentence or are dropped.
 *
 * @param status - the Status cell, for example `proposed 2026-10-04 (engine: phase 21, shipped)`.
 */
export function statusLabel(status: string): string {
  const note = (/\((.*)\)/.exec(status)?.[1] ?? '').replace(/^\d{4}-\d{2}-\d{2}:\s*/, '')
  const topic = note && !/phase \d|engine|structural|experiment/.test(note) ? ` (${note})` : ''
  if (status.startsWith('pending-spec'))
    return `Waiting for the designer to write the rule${topic}.`
  const plays = /structural/.test(note)
    ? ' It is an option, off by default.'
    : /phase \d|engine/.test(note)
      ? ' The game plays this reading now.'
      : ''
  return `Proposed, waiting for the designer's answer${topic}.${plays}`
}

/** Every leaf path of a config object ("rulings.enemiesPerHex"). */
function leafPaths(value: unknown, prefix: string[] = []): string[] {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => leafPaths(v, [...prefix, k]))
  }
  return [prefix.join('.')]
}

/** The value at a dotted path. */
function at(config: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], config)
}

/** An empty optional value (`null`, an option that is off) reads as `empty`. */
const shown = (json: string | null): string | null => (json === 'null' ? 'empty' : json)

/** A row's named value as JSON text: `"v1"`, `1`, `true` parse; anything else is quoted. */
function namedJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text))
  } catch {
    return JSON.stringify(text)
  }
}

/**
 * The config settings a row's Flag column names, with the current value of each. A flag that
 * starts with `(engine` is a reading in engine code, not a setting, and yields none.
 *
 * @param flag - the Flag cell, for example `` `rulings.enemiesPerHex: 1` ``.
 * @param config - the config to read (normally the default config).
 */
export function flagSettings(flag: string, config: GameConfig): FlagSetting[] {
  if (flag.startsWith('(engine')) return []
  const paths = leafPaths(config)
  // Only the part before a "(future ...)" note names the setting.
  const main = flag.split('(future')[0] ?? ''
  return [...main.matchAll(/`([^`]+)`/g)].flatMap(([, inner = '']) => {
    const [key = '', ...rest] = inner.split(':')
    const name = key.trim()
    if (!/^[\w.]+$/.test(name)) return []
    const suffix = paths.filter((p) => p === name || p.endsWith(`.${name}`))
    const path = paths.includes(name) ? name : suffix.length === 1 ? (suffix[0] ?? null) : null
    const named = rest.length > 0 ? namedJson(rest.join(':').trim()) : null
    const current = path ? JSON.stringify(at(config, path)) : null
    return [
      {
        key: name,
        path,
        named: shown(named),
        current: shown(current),
        differs: named !== null && current !== null && named !== current,
      },
    ]
  })
}

/**
 * Reads every `- [needs-user-call] **Title** body` line.
 *
 * @param md - the text of `plan/AUDIT.md`.
 */
export function parseUserCalls(md: string): UserCall[] {
  return md.split('\n').flatMap((line) => {
    const m = /^- \[needs-user-call\]\s+(?:\*\*(.+?)\*\*\s*)?(.*)$/.exec(line.trim())
    if (!m) return []
    return [{ title: m[1] ?? '', body: (m[2] ?? '').trim() }]
  })
}

/** One settings line for a row, in markdown. */
function settingsLine(settings: readonly FlagSetting[], flag: string): string {
  if (flag.startsWith('(engine'))
    return `engine code ${flag.replace(/^\(engine,?\s*|\)$/g, '') || ''}`.trim()
  if (settings.length === 0) return `not a config setting (${flag})`
  return settings
    .map((s) => {
      if (!s.path) return `\`${s.key}\`: no config field`
      const shown =
        (s.current ?? '').length > 40 ? 'a list or table; see /config' : `\`${s.current}\``
      const value = `\`${s.path}\` = ${shown}`
      return s.differs ? `${value} (row says \`${s.named}\`: differs)` : value
    })
    .join('; ')
}

/**
 * The decision digest as markdown: open readings, then pending checks. It holds no dates or
 * hashes, so it changes only when `OPEN-QUESTIONS.md` or `plan/AUDIT.md` change.
 *
 * @param questions - every question row (the open ones are picked here).
 * @param calls - the needs-user-call checks.
 * @param config - the config whose values are shown (normally the default config).
 */
export function decisionsMarkdown(
  questions: readonly QuestionRow[],
  calls: readonly UserCall[],
  config: GameConfig,
): string {
  const open = openQuestions(questions)
  const lines = [
    '# Decisions waiting on the designer',
    '',
    '> Generated by `pnpm sim -- decisions --out docs/DECISIONS.md` from `OPEN-QUESTIONS.md`',
    '> and `plan/AUDIT.md`. Do not edit by hand. Also on the live site at `/decisions`.',
    '',
    `${open.length} rule readings and ${calls.length} checks are open. To confirm a reading,`,
    'change its status in `OPEN-QUESTIONS.md`; to change its value, use `/config`.',
    'Evidence: the bot batch report (`docs/reports/phase-9-bot-batch.md`) and the playtest',
    'kit (`docs/playtests/`, `pnpm sim -- playtests`).',
    '',
    '## Rule readings',
    '',
  ]
  for (const q of open) {
    lines.push(
      `### ${q.number}. ${q.question.replace(/\.$/, '')} (rule ${q.rule})`,
      '',
      `- Status: ${q.status}`,
      `- Reading: ${q.reading}`,
      `- Setting: ${settingsLine(flagSettings(q.flag, config), q.flag)}`,
      '',
    )
  }
  lines.push('## Checks', '')
  for (const c of calls) lines.push(c.title ? `- **${c.title}** ${c.body}` : `- ${c.body}`)
  return `${lines.join('\n')}\n`
}
