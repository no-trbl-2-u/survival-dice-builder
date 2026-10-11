import { defaultConfigMeta, defaultContent, type GameConfig } from '@survival/content'
import { applyAction, createGame, type GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { botChoice } from './policy.ts'

const base = defaultContent.config
const SEEDS = [1, 2, 3]
const MAX_STEPS = 5000

/** The value at a dotted config path. */
const at = (config: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], config)

/** A copy of the config with one dotted path set. */
function withValue(config: GameConfig, path: string, value: unknown): GameConfig {
  const set = (o: unknown, keys: readonly string[]): unknown => {
    const [key = '', ...rest] = keys
    const record = o as Record<string, unknown>
    return { ...record, [key]: rest.length === 0 ? value : set(record[key], rest) }
  }
  return set(config, path.split('.')) as GameConfig
}

/** Every other value a field may take: its other options, or a changed number, flag, or list. */
function otherValues(path: string, value: unknown): unknown[] {
  const options = defaultConfigMeta[path]?.options
  if (options) return Object.keys(options).filter((o) => o !== value)
  if (typeof value === 'number') return [value + 1]
  if (typeof value === 'boolean') return [!value]
  if (Array.isArray(value)) return [value.map(() => value[value.length - 1])]
  throw new Error(`no other value for ${path}`)
}

/** The events of a whole default-bot run, as JSON text. */
function play(config: GameConfig, seed: number): string {
  let state = createGame(config, seed)
  const events: GameEvent[] = []
  for (let step = 0; state.phase !== 'ended' && step < MAX_STEPS; step++) {
    const action = botChoice(state)
    if (!action) break
    const result = applyAction(state, action)
    state = result.state
    events.push(...result.events)
  }
  return JSON.stringify(events)
}

/** The config paths tagged with one Combat model (`combatModel` in config metadata). */
const tagged = Object.entries(defaultConfigMeta).flatMap(([path, entry]) =>
  entry.combatModel ? [{ path, model: entry.combatModel }] : [],
)

describe('Combat model tags in config metadata (phase 37)', () => {
  it('tags the exchange-only rulings and every engagement setting', () => {
    const paths = tagged.map((t) => `${t.path}:${t.model}`)
    expect(paths).toEqual(
      expect.arrayContaining([
        'combat.enemyAttacks:exchange',
        'combat.adjacentAttack:exchange',
        'rulings.structureDamage:exchange',
        'combat.engage.siegeDamage:engage',
        'combat.engage.defeatedDice:engage',
      ]),
    )
    const engageLeaves = Object.keys(base.combat.engage).map((k) => `combat.engage.${k}`)
    for (const path of engageLeaves) {
      expect(tagged.find((t) => t.path === path)?.model, path).toBe('engage')
    }
  })

  it('a tagged field changes nothing under the other Combat model', () => {
    const baselines = new Map<string, string>()
    for (const { path, model } of tagged) {
      const other = model === 'engage' ? 'exchange' : 'engage'
      const config = withValue(base, 'combat.model', other)
      for (const value of otherValues(path, at(config, path))) {
        const changed = withValue(config, path, value)
        for (const seed of SEEDS) {
          const key = `${other}:${seed}`
          if (!baselines.has(key)) baselines.set(key, play(config, seed))
          expect(play(changed, seed) === baselines.get(key), `${path}=${String(value)}`).toBe(true)
        }
      }
    }
  }, 120_000)

  it('the same check sees a change under the model a field is tagged with', () => {
    // Without this, a bot run that never reached Combat would pass the test above.
    const siege = withValue(base, 'combat.engage.siegeDamage', 3)
    const damage = withValue(
      withValue(base, 'combat.model', 'exchange'),
      'rulings.structureDamage',
      'grunt-die',
    )
    expect(SEEDS.some((seed) => play(siege, seed) !== play(base, seed))).toBe(true)
    const exchange = withValue(base, 'combat.model', 'exchange')
    expect(SEEDS.some((seed) => play(damage, seed) !== play(exchange, seed))).toBe(true)
  })
})
