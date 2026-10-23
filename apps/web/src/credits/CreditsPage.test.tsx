import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CreditsPage } from './CreditsPage.tsx'

describe('CreditsPage', () => {
  it('ends an in-house line at "drawn for this game", with no gloss or license note', () => {
    render(<CreditsPage />)
    const list = screen.getByTestId('credits-assets').textContent
    expect(list).toContain('Blank die face (empty): drawn for this game')
    expect(list).toContain('Enemy die face: miss (empty): drawn for this game')
    expect(list).not.toContain('Project-owned')
    expect(list).not.toMatch(/shows nothing/)
  })
})
