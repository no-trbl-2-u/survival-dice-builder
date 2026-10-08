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
    expect(readings[0]?.textContent).toContain('Waiting for the designer to write the rule')
    // Statuses are plain words: no build terms or phase numbers.
    expect(container.querySelector('[data-testid="readings"]')?.textContent).not.toMatch(
      /Status: [^.]*(pending-spec|structural|phase \d)/,
    )
    expect(container.querySelector('[data-question="7"]')).not.toBeNull()
    const link = container.querySelector('a[href="/config#cfg-rulings-structureDamage"]')
    expect(link?.textContent).toBe('rulings.structureDamage')
    // The config label stands before the path.
    expect(link?.parentElement?.textContent).toContain('Structure damage (rulings.structureDamage)')
    expect(container.querySelectorAll('[data-testid="checks"] > li').length).toBeGreaterThan(3)
    expect(container.textContent).not.toMatch(/undefined|\*\*/)
  })

  it('links each row it names: to the listed reading, or to the full table for a settled row', () => {
    const { container } = render(<DecisionsPage />)
    const row = (n: number) => container.querySelector(`[data-question="${n}"]`)
    // Row 30 points at row 49, which is open and listed on the page.
    const listed = [...row(30)!.querySelectorAll('a')].find((a) => a.textContent === 'row 49')
    expect(listed?.getAttribute('href')).toBe('#q-49')
    expect(container.querySelector('#q-49')).toBe(row(49))
    // Row 63 points at row 62, which is settled and not listed.
    expect(row(62)).toBeNull()
    const hidden = [...row(63)!.querySelectorAll('a')].find((a) => a.textContent === 'row 62')
    expect(hidden?.getAttribute('href')).toBe(repoFileUrl('OPEN-QUESTIONS.md'))
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
