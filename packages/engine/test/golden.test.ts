import { defaultContent, type GameConfig } from '@survival/content'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { applyAction, createGame, serialize, type Action, type GameState } from '../src/index.ts'
import { scriptedChoice, walk } from './helpers/policy.ts'

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
}>

const DIR = path.join(import.meta.dirname, 'golden')

function hash(state: GameState): string {
  return createHash('sha256').update(serialize(state)).digest('hex')
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
    stop: (s: GameState) => s.round > 3 || s.phase === 'ended',
  },
]

describe('golden replays', () => {
  for (const g of GOLDENS) {
    const file = path.join(DIR, g.file)
    if (process.env.UPDATE_GOLDEN === '1') {
      it(`regenerates ${g.file}`, () => {
        const config = defaultContent.config
        const run = walk(createGame(config, g.seed), scriptedChoice, g.stop)
        const golden: Golden = {
          description: g.description,
          seed: g.seed,
          config,
          actions: run.actions,
          expectedHash: hash(run.states.at(-1)!),
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
  }
})
