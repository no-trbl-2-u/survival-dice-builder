import type { Action, GameState } from '@survival/engine'
import { actionHex, describeAction } from './describeAction.ts'

type Props = Readonly<{
  action: Action
  state: GameState
  /** /debug: engine ids beside names. */ ids?: boolean
}>

/** An action's label, with its map coordinate (if any) as a quiet suffix. */
export function ActionLabel({ action, state, ids = false }: Props) {
  const hex = actionHex(action)
  return (
    <>
      {describeAction(action, state, { ids })}
      {hex ? <span className="coords">{` (${hex.q},${hex.r})`}</span> : null}
    </>
  )
}
