import { hexKey, type GameEvent, type GameState } from '@survival/engine'
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

/** An enemy's kind: on the map now, or from the event that put it there. */
function enemyKind(n: Names, id: string): string | undefined {
  const live = n.enemies?.find((e) => e.id === id)?.kind
  if (live) return live
  for (const e of n.log ?? []) {
    if (e.type === 'enemySpawned' && e.enemy === id) return e.kind
    if (e.type === 'eliteReplaced' && e.elite === id) return 'elite'
  }
  return undefined
}

/** "grunt e3": an enemy by kind and id (the id tells 2 grunts apart). */
function enemyLabel(n: Names, id: string, kind?: string): string {
  return `${kind ?? enemyKind(n, id) ?? 'enemy'} ${id}`
}

/** "Tower d2": a defense by kind and id. */
function defenseLabel(n: Names, id: string): string {
  const kind = n.defenses?.find((d) => d.id === id)?.kind
  return kind ? `${kind[0]?.toUpperCase()}${kind.slice(1)} ${id}` : `Defense ${id}`
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
      return `${who(event.player)} healed ${event.amount} (health ${event.health}).`
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
      return `${upper(enemyLabel(names, event.enemy))} attacks ${whom(event.player)} for ${event.damage}${event.faces ? ` (${event.faces.join(', ')})` : ''}.`
    case 'hitIgnored':
      return `${who(event.player)} ${s('ignore')} the hit from ${enemyLabel(names, event.enemy)}.`
    case 'playerDamaged':
      return `${who(event.player)} ${s('lose')} ${event.toGuard} guard and ${event.toHealth} health (health ${event.health}).`
    case 'exchangeSkipped':
      return 'No enemy within 2 hexes: the exchange has no effect.'
    case 'exchangeEnded':
      return 'The exchange ends.'
    case 'stepDeferred':
      return `Not yet in the engine: ${event.step}.`
    case 'tilePlaced':
      return `${tileName(names, event.tile)} placed at ${hex(event.center)}.`
    case 'enemySpawned':
      return `${upper(article(event.kind))} appears on ${place(names, event.hex)}${event.spilled ? ' (node taken: nearest empty hex)' : ''}.`
    case 'moved':
      return `${who(event.player)} moved to ${place(names, event.to)} (cost ${event.cost}, ${event.hexesLeft} left).`
    case 'skirmishStarted':
      return `Skirmish with ${enemyLabel(names, event.enemy)} on ${place(names, event.hex)}.`
    case 'skirmishEnded':
      return event.won
        ? 'Skirmish won: you move into the hex.'
        : 'Skirmish lost: you stay; the Move ends.'
    case 'gathered':
      return event.amount === 0
        ? `${who(event.player)} gathered nothing: gather on an unspent gathering node with no enemy on it.`
        : `${who(event.player)} gathered ${event.amount} materials (now ${event.materials})${event.spent ? '; the node is spent' : ''}.`
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
    case 'waveTrackAdvanced':
      return `No tiles left: the wave track goes to ${event.waveTrack}.`
    case 'eliteReplaced':
      return `Miniature limit: grunt ${event.grunt} becomes elite ${event.elite}.`
    case 'tileRevealed':
      return `Tile revealed: ${tileName(names, event.tile)}.`
    case 'figurePlaced':
      return `${who(event.player)} ${solo(names) ? 'start' : 'starts'} on ${place(names, event.hex)}.`
    case 'revealStepBlocked':
      return `${who(event.player)} cannot enter ${place(names, event.hex)}: it is lake or mountain (${event.hexesLeft} left).`
    case 'experienceGained':
      return `+${event.amount} experience (${event.experience}).`
    case 'levelReached':
      return `Level ${event.level}! Every player gets 1 action die.`
    case 'diceGained':
      return `${who(event.player)} now ${solo(names) ? 'have' : 'has'} ${event.dice} action dice.`
    case 'currencyGained':
      return `+${event.amount} currency (${event.currency}).`
    case 'upgradeBought':
      return `${upgradeName(names, event.upgrade)} bought for ${event.cost} materials (base health ${event.baseHealth}).`
    case 'offerAdded':
      return `Shop offer: ${cardName(names, event.card)} (level ${event.level}).`
    case 'cardBought':
      return `${who(event.player)} bought ${cardName(names, event.card)} for ${event.cost}.`
    case 'starterReturned':
      return `Starter card ${cardLabel(names, event.card)} leaves the game.`
    case 'draftStarted':
      return `Skill draft: ${event.options.map((s) => skillName(names, s)).join(' or ')}.`
    case 'skillDrafted':
      return `${who(event.player)} drafted ${skillName(names, event.skill)}.`
    case 'draftSkipped':
      return 'No Skills left to draft.'
    case 'skillToSupply':
      return `${skillName(names, event.skill)} goes to the bottom of its supply.`
    case 'skillReplaced':
      return `${skillName(names, event.skill)} leaves the Skill board.`
    case 'milestoneReached':
      return `Milestone: ${event.milestone}.`
    case 'runEnded':
      return event.because === 'base'
        ? `The base has fallen in round ${event.round}. The run ends.`
        : `${solo(names) ? 'You have' : 'A player has'} fallen in round ${event.round}. The run ends.`
  }
}
