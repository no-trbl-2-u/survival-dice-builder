import {
  decisionsMarkdown,
  defaultContent,
  parseQuestions,
  parseUserCalls,
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
    )
    expect(read('docs/DECISIONS.md').replace(/\r\n/g, '\n')).toBe(expected)
  })
})
