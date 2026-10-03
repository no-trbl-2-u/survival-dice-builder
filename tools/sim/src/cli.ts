import { defaultContent, GameConfigSchema } from '@survival/content'
import fs from 'node:fs'
import path from 'node:path'
import { describe, toCsv, toJson } from './format.ts'
import { playtestReport, type PlaytestExport } from './playtests.ts'
import { compareTable, timingReport, type TimedExport } from './report.ts'
import { runBatch, summarize } from './run.ts'

/** The median end-round band the spec targets (spec phase 7 acceptance). */
const BAND = [8, 14] as const

const usage = `Usage:
  pnpm sim -- [--runs <n>] [--seed <first seed>] [--config <file.json>] [--out <file.csv|file.json>]
  pnpm sim -- compare --a <config.json|default> --b <config.json|default> [--runs <n>] [--out report.md]
  pnpm sim -- timing <export.json ...> [--out report.md]
  pnpm sim -- playtests [--dir docs/playtests/runs] [--estimate 8.5] [--out report.md]

Plays <n> bot runs (default 200) and prints a summary. --config replaces the default config
with a full config JSON (validated). --out writes every run as CSV or JSON.
compare: a bot batch per config, as a markdown table.
timing: minutes per round and time shares per phase and decision, from real run exports.
playtests: every run export in a folder, against the 8-9 minutes-per-round estimate.`

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

/** A config file, or the default config for `default` or nothing. */
function readConfig(file: string | undefined) {
  return file && file !== 'default'
    ? GameConfigSchema.parse(JSON.parse(fs.readFileSync(here(file), 'utf-8')))
    : defaultContent.config
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
const COMMANDS = ['compare', 'timing', 'playtests'] as const
const command = COMMANDS.find((c) => c === argv[0]) ?? 'batch'
const args = parse(argv)
if (args.has('help')) {
  console.log(usage)
  process.exit(0)
}
const runs = Number(args.get('runs') ?? 200)
const seed = Number(args.get('seed') ?? 1)

if (command === 'compare') {
  const side = (key: 'a' | 'b') => {
    const name = args.get(key) ?? 'default'
    const summary = summarize(runBatch(readConfig(name), runs, seed))
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

const config = readConfig(args.get('config'))

const results = runBatch(config, runs, seed)
const summary = summarize(results)
console.log(describe(summary, BAND))

const out = args.get('out')
if (out) {
  fs.writeFileSync(here(out), out.endsWith('.json') ? toJson(summary, results) : toCsv(results))
  console.log(`wrote ${out}`)
}
process.exit(summary.errors > 0 ? 1 : 0)
