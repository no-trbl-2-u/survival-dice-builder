import { defaultContent, GameConfigSchema } from '@survival/content'
import fs from 'node:fs'
import { describe, toCsv, toJson } from './format.ts'
import { runBatch, summarize } from './run.ts'

/** The median end-round band the spec targets (spec phase 7 acceptance). */
const BAND = [8, 14] as const

const usage = `Usage: pnpm sim -- [--runs <n>] [--seed <first seed>] [--config <file.json>] [--out <file.csv|file.json>]

Plays <n> bot runs (default 200) and prints a summary. --config replaces the default config
with a full config JSON (validated). --out writes every run as CSV or JSON.`

/** Reads `--name value` pairs. */
function parse(argv: readonly string[]): Map<string, string> {
  const args = new Map<string, string>()
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]
    if (key?.startsWith('--')) args.set(key.slice(2), argv[i + 1] ?? '')
  }
  return args
}

const args = parse(process.argv.slice(2).filter((a) => a !== '--'))
if (args.has('help')) {
  console.log(usage)
  process.exit(0)
}
const runs = Number(args.get('runs') ?? 200)
const seed = Number(args.get('seed') ?? 1)
const configFile = args.get('config')
const config = configFile
  ? GameConfigSchema.parse(JSON.parse(fs.readFileSync(configFile, 'utf-8')))
  : defaultContent.config

const results = runBatch(config, runs, seed)
const summary = summarize(results)
console.log(describe(summary, BAND))

const out = args.get('out')
if (out) {
  fs.writeFileSync(out, out.endsWith('.json') ? toJson(summary, results) : toCsv(results))
  console.log(`wrote ${out}`)
}
process.exit(summary.errors > 0 ? 1 : 0)
