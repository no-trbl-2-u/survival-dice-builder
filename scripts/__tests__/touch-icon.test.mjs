// scripts/__tests__/touch-icon.test.mjs
//
// Tests for scripts/touch-icon.mjs (node:test, no devDeps). The script reads design/tokens.json
// and apps/web/public/favicon.svg from the current directory and loads @playwright/test from its
// apps/web, so each test builds a temp repo with fixture tokens, a stand-in favicon and a stub
// @playwright/test whose browser logs every call and writes the page it was given instead of a
// PNG. No test starts Chromium. Importing the script would run it, so the tests only spawn it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../touch-icon.mjs', import.meta.url))
const PUBLIC = 'apps/web/public'
const FAVICON = `${PUBLIC}/favicon.svg`
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32"/></svg>'

/** Each icon the script writes: file, edge in pixels, and the die's edge in pixels. */
const ICONS = [
  { file: 'apple-touch-icon.png', size: 180, die: 144 },
  { file: 'icon-192.png', size: 192, die: 154 },
  { file: 'icon-512.png', size: 512, die: 410 },
  { file: 'icon-maskable-512.png', size: 512, die: 307 },
]

/** A stub @playwright/test: logs launch, pages, screenshots and closes to STUB_LOG. */
const STUB = `const fs = require('node:fs')
const path = require('node:path')
const log = (entry) => fs.appendFileSync(process.env.STUB_LOG, JSON.stringify(entry) + '\\n')
exports.chromium = {
  async launch(options) {
    log({ launch: options })
    let shots = 0
    return {
      async newPage(options) {
        log({ newPage: options })
        let html = ''
        return {
          async setContent(content, options) { html = content; log({ setContent: options }) },
          async screenshot(options) {
            log({ screenshot: { ...options, path: path.basename(options.path) } })
            shots += 1
            if (process.env.STUB_FAIL && shots === Number(process.env.STUB_FAIL)) {
              throw new Error('stub screenshot failed')
            }
            fs.mkdirSync(path.dirname(options.path), { recursive: true })
            fs.writeFileSync(options.path, html)
          },
          async close() { log({ pageClose: true }) },
        }
      },
      async close() { log({ close: true }) },
    }
  },
}
`

/**
 * Builds a temp repo (tokens, favicon, stub browser, minus any file named in `omit`), runs the
 * script there with the given env, and returns its exit, output, call log and the written icons.
 */
function run({ light = { 'color-bg': '#fbf7ee' }, omit = [], env = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'touch-icon-'))
  const files = {
    'design/tokens.json': JSON.stringify({ light, dark: { 'color-bg': '#000000' } }),
    [FAVICON]: SVG,
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
  const icons = {}
  for (const { file } of ICONS) {
    const out = path.join(root, PUBLIC, file)
    if (fs.existsSync(out)) icons[file] = fs.readFileSync(out, 'utf-8')
  }
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr, calls, icons }
}

test('renders the four icons as opaque PNGs at their sizes and closes the browser', () => {
  const r = run()
  assert.equal(r.status, 0, r.err)
  const expected = [{ launch: {} }]
  for (const { file, size } of ICONS) {
    expected.push(
      { newPage: { viewport: { width: size, height: size } } },
      { setContent: { waitUntil: 'load' } },
      { screenshot: { path: file, type: 'png', omitBackground: false } },
      { pageClose: true },
    )
  }
  expected.push({ close: true })
  assert.deepEqual(r.calls, expected)
  assert.equal(r.out, ICONS.map(({ file }) => `touch-icon: wrote ${PUBLIC}/${file}\n`).join(''))
})

test('each icon is the favicon centred on the light background', () => {
  const { icons } = run()
  const src = `data:image/svg+xml;base64,${Buffer.from(SVG).toString('base64')}`
  for (const { file, size, die } of ICONS) {
    const html = icons[file]
    assert.ok(html, `${file} written`)
    assert.ok(
      html.includes(`body { width: ${size}px; height: ${size}px; background: #fbf7ee;`),
      `${file} is ${size}px on the light background`,
    )
    assert.ok(html.includes(`img { width: ${die}px; height: ${die}px; }`), `${file} die is ${die}px`)
    assert.ok(html.includes(`<img alt="" src="${src}">`), `${file} embeds the favicon`)
    assert.doesNotMatch(html, /#000000/, `${file} uses no dark token`)
    assert.doesNotMatch(html, /src="https?:/, `${file} loads no external resource`)
  }
})

test('the maskable icon keeps the die inside the middle 60%', () => {
  const { icons } = run()
  assert.match(icons['icon-maskable-512.png'], /img \{ width: 307px; height: 307px; \}/)
  assert.match(icons['icon-512.png'], /img \{ width: 410px; height: 410px; \}/)
})

test('PW_CHROMIUM names the browser binary', () => {
  const r = run({ env: { PW_CHROMIUM: '/opt/chromium/chrome' } })
  assert.equal(r.status, 0, r.err)
  assert.deepEqual(r.calls[0], { launch: { executablePath: '/opt/chromium/chrome' } })
})

test('a missing light color-bg stops before the browser starts', () => {
  const r = run({ light: { 'color-text': '#1f1a14' } })
  assert.notEqual(r.status, 0)
  assert.match(r.err, /design\/tokens\.json has no light color-bg/)
  assert.deepEqual(r.calls, [])
  assert.deepEqual(r.icons, {})
})

test('a missing favicon stops before the browser starts', () => {
  const r = run({ omit: [FAVICON] })
  assert.notEqual(r.status, 0)
  assert.match(r.err, /ENOENT[^\n]*favicon\.svg/)
  assert.deepEqual(r.calls, [])
  assert.deepEqual(r.icons, {})
})

test('the browser still closes when a screenshot fails, after the icons before it', () => {
  const r = run({ env: { STUB_FAIL: '2' } })
  assert.notEqual(r.status, 0)
  assert.match(r.err, /stub screenshot failed/)
  assert.deepEqual(r.calls.at(-1), { close: true })
  assert.deepEqual(Object.keys(r.icons), ['apple-touch-icon.png'])
  assert.equal(r.out, `touch-icon: wrote ${PUBLIC}/apple-touch-icon.png\n`)
})
