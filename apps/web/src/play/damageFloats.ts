import type { Axial, GameEvent, GameState } from '@survival/engine'

/** A damage number to float off an enemy on the board after a target pick. */
export type DamageFloat = Readonly<{
  enemy: string
  hex: Axial
  amount: number
  /** The pick defeated it: its token fades out with the number. */
  defeated: boolean
  /** The enemy's kind (the fading token's shape). */
  kind: string
}>

/**
 * One float per `enemyDamaged` event of an action, placed at the enemy's hex in the state the
 * action was applied to (a defeated enemy is gone from the state after it). Labels only: the
 * engine already resolved the damage.
 *
 * @param before - the state the action was applied to.
 * @param events - the action's events.
 */
export function damageFloats(before: GameState, events: readonly GameEvent[]): DamageFloat[] {
  const defeated = new Set(events.flatMap((e) => (e.type === 'enemyDefeated' ? [e.enemy] : [])))
  return events.flatMap((e) => {
    if (e.type !== 'enemyDamaged') return []
    const enemy = before.enemies.find((x) => x.id === e.enemy)
    if (!enemy) return []
    return [
      {
        enemy: e.enemy,
        hex: enemy.hex,
        amount: e.amount,
        defeated: defeated.has(e.enemy),
        kind: enemy.kind,
      },
    ]
  })
}
