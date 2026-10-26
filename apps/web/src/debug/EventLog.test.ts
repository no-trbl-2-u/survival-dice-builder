import { describe, expect, it } from 'vitest'
import { ruleTag, showValue } from './EventLog.tsx'

describe('showValue', () => {
  it('shows hexes as (q,r), lists with "/", and other objects as JSON', () => {
    expect(showValue({ q: 2, r: -1 })).toBe('(2,-1)')
    expect(
      showValue([
        { q: 0, r: 0 },
        { q: 1, r: 0 },
      ]),
    ).toBe('(0,0)/(1,0)')
    expect(showValue({ a: 1 })).toBe('{"a":1}')
    expect(showValue(3)).toBe('3')
  })
})

describe('ruleTag', () => {
  it('keeps a rules section number and puts any other tag in words', () => {
    expect(ruleTag('7.8')).toBe('7.8')
    expect(ruleTag('7.8, Table 9')).toBe('7.8, Table 9')
    expect(ruleTag('Combat v3')).toBe('not in the written rules')
    expect(ruleTag('Draft pool (designer 2026-10-09)')).toBe('not in the written rules')
  })
})
