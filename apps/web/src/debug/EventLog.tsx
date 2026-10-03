import type { GameEvent } from '@survival/engine'

type Props = Readonly<{ events: readonly GameEvent[] }>

/** Shows an event as `type` plus its payload, without the repeated `type` and `rule` keys. */
function payload(event: GameEvent): string {
  return Object.entries(event)
    .filter(([k]) => k !== 'type' && k !== 'rule')
    .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join('/') : String(v)}`)
    .join(' ')
}

/** The event log, newest last, each line tagged with the rule that produced it. */
export function EventLog({ events }: Props) {
  return (
    <section aria-labelledby="log-heading">
      <h2 id="log-heading">Event log ({events.length})</h2>
      <ol
        data-testid="log"
        role="log"
        aria-live="polite"
        style={{ fontFamily: 'var(--font-number)', fontSize: '0.8125rem' }}
      >
        {events.map((event, i) => (
          <li key={i}>
            <strong>[{event.rule}]</strong> {event.type} {payload(event)}
          </li>
        ))}
      </ol>
    </section>
  )
}
