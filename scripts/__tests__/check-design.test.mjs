// scripts/__tests__/check-design.test.mjs
//
// Tests for scripts/check-design.mjs (node:test, no devDeps). The script reads
// design/tokens.json, apps/web/src/styles/tokens.css, design/**/*.svg and ASSETS.md from the
// current directory, so each test builds a small repo in a temp folder and runs the script
// there. Importing the script would run it, so the tests only spawn it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../check-design.mjs', import.meta.url))

/** A palette per theme that passes every check: full contrast, 2 far-apart terrains. */
function palettes() {
  return {
    light: { surface: '#ffffff', ink: '#000000', 'terrain-forest': '#2e7d32', 'terrain-water': '#1565c0' },
    dark: { surface: '#000000', ink: '#ffffff', 'terrain-forest': '#66bb6a', 'terrain-water': '#64b5f6' },
  }
}

/** tokens.css matching the given palettes: light in :root, dark in the media block. */
function css({ light, dark }) {
  const vars = (palette) => Object.entries(palette).map(([name, value]) => `  --${name}: ${value};`)
  return [':root {', ...vars(light), '}', '@media (prefers-color-scheme: dark) {', ':root {', ...vars(dark), '}', '}', ''].join('\n')
}

/** Builds a temp repo from the given parts, runs the check there. */
function check({
  tokens = { ...palettes(), checks: [{ fg: 'ink', bg: 'surface', min: 4.5, use: 'body text' }] },
  tokensCss = css(palettes()),
  register = '',
  files = {},
} = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'check-design-'))
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), text)
  }
  if (tokens) write('design/tokens.json', JSON.stringify(tokens))
  if (tokensCss !== null) write('apps/web/src/styles/tokens.css', tokensCss)
  write('ASSETS.md', `# Assets\n\n${register}\n`)
  for (const [file, text] of Object.entries(files)) write(file, text)
  const result = spawnSync(process.execPath, [SCRIPT], { cwd: root, encoding: 'utf-8' })
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr }
}

test('consistent tokens, CSS and registered SVG references pass', () => {
  const r = check({
    register: '| Icon | `assets/icons/a.svg` |',
    files: {
      'assets/icons/a.svg': '<svg/>',
      'design/mockups/board.svg': '<svg><use href="../../assets/icons/a.svg"/><use href="#local"/></svg>',
    },
  })
  assert.equal(r.status, 0, r.err)
  assert.match(
    r.out,
    /check-design: 2 contrast pairs pass, 2 terrain pairs are distinct, tokens\.css in sync, 1 design SVG\(s\) use registered assets\./,
  )
})

test('no design/tokens.json skips the check', () => {
  const r = check({ tokens: null })
  assert.equal(r.status, 0)
  assert.match(r.out, /check-design: no design\/tokens\.json yet, skipping\./)
})

test('a pair under its contrast minimum fails in the theme it fails in', () => {
  const tokens = { ...palettes(), checks: [{ fg: 'ink', bg: 'surface', min: 4.5, use: 'body text' }] }
  tokens.light = { ...tokens.light, ink: '#777777', surface: '#888888' }
  const r = check({ tokens, tokensCss: css(tokens) })
  assert.equal(r.status, 1)
  assert.match(r.err, /check-design: 1 problem\(s\)/)
  assert.match(r.err, /light: ink #777777 on surface #888888 = 1\.\d\d < 4\.5 \(body text\)/)
})

test('a check naming a token neither theme has fails in both', () => {
  const tokens = { ...palettes(), checks: [{ fg: 'accent', bg: 'surface', min: 3, use: 'links' }] }
  const r = check({ tokens })
  assert.equal(r.status, 1)
  assert.match(r.err, /light: unknown token in check accent on surface/)
  assert.match(r.err, /dark: unknown token in check accent on surface/)
})

test('2 terrain colours closer than delta E 20 fail', () => {
  const tokens = { ...palettes(), checks: [] }
  tokens.dark = { ...tokens.dark, 'terrain-water': '#60b865' }
  const r = check({ tokens, tokensCss: css(tokens) })
  assert.equal(r.status, 1)
  assert.match(r.err, /dark: terrain-forest #66bb6a and terrain-water #60b865 differ by \d+\.\d < 20 \(delta E\)/)
  assert.doesNotMatch(r.err, /light:/)
})

test('tokens.css with a missing or different token fails; case does not matter', () => {
  const r = check({
    tokensCss: css({
      light: { surface: '#FFFFFF', ink: '#000000', 'terrain-forest': '#2e7d32' },
      dark: { surface: '#111111', ink: '#ffffff', 'terrain-forest': '#66bb6a', 'terrain-water': '#64b5f6' },
    }),
  })
  assert.equal(r.status, 1)
  assert.match(r.err, /check-design: 2 problem\(s\)/)
  assert.match(r.err, /tokens\.css \(light\): missing --terrain-water/)
  assert.match(r.err, /tokens\.css \(dark\): --surface is #111111, tokens\.json says #000000/)
})

test('no tokens.css skips the sync check', () => {
  const r = check({ tokensCss: null })
  assert.equal(r.status, 0, r.err)
})

test('a design SVG with an external, missing or unregistered reference fails', () => {
  const r = check({
    register: '| Icon | `assets/icons/a.svg` |',
    files: {
      'assets/icons/a.svg': '<svg/>',
      'assets/icons/b.svg': '<svg/>',
      'design/board.svg': [
        '<svg>',
        '<image href="https://example.org/x.png"/>',
        '<image href="../assets/icons/gone.svg"/>',
        '<image href="../assets/icons/b.svg"/>',
        '<image href="../assets/icons/a.svg"/>',
        '</svg>',
      ].join(''),
    },
  })
  assert.equal(r.status, 1)
  assert.match(r.err, /check-design: 3 problem\(s\)/)
  assert.match(r.err, /design\/board\.svg: external reference https:\/\/example\.org\/x\.png/)
  assert.match(r.err, /design\/board\.svg: \.\.\/assets\/icons\/gone\.svg does not exist/)
  assert.match(r.err, /design\/board\.svg: assets\/icons\/b\.svg is not registered in ASSETS\.md/)
})
