import {
  decisionsMarkdown,
  fillKit,
  KIT_BLOCKS,
  type KitFile,
  defaultConfigMeta,
  defaultContent,
  GameConfigSchema,
  milestoneIds,
  parseQuestions,
  parseUserCalls,
  rulesAsPlayedMarkdown,
  withConfigDefaults,
} from '@survival/content'
import fs from 'node:fs'
import path from 'node:path'
import { describe, toCsv, toJson } from './format.ts'
import { playtestReport, type PlaytestExport } from './playtests.ts'
import { compareTable, timingReport, type TimedExport } from './report.ts'
import { applyOptions, optionSet, OPTION_SETS, setPath } from './optionSets.ts'
import { runBatch, summarize, type RunOptions } from './run.ts'
import { parseSet, sweepCells, sweepTable } from './sweep.ts'
import type { BotPolicy } from '@survival/bot'

/** The median end-round band the spec targets (spec phase 7 acceptance). */
const BAND = [8, 14] as const

const usage = `Usage:
  pnpm sim -- [--runs <n>] [--seed <first seed>] [--config <file.json|rec|exp>] [--rec|--exp] [--seats <1-4>] [--policy <default|turtle|defender>] [--out <file.csv|file.json>]
  pnpm sim -- compare --a <config> --b <config> [--runs <n>] [--seats <1-4>] [--policy <p>] [--a-policy <p>] [--b-policy <p>] [--out report.md]
  pnpm sim -- compare --configs <config,config,...> [--runs <n>] [--seats <1-4>] [--policy <p>] [--out report.md]
  pnpm sim -- sweep --set <key=a,b,c> [--set ...] [--seats 1,2,4] [--policy default,defender] [--base <config>] [--runs <n>] [--out report.md]
  pnpm sim -- timing <export.json ...> [--out report.md]
  pnpm sim -- playtests [--dir docs/playtests/runs] [--estimate 8.5] [--out report.md]
  pnpm sim -- decisions [--out docs/DECISIONS.md]
  pnpm sim -- rules [--out docs/RULES-AS-PLAYED.md]
  pnpm sim -- kit

Plays <n> bot runs (default 200) and prints a summary. --config reads a config JSON: keys it
leaves out take the default (a partial config works). --seats plays 1-4 seats (default 1);
--policy turtle keeps every figure on the Base tile; --policy defender defends the base. --out
writes every run as CSV or JSON.
A <config> is a JSON file, default, or a named option set: rec (${OPTION_SETS.rec.about}) or
exp (${OPTION_SETS.exp.about}). --rec and --exp play the batch with that set.
compare: a bot batch per side (same seeds and seats), as a markdown table. --policy sets both
sides; --a-policy and --b-policy set one side (compare --b-policy defender: the two bots).
--configs compares 2 or more configs, a column each.
sweep: a batch for every value of every --set (a dotted config key), seat count and policy, over
--base (default: the default config), as one table with table upkeep per Combat.
timing: minutes per round and time shares per phase and decision, from real run exports.
playtests: every run export in a folder, against the 8-9 minutes-per-round estimate.
decisions: the designer decision digest from OPEN-QUESTIONS.md and plan/AUDIT.md.
rules: each Spec v1 rule as written beside what the engine does (the rules as played).
kit: rewrites the generated rule blocks of docs/playtests/PROTOCOL.md, SURVEY.md and REPORT.md.`

/** Reads `--name value` pairs. */
function parse(argv: readonly string[]): Map<string, string> {
  const args = new Map<string, string>()
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]
    if (key?.startsWith('--')) args.set(key.slice(2), argv[i + 1] ?? '')
  }
  return args
}

/** Every value of a flag that can repeat (`--set a=1 --set b=2`). */
function all(argv: readonly string[], flag: string): string[] {
  return argv.flatMap((a, i) => (a === `--${flag}` && argv[i + 1] ? [argv[i + 1] as string] : []))
}

/**
 * A path as the user typed it: relative to where `pnpm sim` was run (pnpm sets INIT_CWD), not
 * to tools/sim, where `pnpm --filter` runs the script.
 */
const here = (p: string) => path.resolve(process.env.INIT_CWD ?? process.cwd(), p)

/** The repository root (this file is tools/sim/src/cli.ts). */
const REPO = path.resolve(import.meta.dirname, '..', '..', '..')

/**
 * A config file, a named option set (`rec`, `exp`) over the default, or the default config for
 * `default` or nothing. A partial config (only the keys an experiment changes) is merged over
 * the default.
 */
function readConfig(file: string | undefined) {
  const set = file ? optionSet(file) : undefined
  if (set) return applyOptions(defaultContent.config, set)
  return file && file !== 'default'
    ? GameConfigSchema.parse(withConfigDefaults(JSON.parse(fs.readFileSync(here(file), 'utf-8'))))
    : defaultContent.config
}

const POLICIES: readonly BotPolicy[] = ['default', 'turtle', 'defender']

/** A bot policy name, checked. */
function policyOf(name: string, flag: string): BotPolicy {
  const policy = POLICIES.find((p) => p === name)
  if (!policy) throw new Error(`--${flag} must be ${POLICIES.join(', ')}`)
  return policy
}

/** `--seats` and `--policy` (or `--<flag>`, which wins when given), checked. */
function runOptions(args: Map<string, string>, flag = 'policy'): RunOptions {
  const seats = Number(args.get('seats') ?? 1)
  if (!Number.isInteger(seats) || seats < 1 || seats > 4) throw new Error('--seats must be 1-4')
  const name = args.get(flag) ?? args.get('policy') ?? 'default'
  return { seats, policy: policyOf(name, args.has(flag) ? flag : 'policy') }
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
const COMMANDS = ['compare', 'sweep', 'timing', 'playtests', 'decisions', 'rules', 'kit'] as const
const command = COMMANDS.find((c) => c === argv[0]) ?? 'batch'
const args = parse(argv)
if (args.has('help')) {
  console.log(usage)
  process.exit(0)
}
const runs = Number(args.get('runs') ?? 200)
const seed = Number(args.get('seed') ?? 1)

if (command === 'compare') {
  const side = (config: string, sideOptions: RunOptions) => {
    const read = readConfig(config)
    const summary = summarize(
      runBatch(read, runs, seed, sideOptions),
      milestoneIds(read.milestones),
    )
    const policy = sideOptions.policy === 'default' ? '' : ` (${sideOptions.policy} bot)`
    return { name: `${config}${policy}`, summary }
  }
  const configs = args.get('configs')?.split(',').filter(Boolean)
  if (configs && configs.length < 2) throw new Error('--configs needs 2 or more configs')
  const sides = configs
    ? configs.map((c) => side(c, runOptions(args)))
    : (['a', 'b'] as const).map((k) =>
        side(args.get(k) ?? 'default', runOptions(args, `${k}-policy`)),
      )
  report(compareTable(sides), args.get('out'))
  process.exit(sides.some((s) => s.summary.errors > 0) ? 1 : 0)
}

if (command === 'sweep') {
  const sets = all(argv, 'set').map(parseSet)
  if (sets.length === 0) throw new Error('sweep needs at least 1 --set key=a,b,c')
  const seats = (args.get('seats') ?? '1').split(',').map(Number)
  if (seats.some((n) => !Number.isInteger(n) || n < 1 || n > 4))
    throw new Error('--seats must be 1-4 (a list: 1,2,4)')
  const policies = (args.get('policy') ?? 'default').split(',').map((p) => policyOf(p, 'policy'))
  const baseName = args.get('base') ?? 'default'
  const base = readConfig(baseName)
  const rows = sweepCells(sets, seats, policies).map((cell) => {
    const config = cell.values.reduce((c, v) => setPath(c, v.path, v.value), base)
    const summary = summarize(
      runBatch(config, runs, seed, { seats: cell.seats, policy: cell.policy }),
      milestoneIds(config.milestones),
    )
    return { cell, summary }
  })
  report(sweepTable(baseName, rows), args.get('out'))
  process.exit(rows.some((r) => r.summary.errors > 0) ? 1 : 0)
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
    defaultConfigMeta,
  )
  const out = args.get('out')
  if (out) {
    fs.writeFileSync(here(out), md)
    console.log(`wrote ${out}`)
  } else console.log(md)
  process.exit(0)
}

if (command === 'rules') {
  const md = rulesAsPlayedMarkdown(
    fs.readFileSync(path.join(REPO, 'spec', '01-spec-v2-rules.md'), 'utf-8'),
    parseQuestions(fs.readFileSync(path.join(REPO, 'OPEN-QUESTIONS.md'), 'utf-8')),
    defaultContent.config,
  )
  const out = args.get('out')
  if (out) {
    fs.writeFileSync(here(out), md)
    console.log(`wrote ${out}`)
  } else console.log(md)
  process.exit(0)
}

if (command === 'kit') {
  for (const file of Object.keys(KIT_BLOCKS) as KitFile[]) {
    const target = path.join(REPO, 'docs', 'playtests', file)
    fs.writeFileSync(target, fillKit(file, fs.readFileSync(target, 'utf-8'), defaultContent))
    console.log(`wrote docs/playtests/${file}`)
  }
  process.exit(0)
}

const options = runOptions(args)
const named = args.has('rec') ? 'rec' : args.has('exp') ? 'exp' : undefined
const config = named
  ? applyOptions(readConfig(args.get('config')), OPTION_SETS[named])
  : readConfig(args.get('config'))

const results = runBatch(config, runs, seed, options)
const summary = summarize(results, milestoneIds(config.milestones))
console.log(describe(summary, BAND))

const out = args.get('out')
if (out) {
  fs.writeFileSync(here(out), out.endsWith('.json') ? toJson(summary, results) : toCsv(results))
  console.log(`wrote ${out}`)
}
process.exit(summary.errors > 0 ? 1 : 0)
