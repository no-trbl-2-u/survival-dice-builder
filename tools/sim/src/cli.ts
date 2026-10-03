import { defaultContent, GameConfigSchema } from '@survival/content'
import fs from 'node:fs'
import { describe, toCsv, toJson } from './format.ts'
import { compareTable, timingReport, type TimedExport } from './report.ts'
import { runBatch, summarize } from './run.ts'

/** The median end-round band the spec targets (spec phase 7 acceptance). */
const BAND = [8, 14] as const

const usage = `Usage:
  pnpm sim -- [--runs <n>] [--seed <first seed>] [--config <file.json>] [--out <file.csv|file.json>]
  pnpm sim -- compare --a <config.json|default> --b <config.json|default> [--runs <n>] [--out report.md]
  pnpm sim -- timing <export.json ...> [--out report.md]

Plays <n> bot runs (default 200) and prints a summary. --config replaces the default config
with a full config JSON (validated). --out writes every run as CSV or JSON.
compare: a bot batch per config, as a markdown table.
timing: minutes per round and time shares per phase and decision, from real run exports.`

/** Reads `--name value` pairs. */
function parse(argv: readonly string[]): Map<string, string> {
  const args = new Map<string, string>()
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]
    if (key?.startsWith('--')) args.set(key.slice(2), argv[i + 1] ?? '')
  }
  return args
}

/** A config file, or the default config for `default` or nothing. */
function readConfig(file: string | undefined) {
  return file && file !== 'default'
    ? GameConfigSchema.parse(JSON.parse(fs.readFileSync(file, 'utf-8')))
    : defaultContent.config
}

/** Prints markdown and writes it to `--out` when given. */
function report(md: string, out: string | undefined): void {
  console.log(md)
  if (out) {
    fs.writeFileSync(out, `${md}\n`)
    console.log(`wrote ${out}`)
  }
}

const argv = process.argv.slice(2).filter((a) => a !== '--')
const command = argv[0] === 'compare' || argv[0] === 'timing' ? argv[0] : 'batch'
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
  const names = argv.slice(1).filter((a, i) => !a.startsWith('--') && i + 1 !== outIndex)
  if (names.length === 0) {
    console.log(usage)
    process.exit(1)
  }
  const files = names.map((name) => ({
    name,
    data: JSON.parse(fs.readFileSync(name, 'utf-8')) as TimedExport,
  }))
  report(timingReport(files), args.get('out'))
  process.exit(0)
}

const config = readConfig(args.get('config'))

const results = runBatch(config, runs, seed)
const summary = summarize(results)
console.log(describe(summary, BAND))

const out = args.get('out')
if (out) {
  fs.writeFileSync(out, out.endsWith('.json') ? toJson(summary, results) : toCsv(results))
  console.log(`wrote ${out}`)
}
process.exit(summary.errors > 0 ? 1 : 0)
