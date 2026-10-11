import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { APP_COMMIT, APP_VERSION } from './appInfo.ts'

const read = (p: string) =>
  JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf-8')) as { version: string }

describe('release version (phase 32)', () => {
  it('comes from the root package.json, and every package carries the same version', () => {
    const root = read('../../../package.json').version
    expect(APP_VERSION).toBe(root)
    for (const p of [
      '../package.json',
      '../../../packages/bot/package.json',
      '../../../packages/content/package.json',
      '../../../packages/engine/package.json',
      '../../../tools/sim/package.json',
    ]) {
      expect(read(p).version, p).toBe(root)
    }
  })

  it('has a commit (or "unknown" outside git)', () => {
    expect(APP_COMMIT).toMatch(/^([0-9a-f]{7}|unknown)$/)
  })
})
