import { enemiesInRange, type Action, type GameState } from '@survival/engine'
import { ofType } from './targets.ts'

/** What the player does next: the phase it belongs to, and the step in plain words. */
export type NextStep = Readonly<{ phase: string; step: string }>

const EXCHANGE: Record<NonNullable<GameState['exchange']>['step'], string> = {
  roll: 'Keep dice, then roll again or stop rolling',
  cards: 'Play or discard each card in your hand',
  reroll: 'Choose dice to reroll, or stop rerolling',
  assign: 'Select dice, then click a Skill they fit. Confirm when done',
  targets: 'Click a highlighted enemy on the map to target it',
  resolve: 'Resolve your fired Skills in any order',
}

const ENGAGE: Record<NonNullable<GameState['exchange']>['step'], string> = {
  roll: 'Keep and reroll your dice (enemy dice stay as rolled), or stop rolling',
  cards: 'Add cards to the engagement (rerolls, heals), or choose Done adding cards',
  reroll: 'Choose dice to reroll, or stop rerolling',
  assign:
    'Select dice, then a Skill they fit: a full Skill fires at once. Repeat, or Finish engagement; then the enemy dice hit you',
  resolve: 'Click a highlighted enemy on the map to hit',
  targets: 'Click a highlighted enemy on the map to target it',
}

/**
 * The banner line for the current decision, read from the state and its legal actions. The
 * engine decides what is legal; this only names it.
 */
export function nextStep(state: GameState, legal: readonly Action[]): NextStep {
  const who = state.players.length > 1 ? `Player ${state.current + 1}: ` : ''
  const step = (phase: string, text: string): NextStep => ({ phase, step: `${who}${text}` })
  const has = (type: Action['type']) => legal.some((a) => a.type === type)

  if (state.phase === 'ended') return { phase: 'Run over', step: 'The base fell' }
  if (has('draftSkill')) return step('Reward', 'Choose a Skill to keep')
  if (has('replaceSkill')) return step('Reward', 'Choose a Skill to replace')
  if (has('returnStarter')) return step('Reward', 'Choose a starter card to return')
  if (state.unplaced.length > 0)
    return step(
      state.phase === 'setup' ? 'Setup' : 'Knocked out',
      'Click a highlighted base hex to place your figure',
    )
  const tower = ofType(legal, 'chooseTowerTarget')[0]
  if (tower) return step('Combat', `Choose which enemy Tower ${tower.tower} shoots`)
  const engage = state.exchange?.engage
  if (engage) {
    const head = state.exchange?.queue[0]
    const skill = state.content.skills.find((s) => s.id === head?.skill)?.name
    if (state.exchange?.step === 'resolve' && skill)
      return step('Engagement', `${skill} fires: click a highlighted enemy on the map to hit`)
    return step('Engagement', ENGAGE[state.exchange?.step ?? 'roll'])
  }
  if (state.exchange) {
    const name = state.exchange.skirmish ? 'Skirmish' : 'Combat'
    const far = state.exchange.step === 'assign' && !attackInReach(state)
    return step(
      name,
      `${EXCHANGE[state.exchange.step]}${far ? ' (no enemy is in range of your attack Skills)' : ''}`,
    )
  }
  if (state.active?.kind === 'move')
    return step(
      state.phase === 'combat' ? 'Combat' : 'Prepare',
      `Move: click a highlighted hex (${state.active.hexesLeft} left), or stop moving`,
    )
  if (state.active?.kind === 'build') {
    if (has('buyUpgrade')) return step('Prepare', 'Build: buy a base upgrade, or stop building')
    if (!has('build'))
      return step('Prepare', 'Build: not enough materials for anything here, so stop building')
    return step(
      'Prepare',
      `Build: click a highlighted hex (${state.active.buildsLeft} left), or stop building`,
    )
  }
  if (state.phase === 'combat' && state.config.combat.model === 'engage')
    return step(
      'Combat',
      'Play each card: Engage (roll to attack from where you stand), another option, or discard it',
    )
  if (state.phase === 'prepare') {
    const shop = has('buyCard') || has('buyUpgrade') ? ', or buy at the base' : ''
    return step('Prepare', `Play a card from your hand${shop}`)
  }
  return step(state.phase === 'combat' ? 'Combat' : 'Setup', 'Waiting')
}

/** True when at least 1 of the current player's attack Skills has an enemy in range. */
function attackInReach(state: GameState): boolean {
  const player = state.players[state.current]
  return (player?.skills ?? []).some((id) => {
    const effect = state.content.skills.find((s) => s.id === id)?.effect
    return effect?.kind === 'damage' && enemiesInRange(state, effect.range).length > 0
  })
}

/**
 * The legal actions the banner offers: those with no card, die, or hex to click, and the base
 * upgrades a Build on the base can buy (also on the Base panel, further down the page).
 */
export function bannerActions(legal: readonly Action[]): Action[] {
  return legal.filter(
    (a) =>
      a.type === 'stopMoving' ||
      a.type === 'stopBuilding' ||
      a.type === 'chooseTowerTarget' ||
      a.type === 'buyUpgrade' ||
      a.type === 'endCards',
  )
}
