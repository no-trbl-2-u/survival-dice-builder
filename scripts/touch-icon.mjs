#!/usr/bin/env node
// scripts/touch-icon.mjs
//
// Renders the home-screen icons, each the favicon (a die on a hex,
// apps/web/public/favicon.svg) on the light background from
// design/tokens.json:
//
//   apple-touch-icon.png   180x180, the shell's rel="apple-touch-icon"
//   icon-192.png           192x192, manifest.webmanifest (purpose any)
//   icon-512.png           512x512, manifest.webmanifest (purpose any)
//   icon-maskable-512.png  512x512, manifest.webmanifest (purpose maskable)
//
// iOS does not use an SVG icon for a home-screen bookmark and fills a
// transparent one with black, so every PNG is opaque. The maskable icon
// keeps the die inside the middle 60%, so Android's round or squircle mask
// never cuts it. The PNGs are committed; run this again only when the
// favicon changes:
//
//   node scripts/touch-icon.mjs
//
// Playwright's own Chromium by default; PW_CHROMIUM names another binary.

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'apps/web/public')
const CHROMIUM = process.env.PW_CHROMIUM || undefined

/** Each icon: file name, edge in pixels, and the share of the edge the die fills. */
const ICONS = [
  { file: 'apple-touch-icon.png', size: 180, fill: 0.8 },
  { file: 'icon-192.png', size: 192, fill: 0.8 },
  { file: 'icon-512.png', size: 512, fill: 0.8 },
  { file: 'icon-maskable-512.png', size: 512, fill: 0.6 },
]

const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'design/tokens.json'), 'utf-8'))
const bg = tokens.light?.['color-bg']
if (!bg) throw new Error('design/tokens.json has no light color-bg')
const svg = fs.readFileSync(path.join(PUBLIC, 'favicon.svg'), 'utf-8')
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

const html = (size, fill) => `<!doctype html><html><head><style>
html, body { margin: 0; }
body { width: ${size}px; height: ${size}px; background: ${bg};
  display: flex; align-items: center; justify-content: center; }
img { width: ${Math.round(size * fill)}px; height: ${Math.round(size * fill)}px; }
</style></head><body>
<img alt="" src="${src}">
</body></html>`

const require = createRequire(path.join(ROOT, 'apps/web/package.json'))
const { chromium } = require('@playwright/test')
const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {})
try {
  for (const { file, size, fill } of ICONS) {
    const page = await browser.newPage({ viewport: { width: size, height: size } })
    await page.setContent(html(size, fill), { waitUntil: 'load' })
    const out = path.join(PUBLIC, file)
    await page.screenshot({ path: out, type: 'png', omitBackground: false })
    await page.close()
    console.log(`touch-icon: wrote ${path.relative(ROOT, out)}`)
  }
} finally {
  await browser.close()
}
