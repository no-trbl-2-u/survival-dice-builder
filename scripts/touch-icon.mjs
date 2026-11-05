#!/usr/bin/env node
// scripts/touch-icon.mjs
//
// Renders the home-screen icon the shell links (`rel="apple-touch-icon"`):
// apps/web/public/apple-touch-icon.png, 180x180, the favicon (a die on a
// hex, apps/web/public/favicon.svg) on the light background from
// design/tokens.json. iOS does not use an SVG icon for a home-screen
// bookmark and fills a transparent one with black, so the PNG is opaque.
// The PNG is committed; run this again only when the favicon changes:
//
//   node scripts/touch-icon.mjs
//
// Playwright's own Chromium by default; PW_CHROMIUM names another binary.

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'apps/web/public/apple-touch-icon.png')
const SIZE = 180
const CHROMIUM = process.env.PW_CHROMIUM || undefined

const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'design/tokens.json'), 'utf-8'))
const bg = tokens.light?.['color-bg']
if (!bg) throw new Error('design/tokens.json has no light color-bg')
const svg = fs.readFileSync(path.join(ROOT, 'apps/web/public/favicon.svg'), 'utf-8')

const html = `<!doctype html><html><head><style>
html, body { margin: 0; }
body { width: ${SIZE}px; height: ${SIZE}px; background: ${bg};
  display: flex; align-items: center; justify-content: center; }
img { width: 144px; height: 144px; }
</style></head><body>
<img alt="" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">
</body></html>`

const require = createRequire(path.join(ROOT, 'apps/web/package.json'))
const { chromium } = require('@playwright/test')
const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {})
try {
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } })
  await page.setContent(html, { waitUntil: 'load' })
  await page.screenshot({ path: OUT, type: 'png', omitBackground: false })
  console.log(`touch-icon: wrote ${path.relative(ROOT, OUT)}`)
} finally {
  await browser.close()
}
