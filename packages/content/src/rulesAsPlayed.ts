import type { QuestionRow } from './decisions.ts'
import {
  combatEndText,
  combatText,
  draftPoolText,
  gatherText,
  goalText,
  knockoutText,
  miniatureLimitText,
  revealText,
  spawnText,
} from './ruleText.ts'
import type { GameConfig } from './schemas/config.ts'

/**
 * Rules as played: each Spec v1 rule as written, beside the game the engine runs today, for the
 * designer's Spec v2 fold-in. Pure: the caller passes the spec text, the open-questions rows,
 * and a config. It states readings; it decides none.
 */

/** One numbered rule line of Spec v1 ("6.7 ..."). */
export type SpecRule = Readonly<{ id: string; section: string; text: string }>

/** A section heading of Spec v1 ("6 Prepare phase"). */
export type SpecSection = Readonly<{ number: string; title: string }>

/** How a rule stands in play. */
export type PlayStatus = 'same' | 'changed' | 'superseded' | 'open'

export type RuleAsPlayed = Readonly<{
  rule: SpecRule
  status: PlayStatus
  /** What the engine does, when it differs from the text. */
  asPlayed: string
  /** Where the change comes from: rows and design notes. */
  source: string
}>

const V2 = '`docs/design/core-loop-v2.md`'
const V3 = '`docs/design/combat-v3.md` (row 72)'

/** Reads the numbered rule lines and section headings of Spec v1. */
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

/** The question rows whose Rule column names this rule id (or a range holding it). */
export function rowsFor(id: string, rows: readonly QuestionRow[]): QuestionRow[] {
  return rows.filter((row) =>
    row.rule
      .split(/[,;]/)
      .map((t) => t.replace(/\[[^\]]*\]|step \d+|\(.*?\)/g, '').trim())
      .some((t) => covers(t, id)),
  )
}

const statusWord = (row: QuestionRow) => (row.status.match(/^[a-z-]+/)?.[0] ?? '').toLowerCase()

/**
 * The changes core loop v2 and Combat v3 made, by rule id: the engine's text, built from config
 * so the numbers follow it. Rules not listed fall back to the question rows.
 */
function knownChanges(
  config: GameConfig,
): Record<string, { status: PlayStatus; asPlayed: string; source: string }> {
  const c = config
  const engage = c.combat.model === 'engage'
  const combat = combatText(c, c.combat.model)
  const superseded = (asPlayed: string, source = V2) => ({
    status: 'superseded' as const,
    asPlayed,
    source,
  })
  const changed = (asPlayed: string, source = V2) => ({
    status: 'changed' as const,
    asPlayed,
    source,
  })
  const noWave = 'There is no wave track.'
  return {
    '4.2': superseded(
      `The Base tile starts alone. The countryside tiles, shuffled, go on top of the shuffled core tiles: that is the tile deck. ${revealText(c)}`,
    ),
    '4.4': superseded('No enemy is on the map at setup. Spawning starts at the first Combat.'),
    '4.5': changed(`Base health ${c.base.startingHealth}. ${noWave}`),
    '5.1': changed('Each round has 2 phases: Prepare, then Combat. There is no Explore phase.'),
    '6.9': changed(
      `A step onto a hex next to an enemy costs ${c.combat.moveCostNextToEnemy}${c.combat.moveCostNextToEnemy === 1 ? ', like any step' : ''}.`,
      'designer 2026-10-09 (`combat.moveCostNextToEnemy`)',
    ),
    '6.7': changed(
      `${gatherText(2, c)}. Each node can be used once. Haul gathers 2 in total.`,
      `${V2}; rows 20, 59`,
    ),
    '7.3': superseded(spawnText(c)),
    '7.4': superseded(noWave),
    '7.7': engage ? changed(combat, V3) : changed(combat),
    '7.8': engage ? changed(combat, V3) : changed(combat),
    '7.9': superseded(
      engage
        ? 'Engage can be played anywhere; with no enemy next to you, no enemy die rolls.'
        : 'Exchanges happen at any range.',
      engage ? V3 : V2,
    ),
    ...(engage ? engageEnd(c) : {}),
    '9.2': superseded(spawnText(c)),
    '10.1': changed(revealText(c)),
    '10.2': superseded(spawnText(c)),
    '10.3': superseded(`When the tile deck is empty, no tile is revealed. ${noWave}`),
    '10.4': superseded(noWave),
    '10.5': changed(miniatureLimitText(c), `${V2}; row 32`),
    '11.7': changed(
      `Keep 1 Skill. It is free. ${draftPoolText(c)}`,
      'designer 2026-10-09 (`draft.unpicked`)',
    ),
    '14.1': changed(goalText(), V2),
    '14.2': superseded(knockoutText(c), `${V2}; row 55`),
    '15.1': superseded(noWave),
    '15.2': superseded(noWave),
    '15.3': superseded(noWave),
    '16.6': superseded(`There is no Explore phase. ${revealText(c)}`),
    '16.7': superseded(knockoutText(c), `${V2}; row 55`),
  }
}

/** How Combat ends under engagements: siege replaces the structure attack step (7.10-7.13). */
function engageEnd(
  c: GameConfig,
): Record<string, { status: PlayStatus; asPlayed: string; source: string }> {
  const e = c.combat.engage
  const siege = `Siege, once at the end of Combat: each enemy next to a structure deals ${e.siegeDamage} damage to it (an elite: ${e.eliteSiegeDamage}).`
  return {
    '7.10': { status: 'changed', asPlayed: `${combatEndText(c)} Then the siege step.`, source: V3 },
    '7.11': {
      status: 'open',
      asPlayed: `${siege} An enemy next to a player also sieges; \`rulings.structureDamage\` (row 7) is not read under engagements. Both readings are open.`,
      source: `${V3}; row 7`,
    },
    '7.12': {
      status: 'same',
      asPlayed: '',
      source: '',
    },
    '7.13': { status: 'same', asPlayed: '', source: '' },
    '16.5': {
      status: 'changed',
      asPlayed:
        "There is no enemy attack step. An enemy next to a player rolls its enemy dice in that player's engagement.",
      source: V3,
    },
  }
}

/** Removes table-breaking characters from a cell. */
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()

/** Each Spec v1 rule with its status in play. */
export function rulesAsPlayed(
  rules: readonly SpecRule[],
  rows: readonly QuestionRow[],
  config: GameConfig,
): RuleAsPlayed[] {
  const changes = knownChanges(config)
  return rules.map((rule) => {
    const known = changes[rule.id]
    if (known) return { rule, ...known }
    const matched = rowsFor(rule.id, rows)
    const decided = matched.filter((r) => statusWord(r) === 'decided')
    const open = matched.filter((r) => /^(proposed|pending-spec)$/.test(statusWord(r)))
    const gone = matched.filter((r) => statusWord(r) === 'superseded')
    const list = (rs: QuestionRow[]) => rs.map((r) => `row ${r.number}`).join(', ')
    if (gone.length > 0 && decided.length === 0)
      return {
        rule,
        status: 'superseded',
        asPlayed: gone.map((r) => r.reading).join(' '),
        source: list(gone),
      }
    if (open.length > 0)
      return {
        rule,
        status: 'open',
        asPlayed: open.map((r) => `Row ${r.number} reading: ${r.reading}`).join(' '),
        source: list(open),
      }
    if (decided.length > 0)
      return {
        rule,
        status: 'changed',
        asPlayed: decided.map((r) => r.reading).join(' '),
        source: list(decided),
      }
    return { rule, status: 'same', asPlayed: '', source: '' }
  })
}

const STATUS_LABEL: Record<PlayStatus, string> = {
  same: 'same',
  changed: 'changed',
  superseded: 'superseded',
  open: 'open',
}

/** The generated `docs/RULES-AS-PLAYED.md`. */
export function rulesAsPlayedMarkdown(
  specMd: string,
  rows: readonly QuestionRow[],
  config: GameConfig,
): string {
  const { sections, rules } = parseSpec(specMd)
  const played = rulesAsPlayed(rules, rows, config)
  const count = (s: PlayStatus) => played.filter((p) => p.status === s).length
  const out: string[] = [
    '# Rules as played',
    '',
    '> Generated by `pnpm sim -- rules --out docs/RULES-AS-PLAYED.md` from',
    '> `spec/01-spec-v1-rules.md`, `OPEN-QUESTIONS.md`, and `config.default.json`.',
    '> Do not edit by hand. A test fails when this file is out of date.',
    '',
    'Each Spec v1 rule as written, and what the engine does today. This page states readings;',
    "it decides none. Folding it into `spec/` is the designer's call (an `/oversight` act).",
    '',
    `- ${played.length} rules: ${count('same')} same, ${count('changed')} changed, ${count('superseded')} superseded, ${count('open')} open.`,
    '- **changed**: the engine runs a decided reading or a settled design change.',
    '- **superseded**: core loop v2 or Combat v3 removed or replaced the rule.',
    '- **open**: a proposed or pending-spec row; the engine runs the reading shown.',
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
        `| ${p.rule.id} | ${cell(p.rule.text)} | ${STATUS_LABEL[p.status]} | ${asPlayed} | ${cell(p.source)} |`,
      )
    }
    out.push('')
  }
  return out.join('\n')
}
