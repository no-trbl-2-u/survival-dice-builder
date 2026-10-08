import type { Content, GameConfig } from '@survival/content'

type Milestones = GameConfig['milestones']

/**
 * Every milestone id the config sets, in the order the run summary lists them.
 *
 * @rule 17
 */
export function milestoneIds(m: Milestones): string[] {
  return [
    ...m.surviveRounds.map((n) => `survive-round-${n}`),
    'defeat-elite',
    `fire-${m.skillFired}`,
    'buy-upgrades',
    'reveal-tiles',
    'reach-level',
  ]
}

/**
 * A milestone in plain words, with its numbers from the config: "Reveal 7 tiles".
 *
 * @param id - the engine's milestone id, e.g. `survive-round-5` or `fire-arcane-rain`.
 * @rule 17
 */
export function milestoneLabel(
  id: string,
  m: Milestones,
  content: Pick<Content, 'skills'>,
): string {
  const round = /^survive-round-(\d+)$/.exec(id)
  if (round) return `Survive to round ${round[1]}`
  if (id.startsWith('fire-')) {
    const skill = id.slice('fire-'.length)
    return `Fire ${content.skills.find((s) => s.id === skill)?.name ?? skill}`
  }
  switch (id) {
    case 'defeat-elite':
      return 'Defeat an elite'
    case 'buy-upgrades':
      return `Buy ${m.upgradesBought} base ${m.upgradesBought === 1 ? 'upgrade' : 'upgrades'}`
    case 'reveal-tiles':
      return `Reveal ${m.tilesRevealed} ${m.tilesRevealed === 1 ? 'tile' : 'tiles'}`
    case 'reach-level':
      return `Reach level ${m.level}`
    default:
      return id
  }
}
