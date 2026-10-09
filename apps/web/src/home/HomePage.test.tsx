import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { rulesUrl } from '../decisions/Inline.tsx'
import { HomePage } from './HomePage.tsx'

describe('HomePage', () => {
  it('says that a revealed tile adds enemies at every Combat', () => {
    render(<HomePage />)
    expect(
      screen.getByText(/new tile's spawn nodes add enemies at every Combat, and enemies go for/),
    ).toBeTruthy()
  })

  it('names both Combat models the start panel offers', () => {
    render(<HomePage />)
    const combat = screen.getAllByText(/play Engage to roll/)[0]
    expect(combat?.textContent).toMatch(/Or choose Exchanges, the Combat in the written rules/)
  })

  it('links the written rules it cites', () => {
    render(<HomePage />)
    const link = screen.getAllByRole('link', { name: 'written rules' })[0]
    expect(link?.getAttribute('href')).toBe(rulesUrl)
    expect(rulesUrl).toMatch(/\/blob\/main\/spec\/01-spec-v1-rules\.md$/)
  })
})
