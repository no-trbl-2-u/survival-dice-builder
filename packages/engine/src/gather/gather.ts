import { mapHex, sameHex } from '../map/tiles.ts'
import { enemyAt } from '../movement/move.ts'
import { currentPlayer, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/**
 * Gather: take the card's `amount` of materials on a gathering node that is not spent, then the
 * node is spent for good (core loop v2: each node gives materials once; all nodes are alike).
 * No node, a spent node, or an enemy on the hex (6.9) gives nothing. With
 * `rulings.gatherNeedsNode` off (row 20 read literally, row 59), Gather also works off a node,
 * and only a node is spent. With `gather.offNodeAmount` above 0 (row 67, proposed), a Gather on
 * a spent node or off any node gives that many materials instead of nothing; nodes stay
 * single-use.
 *
 * @rule 6.7, 6.9, Table 1, Table 8, OPEN-QUESTIONS rows 20, 59, 67
 */
export function gather(state: GameState, amount: number): Step {
  const player = currentPlayer(state)
  const onNode =
    mapHex(state.map, player.hex)?.site === 'gathering-node' &&
    !state.spentNodes.some((n) => sameHex(n, player.hex))
  const blocked = !!enemyAt(state, player.hex)
  const allowed = !blocked && (onNode || !state.config.rulings.gatherNeedsNode)
  const offNode = blocked ? 0 : state.config.gather.offNodeAmount
  const gained = allowed ? amount : offNode
  const materials = player.materials + gained
  const spentNodes = allowed && onNode ? [...state.spentNodes, player.hex] : state.spentNodes
  return [
    { ...updateCurrentPlayer(state, (p) => ({ ...p, materials })), spentNodes },
    [
      {
        type: 'gathered',
        rule: '6.7',
        player: player.id,
        amount: gained,
        materials,
        spent: allowed && onNode,
      },
    ],
  ]
}
