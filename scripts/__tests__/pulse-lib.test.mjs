// scripts/__tests__/pulse-lib.test.mjs
//
// Unit tests for scripts/pulse-lib.mjs (node:test, no devDeps).

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  ago,
  auditPending,
  ceilingFromWorkflow,
  cloudBudget,
  CLOUD_WEIGHTS,
  DEFAULT_CEILING,
  header,
  headerCommit,
  headerDate,
} from '../pulse-lib.mjs'

test('headerDate takes only the leading date of a header value', () => {
  assert.equal(headerDate('2026-10-10 at commit 8402ba3'), '2026-10-10T00:00:00Z')
  assert.equal(headerDate('2026-10-10'), '2026-10-10T00:00:00Z')
  assert.equal(headerDate('never'), null)
  assert.equal(headerDate('10/10/2026'), null)
  assert.equal(headerDate(null), null)
})

test('headerCommit finds the sha after "at commit"', () => {
  assert.equal(headerCommit('2026-10-10 at commit c34753b'), 'c34753b')
  assert.equal(headerCommit('2026-10-10'), null)
  assert.equal(headerCommit(null), null)
})

test('header reads a "> Key: value" line', () => {
  const text = '# Log\n\n> Last pass: 2026-10-10 at commit c34753b\n> Pass count: 12\n'
  assert.equal(header(text, 'Last pass'), '2026-10-10 at commit c34753b')
  assert.equal(header(text, 'Missing'), null)
})

test('auditPending counts open rows of the latest pass only, plus needs-user-call rows', () => {
  const text = [
    '# Site audit',
    '',
    '# Site audit — 2026-10-10 (pass 34)',
    '## Top 5 findings (scored)',
    '### [x] [3.0] shipped row',
    '### [ ] [2.4] open row one',
    '### [ ] [2.4] open row two',
    '# Site audit — 2026-10-09 (pass 33)',
    '## Top 5 findings (scored)',
    '### [ ] [2.0] an older open row',
    '## Needs user call (from adoption)',
    '- [needs-user-call] **One.** text',
    '- [needs-user-call] **Two.** text',
  ].join('\n')
  assert.deepEqual(auditPending(text), { open: 2, userCalls: 2 })
  assert.deepEqual(auditPending('# Site audit\n'), { open: 0, userCalls: 0 })
})

test('ceilingFromWorkflow reads the ceiling= line, else the default', () => {
  assert.equal(ceilingFromWorkflow('run: |\n  ceiling=20\n  budget=0\n'), 20)
  assert.equal(ceilingFromWorkflow('no ceiling here'), DEFAULT_CEILING)
  assert.equal(ceilingFromWorkflow(null), DEFAULT_CEILING)
})

test('cloudBudget weights phase commits 3 and churn 1, inside 24 hours only', () => {
  assert.deepEqual(CLOUD_WEIGHTS, { phase: 3, churn: 1 })
  const now = '2026-10-10T20:00:00Z'
  const commits = [
    { time: '2026-10-09T19:59:00Z', phase: true }, // outside the window
    { time: '2026-10-10T01:00:00Z', phase: true },
    { time: '2026-10-10T02:00:00Z', phase: false },
    { time: '2026-10-10T03:00:00Z', phase: false },
  ]
  assert.deepEqual(cloudBudget(commits, now, 12), { budget: 5, ceiling: 12, skipping: false, freesAt: null })
})

test('cloudBudget at the ceiling says when the oldest commits leave the window', () => {
  const now = '2026-10-10T20:00:00Z'
  const commits = [
    { time: '2026-10-10T01:00:00Z', phase: true },
    { time: '2026-10-10T02:00:00Z', phase: true },
    { time: '2026-10-10T03:00:00Z', phase: false },
  ]
  // budget 7 against ceiling 5: dropping the 01:00 phase commit leaves 4 < 5.
  assert.deepEqual(cloudBudget(commits, now, 5), {
    budget: 7,
    ceiling: 5,
    skipping: true,
    freesAt: '2026-10-11T01:00:00.000Z',
  })
})

test('ago prints hours under 48h, then days; null for an unreadable date', () => {
  const now = new Date('2026-10-10T20:00:00Z').getTime()
  assert.equal(ago('2026-10-10T15:00:00Z', now), '5h ago')
  assert.equal(ago('2026-10-07T20:00:00Z', now), '3d ago')
  assert.equal(ago('not a date', now), null)
  assert.equal(ago(null, now), null)
})
