import { defaultProposals, openQuestions, parseQuestions } from '@survival/content'
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
    // The setting reads in plain words: the /config label, linked, and its value.
    expect(link?.textContent).toBe('Forced reveal every')
    expect(link?.parentElement?.textContent).toContain('Forced reveal every: off')
    expect(container.querySelector('[data-testid="readings"]')?.textContent).not.toMatch(
      /Setting: [^.]*(clock\.forcedRevealEvery|a list or table|differs\))/,
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
    expect(row63?.textContent).toContain('Measured with Engagements Combat')
    expect(row63?.textContent).toContain('Recommendation from the bot batches')
    expect(row63?.querySelector('button')?.textContent).toBe('Try this on /play')
    expect(container.querySelectorAll('[data-proposal]').length).toBe(6)
  })

  it("gives one recommendation per reading: the reading's own never contradicts its proposal (critique pass 26)", () => {
    const words = { 'turn-on': 'turn on', playtest: 'playtest', 'keep-off': 'keep off' } as const
    const rows = parseQuestions(questionsMd)
    for (const proposal of defaultProposals) {
      const reading = rows.find((r) => r.number === proposal.row)?.reading ?? ''
      const own = reading.match(/Recommendation: ([^.]*)\./)?.[1]
      if (own !== undefined) expect(own, `row ${proposal.row}`).toContain(words[proposal.advice])
    }
    // Row 67's proposal says playtest, so its old "turn on" line is gone.
    expect(rows.find((r) => r.number === 67)?.reading).not.toContain('Recommendation')
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

  it('names the Haul card, not a rules table row or a ruling number (critique pass 21)', () => {
    const { container } = render(<DecisionsPage />)
    for (const n of [59, 60]) {
      const text = container.querySelector(`[data-decided="${n}"]`)?.textContent ?? ''
      expect(text, `row ${n}`).toContain('The Haul card')
      expect(text, `row ${n}`).not.toMatch(/\brow 20\b/i)
    }
    const row78 = container.querySelector('[data-question="78"] h3')?.textContent ?? ''
    expect(row78).toContain('Spec v2 levels the Build card, and')
    expect(row78).not.toMatch(/ruling \d/)
  })

  it('drops the serial comma in the readings and checks, as the rest of the site does (critique pass 24)', () => {
    /** A comma before the "and" or "or" that ends a list: "Shop III, Training II, or Training III". */
    const SERIAL = /,[^,;:.()]*, (?:and|or)\b/
    expect('Shop II, Shop III, Training II, or Training III').toMatch(SERIAL)
    expect('card orientation, enemy type, and health').toMatch(SERIAL)
    expect('Shop II, Shop III, Training II or Training III').not.toMatch(SERIAL)
    const { container } = render(<DecisionsPage />)
    const hits = (container.textContent ?? '').match(new RegExp(`[^.;:?]*${SERIAL.source}`, 'g'))
    expect(hits ?? []).toEqual([])
  })

  it('shows what Spec v2 changed under a decided reading, on its own line (critique pass 16)', () => {
    const { container } = render(<DecisionsPage />)
    const note = (n: number) =>
      container.querySelector(`[data-decided="${n}"] [data-testid="spec-v2"]`)?.textContent
    expect(note(7)).toMatch(/^Now in the written rules: .*a grunt deals 1 damage, an elite 3\./)
    // Row 7 reads for a visitor: no data words, no bare row number (critique pass 19).
    expect(note(7)).not.toMatch(/enemy record|row \d/)
    expect(note(55)).toContain('currency')
    expect(note(72)).toContain('Combat is engagements')
    expect(note(76)).toBeUndefined()
    expect(container.querySelector('[data-decided="75"]')?.textContent).not.toContain(
      'stays an option',
    )
    expect(container.textContent).not.toContain('The game plays each of them now.')
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

  it('words row 57 for a visitor: no raw rule tag or data file name (critique pass 20)', () => {
    const { container } = render(<DecisionsPage />)
    const row = container.querySelector('[data-question="57"]')?.textContent ?? ''
    expect(row).toContain('(not in the written rules)')
    expect(row).toContain('Setting: Set in the map tiles, not on the Config page')
    expect(row).toContain('3 Countryside and 5 Core tiles')
    expect(container.querySelector('[data-testid="readings"]')?.textContent).not.toMatch(
      /rule Core loop v2|tiles\.json/,
    )
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
