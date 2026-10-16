import { describe, expect, it } from 'vitest'
import { defaultConfigMeta } from './configMeta.ts'
import { configRuleNote } from './ruleText.ts'
import type { ConfigMeta } from './schemas/configMeta.ts'

const RULE_WORD =
  '(?:draft slots?|Skills?|health|hex(?:es)?|dice|die|tiles?|rounds?|enem(?:y|ies)|materials?|cards?|damage|guard|moves?|players?|copies|offers?|levels?|XP|experience|seats?)'
const NUMBER =
  '(?:[1-9]\\d*|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|half|twice)'

/** A number (digits or a word) before a rule word: "2 to 4 players", "one round". */
const RULE_NUMBER = new RegExp(`\\b${NUMBER}(?:(?: to |-)${NUMBER})? ${RULE_WORD}\\b`, 'gi')

/** Build-process words a player cannot place: a spreadsheet row, a plan phase, a design draft. */
const BUILD_WORD = /\b(?:rows? \d+|phases? \d+|Combat v\d|core loop v\d|Spec v\d)\b/gi

/**
 * Option phrases that define the option itself (the engine's formula for it), not a config
 * value: a rule number there is the setting's meaning.
 */
const ALLOWED: Readonly<Record<string, readonly string[]>> = {
  'experience.levelPerEliteSpawn': ['1 level'],
  'spawn.perSeat': ['1 enemy', '2 seats', '1-2 seats'],
  'rulings.structureDamage': ['1 die'],
}

/** Every piece of player text in one entry: label, help, option phrases, and placeholder. */
const textsOf = (entry: ConfigMeta[string]) => [
  entry.label,
  entry.help ?? '',
  entry.empty ?? '',
  ...Object.values(entry.options ?? {}),
]

/** The rule numbers a metadata table writes by hand, minus the allowed option definitions. */
function ruleNumbersIn(meta: ConfigMeta): string[] {
  return Object.entries(meta).flatMap(([path, entry]) =>
    textsOf(entry)
      .flatMap((text) => text.match(RULE_NUMBER) ?? [])
      .filter((found) => !(ALLOWED[path] ?? []).includes(found))
      .map((found) => `${path}: "${found}"`),
  )
}

/** The build words a metadata table shows: in its text, and in its rules note as /config shows it. */
function buildWordsIn(meta: ConfigMeta): string[] {
  return Object.entries(meta).flatMap(([path, entry]) =>
    [...textsOf(entry), configRuleNote(entry.rule ?? '')]
      .flatMap((text) => text.match(BUILD_WORD) ?? [])
      .map((found) => `${path}: "${found}"`),
  )
}

describe('config.meta.json player text (standing rule 7)', () => {
  it('no label, help, option, or placeholder writes a rule number; ruleText builds it', () => {
    expect(ruleNumbersIn(defaultConfigMeta)).toEqual([])
  })

  it('no help or rules note shows a row, phase, or design-draft name', () => {
    expect(buildWordsIn(defaultConfigMeta)).toEqual([])
  })

  it('catches a planted rule number in digits or words, and a planted build word', () => {
    const planted: ConfigMeta = {
      'a.b': { label: 'A', help: 'Row 66: new tiles wait one round.', rule: 'Combat v3' },
      'a.c': { label: 'C', help: 'How 2 to 4 players take turns.', rule: '9.3, core loop v2' },
    }
    expect(ruleNumbersIn(planted)).toEqual(['a.b: "one round"', 'a.c: "2 to 4 players"'])
    expect(buildWordsIn(planted)).toEqual(['a.b: "Row 66"'])
  })
})

describe('config.meta.json marks the Spec v2 rule as the written one', () => {
  it('6.9: cost 1 is the written rule; the surcharge is the older rule', () => {
    const help = defaultConfigMeta['combat.moveCostNextToEnemy']?.help ?? ''
    expect(help).toContain('1 (default): no extra cost, as in the written rules.')
    expect(help).toContain('2: the older rule, kept for playtests.')
  })

  it('11.7: the pool is the written rule; the supply is the older rule', () => {
    const entry = defaultConfigMeta['draft.unpicked']
    expect(entry?.options).toEqual({
      pool: 'Your pool (default, written rules)',
      supply: 'Back to the supply (older rule)',
    })
    expect(entry?.help).not.toContain('(the written rule)')
  })
})

describe('config.meta.json names the baseline one way', () => {
  it('no help says "the current rule" or promises later content with "until ..."', () => {
    const found = Object.entries(defaultConfigMeta).flatMap(([path, entry]) =>
      (entry.help?.match(/\bthe current rule\b|\buntil each\b|\buntil elites?\b/gi) ?? []).map(
        (word) => `${path}: "${word}"`,
      ),
    )
    expect(found).toEqual([])
  })

  it('an experiment that is off by default says so, as in the written rules', () => {
    expect(defaultConfigMeta['spawn.perSeat']?.help).toContain(
      'Off (default): as in the written rules.',
    )
    expect(defaultConfigMeta['experience.eliteBonus']?.help).toContain(
      'Off (default): 0, as in the written rules.',
    )
  })
})

describe('config.meta.json says when things happen in plain words', () => {
  it('10.8: the draft help names the rounds, not a divisor', () => {
    const help = defaultConfigMeta['draft.everyNRounds']?.help ?? ''
    expect(help).toContain('every N rounds: at 2, in rounds 2, 4, and 6.')
    expect(help).not.toMatch(/divides/)
  })
})
