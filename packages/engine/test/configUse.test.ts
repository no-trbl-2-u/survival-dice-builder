import { configMetaPaths, defaultConfigMeta, defaultContent } from '@survival/content'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = path.join(import.meta.dirname, '..', 'src')

/** Every engine source file, read as text. */
function engineSource(dir: string): string {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .map((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return engineSource(full)
      return entry.name.endsWith('.ts') ? fs.readFileSync(full, 'utf8') : ''
    })
    .join('\n')
}

describe('/config "not used by the engine yet" marks (rule 18.1)', () => {
  it('a field is marked unused exactly when the engine never names it', () => {
    const source = engineSource(SRC)
    const fields = configMetaPaths(defaultContent.config).filter((p) => !p.group)
    const wrong = fields.flatMap(({ path: field }) => {
      const key = field.split('.').at(-1) ?? field
      const read = new RegExp(`\\b${key}\\b`).test(source)
      const marked = defaultConfigMeta[field]?.unused === true
      if (read && marked) return [`${field}: read by the engine but marked unused`]
      if (!read && !marked) return [`${field}: never read by the engine but not marked unused`]
      return []
    })
    expect(wrong).toEqual([])
  })
})
