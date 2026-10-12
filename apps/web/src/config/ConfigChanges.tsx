import { defaultConfigMeta, proposalsIn } from '@survival/content'
import { rowId } from '../decisions/Inline.tsx'

/** The part of a value a short list can show: a number, a word, on/off, or "changed". */
export function shortValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'on' : 'off'
  if (typeof value === 'number' || typeof value === 'string') return String(value)
  if (value === null) return 'off'
  return 'changed'
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
                {label(path)}: {shortValue(valueAt(config, path))}
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
