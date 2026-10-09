import {
  defaultConfigMeta,
  defaultContent,
  GameConfigSchema,
  type GameConfig,
} from '@survival/content'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { readAutosave } from '../play/exportRun.ts'
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
  def: Readonly<{ type: string; element?: SchemaNode; innerType?: SchemaNode }>
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
  /** The whole draft config, for choices that come from it (the deck presets). */
  draft: unknown
  problems: ReadonlyMap<string, readonly string[]>
  onChange: (path: Path, next: unknown) => void
}>

/** The choices an id field offers, from the content list (or the draft's presets) it names. */
function choicesFor(
  source: string | undefined,
  draft: unknown,
): readonly (readonly [string, string])[] {
  if (source === 'skills') return defaultContent.skills.map((s) => [s.id, s.name] as const)
  if (source === 'cards') return defaultContent.cards.map((c) => [c.id, c.name] as const)
  if (source === 'presets') {
    const presets = (getAt(draft, ['deck', 'presets']) ?? []) as readonly { id: string }[]
    return presets.map((p) => [p.id, p.id] as const)
  }
  return []
}

/** A select of choices; a value no longer among them (a renamed preset) is kept and flagged. */
function ChoiceSelect(
  props: Readonly<{
    choices: readonly (readonly [string, string])[]
    value: string
    onChange: (next: string) => void
    a11y: Record<string, unknown>
  }>,
) {
  const known = props.choices.some(([id]) => id === props.value)
  return (
    <select {...props.a11y} value={props.value} onChange={(e) => props.onChange(e.target.value)}>
      {known ? null : <option value={props.value}>{props.value} (missing)</option>}
      {props.choices.map(([id, name]) => (
        <option key={id} value={id}>
          {name === id ? id : `${name} (${id})`}
        </option>
      ))}
    </select>
  )
}

/** A slider and a number box for one number; the box takes any value, the slider its range. */
function NumberControl(
  props: Readonly<{
    a11y: Record<string, unknown>
    label: string
    value: unknown
    min: number
    range: readonly [number, number]
    off?: string
    onChange: (next: unknown) => void
  }>,
) {
  const n = typeof props.value === 'number' ? props.value : null
  const [low, high] = [Math.min(props.range[0], n ?? Infinity), Math.max(props.range[1], n ?? 0)]
  return (
    <div className={styles.numberRow}>
      <input
        type="range"
        className={styles.slider}
        aria-label={`${props.label} slider`}
        min={Math.max(low, props.min)}
        max={high}
        step={1}
        disabled={n === null}
        value={n ?? Math.max(low, props.min)}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
      <input
        {...props.a11y}
        type="number"
        min={props.min}
        placeholder={props.off}
        value={props.value === null ? '' : String(props.value)}
        onChange={(e) => {
          const raw = e.target.value
          if (raw.trim() === '') props.onChange(props.off === undefined ? raw : null)
          else props.onChange(Number(raw))
        }}
      />
    </div>
  )
}

/** One config field, chosen from its schema and metadata. */
function Field({ schema, value, path, draft, problems, onChange }: FieldProps): ReactNode {
  const id = fieldId(path)
  const meta = path.length > 0 ? defaultConfigMeta[path.join('.')] : undefined
  const label = meta?.label ?? human(path.at(-1) ?? 'config')
  const type = schema.def.type
  if (type === 'default' && schema.def.innerType) {
    return (
      <Field
        schema={schema.def.innerType}
        value={value}
        path={path}
        draft={draft}
        problems={problems}
        onChange={onChange}
      />
    )
  }
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
            draft={draft}
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
  const labelId = `${id}-label`
  const a11y = {
    id,
    'aria-describedby': errors.length > 0 ? `${helpId} ${errorId}` : helpId,
    'aria-invalid': errors.length > 0 ? true : undefined,
  }
  /** A control group (several inputs) is named by the row label instead of `for`. */
  const groupA11y = {
    id,
    role: 'group',
    tabIndex: -1,
    'aria-labelledby': labelId,
    'aria-describedby': a11y['aria-describedby'],
  }
  const row = (input: ReactNode, grouped = false) => (
    <div className={styles.field}>
      {grouped ? (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      ) : (
        <label id={labelId} htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {input}
      <p id={helpId} className={styles.help}>
        {meta?.help}
        {meta?.unused ? (
          <strong className={styles.unused}>
            {' '}
            Not used by the engine yet: changing it changes nothing.
          </strong>
        ) : null}
        {meta?.rule ? <span className={styles.rule}> Rules {meta.rule}.</span> : null}
      </p>
      {errors.length > 0 ? (
        <p id={errorId} className={styles.error}>
          {errors.join(' ')}
        </p>
      ) : null}
    </div>
  )
  const set = (next: unknown) => onChange(path, next)

  // Numbers: a slider over the metadata range, and a number box for exact values.
  const inner = type === 'nullable' ? schema.unwrap?.() : undefined
  if (type === 'number' || inner?.def.type === 'number') {
    const node = (inner ?? schema) as never
    const min = numberMin(node)
    const range = meta?.range ?? [min, Math.max(10, Number(value) * 2 || 10)]
    if (!inner) {
      return row(
        <NumberControl
          a11y={a11y}
          label={label}
          value={value}
          min={min}
          range={range}
          onChange={set}
        />,
      )
    }
    // An optional limit: a toggle turns it on (at the low end of its range) or off.
    const on = value !== null
    return row(
      <div className={styles.numberRow}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={on}
            aria-label={`${label}: on`}
            onChange={(e) => set(e.target.checked ? Math.max(range[0], min) : null)}
          />
          <span aria-hidden="true">{on ? 'On' : (meta?.empty ?? 'Off')}</span>
        </label>
        <NumberControl
          a11y={a11y}
          label={label}
          value={value}
          min={min}
          range={range}
          off={meta?.empty ?? 'no maximum'}
          onChange={set}
        />
      </div>,
    )
  }
  if (type === 'boolean') {
    return row(
      <span className={styles.toggle}>
        <input
          {...a11y}
          type="checkbox"
          checked={value === true}
          onChange={(e) => set(e.target.checked)}
        />
        <span aria-hidden="true">{value === true ? 'On' : 'Off'}</span>
      </span>,
    )
  }
  if (type === 'enum' && schema.options) {
    return row(
      <select {...a11y} value={String(value)} onChange={(e) => set(e.target.value)}>
        {schema.options.map((o) => (
          <option key={o} value={o}>
            {meta?.options?.[o] ?? o}
          </option>
        ))}
      </select>,
    )
  }
  // Ids: a select of what exists, so a typo cannot reach a run.
  if (type === 'string' && meta?.source) {
    return row(
      <ChoiceSelect
        a11y={a11y}
        choices={choicesFor(meta.source, draft)}
        value={String(value)}
        onChange={set}
      />,
    )
  }
  if (type === 'string') {
    return row(
      <input {...a11y} type="text" value={String(value)} onChange={(e) => set(e.target.value)} />,
    )
  }
  const element = schema.def.element
  const list = Array.isArray(value) ? (value as unknown[]) : []
  // A set of ids (the starter Skills): a toggle for each one that exists, in content order.
  if (type === 'array' && element?.def.type === 'string' && meta?.source) {
    const chosen = new Set(list.map(String))
    const choices = choicesFor(meta.source, draft)
    return row(
      <div {...groupA11y} className={styles.chips}>
        {choices.map(([choice, name]) => (
          <label key={choice} className={styles.chip}>
            <input
              type="checkbox"
              checked={chosen.has(choice)}
              onChange={(e) =>
                set(
                  e.target.checked
                    ? choices.map(([c]) => c).filter((c) => c === choice || chosen.has(c))
                    : list.filter((c) => c !== choice),
                )
              }
            />
            {name}
          </label>
        ))}
      </div>,
      true,
    )
  }
  // A fixed list of enum values: an order (every value once) gets up/down buttons; anything
  // else (the faces of a die) gets a select per item.
  if (type === 'array' && element?.def.type === 'enum' && element.options) {
    const options = element.options
    const phrase = (o: string) => {
      const text = meta?.options?.[o] ?? human(o)
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
    const isOrder = list.length === options.length && new Set(list).size === options.length
    if (isOrder) {
      const move = (i: number, by: number) => {
        const next = [...list]
        ;[next[i], next[i + by]] = [next[i + by], next[i]]
        set(next)
      }
      return row(
        <ol {...groupA11y} className={styles.order}>
          {list.map((item, i) => (
            <li key={String(item)}>
              <span className={styles.orderName}>
                {i + 1}. {phrase(String(item))}
              </span>
              <button
                type="button"
                aria-label={`Move ${phrase(String(item))} up`}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                ▲
              </button>
              <button
                type="button"
                aria-label={`Move ${phrase(String(item))} down`}
                disabled={i === list.length - 1}
                onClick={() => move(i, 1)}
              >
                ▼
              </button>
            </li>
          ))}
        </ol>,
        true,
      )
    }
    return row(
      <div {...groupA11y} className={styles.faces}>
        {list.map((item, i) => (
          <select
            key={i}
            aria-label={`${label}, ${i + 1}`}
            value={String(item)}
            onChange={(e) => set(list.map((v, j) => (j === i ? e.target.value : v)))}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {phrase(o)}
              </option>
            ))}
          </select>
        ))}
      </div>,
      true,
    )
  }
  // A list of numbers (milestone rounds): typed, comma-separated, checked on save.
  if (type === 'array' && element?.def.type === 'number') {
    return row(
      <input
        {...a11y}
        type="text"
        inputMode="numeric"
        defaultValue={list.join(', ')}
        onBlur={(e) =>
          set(
            e.target.value
              .split(',')
              .map((x) => x.trim())
              .filter((x) => x !== '')
              .map(Number),
          )
        }
      />,
    )
  }
  // The deck presets: an editor whose cards come from the card list.
  if (path.join('.') === 'deck.presets') {
    return row(
      <PresetsEditor groupA11y={groupA11y} value={list as Preset[]} onChange={set} />,
      true,
    )
  }
  // Anything else: edit as JSON, checked on save.
  return row(
    <textarea
      {...a11y}
      rows={6}
      defaultValue={JSON.stringify(value, null, 2)}
      onBlur={(e) => {
        try {
          set(JSON.parse(e.target.value))
        } catch {
          set(e.target.value)
        }
      }}
    />,
  )
}

type Preset = { id: string; handSize: number; cards: { card: string; quantity: number }[] }

/** Deck presets: each one's id, hand size, and cards (picked from the card list) with quantities. */
function PresetsEditor(
  props: Readonly<{
    groupA11y: Record<string, unknown>
    value: readonly Preset[]
    onChange: (next: Preset[]) => void
  }>,
) {
  const cards = choicesFor('cards', null)
  const update = (p: number, next: Partial<Preset>) =>
    props.onChange(props.value.map((preset, i) => (i === p ? { ...preset, ...next } : preset)))
  const asCount = (raw: string) => (raw.trim() === '' ? (raw as unknown as number) : Number(raw))
  return (
    <div {...props.groupA11y} className={styles.presets}>
      {props.value.map((preset, p) => {
        const size = preset.cards.reduce((n, c) => n + (Number(c.quantity) || 0), 0)
        return (
          <section key={p} className={styles.preset} aria-label={`Preset ${preset.id}`}>
            <div className={styles.presetHead}>
              <label>
                Id
                <input
                  type="text"
                  value={preset.id}
                  onChange={(e) => update(p, { id: e.target.value })}
                />
              </label>
              <label>
                Hand size
                <input
                  type="number"
                  min={1}
                  value={String(preset.handSize)}
                  onChange={(e) => update(p, { handSize: asCount(e.target.value) })}
                />
              </label>
              <span className={styles.presetSize}>{size} cards</span>
              <button
                type="button"
                disabled={props.value.length === 1}
                onClick={() => props.onChange(props.value.filter((_, i) => i !== p))}
              >
                Remove preset
              </button>
            </div>
            <ul className={styles.presetCards}>
              {preset.cards.map((entry, i) => (
                <li key={i}>
                  <ChoiceSelect
                    a11y={{ 'aria-label': `${preset.id}: card ${i + 1}` }}
                    choices={cards}
                    value={entry.card}
                    onChange={(card) =>
                      update(p, {
                        cards: preset.cards.map((c, j) => (j === i ? { ...c, card } : c)),
                      })
                    }
                  />
                  <input
                    type="number"
                    min={1}
                    aria-label={`${preset.id}: card ${i + 1} quantity`}
                    value={String(entry.quantity)}
                    onChange={(e) =>
                      update(p, {
                        cards: preset.cards.map((c, j) =>
                          j === i ? { ...c, quantity: asCount(e.target.value) } : c,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${preset.id} card ${i + 1}`}
                    disabled={preset.cards.length === 1}
                    onClick={() => update(p, { cards: preset.cards.filter((_, j) => j !== i) })}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() =>
                update(p, { cards: [...preset.cards, { card: cards[0]?.[0] ?? '', quantity: 1 }] })
              }
            >
              Add card
            </button>
          </section>
        )
      })}
      <button
        type="button"
        onClick={() => {
          const last = props.value.at(-1)
          const ids = new Set(props.value.map((x) => x.id))
          let n = props.value.length + 1
          while (ids.has(`preset-${n}`)) n++
          props.onChange([
            ...props.value,
            { id: `preset-${n}`, handSize: last?.handSize ?? 5, cards: last?.cards ?? [] },
          ])
        }}
      >
        Add preset
      </button>
    </div>
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
  const [resumable] = useState(() => readAutosave(store))
  const leaving = useRef(false)
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
    const warn = (e: BeforeUnloadEvent) => {
      if (!leaving.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  /** Saves the draft; true when it was valid and is saved. */
  const save = (): boolean => {
    const errors = saveConfig(store, draft)
    setProblems(errors)
    if (errors.length === 0) setSaved(draft)
    setMessage(
      errors.length === 0
        ? 'Saved. New runs on /play use this config.'
        : `Not saved: ${errors.length === 1 ? '1 field needs' : `${errors.length} fields need`} a fix.`,
    )
    return errors.length === 0
  }
  /** Off to /play: unsaved edits are saved first; a field that needs a fix keeps you here. */
  const play = (href: string) => {
    if (dirty && !save()) return
    leaving.current = true
    window.location.assign(href)
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
          draft={draft}
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
            <button type="button" className="brass" onClick={save}>
              Save config
            </button>
            <button type="button" onClick={() => setConfirming(true)}>
              Reset to defaults
            </button>
            <span className={styles.playActions} role="group" aria-label="Play">
              {resumable ? (
                <button type="button" onClick={() => play('/play?resume')}>
                  Resume run (round {resumable.state.round})
                </button>
              ) : null}
              <button
                type="button"
                className="brass"
                onClick={() => play(`/play?seed=${Date.now() % 100000}&combat=engage`)}
              >
                Start run
              </button>
            </span>
          </div>
        )}
        <p role="status" className={styles.status}>
          {message ?? (dirty ? 'Unsaved changes.' : null)}
        </p>
      </div>
    </div>
  )
}
