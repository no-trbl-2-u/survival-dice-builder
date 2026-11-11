import { SkillDefSchema, type SkillFace } from '@survival/content'
import { z } from 'zod'

/**
 * Skill design tooling (Skills v1 proposal, docs/design/skills-v1): the exact chance a Skill
 * fires in one engagement, a value per firing from a closed status glossary, and the proposal
 * schema (today's Skill schema plus the new fields).
 */

const SKILL_FACES: readonly SkillFace[] = ['Sword', 'Wand', 'Bow', 'Shield']

/** Needs per Skill face, in `SKILL_FACES` order. */
type Needs = readonly number[]

/** Every way `n` dice land as counts over the 6 faces (4 Skill faces, Star, Blank), with odds. */
function outcomes(n: number): readonly { counts: number[]; p: number }[] {
  const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1))
  const out: { counts: number[]; p: number }[] = []
  const walk = (left: number, i: number, acc: number[]) => {
    if (i === 5) {
      const counts = [...acc, left]
      const ways = fact(n) / counts.reduce((m, c) => m * fact(c), 1)
      out.push({ counts, p: ways / 6 ** n })
      return
    }
    for (let c = 0; c <= left; c++) walk(left - c, i + 1, [...acc, c])
  }
  walk(n, 0, [])
  return out
}

/**
 * Every needs vector left after `stars` wild dice fill some of `needs` (2.4: a Star counts as
 * any face), with the number of Stars used.
 */
function starFills(needs: Needs, stars: number): readonly (readonly [Needs, number])[] {
  if (stars === 0 || needs.every((n) => n === 0)) return [[needs, 0]]
  const out: (readonly [Needs, number])[] = [[needs, 0]]
  needs.forEach((n, i) => {
    if (n === 0) return
    const next = needs.map((m, j) => (j === i ? m - 1 : m))
    for (const [rest, used] of starFills(next, stars - 1)) out.push([rest, used + 1])
  })
  return out
}

/**
 * The exact chance that a Skill fires at least once in one engagement (7.8): `dice` action dice,
 * up to `rolls` rolls, keeping every die that fills an open slot and rolling the rest again. A
 * Star fills the slot that leaves the best chance; a Blank fills nothing.
 *
 * @rule 2.3-2.5, 7.8 steps 2-5
 */
export function fireChance(faces: readonly SkillFace[], dice: number, rolls = 3): number {
  const start = SKILL_FACES.map((f) => faces.filter((x) => x === f).length)
  const memo = new Map<string, number>()
  const chance = (needs: Needs, free: number, left: number): number => {
    const total = needs.reduce((a, b) => a + b, 0)
    if (total === 0) return 1
    if (left === 0 || free < total) return 0
    const key = `${needs.join(',')}|${free}|${left}`
    const hit = memo.get(key)
    if (hit !== undefined) return hit
    let p = 0
    for (const o of outcomes(free)) {
      const filled = needs.map((n, i) => Math.min(n, o.counts[i] ?? 0))
      const after = needs.map((n, i) => n - (filled[i] ?? 0))
      const used = filled.reduce((a, b) => a + b, 0)
      let best = 0
      for (const [rest, stars] of starFills(after, o.counts[4] ?? 0)) {
        best = Math.max(best, chance(rest, free - used - stars, left - 1))
      }
      p += o.p * best
    }
    memo.set(key, p)
    return p
  }
  return chance(start, dice, rolls)
}

/**
 * The closed status and keyword glossary: what each does and its value in damage points (1 =
 * 1 damage to 1 enemy). Values are design estimates, stated in the proposal page.
 */
export const GLOSSARY = {
  Burn: {
    kind: 'enemy',
    limit: 1,
    value: 2,
    text: 'Takes 1 damage each Combat, after the enemies move (7.5) and before spawns (7.3). Persistent. The player who burned it gets the currency (8.2).',
  },
  Poison: {
    kind: 'enemy',
    limit: 3,
    value: 1.5,
    text: 'Takes 1 damage per token in the siege step (7.11), then remove 1 token. The player who poisoned it gets the currency (8.2).',
  },
  Stun: {
    kind: 'enemy',
    limit: 1,
    value: 1,
    text: 'Rolls no enemy dice in the next engagement where it would roll (7.8 step 2), then remove it.',
  },
  Snare: {
    kind: 'enemy',
    limit: 1,
    value: 1,
    text: 'Skips its next move (7.5), then remove it.',
  },
  Mark: {
    kind: 'enemy',
    limit: 1,
    value: 2,
    text: 'The next damage it takes is 2 more, then remove it.',
  },
  Evade: {
    kind: 'player',
    limit: 3,
    value: 0.7,
    text: 'Spend before enemy dice hit you: roll 1 die; Shield or Star ignores every hit.',
  },
  Focus: {
    kind: 'player',
    limit: 3,
    value: 1,
    text: 'Spend between rolling (7.8 step 3) and placing dice (step 4): 1 of your dice becomes a Star.',
  },
  Protect: {
    kind: 'player',
    limit: 1,
    value: 2,
    text: 'Halve the enemy damage of your next engagement (7.8 step 8), rounded down. Then remove it.',
  },
  Ward: {
    kind: 'player',
    limit: 1,
    value: 1.5,
    text: 'The next Special face that hits you deals 0. Removed with your guard at 7.8 step 9 if unused.',
  },
  Cleanse: {
    kind: 'player',
    limit: 0,
    value: 1,
    text: 'Remove 1 negative token from the healed player. No negative player token exists yet: it waits for enemy effects.',
  },
  Fortify: {
    kind: 'structure',
    limit: 1,
    value: 1.5,
    text: 'On the nearest structure in the 7.12 order: its next siege damage (7.11) is 0.',
  },
  Signal: {
    kind: 'structure',
    limit: 0,
    value: 2,
    text: 'Each Tower in range makes 1 extra attack now, as in 12.3.',
  },
  'Repair 3': {
    kind: 'structure',
    limit: 0,
    value: 1.5,
    text: 'Repair 3, as in 12.5: on the base, the base; on other hexes, the most damaged defense on your hex or an adjacent hex.',
  },
} as const

/** Keywords on the Skill itself, with a value in damage points (0: a rule, not a bonus). */
export const KEYWORDS = {
  Overkill: {
    value: 1,
    text: 'Damage past 0 health goes to 1 other enemy in range (players choose).',
  },
  Crit: { value: 1.5, text: 'If the target has Mark, this Skill deals 3 more.' },
  Spread: { value: 0, text: 'Needs 1 die of each face: the straight of this game.' },
  Ultimate: {
    value: 0,
    text: 'Needs 5 dice (level 5). No token or enemy effect can reduce its damage.',
  },
  'Push 1': {
    value: 0.5,
    text: 'Move each target 1 hex away from you; a blocked push (9.7) does not move it.',
  },
} as const

/** A proposal Skill: today's Skill schema plus family, tier, keywords, statuses and heal target. */
export const SkillProposalSchema = SkillDefSchema.extend({
  family: z.string().min(1),
  tier: z.enum(['I', 'II', 'III']),
  keywords: z.array(z.enum(Object.keys(KEYWORDS) as [keyof typeof KEYWORDS])),
  adds: z.array(
    z.object({
      status: z.enum(Object.keys(GLOSSARY) as [keyof typeof GLOSSARY]),
      stacks: z.number().int().positive(),
      on: z.string().min(1),
    }),
  ),
  healTarget: z
    .object({
      who: z.enum(['self', 'self-or-ally', 'each-player']),
      within: z.number().int().nonnegative(),
    })
    .optional(),
  note: z.string().optional(),
})
export type SkillProposal = z.infer<typeof SkillProposalSchema>

/** Targets an "each" effect or status hits, on average (design estimate). */
export const EACH_TARGETS = 2

/**
 * A Skill's value per firing in damage points: damage 1, guard 0.6, heal 0.8 (1.0 for an ally
 * target, x2 for each player); "each" counts `EACH_TARGETS` targets; range 2 adds 20%, range 3
 * 35%; statuses and keywords from the glossary.
 */
export function skillValue(skill: SkillProposal): number {
  const e = skill.effect
  const reach = (r: number) => (r >= 3 ? 1.35 : r === 2 ? 1.2 : 1)
  const core =
    e.kind === 'damage'
      ? e.amount * reach(e.range) * (e.target === 'each' ? EACH_TARGETS : 1)
      : e.kind === 'guard'
        ? e.amount * 0.6
        : e.kind === 'heal'
          ? e.amount *
            (skill.healTarget?.who === 'each-player'
              ? 1.6
              : skill.healTarget?.who === 'self-or-ally'
                ? 1
                : 0.8)
          : e.hits * 0.8
  const statuses = skill.adds.reduce((sum, a) => {
    const many = a.on === 'each' || a.on === 'target-and-adjacent' ? EACH_TARGETS : 1
    return sum + GLOSSARY[a.status].value * a.stacks * many
  }, 0)
  const keys = skill.keywords.reduce((sum, k) => sum + KEYWORDS[k].value, 0)
  return Math.round((core + statuses + keys) * 10) / 10
}

/**
 * The action dice a player has when a tier's supply opens: level 2 for I, 3 for II, 4 for III.
 * An Ultimate is rated at 5 dice (level 5).
 */
export const TIER_DICE = { I: 2, II: 3, III: 4 } as const

/** One row of the odds table: fire chance by dice count, value, and expected value at its tier. */
export type OddsRow = Readonly<{
  skill: SkillProposal
  chance: readonly number[]
  value: number
  expected: number
}>

/** The odds table for a proposal: chance with 1-6 dice and 3 rolls, value, and tier expectation. */
export function oddsTable(skills: readonly SkillProposal[]): readonly OddsRow[] {
  return skills.map((skill) => {
    const chance = [1, 2, 3, 4, 5, 6].map((d) => fireChance(skill.faces, d))
    const value = skillValue(skill)
    const dice = skill.keywords.includes('Ultimate') ? 5 : TIER_DICE[skill.tier]
    const expected = Math.round((chance[dice - 1] ?? 0) * value * 100) / 100
    return { skill, chance, value, expected }
  })
}
