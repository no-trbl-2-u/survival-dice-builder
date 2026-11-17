// scripts/__tests__/og-card.test.mjs
//
// Tests for scripts/og-card.mjs (node:test, no devDeps). The script reads design/tokens.json and
// the two font files from the current directory and loads @playwright/test from its apps/web,
// so each test builds a temp repo with fixture tokens, stand-in font bytes and a stub
// @playwright/test whose browser logs every call and writes the page it was given instead of a
// PNG. No test starts Chromium. Importing the script would run it, so the tests only spawn it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../og-card.mjs', import.meta.url))
const OUT = 'apps/web/public/og-card.png'
const ALFA = 'apps/web/node_modules/@fontsource/alfa-slab-one/files/alfa-slab-one-latin-400-normal.woff2'
const BITTER = 'apps/web/node_modules/@fontsource-variable/bitter/files/bitter-latin-wght-normal.woff2'

const LIGHT = {
  'color-bg': '#fbf7ee',
  'color-text': '#1f1a14',
  'color-text-muted': '#5a5045',
  'color-border': '#b9a98f',
  'color-surface': '#fffdf8',
}

/** A stub @playwright/test: logs launch, pages, screenshots and close to STUB_LOG. */
const STUB = `const fs = require('node:fs')
const path = require('node:path')
const log = (entry) => fs.appendFileSync(process.env.STUB_LOG, JSON.stringify(entry) + '\\n')
exports.chromium = {
  async launch(options) {
    log({ launch: options })
    return {
      async newPage(options) {
        log({ newPage: options })
        let html = ''
        return {
          async setContent(content, options) { html = content; log({ setContent: options }) },
          async evaluate() { log({ evaluate: true }) },
          async screenshot(options) {
            log({ screenshot: options })
            if (process.env.STUB_FAIL) throw new Error('stub screenshot failed')
            fs.mkdirSync(path.dirname(options.path), { recursive: true })
            fs.writeFileSync(options.path, html)
          },
        }
      },
      async close() { log({ close: true }) },
    }
  },
}
`

/**
 * Builds a temp repo (tokens, fonts, stub browser, minus any file named in `omit`), runs the
 * script there with the given env, and returns its exit, output, call log and the written card.
 */
function run({ light = LIGHT, omit = [], env = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'og-card-'))
  const files = {
    'design/tokens.json': JSON.stringify({ light, dark: { 'color-bg': '#000000' } }),
    [ALFA]: 'alfa-bytes',
    [BITTER]: 'bitter-bytes',
    'apps/web/package.json': '{"name":"web","private":true}',
    'apps/web/node_modules/@playwright/test/package.json':
      '{"name":"@playwright/test","main":"index.js"}',
    'apps/web/node_modules/@playwright/test/index.js': STUB,
  }
  for (const [file, text] of Object.entries(files)) {
    if (omit.includes(file)) continue
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), text)
  }
  const logFile = path.join(root, 'stub.log')
  const result = spawnSync(process.execPath, [SCRIPT], {
    cwd: root,
    encoding: 'utf-8',
    env: { ...process.env, PW_CHROMIUM: '', STUB_FAIL: '', ...env, STUB_LOG: logFile },
  })
  const calls = fs.existsSync(logFile)
    ? fs.readFileSync(logFile, 'utf-8').trim().split('\n').map((line) => JSON.parse(line))
    : []
  const outFile = path.join(root, OUT)
  const card = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf-8') : null
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr, calls, card }
}

const b64 = (text) => Buffer.from(text).toString('base64')

test('renders a 1200x630 PNG to apps/web/public/og-card.png and closes the browser', () => {
  const r = run()
  assert.equal(r.status, 0, r.err)
  assert.deepEqual(r.calls, [
    { launch: {} },
    { newPage: { viewport: { width: 1200, height: 630 } } },
    { setContent: { waitUntil: 'load' } },
    { evaluate: true },
    { screenshot: { path: r.calls[4].screenshot.path, type: 'png' } },
    { close: true },
  ])
  assert.ok(r.calls[4].screenshot.path.endsWith(path.join('apps', 'web', 'public', 'og-card.png')))
  assert.equal(r.out, `og-card: wrote ${OUT}\n`)
})

test('the card is the title and tagline in the light palette', () => {
  const { card } = run()
  assert.match(card, /<h1>Survival<br>Dice-Builder<\/h1>/)
  assert.match(card, /<p>Defend the base together, build your dice, survive one more round\.<\/p>/)
  assert.match(card, /body \{ width: 1200px; height: 630px; background: #fbf7ee; color: #1f1a14;/)
  assert.match(card, /border: 18px solid #b9a98f;/)
  assert.match(card, /p \{[^}]*color: #5a5045; \}/)
  assert.match(card, /<rect [^>]*fill="#fffdf8" stroke="#1f1a14"/)
  assert.doesNotMatch(card, /#000000/, 'no dark token')
})

test('the card draws a hex of six points and a die of three pips', () => {
  const { card } = run()
  const points = card.match(/<polygon points="([^"]+)"/)[1].split(' ')
  assert.equal(points.length, 6)
  assert.equal(points[0], '150.0,15.0', 'pointy top: first corner straight above the centre')
  assert.equal(points[3], '150.0,315.0')
  assert.equal(card.match(/<circle /g).length, 3)
})

test('both fonts are embedded as base64 woff2 data URLs', () => {
  const { card } = run()
  assert.ok(
    card.includes(
      `@font-face { font-family: 'Alfa Slab One'; src: url("data:font/woff2;base64,${b64('alfa-bytes')}"); }`,
    ),
  )
  assert.ok(
    card.includes(
      `@font-face { font-family: 'Bitter'; font-weight: 100 900; src: url("data:font/woff2;base64,${b64('bitter-bytes')}"); }`,
    ),
  )
  assert.doesNotMatch(card, /https?:\/\//, 'no external resource')
})

test('PW_CHROMIUM names the browser binary', () => {
  const r = run({ env: { PW_CHROMIUM: '/opt/chromium/chrome' } })
  assert.equal(r.status, 0, r.err)
  assert.deepEqual(r.calls[0], { launch: { executablePath: '/opt/chromium/chrome' } })
})

test('a missing light token stops before the browser starts', () => {
  const light = { ...LIGHT }
  delete light['color-border']
  const r = run({ light })
  assert.notEqual(r.status, 0)
  assert.match(r.err, /design\/tokens\.json has no light color-border/)
  assert.deepEqual(r.calls, [])
  assert.equal(r.card, null)
})

test('a missing font file stops before the browser starts', () => {
  const r = run({ omit: [BITTER] })
  assert.notEqual(r.status, 0)
  assert.match(r.err, /ENOENT[^\n]*bitter-latin-wght-normal\.woff2/)
  assert.deepEqual(r.calls, [])
  assert.equal(r.card, null)
})

test('the browser still closes when the screenshot fails', () => {
  const r = run({ env: { STUB_FAIL: '1' } })
  assert.notEqual(r.status, 0)
  assert.match(r.err, /stub screenshot failed/)
  assert.deepEqual(r.calls.at(-1), { close: true })
  assert.equal(r.card, null)
  assert.equal(r.out, '')
})
