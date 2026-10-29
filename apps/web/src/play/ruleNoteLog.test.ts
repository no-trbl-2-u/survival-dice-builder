import { describe, expect, it } from 'vitest'
import { logRuleNote } from './PlayLog.tsx'

describe('logRuleNote', () => {
  it('cites a section of the written rules by number', () => {
    expect(logRuleNote('7.8')).toBe('rule 7.8')
    expect(logRuleNote('7.8, Table 9')).toBe('rule 7.8, Table 9')
  })

  it('says a tag with no section is not in the written rules', () => {
    expect(logRuleNote('Draft pool (designer 2026-10-09)')).toBe('not in the written rules')
    expect(logRuleNote('Combat v3')).toBe('not in the written rules')
    expect(logRuleNote('Combat v3 (siege)')).toBe('not in the written rules')
  })
})
