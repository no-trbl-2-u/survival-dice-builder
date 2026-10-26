import type { GameEvent } from '@survival/engine'

type Props = Readonly<{ events: readonly GameEvent[] }>

/** One payload value: a hex as "(q,r)", a list joined by "/", any other object as JSON. */
export function showValue(v: unknown): string {
  if (Array.isArray(v)) return v.map(showValue).join('/')
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (typeof o.q === 'number' && typeof o.r === 'number' && Object.keys(o).length === 2)
      return `(${o.q},${o.r})`
    return JSON.stringify(v)
  }
  return String(v)
}

/**
 * The bracketed tag for an event's rule: a section number of the written rules ("7.8",
 * "7.8, Table 9") as it is, and any other tag ("Combat v3", a designer ruling) as "not in the
 * written rules", since it names no section a reader can look up.
 */
export function ruleTag(rule: string): string {
  return /^\d/.test(rule) ? rule : 'not in the written rules'
}

/** Shows an event as `type` plus its payload, without the repeated `type` and `rule` keys. */
function payload(event: GameEvent): string {
  return Object.entries(event)
    .filter(([k]) => k !== 'type' && k !== 'rule')
    .map(([k, v]) => `${k}=${showValue(v)}`)
    .join(' ')
}

/**
 * The event log, newest last, each line tagged with the rule that produced it. Not a live region:
 * one Autoplay adds hundreds of lines, so the console's status line sums up each step instead.
 */
export function EventLog({ events }: Props) {
  return (
    <section aria-labelledby="log-heading">
      <h2 id="log-heading">Event log ({events.length})</h2>
      <ol data-testid="log" style={{ fontFamily: 'var(--font-number)', fontSize: '0.8125rem' }}>
        {events.map((event, i) => (
          <li key={i}>
            <strong>[{ruleTag(event.rule)}]</strong> {event.type} {payload(event)}
          </li>
        ))}
      </ol>
    </section>
  )
}
