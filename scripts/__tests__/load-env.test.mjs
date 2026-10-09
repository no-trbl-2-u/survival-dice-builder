// scripts/__tests__/load-env.test.mjs
//
// Unit tests for scripts/load-env.mjs (node:test, no devDeps).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { envFiles, loadEnv, parseEnv } from '../load-env.mjs'

test('parseEnv reads KEY=value lines and drops quotes', () => {
  assert.deepEqual(parseEnv('A=1\r\n# note\nB = "two"\nlower=x\nC=\'3\''), {
    A: '1',
    B: 'two',
    C: '3',
  })
})

test('a worktree without .env falls back to the main checkout; nearer files and the shell win', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'load-env-'))
  const main = path.join(root, 'main')
  const worktree = path.join(root, 'worktree')
  fs.mkdirSync(main)
  fs.mkdirSync(worktree)
  fs.writeFileSync(path.join(main, '.env'), 'TOKEN=main\nONLY_MAIN=yes\nSHELL_SET=main\n')

  assert.deepEqual(envFiles(worktree, main), [path.join(main, '.env')])
  const env = loadEnv(envFiles(worktree, main), { SHELL_SET: 'shell' })
  assert.deepEqual(env, { SHELL_SET: 'shell', TOKEN: 'main', ONLY_MAIN: 'yes' })

  fs.writeFileSync(path.join(worktree, '.env'), 'TOKEN=worktree\n')
  const files = envFiles(worktree, main)
  assert.deepEqual(files, [path.join(worktree, '.env'), path.join(main, '.env')])
  assert.equal(loadEnv(files, {}).TOKEN, 'worktree')
  assert.deepEqual(envFiles(main, main), [path.join(main, '.env')])
  fs.rmSync(root, { recursive: true, force: true })
})
