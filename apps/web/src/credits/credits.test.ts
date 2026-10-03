import register from '../../../../ASSETS.md?raw'
import { describe, expect, it } from 'vitest'
import { assetCredits, commonLicense, fontCredits, parseAttribution } from './credits.ts'

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

  it('splits an attribution into work, author, and site', () => {
    expect(parseAttribution('Broadsword icon by Lorc, game-icons.net, CC BY 3.0')).toEqual({
      work: 'Broadsword icon',
      author: 'Lorc',
      site: 'game-icons.net',
    })
    expect(parseAttribution('none required')).toBeNull()
    for (const c of assetCredits(register)) {
      if (c.attribution !== 'none required') expect(parseAttribution(c.attribution)).not.toBeNull()
    }
  })

  it('finds the license most icons share', () => {
    expect(commonLicense(assetCredits(register))?.license).toBe('CC BY 3.0')
    expect(commonLicense([])).toBeNull()
  })

  it('lists the fonts', () => {
    expect(fontCredits(register).map((f) => f.font)).toEqual([
      'Oswald',
      'Atkinson Hyperlegible Next',
      'JetBrains Mono',
    ])
  })
})
