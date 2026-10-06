import type { Face } from '@survival/content'
import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import { faceIcon, gameIcons, ICON_VIEWBOX } from '../icons/gameIcons.ts'
import styles from './Dice3D.module.css'
import { faceLayout, poseAt, throwFor } from './orientation.ts'

type Props = Readonly<{ faces: readonly Face[]; kept: readonly boolean[]; roll: number }>

const DURATION = 900
const TEXTURE = 128
const GAP = 1.5

/**
 * A die-face texture: the icon's paths drawn on a canvas (no image loading), in the face's
 * colour with a dark outline, on the off-white die.
 */
function faceTexture(face: Face, ink: string, outline: string, paper: string): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE
  canvas.height = TEXTURE
  const g = canvas.getContext('2d')
  if (g) {
    g.fillStyle = paper
    g.fillRect(0, 0, TEXTURE, TEXTURE)
    g.fillStyle = ink
    g.strokeStyle = outline
    g.lineWidth = 26
    g.lineJoin = 'round'
    const pad = TEXTURE * 0.14
    g.translate(pad, pad)
    g.scale((TEXTURE - pad * 2) / ICON_VIEWBOX, (TEXTURE - pad * 2) / ICON_VIEWBOX)
    const markup = gameIcons[faceIcon(face)] ?? ''
    for (const m of markup.matchAll(/\sd="([^"]+)"/g)) {
      const path = new Path2D(m[1])
      g.stroke(path)
      g.fill(path)
    }
  }
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/** Whether this browser can draw WebGL (checked once, on a throwaway canvas). */
function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'))
  } catch {
    return false
  }
}

/** A CSS colour token's value (falls back for tests and old browsers). */
const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

/**
 * The 3D dice tray (optional, presentation only). The engine has already rolled: each die
 * tumbles and lands with the engine's face on top (`orientation.ts`). Kept dice do not move.
 */
export default function Dice3D({ faces, kept, roll }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [webgl] = useState(hasWebGL)
  const [frameMs, setFrameMs] = useState<number | null>(null)
  const key = `${roll}:${faces.join(',')}`

  useEffect(() => {
    const el = canvas.current
    if (!el || !webgl) return
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ canvas: el, antialias: true, alpha: true })
    } catch {
      return
    }
    const width = el.clientWidth || 480
    const height = el.clientHeight || 140
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(width, height, false)

    const span = Math.max(faces.length, 1) * GAP
    const aspect = width / height
    const viewH = Math.max(3, span / aspect)
    const camera = new OrthographicCamera(
      (-viewH * aspect) / 2,
      (viewH * aspect) / 2,
      viewH / 2,
      -viewH / 2,
      0.1,
      100,
    )
    camera.position.set(0, 6, 6)
    camera.lookAt(0, 0, 0)
    const scene = new Scene()
    scene.add(new AmbientLight(0xffffff, 1.6))
    const sun = new DirectionalLight(0xffffff, 1.8)
    sun.position.set(2, 8, 4)
    scene.add(sun)

    const paper = token('--die-paper', '#f8f3e8')
    const outline = token('--die-outline', '#3d2a18')
    const ink = (f: Face) => token(`--face-${f.toLowerCase()}`, outline)
    const geometry = new BoxGeometry(1, 1, 1)
    const textures = new Map<Face, CanvasTexture>()
    const tex = (f: Face) => {
      const t = textures.get(f) ?? faceTexture(f, ink(f), outline, paper)
      textures.set(f, t)
      return t
    }
    const materials: MeshStandardMaterial[] = []
    const dice = faces.map((face, i) => {
      const mats = faceLayout(face).map((f) => new MeshStandardMaterial({ map: tex(f) }))
      materials.push(...mats)
      const mesh = new Mesh(geometry, mats)
      mesh.position.x = (i - (faces.length - 1) / 2) * GAP
      scene.add(mesh)
      return { mesh, th: throwFor(i, roll), still: kept[i] ?? false }
    })

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const start = performance.now()
    let frames = 0
    let raf = 0
    const draw = (now: number) => {
      const t = reduced ? 1 : (now - start) / DURATION
      for (const d of dice) {
        const p = poseAt(d.still ? 1 : t, d.th)
        d.mesh.rotation.set(p.x, p.y, p.z)
        d.mesh.position.y = p.height
      }
      renderer.render(scene, camera)
      frames++
      if (t < 1) raf = requestAnimationFrame(draw)
      else setFrameMs(frames > 1 ? Math.round((now - start) / frames) : null)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      geometry.dispose()
      materials.forEach((m) => m.dispose())
      textures.forEach((t) => t.dispose())
      renderer.dispose()
    }
    // Re-throw only when the engine rolls (key), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (!webgl) {
    return (
      <p className={styles.note}>
        3D dice need WebGL, which this browser does not offer. The 2D dice are below.
      </p>
    )
  }
  return (
    <canvas
      ref={canvas}
      className={styles.canvas}
      data-testid="dice-3d"
      data-frame-ms={frameMs ?? undefined}
      aria-hidden="true"
    />
  )
}
