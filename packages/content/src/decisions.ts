import type { GameConfig } from './schemas/config.ts'
import type { ConfigMeta } from './schemas/configMeta.ts'
import { ruleCitation } from './ruleText.ts'

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

/** The marker in a Reading cell that starts the note on what Spec v2 changed. */
const SPEC_V2 = /\s*\*\*Spec v2:\*\*\s*/

/**
 * A Reading cell split into the reading as it was decided and the note on what Spec v2 changed
 * since (the text after `**Spec v2:**`), or null when the cell has no such note.
 *
 * @param reading - the Reading cell.
 * @rule Spec v2
 */
export function splitReading(
  reading: string,
): Readonly<{ reading: string; specV2: string | null }> {
  const [before = '', ...after] = reading.split(SPEC_V2)
  return after.length > 0 ? { reading: before, specV2: after.join(' ') } : { reading, specV2: null }
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

/** How many decision dates "Decided recently" covers, newest first. */
export const RECENT_DATES = 2

/** The label of the line under a reading that says what Spec v2 changed. */
export const SPEC_V2_LINE = 'Now in the written rules'

/** What "Decided recently" says about the game: a reading Spec v2 changed carries its note. */
export const RECENT_NOTE = `The game plays each reading now, except where a "${SPEC_V2_LINE}" line says what replaced it.`

/**
 * The date a `decided` status carries (`decided 2026-10-09 (default)` gives `2026-10-09`), or
 * null for any other status and for a decided status with no date (`decided (brief)`).
 *
 * @param status - the Status cell.
 */
export function decidedDate(status: string): string | null {
  return /^decided (\d{4}-\d{2}-\d{2})/.exec(status)?.[1] ?? null
}

/**
 * The rows the designer decided recently, newest first (then by number): every dated `decided`
 * row from the newest `dates` decision dates in the file (a row still partly open stays with the
 * open ones). Dates, not a window up to today: the digest depends only on `OPEN-QUESTIONS.md`,
 * and the first decisions of the project are not "recent" for ever after.
 *
 * @param rows - every question row.
 * @param dates - how many decision dates to cover.
 */
export function recentDecisions(rows: readonly QuestionRow[], dates = RECENT_DATES): QuestionRow[] {
  const dated = rows.flatMap((row) => {
    const date = OPEN.test(row.status) ? null : decidedDate(row.status)
    return date ? [{ row, date }] : []
  })
  const newest = [...new Set(dated.map((d) => d.date))].sort().reverse().slice(0, dates)
  return dated
    .filter((d) => newest.includes(d.date))
    .sort((a, b) => b.date.localeCompare(a.date) || a.row.number - b.row.number)
    .map((d) => d.row)
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
 * A setting's value in plain words, as /decisions shows it: a select value by its /config
 * phrase without the "(default)" note, an empty optional by its /config placeholder, on/off,
 * numbers as they are, and a list or table as "a list on the Config page".
 *
 * @param path - the config path (`rulings.buildLevels`).
 * @param json - the value as `flagSettings` gives it: JSON text, or `empty` for an empty optional.
 * @param meta - the config metadata.
 */
export function settingValueText(path: string, json: string, meta: ConfigMeta): string {
  const entry = meta[path]
  if (json === 'empty') return entry?.empty ?? 'off'
  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    return json
  }
  if (typeof value === 'boolean') return value ? 'on' : 'off'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') {
    const phrase = entry?.options?.[value]
    return phrase ? phrase.replace(/\s*\([^)]*\)$/, '') : value
  }
  return 'a list on the Config page'
}

/**
 * A reading's rule tag as /decisions shows it: written-rules sections through the play log's
 * citation ("rule 6.7, Table 6, core loop"), without the row of a rules table the page does not
 * show ("Table 8, row 20" is "rule Table 8"); a tag with no section is "not in the written rules",
 * with any note left after the design-document name ("not in the written rules (physical
 * edition)").
 *
 * @param rule - the row's Rule column ("Core loop v2", "10.3, core loop v2").
 * @rule 18.1
 */
export function readingRuleText(rule: string): string {
  const cited = ruleCitation(rule).replace(/,\s*row \d+/gi, '')
  if (/^(?:\d|Table)/.test(cited)) return `rule ${cited}`
  const note = cited.replace(/^core loop,?\s*/i, '')
  return `not in the written rules${note ? ` (${note})` : ''}`
}

/** Content files a row's Flag column may name, as the place a visitor knows them by. */
const CONTENT_FILES: Readonly<Record<string, string>> = {
  'tiles.json': 'the map tiles',
  'enemies.json': 'the enemy list',
  'skills.json': 'the Skills',
  'cards.json': 'the cards',
}

/**
 * Where a setting with no config field lives, in plain words: a content file is "Set in the map
 * tiles, not on the Config page"; any other key has no config field.
 *
 * @param key - the key as the row writes it (`tiles.json`, `miniatureLimit`).
 */
export function unlistedSettingText(key: string): string {
  const place = CONTENT_FILES[key] ?? (key.endsWith('.json') ? 'the game content' : null)
  return place ? `Set in ${place}, not on the Config page` : `${key}: no config field`
}

/**
 * The one Combat model a row applies under, or null when it applies under both. The row's first
 * setting is the option its reading proposes, so its `combatModel` (config metadata) decides.
 *
 * @param settings - the row's settings (`flagSettings`).
 * @param meta - the config metadata.
 * @rule 7.8, Combat v3
 */
export function settingsCombatModel(
  settings: readonly FlagSetting[],
  meta: ConfigMeta,
): 'engage' | 'exchange' | null {
  const path = settings[0]?.path
  return (path ? meta[path]?.combatModel : undefined) ?? null
}

/** The tag on a reading that applies under one Combat model: "Exchanges only". */
export function combatModelTag(model: 'engage' | 'exchange'): string {
  return model === 'engage' ? 'Engagements only' : 'Exchanges only'
}

/** One line on the default Combat model: a reading tagged with the other one changes nothing unless that model is chosen on /play or /config. */
export function combatModelLine(config: GameConfig): string {
  const engage = config.combat.model === 'engage'
  const other = combatModelTag(engage ? 'exchange' : 'engage')
  const choice = engage ? 'Exchanges' : 'Engagements'
  return `Combat uses ${engage ? 'engagements' : 'exchanges'} by default. A reading marked "${other}" changes nothing unless you choose ${choice} on the Play start panel (one run) or on the Config page (every new run).`
}

/**
 * The note on a /config field the engine reads under one Combat model only: the tag, and when
 * the config plays the other model, that changing the field changes nothing.
 *
 * @param model - the field's Combat model (`combatModel` in config metadata).
 * @param current - the config's `combat.model`.
 * @rule 7.8, Combat v3
 */
export function combatModelNote(
  model: 'engage' | 'exchange',
  current: 'engage' | 'exchange',
): string {
  const tag = `${combatModelTag(model)}.`
  if (model === current) return tag
  const playing = current === 'engage' ? 'engagements' : 'exchanges'
  return `${tag} Combat is set to ${playing}, so changing it changes nothing.`
}

/**
 * Repo housekeeping (`.env` keys, tokens, the local checkout, or a row tagged `[ops]`): a note
 * for the operator, not a check for visitors.
 */
const OPS_CALL = /\.env\b|\btoken\b|\bcheckout\b|\[ops\]/i

/**
 * Reads every `- [needs-user-call] **Title** body` line, except repo housekeeping (a line that
 * names `.env`, a token, or the local checkout, or is tagged `[ops]`).
 *
 * @param md - the text of `plan/AUDIT.md`.
 */
export function parseUserCalls(md: string): UserCall[] {
  return md.split('\n').flatMap((line) => {
    const m = /^- \[needs-user-call\]\s+(?:\*\*(.+?)\*\*\s*)?(.*)$/.exec(line.trim())
    if (!m || OPS_CALL.test(line)) return []
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
 * The decision digest as markdown: open readings, the readings decided recently, then pending
 * checks. Its only dates come from the rows, so it changes only when `OPEN-QUESTIONS.md` or
 * `plan/AUDIT.md` change.
 *
 * @param questions - every question row (the open ones are picked here).
 * @param calls - the needs-user-call checks.
 * @param config - the config whose values are shown (normally the default config).
 * @param meta - the config metadata (marks the readings that apply under one Combat model).
 */
export function decisionsMarkdown(
  questions: readonly QuestionRow[],
  calls: readonly UserCall[],
  config: GameConfig,
  meta: ConfigMeta,
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
    combatModelLine(config),
    '',
    '## Rule readings',
    '',
  ]
  for (const q of open) {
    const { reading, specV2 } = splitReading(q.reading)
    const settings = flagSettings(q.flag, config)
    const model = settingsCombatModel(settings, meta)
    const tag = model ? ` [${combatModelTag(model)}]` : ''
    lines.push(
      `### ${q.number}. ${q.question.replace(/\.$/, '')} (rule ${q.rule})${tag}`,
      '',
      `- Status: ${q.status}`,
      `- Reading: ${reading}`,
      ...(specV2 ? [`- ${SPEC_V2_LINE}: ${specV2}`] : []),
      `- Setting: ${settingsLine(settings, q.flag)}`,
      '',
    )
  }
  const recent = recentDecisions(questions)
  lines.push(
    '## Decided recently',
    '',
    `Readings the designer decided on the last ${RECENT_DATES} decision dates, newest first. ${RECENT_NOTE}`,
    '',
  )
  for (const q of recent) {
    const { reading, specV2 } = splitReading(q.reading)
    lines.push(
      `- **${q.number}. ${q.question.replace(/\.$/, '')}** (rule ${q.rule}, ${decidedDate(q.status)})${reading ? ` ${reading}` : ''}`,
      ...(specV2 ? [`  - ${SPEC_V2_LINE}: ${specV2}`] : []),
    )
  }
  lines.push('')
  lines.push('## Checks', '')
  for (const c of calls) lines.push(c.title ? `- **${c.title}** ${c.body}` : `- ${c.body}`)
  return `${lines.join('\n')}\n`
}
