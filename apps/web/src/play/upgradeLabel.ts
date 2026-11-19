import { legalUpgrades, type GameState } from '@survival/engine'

/** "1 material", "4 materials". */
export const materials = (n: number): string => `${n} ${n === 1 ? 'material' : 'materials'}`

/**
 * The Buy button for a base upgrade: "Buy Training I (3 materials)", at the price the engine
 * charges the active Build after a Mason or Engineer cut (rules 11.2, 11.4). The banner and the
 * Base panel both use it, so one purchase never reads as two.
 *
 * @param state - the game state, with a Build active on the base.
 * @param upgrade - the upgrade id.
 */
export function upgradeBuyLabel(state: GameState, upgrade: string): string {
  const def = state.content.upgrades.find((u) => u.id === upgrade)
  const price =
    state.active?.kind === 'build'
      ? legalUpgrades(state, state.active.costReduction, state.active.level).find(
          (p) => p.upgrade === upgrade,
        )?.cost
      : undefined
  const cost = price ?? def?.cost
  return `Buy ${def?.name ?? upgrade}${cost === undefined ? '' : ` (${materials(cost)})`}`
}
