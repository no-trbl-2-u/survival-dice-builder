import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const HEADERS = path.join(here, '..', 'public', '_headers')

/** The `_headers` rules as path pattern -> header lines (comments and blanks dropped). */
function rules(text: string): Map<string, string[]> {
  const out = new Map<string, string[]>()
  let current: string[] | null = null
  for (const line of text.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    if (/^\s/.test(line)) {
      if (!current) throw new Error(`header line with no path: ${line}`)
      current.push(line.trim())
    } else {
      current = []
      out.set(line.trim(), current)
    }
  }
  return out
}

describe('Cloudflare Pages _headers', () => {
  const parsed = rules(fs.readFileSync(HEADERS, 'utf-8'))

  it('lets browsers keep the content-hashed /assets/ files for a year', () => {
    expect(parsed.get('/assets/*')).toEqual(['Cache-Control: public, max-age=31536000, immutable'])
  })

  it('sets a long cache on nothing else, so pages and unhashed files show a deploy at once', () => {
    expect([...parsed.keys()]).toEqual(['/assets/*'])
  })
})
