import type { GameEvent } from '../events/events.ts'
import { applyBoons, calendarDay, calendarSystem, nodeNearestBase } from './calendar.ts'
import { hexDistance, tileHexes, type Axial } from '../hex.ts'
import { baseHexes } from '../map/base.ts'
import { nodeKind, spawnEnemy } from '../map/spawn.ts'
import { placedPlayers } from '../movement/move.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/** A spawn node on the map, the enemy kind it holds, and the round its tile was revealed. */
export type SpawnNode = Readonly<{ hex: Axial; kind: 'grunt' | 'elite'; revealedRound: number }>

/**
 * Every spawn node and elite spawn node on the map, in tile placement order, then hex order.
 *
 * @rule Table 1
 */
export function spawnNodes(state: GameState): SpawnNode[] {
  return state.map.tiles.flatMap((placed) => {
    const tile = state.content.tiles.find((t) => t.id === placed.tile)
    const positions = tileHexes(placed.center)
    return (tile?.hexes ?? []).flatMap((hex, i): SpawnNode[] => {
      const kind = nodeKind(hex.site)
      const pos = positions[i]
      return kind && pos ? [{ hex: pos, kind, revealedRound: placed.revealedRound }] : []
    })
  })
}

/**
 * The first round whose Combat a node spawns at: its tile's reveal round plus
 * `spawn.newTileDelay` (row 66). With the default delay 0 a tile spawns in the round of its
 * reveal.
 *
 * @rule core loop v2 row 66 (proposed: new tiles wait one round)
 */
export function firstSpawnRound(state: GameState, node: SpawnNode): number {
  return node.revealedRound + state.config.spawn.newTileDelay
}

/**
 * True when a node is within `spawn.nodeRange` hexes of a player figure on the map, a
 * Barricade or Tower, or a Base tile hex (row 70). Always true when the option is off (null).
 *
 * @rule core loop v2 row 70 (proposed: spawn range)
 */
export function nodeInRange(state: GameState, node: SpawnNode): boolean {
  const range = state.config.spawn.nodeRange
  if (range === null) return true
  const anchors = [
    ...placedPlayers(state).map((p) => p.hex),
    ...state.defenses.map((d) => d.hex),
    ...baseHexes(state),
  ]
  return anchors.some((h) => hexDistance(h, node.hex) <= range)
}

/**
 * The nodes that spawn at this Combat: `spawnNodes` whose tile has waited `spawn.newTileDelay`
 * rounds (row 66) and that are within `spawn.nodeRange` (row 70).
 *
 * @rule core loop v2 (Combat step 3), rows 66, 70
 */
export function activeSpawnNodes(state: GameState): SpawnNode[] {
  return spawnNodes(state).filter(
    (node) => state.round >= firstSpawnRound(state, node) && nodeInRange(state, node),
  )
}

/**
 * How many enemies each active node spawns at this Combat: 1, or 1 per 2 seats rounded up with
 * `spawn.perSeat` (row 68), plus 1 for every `spawn.rampEvery` rounds after round 1 (row 64:
 * `floor((round - 1) / N)`). With the Event Calendar on, the ramp is the calendar's own.
 *
 * @rule core loop v2 (Combat step 3), rows 64, 68 (proposed: spawn ramp, seat scaling)
 */
export function spawnCount(state: GameState): number {
  const { rampEvery, perSeat } = state.config.spawn
  const base = perSeat ? Math.ceil(state.players.length / 2) : 1
  // The Event Calendar has its own ramp (laps, dice, rungs), so `spawn.rampEvery` does not stack.
  const calendarOn = calendarSystem(state) !== 'off'
  const ramp = rampEvery === null || calendarOn ? 0 : Math.floor((state.round - 1) / rampEvery)
  return base + ramp
}

/**
 * Combat start, after the enemies move (core loop v2): every active spawn node gets
 * `spawnCount` grunts and every active elite spawn node `spawnCount` elites, on every revealed
 * tile, in `spawnNodes` order. An occupied node spills the enemy to the nearest empty hex (9.8);
 * past the miniature limit the grunt nearest the base becomes an elite instead (10.5, row 32).
 * There is no wave track. With `calendar.system` on, the calendar day sets the enemies per node
 * (scaled by `spawnCount`), adds elites at the active node nearest the base, and gives its boons
 * first (Event Calendar experiment).
 *
 * @rule 7.3, 9.8, 10.5, core loop v2 (Combat step 3), rows 64, 66, 68, 70
 */
export function spawnAtNodes(state: GameState): Step {
  const [day, remembered] = calendarDay(state)
  const calendarOn = calendarSystem(state) !== 'off'
  const [boons, boonEvents] = applyBoons(remembered, day.boons)
  let current = boons
  const events: GameEvent[] = calendarOn
    ? [
        {
          type: 'calendarDay',
          rule: '7.3',
          system: calendarSystem(state),
          day: day.name,
          grunts: day.grunts,
          elites: day.elites,
          extraElites: day.extraElites,
          boons: day.boons,
          faces: day.faces ?? [],
        },
        ...boonEvents,
      ]
    : []
  const count = spawnCount(state)
  const nodes = activeSpawnNodes(state)
  for (const node of nodes) {
    const perNode = (node.kind === 'grunt' ? day.grunts : day.elites) * count
    for (let n = 0; n < perNode; n++) {
      const [next, more] = spawnEnemy(current, node.kind, node.hex, '7.3')
      current = next
      events.push(...more)
    }
  }
  const nearest = nodeNearestBase(state, nodes)
  for (let n = 0; nearest && n < day.extraElites; n++) {
    const [next, more] = spawnEnemy(current, 'elite', nearest.hex, '7.3')
    current = next
    events.push(...more)
  }
  return [current, events]
}
