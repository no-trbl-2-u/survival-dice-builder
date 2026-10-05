import { defaultContent, type GameConfig } from '@survival/content'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { applyAction, createGame, serialize, type Action, type GameState } from '../src/index.ts'
import { builderChoice, explorerChoice, scriptedChoice, walk } from './helpers/policy.ts'

/**
 * Golden replays: `seed + actions[]` with the expected SHA-256 of `serialize(finalState)`.
 * A rules change that alters a replay must update the file on purpose (bearings). To
 * regenerate after an intended change: `UPDATE_GOLDEN=1 pnpm test:run`, then explain why in
 * the commit body.
 */
type Golden = Readonly<{
  description: string
  seed: number
  config: GameConfig
  actions: Action[]
  expectedHash: string
  /**
   * The phase 21 (version 3) hash of the same replay. Phase 22 adds options that default off, so
   * the final state minus the phase 22 fields (`toPhase21`) must still hash to it.
   */
  phase21Hash?: string
}>

const DIR = path.join(import.meta.dirname, 'golden')

function hash(state: GameState): string {
  return createHash('sha256').update(serialize(state)).digest('hex')
}

/** The phase 22 config keys: every one defaults to the phase 21 rule. */
const PHASE_22_KEYS: Readonly<Record<string, readonly string[]>> = {
  combat: ['enemyAttacks', 'adjacentAttack'],
  experience: ['eliteBonus', 'levelPerEliteSpawn'],
}
const PHASE_22_GROUPS = ['clock', 'spawn', 'gather']

/** An object without some keys. */
const omit = (value: object, keys: readonly string[]): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([k]) => !keys.includes(k)))

/**
 * A version 4 state as phase 21 (version 3) wrote it: without the phase 22 config keys, tile
 * reveal rounds, tipped enemies, and run counters.
 */
function toPhase21(state: GameState): unknown {
  const config = Object.fromEntries(
    Object.entries(omit(state.config, PHASE_22_GROUPS)).map(([group, value]) => [
      group,
      PHASE_22_KEYS[group] ? omit(value as object, PHASE_22_KEYS[group]) : value,
    ]),
  )
  return {
    ...state,
    version: 3,
    config,
    progress: omit(state.progress, ['lastRevealRound', 'capReachedRound']),
    map: { ...state.map, tiles: state.map.tiles.map(({ tile, center }) => ({ tile, center })) },
    enemies: state.enemies.map((e) => omit(e, ['attackedThisCombat'])),
  }
}

function replay(g: Golden): GameState {
  return g.actions.reduce((s, a) => applyAction(s, a).state, createGame(g.config, g.seed))
}

/** Golden definitions: how each file is produced when regenerating. */
const GOLDENS = [
  {
    file: 'p5-three-rounds.json',
    description: 'Phase 5: 3 rounds, solo, default config, scripted policy (seed 2026).',
    seed: 2026,
    policy: scriptedChoice,
    stop: (s: GameState) => s.round > 3 || s.phase === 'ended',
  },
  {
    file: 'p6-explorer.json',
    description:
      'Phase 6: 3 rounds, solo, default config, explorer policy: moves, builds (seed 66).',
    seed: 66,
    policy: explorerChoice,
    stop: (s: GameState) => s.round > 3 || s.phase === 'ended',
  },
  {
    file: 'p7-full-run.json',
    description: 'Phase 7: a full solo run to the end, default config, explorer policy (seed 7).',
    seed: 7,
    policy: explorerChoice,
    stop: (s: GameState) => s.phase === 'ended',
  },
  {
    file: 'p8-builder-run.json',
    description:
      'Phase 8 (phase 21 rules): a solo run to the end (the base falls), default config, builder policy: gathering, exploring, building (seed 8).',
    seed: 8,
    policy: builderChoice,
    stop: (s: GameState) => s.phase === 'ended',
  },
]

describe('golden replays', () => {
  for (const g of GOLDENS) {
    const file = path.join(DIR, g.file)
    if (process.env.UPDATE_GOLDEN === '1') {
      it(`regenerates ${g.file}`, () => {
        const config = defaultContent.config
        const run = walk(createGame(config, g.seed), g.policy, g.stop, 50_000)
        const before = fs.existsSync(file)
          ? (JSON.parse(fs.readFileSync(file, 'utf-8')) as Golden)
          : null
        const golden: Golden = {
          description: g.description,
          seed: g.seed,
          config,
          actions: run.actions,
          expectedHash: hash(run.states.at(-1)!),
          ...(before?.phase21Hash ? { phase21Hash: before.phase21Hash } : {}),
        }
        fs.mkdirSync(DIR, { recursive: true })
        fs.writeFileSync(file, JSON.stringify(golden, null, 2) + '\n')
      })
      continue
    }
    it(`${g.file} replays to the same state hash`, () => {
      const golden = JSON.parse(fs.readFileSync(file, 'utf-8')) as Golden
      const final = replay(golden)
      expect(hash(final)).toBe(golden.expectedHash)
    })
    it(`${g.file} with every phase 22 option off matches the phase 21 state`, () => {
      const golden = JSON.parse(fs.readFileSync(file, 'utf-8')) as Golden
      const final = toPhase21(replay(golden))
      expect(
        createHash('sha256')
          .update(serialize(final as GameState))
          .digest('hex'),
      ).toBe(golden.phase21Hash)
    })
  }
})
