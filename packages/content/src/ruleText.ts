import type { Content } from './load.ts'
import type { GameConfig } from './schemas/config.ts'

/**
 * Rule text from one source: every rule phrase the site shows, built from a config. Components
 * read these and never write a rule or its number by hand, so a rule change in config changes
 * the copy with it. Pure: no I/O, no state.
 */

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** "half", or "1/3": the share of maximum health a knocked-out player comes back with. */
const share = (divisor: number) => (divisor === 1 ? 'all' : divisor === 2 ? 'half' : `1/${divisor}`)

/**
 * What a run is for, and what ends it.
 *
 * @rule 14.1
 */
export function goalText(): string {
  return 'Keep the base standing for as many rounds as you can. The run ends when the base falls.'
}

/**
 * What happens to a player at 0 health.
 *
 * @rule core loop v2 (knockout), OPEN-QUESTIONS row 55
 */
export function knockoutText(config: GameConfig): string {
  const k = config.knockout
  const health = `${share(k.returnHealthDivisor)} of their maximum health, rounded up`
  const lost = k.loseMaterials ? ' The materials they carry are lost.' : ''
  return `A player at 0 health is knocked out and comes back next round with ${health}.${lost}`
}

/**
 * How the map grows: stepping off its edge.
 *
 * @rule core loop v2 (exploring), 10.1
 */
export function revealText(config: GameConfig): string {
  const cost = plural(config.tiles.revealMoveCost, 'hex', 'hexes')
  return `Step off the edge of the map to reveal a new tile; the step costs ${cost} of movement.`
}

/**
 * When a revealed tile's spawn nodes start adding enemies.
 *
 * @rule core loop v2 (spawning), OPEN-QUESTIONS row 66
 */
export function spawnText(config: GameConfig): string {
  const delay = config.spawn.newTileDelay
  const when =
    delay === 0
      ? 'at every Combat'
      : `at every Combat from ${plural(delay, 'round', 'rounds')} after it is revealed`
  return `Each new tile's spawn nodes add enemies ${when}, and enemies go for the nearest structure first.`
}

/**
 * A Gather card's top half: where it gathers, and what it spends.
 *
 * @param amount - the card's materials.
 * @rule 6.7, Table 1, OPEN-QUESTIONS rows 20, 59, 67
 */
export function gatherText(amount: number, config: GameConfig): string {
  const off = config.gather.offNodeAmount
  if (!config.rulings.gatherNeedsNode)
    return `Gather ${amount} anywhere (an unspent gathering node is spent)`
  const elsewhere = off > 0 ? `; ${off} anywhere else` : ''
  return `Gather ${amount} on an unspent gathering node (the node is spent)${elsewhere}`
}

/**
 * How a Combat plays under a Combat model, and when it ends.
 *
 * @rule 7, Combat v3 (engagements), OPEN-QUESTIONS row 72
 */
export function combatText(config: GameConfig, model: GameConfig['combat']['model']): string {
  if (model === 'exchange')
    return 'In each exchange you roll, play cards, and fire Skills; then every enemy next to you attacks.'
  const elite = plural(config.combat.engage.eliteDice, 'die', 'dice')
  return (
    `Play Engage to roll your dice from where you stand, plus 1 enemy die for each grunt and ${elite} for each elite next to you. ` +
    'Put your dice on your Skills one at a time; the enemy dice hit last, after your guard. ' +
    combatEndText()
  )
}

/**
 * When an engagement Combat ends.
 *
 * @rule Combat v3 (engagements)
 */
export function combatEndText(): string {
  return 'Cards you do not play stay in your hand, and Combat ends when every hand and deck is empty.'
}

/**
 * The Skill draft dialog's title. The engine keeps one Skill per draft (`keepSkill`);
 * `draft.keep` is not read yet (marked unused on /config), so the title does not read it.
 *
 * @rule 11.8
 */
export function draftTitle(): string {
  return 'Skill draft: keep a Skill'
}

/**
 * The draft dialog's line when every draft slot holds a Skill.
 *
 * @param kept - the name of the Skill just kept.
 * @rule 11.8, OPEN-QUESTIONS row 15
 */
export function draftFullText(config: GameConfig, kept: string): string {
  return `Your ${plural(config.player.draftSlots, 'draft slot is', 'draft slots are')} full: ${kept} replaces a Skill`
}

/**
 * Where the Skills a player does not keep go.
 *
 * @rule 11.8 (designer 2026-10-09)
 */
export function draftPoolText(config: GameConfig): string {
  return config.draft.unpicked === 'pool'
    ? 'The Skills you do not keep go to your pool. Later drafts offer them again.'
    : 'The Skills you do not keep go back to the supply.'
}

/**
 * The enemy miniature limit.
 *
 * @rule 2.2, 10.5, OPEN-QUESTIONS row 32
 */
export function miniatureLimitText(config: GameConfig): string {
  return `At most ${plural(config.miniatureLimit, 'enemy stands', 'enemies stand')} on the map. Past that, a new grunt or elite turns the grunt nearest the base into an elite instead.`
}

/**
 * How many can play: "1 to 4 players".
 *
 * @rule 1
 */
export function playersText(config: GameConfig): string {
  const { min, max } = config.players
  return min === max ? plural(min, 'player', 'players') : `${min} to ${max} players`
}

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
      return `Buy ${plural(m.upgradesBought, 'base upgrade', 'base upgrades')}`
    case 'reveal-tiles':
      return `Reveal ${plural(m.tilesRevealed, 'tile', 'tiles')}`
    case 'reach-level':
      return `Reach level ${m.level}`
    default:
      return id
  }
}

/**
 * The rule phrase a /config field sets, with the draft's values, or null when no phrase reads
 * that field.
 *
 * @param path - the dotted config path, e.g. `knockout.returnHealthDivisor`.
 * @rule 18.1
 */
export function ruleLineFor(
  path: string,
  config: GameConfig,
  content: Pick<Content, 'skills'>,
): string | null {
  const [group, key] = path.split('.')
  if (path === 'miniatureLimit') return miniatureLimitText(config)
  if (path === 'tiles.revealMoveCost') return revealText(config)
  if (path === 'spawn.newTileDelay') return spawnText(config)
  if (group === 'knockout') return knockoutText(config)
  if (path === 'gather.offNodeAmount' || path === 'rulings.gatherNeedsNode')
    return `${gatherText(2, config)}.`
  if (path === 'player.draftSlots') return `${draftFullText(config, 'the new Skill')}.`
  if (path === 'draft.unpicked') return draftPoolText(config)
  if (path === 'combat.engage.eliteDice') return combatText(config, 'engage')
  if (group === 'players') return `For ${playersText(config)}.`
  if (group === 'milestones') {
    const m = config.milestones
    const ids: Record<string, string[]> = {
      surviveRounds: m.surviveRounds.map((n) => `survive-round-${n}`),
      upgradesBought: ['buy-upgrades'],
      tilesRevealed: ['reveal-tiles'],
      level: ['reach-level'],
      skillFired: [`fire-${m.skillFired}`],
    }
    const labels = (ids[key ?? ''] ?? []).map((id) => milestoneLabel(id, m, content))
    return labels.length > 0 ? `${labels.join('; ')}.` : null
  }
  return null
}
