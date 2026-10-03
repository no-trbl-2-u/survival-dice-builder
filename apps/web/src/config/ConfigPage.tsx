import { defaultContent, GameConfigSchema, type GameConfig } from '@survival/content'
import { useEffect, useState, type ReactNode } from 'react'
import styles from './ConfigPage.module.css'
import { browserStorage, loadConfig, resetConfig, saveConfig } from './configStore.ts'

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

/** "maxHealth" -> "max health". */
const human = (key: string | number) =>
  String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()

type FieldProps = Readonly<{
  schema: SchemaNode
  value: unknown
  path: Path
  onChange: (path: Path, next: unknown) => void
}>

/** One config field, chosen from its schema: number, checkbox, select, list, or JSON. */
function Field({ schema, value, path, onChange }: FieldProps): ReactNode {
  const id = `cfg-${path.join('-')}`
  const label = human(path.at(-1) ?? 'config')
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
            onChange={onChange}
          />
        ))}
      </fieldset>
    )
  }
  const row = (input: ReactNode) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {input}
    </div>
  )
  if (type === 'number') {
    return row(
      <input
        id={id}
        type="number"
        value={String(value)}
        onChange={(e) => onChange(path, Number(e.target.value))}
      />,
    )
  }
  if (type === 'nullable' && schema.unwrap?.().def.type === 'number') {
    return row(
      <input
        id={id}
        type="number"
        placeholder="no maximum"
        value={value === null ? '' : String(value)}
        onChange={(e) => onChange(path, e.target.value === '' ? null : Number(e.target.value))}
      />,
    )
  }
  if (type === 'boolean') {
    return row(
      <input
        id={id}
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(path, e.target.checked)}
      />,
    )
  }
  if (type === 'enum' && schema.options) {
    return row(
      <select id={id} value={String(value)} onChange={(e) => onChange(path, e.target.value)}>
        {schema.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>,
    )
  }
  if (type === 'string') {
    return row(
      <input
        id={id}
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
        id={id}
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
      id={id}
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

/**
 * `/config`: every config value (rules numbers, section 18 options, designer rulings) as a form
 * generated from the schema. Saved in this browser; new runs on /play use it.
 */
export function ConfigPage() {
  const store = browserStorage()
  const [loaded] = useState(() => loadConfig(store))
  const [draft, setDraft] = useState<unknown>(loaded.config)
  const [version, setVersion] = useState(0)
  const [message, setMessage] = useState<string | null>(loaded.error)
  const [problems, setProblems] = useState<string[]>([])
  const onChange = (path: Path, next: unknown) => setDraft((d: unknown) => setAt(d, path, next))
  // A link such as /config#cfg-rulings-enemiesPerHex (from /decisions) lands on that field.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id.startsWith('cfg-')) return
    const field = document.getElementById(id)
    field?.scrollIntoView({ block: 'center' })
    field?.focus()
  }, [])
  const save = () => {
    const errors = saveConfig(store, draft)
    setProblems(errors)
    setMessage(errors.length === 0 ? 'Saved. New runs on /play use this config.' : null)
  }
  const reset = () => {
    resetConfig(store)
    setDraft(defaultContent.config)
    setVersion((v) => v + 1)
    setProblems([])
    setMessage('Reset to the defaults.')
  }
  return (
    <div className={styles.page}>
      <p>
        Change any rule value or option for playtests. The config is saved in this browser only. A
        run keeps the config it started with.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={save}>
          Save config
        </button>
        <button type="button" onClick={reset}>
          Reset to defaults
        </button>
      </div>
      <p role="status" className={styles.status}>
        {message}
      </p>
      {problems.length > 0 ? (
        <ul className={styles.problems} role="alert">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : null}
      <form key={version} onSubmit={(e) => e.preventDefault()} aria-label="Config">
        <Field
          schema={GameConfigSchema as unknown as SchemaNode}
          value={draft as GameConfig}
          path={[]}
          onChange={onChange}
        />
      </form>
    </div>
  )
}
