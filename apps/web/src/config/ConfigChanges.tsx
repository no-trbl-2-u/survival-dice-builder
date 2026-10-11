import { defaultConfigMeta } from '@survival/content'

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

/**
 * "Playing with N changes from the standard rules", with each changed field and its value, so a
 * playtest on a saved config says which game it is. Also says which saved fields took a new
 * default after a rule change.
 */
export function ConfigChanges({ config, changes, updated = [], reviewHref }: Props) {
  return (
    <div data-testid="config-changes">
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
