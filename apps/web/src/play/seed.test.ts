import { describe, expect, it } from 'vitest'
import { parseSeed } from './seed.ts'

describe('parseSeed', () => {
  it('reads a whole number, with spaces around it', () => {
    expect(parseSeed('42')).toBe(42)
    expect(parseSeed(' 7 ')).toBe(7)
    expect(parseSeed('0')).toBe(0)
  })

  it('gives null for text that is not a whole number, not seed 0', () => {
    for (const text of ['', ' ', 'abc', '12abc', '-3', '1.5', '1e3', '99999999999999999999']) {
      expect(parseSeed(text)).toBeNull()
    }
  })
})
