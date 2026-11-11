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
 * What happens to a player at 0 health: when and where they come back, with what health, and
 * what they lose. A player who finds no free base hex stays out 1 more round, as
 * `returnKnockedOut` plays it.
 *
 * @rule 14.2, 14.4, core loop v2 (knockout), OPEN-QUESTIONS row 55
 */
export function knockoutText(config: GameConfig): string {
  const k = config.knockout
  const health = `${share(k.returnHealthDivisor)} of their maximum health, rounded up`
  const items = [k.loseMaterials && 'materials', k.loseCurrency && 'currency'].filter(Boolean)
  const lost = items.length > 0 ? ` They lose all their ${items.join(' and ')}.` : ''
  return `A player at 0 health is knocked out and comes back at the start of the next round on a free base hex, with ${health}. If no base hex is free, they stay out 1 more round.${lost}`
}

/**
 * How the map grows: stepping off its edge.
 *
 * @rule core loop v2 (exploring), 10.1
 */
export function revealText(config: GameConfig): string {
  return `Step off the edge of the map to reveal a new tile; the step costs ${config.tiles.revealMoveCost} movement.`
}

/**
 * When a revealed tile's spawn nodes start getting enemies.
 *
 * @rule core loop v2 (spawning), OPEN-QUESTIONS row 66
 */
export function spawnText(config: GameConfig): string {
  const delay = config.spawn.newTileDelay
  const when =
    delay === 0
      ? 'at each Combat'
      : `at each Combat from ${plural(delay, 'round', 'rounds')} after it is revealed`
  return `Each new tile's spawn nodes get enemies ${when}.`
}

type Upgrades = Pick<Content, 'upgrades'>

/** The first upgrade of a base track: "Shop I" and its cost in materials. */
const firstUpgrade = (track: string, content: Upgrades) =>
  content.upgrades.find((u) => u.track === track && u.tier === 1)

/**
 * What a printed site does, for the site legend: "gets 1 grunt at each Combat", with the seat
 * scaling and the spawn ramp named when they are on (`spawnCount`).
 *
 * @rule Table 1, 6.7, 6.9, 7.3, 11.2, OPEN-QUESTIONS rows 59, 64, 66, 68, 70
 */
export function siteText(site: Site, config: GameConfig, content: Upgrades): string {
  if (site === 'base') {
    const shop = firstUpgrade('shop', content)
    const cards = shop
      ? `, and buy cards once ${shop.name} is built`
      : ', and buy cards once the Shop opens'
    return `the players defend it; stand on the Base tile and play a Build card to buy upgrades${cards}`
  }
  if (site === 'gathering-node')
    return config.rulings.gatherNeedsNode
      ? "a card's Gather option played here with no enemy on the node gets its materials once; then the node is spent for the rest of the run"
      : 'the first Gather option played here with no enemy on the node spends it'
  const s = config.spawn
  const enemy = site === 'spawn-node' ? 'grunt' : 'elite'
  const seats = s.perSeat ? ' for each 2 seats, rounded up,' : ''
  const ramp =
    s.rampEvery === null
      ? ''
      : s.rampEvery === 1
        ? ', and 1 more each round after round 1'
        : `, and 1 more for every ${s.rampEvery} rounds after round 1`
  const delay =
    s.newTileDelay > 0
      ? `, from ${plural(s.newTileDelay, 'round', 'rounds')} after its tile is revealed`
      : ''
  const range =
    s.nodeRange === null
      ? ''
      : `, if a player figure, a Barricade, a Tower or the base is within ${plural(s.nodeRange, 'hex', 'hexes')}`
  return `gets 1 ${enemy}${seats} at each Combat${ramp}${delay}${range}`
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
      : `Level 2 needs ${firstStep} experience, level 3 needs ${firstStep + stepIncrease} more, level 4 needs ${firstStep + 2 * stepIncrease} more and each next step grows by ${stepIncrease}`
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
    ? `Stand on the Base tile and buy ${shop.name} (a Build card and ${plural(shop.cost, 'material', 'materials')}) to open the Shop`
    : 'Open the Shop from the Base tile'
  const when =
    config.rulings.shopTiming === 'prepare-only'
      ? 'while you stand on the Base tile in the Prepare phase'
      : 'at any time you stand on the Base tile'
  const gains = content.enemies.enemies
    .map((e) => `${withArticle(e.name.toLowerCase())} ${e.currency}`)
    .join(', ')
  return `${open} with ${plural(config.shop.offers, 'card offer', 'card offers')}. Pay for cards with currency, which you get for each enemy you defeat (${gains}); buy ${when}.`
}

/**
 * How the Training Ground opens, when its Skill draft happens, and where the unkept Skills go.
 *
 * @rule 10.8, 11.6, 11.7, Table 6
 */
export function trainingText(config: GameConfig, content: Upgrades): string {
  const training = firstUpgrade('training', content)
  const open = training
    ? `Stand on the Base tile and buy ${training.name} (a Build card and ${plural(training.cost, 'material', 'materials')}) to open the Training Ground`
    : 'Open the Training Ground from the Base tile'
  const n = config.draft.everyNRounds
  const when = n === 1 ? 'every round' : `in rounds ${n}, ${2 * n}, ${3 * n} and so on`
  const shown =
    config.draft.unpicked === 'pool'
      ? `${plural(config.draft.reveal, 'new Skill', 'new Skills')} plus their own pool`
      : plural(config.draft.reveal, 'Skill', 'Skills')
  return `${open}: ${when}, each player looks at ${shown} and keeps 1 for free. ${draftPoolText(config)}`
}

/**
 * A Gather card's top half: where it gathers, what it spends, and that an enemy on the hex blocks
 * it (6.9).
 *
 * @param amount - the card's materials.
 * @rule 6.7, 6.9, Table 1, OPEN-QUESTIONS rows 20, 59, 67
 */
export function gatherText(amount: number, config: GameConfig): string {
  const off = config.gather.offNodeAmount
  if (!config.rulings.gatherNeedsNode)
    return `Gather ${amount} on any hex with no enemy on it (an unspent gathering node is spent)`
  const elsewhere = off > 0 ? `; ${off} on any other hex with no enemy on it` : ''
  return `Gather ${amount} on an unspent gathering node with no enemy on it (the node is spent)${elsewhere}`
}

/**
 * Where materials come from, for the Materials line on /: any card's Gather option (Shop cards
 * gather too), the starter deck's Gather card and its amount as the example, where a Gather
 * option works (never with an enemy on the hex, 6.9), and that a node gives its materials once
 * and is then spent for the rest of the run.
 *
 * @rule 6.7, 6.9, Table 1, OPEN-QUESTIONS rows 20, 59, 67
 */
export function materialsText(config: GameConfig, content: Pick<Content, 'cards'>): string {
  const preset = config.deck.presets.find((p) => p.id === config.deck.preset)
  const starters = [
    ...new Map(
      (preset?.cards ?? []).flatMap((entry) => {
        const card = content.cards.find((c) => c.id === entry.card)
        return card?.top.kind === 'gather'
          ? [
              [
                `${card.name}|${card.top.amount}`,
                { name: card.name, amount: card.top.amount },
              ] as const,
            ]
          : []
      }),
    ).values(),
  ]
  const [only] = starters
  const example =
    starters.length === 1 && only !== undefined
      ? ` (${plural(only.amount, 'material', 'materials')} for the starter ${only.name} card)`
      : ''
  if (!config.rulings.gatherNeedsNode)
    return `Play a card's Gather option on any hex with no enemy on it to get its materials${example}; a gathering node it is played on gives materials once.`
  const off = config.gather.offNodeAmount
  const elsewhere =
    off > 0
      ? ` On any other hex with no enemy on it, a Gather option gets ${plural(off, 'material', 'materials')}.`
      : ''
  return `Play a card's Gather option on a gathering node with no enemy on it to get its materials${example}; each node gives its materials once, then it is spent for the rest of the run.${elsewhere}`
}

/** "a grunt rolls 1, an elite 2": each enemy's enemy dice, from the enemy content. */
const enemyDiceText = (content: Enemies) =>
  content.enemies.enemies
    .filter((e) => e.dice > 0)
    .map((e, i) => `${withArticle(e.name.toLowerCase())}${i === 0 ? ' rolls' : ''} ${e.dice}`)
    .join(', ')

/**
 * How a Combat plays under a Combat model, and when it ends, with each enemy's enemy dice. The
 * Engage line names the enemy die faces and their damage before it says when the dice hit.
 *
 * @rule 7, 7.8, 9.5, 9.6, Table 4, Table 5 (Spec v2)
 */
export function combatText(
  config: GameConfig,
  model: GameConfig['combat']['model'],
  content: Enemies & Pick<Content, 'cards'>,
): string {
  if (model === 'exchange') {
    return 'In each exchange you roll, play cards and fire Skills. Then each enemy next to you that targets you rolls its enemy dice at you.'
  }
  const dice = enemyDiceText(content)
  const holders = engageCardNames(config, content)
  return (
    `Play a card's Engage option${holders ? ` (on ${holders})` : ''} to roll your dice from where you stand, plus the enemy dice of each enemy next to you${dice ? ` (${dice})` : ''}. ` +
    'Put your dice on your Skills one at a time. ' +
    `${enemyDieText(config)} ${enemyHitText(config)} ` +
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
  return `When you choose End engagement or no dice are left, the enemy dice hit you at once, ${defeated}. Your guard takes the damage first, then your health.`
}

/** Each enemy die face as the die line names it. */
const FACE_NAME = { hit: 'Hit', miss: 'Miss', special: 'Special' } as const

/**
 * The faces of an enemy die and the damage of each: "An enemy die has 2 Hit faces, 3 Miss faces
 * and 1 Special face. A Hit deals 1 damage, a Special 2, a Miss none."
 *
 * @rule Spec v2 Table 4
 */
export function enemyDieText(config: GameConfig): string {
  const { enemyDie, hitDamage, specialDamage } = config.combat.engage
  const faces = (['hit', 'miss', 'special'] as const)
    .map((face) => [face, enemyDie.filter((f) => f === face).length] as const)
    .filter(([, n]) => n > 0)
    .map(([face, n]) => plural(n, `${FACE_NAME[face]} face`, `${FACE_NAME[face]} faces`))
  const list =
    faces.length > 1 ? `${faces.slice(0, -1).join(', ')} and ${faces[faces.length - 1]}` : faces[0]
  return `An enemy die has ${list}. A Hit deals ${hitDamage} damage, a Special ${specialDamage}, a Miss none.`
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
  return `When Combat ends, each enemy next to a Barricade, a Tower or the base hits one of them (a Barricade first, then a Tower, then the base), even when it is next to a player too: ${damage}.`
}

/**
 * What each defense costs and does, who gets the currency when an attacking defense defeats
 * an enemy, and the base's starting health: the Defenses line on /.
 *
 * @rule 8.2, 12.1, 12.3, Table 7, 11, OPEN-QUESTIONS rows 40, 53
 */
export function defenseText(config: GameConfig, content: Pick<Content, 'defenses'>): string {
  const lines = content.defenses.map((d) => {
    const effects = [
      d.blocksEnemies && 'enemies cannot enter its hex',
      d.attack &&
        `at the start of each Combat it deals ${d.attack.damage} damage to the nearest enemy within ${plural(d.attack.range, 'hex', 'hexes')}`,
    ].filter(Boolean)
    const effect = effects.length > 0 ? `; ${effects.join(', and ')}` : ''
    const pays = d.attack
      ? ` When ${withArticle(d.name)} defeats an enemy, the player who built it gets the currency.`
      : ''
    return `${/^[aeiou]/i.test(d.name) ? 'An' : 'A'} ${d.name} costs ${plural(d.cost, 'material', 'materials')} and has ${d.health} health${effect}.${pays}`
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
  return `Play each card: Engage (roll to attack from where you stand)${discard ? ', another option or discard it' : ' or another option'}`
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
 * What a step next to an enemy costs, and that no step enters an enemy's hex: "You cannot move
 * into a hex that has an enemy, and a step onto a hex next to an enemy costs 1, the same as each
 * step." Above 1 it names the cost and the cards that ignore it (Blink).
 *
 * @rule 6.9 (Spec v2), Table 8 (Blink), OPEN-QUESTIONS row 76
 */
export function moveCostText(config: GameConfig, content: Pick<Content, 'cards'>): string {
  const cost = config.combat.moveCostNextToEnemy
  const head =
    'You cannot move into a hex that has an enemy, and a step onto a hex next to an enemy costs'
  if (cost === 1) return `${head} 1, the same as each step.`
  const ignore = content.cards
    .filter((c) => c.top.kind === 'move' && c.top.ignoreEnemyCost)
    .map((c) => c.name)
  const skip =
    ignore.length > 0
      ? `; ${ignore.join(' and ')} ${ignore.length === 1 ? 'ignores' : 'ignore'} that cost`
      : ''
  return `${head} ${cost} movement instead of 1${skip}.`
}

/**
 * How many times a player rolls dice in one engagement: "In an engagement you roll all your
 * dice, then keep the dice you want and roll the others again, up to 3 rolls in all. The enemy
 * dice roll only once, and a card's Reroll does not count as a roll."
 *
 * @rule 7.8 steps 2-3, 7.8 step 6 (Spec v2)
 */
export function rollsText(config: GameConfig): string {
  const n = config.combat.maxRolls
  const own =
    n === 1
      ? 'In an engagement you roll all your dice once and do not roll them again.'
      : `In an engagement you roll all your dice, then keep the dice you want and roll the others again, up to ${n} rolls in all.`
  return `${own} The enemy dice roll only once, and a card's Reroll does not count as a roll.`
}

/**
 * How far an enemy moves at each Combat: "At each Combat, before the spawn nodes spawn, each
 * enemy, oldest first, moves up to 2 hexes toward its target and stops next to it."
 *
 * @rule 7.5
 */
export function enemyMoveText(config: GameConfig): string {
  return `At each Combat, before the spawn nodes spawn, each enemy, oldest first, moves up to ${plural(config.combat.enemyMoveHexes, 'hex', 'hexes')} toward its target and stops next to it.`
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
 * The starter-return dialog's line: a bought card sends a starter card away. In co-op the dialog
 * passes the seat name ("Player 2"), so the line names the player the dialog names.
 *
 * @rule 18.1 (bought cards replace a starter)
 */
export function returnStarterText(seat?: string): string {
  return seat
    ? `${seat} bought a card, so a starter card leaves ${seat}'s deck for good.`
    : 'You bought a card, so a starter card leaves your deck for good.'
}

/**
 * What a bought card does to the deck, and the smallest deck: "A card you buy goes to your discard
 * pile and adds to your deck; no starter card leaves it." In replace-starter mode a starter card
 * from the deck or discard pile then leaves the game, while the player has more than
 * `deck.minimumSize` cards, as `returnableStarters` plays it.
 *
 * @rule 13.1, 18.1, core loop v2 (minimum deck), OPEN-QUESTIONS row 44
 */
export function boughtCardsText(config: GameConfig): string {
  const head = 'A card you buy goes to your discard pile'
  if (config.options.boughtCards === 'add')
    return `${head} and adds to your deck; no starter card leaves it.`
  return `${head}; then, if you have more than ${plural(config.deck.minimumSize, 'card', 'cards')}, you return a starter card from your deck or discard pile and it leaves the game.`
}

/**
 * How many player figures share a hex: "A hex holds at most 1 player figure, on the base too:
 * you cannot move into a hex where another figure stands, and a knocked-out player who finds no
 * free base hex stays out until the next round start." Above 1 it names the limit, as
 * `blockedByFigure` and `returnKnockedOut` play it.
 *
 * @rule 3.8, 4.6, 14.4, OPEN-QUESTIONS row 16
 */
export function figuresPerHexText(config: GameConfig): string {
  const limit = config.rulings.figuresPerHex
  const tail =
    'and a knocked-out player who finds no free base hex stays out until the next round start.'
  if (limit === 1)
    return `A hex holds at most 1 player figure, on the base too: you cannot move into a hex where another figure stands, ${tail}`
  return `A hex holds at most ${limit} player figures, on the base too: you cannot move into a hex where ${limit} other figures stand, ${tail}`
}

/**
 * What an enemy does when its path is blocked: "Enemies, player figures, Barricades, Towers,
 * lakes and mountains block an enemy. If every path to its target is blocked, the enemy moves
 * toward the next nearest target; if no path reaches any target, it does not move." With
 * `"wait"` it waits where it is, as `chooseRoute` and `pathNextTo` play it.
 *
 * @rule 9.7, OPEN-QUESTIONS rows 2, 39
 */
export function blockedPathText(config: GameConfig): string {
  const head =
    'Enemies, player figures, Barricades, Towers, lakes and mountains block an enemy. If every path to its target is blocked,'
  return config.rulings.blockedPathRule === 'wait'
    ? `${head} the enemy waits where it is.`
    : `${head} the enemy moves toward the next nearest target; if no path reaches any target, it does not move.`
}

/**
 * When a tile is revealed without a step: off (the default), "A tile is revealed only when a
 * player steps off the edge of the map."; with `clock.forcedRevealEvery` N, "At round end, if no
 * tile was revealed in the last N rounds and the tile deck is not empty, the top tile is revealed
 * in the open slot nearest the base.", as `forcedRevealDue` and `forcedReveal` play it.
 *
 * @rule 6.7, OPEN-QUESTIONS row 63
 */
export function forcedRevealText(config: GameConfig): string {
  const every = config.clock.forcedRevealEvery
  return every === null
    ? 'A tile is revealed only when a player steps off the edge of the map.'
    : `At round end, if no tile was revealed in the last ${plural(every, 'round', 'rounds')} and the tile deck is not empty, the top tile is revealed in the open slot nearest the base.`
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
 * tags, as "Rule 7.8." for one section and "Rules 4.10, Table 3." for more than one; a field
 * with no section left is "Not in the written rules". A cited open question is
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
  if (/^(?:\d|Table)/.test(sections)) {
    return `${sections.includes(',') ? 'Rules' : 'Rule'} ${sections}${ref}.`
  }
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
export function draftFullText(config: GameConfig, kept: string, seat?: string): string {
  return `${seat ? `${seat}'s` : 'Your'} ${plural(config.player.draftSlots, 'draft slot is', 'draft slots are')} full: ${kept} replaces a Skill`
}

/**
 * The draft dialog's help line when a kept Skill must replace a drafted Skill. In co-op the
 * dialog passes the seat name, so the line names the player the dialog names.
 *
 * @rule 11.9
 */
export function replaceSkillText(seat?: string): string {
  return `The Skill ${seat ? `${seat} replaces` : 'you replace'} goes to the bottom of its supply.`
}

/**
 * The /config Draft Skill slots rule: what a draft does once every draft slot holds a Skill.
 * Only drafted Skills are replaced, never starter Skills; with 0 slots there is no draft.
 *
 * @rule 11.9, OPEN-QUESTIONS row 46
 */
export function draftSlotsText(config: GameConfig): string {
  const n = config.player.draftSlots
  if (n === 0) return 'With 0 draft slots, no player drafts a Skill.'
  const full = `With ${n === 1 ? 'the 1 draft slot' : `all ${n} draft slots`} full`
  return config.rulings.fullBoardDraft === 'skip'
    ? `${full}, a player has no Skill draft.`
    : `${full}, a newly kept Skill replaces one of your drafted Skills, which goes to the bottom of its supply.`
}

/**
 * Where the Skills a player does not keep go. The co-op draft dialog passes the seat name
 * ("Player 2"), so the line names the player the dialog names; every other reader speaks to "you".
 *
 * @rule 11.8 (designer 2026-10-09)
 */
export function draftPoolText(config: GameConfig, seat?: string): string {
  const who = seat ? `${seat} does` : 'you do'
  return config.draft.unpicked === 'pool'
    ? `The Skills ${who} not keep go to ${seat ? `${seat}'s` : 'your'} pool. Later drafts offer them again.`
    : `The Skills ${who} not keep go back to the supply.`
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
 * An "ignore a hit" lasts for the current engagement, or the current exchange under Exchanges.
 *
 * @param e - the Skill's effect from content.
 * @param model - the run's Combat model.
 * @rule Table 3, Table 9, Combat v3
 */
export function skillEffectText(e: SkillEffect, model: GameConfig['combat']['model']): string {
  switch (e.kind) {
    case 'damage':
      return `${e.amount} damage to ${e.target === 'one' ? '1 enemy' : 'each enemy'} within ${plural(e.range, 'hex', 'hexes')}`
    case 'guard':
      return `Gain ${e.amount} guard`
    case 'heal':
      return `Heal ${e.amount} health`
    case 'ignoreHit':
      return `Ignore ${plural(e.hits, 'enemy hit', 'enemy hits')} this ${model === 'exchange' ? 'exchange' : 'engagement'}`
  }
}

/** "Strike (Sword: 2 damage to 1 enemy within 1 hex)": a Skill's faces and effect. */
const skillLine = (s: Content['skills'][number], model: GameConfig['combat']['model']) => {
  const effect = skillEffectText(s.effect, model)
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
  const skills = defs.map((s) => skillLine(s, config.combat.model))
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
    `Each player starts with ${maxHealth} health, ${plural(startingDice, 'action die', 'action dice')} and ${plural(skills.length, 'Skill', 'Skills')} your dice can fire: ${andList(skills)}.${guard} ` +
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
 * Which base upgrades the Build cards can buy, when some are out of reach: "Build cards can buy
 * only Shop I and Training I", or "Build cards can buy nothing". Null when every upgrade is in
 * reach. The /play base panel shows it; the "Buy N base upgrades" milestone uses the same words.
 *
 * @rule Spec v2 11.4, 12.1 (ruling 25), 17, OPEN-QUESTIONS row 78
 */
export function upgradesReachNote(
  config: GameConfig,
  content: Pick<Content, 'cards' | 'upgrades'>,
): string | null {
  const names = upgradesReachable(config, content).map((u) => u.name)
  if (names.length === content.upgrades.length) return null
  const list = names.length === 0 ? 'nothing' : `only ${names.join(' and ')}`
  return `Build cards can buy ${list}`
}

/**
 * What a Build card's level reaches, for the /config Build levels field. Levelled (the default):
 * "A Build card buys a base upgrade or builds a defense only up to its own level: Build I buys
 * tier I. Build cards can buy only Shop I and Training I." (the second sentence from
 * `upgradesReachNote`, dropped when every upgrade is in reach). Any tier: "A Build card buys the
 * next tier of an upgrade track and builds any defense, whatever its level.", as `buildReaches`
 * plays it.
 *
 * @rule Spec v2 11.4, 12.1 (ruling 25), OPEN-QUESTIONS row 78
 */
export function buildLevelsText(
  config: GameConfig,
  content: Pick<Content, 'cards' | 'upgrades'>,
): string {
  if (config.rulings.buildLevels === 'any')
    return 'A Build card buys the next tier of an upgrade track and builds any defense, whatever its level.'
  const note = upgradesReachNote(config, content)
  const head =
    'A Build card buys a base upgrade or builds a defense only up to its own level: Build I buys tier I.'
  return note ? `${head} ${note}.` : head
}

/**
 * Why a milestone cannot be met under this config and content, or null when it can be:
 * "out of reach: Build cards can buy only Shop I and Training I", or "out of reach: the tile
 * deck holds 8 tiles" (the Base tile starts on the map and is never revealed), or "out of
 * reach: the level stops at 4" (a maximum level below the milestone's), or "out of reach: a level 3
 * Skill needs Training III, and Build cards can buy only Training I" (Skills are drafted from the
 * open Training level; starter Skills are always held).
 *
 * @rule 11.4, 11.8, 17, 18.1, OPEN-QUESTIONS rows 4, 78
 */
export function milestoneOutOfReach(
  id: string,
  config: GameConfig,
  content: Pick<Content, 'cards' | 'upgrades' | 'tiles' | 'skills'>,
): string | null {
  if (id.startsWith('fire-')) {
    const skillId = id.slice('fire-'.length)
    const skill = content.skills.find((s) => s.id === skillId)
    if (!skill || config.player.starterSkills.includes(skillId)) return null
    const training = upgradesReachable(config, content).filter((u) => u.track === 'training')
    if (training.some((u) => u.opensLevel >= skill.level)) return null
    const needs = content.upgrades.find(
      (u) => u.track === 'training' && u.opensLevel >= skill.level,
    )
    const names = training.map((u) => u.name)
    const list = names.length === 0 ? 'no Training upgrade' : `only ${names.join(' and ')}`
    const what = `a level ${skill.level} Skill`
    return needs
      ? `out of reach: ${what} needs ${needs.name}, and Build cards can buy ${list}`
      : `out of reach: no Training upgrade opens ${what}`
  }
  if (id === 'reveal-tiles') {
    const deck = content.tiles.filter((t) => t.kind !== 'base').length
    if (deck >= config.milestones.tilesRevealed) return null
    return `out of reach: the tile deck holds ${deck} ${deck === 1 ? 'tile' : 'tiles'}`
  }
  if (id === 'reach-level') {
    const max = config.options.maxLevel
    if (max === null || max >= config.milestones.level) return null
    return `out of reach: the level stops at ${max}`
  }
  if (id !== 'buy-upgrades') return null
  const names = upgradesReachable(config, content).map((u) => u.name)
  if (names.length >= config.milestones.upgradesBought) return null
  const list = names.length === 0 ? 'nothing' : `only ${names.join(' and ')}`
  return `out of reach: Build cards can buy ${list}`
}

/**
 * The base's starting health and what each base upgrade adds: the /config Base fields' line.
 *
 * @rule 8.2, 11.3
 */
export function baseText(config: GameConfig): string {
  const { startingHealth, healthPerUpgrade } = config.base
  return `The base starts with ${startingHealth} health. Each base upgrade adds ${healthPerUpgrade} to its maximum health and to its health.`
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
  content: Pick<Content, 'skills' | 'enemies' | 'cards' | 'upgrades' | 'tiles' | 'defenses'>,
): string | null {
  const [group, key] = path.split('.')
  if (path === 'miniatureLimit') return miniatureLimitText(config)
  if (
    path === 'player.maxHealth' ||
    path === 'player.startingDice' ||
    path === 'player.starterSkills' ||
    path === 'deck.preset'
  )
    return startText(config, content)
  if (group === 'base') return baseText(config)
  if (path === 'tiles.revealMoveCost') return revealText(config)
  if (path === 'spawn.newTileDelay') return spawnText(config)
  if (group === 'experience' || path === 'options.maxLevel') return levelText(config, content)
  if (path === 'spawn.rampEvery' || path === 'spawn.perSeat' || path === 'spawn.nodeRange')
    return `A spawn node ${siteText('spawn-node', config, content)}; an elite spawn node ${siteText('elite-spawn-node', config, content)}.`
  if (group === 'knockout') return knockoutText(config)
  if (path === 'gather.offNodeAmount' || path === 'rulings.gatherNeedsNode')
    return `${gatherText(2, config)}.`
  if (path === 'player.draftSlots' || path === 'rulings.fullBoardDraft')
    return draftSlotsText(config)
  if (path === 'draft.everyNRounds' || path === 'draft.reveal') return trainingText(config, content)
  if (path === 'shop.offers' || path === 'rulings.shopTiming') return shopText(config, content)
  if (path === 'rulings.coopPrepareOrder') return roundText(config)
  if (path === 'draft.unpicked') return draftPoolText(config)
  if (path === 'combat.model')
    return `${combatText(config, config.combat.model, content)} ${siegeText(content)}`
  if (
    path === 'combat.engage.enemyDie' ||
    path === 'combat.engage.hitDamage' ||
    path === 'combat.engage.specialDamage'
  )
    return `${enemyDieText(config)} ${enemyHitText(config)}`
  if (path === 'combat.engage.defeatedDice') return enemyHitText(config)
  if (path === 'rulings.mandatoryPlays') return combatEndText(config)
  if (path === 'rulings.targetTieBreak' || path === 'rulings.playerPullDistance')
    return targetOrderText(config)
  if (path === 'combat.maxRolls') return rollsText(config)
  if (path === 'deck.minimumSize' || path === 'options.boughtCards') return boughtCardsText(config)
  if (path === 'combat.moveCostNextToEnemy') return moveCostText(config, content)
  if (path === 'rulings.figuresPerHex') return figuresPerHexText(config)
  if (path === 'rulings.blockedPathRule') return blockedPathText(config)
  if (path === 'clock.forcedRevealEvery') return forcedRevealText(config)
  if (path === 'rulings.buildLevels') return buildLevelsText(config, content)
  if (path === 'combat.enemyMoveHexes') return `${enemyMoveText(config)} ${targetOrderText(config)}`
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
