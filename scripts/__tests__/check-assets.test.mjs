// scripts/__tests__/check-assets.test.mjs
//
// Tests for scripts/check-assets.mjs (node:test, no devDeps). The script reads ASSETS.md and
// assets/ from the current directory, so each test builds a small repo in a temp folder and
// runs the script there.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../check-assets.mjs', import.meta.url))
const HEADER = [
  '| Asset | Local path | Source | License | License URL | Attribution | Status | Checked |',
  '|---|---|---|---|---|---|---|---|',
]

/** One register row; `over` replaces any cell. */
function row(localPath, over = {}) {
  const cells = {
    asset: 'Icon',
    localPath: `\`${localPath}\``,
    source: 'https://example.org/icon',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    attribution: 'Icon by someone, CC BY 3.0',
    status: 'in use',
    checked: '2026-11-16',
    ...over,
  }
  return `| ${Object.values(cells).join(' | ')} |`
}

/** Builds a temp repo with the given register rows and asset files, runs the check there. */
function check({ rows = [], files = [], register = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'check-assets-'))
  if (register) fs.writeFileSync(path.join(root, 'ASSETS.md'), ['# Assets', '', ...HEADER, ...rows, ''].join('\n'))
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), '<svg/>')
  }
  const result = spawnSync(process.execPath, [SCRIPT], { cwd: root, encoding: 'utf-8' })
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr }
}

test('a register that matches the folder passes; README is exempt, Project-owned needs no URL', () => {
  const r = check({
    rows: [
      row('assets/icons/a.svg'),
      row('assets/icons/b.svg', { license: 'Project-owned', licenseUrl: '-' }),
      row('assets/icons/planned.svg', { status: 'candidate' }),
    ],
    files: ['assets/icons/a.svg', 'assets/icons/b.svg', 'assets/README.md'],
  })
  assert.equal(r.status, 0, r.err)
  assert.match(r.out, /check-assets: 2 file\(s\), 3 register row\(s\), all consistent\./)
})

test('a file under assets/ with no register row fails', () => {
  const r = check({ rows: [row('assets/icons/a.svg')], files: ['assets/icons/a.svg', 'assets/sfx/b.ogg'] })
  assert.equal(r.status, 1)
  assert.match(r.err, /check-assets: 1 problem\(s\)/)
  assert.match(r.err, /assets\/sfx\/b\.ogg: no row in ASSETS\.md/)
})

test('an "in use" row whose file is gone fails; other statuses may point at no file', () => {
  const r = check({ rows: [row('assets/icons/gone.svg'), row('assets/icons/later.svg', { status: 'candidate' })] })
  assert.equal(r.status, 1)
  assert.match(r.err, /assets\/icons\/gone\.svg: row says "in use" but the file does not exist/)
  assert.doesNotMatch(r.err, /later\.svg/)
})

test('a row without an http(s) license URL fails unless it is Project-owned', () => {
  const r = check({
    rows: [row('assets/icons/a.svg', { licenseUrl: '-' })],
    files: ['assets/icons/a.svg'],
  })
  assert.equal(r.status, 1)
  assert.match(r.err, /assets\/icons\/a\.svg: license URL missing/)
})

test('a NonCommercial or NoDerivatives license fails unless the row is rejected', () => {
  const nc = 'https://creativecommons.org/licenses/by-nc/4.0/'
  const r = check({
    rows: [
      row('assets/icons/nc.svg', { license: 'CC BY-NC 4.0', licenseUrl: nc }),
      row('assets/icons/nd.svg', { license: 'CC BY-ND 4.0', licenseUrl: nc }),
      row('assets/icons/words.svg', { license: 'Free for non-commercial use', licenseUrl: nc }),
      row('assets/icons/no.svg', { license: 'CC BY-NC 4.0', licenseUrl: nc, status: 'rejected' }),
    ],
    files: ['assets/icons/nc.svg', 'assets/icons/nd.svg', 'assets/icons/words.svg', 'assets/icons/no.svg'],
  })
  assert.equal(r.status, 1)
  assert.match(r.err, /check-assets: 3 problem\(s\)/)
  for (const name of ['nc', 'nd', 'words'])
    assert.match(r.err, new RegExp(`assets/icons/${name}\\.svg: NC/ND license must be "rejected"`))
  assert.doesNotMatch(r.err, /no\.svg/)
})

test('a missing ASSETS.md fails', () => {
  const r = check({ register: false, files: ['assets/icons/a.svg'] })
  assert.equal(r.status, 1)
  assert.match(r.err, /check-assets: ASSETS\.md is missing\./)
})
