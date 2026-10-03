import type { UpgradeDef } from '@survival/content'
import { currentPlayer, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { refillOffers } from './shop.ts'

/** An upgrade the current player can buy now, and its cost after the card's reduction. */
export type UpgradeOption = Readonly<{ upgrade: string; cost: number }>

/** The next tier of a track, if any (I, then II, then III). @rule 11.4 */
function nextTier(state: GameState, track: UpgradeDef['track']): UpgradeDef | undefined {
  const bought = state.content.upgrades.filter(
    (u) => u.track === track && state.upgrades.includes(u.id),
  ).length
  return state.content.upgrades.find((u) => u.track === track && u.tier === bought + 1)
}

/**
 * The upgrades a Build on the base can buy: the next tier of each track (11.4), paid in
 * materials, less the card's cost reduction (Mason, Engineer; row 42), never below 0.
 *
 * @rule 6.7, 11.2, 11.4, Table 6
 */
export function legalUpgrades(state: GameState, costReduction: number): UpgradeOption[] {
  const materials = currentPlayer(state).materials
  return (['shop', 'training'] as const).flatMap((track): UpgradeOption[] => {
    const def = nextTier(state, track)
    if (!def) return []
    const cost = Math.max(0, def.cost - costReduction)
    return cost <= materials ? [{ upgrade: def.id, cost }] : []
  })
}

/**
 * Buys a base upgrade: pay the materials; +`base.healthPerUpgrade` to the maximum and current
 * base health (11.3). Shop I opens the Shop with its offers (11.5).
 *
 * @rule 11.2, 11.3, 11.5, Table 6
 */
export function buyUpgrade(state: GameState, upgrade: string, cost: number): Step {
  const player = currentPlayer(state)
  const add = state.config.base.healthPerUpgrade
  const base = { health: state.base.health + add, maxHealth: state.base.maxHealth + add }
  const next: GameState = {
    ...updateCurrentPlayer(state, (p) => ({ ...p, materials: p.materials - cost })),
    upgrades: [...state.upgrades, upgrade],
    base,
  }
  const [opened, events] = refillOffers(next)
  return [
    opened,
    [
      {
        type: 'upgradeBought',
        rule: '11.2',
        player: player.id,
        upgrade,
        cost,
        baseHealth: base.health,
      },
      ...events,
    ],
  ]
}
