import { mapHex } from '../map/tiles.ts'
import { enemyAt } from '../movement/move.ts'
import { currentPlayer, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/**
 * Gather: take the materials of the gathering node on the player's hex (`gatherAmount`) plus
 * the card's bonus (row 20). No node, or an enemy on the hex (6.9), gives nothing.
 *
 * @rule 6.7, 6.9, Table 1, Table 8
 */
export function gather(state: GameState, bonus: number): Step {
  const player = currentPlayer(state)
  const onNode = mapHex(state.map, player.hex)?.site === 'gathering-node'
  const blocked = !!enemyAt(state, player.hex)
  const amount = onNode && !blocked ? state.config.gatherAmount + bonus : 0
  const materials = player.materials + amount
  return [
    updateCurrentPlayer(state, (p) => ({ ...p, materials })),
    [
      {
        type: 'gathered',
        rule: '6.7',
        player: player.id,
        amount,
        materials,
      },
    ],
  ]
}
