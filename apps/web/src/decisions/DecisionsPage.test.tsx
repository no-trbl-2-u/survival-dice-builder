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
    // Row 1 is decided, so it is not listed; pending-spec rows come first.
    expect(container.querySelector('[data-question="1"]')).toBeNull()
    expect(readings[0]?.textContent).toContain('Waiting for the designer to write the rule')
    // Statuses are plain words: no build terms or phase numbers.
    expect(container.querySelector('[data-testid="readings"]')?.textContent).not.toMatch(
      /Status: [^.]*(pending-spec|structural|phase \d)/,
    )
    // Row 7 was settled by Spec v2 (ruling 17), so it is not listed; row 63 is open.
    expect(container.querySelector('[data-question="7"]')).toBeNull()
    expect(container.querySelector('[data-question="63"]')).not.toBeNull()
    const link = container.querySelector('a[href="/config#cfg-clock-forcedRevealEvery"]')
    expect(link?.textContent).toBe('clock.forcedRevealEvery')
    // The config label stands before the path.
    expect(link?.parentElement?.textContent).toContain(
      'Forced reveal every (clock.forcedRevealEvery)',
    )
    expect(container.querySelectorAll('[data-testid="checks"] > li').length).toBeGreaterThan(3)
    expect(container.textContent).not.toMatch(/undefined|\*\*/)
  })

  it('says the default Combat model; no open reading is for one model only (Spec v2)', () => {
    const { container } = render(<DecisionsPage />)
    expect(container.textContent).toContain('Combat uses engagements by default.')
    // Spec v2 (ruling 18) removed the exchange-only options of rows 65 and 69.
    expect(container.querySelector('[data-question="65"]')).toBeNull()
    expect(container.querySelector('[data-question="69"]')).toBeNull()
    expect(container.querySelector('[data-testid="combat-model"]')).toBeNull()
  })

  it('shows each proposal with its measured effect and a Try button (phase 39)', () => {
    const { container } = render(<DecisionsPage />)
    const row63 = container.querySelector('[data-question="63"] [data-proposal]')
    expect(row63?.textContent).toContain('Proposal: Forced reveal.')
    expect(row63?.textContent).toContain('Measured under engagements')
    expect(row63?.textContent).toContain('Recommendation from the bot batches')
    expect(row63?.querySelector('button')?.textContent).toBe('Try this on /play')
    expect(container.querySelectorAll('[data-proposal]').length).toBe(6)
  })

  it('lists the readings decided recently, newest first (phase 37)', () => {
    const { container } = render(<DecisionsPage />)
    const recent = [...container.querySelectorAll('[data-testid="recent"] > li')]
    const numbers = recent.map((li) => Number(li.getAttribute('data-decided')))
    // The Spec v2 rulings of 2026-10-11 lead the list, then the changes of 2026-10-09.
    const v2 = [7, 30, 49, 50, 55, 59, 60, 65, 69, 73, 74]
    expect(numbers.slice(0, v2.length).sort((a, b) => a - b)).toEqual(v2)
    expect(numbers.slice(v2.length).sort((a, b) => a - b)).toEqual([72, 75, 76, 77])
    expect(container.querySelector('[data-decided="76"]')?.textContent).toContain(
      'decided 2026-10-09',
    )
    // Open readings are not listed as decided.
    expect(numbers).not.toContain(63)
    expect(container.querySelector('nav a[href="#recent"]')).not.toBeNull()
  })

  it('links each row it names: to the listed reading, or to the full table for a settled row', () => {
    const { container } = render(<DecisionsPage />)
    const row = (n: number) => container.querySelector(`[data-question="${n}"]`)
    // Row 46 points at row 9, which is open and listed on the page.
    const listed = [...row(46)!.querySelectorAll('a')].find((a) => a.textContent === 'row 9')
    expect(listed?.getAttribute('href')).toBe('#q-9')
    expect(container.querySelector('#q-9')).toBe(row(9))
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
