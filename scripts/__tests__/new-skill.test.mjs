// scripts/__tests__/new-skill.test.mjs
//
// Tests for scripts/new-skill.mjs (node:test, no devDeps). The script writes next to its own
// folder (the repo root is one level above scripts/), not the current directory, so each test
// copies it into scripts/ of a temp repo and runs the copy there. Importing it would run it,
// so the tests only spawn it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../new-skill.mjs', import.meta.url))

/**
 * Builds a temp repo holding a copy of the script and the given files, runs the copy with the
 * given args, and reads back every file the run left under the repo (except the script).
 */
function run(args, files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'new-skill-'))
  fs.mkdirSync(path.join(root, 'scripts'))
  fs.copyFileSync(SCRIPT, path.join(root, 'scripts', 'new-skill.mjs'))
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), text)
  }
  const result = spawnSync(process.execPath, [path.join('scripts', 'new-skill.mjs'), ...args], {
    cwd: root,
    encoding: 'utf-8',
  })
  const tree = {}
  for (const file of fs.readdirSync(root, { recursive: true })) {
    const full = path.join(root, file)
    if (fs.statSync(full).isFile() && file !== path.join('scripts', 'new-skill.mjs')) {
      tree[file.split(path.sep).join('/')] = fs.readFileSync(full, 'utf-8')
    }
  }
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr, tree }
}

test('writes the skill and its command, both naming the verb and the purpose', () => {
  const r = run(['ship-asset', 'Ship one asset from the backlog.'])
  assert.equal(r.status, 0, r.err)
  assert.deepEqual(Object.keys(r.tree).sort(), [
    '.claude/commands/ship-asset.md',
    'skills/ship-asset.md',
  ])
  const skill = r.tree['skills/ship-asset.md']
  assert.match(skill, /^# Skill: ship-asset\n/)
  assert.match(skill, /## 1\. Purpose\n\nShip one asset from the backlog\.\n/)
  assert.match(skill, /\/ship-asset {23}# TODO: default behavior/)
  for (const section of [
    '## 2. Invocation',
    '## 3. Autonomy contract',
    '## 4. The procedure',
    '## 5. Hard rules',
    '## 6. Failure modes',
    '## 7. Quick reference',
  ]) {
    assert.ok(skill.includes(section), section)
  }
  const command = r.tree['.claude/commands/ship-asset.md']
  assert.match(command, /^---\ndescription: Ship one asset from the backlog\.\n---\n/)
  assert.match(command, /Read `skills\/ship-asset\.md` end to end/)
  assert.match(command, /Argument: \$ARGUMENTS\n$/)
  assert.match(r.out, /new-skill: wrote skills\/ship-asset\.md/)
  assert.match(r.out, /new-skill: wrote \.claude\/commands\/ship-asset\.md/)
  assert.match(r.out, /TODO-marked scaffolds/)
})

test('joins an unquoted purpose from the words after the name', () => {
  const r = run(['audit-dice', 'Audit', 'the', 'dice', 'pool.'])
  assert.equal(r.status, 0, r.err)
  assert.match(r.tree['skills/audit-dice.md'], /\n\nAudit the dice pool\.\n/)
  assert.match(r.tree['.claude/commands/audit-dice.md'], /description: Audit the dice pool\./)
})

test('--template writes to templates/ instead, wherever the flag sits', () => {
  for (const args of [
    ['--template', 'ship-asset', 'Ship an asset.'],
    ['ship-asset', 'Ship', '--template', 'an asset.'],
  ]) {
    const r = run(args)
    assert.equal(r.status, 0, r.err)
    assert.deepEqual(Object.keys(r.tree).sort(), [
      'templates/claude/commands/ship-asset.md',
      'templates/skills/ship-asset.md',
    ])
    assert.match(r.tree['templates/skills/ship-asset.md'], /\n\nShip an asset\.\n/)
  }
})

test('stops with usage when the name or the purpose is missing', () => {
  for (const args of [[], ['ship-asset'], ['--template', 'ship-asset']]) {
    const r = run(args)
    assert.equal(r.status, 1)
    assert.match(r.err, /usage: node scripts\/new-skill\.mjs <name> "<purpose>" \[--template\]/)
    assert.deepEqual(r.tree, {})
  }
})

test('takes lower-kebab-case names only', () => {
  for (const name of ['a', 'plan-a-phase', 'step2-x9']) {
    assert.equal(run([name, 'Do it.']).status, 0, name)
  }
  for (const name of ['Ship-Asset', 'ship_asset', 'ship--asset', 'ship-', '-ship', '2ship']) {
    const r = run([name, 'Do it.'])
    assert.equal(r.status, 1, name)
    assert.ok(r.err.includes(`new-skill: "${name}" isn't lower-kebab-case`), r.err)
    assert.deepEqual(r.tree, {}, name)
  }
})

test('refuses to overwrite either file and writes neither', () => {
  const skill = run(['ship-asset', 'Do it.'], { 'skills/ship-asset.md': 'mine' })
  assert.equal(skill.status, 1)
  assert.match(skill.err, /skills\/ship-asset\.md already exists/)
  assert.deepEqual(skill.tree, { 'skills/ship-asset.md': 'mine' })

  const command = run(['ship-asset', 'Do it.'], { '.claude/commands/ship-asset.md': 'mine' })
  assert.equal(command.status, 1)
  assert.match(command.err, /\.claude\/commands\/ship-asset\.md already exists/)
  assert.deepEqual(command.tree, { '.claude/commands/ship-asset.md': 'mine' })
})
