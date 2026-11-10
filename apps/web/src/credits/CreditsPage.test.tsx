import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CreditsPage } from './CreditsPage.tsx'

describe('CreditsPage', () => {
  afterEach(cleanup)

  it('ends an in-house line at "drawn for this game", with no gloss or license note', () => {
    render(<CreditsPage />)
    const list = screen.getByTestId('credits-assets').textContent
    expect(list).toContain('Blank die face (empty): drawn for this game')
    expect(list).toContain('Enemy die face: miss (empty): drawn for this game')
    expect(list).not.toContain('Project-owned')
    expect(list).not.toMatch(/shows nothing/)
  })
  it('excludes the icons drawn for this game from the icon license sentence', () => {
    render(<CreditsPage />)
    expect(screen.getByText(/Every icon by a named artist is under/).textContent).toBe(
      'Every icon by a named artist is under CC BY 3.0; the icons drawn for this game are not. Each name links to its source.',
    )
    expect(screen.queryByText(/Unless a line says otherwise/)).toBeNull()
    expect(screen.getByText(/Every texture is under/).textContent).toBe(
      'Every texture is under CC0. Each name links to its source.',
    )
  })
  it('gives every font and library a role, a source link and a unique license link', () => {
    render(<CreditsPage />)
    expect(screen.getByTestId('credits-fonts').textContent).toContain(
      'Bitter (body and numbers): Bitter license (SIL OFL 1.1)',
    )
    expect(screen.getByTestId('credits-software').textContent).toContain(
      'Zod (checks rules data and saved configs): Zod license (MIT)',
    )
    expect(screen.getByRole('link', { name: 'React' }).getAttribute('href')).toBe(
      'https://react.dev/',
    )
    expect(screen.getByRole('link', { name: 'Alfa Slab One' }).getAttribute('href')).toBe(
      'https://fonts.google.com/specimen/Alfa+Slab+One',
    )
    // No two Fonts or Software links share a name.
    const names = [screen.getByTestId('credits-fonts'), screen.getByTestId('credits-software')]
      .flatMap((ul) => [...ul.querySelectorAll('a')])
      .map((a) => a.textContent)
    expect(new Set(names).size).toBe(names.length)
    expect(names).not.toContain('MIT')
  })
})
