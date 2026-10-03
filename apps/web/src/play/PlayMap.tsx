import { hexKey, tileHexes, type Action, type GameState } from '@survival/engine'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { gameIcons, ICON_VIEWBOX } from '../icons/gameIcons.ts'
import { hexPolygonPoints, hexToPixel } from '../map/geometry.ts'
import { SITE_LABEL } from '../tiles/TileView.tsx'
import styles from './Play.module.css'
import { hexTargets, ofType } from './targets.ts'

const SIZE = 30
const SITE_ICON: Record<string, string> = {
  base: 'base',
  'gathering-node': 'gathering-node',
  'spawn-node': 'spawn-node',
  'elite-spawn-node': 'elite',
}

type Props = Readonly<{ state: GameState; legal: readonly Action[]; act: (a: Action) => void }>

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
 * The board: tiles, sites, the figure, enemies (shape + icon + health), defenses, and every
 * legal map target as a focusable SVG button. Drag to pan; wheel or buttons to zoom.
 */
export function PlayMap({ state, legal, act }: Props) {
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
    return { key, hex, center: hexToPixel({ q, r }, SIZE) }
  })
  const ghostCenters = [...targets.values()].filter((t) => t.place)
  const all = [
    ...hexes.map((h) => h.center),
    ...ghostCenters.flatMap((t) => tileHexes(t).map((h) => hexToPixel(h, SIZE))),
  ]
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
        {hexes.map(({ key, hex, center }) => (
          <g key={key}>
            <polygon
              className={`${styles.hex} ${styles[hex.terrain] ?? ''}`}
              points={hexPolygonPoints(center, SIZE)}
            >
              <title>{hex.site ? `${hex.terrain}, ${SITE_LABEL[hex.site]}` : hex.terrain}</title>
            </polygon>
            {hex.site ? (
              <Icon
                name={SITE_ICON[hex.site] ?? ''}
                x={center.x}
                y={center.y - SIZE * 0.35}
                size={SIZE * 0.6}
              />
            ) : null}
          </g>
        ))}

        {ghostCenters.map((t) => (
          <g
            key={`ghost-${t.key}`}
            role="button"
            tabIndex={0}
            aria-label={`Place ${state.revealed[0] ?? 'the tile'} here (${t.q},${t.r})`}
            className={styles.ghost}
            onClick={() => t.place && act(t.place)}
            onKeyDown={onKey(() => t.place && act(t.place))}
          >
            {tileHexes(t).map((hx) => (
              <polygon key={hexKey(hx)} points={hexPolygonPoints(hexToPixel(hx, SIZE), SIZE)} />
            ))}
          </g>
        ))}

        {state.defenses.map((d) => {
          const c = hexToPixel(d.hex, SIZE)
          return (
            <g key={d.id}>
              <Icon name={d.kind} x={c.x} y={c.y} size={SIZE * 0.9} />
              <text className={styles.hpText} x={c.x} y={c.y + SIZE * 0.75}>
                {d.health}
              </text>
            </g>
          )
        })}

        {state.players.map((p) => {
          const c = hexToPixel(p.hex, SIZE)
          return (
            <g key={p.id} aria-label={`Your figure at ${p.hex.q},${p.hex.r}`}>
              <circle className={styles.figure} cx={c.x} cy={c.y + SIZE * 0.25} r={SIZE * 0.35} />
              <text className={styles.figureText} x={c.x} y={c.y + SIZE * 0.25}>
                You
              </text>
            </g>
          )
        })}

        {state.enemies.map((e) => {
          const c = hexToPixel(e.hex, SIZE)
          const max = state.content.enemies.enemies.find((x) => x.id === e.kind)?.health ?? e.health
          const target = enemyTargets.get(e.id)
          const r = SIZE * 0.55
          return (
            <g
              key={e.id}
              className={target ? styles.target : undefined}
              {...(target
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': `Target ${e.kind} ${e.id}, ${e.health} of ${max} health`,
                    onClick: () => act(target),
                    onKeyDown: onKey(() => act(target)),
                  }
                : {})}
            >
              {e.kind === 'elite' ? (
                <rect
                  className={styles.elite}
                  x={c.x - r}
                  y={c.y - r}
                  width={r * 2}
                  height={r * 2}
                  rx={3}
                />
              ) : (
                <circle className={styles.grunt} cx={c.x} cy={c.y} r={r} />
              )}
              <Icon name={e.kind} x={c.x} y={c.y} size={r * 1.4} />
              <text className={styles.hpText} x={c.x} y={c.y + r + 8}>
                {e.health}/{max}
              </text>
            </g>
          )
        })}

        {[...targets.values()]
          .filter((t) => t.move || t.builds.length > 0)
          .map((t) => {
            const c = hexToPixel(t, SIZE)
            const action = t.move ?? t.builds[0]
            if (!action) return null
            const label = t.move
              ? `Move to ${t.q},${t.r}`
              : `Build ${t.builds.map((b) => b.defense).join(' or ')} at ${t.q},${t.r}`
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
