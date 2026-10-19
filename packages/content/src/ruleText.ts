import type { Content } from './load.ts'
import type { GameConfig } from './schemas/config.ts'
import type { SkillEffect } from './schemas/effects.ts'
import type { Site } from './schemas/tiles.ts'

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

type Upgrades = Pick<Content, 'upgrades'>

/** The first upgrade of a base track: "Shop I" and its cost in materials. */
const firstUpgrade = (track: string, content: Upgrades) =>
  content.upgrades.find((u) => u.track === track && u.tier === 1)

/**
 * What a printed site does, for the site legend: "gets 1 grunt at each Combat".
 *
 * @rule Table 1, 6.7, 7.3, 11.2, OPEN-QUESTIONS rows 59, 64, 66, 68, 70
 */
export function siteText(site: Site, config: GameConfig, content: Upgrades): string {
  if (site === 'base') {
    const shop = firstUpgrade('shop', content)
    const cards = shop
      ? `, and cards once ${shop.name} is built`
      : ', and cards once the Shop opens'
    return `the players defend it; upgrades are bought here${cards}`
  }
  if (site === 'gathering-node')
    return config.rulings.gatherNeedsNode
      ? 'a Gather card here gets its materials, once'
      : 'the first Gather card here spends it'
  const s = config.spawn
  const one = s.rampEvery === null && !s.perSeat
  const enemy = site === 'spawn-node' ? 'grunt' : 'elite'
  const who = one ? `1 ${enemy}` : `${enemy}s`
  const delay =
    s.newTileDelay > 0
      ? `, from ${plural(s.newTileDelay, 'round', 'rounds')} after its tile is revealed`
      : ''
  const range =
    s.nodeRange === null
      ? ''
      : `, if a figure or structure is within ${plural(s.nodeRange, 'hex', 'hexes')}`
  return `gets ${who} at each Combat${delay}${range}`
}

/**
 * What raises the shared level, and what a new level gives, with each enemy's experience.
 *
 * @rule 8.1, 8.3, 8.4, 8.5, 18.1, OPEN-QUESTIONS row 17
 */
export function levelText(config: GameConfig, content: Enemies): string {
  const { firstStep, stepIncrease, levelPerEliteSpawn, eliteBonus } = config.experience
  const gains = content.enemies.enemies
    .map(
      (e) =>
        `${withArticle(e.name.toLowerCase())} ${e.experience + (e.id === 'elite' ? eliteBonus : 0)}`,
    )
    .join(', ')
  const steps =
    stepIncrease === 0
      ? `Level 2 needs ${firstStep} experience, and each next level needs ${firstStep} more`
      : `Level 2 needs ${firstStep} experience, level 3 needs ${firstStep + stepIncrease} more, level 4 needs ${firstStep + 2 * stepIncrease} more, and each next step grows by ${stepIncrease}`
  const raise = levelPerEliteSpawn
    ? 'The level rises by 1 each time an elite spawns.'
    : `Each defeated enemy gives experience to all players (${gains}). ${steps}.`
  const max = config.options.maxLevel
  const cap = max === null ? '' : ` The level stops at ${max}.`
  return `${raise} At each new level, every player gets 1 more action die.${cap}`
}

/**
 * How the Shop opens, what pays for its cards (each enemy's currency), and when a player can buy.
 *
 * @rule 6.8, 8.2, 11.2, Table 6
 */
export function shopText(config: GameConfig, content: Upgrades & Enemies): string {
  const shop = firstUpgrade('shop', content)
  const open = shop
    ? `Buy ${shop.name} on the base (a Build card and ${plural(shop.cost, 'material', 'materials')}) to open the Shop`
    : 'Open the Shop on the base'
  const when =
    config.rulings.shopTiming === 'prepare-only'
      ? 'while you stand on the base in the Prepare phase'
      : 'at any time you stand on the base'
  const gains = content.enemies.enemies
    .map((e) => `${withArticle(e.name.toLowerCase())} ${e.currency}`)
    .join(', ')
  return `${open} with ${plural(config.shop.offers, 'card offer', 'card offers')}. Pay for cards with currency, which you get for each enemy you defeat (${gains}); buy ${when}.`
}

/**
 * How the Training Ground opens, and when its Skill draft happens.
 *
 * @rule 10.8, 11.6, 11.7, Table 6
 */
export function trainingText(config: GameConfig, content: Upgrades): string {
  const training = firstUpgrade('training', content)
  const open = training
    ? `Buy ${training.name} on the base (a Build card and ${plural(training.cost, 'material', 'materials')}) to open the Training Ground`
    : 'Open the Training Ground on the base'
  const n = config.draft.everyNRounds
  const when = n === 1 ? 'every round' : `in rounds ${n}, ${2 * n}, ${3 * n} and so on`
  return `${open}: ${when}, each player looks at ${plural(config.draft.reveal, 'Skill', 'Skills')} and keeps 1 for free.`
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
  content: Enemies & Pick<Content, 'cards'>,
): string {
  if (model === 'exchange') {
    return 'In each exchange you roll, play cards, and fire Skills. Then each enemy next to you that targets you rolls its enemy dice at you.'
  }
  const dice = enemyDiceText(content)
  const holders = engageCardNames(config, content)
  return (
    `Play a card's Engage option${holders ? ` (on ${holders})` : ''} to roll your dice from where you stand, plus the enemy dice of each enemy next to you${dice ? ` (${dice})` : ''}. ` +
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

/**
 * The starter deck's cards that carry an Engage Combat option, by name: "Move and Gather".
 *
 * @rule 6.7, 7.8 (Spec v2)
 */
function engageCardNames(config: GameConfig, content: Pick<Content, 'cards'>): string {
  const preset = config.deck.presets.find((p) => p.id === config.deck.preset)
  const names = (preset?.cards ?? []).flatMap((entry) => {
    const card = content.cards.find((c) => c.id === entry.card)
    return card?.combat?.some((option) => option.kind === 'engage') ? [card.name] : []
  })
  const unique = [...new Set(names)]
  return unique.length > 1
    ? `${unique.slice(0, -1).join(', ')} and ${unique[unique.length - 1]}`
    : (unique[0] ?? '')
}

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
 * What each defense costs and does, and the base's starting health: the Prepare line on /.
 *
 * @rule 12.1, 12.3, Table 7, 11
 */
export function defenseText(config: GameConfig, content: Pick<Content, 'defenses'>): string {
  const lines = content.defenses.map((d) => {
    const effects = [
      d.blocksEnemies && 'enemies cannot enter its hex',
      d.attack &&
        `at the start of each Combat it deals ${d.attack.damage} damage to the nearest enemy within ${plural(d.attack.range, 'hex', 'hexes')}`,
    ].filter(Boolean)
    const effect = effects.length > 0 ? `; ${effects.join(', and ')}` : ''
    return `${/^[aeiou]/i.test(d.name) ? 'An' : 'A'} ${d.name} costs ${plural(d.cost, 'material', 'materials')} and has ${d.health} health${effect}.`
  })
  return `${lines.join(' ')} The base starts with ${config.base.startingHealth} health.`
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

/** A design-document tag with the comma or parentheses that join it to the rest of a rule tag. */
const DESIGN_TAG = /,?\s*\(?\b(?:Combat v3|core loop v2)\b\)?/gi

/** An open-questions citation in a config field's rules section: "(open questions 2, 39)". */
const QUESTION_REF = /\s*\(open questions? ([\d, ]+)\)/

/** A rule reading citation in a rules note, as `configRuleNote` writes it: "rule readings 63, 64". */
export const READING_REF = /(rule readings? [\d, ]*\d)/

/**
 * A /config field's rules note: the written-rules sections it reads, without design-document
 * tags; a field with no section left is "Not in the written rules". A cited open question is
 * named as a rule reading only while /decisions lists it; a decided one is left out.
 *
 * @param rule - a config field's rules section ("7.8, Combat v3", "9.7 (open questions 2, 39)").
 * @param listed - the rule readings /decisions lists (the open rows).
 * @rule 18.1
 */
export function configRuleNote(rule: string, listed: ReadonlySet<number> = new Set()): string {
  const cited = QUESTION_REF.exec(rule)?.[1]?.split(',').map(Number) ?? []
  const readings = cited.filter((n) => listed.has(n))
  const ref =
    readings.length > 0
      ? ` (${readings.length === 1 ? 'rule reading' : 'rule readings'} ${readings.join(', ')})`
      : ''
  const sections = rule
    .replace(QUESTION_REF, '')
    .replace(DESIGN_TAG, '')
    .trim()
    .replace(/^,\s*/, '')
  if (/^(?:\d|Table)/.test(sections)) return `Rules ${sections}${ref}.`
  return `Not in the written rules${sections ? ` ${sections}` : ''}${ref}.`
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

/** "Move, Gather and Build": a list joined with commas and a final "and". */
const andList = (items: readonly string[]) =>
  items.length > 1
    ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
    : (items[0] ?? '')

/**
 * What a Skill does when it fires, in one plain line: "2 damage to 1 enemy within 1 hex".
 *
 * @param e - the Skill's effect from content.
 * @rule Table 3, Table 9
 */
export function skillEffectText(e: SkillEffect): string {
  switch (e.kind) {
    case 'damage':
      return `${e.amount} damage to ${e.target === 'one' ? '1 enemy' : 'each enemy'} within ${plural(e.range, 'hex', 'hexes')}`
    case 'guard':
      return `Gain ${e.amount} guard`
    case 'heal':
      return `Heal ${e.amount}`
    case 'ignoreHit':
      return `Ignore ${plural(e.hits, 'enemy hit', 'enemy hits')} this exchange`
  }
}

/** "Strike (Sword: 2 damage to 1 enemy within 1 hex)": a Skill's faces and effect. */
const skillLine = (s: Content['skills'][number]) => {
  const effect = skillEffectText(s.effect)
  return `${s.name} (${andList(s.faces)}: ${effect.charAt(0).toLowerCase()}${effect.slice(1)})`
}

/**
 * What each player starts a run with: health, action dice, starter Skills, and the starter
 * deck with its hand size and what each card half is for.
 *
 * @rule 4.7-4.10, 6.1, 6.2, 7.7, Table 2, Table 3
 */
export function startText(config: GameConfig, content: Pick<Content, 'cards' | 'skills'>): string {
  const { maxHealth, startingDice, starterSkills } = config.player
  const defs = starterSkills.flatMap((id) => content.skills.filter((s) => s.id === id))
  const skills = defs.map(skillLine)
  const guards = defs.filter((s) => s.effect.kind === 'guard').map((s) => s.name)
  const cardsGuard = config.combat.model === 'exchange' ? " and your cards' bottom halves" : ''
  const guard =
    guards.length > 0
      ? ` Guard comes from the ${andList(guards)} ${guards.length === 1 ? 'Skill' : 'Skills'}${cardsGuard}; it takes enemy damage before your health.`
      : ''
  const preset = config.deck.presets.find((p) => p.id === config.deck.preset)
  const entries = preset?.cards ?? []
  const total = entries.reduce((sum, e) => sum + e.quantity, 0)
  const cards = andList(
    entries.map(
      (e) => `${e.quantity} ${content.cards.find((c) => c.id === e.card)?.name ?? e.card}`,
    ),
  )
  const hand = preset ? ` You draw ${preset.handSize} at a time.` : ''
  return (
    `Each player starts with ${maxHealth} health, ${plural(startingDice, 'action die', 'action dice')}, and ${plural(skills.length, 'Skill', 'Skills')} your dice can fire: ${andList(skills)}.${guard} ` +
    `Your deck holds ${plural(total, 'card', 'cards')}: ${cards}.${hand} ` +
    'Each card has two halves: the top half is for Prepare, the bottom half for Combat.'
  )
}

/**
 * How a round turns over, and how players share one screen.
 *
 * @rule 5.1, 5.3, 16.4, 16.8
 */
export function roundText(config: GameConfig): string {
  const round = 'Each round is Prepare, then Combat, and each phase goes once through your deck.'
  if (config.players.max === 1) return round
  const prepare =
    config.rulings.coopPrepareOrder === 'full-turn'
      ? 'each player plays a whole deck in turn'
      : 'you take turns one hand at a time'
  return `${round} When 2 or more play, you share one screen: in Prepare ${prepare}, and in Combat you take turns too.`
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
 * The base upgrades a run can buy: every one with `rulings.buildLevels: "any"`, else only the
 * tiers no higher than the highest Build card level in the content (Build I buys tier I).
 *
 * @rule Spec v2 11.4, 12.1 (ruling 25), 17, OPEN-QUESTIONS row 78
 */
export function upgradesReachable(
  config: GameConfig,
  content: Pick<Content, 'cards' | 'upgrades'>,
): Content['upgrades'] {
  if (config.rulings.buildLevels === 'any') return content.upgrades
  const top = Math.max(0, ...content.cards.map((c) => (c.top.kind === 'build' ? c.top.level : 0)))
  return content.upgrades.filter((u) => u.tier <= top)
}

/**
 * Why a milestone cannot be met under this config and content, or null when it can be:
 * "out of reach: Build cards can buy only Shop I and Training I", or "out of reach: the tile
 * deck holds 8 tiles" (the Base tile starts on the map and is never revealed).
 *
 * @rule 17, OPEN-QUESTIONS rows 4, 78
 */
export function milestoneOutOfReach(
  id: string,
  config: GameConfig,
  content: Pick<Content, 'cards' | 'upgrades' | 'tiles'>,
): string | null {
  if (id === 'reveal-tiles') {
    const deck = content.tiles.filter((t) => t.kind !== 'base').length
    if (deck >= config.milestones.tilesRevealed) return null
    return `out of reach: the tile deck holds ${deck} ${deck === 1 ? 'tile' : 'tiles'}`
  }
  if (id !== 'buy-upgrades') return null
  const names = upgradesReachable(config, content).map((u) => u.name)
  if (names.length >= config.milestones.upgradesBought) return null
  const list = names.length === 0 ? 'nothing' : `only ${names.join(' and ')}`
  return `out of reach: Build cards can buy ${list}`
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
  content: Pick<Content, 'skills' | 'enemies' | 'cards' | 'upgrades' | 'tiles'>,
): string | null {
  const [group, key] = path.split('.')
  if (path === 'miniatureLimit') return miniatureLimitText(config)
  if (path === 'tiles.revealMoveCost') return revealText(config)
  if (path === 'spawn.newTileDelay') return spawnText(config)
  if (group === 'experience') return levelText(config, content)
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
    const labels = (ids[key ?? ''] ?? []).map((id) => {
      const out = milestoneOutOfReach(id, config, content)
      return out ? `${milestoneLabel(id, m, content)} (${out})` : milestoneLabel(id, m, content)
    })
    return labels.length > 0 ? `${labels.join('; ')}.` : null
  }
  return null
}
