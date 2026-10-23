import { milestoneLabel } from '@survival/content'
import { hexKey, type GameEvent, type GameState } from '@survival/engine'
import { defenseNameFromBase, enemyNameFromBase } from '../names/pieceNames.ts'
import { hexLabel } from '../tiles/TileView.tsx'

/** What the log needs to name ids: the content, plus the pieces in play (usually the state). */
type Names = Readonly<{
  content: GameState['content']
  players?: GameState['players']
  enemies?: GameState['enemies']
  defenses?: GameState['defenses']
  /** The log: a defeated enemy's kind is still in its spawn event. */
  log?: GameState['log']
  /** The map, to name a hex by its terrain and site. */
  map?: GameState['map']
  /** The config, to give milestones their numbers. */
  config?: GameState['config']
}>

const hex = (h: { q: number; r: number }) => `(${h.q},${h.r})`
/** "Plains, Spawn node (2,0)": a hex by name, with its coordinate; bare coordinates off the map. */
function place(n: Names, h: { q: number; r: number }): string {
  const found = n.map?.hexes[hexKey(h)]
  return found ? `${hexLabel(found)} ${hex(h)}` : hex(h)
}
/** "a grunt", "an elite". */
const article = (word: string) => `${/^[aeiou]/i.test(word) ? 'an' : 'a'} ${word}`
const skillName = (n: Names, id: string) => n.content.skills.find((s) => s.id === id)?.name ?? id
const cardName = (n: Names, id: string) => n.content.cards.find((c) => c.id === id)?.name ?? id
const tileName = (n: Names, id: string) => n.content.tiles.find((t) => t.id === id)?.name ?? id
const upgradeName = (n: Names, id: string) =>
  n.content.upgrades.find((u) => u.id === id)?.name ?? id

/** A card instance (`c3`) by its card name; a returned starter is gone, so it stays generic. */
function cardLabel(n: Names, instance: string): string {
  for (const p of n.players ?? []) {
    const found = [...p.hand, ...p.deck, ...p.discard, ...p.inPlay].find((c) => c.id === instance)
    if (found) return cardName(n, found.def)
  }
  return n.content.cards.some((c) => c.id === instance) ? cardName(n, instance) : 'a card'
}

/** An enemy by kind and place from the base center ("grunt 2 hexes north of the base center"). */
function enemyLabel(n: Names, id: string, kind?: string): string {
  const name = enemyNameFromBase(n, id)
  return name === 'enemy' && kind ? kind : name
}

/** A defense by kind and place from the base center ("Tower 1 hex west of the base center"). */
function defenseLabel(n: Names, id: string): string {
  return defenseNameFromBase(n, id)
}

const solo = (n: Names) => (n.players?.length ?? 1) === 1
/** The subject: "You" in a solo run, "Player 2" in co-op. */
const seat = (n: Names, id: string) =>
  solo(n) ? 'You' : `Player ${(n.players?.findIndex((p) => p.id === id) ?? 0) + 1}`
const upper = (text: string) => `${text[0]?.toUpperCase() ?? ''}${text.slice(1)}`

/**
 * One plain-language line for an event (ASD-STE100 style: short and literal). The rule id is
 * shown beside it by the log, not here. Labels only: the UI never decides a rule.
 *
 * @param event - an engine event.
 * @param names - the content, for display names.
 */
export function describeEvent(event: GameEvent, names: Names): string {
  const who = (id: string) => seat(names, id)
  const whom = (id: string) => (solo(names) ? 'you' : seat(names, id))
  /** Verb agreement: "You gather" but "Player 2 gathers". */
  const s = (verb: string) => (solo(names) ? verb : `${verb}s`)
  /** What an enemy heads for: the base, a player, or a defense. */
  const target = (id: string) =>
    id === 'base'
      ? 'the base'
      : names.players?.some((p) => p.id === id)
        ? whom(id)
        : defenseLabel(names, id)
  switch (event.type) {
    case 'gameCreated':
      return `New run, seed ${event.seed}.`
    case 'phaseStarted':
      return `${event.phase[0]?.toUpperCase()}${event.phase.slice(1)} phase starts (round ${event.round}).`
    case 'deckShuffled':
      return `Deck shuffled (${event.cards} cards).`
    case 'deckTurned':
      return `Deck turned: ${event.orientation === 'top' ? 'top halves' : 'bottom halves'} up.`
    case 'cardsDrawn':
      return `${who(event.player)} drew ${event.cards.length} card${event.cards.length === 1 ? '' : 's'}.`
    case 'cardPlayed':
      return `${who(event.player)} played ${cardLabel(names, event.card)} (${event.half} half).`
    case 'cardDiscarded':
      return `${who(event.player)} discarded ${cardLabel(names, event.card)}${event.unplayed ? ' without its effect' : ''}.`
    case 'effectDeferred':
      return `Not yet in the engine: ${event.effect}.`
    case 'healed':
      return `${who(event.player)} healed ${event.amount} health (health ${event.health}).`
    case 'guardGained':
      return `${who(event.player)} gained ${event.amount} guard (guard ${event.guard}).`
    case 'damageBonus':
      return `+${event.amount} damage for the next damage Skill.`
    case 'extraDice':
      return `Extra dice rolled: ${event.faces.join(', ')}.`
    case 'diceRolled':
      return `Roll ${event.roll}: ${event.faces.join(', ')}.`
    case 'dieRerolled':
      return `Die ${event.die + 1} rerolled: ${event.face}.`
    case 'dieKept':
      return `Die ${event.die + 1} ${event.kept ? 'kept' : 'released'}.`
    case 'dieAssigned':
      return `Die ${event.die + 1} on ${skillName(names, event.skill)} as ${event.asFace}.`
    case 'dieUnassigned':
      return `Die ${event.die + 1} taken back.`
    case 'skillFired':
      return `${skillName(names, event.skill)} fires.`
    case 'enemyDamaged':
      return `${upper(enemyLabel(names, event.enemy))} takes ${event.amount} damage (health ${event.health}).`
    case 'enemyDefeated':
      return `${upper(enemyLabel(names, event.enemy, event.kind))} is defeated.`
    case 'enemyAttacked':
      return `${upper(enemyLabel(names, event.enemy))} attacks ${whom(event.player)} for ${event.damage}.`
    case 'engaged':
      return `${who(event.player)} ${s('engage')}. ${event.enemyDice.length === 0 ? `No enemy is next to ${whom(event.player)}: no enemy dice.` : `Enemy dice: ${event.enemyDice.map((d) => `${enemyLabel(names, d.enemy)} ${d.face}`).join(', ')}.`}`
    case 'repaired':
      return `${who(event.player)} ${s('repair')} ${event.structure === 'base' ? 'the base' : defenseLabel(names, event.structure)} for ${event.amount} (health ${event.health}).`
    case 'enemyDieCancelled':
      return `A die of ${enemyLabel(names, event.enemy)} is cancelled: ${enemyLabel(names, event.enemy)} was defeated.`
    case 'hitIgnored':
      return `${who(event.player)} ${s('ignore')} the hit from ${enemyLabel(names, event.enemy)}.`
    case 'playerDamaged': {
      // Name only what was lost: "You lose 3 health", not "You lose 0 guard and 3 health".
      const lost = [
        event.toGuard > 0 && `${event.toGuard} guard`,
        event.toHealth > 0 && `${event.toHealth} health`,
      ].filter(Boolean)
      return lost.length === 0
        ? `${who(event.player)} ${s('lose')} nothing (health ${event.health}).`
        : `${who(event.player)} ${s('lose')} ${lost.join(' and ')} (health ${event.health}).`
    }
    case 'exchangeEnded':
      // The engine tags an engagement's end with the engagement rule (Combat v3), an exchange's with 7.8.
      return event.rule === 'Combat v3' ? 'The engagement ends.' : 'The exchange ends.'
    case 'stepDeferred':
      return `Not yet in the engine: ${event.step}.`
    case 'tilePlaced':
      return `${tileName(names, event.tile)} placed at ${hex(event.center)}.`
    case 'enemySpawned':
      return `${upper(article(event.kind))} appears on ${place(names, event.hex)}${event.spilled ? ' (node taken: nearest empty hex)' : ''}.`
    case 'moved':
      return `${who(event.player)} moved to ${place(names, event.to)} (cost ${event.cost}, ${event.hexesLeft} left).`
    case 'gathered':
      return event.amount === 0
        ? `${who(event.player)} gathered nothing: gather on an unspent gathering node with no enemy on it.`
        : `${who(event.player)} gathered ${event.amount} ${event.amount === 1 ? 'material' : 'materials'} (now ${event.materials})${event.spent ? '; the node is spent' : ''}.`
    case 'defenseBuilt':
      return `${event.kind[0]?.toUpperCase()}${event.kind.slice(1)} built on ${place(names, event.hex)} for ${event.cost} materials.`
    case 'defenseDamaged':
      return `${defenseLabel(names, event.defense)} takes ${event.amount} damage (health ${event.health}).`
    case 'defenseRemoved':
      return `${defenseLabel(names, event.defense)} is destroyed.`
    case 'roundAdvanced':
      return `Round ${event.round}.`
    case 'enemyMoved':
      return `${upper(enemyLabel(names, event.enemy))} moves to ${place(names, event.to)}${event.target ? ` toward ${target(event.target)}` : ''}.`
    case 'towerAttacked':
      return `${defenseLabel(names, event.tower)} hits ${enemyLabel(names, event.enemy)} for ${event.damage}.`
    case 'structureAttacked':
      return `${upper(enemyLabel(names, event.enemy))} attacks ${event.structure === 'base' ? 'the base' : defenseLabel(names, event.structure)} for ${event.damage}.`
    case 'baseDamaged':
      return `The base takes ${event.amount} damage (health ${event.health}).`
    case 'eliteReplaced':
      return `Miniature limit: the ${enemyLabel(names, event.elite).replace(/^elite /, 'grunt ')} becomes an elite.`
    case 'tileRevealed':
      return `Tile revealed: ${tileName(names, event.tile)}.`
    case 'figurePlaced':
      return `${who(event.player)} ${solo(names) ? 'start' : 'starts'} on ${place(names, event.hex)}.`
    case 'revealStepBlocked':
      return `${who(event.player)} cannot enter ${place(names, event.hex)}: it is lake or mountain (${event.hexesLeft} left).`
    case 'experienceGained':
      return `+${event.amount} experience (${event.experience}).`
    case 'levelReached':
      return `Level ${event.level}! ${solo(names) ? 'You get' : 'Every player gets'} 1 action die.`
    case 'diceGained':
      return `${who(event.player)} now ${solo(names) ? 'have' : 'has'} ${event.dice} action dice.`
    case 'currencyGained':
      return `+${event.amount} currency (${event.currency}).`
    case 'upgradeBought':
      return `${upgradeName(names, event.upgrade)} bought for ${event.cost} materials (base health ${event.baseHealth}).`
    case 'offerAdded':
      return `Shop offer: ${cardName(names, event.card)} (level ${event.level}).`
    case 'cardBought':
      return `${who(event.player)} bought ${cardName(names, event.card)} for ${event.cost} currency.`
    case 'starterReturned':
      return `Starter card ${cardLabel(names, event.card)} leaves the game.`
    case 'draftStarted':
      return `Skill draft: ${event.options.map((s) => skillName(names, s)).join(' or ')}.`
    case 'skillDrafted':
      return `${who(event.player)} drafted ${skillName(names, event.skill)}.`
    case 'draftSkipped':
      return 'No Skills left to draft.'
    case 'skillPooled':
      return `${skillName(names, event.skill)} goes to ${solo(names) ? 'your' : `${seat(names, event.player)}'s`} draft pool.`
    case 'skillToSupply':
      return `${skillName(names, event.skill)} goes to the bottom of its supply.`
    case 'skillReplaced':
      return `${skillName(names, event.skill)} leaves the Skill board.`
    case 'milestoneReached':
      return `Milestone: ${names.config ? milestoneLabel(event.milestone, names.config.milestones, names.content) : event.milestone}.`
    case 'runEnded':
      return `The base has fallen in round ${event.round}. The run ends.`
    case 'playerKnockedOut': {
      const lost = [
        event.materialsLost > 0 &&
          `${event.materialsLost} ${event.materialsLost === 1 ? 'material' : 'materials'}`,
        event.currencyLost > 0 && `${event.currencyLost} currency`,
      ].filter(Boolean)
      return `${who(event.player)} ${solo(names) ? 'are' : 'is'} knocked out${lost.length > 0 ? ` and ${solo(names) ? 'lose' : 'loses'} ${lost.join(' and ')}` : ''}: back at the next round start.`
    }
    case 'playerReturned':
      return `${who(event.player)} ${solo(names) ? 'are' : 'is'} back with ${event.health} health: choose a free base hex.`
    case 'returnDelayed':
      return `No free base hex: ${who(event.player)} ${solo(names) ? 'stay' : 'stays'} knocked out this round.`
  }
}
