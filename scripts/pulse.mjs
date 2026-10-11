#!/usr/bin/env node
// scripts/pulse.mjs — the offline instrument panel.
//
// `/oversight`, `/oversight audit`, and `/digest` (if adopted) each
// hand-derive the same numbers from the same plan/ files. This
// script computes them once: last-commit age, build-plan
// pending/blocked counts, AUDIT open rows, CRITIQUE pending
// count + last-pass age, PHASE_CANDIDATES pending count +
// oldest-pending age, and the cloud loop's weighted budget.
//
//   node scripts/pulse.mjs
//
// Reads git log and plan/ locally. No network calls, ever — the
// gh-backed numbers (workflow runs, issue labels) stay in whatever
// skill already fetches them; each cloud run writes its own job
// summary. Always exits 0: this is a report, not a gate. A file
// that can't be read prints "unreadable" on its line and the script
// keeps going. The parsers live in scripts/pulse-lib.mjs.

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import {
  ago,
  auditPending,
  ceilingFromWorkflow,
  cloudBudget,
  countRows,
  header,
  headerCommit,
  headerDate,
  pendingSection,
} from './pulse-lib.mjs'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const NOW = Date.now()

function readSafe(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf-8')
  } catch {
    return null
  }
}

function git(args) {
  return execSync(`git ${args}`, { cwd: ROOT, encoding: 'utf-8' }).trim()
}

function printRow(label, value) {
  console.log(`  ${label.padEnd(18)}${value}`)
}

// A header's commit time when it names a commit git knows, else its date.
function passTime(value) {
  const sha = headerCommit(value)
  if (sha) {
    try {
      return git(`log -1 --format=%cI ${sha}`)
    } catch {
      // unknown sha: fall back to the date
    }
  }
  return headerDate(value)
}

function age(iso) {
  return ago(iso, NOW) ?? 'date unreadable'
}

// --- last commit --------------------------------------------------------

console.log(`pulse — survival-dice-builder`)
console.log('')

try {
  const iso = git('log -1 --format=%cI')
  const sha = git('log -1 --format=%h')
  const subject = git('log -1 --format=%s')
  printRow('last commit', `${age(iso)}  ${sha} ${subject}`)
} catch {
  printRow('last commit', 'unreadable (not a git checkout?)')
}

// --- build plan ----------------------------------------------------------

const buildPlan = readSafe('plan/steps/01_build_plan.md')
if (buildPlan === null) {
  printRow('build plan', 'unreadable (plan/steps/01_build_plan.md)')
} else {
  const pending = (buildPlan.match(/^- \[ \] /gm) ?? []).length
  const blocked = (buildPlan.match(/^- \[blocked:/gm) ?? []).length
  printRow('build plan', `${pending} pending, ${blocked} blocked`)
}

// --- audit -----------------------------------------------------------------

const audit = readSafe('plan/AUDIT.md')
if (audit === null) {
  printRow('audit', 'unreadable (plan/AUDIT.md)')
} else {
  const { open, userCalls } = auditPending(audit)
  printRow('audit', `${open} open in the latest pass, ${userCalls} needs-user-call`)
}

// --- critique --------------------------------------------------------------

const critique = readSafe('plan/CRITIQUE.md')
if (critique === null) {
  printRow('critique', 'unreadable (plan/CRITIQUE.md)')
} else {
  const count = countRows(pendingSection(critique))
  const lastPass = header(critique, 'Last pass')
  const when = lastPass && lastPass !== 'never' ? `, last pass ${age(passTime(lastPass))}` : ''
  printRow('critique', `${count} pending${when}`)
}

// --- candidates --------------------------------------------------------------

const candidates = readSafe('plan/PHASE_CANDIDATES.md')
if (candidates === null) {
  printRow('candidates', 'unreadable (plan/PHASE_CANDIDATES.md)')
} else {
  const section = pendingSection(candidates)
  const count = countRows(section)
  const proposedDates = section
    .map((l) => l.match(/^- proposed:\s*(\d{4}-\d{2}-\d{2})/))
    .filter(Boolean)
    .map((m) => m[1])
    .sort()
  const oldest = proposedDates.length ? `, oldest ${age(headerDate(proposedDates[0]))}` : ''
  printRow('candidates', `${count} pending${oldest}`)
}

// --- cloud loop --------------------------------------------------------------

try {
  const ceiling = ceilingFromWorkflow(readSafe('.github/workflows/march.yml'))
  const since = new Date(NOW - 24 * 60 * 60 * 1000).toISOString()
  const lines = git(`log --since=${since} --grep=Cloud-Run: --format=%H%x09%cI`)
  const commits = lines
    ? lines.split(/\r?\n/).map((line) => {
        const [sha, time] = line.split('\t')
        const diff = git(`show --format= ${sha} -- plan/steps/01_build_plan.md`)
        return { time, phase: /^\+.*\[x\]/m.test(diff) }
      })
    : []
  const b = cloudBudget(commits, new Date(NOW).toISOString(), ceiling)
  const tail = b.skipping ? `, ticks skip until ${b.freesAt?.slice(0, 16).replace('T', ' ')}Z` : ''
  printRow('cloud', `${b.budget}/${b.ceiling} weighted budget in 24h${tail}`)
} catch {
  printRow('cloud', 'unreadable (git log)')
}

console.log('')
process.exit(0)
