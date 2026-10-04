import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { knockOut, returnKnockedOut } from '../src/combat/knockout.ts'
import { applyAction, createGame, legalActions, type GameState } from '../src/index.ts'
import { placedPlayers } from '../src/movement/move.ts'
import { advance } from '../src/phases/advance.ts'

const config = defaultContent.config

/** A 2-player run in round 1 Prepare: p1 on the base centre, p2 on (1,0). */
function duo(): GameState {
  let s = createGame(config, 4, defaultContent, { players: 2 })
  s = applyAction(s, { type: 'placeFigure', q: 0, r: 0 }).state
  return applyAction(s, { type: 'placeFigure', q: 1, r: 0 }).state
}

const grunt = (id: string, q: number, r: number) => ({
  id,
  kind: 'grunt',
  health: 2,
  hex: { q, r },
})

describe('knockout (core loop v2, row 55)', () => {
  it('row 55 a knocked-out player loses the materials and puts every card on the discard pile', () => {
    const s = duo()
    const p1 = s.players[0]!
    const [out, events] = knockOut(
      { ...s, players: [{ ...p1, materials: 4 }, s.players[1]!] },
      'p1',
    )
    expect(out.players[0]).toMatchObject({ knockedOut: true, health: 0, materials: 0, guard: 0 })
    expect(out.players[0]!.deck).toEqual([])
    expect(out.players[0]!.hand).toEqual([])
    expect(out.players[0]!.discard).toHaveLength(10)
    expect(out.active).toBeNull()
    expect(events).toEqual([
      { type: 'playerKnockedOut', rule: '14.2', player: 'p1', materialsLost: 4 },
    ])
  })

  it('row 55 with knockout.loseMaterials off the materials stay', () => {
    const s = duo()
    const keep = { ...config, knockout: { ...config.knockout, loseMaterials: false } }
    const p1 = s.players[0]!
    const [out] = knockOut(
      { ...s, config: keep, players: [{ ...p1, materials: 4 }, s.players[1]!] },
      'p1',
    )
    expect(out.players[0]!.materials).toBe(4)
  })

  it('core loop v2 a knocked-out figure is off the map: it blocks nothing and takes no turns', () => {
    const [out] = knockOut(duo(), 'p1')
    expect(placedPlayers(out).map((p) => p.id)).toEqual(['p2'])
    // Prepare passes to p2, the only player with turns.
    const [next] = advance({ ...out, turnFresh: false })
    expect(next.current).toBe(1)
  })

  it('14.2, core loop v2 a knockout in Prepare (a lost skirmish) ends the Move in progress', () => {
    const moving: GameState = {
      ...duo(),
      active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false },
    }
    const [out] = knockOut(moving, 'p1')
    expect(out.active).toBeNull()
    expect(out.phase).toBe('prepare')
  })

  it('3.8 with figuresPerHex 2 two knocked-out players both return when 1 hex is left', () => {
    const roomy = { ...config, rulings: { ...config.rulings, figuresPerHex: 2 } }
    const outer = [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ] as const
    const [one] = knockOut({ ...duo(), config: roomy }, 'p1')
    const [both] = knockOut(one, 'p2')
    const full: GameState = { ...both, enemies: outer.map(([q, r], i) => grunt(`e${i + 1}`, q, r)) }
    const [back] = returnKnockedOut(full)
    expect(back.unplaced).toEqual(['p1', 'p2'])
  })

  it('row 55 at the round start a knocked-out player comes back with half health, rounded up', () => {
    const [out] = knockOut(duo(), 'p1')
    const [back, events] = returnKnockedOut(out)
    expect(back.players[0]).toMatchObject({ knockedOut: false, health: 8 })
    expect(back.unplaced).toEqual(['p1'])
    expect(events).toEqual([{ type: 'playerReturned', rule: '4.6', player: 'p1', health: 8 }])
    // The returning player chooses a free Base tile hex: not p2's hex, not an enemy's.
    const crowded: GameState = { ...back, enemies: [grunt('e1', 0, 1)] }
    const hexes = legalActions({ ...crowded, current: 0 }).map((a) =>
      a.type === 'placeFigure' ? `${a.q},${a.r}` : a.type,
    )
    expect(hexes).toHaveLength(5)
    expect(hexes).not.toContain('1,0')
    expect(hexes).not.toContain('0,1')
  })

  it('row 55 with no free Base tile hex the player stays knocked out for that round', () => {
    const [out] = knockOut(duo(), 'p1')
    // p2 on the base centre and an enemy on each of the 6 outer Base tile hexes.
    const outer = [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ] as const
    const full: GameState = {
      ...out,
      enemies: outer.map(([q, r], i) => grunt(`e${i + 1}`, q, r)),
      players: [out.players[0]!, { ...out.players[1]!, hex: { q: 0, r: 0 } }],
    }
    const [still, events] = returnKnockedOut(full)
    expect(still.players[0]!.knockedOut).toBe(true)
    expect(still.unplaced).toEqual([])
    expect(events).toEqual([{ type: 'returnDelayed', rule: '4.6', player: 'p1' }])
  })
})
