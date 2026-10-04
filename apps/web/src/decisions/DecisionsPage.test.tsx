import { openQuestions, parseQuestions } from '@survival/content'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import questionsMd from '../../../../OPEN-QUESTIONS.md?raw'
import { DecisionsPage } from './DecisionsPage.tsx'

describe('DecisionsPage', () => {
  it('lists open readings with config links, and the checks', () => {
    const { container } = render(<DecisionsPage />)
    const readings = container.querySelectorAll('[data-testid="readings"] > li')
    // Exactly the open rows; the count falls as the designer settles readings.
    expect(readings.length).toBe(openQuestions(parseQuestions(questionsMd)).length)
    expect(readings.length).toBeGreaterThan(0)
    // Row 1 is decided, so it is not listed; row 7 (pending-spec) comes first.
    expect(container.querySelector('[data-question="1"]')).toBeNull()
    expect(readings[0]?.getAttribute('data-question')).toBe('7')
    const link = container.querySelector('a[href="/config#cfg-rulings-structureDamage"]')
    expect(link?.textContent).toBe('rulings.structureDamage')
    expect(container.querySelectorAll('[data-testid="checks"] > li').length).toBeGreaterThan(3)
    expect(container.textContent).not.toMatch(/undefined|\*\*/)
  })
})
