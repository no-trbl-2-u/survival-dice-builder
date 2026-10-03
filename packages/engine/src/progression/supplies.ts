import type { GameConfig } from '@survival/content'
import { shuffle } from '../rng/rng.ts'
import type { EngineContent, GameState, Supplies } from '../state/types.ts'

/** The supply levels, lowest first. @rule 4.12, Tables 8-9 */
export const SUPPLY_LEVELS = ['1', '2', '3'] as const

/**
 * Builds the card and Skill supplies: `copiesPerCard` / `copiesPerSkill` copies of each Level
 * 1-3 card and Skill (row 18), one shuffled stack per level.
 *
 * @rule 4.12, Table 8, Table 9
 */
export function buildSupplies(
  content: EngineContent,
  config: GameConfig,
  rng: number,
): readonly [Supplies, number] {
  let current = rng
  const stacks = (
    items: readonly { id: string; level: number }[],
    copies: number,
  ): Record<string, string[]> => {
    const out: Record<string, string[]> = {}
    for (const level of SUPPLY_LEVELS) {
      const ids = items
        .filter((x) => String(x.level) === level)
        .flatMap((x) => Array.from({ length: copies }, () => x.id))
      const [shuffled, next] = shuffle(current, ids)
      current = next
      out[level] = [...shuffled]
    }
    return out
  }
  const cards = stacks(content.cards, config.supplies.copiesPerCard)
  const skills = stacks(content.skills, config.supplies.copiesPerSkill)
  return [{ cards, skills }, current]
}

/** The level a track has opened: 0 when closed, else the highest bought tier's level. @rule 11.4, Table 6 */
export function openLevel(state: GameState, track: 'shop' | 'training'): number {
  return state.content.upgrades
    .filter((u) => u.track === track && state.upgrades.includes(u.id))
    .reduce((max, u) => Math.max(max, u.opensLevel), 0)
}

/**
 * The supply level to draw from: the highest open level, else the next lower level with
 * cards left (11.8; for the Shop proposed). Null when every open level is empty.
 *
 * @rule 11.5, 11.8
 */
export function drawLevel(
  stacks: Readonly<Record<string, readonly string[]>>,
  highest: number,
): string | null {
  for (let level = highest; level >= 1; level--) {
    if ((stacks[String(level)] ?? []).length > 0) return String(level)
  }
  return null
}
