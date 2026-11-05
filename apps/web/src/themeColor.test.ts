import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const shell = fs.readFileSync(path.join(WEB, 'index.html'), 'utf-8')
const tokens = fs.readFileSync(path.join(WEB, 'src', 'styles', 'tokens.css'), 'utf-8')

/** The `--wood-table` value in a block of tokens.css (the page's outer background). */
function woodTable(css: string): string {
  const value = /--wood-table:\s*(#[0-9a-f]{6});/i.exec(css)?.[1]
  if (!value) throw new Error('tokens.css lost --wood-table')
  return value.toLowerCase()
}

describe('browser colour hints in the shell', () => {
  it('names both colour schemes, so a dark-mode visitor gets a dark canvas before the CSS loads', () => {
    expect(shell).toContain('<meta name="color-scheme" content="light dark" />')
  })

  it('tints the browser bar with the wood table each scheme paints around the board', () => {
    const dark = tokens.indexOf('@media (prefers-color-scheme: dark)')
    expect(dark).toBeGreaterThan(0)
    const light = woodTable(tokens.slice(0, dark))
    const night = woodTable(tokens.slice(dark))
    expect(shell).toContain(
      `<meta name="theme-color" content="${light}" media="(prefers-color-scheme: light)" />`,
    )
    expect(shell).toContain(
      `<meta name="theme-color" content="${night}" media="(prefers-color-scheme: dark)" />`,
    )
  })
})
