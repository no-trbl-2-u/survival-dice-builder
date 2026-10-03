import type { GameConfig } from '@survival/content'

/**
 * Returns the experience needed to reach each level, as a cumulative total.
 * Level 2 needs `firstStep`; each later step needs `stepIncrease` more than the step before
 * (defaults: steps 5, 10, 15 ... so totals 5, 15, 30, 50 ...).
 *
 * @param level - the level to reach (1 or more). Level 1 needs 0.
 * @param config - the game configuration (reads `experience`).
 * @returns the total experience at which `level` starts.
 * @rule 8.5
 */
export function experienceForLevel(level: number, config: GameConfig): number {
  const { firstStep, stepIncrease } = config.experience
  let total = 0
  // Step k (k = 0 for level 2) costs firstStep + k * stepIncrease.
  for (let k = 0; k < level - 1; k++) total += firstStep + k * stepIncrease
  return total
}

/**
 * Returns the level for an experience total, capped by `options.maxLevel` when it is set.
 *
 * @param experience - the shared experience track value (0 or more).
 * @param config - the game configuration (reads `experience` and `options.maxLevel`).
 * @returns the current level, 1 or more.
 * @rule 8.3, 8.5, 18.1
 */
export function levelForExperience(experience: number, config: GameConfig): number {
  const cap = config.options.maxLevel ?? Number.POSITIVE_INFINITY
  let level = 1
  while (level < cap && experience >= experienceForLevel(level + 1, config)) level += 1
  return level
}
