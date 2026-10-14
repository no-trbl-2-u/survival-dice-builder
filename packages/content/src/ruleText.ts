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
  const items = [k.loseMaterials && 'materials', k.loseCurrency && 'currency'].filter(Boolean)
  const lost = items.length > 0 ? ` They lose all their ${items.join(' and ')}.` : ''
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
  return `Each new tile's spawn nodes add enemies ${when}.`
}

/**
 * What raises the shared level, and what a new level gives.
 *
 * @rule 8.1, 8.3, 8.4, 8.5, 18.1, OPEN-QUESTIONS row 17
 */
export function levelText(config: GameConfig): string {
  const { firstStep, stepIncrease, levelPerEliteSpawn } = config.experience
  const next =
    stepIncrease === 0
      ? `each next level needs ${firstStep} more`
      : `each next level needs ${stepIncrease} more than the step before`
  const raise = levelPerEliteSpawn
    ? 'The level rises by 1 each time an elite spawns.'
    : `Each defeated enemy gives experience to all players. Level 2 needs ${firstStep} experience, and ${next}.`
  const max = config.options.maxLevel
  const cap = max === null ? '' : ` The level stops at ${max}.`
  return `${raise} At each new level, every player gets 1 more action die.${cap}`
}

type Upgrades = Pick<Content, 'upgrades'>

/** The first upgrade of a base track: "Shop I" and its cost in materials. */
const firstUpgrade = (track: string, content: Upgrades) =>
  content.upgrades.find((u) => u.track === track && u.tier === 1)

/**
 * How the Shop opens, what pays for its cards, and when a player can buy.
 *
 * @rule 6.8, 8.2, 11.2, Table 6
 */
export function shopText(config: GameConfig, content: Upgrades): string {
  const shop = firstUpgrade('shop', content)
  const open = shop
    ? `Buy ${shop.name} on the base (a Build card and ${plural(shop.cost, 'material', 'materials')}) to open the Shop`
    : 'Open the Shop on the base'
  const when =
    config.rulings.shopTiming === 'prepare-only'
      ? 'while you stand on the base in the Prepare phase'
      : 'at any time you stand on the base'
  return `${open} with ${plural(config.shop.offers, 'card offer', 'card offers')}. Pay for cards with currency, which you get for each enemy you defeat; buy ${when}.`
}

/**
 * How the Training Ground opens, and when its Skill draft happens.
 *
 * @rule 10.8, 11.6, 11.7, Table 6
 */
export function trainingText(config: GameConfig, content: Upgrades): string {
  const training = firstUpgrade('training', content)
  const open = training
    ? `${training.name} (${plural(training.cost, 'material', 'materials')}) opens the Training Ground`
    : 'The Training Ground opens a Skill draft'
  const n = config.draft.everyNRounds
  const every =
    n === 1 ? 'every round' : `every ${n}${n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'} round`
  return `${open}: ${every}, each player looks at ${plural(config.draft.reveal, 'Skill', 'Skills')} and keeps 1 for free.`
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

/** "a grunt rolls 1, an elite 2": each enemy's enemy dice, from the enemy content. */
const enemyDiceText = (content: Enemies) =>
  content.enemies.enemies
    .filter((e) => e.dice > 0)
    .map((e, i) => `${withArticle(e.name.toLowerCase())}${i === 0 ? ' rolls' : ''} ${e.dice}`)
    .join(', ')

/**
 * How a Combat plays under a Combat model, and when it ends, with each enemy's enemy dice.
 *
 * @rule 7, 7.8, 9.5, 9.6, Table 5 (Spec v2)
 */
export function combatText(
  config: GameConfig,
  model: GameConfig['combat']['model'],
  content: Enemies,
): string {
  if (model === 'exchange') {
    return 'In each exchange you roll, play cards, and fire Skills; then each enemy next to you that targets you rolls its enemy dice at you.'
  }
  const dice = enemyDiceText(content)
  return (
    `Play an Engage card to roll your dice from where you stand, plus the enemy dice of each enemy next to you${dice ? ` (${dice})` : ''}. ` +
    'Put your dice on your Skills one at a time. ' +
    `${enemyHitText(config)} ` +
    combatEndText(config)
  )
}

/**
 * When the enemy dice of an engagement hit, whose dice hit, and what takes the damage.
 *
 * @rule 7.8 steps 7-8 (Spec v2), OPEN-QUESTIONS row 72
 */
export function enemyHitText(config: GameConfig): string {
  const defeated =
    config.combat.engage.defeatedDice === 'hit'
      ? 'even the dice of an enemy you defeated'
      : 'except the dice of an enemy you defeated'
  return `When you choose End engagement or no dice are left, every enemy die hits you at once, ${defeated}. Your guard takes the damage first, then your health.`
}

type Enemies = Pick<Content, 'enemies'>

/** "a grunt" or "an elite". */
const withArticle = (word: string) => `${/^[aeiou]/i.test(word) ? 'an' : 'a'} ${word}`

/**
 * The siege step: how the base and its defenses take damage at the end of Combat (both Combat
 * models), with each enemy record's siege damage.
 *
 * @rule 7.10-7.12, 9.5, Table 5 (Spec v2)
 */
export function siegeText(content: Enemies): string {
  const damage = content.enemies.enemies
    .filter((e) => e.siege > 0)
    .map(
      (e, i) =>
        `${withArticle(e.name.toLowerCase())}${i === 0 ? ` deals ${e.siege} damage` : ` ${e.siege}`}`,
    )
    .join(', ')
  return `When Combat ends, each enemy next to a Barricade, a Tower, or the base hits one of them (a Barricade first, then a Tower, then the base), even when it is next to a player too: ${damage}.`
}

/**
 * How a hand empties in an engagement Combat, and when the Combat ends.
 *
 * @rule 6.2, Combat v3 (engagements), OPEN-QUESTIONS row 10
 */
export function combatEndText(config: GameConfig): string {
  const play = config.rulings.mandatoryPlays ? 'Play each card' : 'Play or discard each card'
  return `${play}. Cards you do not play yet stay in your hand between engagements, and Combat ends when every hand and deck is empty.`
}

/**
 * The step line when a player has cards to play: in an exchange, or in an engagement Combat.
 *
 * @rule 6.2, 7.8 step 5, OPEN-QUESTIONS row 10
 */
export function cardStepText(config: GameConfig, model: GameConfig['combat']['model']): string {
  const discard = !config.rulings.mandatoryPlays
  if (model === 'exchange')
    return discard ? 'Play or discard each card in your hand' : 'Play each card in your hand'
  return `Play each card: Engage (roll to attack from where you stand)${discard ? ', another option, or discard it' : ' or another option'}`
}

/** Each tie-break target as the order sentence names it: "a player, then a Tower, ...". */
const TARGET_NAME: Record<GameConfig['rulings']['targetTieBreak'][number], string> = {
  player: 'a player',
  tower: 'a Tower',
  barricade: 'a Barricade',
  base: 'the base',
}

/**
 * Which target an enemy heads for: the nearest structure, or a player only when much nearer.
 * The short form / prints; {@link targetOrderText} adds the tie-break order.
 *
 * @rule 9.3, OPEN-QUESTIONS row 56
 */
export function targetText(config: GameConfig): string {
  const pull = config.rulings.playerPullDistance
  return pull === 0
    ? 'Enemies head for the nearest structure or player.'
    : `Enemies head for the nearest structure, and turn to a player only when the player is at least ${plural(pull, 'hex', 'hexes')} nearer.`
}

/**
 * Which target an enemy heads for: the nearest structure, a player only when much nearer, and
 * the tie-break order only between equally near targets.
 *
 * @rule 9.3, OPEN-QUESTIONS rows 15, 56
 */
export function targetOrderText(config: GameConfig): string {
  const order = config.rulings.targetTieBreak.map((t) => TARGET_NAME[t]).join(', then ')
  return `${targetText(config)} Between equally near targets they pick ${order}.`
}

/**
 * The starter-return dialog's line: a bought card sends a starter card away.
 *
 * @rule 18.1 (bought cards replace a starter)
 */
export function returnStarterText(): string {
  return 'You bought a card, so a starter card leaves your deck for good.'
}

/** Design-document tags in player words: the documents are build history, not rules names. */
const CITATIONS: readonly (readonly [RegExp, string])[] = [
  [/Combat v3/g, 'engagements'],
  [/core loop v2/gi, 'core loop'],
]

/**
 * A rule tag as a player reads it: section numbers pass through, design-document names become
 * plain words ("Combat v3 (siege)" -> "engagements (siege)").
 *
 * @param rule - an engine log tag or a config field's rules section.
 * @rule 18.1
 */
export function ruleCitation(rule: string): string {
  return CITATIONS.reduce((text, [from, to]) => text.replace(from, to), rule)
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
  content: Pick<Content, 'skills' | 'enemies'>,
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
  if (path === 'combat.model')
    return `${combatText(config, config.combat.model, content)} ${siegeText(content)}`
  if (path === 'combat.engage.hitDamage' || path === 'combat.engage.defeatedDice')
    return enemyHitText(config)
  if (path === 'rulings.mandatoryPlays') return combatEndText(config)
  if (path === 'rulings.targetTieBreak' || path === 'rulings.playerPullDistance')
    return targetOrderText(config)
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
