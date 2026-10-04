import {
  defaultConfigMeta,
  defaultContent,
  GameConfigSchema,
  type GameConfig,
} from '@survival/content'
import { useEffect, useState, type ReactNode } from 'react'
import styles from './ConfigPage.module.css'
import {
  browserStorage,
  isDirty,
  loadConfig,
  resetConfig,
  saveConfig,
  type ConfigProblem,
} from './configStore.ts'

/** Minimal view of a Zod 4 schema node, enough to pick an input. */
type SchemaNode = Readonly<{
  def: Readonly<{ type: string; element?: SchemaNode }>
  shape?: Readonly<Record<string, SchemaNode>>
  options?: readonly string[]
  unwrap?: () => SchemaNode
}>

type Path = readonly (string | number)[]

/** Reads a value at a path. */
export function getAt(value: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (v, k) => (v as Record<string | number, unknown> | undefined)?.[k],
    value,
  )
}

/** Returns a copy of `value` with `path` set to `next`. */
export function setAt(value: unknown, path: Path, next: unknown): unknown {
  const [head, ...rest] = path
  if (head === undefined) return next
  if (Array.isArray(value)) {
    return value.map((v: unknown, i) => (i === head ? setAt(v, rest, next) : v))
  }
  const node = (value ?? {}) as Record<string | number, unknown>
  return { ...node, [head]: setAt(node[head], rest, next) }
}

/** "maxHealth" -> "max health": the label when a path has no metadata. */
const human = (key: string | number) =>
  String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()

/** The field id on the page for a path (`cfg-player-maxHealth`); /decisions links to it. */
export const fieldId = (path: Path | string) =>
  `cfg-${(typeof path === 'string' ? path.split('.') : path).join('-')}`

/** The smallest value a number field takes: 0 when the schema allows 0, else 1. */
export function numberMin(schema: Readonly<{ safeParse: (v: unknown) => { success: boolean } }>) {
  return schema.safeParse(0).success ? 0 : 1
}

type FieldProps = Readonly<{
  schema: SchemaNode
  value: unknown
  path: Path
  problems: ReadonlyMap<string, readonly string[]>
  onChange: (path: Path, next: unknown) => void
}>

/** One config field, chosen from its schema: number, checkbox, select, list, or JSON. */
function Field({ schema, value, path, problems, onChange }: FieldProps): ReactNode {
  const id = fieldId(path)
  const meta = path.length > 0 ? defaultConfigMeta[path.join('.')] : undefined
  const label = meta?.label ?? human(path.at(-1) ?? 'config')
  const type = schema.def.type
  if (type === 'object' && schema.shape) {
    return (
      <fieldset className={styles.group}>
        <legend>{label}</legend>
        {Object.entries(schema.shape).map(([key, child]) => (
          <Field
            key={key}
            schema={child}
            value={getAt(value, [key])}
            path={[...path, key]}
            problems={problems}
            onChange={onChange}
          />
        ))}
      </fieldset>
    )
  }
  const errors = problems.get(path.join('.')) ?? []
  const helpId = `${id}-help`
  const errorId = `${id}-error`
  const a11y = {
    id,
    'aria-describedby': errors.length > 0 ? `${helpId} ${errorId}` : helpId,
    'aria-invalid': errors.length > 0 ? true : undefined,
  }
  const row = (input: ReactNode) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {input}
      <p id={helpId} className={styles.help}>
        {meta?.help}
        {meta?.rule ? <span className={styles.rule}> Rules {meta.rule}.</span> : null}
      </p>
      {errors.length > 0 ? (
        <p id={errorId} className={styles.error}>
          {errors.join(' ')}
        </p>
      ) : null}
    </div>
  )
  const asNumber = (raw: string) => (raw.trim() === '' ? raw : Number(raw))
  if (type === 'number') {
    return row(
      <input
        {...a11y}
        type="number"
        min={numberMin(schema as never)}
        value={String(value)}
        onChange={(e) => onChange(path, asNumber(e.target.value))}
      />,
    )
  }
  const inner = type === 'nullable' ? schema.unwrap?.() : undefined
  if (inner?.def.type === 'number') {
    return row(
      <input
        {...a11y}
        type="number"
        min={numberMin(inner as never)}
        placeholder="no maximum"
        value={value === null ? '' : String(value)}
        onChange={(e) => onChange(path, e.target.value === '' ? null : Number(e.target.value))}
      />,
    )
  }
  if (type === 'boolean') {
    return row(
      <input
        {...a11y}
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(path, e.target.checked)}
      />,
    )
  }
  if (type === 'enum' && schema.options) {
    return row(
      <select {...a11y} value={String(value)} onChange={(e) => onChange(path, e.target.value)}>
        {schema.options.map((o) => (
          <option key={o} value={o}>
            {meta?.options?.[o] ?? o}
          </option>
        ))}
      </select>,
    )
  }
  if (type === 'string') {
    return row(
      <input
        {...a11y}
        type="text"
        value={String(value)}
        onChange={(e) => onChange(path, e.target.value)}
      />,
    )
  }
  const element = schema.def.element?.def.type
  if (type === 'array' && (element === 'number' || element === 'string' || element === 'enum')) {
    const list = Array.isArray(value) ? value.join(', ') : ''
    return row(
      <input
        {...a11y}
        type="text"
        defaultValue={list}
        onBlur={(e) => {
          const items = e.target.value
            .split(',')
            .map((x) => x.trim())
            .filter((x) => x !== '')
          onChange(path, element === 'number' ? items.map(Number) : items)
        }}
      />,
    )
  }
  // Anything else (the deck presets): edit as JSON, checked on save.
  return row(
    <textarea
      {...a11y}
      rows={6}
      defaultValue={JSON.stringify(value, null, 2)}
      onBlur={(e) => {
        try {
          onChange(path, JSON.parse(e.target.value))
        } catch {
          onChange(path, e.target.value)
        }
      }}
    />,
  )
}

/** Groups problems by field path. */
function byField(problems: readonly ConfigProblem[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const p of problems) map.set(p.path, [...(map.get(p.path) ?? []), p.message])
  return map
}

/**
 * `/config`: every config value (rules numbers, section 18 options, designer rulings) as a form
 * generated from the schema, with a label, help, and rules section for each field from
 * `config.meta.json`. Saved in this browser; new runs on /play use it.
 */
export function ConfigPage() {
  const store = browserStorage()
  const [loaded] = useState(() => loadConfig(store))
  const [saved, setSaved] = useState<unknown>(loaded.config)
  const [draft, setDraft] = useState<unknown>(loaded.config)
  const [version, setVersion] = useState(0)
  const [message, setMessage] = useState<string | null>(loaded.error)
  const [problems, setProblems] = useState<ConfigProblem[]>([])
  const [confirming, setConfirming] = useState(false)
  const dirty = isDirty(draft, saved)
  const onChange = (path: Path, next: unknown) => {
    setDraft((d: unknown) => setAt(d, path, next))
    setMessage(null)
  }
  // A link such as /config#cfg-rulings-enemiesPerHex (from /decisions) lands on that field.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id.startsWith('cfg-')) return
    const field = document.getElementById(id)
    field?.scrollIntoView({ block: 'center' })
    field?.focus()
  }, [])
  // Leaving the page (nav links are full page loads) with unsaved edits asks first.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const save = () => {
    const errors = saveConfig(store, draft)
    setProblems(errors)
    if (errors.length === 0) setSaved(draft)
    setMessage(
      errors.length === 0
        ? 'Saved. New runs on /play use this config.'
        : `Not saved: ${errors.length === 1 ? '1 field needs' : `${errors.length} fields need`} a fix.`,
    )
  }
  const reset = () => {
    resetConfig(store)
    setDraft(defaultContent.config)
    setSaved(defaultContent.config)
    setVersion((v) => v + 1)
    setProblems([])
    setConfirming(false)
    setMessage('Reset to the defaults.')
  }
  const fields = byField(problems)
  return (
    <div className={styles.page}>
      <p>
        Change any rule value or option for playtests. Each field names its rules section. The
        config is saved in this browser only. A run keeps the config it started with.
      </p>
      {problems.length > 0 ? (
        <div className={styles.problems} role="alert" aria-labelledby="cfg-problems">
          <p id="cfg-problems">These fields need a fix before the config can be saved:</p>
          <ul>
            {[...fields.keys()].map((path) => (
              <li key={path}>
                <a href={`#${fieldId(path)}`}>{defaultConfigMeta[path]?.label ?? path}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <form key={version} onSubmit={(e) => e.preventDefault()} aria-label="Config">
        <Field
          schema={GameConfigSchema as unknown as SchemaNode}
          value={draft as GameConfig}
          path={[]}
          problems={fields}
          onChange={onChange}
        />
      </form>
      <div className={styles.bar} data-testid="config-bar">
        {confirming ? (
          <div className={styles.actions} role="group" aria-label="Reset to defaults?">
            <span>Reset every value to the default?</span>
            <button type="button" onClick={reset}>
              Yes, reset every value
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Keep my values
            </button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button type="button" onClick={save}>
              Save config
            </button>
            <button type="button" onClick={() => setConfirming(true)}>
              Reset to defaults
            </button>
          </div>
        )}
        <p role="status" className={styles.status}>
          {message ?? (dirty ? 'Unsaved changes.' : null)}
        </p>
      </div>
    </div>
  )
}
