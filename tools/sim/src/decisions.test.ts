import {
  decisionsMarkdown,
  defaultConfigMeta,
  defaultContent,
  fillKit,
  KIT_BLOCKS,
  type KitFile,
  parseQuestions,
  parseUserCalls,
  rulesAsPlayedMarkdown,
} from '@survival/content'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

const root = new URL('../../../', import.meta.url)
const read = (p: string) => fs.readFileSync(new URL(p, root), 'utf-8')

describe('docs/DECISIONS.md', () => {
  it('matches its sources (regenerate with: pnpm sim -- decisions --out docs/DECISIONS.md)', () => {
    const expected = decisionsMarkdown(
      parseQuestions(read('OPEN-QUESTIONS.md')),
      parseUserCalls(read('plan/AUDIT.md')),
      defaultContent.config,
      defaultConfigMeta,
    )
    expect(read('docs/DECISIONS.md').replace(/\r\n/g, '\n')).toBe(expected)
  })
})

describe('docs/playtests kit', () => {
  for (const file of Object.keys(KIT_BLOCKS) as KitFile[]) {
    it(`${file} rule blocks match the config (regenerate with: pnpm sim -- kit)`, () => {
      const text = read(`docs/playtests/${file}`).replace(/\r\n/g, '\n')
      expect(text).toBe(fillKit(file, text, defaultContent))
    })
  }
})

describe('docs/RULES-AS-PLAYED.md', () => {
  it('matches its sources (regenerate with: pnpm sim -- rules --out docs/RULES-AS-PLAYED.md)', () => {
    const expected = rulesAsPlayedMarkdown(
      read('spec/01-spec-v1-rules.md'),
      parseQuestions(read('OPEN-QUESTIONS.md')),
      defaultContent.config,
    )
    expect(read('docs/RULES-AS-PLAYED.md').replace(/\r\n/g, '\n')).toBe(expected)
  })
})
