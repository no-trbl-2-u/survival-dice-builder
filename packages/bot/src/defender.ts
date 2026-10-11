import type { CombatOption } from '@survival/content'
import { enemiesInRange, hexDistance, type Action, type GameState } from '@survival/engine'
import { ofType, type Of } from './actions.ts'
import { BASE, me, onBaseTile, POST_RANGE, threat } from './goals.ts'

/**
 * The defender's play (phase 36): the decisions where it differs from the default bot. Target
 * picks (Skills and Towers) go for an enemy the hit defeats; a Build buys Training first, then
 * puts a Tower (else a Barricade) between the base and the threat; between engagements it
 * repairs, heals, engages only with an enemy in range, and keeps its heal cards. Undefined:
 * the default bot decides.
 *
 * @param state - any engine state.
 * @param actions - `legalActions(state)`.
 * @returns a legal action, or undefined to fall through to the default priorities.
 */
export function defenderChoice(state: GameState, actions: readonly Action[]): Action | undefined {
  return (
    towerShot(state, actions) ??
    building(state, actions) ??
    exchangeStep(state, actions) ??
    betweenEngagements(state, actions)
  )
}

/** The health an enemy has left, or 0 when it is gone. */
const health = (state: GameState, id: string) => state.enemies.find((e) => e.id === id)?.health ?? 0

/**
 * The best target for `damage`: an enemy the hit defeats first (the one with the most dice in
 * this engagement, then the most experience), else the enemy nearest the base; ties go to the
 * weaker enemy, then the id.
 *
 * @param state - the state at the target choice.
 * @param ids - the enemies the choice offers.
 * @param damage - the damage the hit deals.
 */
export function bestTarget(state: GameState, ids: readonly string[], damage: number): string {
  const dice = (id: string) =>
    state.exchange?.engage?.enemyDice.filter((d) => d.enemy === id).length ?? 0
  const experience = (id: string) => {
    const kind = state.enemies.find((e) => e.id === id)?.kind
    return state.content.enemies.enemies.find((e) => e.id === kind)?.experience ?? 0
  }
  const toBase = (id: string) => {
    const enemy = state.enemies.find((e) => e.id === id)
    return enemy ? hexDistance(enemy.hex, BASE) : Number.POSITIVE_INFINITY
  }
  const rank = (id: string): number[] => {
    const defeats = health(state, id) <= damage
    return [
      defeats ? 0 : 1,
      defeats ? -dice(id) : 0,
      defeats ? -experience(id) : 0,
      toBase(id),
      health(state, id),
    ]
  }
  const order = (a: string, b: string) => {
    const [ra, rb] = [rank(a), rank(b)]
    const diff = ra.map((v, i) => v - (rb[i] ?? 0)).find((d) => d !== 0)
    return diff ?? a.localeCompare(b)
  }
  return [...ids].sort(order)[0] ?? ''
}

/** A Tower tie: the enemy the shot defeats, else the one nearest the base. */
function towerShot(state: GameState, actions: readonly Action[]): Action | undefined {
  const shots = ofType(actions, 'chooseTowerTarget')
  const first = shots[0]
  if (!first) return undefined
  const kind = state.defenses.find((d) => d.id === first.tower)?.kind
  const damage = state.content.defenses.find((d) => d.id === kind)?.attack?.damage ?? 0
  const pick = bestTarget(
    state,
    shots.map((a) => a.enemy),
    damage,
  )
  return shots.find((a) => a.enemy === pick)
}

/**
 * An active Build. On the base: Training first (more Skills), then the cheapest upgrade. Off it:
 * a Tower (else a Barricade) within `POST_RANGE` of the base, nearest the threat.
 */
function building(state: GameState, actions: readonly Action[]): Action | undefined {
  if (state.active?.kind !== 'build') return undefined
  const upgrades = ofType(actions, 'buyUpgrade')
  if (upgrades.length > 0) {
    const def = (id: string) => state.content.upgrades.find((u) => u.id === id)
    const rank = (a: Of<'buyUpgrade'>) =>
      (def(a.upgrade)?.track === 'training' ? 0 : 100) + (def(a.upgrade)?.cost ?? 0)
    return [...upgrades].sort((a, b) => rank(a) - rank(b))[0]
  }
  const posts = ofType(actions, 'build').filter((b) => hexDistance(b, BASE) <= POST_RANGE)
  if (posts.length === 0) return undefined
  const attacks = (b: Of<'build'>) =>
    state.content.defenses.find((d) => d.id === b.defense)?.attack ? 0 : 1
  const toward = threat(state)?.hex ?? BASE
  return [...posts].sort(
    (a, b) => attacks(a) - attacks(b) || hexDistance(a, toward) - hexDistance(b, toward),
  )[0]
}

/** True when the figure is hurt enough for a heal card to be worth playing. */
function hurt(state: GameState): boolean {
  const player = me(state)
  return player.health <= player.maxHealth - 2
}

/**
 * Inside an exchange or engagement: Skill targets by `bestTarget`; in an engagement's card step,
 * a heal card only when hurt (the rest of the hand stays for later engagements).
 */
function exchangeStep(state: GameState, actions: readonly Action[]): Action | undefined {
  const exchange = state.exchange
  if (!exchange) return undefined
  const head = exchange.queue[0]
  const amount = (skill: string) => {
    const effect = state.content.skills.find((s) => s.id === skill)?.effect
    return effect?.kind === 'damage' ? effect.amount : 0
  }
  if (exchange.step === 'targets' && head) {
    const choices = ofType(actions, 'chooseTarget')
    const pick = bestTarget(
      state,
      choices.map((a) => a.enemy),
      amount(head.skill) + head.bonusDamage,
    )
    return choices.find((a) => a.enemy === pick)
  }
  if (exchange.step === 'resolve') {
    const aimed = ofType(actions, 'resolveSkill').filter((a) => a.enemy !== undefined)
    const first = aimed[0]
    if (!first) return undefined
    const bonus = head?.bonusDamage ?? 0
    const pick = bestTarget(
      state,
      aimed.map((a) => a.enemy ?? ''),
      amount(first.skill) + bonus,
    )
    return aimed.find((a) => a.enemy === pick)
  }
  if (exchange.step === 'cards' && exchange.engage) {
    const heal = optionPlays(state, actions, 'heal')[0]
    return (hurt(state) ? heal : undefined) ?? ofType(actions, 'endCards')[0]
  }
  return undefined
}

/** The Combat option a `playOption` or `engage` action plays. */
function optionOf(state: GameState, a: Of<'playOption'> | Of<'engage'>): CombatOption | undefined {
  const def = me(state).hand.find((c) => c.id === a.card)?.def
  const card = state.content.cards.find((c) => c.id === def)
  return (card?.combat ?? [{ kind: 'engage' }])[a.option]
}

/** The `playOption` actions of one option kind, the biggest amount first. */
function optionPlays(
  state: GameState,
  actions: readonly Action[],
  kind: CombatOption['kind'],
): Of<'playOption'>[] {
  const size = (o: CombatOption | undefined) =>
    o && 'amount' in o ? o.amount : o && 'hexes' in o ? o.hexes : 0
  return ofType(actions, 'playOption')
    .filter((a) => optionOf(state, a)?.kind === kind)
    .sort((a, b) => size(optionOf(state, b)) - size(optionOf(state, a)))
}

/** True when a Repair now would mend something: the base from its tile, or a defense nearby. */
function repairable(state: GameState): boolean {
  const player = me(state)
  if (onBaseTile(state, player.hex) && state.base.health < state.base.maxHealth) return true
  return state.defenses.some((d) => {
    const max = state.content.defenses.find((x) => x.id === d.kind)?.health ?? 0
    return hexDistance(d.hex, player.hex) <= 1 && d.health < max
  })
}

/**
 * Between engagements (Combat v3): repair what is damaged; heal when hurt; engage when an enemy
 * is in Skill range (with a card whose other option is not a Move, to keep moving); else move
 * toward the threat; else engage anyway (a heal or guard Skill still works); else discard.
 */
function betweenEngagements(state: GameState, actions: readonly Action[]): Action | undefined {
  if (state.phase !== 'combat' || state.exchange || state.active) return undefined
  const engages = ofType(actions, 'engage')
  if (engages.length === 0 && ofType(actions, 'playOption').length === 0) return undefined
  const repair = repairable(state) ? optionPlays(state, actions, 'repair')[0] : undefined
  if (repair) return repair
  const heal = hurt(state) ? optionPlays(state, actions, 'heal')[0] : undefined
  if (heal) return heal
  const moves = (a: Of<'engage'>) => {
    const def = me(state).hand.find((c) => c.id === a.card)?.def
    const card = state.content.cards.find((c) => c.id === def)
    return card?.combat?.some((o) => o.kind === 'move') ? 1 : 0
  }
  const engage = [...engages].sort((a, b) => moves(a) - moves(b))[0]
  const range = Math.max(
    0,
    ...me(state).skills.map((id) => {
      const effect = state.content.skills.find((s) => s.id === id)?.effect
      return effect?.kind === 'damage' ? effect.range : 0
    }),
  )
  if (engage && enemiesInRange(state, range).length > 0) return engage
  const target = threat(state)
  const move = optionPlays(state, actions, 'move')[0]
  if (target && move && hexDistance(target.hex, me(state).hex) > 1) return move
  return engage ?? ofType(actions, 'discardCard')[0]
}
