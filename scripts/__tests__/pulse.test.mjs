// scripts/__tests__/pulse.test.mjs
//
// Tests for scripts/pulse.mjs (node:test, no devDeps), the offline instrument panel /oversight
// reads. The parsers are pinned in pulse-lib.test.mjs; these tests pin the wiring: which file
// feeds which line, the git-backed numbers (last commit, a header's commit time, the cloud
// budget) and the promise to exit 0 with "unreadable" lines when a file or git is missing.
// The script reads next to its own folder, so each test copies it and pulse-lib.mjs into
// scripts/ of a temp repo and runs the copy there. Importing it would run it, so the tests only
// spawn it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPTS = fileURLToPath(new URL('..', import.meta.url))
const HOUR = 60 * 60 * 1000

/** The environment with the runner's git identity and repo pointers scrubbed. */
function cleanEnv(root) {
  const env = { ...process.env, GIT_CEILING_DIRECTORIES: path.dirname(root) }
  for (const key of Object.keys(env)) {
    if (/^GIT_(AUTHOR|COMMITTER)_|^GIT_(DIR|WORK_TREE|INDEX_FILE)$/.test(key)) delete env[key]
  }
  return env
}

/** Builds a temp folder holding the two scripts and the given files. */
function makeRoot(files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-'))
  fs.mkdirSync(path.join(root, 'scripts'))
  for (const name of ['pulse.mjs', 'pulse-lib.mjs']) {
    fs.copyFileSync(path.join(SCRIPTS, name), path.join(root, 'scripts', name))
  }
  write(root, files)
  return root
}

function write(root, files) {
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), text)
  }
}

/** Commits everything in `root` with the given message, dated `hoursAgo`; returns the short sha. */
function commit(root, message, hoursAgo, files = {}) {
  write(root, files)
  const date = new Date(Date.now() - hoursAgo * HOUR).toISOString()
  const env = {
    ...cleanEnv(root),
    GIT_AUTHOR_NAME: 'Test',
    GIT_AUTHOR_EMAIL: 'test@example.com',
    GIT_COMMITTER_NAME: 'Test',
    GIT_COMMITTER_EMAIL: 'test@example.com',
    GIT_AUTHOR_DATE: date,
    GIT_COMMITTER_DATE: date,
  }
  const git = (...args) => execFileSync('git', args, { cwd: root, env, encoding: 'utf-8' }).trim()
  if (!fs.existsSync(path.join(root, '.git'))) git('init', '-q')
  git('add', '-A')
  git('commit', '-q', '--allow-empty', '-m', message)
  return git('log', '-1', '--format=%h')
}

/** Runs the copied script in `root`; returns status, output and its rows keyed by label. */
function run(root) {
  const result = spawnSync(process.execPath, [path.join('scripts', 'pulse.mjs')], {
    cwd: root,
    env: cleanEnv(root),
    encoding: 'utf-8',
  })
  fs.rmSync(root, { recursive: true, force: true })
  const rows = {}
  for (const line of result.stdout.split('\n')) {
    // printRow pads each label to 18 columns after a 2-space indent.
    if (/^ {2}\S/.test(line)) rows[line.slice(2, 20).trim()] = line.slice(20)
  }
  return { status: result.status, out: result.stdout, err: result.stderr, rows }
}

const daysAgo = (n) => new Date(Date.now() - n * 24 * HOUR).toISOString().slice(0, 10)

const BUILD_PLAN = [
  '# Build plan',
  '',
  '- [x] Phase 1 — Scaffold',
  '- [ ] Phase 2 — Map',
  '- [ ] Phase 3 — Dice',
  '- [blocked: needs the designer] Phase 4 — Skills',
  '',
].join('\n')

const AUDIT = [
  '# Site audit',
  '',
  '# Site audit — 2026-11-18 (pass 2)',
  '',
  '## Top 5 findings (scored)',
  '',
  '### [ ] [3.0] one',
  '### [ ] [2.0] two',
  '### [x] [4.0] three',
  '',
  '# Site audit — 2026-11-17 (pass 1)',
  '',
  '### [ ] [1.0] old pass, not counted',
  '',
  '## Needs the user',
  '',
  '- [needs-user-call] **Pick a calendar.**',
  '',
].join('\n')

const candidates = (proposed) =>
  [
    '# Phase candidates',
    '',
    '> Last pass: never',
    '',
    '## Pending',
    '',
    '### Candidate A',
    `- proposed: ${proposed[0]}`,
    '',
    '### Candidate B',
    `- proposed: ${proposed[1]}`,
    '',
    '## Promoted',
    '',
    '### Candidate C',
    '- proposed: 2020-01-01',
    '',
  ].join('\n')

const critique = (lastPass) =>
  [
    '# Critique log',
    '',
    `> Last pass: ${lastPass}`,
    '',
    '## Pending',
    '',
    '### [LOW] one',
    '### [MED] two',
    '### [LOW] three',
    '',
    '## Done',
    '',
    '### [x] done one',
    '',
  ].join('\n')

const workflow = (ceiling) => `jobs:\n  march:\n    steps:\n      - run: |\n          ceiling=${ceiling}\n`

test('prints every row from the plan files and git, and exits 0', () => {
  const root = makeRoot({
    'plan/steps/01_build_plan.md': BUILD_PLAN,
    'plan/AUDIT.md': AUDIT,
    'plan/PHASE_CANDIDATES.md': candidates([daysAgo(3), daysAgo(10)]),
    '.github/workflows/march.yml': workflow(9),
  })
  const base = commit(root, 'chore: base', 30)
  write(root, { 'plan/CRITIQUE.md': critique(`2020-01-01 at commit ${base}`) })
  commit(root, 'feat: ship phase 2\n\nCloud-Run: https://example.com/1', 2, {
    'plan/steps/01_build_plan.md': BUILD_PLAN.replace('- [ ] Phase 2', '- [x] Phase 2'),
  })
  const last = commit(root, 'content: one fix\n\nCloud-Run: https://example.com/2', 1)

  const r = run(root)
  assert.equal(r.status, 0, r.err)
  assert.match(r.out, /^pulse — survival-dice-builder\n\n/)
  assert.equal(r.rows['last commit'], `1h ago  ${last} content: one fix`)
  assert.equal(r.rows['build plan'], '1 pending, 1 blocked')
  assert.equal(r.rows.audit, '2 open in the latest pass, 1 needs-user-call')
  // The header names the base commit, so its age is the commit's, not the 2020 date's.
  assert.equal(r.rows.critique, '3 pending, last pass 30h ago')
  // Promoted rows are left out; the oldest pending date wins.
  assert.match(r.rows.candidates, /^2 pending, oldest (9|10|11)d ago$/)
  // One phase commit (3) and one churn commit (1); the base commit has no trailer.
  assert.equal(r.rows.cloud, '4/9 weighted budget in 24h')
})

test('a header naming an unknown commit falls back to its date; "never" prints no age', () => {
  const root = makeRoot({
    'plan/steps/01_build_plan.md': BUILD_PLAN,
    'plan/AUDIT.md': AUDIT,
    'plan/CRITIQUE.md': critique(`${daysAgo(5)} at commit abcdef1`),
    'plan/PHASE_CANDIDATES.md': '# Phase candidates\n\n> Last pass: never\n\n## Pending\n\n',
  })
  commit(root, 'chore: base', 1)
  const r = run(root)
  assert.equal(r.status, 0, r.err)
  assert.match(r.rows.critique, /^3 pending, last pass (4|5|6)d ago$/)
  assert.equal(r.rows.candidates, '0 pending')

  const root2 = makeRoot({ 'plan/CRITIQUE.md': critique('never') })
  commit(root2, 'chore: base', 1)
  assert.equal(run(root2).rows.critique, '3 pending')
})

test('says when cloud ticks skip, and uses the default ceiling with no workflow', () => {
  const root = makeRoot({ 'plan/steps/01_build_plan.md': BUILD_PLAN, '.github/workflows/march.yml': workflow(4) })
  commit(root, 'chore: base', 30)
  commit(root, 'feat: ship phase 2\n\nCloud-Run: https://example.com/1', 2, {
    'plan/steps/01_build_plan.md': BUILD_PLAN.replace('- [ ] Phase 2', '- [x] Phase 2'),
  })
  commit(root, 'content: one fix\n\nCloud-Run: https://example.com/2', 1)
  const r = run(root)
  // 4 meets the ceiling of 4; dropping the phase commit (2h ago) frees it 22h from now.
  const frees = new Date(Date.now() + 22 * HOUR)
  const match = r.rows.cloud.match(/^4\/4 weighted budget in 24h, ticks skip until (\d{4}-\d{2}-\d{2} \d{2}:\d{2})Z$/)
  assert.ok(match, r.rows.cloud)
  const at = new Date(`${match[1].replace(' ', 'T')}:00Z`).getTime()
  assert.ok(Math.abs(at - frees.getTime()) < 5 * 60 * 1000, `${match[1]} vs ${frees.toISOString()}`)

  const root2 = makeRoot()
  commit(root2, 'content: one fix\n\nCloud-Run: https://example.com/1', 1)
  assert.equal(run(root2).rows.cloud, '1/12 weighted budget in 24h')
})

test('outside git and with no plan files, every row says unreadable and it still exits 0', () => {
  const r = run(makeRoot())
  assert.equal(r.status, 0, r.err)
  assert.deepEqual(r.rows, {
    'last commit': 'unreadable (not a git checkout?)',
    'build plan': 'unreadable (plan/steps/01_build_plan.md)',
    audit: 'unreadable (plan/AUDIT.md)',
    critique: 'unreadable (plan/CRITIQUE.md)',
    candidates: 'unreadable (plan/PHASE_CANDIDATES.md)',
    cloud: 'unreadable (git log)',
  })
})
