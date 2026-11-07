import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Inline, repoFileUrl, rowId, rulesUrl } from './Inline.tsx'

afterEach(cleanup)

const QUESTIONS = repoFileUrl('OPEN-QUESTIONS.md')

/** Renders one line and returns its container. */
const line = (text: string, rows?: ReadonlySet<number>) =>
  render(<p>{rows ? <Inline text={text} rows={rows} /> : <Inline text={text} />}</p>).container
    .firstElementChild as HTMLElement

/** Each link in the line as [label, href]. */
const links = (el: HTMLElement) =>
  [...el.querySelectorAll('a')].map((a) => [a.textContent, a.getAttribute('href')])

describe('Inline', () => {
  it('points repository files and the written rules at main on GitHub', () => {
    expect(repoFileUrl('plan/AUDIT.md')).toBe(
      'https://github.com/no-trbl-2-u/survival-dice-builder/blob/main/plan/AUDIT.md',
    )
    expect(rulesUrl).toBe(repoFileUrl('spec/01-spec-v2-rules.md'))
    expect(rowId(12)).toBe('q-12')
  })

  it('renders **bold** and `code`, and keeps the rest as text', () => {
    const el = line('Keep **the Haul card** and `maxHand` as they are.')
    expect(el.textContent).toBe('Keep the Haul card and maxHand as they are.')
    expect(el.querySelector('strong')?.textContent).toBe('the Haul card')
    expect(el.querySelector('code')?.textContent).toBe('maxHand')
    expect(el.querySelector('a')).toBeNull()
  })

  it('leaves an empty marker as text', () => {
    expect(line('a **** b').textContent).toBe('a **** b')
    expect(line('a ** b').querySelector('strong')).toBeNull()
  })

  it('links a code span with a full repository path, but not a bare file name', () => {
    const el = line('See `docs/reports/phase-22-experiments.md` and `PROTOCOL.md`.')
    expect(links(el)).toEqual([
      ['docs/reports/phase-22-experiments.md', repoFileUrl('docs/reports/phase-22-experiments.md')],
    ])
    expect(el.querySelector('a code')?.textContent).toBe('docs/reports/phase-22-experiments.md')
    const bare = [...el.querySelectorAll('code')].find((c) => c.textContent === 'PROTOCOL.md')
    expect(bare?.closest('a')).toBeNull()
  })

  it('leaves row numbers as text without a set of listed rows', () => {
    const el = line('Like row 9 and rows 65 and 69.')
    expect(el.textContent).toBe('Like row 9 and rows 65 and 69.')
    expect(el.querySelector('a')).toBeNull()
  })

  it('links "row N" in-page when it is listed, else to the full table', () => {
    const el = line('Like row 9, unlike row 62.', new Set([9]))
    expect(el.textContent).toBe('Like row 9, unlike row 62.')
    expect(links(el)).toEqual([
      ['row 9', '#q-9'],
      ['row 62', QUESTIONS],
    ])
  })

  it('links each number after "rows", in every list form, and keeps "rows " as text', () => {
    const rows = new Set([26, 65, 69, 70])
    expect(links(line('rows 65 and 69', rows))).toEqual([
      ['65', '#q-65'],
      ['69', '#q-69'],
    ])
    expect(links(line('rows 26, 28 and 30', rows))).toEqual([
      ['26', '#q-26'],
      ['28', QUESTIONS],
      ['30', QUESTIONS],
    ])
    const range = line('rows 63-70 stand', rows)
    expect(range.textContent).toBe('rows 63-70 stand')
    expect(links(range)).toEqual([
      ['63', QUESTIONS],
      ['70', '#q-70'],
    ])
  })

  it('does not link a capitalised "Row N" or a number inside a word', () => {
    const el = line('Row 9 and arrow 9 and rows9.', new Set([9]))
    expect(el.querySelector('a')).toBeNull()
  })

  it('links row numbers in text but not inside bold or code', () => {
    const el = line('**row 9** and `row 9` and row 9', new Set([9]))
    expect(links(el)).toEqual([['row 9', '#q-9']])
  })
})
