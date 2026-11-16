// scripts/__tests__/notify.test.mjs
//
// Tests for scripts/notify.mjs (node:test, no devDeps), the best-effort pager standing rule 8
// calls before any skill stops. Its contract is to exit 0 whatever happens, so every test checks
// the exit code as well as what was sent. Each run happens in an empty temp folder outside git
// (so load-env finds no .env), with the runner's own channel vars scrubbed and a fetch stub
// preloaded through `node --import`. Importing the script would run it, so the tests only spawn
// it.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../notify.mjs', import.meta.url))

/**
 * Answers fetch from FAKE_FETCH (URL substring -> {status} or {reject: true}); logs each call
 * (url, method, headers, body) to FAKE_FETCH_LOG.
 */
const STUB = `
const routes = JSON.parse(process.env.FAKE_FETCH ?? '{}')
globalThis.fetch = async (url, init = {}) => {
  const fs = await import('node:fs')
  fs.appendFileSync(
    process.env.FAKE_FETCH_LOG,
    JSON.stringify({ url: String(url), method: init.method, headers: init.headers ?? {}, body: init.body ?? null }) + '\\n',
  )
  const key = Object.keys(routes).find((k) => String(url).includes(k))
  const route = key ? routes[key] : { status: 404 }
  if (route.reject) throw new Error('network down')
  return new Response('', { status: route.status ?? 200 })
}
`

/** Runs the script with `args`, `env` and the given fetch routes; returns status, output and calls. */
function run(args, env = {}, routes = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notify-'))
  fs.writeFileSync(path.join(root, 'stub.mjs'), STUB)
  const log = path.join(root, 'fetch.log')
  const base = { ...process.env }
  delete base.NOTIFY_NTFY_TOPIC
  delete base.NOTIFY_WEBHOOK_URL
  const result = spawnSync(process.execPath, ['--import', './stub.mjs', SCRIPT, ...args], {
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

const NTFY = { NOTIFY_NTFY_TOPIC: 'loop alerts' }
const HOOK = { NOTIFY_WEBHOOK_URL: 'https://hooks.example.com/abc' }

test('no channel configured prints the message and exits 0 without a request', () => {
  const r = run(['--title', 'march: stopped', '--body', 'verify failed'])
  assert.equal(r.status, 0)
  assert.match(r.out, /no channel configured\): march: stopped — verify failed/)
  assert.deepEqual(r.calls, [])
})

test('no flags falls back to the default title', () => {
  const r = run([])
  assert.equal(r.status, 0)
  assert.match(r.out, /loop notification/)
})

test('ntfy posts the body to the encoded topic with Title and Priority headers', () => {
  const r = run(['--title', 'march: stopped', '--body', 'red deploy', '--priority', 'high'], NTFY, {
    'ntfy.sh': { status: 200 },
  })
  assert.equal(r.status, 0)
  assert.match(r.out, /notify: sent — march: stopped/)
  assert.equal(r.calls.length, 1)
  const [call] = r.calls
  assert.equal(call.url, 'https://ntfy.sh/loop%20alerts')
  assert.equal(call.method, 'POST')
  assert.deepEqual(call.headers, { Title: 'march: stopped', Priority: 'high' })
  assert.equal(call.body, 'red deploy')
})

test('an unknown priority, or a flag with no value, sends default', () => {
  for (const args of [
    ['--priority', 'loud'],
    ['--priority', '--title', 'x'],
  ]) {
    const r = run(args, NTFY, { 'ntfy.sh': { status: 200 } })
    assert.equal(r.status, 0)
    assert.equal(r.calls[0].headers.Priority, 'default')
  }
})

test('the webhook gets a JSON payload with title, body, priority and an ISO timestamp', () => {
  const r = run(['--title', 'needs-user-call', '--body', 'row 79', '--priority', 'urgent'], HOOK, {
    'hooks.example.com': { status: 204 },
  })
  assert.equal(r.status, 0)
  assert.equal(r.calls.length, 1)
  const [call] = r.calls
  assert.equal(call.url, HOOK.NOTIFY_WEBHOOK_URL)
  assert.equal(call.headers['Content-Type'], 'application/json')
  const payload = JSON.parse(call.body)
  assert.equal(payload.title, 'needs-user-call')
  assert.equal(payload.body, 'row 79')
  assert.equal(payload.priority, 'urgent')
  assert.equal(new Date(payload.ts).toISOString(), payload.ts)
})

test('both channels fire; one answering is enough to count as sent', () => {
  const r = run(['--title', 't'], { ...NTFY, ...HOOK }, {
    'ntfy.sh': { status: 500 },
    'hooks.example.com': { status: 200 },
  })
  assert.equal(r.status, 0)
  assert.equal(r.calls.length, 2)
  assert.match(r.out, /notify: sent — t/)
  assert.equal(r.err, '')
})

test('every channel failing (an error status and a network error) still exits 0', () => {
  const r = run(['--title', 't'], { ...NTFY, ...HOOK }, {
    'ntfy.sh': { status: 500 },
    'hooks.example.com': { reject: true },
  })
  assert.equal(r.status, 0)
  assert.equal(r.calls.length, 2)
  assert.match(r.err, /all channels failed \(non-fatal\): t/)
  assert.doesNotMatch(r.out, /sent/)
})
