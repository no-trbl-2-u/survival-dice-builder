import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions, type GameState } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import {
  atGoal,
  BASE,
  buildLevel,
  cheapestDefense,
  cheapestUpgrade,
  edgeHex,
  goal,
  homeNode,
  me,
  onBaseTile,
} from './goals.ts'

const config = defaultContent.config

/** A round 1 Prepare state with the figure on the base centre, with `patch` on top. */
function started(patch: Partial<GameState> = {}): GameState {
  const s = createGame(config, 1)
  return { ...applyAction(s, legalActions(s)[0]!).state, ...patch }
}

const withPlayer = (s: GameState, patch: Partial<GameState['players'][number]>): GameState => ({
  ...s,
  players: [{ ...s.players[0]!, ...patch }],
})

/** The same state with `rulings.buildLevels` set. */
const withBuildLevels = (s: GameState, buildLevels: 'levelled' | 'any'): GameState => ({
  ...s,
  config: { ...s.config, rulings: { ...s.config.rulings, buildLevels } },
})

describe('the bot goal helpers', () => {
  it('me throws when no player has the turn', () => {
    expect(me(started()).id).toBe('p1')
    expect(() => me(started({ players: [] }))).toThrow('No current player')
  })

  it('buildLevel is the starter Build level, and 0 with no Build card anywhere', () => {
    const s = started()
    expect(buildLevel(s)).toBe(1)
    const strip = (cards: GameState['players'][number]['hand']) =>
      cards.filter((c) => c.def !== 'starter-build')
    const p = s.players[0]!
    const noBuild = withPlayer(s, {
      hand: strip(p.hand),
      deck: strip(p.deck),
      discard: strip(p.discard),
      inPlay: strip(p.inPlay),
    })
    expect(buildLevel(noBuild)).toBe(0)
  })

  it('cheapestUpgrade takes the next tier of each track within the Build level (11.4)', () => {
    const s = started()
    expect(cheapestUpgrade(s, 1)).toBe(3)
    // Training I bought: Shop I (4) is cheaper than Training II (5), which level 1 cannot buy.
    expect(cheapestUpgrade({ ...s, upgrades: ['training-1'] }, 1)).toBe(4)
    // Both tier 1s bought: level 1 reaches no next tier, any level reaches Training II.
    const tier2 = { ...s, upgrades: ['training-1', 'shop-1'] }
    expect(cheapestUpgrade(tier2, 1)).toBe(Number.POSITIVE_INFINITY)
    expect(cheapestUpgrade(tier2)).toBe(5)
    expect(cheapestUpgrade(withBuildLevels(tier2, 'any'), 1)).toBe(5)
    // Every tier bought: nothing left to buy.
    const all = { ...s, upgrades: defaultContent.upgrades.map((u) => u.id) }
    expect(cheapestUpgrade(all)).toBe(Number.POSITIVE_INFINITY)
  })

  it('cheapestDefense is the cheapest defense cost, Infinity with none', () => {
    const s = started()
    expect(cheapestDefense(s)).toBe(Math.min(...defaultContent.defenses.map((d) => d.cost)))
    expect(cheapestDefense({ ...s, content: { ...s.content, defenses: [] } })).toBe(
      Number.POSITIVE_INFINITY,
    )
  })

  it('onBaseTile is the base hex and its 6 neighbours only', () => {
    const s = started()
    expect(onBaseTile(s, BASE)).toBe(true)
    expect(onBaseTile(s, { q: 1, r: -1 })).toBe(true)
    expect(onBaseTile(s, { q: 2, r: 0 })).toBe(false)
  })

  it('edgeHex is null once the tile deck is empty, and homeNode null with no gathering node', () => {
    const s = started()
    expect(homeNode(s)).toBeNull()
    expect(edgeHex(s)).not.toBeNull()
    expect(edgeHex({ ...s, tileDeck: [] })).toBeNull()
    // Nothing to gather and nothing to reveal: the default bot goes home.
    expect(goal({ ...s, tileDeck: [] })).toEqual(BASE)
  })

  it('homeNode takes the unspent node nearest the base with no enemy on it (ties: hex key)', () => {
    const s0 = started()
    const node = { ...s0.map.hexes['1,0']!, site: 'gathering-node' as const }
    const hexes = { ...s0.map.hexes, '2,0': node, '-2,0': node, '3,0': node }
    const s = { ...s0, map: { ...s0.map, hexes } }
    // Two nodes 2 from the base: the lower hex key wins over the 3-away node.
    expect(homeNode(s)).toEqual({ q: -2, r: 0 })
    // An enemy on it: the other 2-away node.
    const held = { ...s, enemies: [{ id: 'e1', kind: 'grunt', health: 2, hex: { q: -2, r: 0 } }] }
    expect(homeNode(held)).toEqual({ q: 2, r: 0 })
    // That one spent too: the node 3 away.
    expect(homeNode({ ...held, spentNodes: [{ q: 2, r: 0 }] })).toEqual({ q: 3, r: 0 })
  })

  it('the turtle always wants the base, and atGoal follows the policy', () => {
    const away = withPlayer(started(), { hex: { q: 1, r: 0 } })
    expect(goal(away, 'turtle')).toEqual(BASE)
    expect(atGoal(away, 'turtle')).toBe(false)
    expect(atGoal(started(), 'turtle')).toBe(true)
    // The default bot with no materials wants the map edge, so the base centre is not its goal.
    expect(atGoal(started())).toBe(false)
  })
})
