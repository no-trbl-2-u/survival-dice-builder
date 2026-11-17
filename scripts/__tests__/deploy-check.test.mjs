// scripts/__tests__/deploy-check.test.mjs
//
// Tests for scripts/deploy-check.mjs (node:test, no devDeps). The script reads HEAD from git
// in the current directory and polls a provider API with fetch, so each test builds a git repo
// in a temp folder, preloads a fetch stub with `node --import`, and runs the script there.
// Every stubbed answer is terminal on the first poll (ready, failed or an auth error), so no
// test waits on the 5 s poll interval. Importing the script would run it, so the tests only
// spawn it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../deploy-check.mjs', import.meta.url))

/** Answers fetch from FAKE_FETCH (URL substring -> {status, body}); logs each call to FAKE_FETCH_LOG. */
const STUB = `
const routes = JSON.parse(process.env.FAKE_FETCH ?? '{}')
globalThis.fetch = async (url, init = {}) => {
  const fs = await import('node:fs')
  fs.appendFileSync(process.env.FAKE_FETCH_LOG, JSON.stringify({ url: String(url), headers: init.headers ?? {} }) + '\\n')
  const key = Object.keys(routes).find((k) => String(url).includes(k))
  const { status = 200, body = {} } = key ? routes[key] : { status: 404 }
  return new Response(JSON.stringify(body), { status, statusText: status === 401 ? 'Unauthorized' : '' })
}
`

/** Env keys the script reads; cleared so the runner's own tokens never leak into a test. */
const SCRUB = [
  'DEPLOY_PROVIDER',
  'CF_API_TOKEN',
  'CLOUDFLARE_API_TOKEN',
  'CF_ACCOUNT_ID',
  'CLOUDFLARE_ACCOUNT_ID',
  'CF_PAGES_PROJECT',
  'NETLIFY_AUTH_TOKEN',
  'NETLIFY_SITE_NAME',
  'GH_TOKEN',
  'GH_REPO',
  'DEPLOY_WORKFLOW',
]

/** A temp git repo with 2 commits; returns its path and both SHAs. */
function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-check-'))
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf-8' }).trim()
  git('init', '-q')
  const who = ['-c', 'user.name=t', '-c', 'user.email=t@example.com']
  git(...who, 'commit', '-q', '--allow-empty', '-m', 'first')
  const first = git('rev-parse', 'HEAD')
  git(...who, 'commit', '-q', '--allow-empty', '-m', 'second change')
  return { root, first, head: git('rev-parse', 'HEAD') }
}

/** Runs the script in `root` with `env` and the given fetch routes; returns status, output and calls. */
function run(root, env, routes = {}) {
  fs.writeFileSync(path.join(root, 'stub.mjs'), STUB)
  const log = path.join(root, 'fetch.log')
  const base = { ...process.env }
  for (const key of SCRUB) delete base[key]
  const result = spawnSync(process.execPath, ['--import', './stub.mjs', SCRIPT], {
    cwd: root,
    encoding: 'utf-8',
    env: { ...base, ...env, FAKE_FETCH: JSON.stringify(routes), FAKE_FETCH_LOG: log },
  })
  const calls = fs.existsSync(log)
    ? fs.readFileSync(log, 'utf-8').trim().split('\n').map((line) => JSON.parse(line))
    : []
  fs.rmSync(root, { recursive: true, force: true })
  return { status: result.status, out: result.stdout, err: result.stderr, calls }
}

const CF = { DEPLOY_PROVIDER: 'cloudflare-pages', CF_API_TOKEN: 'tok', CF_ACCOUNT_ID: 'acct' }

test('DEPLOY_PROVIDER=none skips the gate with exit 0', () => {
  const { root } = repo()
  const r = run(root, { DEPLOY_PROVIDER: 'none' })
  assert.equal(r.status, 0)
  assert.match(r.out, /No deploy gate configured .*Skipping/)
  assert.equal(r.calls.length, 0)
})

test('an unknown provider exits 3 and lists the supported ones', () => {
  const { root } = repo()
  const r = run(root, { DEPLOY_PROVIDER: 'heroku' })
  assert.equal(r.status, 3)
  assert.match(r.err, /Unknown DEPLOY_PROVIDER: "heroku"/)
  assert.match(r.err, /cloudflare-pages/)
})

test('Cloudflare Pages without a token or account exits 3 before any request', () => {
  const noToken = run(repo().root, { DEPLOY_PROVIDER: 'cloudflare-pages' })
  assert.equal(noToken.status, 3)
  assert.match(noToken.err, /CF_API_TOKEN is not set/)
  assert.equal(noToken.calls.length, 0)

  const noAccount = run(repo().root, { DEPLOY_PROVIDER: 'cloudflare-pages', CF_API_TOKEN: 'tok' })
  assert.equal(noAccount.status, 3)
  assert.match(noAccount.err, /CF_ACCOUNT_ID is not set/)
})

test('Cloudflare Pages: the deploy for HEAD succeeding exits 0, CLOUDFLARE_* spellings accepted', () => {
  const { root, first, head } = repo()
  const r = run(
    root,
    { DEPLOY_PROVIDER: 'cloudflare-pages', CLOUDFLARE_API_TOKEN: 'tok', CLOUDFLARE_ACCOUNT_ID: 'acct' },
    {
      '/pages/projects/': {
        body: {
          result: [
            { id: 'old', url: 'https://old.example', deployment_trigger: { metadata: { commit_hash: first } }, latest_stage: { status: 'failure' } },
            { id: 'abcdef123456', url: 'https://new.example', deployment_trigger: { metadata: { commit_hash: head } }, latest_stage: { status: 'success' } },
          ],
        },
      },
    },
  )
  assert.equal(r.status, 0, r.err)
  assert.match(r.out, new RegExp(`HEAD ${head.slice(0, 7)} \\("second change"\\) on cloudflare-pages`))
  assert.match(r.out, /Deploy ready\./)
  assert.match(r.out, /URL: https:\/\/new\.example/)
  assert.equal(r.calls[0].url, 'https://api.cloudflare.com/client/v4/accounts/acct/pages/projects/survival-dice-builder/deployments')
  assert.equal(r.calls[0].headers.Authorization, 'Bearer tok')
})

test('Cloudflare Pages: the deploy for HEAD failing exits 1 with the stage and admin URL', () => {
  const { root, first, head } = repo()
  const r = run(root, { ...CF, CF_PAGES_PROJECT: 'proj' }, {
    '/pages/projects/proj/': {
      body: {
        result: [
          { id: 'old', deployment_trigger: { metadata: { commit_hash: first } }, latest_stage: { status: 'success' } },
          { id: 'dep1', deployment_trigger: { metadata: { commit_hash: head } }, latest_stage: { name: 'build', status: 'failure' } },
        ],
      },
    },
  })
  assert.equal(r.status, 1)
  assert.match(r.err, /DEPLOY FAILED\./)
  assert.match(r.err, /Error: stage "build" failed/)
  assert.match(r.err, /Admin URL: https:\/\/dash\.cloudflare\.com\/acct\/pages\/view\/proj\/dep1/)
  assert.match(r.err, /Do not push past this gate\./)
})

test('GitHub Actions: only the named workflow run for HEAD counts', () => {
  const { root, head } = repo()
  const env = { DEPLOY_PROVIDER: 'github-actions', GH_TOKEN: 'tok', GH_REPO: 'o/r' }
  const runs = (conclusion, sha = head) => ({
    [`/repos/o/r/actions/runs?head_sha=${sha}`]: {
      body: {
        workflow_runs: [
          { id: 1, path: '.github/workflows/ci.yml', status: 'completed', conclusion: 'failure', html_url: 'https://gh/ci' },
          { id: 2, path: '.github/workflows/deploy.yml', status: 'completed', conclusion, html_url: 'https://gh/deploy' },
        ],
      },
    },
  })
  const ok = run(root, env, runs('success'))
  assert.equal(ok.status, 0, ok.err)
  assert.match(ok.out, /URL: https:\/\/gh\/deploy/)

  // A fresh repo has its own HEAD (the SHAs match only when both are made in the same second).
  const second = repo()
  const bad = run(second.root, env, runs('cancelled', second.head))
  assert.equal(bad.status, 1)
  assert.match(bad.err, /workflow concluded cancelled/)
})

test('Netlify: a rejected token exits 3; a ready deploy lists the commits since the last one', () => {
  const env = { DEPLOY_PROVIDER: 'netlify', NETLIFY_AUTH_TOKEN: 'tok', NETLIFY_SITE_NAME: 'site' }
  const denied = run(repo().root, env, { '/sites?name=site': { status: 401 } })
  assert.equal(denied.status, 3)
  assert.match(denied.err, /Netlify sites API error: 401 Unauthorized/)
  assert.match(denied.err, /Token rejected\./)

  const { root, first, head } = repo()
  const r = run(root, env, {
    '/sites?name=site': { body: [{ id: 'sid', name: 'site' }] },
    '/sites/sid/deploys': {
      body: [
        { id: 'd2', commit_ref: head, state: 'ready', ssl_url: 'https://site.example' },
        { id: 'd1', commit_ref: first, state: 'ready' },
      ],
    },
  })
  assert.equal(r.status, 0, r.err)
  assert.match(r.out, /Includes 1 commit:\n\s+[0-9a-f]+ second change/)
  assert.match(r.out, /URL: https:\/\/site\.example/)
})
