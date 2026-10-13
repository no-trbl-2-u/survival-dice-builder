import { metaFor } from './configMeta.ts'
import { changedFields } from './configVersions.ts'
import type { QuestionRow } from './decisions.ts'
import type { GameConfig } from './schemas/config.ts'

/**
 * Rules as played: each Spec v2 rule as written, beside the game the engine runs with a config.
 * The default config is Spec v2 (18.1), so with it every rule is "same" except the rules the
 * designer left open and the rules Spec v2 deleted. A config that differs from the defaults
 * marks the rules its changed fields set. Pure: the caller passes the spec text, the
 * open-questions rows, and the configs. It states readings; it decides none.
 */

/** One numbered rule line of the spec ("6.7 ..."). */
export type SpecRule = Readonly<{ id: string; section: string; text: string }>

/** A section heading of the spec ("6 Prepare phase"). */
export type SpecSection = Readonly<{ number: string; title: string }>

/** How a rule stands in play. */
export type PlayStatus = 'same' | 'changed' | 'deleted' | 'open'

export type RuleAsPlayed = Readonly<{
  rule: SpecRule
  status: PlayStatus
  /** What the engine does, when it differs from the text, or what is open. */
  asPlayed: string
  /** Where the difference comes from: config fields, rows, the spec's open note. */
  source: string
}>

/** Spec v2 was signed off on this date; question rows dated before it are folded in. */
export const SPEC_V2_SIGNED = '2026-10-12'

/** Reads the numbered rule lines and section headings of the spec. */
export function parseSpec(md: string): { sections: SpecSection[]; rules: SpecRule[] } {
  const sections: SpecSection[] = []
  const rules: SpecRule[] = []
  let section = ''
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^## (\d+) (.+)$/)
    if (h) {
      section = h[1] ?? ''
      sections.push({ number: section, title: (h[2] ?? '').trim() })
      continue
    }
    const r = line.match(/^(\d+\.\d+) (.+)$/)
    if (r && section) rules.push({ id: r[1] ?? '', section, text: (r[2] ?? '').trim() })
  }
  return { sections, rules }
}

/** "7.7-7.13" or "9.3–9.4" covers 7.10; a single id covers itself. */
function covers(token: string, id: string): boolean {
  const range = token.match(/^(\d+)\.(\d+)\s*[-–]\s*(?:(\d+)\.)?(\d+)$/)
  const [sec, num] = id.split('.').map(Number)
  if (range) {
    const [, s1, a, s2, b] = range
    if (s2 && s2 !== s1) return false
    return Number(s1) === sec && Number(a) <= (num ?? 0) && (num ?? 0) <= Number(b)
  }
  const single = token.match(/^(\d+)\.(\d+)$/)
  return !!single && Number(single[1]) === sec && Number(single[2]) === num
}

/** True when a rule reference ("7.8 step 5, 9.3-9.4 (row 2)") names this rule id. */
function refCovers(ref: string, id: string): boolean {
  return ref
    .split(/[,;]/)
    .map((t) => t.replace(/\[[^\]]*\]|step \d+|\(.*?\)/g, '').trim())
    .some((t) => covers(t, id))
}

/** The question rows whose Rule column names this rule id (or a range holding it). */
export function rowsFor(id: string, rows: readonly QuestionRow[]): QuestionRow[] {
  return rows.filter((row) => refCovers(row.rule, id))
}

/** A row the engine plays a proposed reading for, filed after Spec v2 was signed off. */
function openSinceSignOff(row: QuestionRow): boolean {
  const m = row.status.match(/^(proposed|pending-spec)\b.*?(\d{4}-\d{2}-\d{2})/)
  return !!m && (m[2] ?? '') >= SPEC_V2_SIGNED
}

/** The spec's own open note on a rule ("[v2 open: ...]"), without the brackets. */
function openNote(text: string): string | null {
  return text.match(/\[v2 open: ([^\]]*)\]/)?.[1]?.trim() ?? null
}

/** The rule text without the review markers (**[v2]**, open notes, notes). */
export function plainRuleText(text: string): string {
  return text
    .replace(/\*\*\[(v2|v2 open|Note)[^\]]*\]\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const show = (v: unknown) =>
  Array.isArray(v) || typeof v === 'object' ? JSON.stringify(v) : String(v)

function valueAt(tree: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (t, k) => (t && typeof t === 'object' ? (t as Record<string, unknown>)[k] : undefined),
      tree,
    )
}

/**
 * Each spec rule with its status in play.
 *
 * @param config - the config the engine runs.
 * @param defaults - the Spec v2 defaults (`config.default.json`); fields where `config` differs
 *   mark the rules their `config.meta.json` rule reference names as changed.
 */
export function rulesAsPlayed(
  rules: readonly SpecRule[],
  rows: readonly QuestionRow[],
  config: GameConfig,
  defaults: GameConfig = config,
): RuleAsPlayed[] {
  const changed = changedFields(config, defaults).flatMap((path) => {
    const entry = metaFor(path)?.entry
    return entry?.rule ? [{ path, label: entry.label, rule: entry.rule }] : []
  })
  return rules.map((rule) => {
    if (/^Deleted in Spec v2/.test(rule.text))
      return { rule, status: 'deleted', asPlayed: '', source: 'Spec v2' }
    const fields = changed.filter((f) => refCovers(f.rule, rule.id))
    if (fields.length > 0)
      return {
        rule,
        status: 'changed',
        asPlayed: fields
          .map(
            (f) =>
              `${f.label}: ${show(valueAt(config, f.path))} (Spec v2: ${show(valueAt(defaults, f.path))}).`,
          )
          .join(' '),
        source: fields.map((f) => `\`${f.path}\``).join(', '),
      }
    const open = rowsFor(rule.id, rows).filter(openSinceSignOff)
    if (open.length > 0)
      return {
        rule,
        status: 'open',
        asPlayed: open.map((r) => `Row ${r.number} reading: ${r.reading}`).join(' '),
        source: open.map((r) => `row ${r.number}`).join(', '),
      }
    const note = openNote(rule.text)
    if (note)
      return {
        rule,
        status: 'open',
        asPlayed: `The engine plays the rule as written. Open: ${note}`,
        source: 'Spec v2',
      }
    return { rule, status: 'same', asPlayed: '', source: '' }
  })
}

/** Removes table-breaking characters from a cell. */
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()

/** The generated `docs/RULES-AS-PLAYED.md`. */
export function rulesAsPlayedMarkdown(
  specMd: string,
  rows: readonly QuestionRow[],
  config: GameConfig,
  defaults: GameConfig = config,
): string {
  const { sections, rules } = parseSpec(specMd)
  const played = rulesAsPlayed(rules, rows, config, defaults)
  const count = (s: PlayStatus) => played.filter((p) => p.status === s).length
  const out: string[] = [
    '# Rules as played',
    '',
    '> Generated by `pnpm sim -- rules --out docs/RULES-AS-PLAYED.md` from',
    '> `spec/01-spec-v2-rules.md`, `OPEN-QUESTIONS.md`, and `config.default.json`.',
    '> Do not edit by hand. A test fails when this file is out of date.',
    '',
    'Each Spec v2 rule as written, and what the engine does with the default config. This page',
    "states readings; it decides none. Changing the spec is the designer's call (an `/oversight` act).",
    '',
    `- ${played.length} rules: ${count('same')} same, ${count('changed')} changed, ${count('deleted')} deleted, ${count('open')} open.`,
    '- **changed**: a config field differs from the Spec v2 default.',
    '- **deleted**: Spec v2 deleted the rule; its id stays.',
    `- **open**: the spec marks the rule open, or a row filed since ${SPEC_V2_SIGNED} proposes a reading; the engine plays the reading shown.`,
    '',
  ]
  for (const section of sections) {
    const inSection = played.filter((p) => p.rule.section === section.number)
    if (inSection.length === 0) continue
    out.push(`## ${section.number} ${section.title}`, '')
    out.push('| Rule | As written | Status | As played | Source |', '|---|---|---|---|---|')
    for (const p of inSection) {
      const asPlayed = p.status === 'same' ? 'as written' : cell(p.asPlayed)
      out.push(
        `| ${p.rule.id} | ${cell(plainRuleText(p.rule.text))} | ${p.status} | ${asPlayed} | ${cell(p.source)} |`,
      )
    }
    out.push('')
  }
  return out.join('\n')
}
