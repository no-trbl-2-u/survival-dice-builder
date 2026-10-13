import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import raw from '../data/proposals.json' with { type: 'json' }
import { defaultContent } from './content.ts'
import { openQuestions, parseQuestions } from './decisions.ts'
import {
  adviceText,
  applyProposal,
  defaultProposals,
  measuredText,
  proposalForRow,
  proposalProblems,
  proposalsIn,
  withProposal,
} from './proposals.ts'
import { GameConfigSchema } from './schemas/config.ts'
import { ProposalsFileSchema, type Proposal } from './schemas/proposals.ts'

const root = new URL('../../../', import.meta.url)
const questionsMd = fs.readFileSync(new URL('OPEN-QUESTIONS.md', root), 'utf-8')
const config = defaultContent.config
const byId = (id: string) => {
  const p = defaultProposals.find((x) => x.id === id)
  if (!p) throw new Error(id)
  return p
}

/** Build-process words a player cannot place (the /decisions and /config scans). */
const BUILD_WORD = /\b(?:rows? \d+|phases? \d+|Combat v\d|core loop v\d|Spec v\d)\b/i

describe('proposals (rule 18.1)', () => {
  it('rule 18.1: the shipped file parses and has no problems', () => {
    expect(ProposalsFileSchema.safeParse(raw).success).toBe(true)
    expect(proposalProblems(defaultProposals)).toEqual([])
  })

  it('rule 18.1: every structural row still open has a proposal', () => {
    const structural = openQuestions(parseQuestions(questionsMd)).filter((q) =>
      q.status.includes('structural'),
    )
    expect(structural.length).toBeGreaterThan(0)
    for (const q of structural) expect(proposalForRow(q.number), `row ${q.number}`).toBeDefined()
  })

  it('rule 18.1: catches each problem kind on a broken copy', () => {
    const base = byId('forced-reveal')
    const broken: Proposal[] = [
      { ...base, id: 'unknown', row: 1, options: [{ path: 'clock.nope', value: 3 }] },
      { ...base, id: 'group', row: 2, options: [{ path: 'clock', value: 3 }] },
      { ...base, id: 'same', row: 3, options: [{ path: 'clock.forcedRevealEvery', value: null }] },
      { ...base, id: 'bad', row: 4, options: [{ path: 'clock.forcedRevealEvery', value: -1 }] },
      { ...base, id: 'bad', row: 4 },
      { ...base, id: 'exch', row: 5, combatModel: 'exchange' },
      { ...base, id: 'none', row: 6, measured: undefined },
    ]
    const problems = proposalProblems(broken)
    for (const text of [
      'unknown: clock.nope is not a config key',
      'group: clock is not a config key',
      'same: clock.forcedRevealEvery equals the default',
      'bad: the config schema rejects the result',
      'bad: repeated id',
      'bad: repeated row 4',
      'exch: measured under a Combat model it does not act under',
      'none: no measured effect under the default Combat model',
    ])
      expect(problems).toContain(text)
  })

  it('rule 18.1: no proposal sets a default value (drift guard)', () => {
    for (const p of defaultProposals) expect(proposalsIn(config, [p]), p.id).toEqual([])
  })

  it('rule 18.1: applyProposal sets the options, passes the schema, and keeps the input', () => {
    const before = JSON.stringify(config)
    const next = applyProposal(config, byId('forced-reveal'))
    expect(JSON.stringify(config)).toBe(before)
    expect(next.clock.forcedRevealEvery).toBe(3)
    expect(GameConfigSchema.safeParse(next).success).toBe(true)
    for (const p of defaultProposals) expect(() => applyProposal(config, p)).not.toThrow()
  })

  it('rule 18.1: proposalsIn finds applied proposals and not half-applied ones', () => {
    const two = applyProposal(applyProposal(config, byId('forced-reveal')), byId('spawn-range'))
    expect(proposalsIn(two).map((p) => p.id)).toEqual(['forced-reveal', 'spawn-range'])
    const both: Proposal = {
      ...byId('forced-reveal'),
      options: [...byId('forced-reveal').options, ...byId('spawn-range').options],
    }
    const half = withProposal(config, byId('forced-reveal'))
    expect(proposalsIn(half, [both])).toEqual([])
    expect(proposalsIn(withProposal(half, both), [both])).toEqual([both])
  })

  it('rule 18.1: the measured and advice lines are plain words', () => {
    const reveal = measuredText(byId('forced-reveal'))
    expect(reveal).toContain('Measured under engagements, 200 bot runs each, solo.')
    expect(reveal).toContain('Defender bot: median end round 10 with the standard rules, 10')
    expect(reveal).toContain('runs that reach the sim cap 26 and 1')
    expect(measuredText(byId('seat-scaling'))).toContain('4 seats')
    expect(adviceText(byId('forced-reveal'))).toBe(
      'Recommendation from the bot batches: turn it on.',
    )
    for (const p of defaultProposals)
      for (const text of [p.label, p.about, measuredText(p), adviceText(p)])
        expect(text, p.id).not.toMatch(BUILD_WORD)
  })
})
