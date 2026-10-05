import {
  decisionsMarkdown,
  defaultContent,
  GameConfigSchema,
  parseQuestions,
  parseUserCalls,
  withConfigDefaults,
} from '@survival/content'
import fs from 'node:fs'
import path from 'node:path'
import { describe, toCsv, toJson } from './format.ts'
import { playtestReport, type PlaytestExport } from './playtests.ts'
import { compareTable, timingReport, type TimedExport } from './report.ts'
import { runBatch, summarize, type RunOptions } from './run.ts'

/** The median end-round band the spec targets (spec phase 7 acceptance). */
const BAND = [8, 14] as const

const usage = `Usage:
  pnpm sim -- [--runs <n>] [--seed <first seed>] [--config <file.json>] [--seats <1-4>] [--policy <default|turtle>] [--out <file.csv|file.json>]
  pnpm sim -- compare --a <config.json|default> --b <config.json|default> [--runs <n>] [--seats <1-4>] [--policy <default|turtle>] [--out report.md]
  pnpm sim -- timing <export.json ...> [--out report.md]
  pnpm sim -- playtests [--dir docs/playtests/runs] [--estimate 8.5] [--out report.md]
  pnpm sim -- decisions [--out docs/DECISIONS.md]

Plays <n> bot runs (default 200) and prints a summary. --config reads a config JSON: keys it
leaves out take the default (a partial config works). --seats plays 1-4 seats (default 1);
--policy turtle keeps every figure on the Base tile. --out writes every run as CSV or JSON.
compare: a bot batch per config (same seeds, seats, and policy), as a markdown table.
timing: minutes per round and time shares per phase and decision, from real run exports.
playtests: every run export in a folder, against the 8-9 minutes-per-round estimate.
decisions: the designer decision digest from OPEN-QUESTIONS.md and plan/AUDIT.md.`

/** Reads `--name value` pairs. */
function parse(argv: readonly string[]): Map<string, string> {
  const args = new Map<string, string>()
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]
    if (key?.startsWith('--')) args.set(key.slice(2), argv[i + 1] ?? '')
  }
  return args
}

/**
 * A path as the user typed it: relative to where `pnpm sim` was run (pnpm sets INIT_CWD), not
 * to tools/sim, where `pnpm --filter` runs the script.
 */
const here = (p: string) => path.resolve(process.env.INIT_CWD ?? process.cwd(), p)

/** The repository root (this file is tools/sim/src/cli.ts). */
const REPO = path.resolve(import.meta.dirname, '..', '..', '..')

/**
 * A config file, or the default config for `default` or nothing. A partial config (only the
 * keys an experiment changes) is merged over the default.
 */
function readConfig(file: string | undefined) {
  return file && file !== 'default'
    ? GameConfigSchema.parse(withConfigDefaults(JSON.parse(fs.readFileSync(here(file), 'utf-8'))))
    : defaultContent.config
}

/** `--seats` and `--policy`, checked. */
function runOptions(args: Map<string, string>): RunOptions {
  const seats = Number(args.get('seats') ?? 1)
  const policy = args.get('policy') ?? 'default'
  if (!Number.isInteger(seats) || seats < 1 || seats > 4) throw new Error('--seats must be 1-4')
  if (policy !== 'default' && policy !== 'turtle') {
    throw new Error('--policy must be default or turtle')
  }
  return { seats, policy }
}

/** Prints markdown and writes it to `--out` when given. */
function report(md: string, out: string | undefined): void {
  console.log(md)
  if (out) {
    fs.writeFileSync(here(out), `${md}\n`)
    console.log(`wrote ${out}`)
  }
}

const argv = process.argv.slice(2).filter((a) => a !== '--')
const COMMANDS = ['compare', 'timing', 'playtests', 'decisions'] as const
const command = COMMANDS.find((c) => c === argv[0]) ?? 'batch'
const args = parse(argv)
if (args.has('help')) {
  console.log(usage)
  process.exit(0)
}
const runs = Number(args.get('runs') ?? 200)
const seed = Number(args.get('seed') ?? 1)
const options = runOptions(args)

if (command === 'compare') {
  const side = (key: 'a' | 'b') => {
    const name = args.get(key) ?? 'default'
    const summary = summarize(runBatch(readConfig(name), runs, seed, options))
    return { name, summary }
  }
  const a = side('a')
  const b = side('b')
  report(compareTable(a, b), args.get('out'))
  process.exit(a.summary.errors + b.summary.errors > 0 ? 1 : 0)
}

if (command === 'timing') {
  const outIndex = argv.indexOf('--out')
  // argv.slice(1) shifts indexes by 1, so the --out value sits at index outIndex.
  const names = argv
    .slice(1)
    .filter((a, i) => !a.startsWith('--') && (outIndex < 0 || i !== outIndex))
  if (names.length === 0) {
    console.log(usage)
    process.exit(1)
  }
  const files = names.map((name) => ({
    name,
    data: JSON.parse(fs.readFileSync(here(name), 'utf-8')) as TimedExport,
  }))
  report(timingReport(files), args.get('out'))
  process.exit(0)
}

if (command === 'playtests') {
  const dir = here(args.get('dir') ?? 'docs/playtests/runs')
  const names = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .sort()
    : []
  const files = names.map((name) => ({
    name,
    data: JSON.parse(fs.readFileSync(path.join(dir, name), 'utf-8')) as PlaytestExport,
  }))
  report(playtestReport(files, Number(args.get('estimate') ?? 8.5)), args.get('out'))
  process.exit(0)
}

if (command === 'decisions') {
  const md = decisionsMarkdown(
    parseQuestions(fs.readFileSync(path.join(REPO, 'OPEN-QUESTIONS.md'), 'utf-8')),
    parseUserCalls(fs.readFileSync(path.join(REPO, 'plan', 'AUDIT.md'), 'utf-8')),
    defaultContent.config,
  )
  const out = args.get('out')
  if (out) {
    fs.writeFileSync(here(out), md)
    console.log(`wrote ${out}`)
  } else console.log(md)
  process.exit(0)
}

const config = readConfig(args.get('config'))

const results = runBatch(config, runs, seed, options)
const summary = summarize(results)
console.log(describe(summary, BAND))

const out = args.get('out')
if (out) {
  fs.writeFileSync(here(out), out.endsWith('.json') ? toJson(summary, results) : toCsv(results))
  console.log(`wrote ${out}`)
}
process.exit(summary.errors > 0 ? 1 : 0)
