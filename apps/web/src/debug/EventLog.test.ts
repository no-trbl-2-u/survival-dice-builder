import { describe, expect, it } from 'vitest'
import { showValue } from './EventLog.tsx'

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
