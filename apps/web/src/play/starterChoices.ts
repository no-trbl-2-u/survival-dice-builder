import type { CardDef } from '@survival/content'
import type { Action, GameState } from '@survival/engine'

/** One button in the return-a-starter choice: a starter card, how many copies, and what it does. */
export type StarterChoice = Readonly<{
  action: Extract<Action, { type: 'returnStarter' }>
  def: CardDef
  copies: number
}>

/**
 * The legal starter returns, one per card kind. Copies of a starter play the same, so the
 * player picks a card, not an instance: the first copy stands for the rest.
 *
 * @param state - the current game state.
 * @param returns - the legal `returnStarter` actions.
 * @rule 18.1
 */
export function starterChoices(
  state: GameState,
  returns: readonly Extract<Action, { type: 'returnStarter' }>[],
): StarterChoice[] {
  const player = state.players[state.current]
  const owned = [...(player?.deck ?? []), ...(player?.discard ?? [])]
  const byDef = new Map<string, StarterChoice>()
  for (const action of returns) {
    const defId = owned.find((c) => c.id === action.card)?.def
    const def = state.content.cards.find((c) => c.id === defId)
    if (!def) continue
    const seen = byDef.get(def.id)
    byDef.set(def.id, seen ? { ...seen, copies: seen.copies + 1 } : { action, def, copies: 1 })
  }
  return [...byDef.values()]
}
