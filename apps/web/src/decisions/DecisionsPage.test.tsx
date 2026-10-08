import { openQuestions, parseQuestions } from '@survival/content'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import questionsMd from '../../../../OPEN-QUESTIONS.md?raw'
import { DecisionsPage } from './DecisionsPage.tsx'
import { repoFileUrl } from './Inline.tsx'

/** Every document in the repository the page may name, as paths from the repository root. */
const repoFiles = new Set(
  Object.keys(
    import.meta.glob('../../../../{*.md,{docs,design,plan,spec}/**/*.{md,csv,html}}'),
  ).map((k) => k.slice('../../../../'.length)),
)

describe('DecisionsPage', () => {
  it('lists open readings with config links, and the checks', () => {
    const { container } = render(<DecisionsPage />)
    const readings = container.querySelectorAll('[data-testid="readings"] > li')
    // Exactly the open rows; the count falls as the designer settles readings.
    expect(readings.length).toBe(openQuestions(parseQuestions(questionsMd)).length)
    expect(readings.length).toBeGreaterThan(0)
    // Row 1 is decided, so it is not listed; pending-spec rows come first, and row 7 is one.
    expect(container.querySelector('[data-question="1"]')).toBeNull()
    expect(readings[0]?.textContent).toContain('pending-spec')
    expect(container.querySelector('[data-question="7"]')).not.toBeNull()
    const link = container.querySelector('a[href="/config#cfg-rulings-structureDamage"]')
    expect(link?.textContent).toBe('rulings.structureDamage')
    // The config label stands before the path.
    expect(link?.parentElement?.textContent).toContain('Structure damage (rulings.structureDamage)')
    expect(container.querySelectorAll('[data-testid="checks"] > li').length).toBeGreaterThan(3)
    expect(container.textContent).not.toMatch(/undefined|\*\*/)
  })

  it('links every repository file it names to GitHub, and each file exists', () => {
    const { container } = render(<DecisionsPage />)
    const prefix = repoFileUrl('')
    const links = [...container.querySelectorAll<HTMLAnchorElement>(`a[href^="${prefix}"]`)]
    const paths = links.map((a) => a.getAttribute('href')!.slice(prefix.length))
    expect(paths).toContain('OPEN-QUESTIONS.md')
    expect(paths).toContain('docs/DECISIONS.md')
    expect(paths).toContain('docs/reports/phase-22-experiments.md')
    for (const path of paths) expect(repoFiles.has(path), path).toBe(true)
    // No full file path is left as bare code text.
    const bare = [...container.querySelectorAll('code')].filter(
      (c) => /\/.*\.(md|csv|html)$/.test(c.textContent ?? '') && c.parentElement?.tagName !== 'A',
    )
    expect(bare).toEqual([])
  })
})
