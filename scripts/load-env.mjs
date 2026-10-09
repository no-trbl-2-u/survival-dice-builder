// scripts/load-env.mjs
//
// Loads `.env` into process.env for the repo scripts (Node has no
// built-in .env loader). Order, first one wins per key:
//   1. the shell environment
//   2. `.env` in the current directory
//   3. `.env` in the main checkout, found through git's common dir
//
// (3) is for git worktrees: `.env` is gitignored, so a new worktree
// has none, and the scripts would otherwise run without tokens.
// Importing this module loads the files; `loadEnv` is exported for
// tests.

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

/** Parses `KEY=value` lines; quotes around a value are dropped. */
export function parseEnv(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

/** The main checkout's root (the parent of git's common dir), or null outside git. */
export function mainCheckout(cwd = process.cwd()) {
  try {
    const common = execSync('git rev-parse --path-format=absolute --git-common-dir', {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return common ? path.dirname(common) : null
  } catch {
    return null
  }
}

/** The `.env` files to read, nearest first, without duplicates. */
export function envFiles(cwd = process.cwd(), main = mainCheckout(cwd)) {
  const files = [path.resolve(cwd, '.env')]
  if (main) files.push(path.resolve(main, '.env'))
  return [...new Set(files)].filter((f) => fs.existsSync(f))
}

/** Loads the files into `env`; a key already set is never overwritten. */
export function loadEnv(files = envFiles(), env = process.env) {
  for (const file of files) {
    for (const [key, value] of Object.entries(parseEnv(fs.readFileSync(file, 'utf-8')))) {
      if (env[key] === undefined) env[key] = value
    }
  }
  return env
}

loadEnv()
