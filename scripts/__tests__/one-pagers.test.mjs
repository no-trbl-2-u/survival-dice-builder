// scripts/__tests__/one-pagers.test.mjs
//
// Tests for scripts/one-pagers.mjs (node:test, no devDeps). The script reads
// design/one-pagers/v2/pages/*.html from the current directory, so each test builds a small
// repo in a temp folder and runs the script there. Importing the script would run it, so the
// tests only spawn it. No test renders or merges: those need Chromium, pypdf and poppler, and
// with no build/ folder and no merged PDF the check and lint paths never call them.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../one-pagers.mjs', import.meta.url))
const PAGES = 'design/one-pagers/v2/pages'

/** A labelled vector diagram: 6 shapes and a text label. */
const DIAGRAM =
  '<svg viewBox="0 0 10 10"><rect/><rect/><circle/><circle/><path/><line/><text>Base</text></svg>'

/** One sheet that passes every check the script can make without rendering. */
function page({
  body = 'Defend the base. Roll your dice. Survive one more round.',
  orientation = 'portrait',
  diagram = DIAGRAM,
  foot = 'A1-L1 · 2026-11-17 · src: FACTS F-001',
  head = '',
} = {}) {
  return [
    '<!doctype html><html><head>',
    `<style>@page { size: Letter ${orientation}; margin: 0; }</style>`,
    head,
    '</head><body>',
    '<!-- a comment may say button or screen -->',
    `<div class="sheet ${orientation}">`,
    `<h1>Survival</h1><p>${body}</p>`,
    diagram,
    `<div class="sheet-foot">${foot}</div>`,
    '</div></body></html>',
  ].join('\n')
}

/** 15 good page files, p01 to p15, with any overrides by number. */
function pages(overrides = {}, count = 15) {
  const files = {}
  for (let n = 1; n <= count; n++) {
    const id = String(n).padStart(2, '0')
    files[`${PAGES}/p${id}-sheet.html`] = overrides[n] ?? page()
  }
  return files
}

/** Builds a temp repo from the given files, runs the script there with the given args. */
function run(args, files = pages(), inspect) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'one-pagers-'))
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), text)
  }
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { cwd: root, encoding: 'utf-8' })
  const seen = inspect ? inspect(root) : undefined
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr, seen }
}

/** Runs lint on one page in a temp folder and parses its JSON report. */
const lintReport = (html) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'one-pagers-lint-'))
  const file = path.join(root, 'p01-sheet.html')
  fs.writeFileSync(file, html)
  const result = spawnSync(process.execPath, [SCRIPT, 'lint', file], {
    cwd: root,
    encoding: 'utf-8',
  })
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, report: JSON.parse(result.stdout) }
}

test('check passes 15 clean sheets with no build and no merged PDF', () => {
  const r = run(['check'])
  assert.equal(r.status, 0, r.err)
  assert.match(r.out, /check: ok/)
})

test('check counts the page files, and only p<NN>-*.html ones', () => {
  const files = pages({}, 14)
  files[`${PAGES}/notes.html`] = page()
  files[`${PAGES}/p1-short.html`] = page()
  const r = run(['check'], files)
  assert.equal(r.status, 1)
  assert.match(r.err, /expected 15 page files, found 14/)
  assert.match(r.out, /check: 1 problem\(s\)/)
})

test('check names a banned word in visible text, case-insensitive', () => {
  const r = run(['check'], pages({ 3: page({ body: 'Press the Button to roll.' }) }))
  assert.equal(r.status, 1)
  assert.match(r.err, /p03-sheet\.html: banned words button/)
})

test('check ignores banned words in comments, styles and SVG', () => {
  const svg = DIAGRAM.replace('<text>Base</text>', '<text>screen</text>')
  const r = run(['check'], pages({ 4: page({ diagram: svg, head: '<style>.debug{}</style>' }) }))
  assert.equal(r.status, 0, r.err)
})

test('check pads words that need a boundary: "app " and "bot "', () => {
  const ok = run(['check'], pages({ 2: page({ body: 'An apple and a bottle.' }) }))
  assert.equal(ok.status, 0, ok.err)
  const bad = run(['check'], pages({ 2: page({ body: 'Open the app and let the bot play.' }) }))
  assert.equal(bad.status, 1)
  assert.match(bad.err, /p02-sheet\.html: banned words app , bot /)
})

test('check wants a labelled vector diagram on every sheet', () => {
  const unlabelled = DIAGRAM.replace('<text>Base</text>', '')
  const small = '<svg><rect/><rect/><text>Base</text></svg>'
  const r = run(
    ['check'],
    pages({
      5: page({ diagram: unlabelled }),
      6: page({ diagram: small }),
      7: page({ diagram: `<!-- ${DIAGRAM} -->` }),
    }),
  )
  assert.equal(r.status, 1)
  assert.match(r.err, /p05-sheet: no labelled vector diagram/)
  assert.match(r.err, /p06-sheet: no labelled vector diagram/)
  assert.match(r.err, /p07-sheet: no labelled vector diagram/)
  assert.match(r.out, /check: 3 problem\(s\)/)
})

test('check counts only diagrams inside the sheet, not the defs block before it', () => {
  const html = page({ diagram: '' }).replace('<div class="sheet', `${DIAGRAM}\n<div class="sheet`)
  const r = run(['check'], pages({ 8: html }))
  assert.equal(r.status, 1)
  assert.match(r.err, /p08-sheet: no labelled vector diagram/)
})

test('lint reports words, orientation, furniture and diagrams for a clean sheet', () => {
  const { status, report } = lintReport(page({ orientation: 'landscape' }))
  assert.equal(report.orientation, 'landscape')
  assert.deepEqual(report.banned, [])
  assert.deepEqual(report.missing, [])
  assert.equal(report.diagrams, 1)
  assert.equal(report.external, null)
  // Not rendered: no fit file and no PDF, so the sheet cannot pass yet.
  assert.equal(report.fit, 'not rendered yet')
  assert.equal(report.pages, null)
  assert.equal(report.ok, false)
  assert.equal(status, 1)
  assert.ok(report.reasons.some((r) => /must be 1 \(render first\)/.test(r)))
  // "Survival", the 10 body words and the 5 footer tokens that hold a letter or digit; SVG text is not counted.
  assert.equal(report.words, 16)
})

test('lint defaults to portrait and lists the missing furniture', () => {
  const { report } = lintReport(page({ foot: 'no id here' }))
  assert.equal(report.orientation, 'portrait')
  assert.deepEqual(report.missing, ['page id', 'date', 'src footer'])
  assert.ok(report.reasons.includes('missing furniture: page id, date, src footer'))
})

test('lint flags banned words, an external resource and a sheet with no diagram', () => {
  const { report } = lintReport(
    page({
      body: 'Click to export.',
      diagram: '',
      head: '<link rel="stylesheet" href="https://example.com/a.css">',
    }),
  )
  assert.deepEqual(report.banned, ['click', 'export'])
  assert.equal(report.external, 'external resource or URL found')
  assert.equal(report.diagrams, 0)
  assert.ok(report.reasons.includes('banned words: click, export'))
  assert.ok(report.reasons.includes('external resource or URL found'))
  assert.ok(report.reasons.some((r) => r.startsWith('no vector diagram')))
})

test('text writes the visible text of every page to build/text', () => {
  const r = run(['text'], pages({ 1: page({ body: 'Hold the line &amp; build.' }) }), (root) =>
    fs.readFileSync(path.join(root, 'design/one-pagers/v2/build/text/p01-sheet.txt'), 'utf8'),
  )
  assert.equal(r.status, 0, r.err)
  assert.equal(r.out.trim().split('\n').length, 15)
  assert.match(r.seen, /Hold the line build\./)
  assert.doesNotMatch(r.seen, /<|@page|comment/)
})

test('an unknown command prints the usage and exits 2', () => {
  const r = run(['publish'])
  assert.equal(r.status, 2)
  assert.match(r.err, /usage: one-pagers\.mjs render/)
})

test('merge stops before pypdf when a page has not been rendered', () => {
  const r = run(['merge'])
  assert.notEqual(r.status, 0)
  assert.match(r.err, /render first; missing:/)
})
