import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
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

  it('7.8: Engage is a card option, not a card', () => {
    const help = defaultConfigMeta['combat.model']?.help ?? ''
    expect(help).toContain("play a card's Engage option to roll from where you stand")
    const found = Object.entries(defaultConfigMeta)
      .filter(([, e]) => /\bplay Engage\b/i.test(e.help ?? ''))
      .map(([path]) => path)
    expect(found).toEqual([])
  })

  it('7.10: the siege step ends Combat under both models, not Engagements only', () => {
    const help = defaultConfigMeta['combat.model']?.help ?? ''
    expect(help).toMatch(
      /Exchanges \(older rule\): the earlier Combat, kept for playtests\. In both, enemies hit structures in the siege step at the end of Combat\.$/,
    )
    expect(help).not.toMatch(/stand; enemies hit structures/)
  })

  it('every option label writes the older-rule tag one way', () => {
    const labels = Object.values(defaultConfigMeta).flatMap((entry) =>
      Object.values(entry?.options ?? {}),
    )
    expect(labels.filter((label) => /\(older rules\)/.test(label))).toEqual([])
    expect(labels).toContain('Exchanges (older rule)')
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
      'Not ticked (default): as in the written rules.',
    )
    expect(defaultConfigMeta['experience.eliteBonus']?.help).toContain(
      'Off (default): 0, as in the written rules.',
    )
  })
})

describe('config.meta.json says when things happen in plain words', () => {
  it('10.8: the draft help names the rounds, not a divisor', () => {
    const help = defaultConfigMeta['draft.everyNRounds']?.help ?? ''
    expect(help).toContain('every N rounds: at 2, in rounds 2, 4 and 6.')
    expect(help).not.toMatch(/divides/)
  })
})

describe('config.meta.json placeholders and help read as player text (critique pass 30)', () => {
  it('an optional limit reads "Off" when empty, as the toggle beside it does', () => {
    const empties = Object.values(defaultConfigMeta).flatMap((e) => (e.empty ? [e.empty] : []))
    expect(empties.length).toBeGreaterThan(0)
    for (const empty of empties) expect(empty[0]).toBe(empty[0]?.toUpperCase())
  })

  it('no help text writes a formula', () => {
    const formulas = Object.entries(defaultConfigMeta)
      .filter(([, e]) => /[+/=]|\(round\b/.test(e.help ?? ''))
      .map(([path]) => path)
    expect(formulas).toEqual([])
  })

  it('Table 4: the damage helps name the faces as the enemy die help does, and the target', () => {
    const faces = defaultConfigMeta['combat.engage.enemyDie']?.help ?? ''
    for (const [path, face] of [
      ['combat.engage.hitDamage', 'Hit'],
      ['combat.engage.specialDamage', 'Special'],
    ] as const) {
      expect(faces).toContain(face)
      expect(defaultConfigMeta[path]?.help).toBe(`Damage a ${face} face deals to the player.`)
    }
  })

  it('7.8: the defeated dice help names each choice as the list labels it, marker before the colon', () => {
    const entry = defaultConfigMeta['combat.engage.defeatedDice']
    const options = Object.values(entry?.options ?? {})
    const labels = options.map((o) => o.replace(/\s*\(.*\)$/, ''))
    expect(labels).toEqual(['Still hit', 'Cancelled'])
    for (const option of options) expect(entry?.help).toContain(`${option}: `)
    expect(entry?.help).not.toMatch(/^Hit:|\((default|experiment)\)\./)
  })

  it('7.8 step 7: the defeated dice field cites rule 7.8 and names Still hit as the written rule', () => {
    const entry = defaultConfigMeta['combat.engage.defeatedDice']
    expect(configRuleNote(entry?.rule ?? '')).toBe('Rule 7.8.')
    expect(entry?.help).toMatch(/^Still hit \(default\): [^.]*as in the written rules\./)
  })

  it('11.7: the unpicked Skills help names each choice as the list labels it', () => {
    const entry = defaultConfigMeta['draft.unpicked']
    const options = Object.values(entry?.options ?? {})
    const labels = options.map((o) => o.replace(/\s*\(.*\)$/, ''))
    expect(labels).toEqual(['Your pool', 'Back to the supply'])
    expect(entry?.help).toMatch(/^Your pool \(default, written rules\): /)
    for (const option of options) expect(entry?.help).toContain(`${option}: `)
    expect(entry?.help).not.toMatch(/^Pool\b|\. Supply:|\(the older rule/)
  })

  it('every list marks its default choice, as the Combat model list does', () => {
    const unmarked = Object.entries(defaultConfigMeta).flatMap(([path, entry]) => {
      if (!entry.options) return []
      const value = path
        .split('.')
        .reduce<unknown>((at, key) => (at as Record<string, unknown>)?.[key], defaultContent.config)
      const label = entry.options[String(value)]
      return label && /\(default\b/.test(label) ? [] : [`${path}: ${String(value)}`]
    })
    expect(unmarked).toEqual([])
    expect(defaultConfigMeta['rulings.blockedPathRule']?.options).toEqual({
      'next-target': 'Move toward the next nearest target (default)',
      wait: 'Wait where it is',
    })
  })

  it('every tick box and optional limit names its default in its help, as the lists do', () => {
    const unmarked = Object.entries(defaultConfigMeta).flatMap(([path, entry]) => {
      const value = path
        .split('.')
        .reduce<unknown>((at, key) => (at as Record<string, unknown>)?.[key], defaultContent.config)
      if (typeof value !== 'boolean' && value !== null) return []
      return /\(default\)/.test(entry.help ?? '') ? [] : [`${path}: ${String(value)}`]
    })
    expect(unmarked).toEqual([])
    expect(defaultConfigMeta['options.maxLevel']?.help).toBe(
      'The highest level the players can reach. Off (default): no maximum, as in the written rules.',
    )
  })

  it('a tick box names its unticked default "Not ticked", as the box shows no "Off" (critique pass 35)', () => {
    const offBoxes = Object.entries(defaultConfigMeta).flatMap(([path, entry]) => {
      const value = path
        .split('.')
        .reduce<unknown>((at, key) => (at as Record<string, unknown>)?.[key], defaultContent.config)
      return typeof value === 'boolean' && /\bOff \(default\)/.test(entry.help ?? '') ? [path] : []
    })
    expect(offBoxes).toEqual([])
    expect(defaultConfigMeta['rulings.tileRotation']?.help).toBe(
      'When ticked, the player may rotate a revealed tile. Not ticked (default): as in the written rules.',
    )
  })
})
