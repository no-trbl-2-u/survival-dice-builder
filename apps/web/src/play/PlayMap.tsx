import type { Action, GameEvent, GameState } from '@survival/engine'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { gameIcons, ICON_VIEWBOX } from '../icons/gameIcons.ts'
import { describeAction } from '../debug/describeAction.ts'
import { hexPolygonPoints, hexToPixel } from '../map/geometry.ts'
import { hexTitle } from '../map/places.ts'
import styles from './Play.module.css'
import { hexTargets, ofType } from './targets.ts'

const SIZE = 30
const SITE_ICON: Record<string, string> = {
  base: 'base',
  'gathering-node': 'gathering-node',
  'spawn-node': 'spawn-node',
  'elite-spawn-node': 'elite',
}

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  /** The last action's events: Tower shots are drawn from them. */
  events?: readonly GameEvent[]
}>

/** A CSS transform that places a piece; a change of hex animates (see `.mover`). */
const place = (x: number, y: number) => ({ transform: `translate(${x}px, ${y}px)` })

/** An inline game icon centred on a point. */
function Icon({
  name,
  x,
  y,
  size,
}: Readonly<{ name: string; x: number; y: number; size: number }>) {
  return (
    <g
      className={styles.mapIcon}
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / ICON_VIEWBOX})`}
      // Trusted local markup from assets/icons/game (license-checked, see ASSETS.md).
      dangerouslySetInnerHTML={{ __html: gameIcons[name] ?? '' }}
    />
  )
}

/** Keyboard activation for SVG buttons: Enter or Space. */
const onKey = (run: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    run()
  }
}

/**
 * The board: tiles, sites (a spent gathering node dimmed), the figures, enemies (shape + icon +
 * health), defenses, and every legal map target as a focusable SVG button. A step off the map
 * edge is a dashed ghost hex. Drag to pan; wheel or buttons to zoom.
 */
export function PlayMap({ state, legal, act, events = [] }: Props) {
  const [view, setView] = useState({ x: 0, y: 0, zoom: 1 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const targets = hexTargets(legal)
  const enemyTargets = new Map(ofType(legal, 'chooseTarget').map((a) => [a.enemy, a]))

  useEffect(() => {
    const el = svg.current
    if (!el) return
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      setView((v) => ({
        ...v,
        zoom: Math.min(3, Math.max(0.4, v.zoom * (e.deltaY < 0 ? 1.1 : 0.9))),
      }))
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [])

  const hexes = Object.entries(state.map.hexes).map(([key, hex]) => {
    const [q = 0, r = 0] = key.split(',').map(Number)
    return { key, hex, title: hexTitle(state, { q, r }), center: hexToPixel({ q, r }, SIZE) }
  })
  const offMap = (t: { key: string }) => !state.map.hexes[t.key]
  const ghosts = [...targets.values()].filter((t) => t.move && offMap(t))
  const spent = new Set(state.spentNodes.map((n) => `${n.q},${n.r}`))
  const all = [...hexes.map((h) => h.center), ...ghosts.map((t) => hexToPixel(t, SIZE))]
  const pad = SIZE * 2
  const minX = Math.min(...all.map((p) => p.x)) - pad
  const minY = Math.min(...all.map((p) => p.y)) - pad
  const w = Math.max(...all.map((p) => p.x)) - minX + pad
  const h = Math.max(...all.map((p) => p.y)) - minY + pad
  const vw = w / view.zoom
  const vh = h / view.zoom
  const viewBox = `${minX + (w - vw) / 2 - view.x} ${minY + (h - vh) / 2 - view.y} ${vw} ${vh}`

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[role="button"]')) return
    drag.current = { x: e.clientX, y: e.clientY }
  }
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const start = drag.current
    const el = svg.current
    if (!start || !el) return
    const scale = vw / el.clientWidth
    setView((v) => ({
      ...v,
      x: v.x + (e.clientX - start.x) * scale,
      y: v.y + (e.clientY - start.y) * scale,
    }))
    drag.current = { x: e.clientX, y: e.clientY }
  }

  return (
    <section className={styles.mapPanel} aria-label="Map">
      <div className={styles.mapTools}>
        <button
          type="button"
          onClick={() => setView((v) => ({ ...v, zoom: Math.min(3, v.zoom * 1.25) }))}
        >
          Zoom in
        </button>
        <button
          type="button"
          onClick={() => setView((v) => ({ ...v, zoom: Math.max(0.4, v.zoom / 1.25) }))}
        >
          Zoom out
        </button>
        <button type="button" onClick={() => setView({ x: 0, y: 0, zoom: 1 })}>
          Reset view
        </button>
      </div>
      <svg
        ref={svg}
        className={styles.map}
        viewBox={viewBox}
        data-testid="play-map"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        {hexes.map(({ key, hex, title, center }) => (
          <g key={key} className={styles.tileIn}>
            <polygon
              className={`${styles.hex} ${styles[hex.terrain] ?? ''}`}
              points={hexPolygonPoints(center, SIZE)}
            >
              <title>{title}</title>
            </polygon>
            {hex.site ? (
              <g className={spent.has(key) ? styles.spent : undefined}>
                <Icon
                  name={SITE_ICON[hex.site] ?? ''}
                  x={center.x}
                  y={center.y - SIZE * 0.35}
                  size={SIZE * 0.6}
                />
              </g>
            ) : null}
          </g>
        ))}

        {ghosts.map((t) => (
          <g
            key={`ghost-${t.key}`}
            role="button"
            tabIndex={0}
            aria-label={t.move ? describeAction(t.move, state) : 'Step off the map edge'}
            className={styles.ghost}
            onClick={() => t.move && act(t.move)}
            onKeyDown={onKey(() => t.move && act(t.move))}
          >
            <polygon points={hexPolygonPoints(hexToPixel(t, SIZE), SIZE)} />
          </g>
        ))}

        {state.defenses.map((d) => {
          const c = hexToPixel(d.hex, SIZE)
          return (
            <g key={d.id}>
              <g key={d.health} className={styles.hit}>
                <Icon name={d.kind} x={c.x} y={c.y} size={SIZE * 0.9} />
              </g>
              <text className={styles.hpText} x={c.x} y={c.y + SIZE * 0.75}>
                {d.health}
              </text>
            </g>
          )
        })}

        {state.players.map((p, seat) => {
          // Not placed yet, or knocked out: the figure is off the map (core loop v2).
          if (state.unplaced.includes(p.id) || p.knockedOut) return null
          const c = hexToPixel(p.hex, SIZE)
          const label = state.players.length === 1 ? 'You' : `P${seat + 1}`
          const offset =
            state.players.length === 1 ? 0 : (seat - (state.players.length - 1) / 2) * SIZE * 0.45
          return (
            <g
              key={p.id}
              className={styles.mover}
              style={place(c.x + offset, c.y + SIZE * 0.25)}
              aria-label={`${label === 'You' ? 'Your' : `${label}'s`} figure at ${p.hex.q},${p.hex.r}`}
            >
              <circle
                className={`${styles.figure} ${seat === state.current ? styles.figureCurrent : ''}`}
                cx={0}
                cy={0}
                r={SIZE * 0.3}
              />
              <text className={styles.figureText} x={0} y={0}>
                {label}
              </text>
            </g>
          )
        })}

        {state.enemies.map((e) => {
          const c = hexToPixel(e.hex, SIZE)
          const max = state.content.enemies.enemies.find((x) => x.id === e.kind)?.health ?? e.health
          const target = enemyTargets.get(e.id)
          const r = SIZE * 0.55
          const name = `${e.kind} ${e.id}, ${e.health} of ${max} health`
          return (
            <g
              key={e.id}
              className={`${styles.mover} ${target ? styles.target : ''}`}
              style={place(c.x, c.y)}
              {...(target
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': `Target ${name}`,
                    onClick: () => act(target),
                    onKeyDown: onKey(() => act(target)),
                  }
                : { role: 'img', 'aria-label': name })}
            >
              {e.kind === 'elite' ? (
                <rect className={styles.elite} x={-r} y={-r} width={r * 2} height={r * 2} rx={3} />
              ) : (
                <circle className={styles.grunt} cx={0} cy={0} r={r} />
              )}
              <Icon name={e.kind} x={0} y={0} size={r * 1.4} />
              <text key={e.health} className={`${styles.hpText} ${styles.hit}`} x={0} y={r + 8}>
                {e.health}/{max}
              </text>
            </g>
          )
        })}

        {events.map((ev, i) => {
          if (ev.type !== 'towerAttacked') return null
          const tower = state.defenses.find((d) => d.id === ev.tower)
          const enemy = state.enemies.find((x) => x.id === ev.enemy)
          if (!tower || !enemy) return null
          const a = hexToPixel(tower.hex, SIZE)
          const b = hexToPixel(enemy.hex, SIZE)
          return (
            <line
              key={`shot-${state.log.length}-${i}`}
              className={styles.shot}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          )
        })}

        {[...targets.values()]
          .filter((t) => t.start || (t.move && !offMap(t)) || t.builds.length > 0)
          .map((t) => {
            const c = hexToPixel(t, SIZE)
            const action = t.start ?? t.move ?? t.builds[0]
            if (!action) return null
            const label =
              t.start || t.move
                ? describeAction(action, state)
                : t.builds.map((b) => describeAction(b, state)).join(', or ')
            return (
              <g
                key={`t-${t.key}`}
                role="button"
                tabIndex={0}
                aria-label={label}
                className={styles.legal}
                onClick={() => act(action)}
                onKeyDown={onKey(() => act(action))}
              >
                <polygon points={hexPolygonPoints(c, SIZE * 0.92)} />
              </g>
            )
          })}
      </svg>
    </section>
  )
}
