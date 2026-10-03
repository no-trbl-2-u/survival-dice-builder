#!/usr/bin/env node
// scripts/check-design.mjs
//
// Keeps the art guide honest (phase 10 brief):
//   1. every contrast pair in design/tokens.json meets its minimum (WCAG 2.x relative
//      luminance) in the light and the dark theme;
//   2. apps/web/src/styles/tokens.css carries every token with the same value (light in
//      :root, dark in the prefers-color-scheme: dark block);
//   3. every file a design SVG references (href="...") exists and is registered in ASSETS.md;
//   4. every pair of terrain colours is at least TERRAIN_MIN_DELTA_E apart (CIE76) in each
//      theme, so 2 terrains never look alike side by side.
//
//   exit 0  ->  all good
//   exit 1  ->  problems (each printed)

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TOKENS = path.join(ROOT, 'design', 'tokens.json')
const CSS = path.join(ROOT, 'apps', 'web', 'src', 'styles', 'tokens.css')
const DESIGN = path.join(ROOT, 'design')
const problems = []

if (!fs.existsSync(TOKENS)) {
  console.log('check-design: no design/tokens.json yet, skipping.')
  process.exit(0)
}
const tokens = JSON.parse(fs.readFileSync(TOKENS, 'utf-8'))

/** sRGB hex -> relative luminance (WCAG 2.x). */
function luminance(hex) {
  const n = hex.replace('#', '')
  const channels = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Contrast ratio between two hex colours. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// 1. Contrast pairs.
for (const theme of ['light', 'dark']) {
  const palette = tokens[theme]
  for (const check of tokens.checks) {
    const fg = palette[check.fg]
    const bg = palette[check.bg]
    if (!fg || !bg) {
      problems.push(`${theme}: unknown token in check ${check.fg} on ${check.bg}`)
      continue
    }
    const ratio = contrast(fg, bg)
    if (ratio < check.min) {
      problems.push(
        `${theme}: ${check.fg} ${fg} on ${check.bg} ${bg} = ${ratio.toFixed(2)} < ${check.min} (${check.use})`,
      )
    }
  }
}

/** sRGB hex -> CIE L*a*b* (D65). */
function lab(hex) {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const xyz = [
    (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047,
    r * 0.2126 + g * 0.7152 + b * 0.0722,
    (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883,
  ]
  const [fx, fy, fz] = xyz.map((t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116))
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

/** Colour difference between two hex colours (CIE76 delta E). */
export function deltaE(a, b) {
  const [p, q] = [lab(a), lab(b)]
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

// 4 (run early, reported with the rest). Terrain colours stay apart.
const TERRAIN_MIN_DELTA_E = 20
let terrainPairs = 0
for (const theme of ['light', 'dark']) {
  const terrains = Object.entries(tokens[theme]).filter(([name]) => name.startsWith('terrain-'))
  for (let i = 0; i < terrains.length; i++) {
    for (let j = i + 1; j < terrains.length; j++) {
      const [[a, av], [b, bv]] = [terrains[i], terrains[j]]
      const d = deltaE(av, bv)
      terrainPairs++
      if (d < TERRAIN_MIN_DELTA_E)
        problems.push(`${theme}: ${a} ${av} and ${b} ${bv} differ by ${d.toFixed(1)} < ${TERRAIN_MIN_DELTA_E} (delta E)`)
    }
  }
}

// 2. tokens.css in sync.
if (fs.existsSync(CSS)) {
  const css = fs.readFileSync(CSS, 'utf-8')
  const darkStart = css.indexOf('@media (prefers-color-scheme: dark)')
  const blocks = { light: css.slice(0, darkStart), dark: css.slice(darkStart) }
  for (const theme of ['light', 'dark']) {
    for (const [name, value] of Object.entries(tokens[theme])) {
      const match = blocks[theme].match(new RegExp(`--${name}:\\s*([^;]+);`))
      if (!match) problems.push(`tokens.css (${theme}): missing --${name}`)
      else if (match[1].trim().toLowerCase() !== value.toLowerCase())
        problems.push(`tokens.css (${theme}): --${name} is ${match[1].trim()}, tokens.json says ${value}`)
    }
  }
}

// 3. Design SVGs reference only registered assets.
const register = fs.readFileSync(path.join(ROOT, 'ASSETS.md'), 'utf-8')
function svgs(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? svgs(full) : e.name.endsWith('.svg') ? [full] : []
  })
}
for (const file of svgs(DESIGN)) {
  const text = fs.readFileSync(file, 'utf-8')
  for (const [, href] of text.matchAll(/href="([^"#][^"]*)"/g)) {
    if (/^https?:/.test(href)) {
      problems.push(`${path.relative(ROOT, file)}: external reference ${href}`)
      continue
    }
    const target = path.relative(ROOT, path.resolve(path.dirname(file), href)).split(path.sep).join('/')
    if (!fs.existsSync(path.join(ROOT, target))) problems.push(`${path.relative(ROOT, file)}: ${href} does not exist`)
    else if (!register.includes(`\`${target}\``))
      problems.push(`${path.relative(ROOT, file)}: ${target} is not registered in ASSETS.md`)
  }
}

if (problems.length > 0) {
  console.error(`check-design: ${problems.length} problem(s)`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(
  `check-design: ${tokens.checks.length * 2} contrast pairs pass, ${terrainPairs} terrain pairs are distinct, tokens.css in sync, ${svgs(DESIGN).length} design SVG(s) use registered assets.`,
)
