import raw from '../data/proposals.json' with { type: 'json' }
import { defaultContent } from './content.ts'
import { GameConfigSchema, type GameConfig } from './schemas/config.ts'
import {
  ProposalsFileSchema,
  type Batch,
  type Measured,
  type Proposal,
} from './schemas/proposals.ts'

/** The value at a dotted path, or undefined when the path is not there. */
function valueAt(config: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node !== null && typeof node === 'object' && key in node
          ? (node as Record<string, unknown>)[key]
          : undefined,
      config,
    )
}

/** True when the path names a field the config has (not a group). */
function hasPath(config: unknown, path: string): boolean {
  const keys = path.split('.')
  const last = keys.pop() ?? ''
  const parent = keys.length > 0 ? valueAt(config, keys.join('.')) : config
  if (parent === null || typeof parent !== 'object' || Array.isArray(parent)) return false
  if (!(last in parent)) return false
  const value = (parent as Record<string, unknown>)[last]
  return value === null || typeof value !== 'object' || Array.isArray(value)
}

/** A copy of `node` with `value` at `keys`; every key must already exist. */
function setIn(node: unknown, keys: readonly string[], value: unknown): unknown {
  const [key, ...rest] = keys
  if (key === undefined) return value
  const record = node as Record<string, unknown>
  return { ...record, [key]: setIn(record[key], rest, value) }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** The config with every option of the proposal set, unchecked (a draft may be mid-edit). */
export function withProposal<T>(config: T, proposal: Proposal): T {
  return proposal.options.reduce<T>((c, o) => setIn(c, o.path.split('.'), o.value) as T, config)
}

/**
 * The config with the proposal's options set, checked against the config schema. The input is
 * not changed.
 *
 * @rule 18.1
 * @throws when the result is not a valid config.
 */
export function applyProposal(config: GameConfig, proposal: Proposal): GameConfig {
  return GameConfigSchema.parse(withProposal(config, proposal))
}

/**
 * Every problem of a proposals list against a default config: an option path the config does
 * not have, a value equal to the default (the proposal would play the standard rules), a result
 * the config schema rejects, a repeated id or row, and a measured effect on a proposal that
 * acts only under the other Combat model. Empty when the list is sound.
 *
 * @rule 18.1
 */
export function proposalProblems(
  proposals: readonly Proposal[],
  config: GameConfig = defaultContent.config,
): string[] {
  const problems: string[] = []
  const ids = new Set<string>()
  const rows = new Set<number>()
  for (const p of proposals) {
    if (ids.has(p.id)) problems.push(`${p.id}: repeated id`)
    if (rows.has(p.row)) problems.push(`${p.id}: repeated row ${p.row}`)
    ids.add(p.id)
    rows.add(p.row)
    const unknown = p.options.filter((o) => !hasPath(config, o.path))
    for (const o of unknown) problems.push(`${p.id}: ${o.path} is not a config key`)
    for (const o of p.options)
      if (hasPath(config, o.path) && same(valueAt(config, o.path), o.value))
        problems.push(`${p.id}: ${o.path} equals the default`)
    if (unknown.length === 0 && !GameConfigSchema.safeParse(withProposal(config, p)).success)
      problems.push(`${p.id}: the config schema rejects the result`)
    if (p.combatModel && p.combatModel !== config.combat.model && p.measured)
      problems.push(`${p.id}: measured under a Combat model it does not act under`)
    if (!p.measured && (!p.combatModel || p.combatModel === config.combat.model))
      problems.push(`${p.id}: no measured effect under the default Combat model`)
  }
  return problems
}

/** Validates the shipped proposals at startup; throws with every problem. */
function loadDefault(): readonly Proposal[] {
  const parsed = ProposalsFileSchema.safeParse(raw)
  if (!parsed.success) throw new Error(`Invalid proposals.json: ${parsed.error.message}`)
  const problems = proposalProblems(parsed.data)
  if (problems.length > 0)
    throw new Error(`Invalid proposals.json:\n  - ${problems.join('\n  - ')}`)
  return parsed.data
}

/** The validated proposals (`data/proposals.json`), in row order. */
export const defaultProposals: readonly Proposal[] = loadDefault()

/** The proposal for an `OPEN-QUESTIONS.md` row, or undefined. */
export function proposalForRow(
  row: number,
  proposals: readonly Proposal[] = defaultProposals,
): Proposal | undefined {
  return proposals.find((p) => p.row === row)
}

/** The proposals a config carries: every option of each one is set to its value. */
export function proposalsIn(
  config: unknown,
  proposals: readonly Proposal[] = defaultProposals,
): Proposal[] {
  return proposals.filter((p) => p.options.every((o) => same(valueAt(config, o.path), o.value)))
}

const ADVICE: Readonly<Record<Proposal['advice'], string>> = {
  'turn-on': 'turn it on',
  playtest: 'it needs a playtest',
  'keep-off': 'keep it off',
}

/** The recommendation in plain words: the loop's reading of the bot batches, not a ruling. */
export function adviceText(proposal: Proposal): string {
  const source = proposal.measured ? 'the bot batches' : 'an earlier bot batch under exchanges'
  return `Recommendation from ${source}: ${ADVICE[proposal.advice]}.`
}

/**
 * The two bots a measured line names, in plain words: what each one plays like (from the bot
 * package's `default` and `defender` policies).
 */
export const BOTS_TEXT =
  'The default bot gathers, explores and builds across the map. The defender bot stays near the base, builds its defenses next to it and fights the enemies that come for it.'

/** A count before and after: "10 (no change)" or "26, now 1". */
const change = (before: number, after: number) =>
  before === after ? `${before} (no change)` : `${before}, now ${after}`

/** One bot's two batches in short sentences; a stalled run is one the sim stopped mid-run. */
const batchText = (bot: string, a: Batch, b: Batch) =>
  `${bot}: the median run ends in round ${change(a.median, b.median)}. Runs stopped with the base still standing: ${change(a.stalled, b.stalled)}.`

/** The measured effect in plain words, or the reason there is none. */
export function measuredText(
  proposal: Proposal,
  measured: Measured | undefined = proposal.measured,
): string {
  if (!measured)
    return 'Not measured under engagements: this option changes nothing until Combat uses exchanges.'
  const seats = measured.seats === 1 ? 'solo' : `${measured.seats} seats`
  return [
    `Measured under engagements, ${measured.runs} bot runs each, ${seats}.`,
    batchText('Default bot', measured.bots.default.standard, measured.bots.default.proposal),
    batchText('Defender bot', measured.bots.defender.standard, measured.bots.defender.proposal),
  ].join(' ')
}
