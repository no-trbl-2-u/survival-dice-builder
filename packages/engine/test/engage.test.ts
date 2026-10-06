import { defaultContent, type Face, type GameConfig, type SkillFace } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { siege } from '../src/combat/engage.ts'
import {
  applyAction,
  createGame,
  legalActions,
  type Action,
  type Enemy,
  type EnemyDieRoll,
  type GameState,
} from '../src/index.ts'

const config: GameConfig = {
  ...defaultContent.config,
  combat: { ...defaultContent.config.combat, model: 'engage' },
}

const grunt = (id: string, q: number, r: number): Enemy => ({
  id,
  kind: 'grunt',
  health: 2,
  hex: { q, r },
  attackedThisCombat: false,
})

/** Plays the first legal action until `stop`. */
function until(start: GameState, stop: (s: GameState) => boolean, max = 500): GameState {
  let s = start
  for (let i = 0; i < max && !stop(s) && s.phase !== 'ended'; i++) {
    s = applyAction(s, legalActions(s)[0]!).state
  }
  return s
}

/** A solo run at the start of Combat, figure on (3,0), with 2 grunts next to it. */
function inCombat(): GameState {
  const s = until(createGame(config, 4), (x) => x.phase === 'combat' && !x.exchange)
  return {
    ...s,
    players: [{ ...s.players[0]!, hex: { q: 3, r: 0 } }],
    enemies: [grunt('g1', 4, 0), grunt('g2', 3, 1)],
  }
}

describe('Combat v3 engagements', () => {
  const engage = (s: GameState): Action => legalActions(s).find((a) => a.type === 'engage')!

  /** An engagement in the assign step with the given dice and enemy dice. */
  const withDice = (s: GameState, faces: Face[], enemyDice: EnemyDieRoll[]): GameState => ({
    ...s,
    exchange: {
      ...s.exchange!,
      step: 'assign',
      dice: faces.map((face) => ({ face, kept: false })),
      engage: { enemyDice },
    },
  })

  it('Engage can be played anywhere, even with no enemy near; a reroll only inside one', () => {
    const s = { ...inCombat(), enemies: [] }
    const legal = legalActions(s)
    expect(legal.some((a) => a.type === 'engage')).toBe(true)
    const rerolls = legal.filter((a) => {
      if (a.type !== 'playOption') return false
      const card = s.players[0]!.hand.find((c) => c.id === a.card)!
      const def = s.content.cards.find((d) => d.id === card.def)!
      return def.combat?.[a.option]?.kind === 'reroll'
    })
    expect(rerolls).toEqual([])
  })

  it('only enemies next to the player roll enemy dice; they never reroll', () => {
    const s = { ...inCombat(), enemies: [grunt('g1', 4, 0), grunt('f1', 5, 0)] }
    const engaged = applyAction(s, engage(s)).state
    const dice = engaged.exchange?.engage?.enemyDice ?? []
    expect(dice.map((d) => d.enemy)).toEqual(['g1'])
    expect(engaged.players[0]!.hand).toHaveLength(s.players[0]!.hand.length - 1)
    const rolled = applyAction(engaged, { type: 'roll' }).state
    expect(rolled.exchange?.engage?.enemyDice).toEqual(dice)
  })

  it('a gamble from afar: no enemy next to the player, so no enemy die rolls', () => {
    const s = { ...inCombat(), enemies: [grunt('f1', 5, 0)] }
    const engaged = applyAction(s, engage(s)).state
    expect(engaged.exchange?.engage?.enemyDice).toEqual([])
  })

  /** Puts 1 die on a Skill's first slot (a full Skill fires at once). */
  const put = (s: GameState, die: number, skill: string, asFace: SkillFace) =>
    applyAction(s, { type: 'assignDie', die, skill, use: 0, slot: 0, asFace })

  it('stop rolling goes straight to using the dice', () => {
    let s: GameState = { ...inCombat(), enemies: [grunt('g1', 4, 0)] }
    s = applyAction(s, engage(s)).state
    s = applyAction(s, { type: 'stopRolling' }).state
    expect(s.exchange?.step).toBe('assign')
  })

  it('die by die: Bow first on the far grunt, then Sword on the adjacent one', () => {
    let s: GameState = { ...inCombat(), enemies: [grunt('g1', 4, 0), grunt('f1', 5, 0)] }
    s = withDice(applyAction(s, engage(s)).state, ['Sword', 'Bow'], [])
    // The Bow fills Shot: it fires and waits for its target (either grunt is in range 2).
    s = put(s, 1, 'shot', 'Bow').state
    expect(s.exchange?.step).toBe('resolve')
    expect(legalActions(s)).toEqual([
      { type: 'resolveSkill', skill: 'shot', use: 0, enemy: 'g1' },
      { type: 'resolveSkill', skill: 'shot', use: 0, enemy: 'f1' },
    ])
    s = applyAction(s, { type: 'resolveSkill', skill: 'shot', use: 0, enemy: 'f1' }).state
    expect(s.exchange?.step).toBe('assign')
    // Then the Sword: Strike reaches only g1.
    s = put(s, 0, 'strike', 'Sword').state
    expect(legalActions(s)).toEqual([
      { type: 'resolveSkill', skill: 'strike', use: 0, enemy: 'g1' },
    ])
    s = applyAction(s, legalActions(s)[0]!).state
    expect(s.enemies).toEqual([{ ...grunt('f1', 5, 0), health: 1 }])
  })

  it('Wand before Sword is allowed: the heal resolves the moment its die is placed', () => {
    let s: GameState = { ...inCombat(), enemies: [grunt('g1', 4, 0)] }
    s = withDice(applyAction(s, engage(s)).state, ['Sword', 'Wand'], [])
    s = { ...s, players: [{ ...s.players[0]!, health: 10 }] }
    const { state, events } = put(s, 1, 'mend', 'Wand')
    expect(events.map((e) => e.type)).toEqual(['dieAssigned', 'skillFired', 'healed'])
    expect(state.exchange?.step).toBe('assign')
  })

  it('the enemy dice resolve last, after the dice are used: guard from Guard soaks them', () => {
    let s: GameState = { ...inCombat(), enemies: [grunt('g1', 4, 0)] }
    s = withDice(applyAction(s, engage(s)).state, ['Shield'], [{ enemy: 'g1', face: 'hit' }])
    const health = s.players[0]!.health
    const { state, events } = put(s, 0, 'guard', 'Shield')
    const done = state.exchange
      ? applyAction(state, { type: 'confirmAssignment' })
      : { state, events: [] }
    const types = [...events, ...done.events].map((e) => e.type)
    expect(types.indexOf('guardGained')).toBeLessThan(types.indexOf('enemyAttacked'))
    expect(done.state.players[0]!.health).toBe(health)
    expect(done.state.exchange).toBeNull()
  })

  it('an attack with no enemy in range fires with no effect and asks for no target', () => {
    let s: GameState = { ...inCombat(), enemies: [grunt('f1', 6, 0)] }
    s = withDice(applyAction(s, engage(s)).state, ['Sword'], [])
    s = put(s, 0, 'strike', 'Sword').state
    expect(s.exchange?.step).not.toBe('resolve')
    expect(s.enemies).toEqual([grunt('f1', 6, 0)])
  })

  it('with nothing left to place and no reroll card, the engagement ends by itself', () => {
    let s: GameState = { ...inCombat(), enemies: [grunt('g1', 4, 0)] }
    s = applyAction(s, engage(s)).state
    s = { ...s, players: [{ ...s.players[0]!, hand: [] }] }
    s = withDice(s, ['Sword'], [])
    s = put(s, 0, 'strike', 'Sword').state
    s = applyAction(s, legalActions(s)[0]!).state
    expect(s.exchange).toBeNull()
  })

  it('there is no enemy attack phase: discarding a hand next to enemies costs no health', () => {
    let s = inCombat()
    const health = s.players[0]!.health
    for (let i = 0; i < 5; i++) {
      const discard = legalActions(s).find((a) => a.type === 'discardCard')
      if (!discard) break
      s = applyAction(s, discard).state
    }
    expect(s.players[0]!.health).toBe(health)
  })

  it('siege: each enemy next to a structure deals siege damage to it', () => {
    const s = inCombat()
    const sieged = siege({ ...s, enemies: [grunt('g1', 2, 0)] })[0]
    expect(sieged.base.health).toBe(s.base.health - config.combat.engage.siegeDamage)
  })

  it('a full run in engage mode plays to an end with no errors', () => {
    let s = createGame(config, 11)
    let pick = 7
    for (let i = 0; i < 20_000 && s.phase !== 'ended'; i++) {
      const legal = legalActions(s)
      pick = (pick * 1103515245 + 12345) % 2147483648
      s = applyAction(s, legal[pick % legal.length]!).state
    }
    expect(s.round).toBeGreaterThan(1)
  })
})
