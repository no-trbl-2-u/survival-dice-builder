import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import { fillKit, kitBlock, surveyQuestions } from './playtestKit.ts'

const content = defaultContent
const config = content.config

describe('kitBlock', () => {
  it('teaches the v2 loop from config: no wave track, no 6-card deck', () => {
    const teach = kitBlock('teach', content)
    expect(teach).toContain('10-card deck')
    expect(teach).toContain('knocked out')
    expect(teach).toContain('Step off the edge')
    expect(teach).not.toMatch(/wave track|6-card/)
  })

  it('follows a changed config', () => {
    const knockout = { ...config.knockout, returnHealthDivisor: 3 }
    expect(kitBlock('teach', { ...content, config: { ...config, knockout } })).toContain(
      '1/3 of their maximum health',
    )
    const exchange = { ...config, combat: { ...config.combat, model: 'exchange' as const } }
    expect(surveyQuestions(exchange).some((q) => q.label === 'Exchanges fair')).toBe(true)
    expect(surveyQuestions(config).some((q) => q.label === 'Engagements fair')).toBe(true)
  })

  it('numbers the survey, the answer block, and the report summary from one list', () => {
    const rated = surveyQuestions(config).filter((q) => q.rated)
    expect(kitBlock('questions', content).split('\n')).toHaveLength(
      2 + surveyQuestions(config).length,
    )
    expect(kitBlock('survey-summary', content).split('\n')).toHaveLength(2 + rated.length)
    expect(kitBlock('answers', content)).toContain('5 engagements fair:')
  })
})

describe('fillKit', () => {
  it('replaces the block between its markers and keeps the prose', () => {
    const text =
      '# Survey\n\nIntro.\n\n<!-- kit:questions -->\nold\n<!-- /kit:questions -->\n\n<!-- kit:answers -->\n<!-- /kit:answers -->\n'
    const out = fillKit('SURVEY.md', text, content)
    expect(out).toContain('Intro.')
    expect(out).not.toContain('old')
    expect(out).toContain('| 1 | The trip out to gather')
  })

  it('throws when a marker pair is missing', () => {
    expect(() => fillKit('PROTOCOL.md', '# Protocol\n', content)).toThrow(/kit:teach/)
  })
})
