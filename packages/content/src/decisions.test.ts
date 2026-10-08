import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import {
  decisionsMarkdown,
  flagSettings,
  openQuestions,
  parseQuestions,
  parseUserCalls,
  statusLabel,
} from './decisions.ts'

const root = new URL('../../../', import.meta.url)
const questionsMd = fs.readFileSync(new URL('OPEN-QUESTIONS.md', root), 'utf-8')
const config = defaultContent.config

describe('decisions', () => {
  it('reads every row of the open-questions table', () => {
    const rows = parseQuestions(questionsMd)
    expect(rows.map((r) => r.number)).toEqual(rows.map((_, i) => i + 1))
    expect(rows.length).toBeGreaterThanOrEqual(54)
    expect(rows[0]).toMatchObject({
      number: 1,
      rule: '10.4, Table 1',
      status: 'decided 2026-10-02',
    })
  })

  it('keeps only rows not yet settled, pending-spec first', () => {
    const open = openQuestions(parseQuestions(questionsMd))
    expect(open[0]?.status).toContain('pending-spec')
    expect(open.some((r) => r.status === 'decided 2026-10-02')).toBe(false)
    // A decided row with a proposed detail stays open.
    expect(open.some((r) => r.number === 9)).toBe(true)
  })

  it('resolves flag keys by exact path or unique suffix, and marks a differing value', () => {
    const [exact] = flagSettings('`rulings.enemiesPerHex: 1`', config)
    expect(exact).toMatchObject({
      path: 'rulings.enemiesPerHex',
      named: '1',
      current: '1',
      differs: false,
    })
    const [suffix] = flagSettings('`blockedPathRule: "next-target"`', config)
    expect(suffix?.path).toBe('rulings.blockedPathRule')
    const [differs] = flagSettings('`combat.maxRolls: 99`', config)
    expect(differs?.differs).toBe(true)
    expect(flagSettings('(engine, `moveCost`)', config)).toEqual([])
    const [unknown] = flagSettings('`milestones.nope: 10`', config)
    expect(unknown).toMatchObject({ path: null, current: null, differs: false })
    // An option that is off (null) reads as "empty", and matches a row that names null.
    const [off] = flagSettings('`clock.forcedRevealEvery: null`', config)
    expect(off).toMatchObject({ named: 'empty', current: 'empty', differs: false })
    // "(future ...)" notes name no setting.
    expect(flagSettings('`structureDamage: "v1"` (future `"grunt-die"`)', config)).toHaveLength(1)
  })

  it('labels each status in plain words, with no dates or phase numbers', () => {
    expect(statusLabel('pending-spec 2026-10-04 (Skill design)')).toBe(
      'Waiting for the designer to write the rule (Skill design).',
    )
    expect(statusLabel('pending-spec 2026-10-04 (experiment: phase 21)')).toBe(
      'Waiting for the designer to write the rule.',
    )
    expect(statusLabel('pending-spec (2026-10-04: keep the v1 reading)')).toBe(
      'Waiting for the designer to write the rule (keep the v1 reading).',
    )
    expect(statusLabel('proposed 2026-10-04 (engine: phase 21, shipped)')).toBe(
      "Proposed, waiting for the designer's answer. The game plays this reading now.",
    )
    expect(statusLabel('proposed 2026-10-05 (structural; option measured in phase 22)')).toBe(
      "Proposed, waiting for the designer's answer. It is an option, off by default.",
    )
    for (const q of openQuestions(parseQuestions(questionsMd)))
      expect(statusLabel(q.status)).not.toMatch(/\d{4}-|phase|structural|engine|pending-spec/)
  })

  it('reads needs-user-call checks', () => {
    const calls = parseUserCalls(
      '- [x] done\n- [needs-user-call] **Run the playtests (phase 16).** The kit is ready.\n',
    )
    expect(calls).toEqual([{ title: 'Run the playtests (phase 16).', body: 'The kit is ready.' }])
  })

  it('writes both sections', () => {
    const md = decisionsMarkdown(
      parseQuestions(questionsMd),
      [{ title: 'Check.', body: 'Do it.' }],
      config,
    )
    expect(md).toContain('## Rule readings')
    expect(md).toContain('## Checks')
    expect(md).toContain('- **Check.** Do it.')
    expect(md).not.toMatch(/undefined|null/)
  })
})
