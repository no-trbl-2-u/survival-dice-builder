import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

/**
 * The `pnpm sim` wiring: argument parsing, command dispatch, `--out` paths and exit codes. The
 * reports themselves are pinned in format, report, sweep, playtests, skillOdds and decisions
 * tests; this file runs the real CLI in a child process with tiny batches. `kit` is left out:
 * it rewrites the committed playtest kit in place.
 */
const CLI = path.join(import.meta.dirname, 'cli.ts')
const REPO = path.resolve(import.meta.dirname, '..', '..', '..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-cli-'))
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }))

/** Runs the CLI with `INIT_CWD` (where the user typed `pnpm sim`) set to `cwd`. */
const sim = (args: string[], cwd = tmp) => {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd: path.dirname(CLI),
    env: { ...process.env, INIT_CWD: cwd },
    encoding: 'utf-8',
    timeout: 60_000,
  })
  return { status: r.status, out: r.stdout, err: r.stderr }
}

describe('pnpm sim (batch)', () => {
  it('plays the batch with the runs and seed given and checks the target band', () => {
    const r = sim(['--', '--runs', '2', '--seed', '1'])
    expect(r.status).toBe(0)
    expect(r.out).toContain('runs 2, errors 0')
    expect(r.out).toMatch(/target band 8-14: (inside|outside)/)
  })

  it('writes --out as CSV or JSON, relative to where pnpm sim was run', () => {
    const csv = sim(['--runs', '2', '--out', 'runs.csv'])
    expect(csv.status).toBe(0)
    expect(csv.out).toContain('wrote runs.csv')
    expect(fs.readFileSync(path.join(tmp, 'runs.csv'), 'utf-8').trim().split('\n')).toHaveLength(3)

    const json = sim(['--runs', '2', '--out', 'runs.json'])
    expect(json.status).toBe(0)
    expect(() => JSON.parse(fs.readFileSync(path.join(tmp, 'runs.json'), 'utf-8'))).not.toThrow()
  })

  it('reads a partial --config file over the default config', () => {
    fs.writeFileSync(path.join(tmp, 'partial.json'), '{}')
    const r = sim(['--runs', '1', '--config', 'partial.json'])
    expect(r.status).toBe(0)
    expect(r.out).toContain('runs 1, errors 0')
  })

  it('prints the usage for --help and exits 0', () => {
    const r = sim(['--help'])
    expect(r.status).toBe(0)
    expect(r.out).toMatch(/^Usage:/)
  })

  it('stops on a seat count outside 1-4 or an unknown bot policy', () => {
    const seats = sim(['--runs', '1', '--seats', '5'])
    expect(seats.status).not.toBe(0)
    expect(seats.err).toContain('--seats must be 1-4')

    const policy = sim(['--runs', '1', '--policy', 'reckless'])
    expect(policy.status).not.toBe(0)
    expect(policy.err).toContain('--policy must be default, turtle, defender')
  })
})

describe('pnpm sim compare', () => {
  it('names each side and its bot, and --b-policy sets only side B', () => {
    const r = sim([
      'compare',
      '--a',
      'default',
      '--b',
      'rec',
      '--b-policy',
      'defender',
      '--runs',
      '1',
    ])
    expect(r.status).toBe(0)
    expect(r.out).toContain('| | A: default | B: rec (defender bot) |')
  })

  it('writes the table to --out', () => {
    const r = sim(['compare', '--configs', 'default,exp', '--runs', '1', '--out', 'compare.md'])
    expect(r.status).toBe(0)
    expect(fs.readFileSync(path.join(tmp, 'compare.md'), 'utf-8')).toContain('default')
  })

  it('needs 2 or more --configs', () => {
    const r = sim(['compare', '--configs', 'default', '--runs', '1'])
    expect(r.status).not.toBe(0)
    expect(r.err).toContain('--configs needs 2 or more configs')
  })
})

describe('pnpm sim sweep', () => {
  it('plays a row for every value and seat count', () => {
    const r = sim(['sweep', '--set', 'spawn.rampEvery=2,3', '--seats', '1,2', '--runs', '1'])
    expect(r.status).toBe(0)
    expect(r.out).toContain('Sweep over default')
    expect(r.out.split('\n').filter((l) => /^\| [23] \| [12] \| default \|/.test(l))).toHaveLength(
      4,
    )
  })

  it('needs a --set and seat counts of 1-4', () => {
    expect(sim(['sweep', '--runs', '1']).err).toContain('sweep needs at least 1 --set')
    const seats = sim(['sweep', '--set', 'spawn.rampEvery=2', '--seats', '1,5', '--runs', '1'])
    expect(seats.status).not.toBe(0)
    expect(seats.err).toContain('--seats must be 1-4 (a list: 1,2,4)')
  })
})

describe('pnpm sim timing, playtests, odds, decisions, rules', () => {
  it('timing with no export files prints the usage and exits 1', () => {
    const r = sim(['timing'])
    expect(r.status).toBe(1)
    expect(r.out).toMatch(/^Usage:/)
  })

  it('playtests reads an empty folder as no sessions', () => {
    fs.mkdirSync(path.join(tmp, 'runs'), { recursive: true })
    const r = sim(['playtests', '--dir', 'runs'])
    expect(r.status).toBe(0)
    expect(r.out).toContain('No sessions yet')
  })

  it('odds checks the default Skill proposal and writes --json', () => {
    const json = path.join(tmp, 'odds.json')
    const r = sim(['odds', '--json', json], REPO)
    expect(r.status).toBe(0)
    expect(r.out).toMatch(/^\d+ Skills from docs\/design\/skills-v1\/skills\.proposal\.json/)
    const rows = JSON.parse(fs.readFileSync(json, 'utf-8')) as { chance: number[] }[]
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.chance.length === 6)).toBe(true)
  })

  it('decisions and rules print their markdown, and --out writes it', () => {
    expect(sim(['decisions']).out).toMatch(/^# Decisions waiting on the designer/)
    expect(sim(['rules']).out).toMatch(/^# Rules as played/)
    const r = sim(['rules', '--out', 'rules.md'])
    expect(r.out).toContain('wrote rules.md')
    expect(fs.readFileSync(path.join(tmp, 'rules.md'), 'utf-8')).toMatch(/^# Rules as played/)
  })
})
