import { defaultConfigMeta, defaultContent, proposalsIn } from '@survival/content'
import { rowId } from '../decisions/Inline.tsx'

/** "hit" -> "Hit": a list item by its phrase, capitalised as the /config list shows it. */
function itemPhrase(item: string | number, options?: Readonly<Record<string, string>>): string {
  if (typeof item === 'number') return String(item)
  const text = options?.[item] ?? item
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * The part of a value a short list can show: a number, a word, on/off, a list of words or
 * numbers in order, or "changed" (a list of records; `fieldValue` spells out the ones /config edits). A choice field gives its option phrase
 * from config meta ("Threat dice (experiment)"), as its drop-down on /config does, rather than
 * the stored key ("threat-dice"); a list gives each item the same way ("Hit, Miss, Special").
 */
export function shortValue(value: unknown, options?: Readonly<Record<string, string>>): string {
  if (typeof value === 'boolean') return value ? 'on' : 'off'
  if (typeof value === 'string') return options?.[value] ?? value
  if (typeof value === 'number') return String(value)
  if (value === null) return 'off'
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => typeof v === 'string' || typeof v === 'number')
  )
    return value.map((v: string | number) => itemPhrase(v, options)).join(', ')
  return 'changed'
}

/** The phrases a field's values read as: its option phrases, or the names of the Skills or cards it picks. */
function phrasesFor(path: string): Readonly<Record<string, string>> | undefined {
  const meta = defaultConfigMeta[path]
  if (meta?.options) return meta.options
  if (meta?.source === 'skills')
    return Object.fromEntries(defaultContent.skills.map((s) => [s.id, s.name]))
  if (meta?.source === 'cards')
    return Object.fromEntries(defaultContent.cards.map((c) => [c.id, c.name]))
  return undefined
}

function valueAt(config: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (t, k) => (t && typeof t === 'object' ? (t as Record<string, unknown>)[k] : undefined),
      config,
    )
}

const label = (path: string) => defaultConfigMeta[path]?.label ?? path

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

type Day = Readonly<{
  name: string
  grunts: number
  elites: number
  extraElites: number
  boon: string
}>
type Preset = Readonly<{
  id: string
  handSize: number
  cards: readonly { card: string; quantity: number }[]
}>

/** "Raid: 1 enemy, 1 elite": a Sundial day by its name, spawns and boon, as /config edits it. */
function dayText(d: Day): string {
  const parts = [
    d.grunts > 0 ? count(d.grunts, 'enemy', 'enemies') : null,
    d.elites > 0 ? count(d.elites, 'elite', 'elites') : null,
    d.extraElites > 0 ? count(d.extraElites, 'extra elite', 'extra elites') : null,
  ].filter((p): p is string => p !== null)
  if (parts.length === 0) parts.push('no spawns')
  if (d.boon !== 'none') parts.push(d.boon.charAt(0).toUpperCase() + d.boon.slice(1))
  return `${d.name}: ${parts.join(', ')}`
}

/** "deck-10-hand-5: hand of 5, 4 Move, 4 Gather": a deck preset by its hand size and cards. */
function presetText(p: Preset): string {
  const names = new Map(defaultContent.cards.map((c) => [c.id, c.name]))
  const cards = p.cards.map((c) => `${c.quantity} ${names.get(c.card) ?? c.card}`)
  return `${p.id}: hand of ${p.handSize}, ${cards.join(', ')}`
}

/**
 * A changed list of records, record by record, so the list says what changed rather than
 * "changed": the Sundial days and the deck presets. Other values go to `shortValue`.
 */
export function fieldValue(path: string, value: unknown): string {
  if (Array.isArray(value) && value.length > 0) {
    if (path === 'calendar.sundial.days') return (value as Day[]).map(dayText).join('; ')
    if (path === 'deck.presets') return (value as Preset[]).map(presetText).join('; ')
  }
  if (Array.isArray(value) && value.length === 0) return 'none'
  return shortValue(value, phrasesFor(path))
}

type Props = Readonly<{
  /** The config in use. */
  config: unknown
  /** The /config fields that differ from the standard rules. */
  changes: readonly string[]
  /** Fields that took a new default since the config was saved. */
  updated?: readonly string[]
  /** Where the list links to review the changes (none on /config itself). */
  reviewHref?: string
}>

/** "Playing with proposals: Forced reveal, Spawn range.", each linked to its /decisions row. */
function ProposalsLine({ config }: Readonly<{ config: unknown }>) {
  const found = proposalsIn(config)
  if (found.length === 0) return null
  return (
    <p data-testid="config-proposals">
      Playing with {found.length === 1 ? 'the proposal' : 'proposals'}:{' '}
      {found.map((p, i) => (
        <span key={p.id}>
          {i > 0 ? ', ' : null}
          <a href={`/decisions#${rowId(p.row)}`}>{p.label}</a>
        </span>
      ))}
      .
    </p>
  )
}

/**
 * "Playing with N changes from the standard rules", with each changed field and its value, so a
 * playtest on a saved config says which game it is. Names the proposals the config carries,
 * and says which saved fields took a new default after a rule change.
 */
export function ConfigChanges({ config, changes, updated = [], reviewHref }: Props) {
  return (
    <div data-testid="config-changes">
      <ProposalsLine config={config} />
      {changes.length === 0 ? (
        <p>Playing with the standard rules.</p>
      ) : (
        <>
          <p>
            Playing with {changes.length} {changes.length === 1 ? 'change' : 'changes'} from the
            standard rules
            {reviewHref ? (
              <>
                {' '}
                (<a href={reviewHref}>review or reset</a>)
              </>
            ) : null}
            :
          </p>
          <ul>
            {changes.map((path) => (
              <li key={path}>
                {label(path)}: {fieldValue(path, valueAt(config, path))}
              </li>
            ))}
          </ul>
        </>
      )}
      {updated.length > 0 ? (
        <p role="status">
          The rules changed since this config was saved. These settings now use the new standard
          value: {updated.map(label).join(', ')}.
        </p>
      ) : null}
    </div>
  )
}
