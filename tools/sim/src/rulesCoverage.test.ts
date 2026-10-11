import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { checkCoverage, parseCitations, parseCoverage, titleFragments } from './rulesCoverage.js'

const root = fileURLToPath(new URL('../../../', import.meta.url))

/** Every *.test.ts(x) under packages/, apps/, tools/ (no node_modules), keyed by repo path. */
function testFiles(): Map<string, string> {
  const out = new Map<string, string>()
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.'))
        continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.test\.tsx?$/.test(entry.name)) {
        out.set(path.relative(root, full).split(path.sep).join('/'), fs.readFileSync(full, 'utf-8'))
      }
    }
  }
  for (const top of ['packages', 'apps', 'tools']) walk(path.join(root, top))
  return out
}

describe('parseCitations', () => {
  it('gives each path the titles that follow it', () => {
    expect(parseCitations('`a/x.test.ts` "one", "two"; `y.test.tsx` "three"')).toEqual([
      { file: 'a/x.test.ts', titles: ['one', 'two'] },
      { file: 'y.test.tsx', titles: ['three'] },
    ])
  })

  it('keeps escaped quotes and titles before any path', () => {
    expect(parseCitations('"a \\"b\\" c"; `z.test.ts`')).toEqual([
      { file: null, titles: ['a "b" c'] },
      { file: 'z.test.ts', titles: [] },
    ])
  })
})

describe('titleFragments', () => {
  it('splits a cut title at each "..." and drops short pieces', () => {
    expect(titleFragments('6.7 a Move card...')).toEqual(['6.7 a Move card'])
    expect(titleFragments('... with every phase 22 option off matches')).toEqual([
      'with every phase 22 option off matches',
    ])
    expect(titleFragments('8.5 ...')).toEqual([])
  })
})

describe('checkCoverage', () => {
  const files = new Map([['packages/engine/test/a.test.ts', "it('6.1 draws 5 cards', () => {})"]])

  it('passes a citation whose title is in the cited file', () => {
    const rows = parseCoverage('| 6.1 | `f` | `test/a.test.ts` "6.1 draws 5 cards" |')
    expect(checkCoverage(rows, files)).toEqual([])
  })

  it('flags a missing file, a missing title, and a row with no test', () => {
    const rows = parseCoverage(
      [
        '| 6.1 | `f` | `test/gone.test.ts` "x" |',
        '| 6.2 | `f` | `test/a.test.ts` "6.1 draws 3 cards" |',
        '| 6.3 | `f` | none |',
        '| 6.4 | — | superseded by row 55 |',
      ].join('\n'),
    )
    expect(checkCoverage(rows, files)).toEqual([
      { rule: '6.1', problem: 'no test file test/gone.test.ts' },
      { rule: '6.2', problem: 'no test titled "6.1 draws 3 cards" in test/a.test.ts' },
      { rule: '6.3', problem: 'cites no test and is not marked superseded' },
    ])
  })
})

describe('RULES-COVERAGE.md', () => {
  it('cites only test files and test titles that exist', () => {
    const rows = parseCoverage(fs.readFileSync(path.join(root, 'RULES-COVERAGE.md'), 'utf-8'))
    expect(rows.length).toBeGreaterThan(40)
    expect(checkCoverage(rows, testFiles())).toEqual([])
  })
})
