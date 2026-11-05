import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('home-screen icon', () => {
  it('the shell links it next to the SVG favicon', () => {
    const shell = fs.readFileSync(path.join(WEB, 'index.html'), 'utf-8')
    expect(shell).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />')
  })

  it('is a 180x180 PNG with no alpha channel (iOS fills transparency with black)', () => {
    const png = fs.readFileSync(path.join(WEB, 'public', 'apple-touch-icon.png'))
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180])
    // IHDR colour type: 2 (RGB) or 0 (grey) carry no alpha; 4 and 6 do.
    expect([0, 2]).toContain(png[25])
  })
})
