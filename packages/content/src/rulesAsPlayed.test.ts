import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import type { QuestionRow } from './decisions.ts'
import {
  parseSpec,
  plainRuleText,
  rowsFor,
  rulesAsPlayed,
  rulesAsPlayedMarkdown,
} from './rulesAsPlayed.ts'

const config = defaultContent.config

const spec = [
  '# Rules',
  '## 6 Prepare phase',
  '6.1 Draw 5 cards from your deck.',
  '6.10 Deleted in Spec v2: the skirmish. **[v2]**',
  '## 8 Experience and levels',
  '8.5 Level 2 needs 3 experience. **[v2]** **[v2 open: the step stays a configuration option.]**',
  '## 9 Enemies',
  '9.3 An enemy moves toward the nearest structure.',
  '9.7 An enemy can only enter an empty hex.',
].join('\n')

const row = (
  number: number,
  rule: string,
  status: string,
  reading = `reading ${number}`,
): QuestionRow => ({
  number,
  rule,
  question: '',
  reading,
  flag: '',
  status,
})

describe('parseSpec', () => {
  it('reads section headings and numbered rule lines', () => {
    const { sections, rules } = parseSpec(spec)
    expect(sections.map((s) => s.number)).toEqual(['6', '8', '9'])
    expect(rules.map((r) => `${r.section}:${r.id}`)).toEqual([
      '6:6.1',
      '6:6.10',
      '8:8.5',
      '9:9.3',
      '9:9.7',
    ])
  })

  it('plainRuleText drops the review markers', () => {
    expect(plainRuleText('Level 2 needs 3. **[v2]** **[v2 open: later.]**')).toBe(
      'Level 2 needs 3.',
    )
  })
})

describe('rowsFor', () => {
  it('matches single ids and ranges, ignoring step and tag notes', () => {
    const rows = [
      row(1, '9.3–9.4', 'decided'),
      row(2, '7.7-7.13, Combat v3', 'decided'),
      row(3, '7.8 step 5', 'decided'),
    ]
    expect(rowsFor('9.3', rows).map((r) => r.number)).toEqual([1])
    expect(rowsFor('7.10', rows).map((r) => r.number)).toEqual([2])
    expect(rowsFor('7.8', rows).map((r) => r.number)).toEqual([2, 3])
    expect(rowsFor('9.5', rows)).toEqual([])
  })
})

describe('rulesAsPlayed (Spec v2)', () => {
  const { rules } = parseSpec(spec)
  const rows = [
    row(10, '9.3', 'proposed 2026-10-04'),
    row(11, '9.7', 'proposed 2026-10-13'),
    row(12, '6.1', 'decided 2026-10-13'),
  ]
  const by = (played: ReturnType<typeof rulesAsPlayed>, id: string) =>
    played.find((p) => p.rule.id === id)

  it('with the default config: deleted, open notes, rows since sign-off, and same', () => {
    const played = rulesAsPlayed(rules, rows, config, config)
    expect(by(played, '6.10')?.status).toBe('deleted')
    expect(by(played, '8.5')).toMatchObject({ status: 'open', source: 'Spec v2' })
    expect(by(played, '8.5')?.asPlayed).toContain('the step stays a configuration option')
    expect(by(played, '9.7')).toMatchObject({ status: 'open', source: 'row 11' })
    expect(by(played, '9.3')?.status).toBe('same')
    expect(by(played, '6.1')?.status).toBe('same')
  })

  it('a config field that differs from the default marks the rules it sets as changed', () => {
    const steps = { ...config, experience: { ...config.experience, firstStep: 5 } }
    const played = rulesAsPlayed(rules, rows, steps, config)
    expect(by(played, '8.5')).toMatchObject({
      status: 'changed',
      source: '`experience.firstStep`',
    })
    expect(by(played, '8.5')?.asPlayed).toContain('5 (Spec v2: 3)')
  })
})

describe('rulesAsPlayedMarkdown', () => {
  it('writes a counted summary and one table per section', () => {
    const md = rulesAsPlayedMarkdown(spec, [], config)
    expect(md).toContain('- 5 rules: 3 same, 0 changed, 1 deleted, 1 open.')
    expect(md).toContain('## 9 Enemies')
    expect(md).toContain('| 6.1 | Draw 5 cards from your deck. | same | as written |  |')
  })
})
