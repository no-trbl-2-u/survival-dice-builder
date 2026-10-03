import register from '../../../../ASSETS.md?raw'
import { describe, expect, it } from 'vitest'
import { assetCredits, fontCredits } from './credits.ts'

const iconFiles = Object.keys(import.meta.glob('../../../../assets/icons/*/*.svg')).map((p) =>
  p.replace(/^(\.\.\/)+/, ''),
)

describe('credits', () => {
  it('lists every asset marked in use, and no candidates', () => {
    const inUse = register.split('\n').filter((l) => /\|\s*in use\s*\|/.test(l)).length
    const credits = assetCredits(register)
    expect(credits).toHaveLength(inUse)
    expect(credits.length).toBeGreaterThan(10)
    expect(credits.map((c) => c.path)).toContain('assets/icons/dice/sword.svg')
    expect(credits.some((c) => c.path.includes('kenney'))).toBe(false)
  })

  it('lists every file under assets/icons', () => {
    const paths = new Set(assetCredits(register).map((c) => c.path))
    expect(iconFiles.length).toBeGreaterThan(10)
    expect(iconFiles.filter((f) => !paths.has(f))).toEqual([])
  })

  it('lists the fonts', () => {
    expect(fontCredits(register).map((f) => f.font)).toEqual([
      'Oswald',
      'Atkinson Hyperlegible Next',
      'JetBrains Mono',
    ])
  })
})
