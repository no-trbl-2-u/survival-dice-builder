import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import type { QuestionRow } from './decisions.ts'
import { parseSpec, rowsFor, rulesAsPlayed, rulesAsPlayedMarkdown } from './rulesAsPlayed.ts'

const config = defaultContent.config

const spec = [
  '# Rules',
  '## 5 Round sequence',
  '5.1 Each round has 3 phases in this sequence: Prepare, Combat, Explore.',
  '5.4 Your deck can grow.',
  '## 9 Enemies',
  '9.3 An enemy moves toward the nearest target.',
  '9.6 Something proposed.',
  '## 14 End of the run',
  '14.2 The run stops if the health of a player is 0.',
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
    expect(sections.map((s) => s.number)).toEqual(['5', '9', '14'])
    expect(rules.map((r) => `${r.section}:${r.id}`)).toEqual([
      '5:5.1',
      '5:5.4',
      '9:9.3',
      '9:9.6',
      '14:14.2',
    ])
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

describe('rulesAsPlayed', () => {
  const { rules } = parseSpec(spec)
  const rows = [row(10, '9.3', 'decided 2026-10-04'), row(11, '9.6', 'proposed 2026-10-05')]
  const played = rulesAsPlayed(rules, rows, config)
  const by = (id: string) => played.find((p) => p.rule.id === id)

  it('marks the core loop v2 changes from config, not from rows', () => {
    expect(by('5.1')?.status).toBe('changed')
    expect(by('5.1')?.asPlayed).toContain('There is no Explore phase')
    expect(by('14.2')?.status).toBe('superseded')
    expect(by('14.2')?.asPlayed).toContain('knocked out')
  })

  it('uses a decided row as changed, a proposed row as open, and no row as same', () => {
    expect(by('9.3')).toMatchObject({ status: 'changed', asPlayed: 'reading 10', source: 'row 10' })
    expect(by('9.6')).toMatchObject({ status: 'open', source: 'row 11' })
    expect(by('5.4')).toMatchObject({ status: 'same', asPlayed: '' })
  })

  it('builds numbers from the config it is given', () => {
    const knockout = { ...config.knockout, returnHealthDivisor: 3 }
    const other = rulesAsPlayed(rules, rows, { ...config, knockout })
    expect(other.find((p) => p.rule.id === '14.2')?.asPlayed).toContain(
      '1/3 of their maximum health',
    )
  })
})

describe('rulesAsPlayedMarkdown', () => {
  it('writes a counted summary and one table per section', () => {
    const md = rulesAsPlayedMarkdown(spec, [], config)
    expect(md).toContain('- 5 rules: 3 same, 1 changed, 1 superseded, 0 open.')
    expect(md).toContain('## 9 Enemies')
    expect(md).toContain('| 5.4 | Your deck can grow. | same | as written |  |')
  })
})
