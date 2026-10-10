import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SRC = path.dirname(fileURLToPath(import.meta.url))

/** A number followed by a rule word: "keep 1 Skill", "6 draft slots", "1 to 4 players". */
const RULE_NUMBER =
  /\b[1-9]\d*(?: to [1-9]\d*)? (?:draft slots?|Skills?|health|hex(?:es)?|dice|die|tiles?|rounds?|enem(?:y|ies)|materials?|cards?|damage|guard|moves?|players?|copies|offers?|levels?|XP|experience)\b/g

/**
 * Facts of the pieces, not rule numbers from config: a tile has 7 hexes (Table 1), and a
 * single-target Skill hits 1 enemy (Table 3 `target: "one"`).
 */
const ALLOWED: Readonly<Record<string, readonly string[]>> = {
  'map/HexTile.tsx': ['7 hexes'],
  'tiles/TileSheet.tsx': ['7 hexes'],
  'play/effectText.ts': ['1 enemy'],
}

/** Code with its comments removed: TSDoc may cite numbers, player text may not. */
const stripComments = (code: string) =>
  code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

/** Every component and view file under `src` (tests excluded), relative to `src`. */
function sources(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return sources(full)
    const code = /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
    return code ? [path.relative(SRC, full).split(path.sep).join('/')] : []
  })
}

/** The rule numbers a file writes by hand, minus the allowed piece facts. */
function ruleNumbersIn(file: string, code: string): string[] {
  const found = stripComments(code).match(RULE_NUMBER) ?? []
  return found.filter((text) => !(ALLOWED[file] ?? []).includes(text)).map((t) => `${file}: "${t}"`)
}

describe('rule text comes from config (standing rule 7)', () => {
  it('no component or view writes a rule number by hand; ruleText builds it from config', () => {
    const found = sources(SRC).flatMap((file) =>
      ruleNumbersIn(file, fs.readFileSync(path.join(SRC, file), 'utf8')),
    )
    expect(found).toEqual([])
  })

  it('catches a hand-written rule number, but not one in a comment', () => {
    expect(ruleNumbersIn('x.tsx', "const title = 'Skill draft: keep 1 Skill'")).toEqual([
      'x.tsx: "1 Skill"',
    ])
    expect(ruleNumbersIn('x.tsx', '<p>A survival dice-builder for 1 to 4 players</p>')).toEqual([
      'x.tsx: "1 to 4 players"',
    ])
    expect(ruleNumbersIn('x.tsx', '/** keep 1 Skill */ const a = 1')).toEqual([])
  })
})
