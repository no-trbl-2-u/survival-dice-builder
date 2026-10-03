#!/usr/bin/env node
// scripts/check-assets.mjs
//
// Keeps ASSETS.md honest (phase 3 brief): every file under assets/
// has a register row, every "in use" row points at a file that
// exists, and every row names a license URL. assets/README.md is
// exempt (it documents the folder).
//
//   exit 0  ->  register and folder agree
//   exit 1  ->  drift (each problem printed)

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const REGISTER = path.join(ROOT, 'ASSETS.md')
const ASSETS_DIR = path.join(ROOT, 'assets')
const EXEMPT = new Set(['assets/README.md'])

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [path.relative(ROOT, full).split(path.sep).join('/')]
  })
}

// Register rows are markdown table lines whose "Local path" cell starts with `assets/`.
// Columns: | Asset | Local path | Source | License | License URL | Attribution | Status | Checked |
function readRows(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.startsWith('|'))
    .map((line) =>
      line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim().replace(/^`|`$/g, '')),
    )
    .filter((cells) => cells.length >= 8 && cells[1].startsWith('assets/'))
    .map(([asset, localPath, source, license, licenseUrl, attribution, status, checked]) => ({
      asset,
      localPath,
      source,
      license,
      licenseUrl,
      attribution,
      status,
      checked,
    }))
}

const problems = []

if (!fs.existsSync(REGISTER)) {
  console.error('check-assets: ASSETS.md is missing.')
  process.exit(1)
}

const rows = readRows(fs.readFileSync(REGISTER, 'utf-8'))
const files = walk(ASSETS_DIR).filter((f) => !EXEMPT.has(f))
const rowPaths = new Set(rows.map((r) => r.localPath))

for (const file of files) {
  if (!rowPaths.has(file)) problems.push(`${file}: no row in ASSETS.md`)
}
for (const row of rows) {
  if (row.status === 'in use' && !fs.existsSync(path.join(ROOT, row.localPath))) {
    problems.push(`${row.localPath}: row says "in use" but the file does not exist`)
  }
  if (!/^https?:\/\//.test(row.licenseUrl) && row.license !== 'Project-owned') {
    problems.push(`${row.localPath}: license URL missing`)
  }
  if (/\b(NC|ND)\b|non-?commercial|no-?deriv/i.test(row.license) && row.status !== 'rejected') {
    problems.push(`${row.localPath}: NC/ND license must be "rejected" unless the designer approves`)
  }
}

if (problems.length) {
  console.error(`check-assets: ${problems.length} problem(s)`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`check-assets: ${files.length} file(s), ${rows.length} register row(s), all consistent.`)
