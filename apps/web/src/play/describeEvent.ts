import type { GameEvent, GameState } from '@survival/engine'

/** Content names for ids that events carry. */
type Names = Readonly<{ content: GameState['content'] }>

const hex = (h: { q: number; r: number }) => `(${h.q},${h.r})`
const skillName = (n: Names, id: string) => n.content.skills.find((s) => s.id === id)?.name ?? id
const cardName = (n: Names, id: string) => n.content.cards.find((c) => c.id === id)?.name ?? id
const tileName = (n: Names, id: string) => n.content.tiles.find((t) => t.id === id)?.name ?? id
const upgradeName = (n: Names, id: string) =>
  n.content.upgrades.find((u) => u.id === id)?.name ?? id
const who = (id: string) => (id === 'p1' ? 'You' : id)
const whom = (id: string) => (id === 'p1' ? 'you' : id)

/**
 * One plain-language line for an event (ASD-STE100 style: short and literal). The rule id is
 * shown beside it by the log, not here. Labels only: the UI never decides a rule.
 *
 * @param event - an engine event.
 * @param names - the content, for display names.
 */
export function describeEvent(event: GameEvent, names: Names): string {
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
      return `${who(event.player)} played card ${event.card} (${event.half} half).`
    case 'cardDiscarded':
      return `${who(event.player)} discarded card ${event.card}${event.unplayed ? ' without its effect' : ''}.`
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
      return `Enemy ${event.enemy} takes ${event.amount} damage (health ${event.health}).`
    case 'enemyDefeated':
      return `Enemy ${event.enemy} (${event.kind}) is defeated.`
    case 'enemyAttacked':
      return `Enemy ${event.enemy} attacks ${whom(event.player)} for ${event.damage}${event.faces ? ` (${event.faces.join(', ')})` : ''}.`
    case 'hitIgnored':
      return `${who(event.player)} ignore${event.player === 'p1' ? '' : 's'} the hit from enemy ${event.enemy}.`
    case 'playerDamaged':
      return `${who(event.player)} lose${event.player === 'p1' ? '' : 's'} ${event.toGuard} guard and ${event.toHealth} health (health ${event.health}).`
    case 'exchangeSkipped':
      return 'No enemy within 2 hexes: the exchange has no effect.'
    case 'exchangeEnded':
      return 'The exchange ends.'
    case 'stepDeferred':
      return `Not yet in the engine: ${event.step}.`
    case 'tilePlaced':
      return `${tileName(names, event.tile)} placed at ${hex(event.center)}.`
    case 'enemySpawned':
      return `A ${event.kind} appears at ${hex(event.hex)}${event.spilled ? ' (node taken: nearest empty hex)' : ''}.`
    case 'moved':
      return `${who(event.player)} moved to ${hex(event.to)} (cost ${event.cost}, ${event.hexesLeft} left).`
    case 'skirmishStarted':
      return `Skirmish with enemy ${event.enemy} at ${hex(event.hex)}.`
    case 'skirmishEnded':
      return event.won
        ? 'Skirmish won: you move into the hex.'
        : 'Skirmish lost: you stay; the Move ends.'
    case 'gathered':
      return `${who(event.player)} gathered ${event.amount} materials (now ${event.materials}).`
    case 'defenseBuilt':
      return `${event.kind[0]?.toUpperCase()}${event.kind.slice(1)} built at ${hex(event.hex)} for ${event.cost} materials.`
    case 'defenseDamaged':
      return `Defense ${event.defense} takes ${event.amount} damage (health ${event.health}).`
    case 'defenseRemoved':
      return `Defense ${event.defense} is destroyed.`
    case 'roundAdvanced':
      return `Round ${event.round}.`
    case 'enemyMoved':
      return `Enemy ${event.enemy} moves to ${hex(event.to)}${event.target ? ` toward ${event.target === 'p1' ? 'you' : event.target}` : ''}.`
    case 'towerAttacked':
      return `Tower ${event.tower} hits enemy ${event.enemy} for ${event.damage}.`
    case 'structureAttacked':
      return `Enemy ${event.enemy} attacks ${event.structure === 'base' ? 'the base' : event.structure} for ${event.damage}.`
    case 'baseDamaged':
      return `The base takes ${event.amount} damage (health ${event.health}).`
    case 'waveTrackAdvanced':
      return `No tiles left: the wave track goes to ${event.waveTrack}.`
    case 'eliteReplaced':
      return `Miniature limit: grunt ${event.grunt} becomes elite ${event.elite}.`
    case 'tileRevealed':
      return `Tile revealed: ${tileName(names, event.tile)}.`
    case 'revealSkipped':
      return 'No tile revealed this round.'
    case 'experienceGained':
      return `+${event.amount} experience (${event.experience}).`
    case 'levelReached':
      return `Level ${event.level}! Every player gets 1 action die.`
    case 'diceGained':
      return `${who(event.player)} now ${event.player === 'p1' ? 'have' : 'has'} ${event.dice} action dice.`
    case 'currencyGained':
      return `+${event.amount} currency (${event.currency}).`
    case 'upgradeBought':
      return `${upgradeName(names, event.upgrade)} bought for ${event.cost} materials (base health ${event.baseHealth}).`
    case 'offerAdded':
      return `Shop offer: ${cardName(names, event.card)} (level ${event.level}).`
    case 'cardBought':
      return `${who(event.player)} bought ${cardName(names, event.card)} for ${event.cost}.`
    case 'starterReturned':
      return `Starter card ${event.card} leaves the game.`
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
        : `You have fallen in round ${event.round}. The run ends.`
  }
}
