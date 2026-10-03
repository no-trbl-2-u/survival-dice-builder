import type { Action, GameState } from '@survival/engine'
import { actionHex, describeAction } from './describeAction.ts'

type Props = Readonly<{ action: Action; state: GameState }>

/** An action's label, with its map coordinate (if any) as a quiet suffix. */
export function ActionLabel({ action, state }: Props) {
  const hex = actionHex(action)
  return (
    <>
      {describeAction(action, state)}
      {hex ? <span className="coords">{` (${hex.q},${hex.r})`}</span> : null}
    </>
  )
}
