#!/usr/bin/env node
// scripts/og-card.mjs
//
// Renders the link-preview image (`og:image`) every page names:
// apps/web/public/og-card.png, 1200x630, in the light palette from
// design/tokens.json with the site's two fonts (self-hosted @fontsource
// files, SIL OFL 1.1, see ASSETS.md). The PNG is committed; run this again
// only when the card changes:
//
//   node scripts/og-card.mjs
//
// Playwright's own Chromium by default; PW_CHROMIUM names another binary.

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'apps/web/public/og-card.png')
const WEB_MODULES = path.join(ROOT, 'apps/web/node_modules')
const CHROMIUM = process.env.PW_CHROMIUM || undefined

const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'design/tokens.json'), 'utf-8'))
/** A light-theme colour from design/tokens.json. */
const light = (name) => {
  const value = tokens.light?.[name]
  if (!value) throw new Error(`design/tokens.json has no light ${name}`)
  return value
}

const font = (file) =>
  `url("data:font/woff2;base64,${fs.readFileSync(path.join(WEB_MODULES, file)).toString('base64')}")`

const hex = (cx, cy, r) =>
  [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
    })
    .join(' ')

const html = `<!doctype html><html><head><style>
@font-face { font-family: 'Alfa Slab One'; src: ${font('@fontsource/alfa-slab-one/files/alfa-slab-one-latin-400-normal.woff2')}; }
@font-face { font-family: 'Bitter'; font-weight: 100 900; src: ${font('@fontsource-variable/bitter/files/bitter-latin-wght-normal.woff2')}; }
html, body { margin: 0; }
svg { flex: none; }
body { width: 1200px; height: 630px; background: ${light('color-bg')}; color: ${light('color-text')};
  display: flex; align-items: center; gap: 56px; padding: 0 88px; box-sizing: border-box;
  border: 18px solid ${light('color-border')}; }
h1 { font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 84px; line-height: 1.02; margin: 0 0 28px; }
p { font-family: 'Bitter', serif; font-size: 38px; line-height: 1.3; margin: 0; color: ${light('color-text-muted')}; }
</style></head><body>
<svg width="260" height="286" viewBox="0 0 300 330" aria-hidden="true">
  <polygon points="${hex(150, 165, 150)}" fill="#d8e6b0" stroke="${light('color-text')}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="82" y="97" width="136" height="136" rx="22" fill="${light('color-surface')}" stroke="${light('color-text')}" stroke-width="8"/>
  <circle cx="116" cy="131" r="14" fill="${light('color-text')}"/>
  <circle cx="150" cy="165" r="14" fill="${light('color-text')}"/>
  <circle cx="184" cy="199" r="14" fill="${light('color-text')}"/>
</svg>
<div><h1>Survival<br>Dice-Builder</h1>
<p>Defend the base together, build your dice, survive one more round.</p></div>
</body></html>`

const require = createRequire(path.join(ROOT, 'apps/web/package.json'))
const { chromium } = require('@playwright/test')
const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {})
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: OUT, type: 'png' })
  console.log(`og-card: wrote ${path.relative(ROOT, OUT)}`)
} finally {
  await browser.close()
}
