import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { defaultConfigMeta } from './configMeta.ts'
import { defaultContent } from './content.ts'
import {
  combatModelLine,
  combatModelNote,
  decidedDate,
  decisionsMarkdown,
  flagSettings,
  openQuestions,
  parseQuestions,
  parseUserCalls,
  recentDecisions,
  settingsCombatModel,
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
      defaultConfigMeta,
    )
    expect(md).toContain('## Rule readings')
    expect(md).toContain('## Checks')
    expect(md).toContain('- **Check.** Do it.')
    expect(md).not.toMatch(/undefined|null/)
  })

  it('Spec v2: the rows whose exchange-only options were removed carry no Combat model tag', () => {
    const rows = parseQuestions(questionsMd)
    const model = (n: number) => {
      const row = rows.find((r) => r.number === n)!
      return settingsCombatModel(flagSettings(row.flag, config), defaultConfigMeta)
    }
    for (const n of [1, 7, 65, 66, 69, 73, 74]) expect(model(n), `row ${n}`).toBeNull()
    expect(combatModelLine(config)).toMatch(
      /^Combat uses engagements by default\. .*"Exchanges only"/,
    )
    expect(combatModelLine(config)).toMatch(
      /choose Exchanges on the Play start panel \(one run\) or on the Config page \(every new run\)\.$/,
    )
    const md = decisionsMarkdown(rows, [], config, defaultConfigMeta)
    expect(md).not.toMatch(/\[Exchanges only\]$/m)
  })

  it('records the Spec v2 rulings as decided rows (phase 41)', () => {
    const rows = parseQuestions(questionsMd)
    const row = (n: number) => rows.find((r) => r.number === n)!
    for (const n of [7, 30, 49, 50, 55, 59, 60, 65, 69, 73, 74])
      expect(row(n).status, `row ${n}`).toMatch(/^decided 2026-10-11 \(Spec v2, ruling/)
    for (const [n, flag] of [
      [76, 'combat.moveCostNextToEnemy'],
      [77, 'draft.unpicked'],
    ] as const) {
      expect(row(n).status).toBe('decided 2026-10-09')
      const [setting] = flagSettings(row(n).flag, config)
      expect(setting).toMatchObject({ path: flag, differs: false })
    }
  })

  it('reads the date of a decided status only', () => {
    expect(decidedDate('decided 2026-10-09 (default)')).toBe('2026-10-09')
    expect(decidedDate('decided 2026-10-02')).toBe('2026-10-02')
    expect(decidedDate('decided (brief)')).toBeNull()
    expect(decidedDate('superseded 2026-10-04 (core loop v2)')).toBeNull()
    expect(decidedDate('proposed 2026-10-11')).toBeNull()
  })

  it('lists recent decisions newest first, from the newest decision dates', () => {
    const row = (number: number, status: string) => ({
      number,
      rule: '1',
      question: `Q${number}.`,
      reading: `R${number}`,
      flag: '(engine)',
      status,
    })
    const rows = [
      row(1, 'decided 2026-09-01'),
      row(2, 'decided 2026-10-04'),
      row(3, 'superseded 2026-10-09'),
      row(4, 'decided 2026-10-09'),
      row(5, 'decided (brief)'),
      row(6, 'proposed 2026-10-11'),
      row(7, 'decided 2026-10-09 (default)'),
    ]
    expect(recentDecisions(rows).map((r) => r.number)).toEqual([4, 7, 2])
    expect(recentDecisions(rows, 1).map((r) => r.number)).toEqual([4, 7])
    expect(recentDecisions(rows, 3).map((r) => r.number)).toEqual([4, 7, 2, 1])
    expect(recentDecisions([])).toEqual([])
    const md = decisionsMarkdown(rows, [], config, defaultConfigMeta)
    expect(md).toContain('## Decided recently')
    expect(md).toContain('- **4. Q4** (rule 1, 2026-10-09) R4')
    expect(md.indexOf('## Decided recently')).toBeLessThan(md.indexOf('## Checks'))
  })

  it('notes a field the engine reads under one Combat model', () => {
    expect(combatModelNote('exchange', 'exchange')).toBe('Exchanges only.')
    expect(combatModelNote('exchange', 'engage')).toBe(
      'Exchanges only. Combat is set to engagements, so changing it changes nothing.',
    )
    expect(combatModelNote('engage', 'exchange')).toBe(
      'Engagements only. Combat is set to exchanges, so changing it changes nothing.',
    )
  })
})
