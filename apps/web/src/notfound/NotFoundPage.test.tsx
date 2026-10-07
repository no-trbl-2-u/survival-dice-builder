import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NotFoundPage } from './NotFoundPage.tsx'

describe('NotFoundPage', () => {
  it('names the unknown path and links to Home and Play', () => {
    render(<NotFoundPage path="/decision" />)
    expect(screen.getByText('/decision')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'the home page' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'start a run' }).getAttribute('href')).toBe('/play')
  })
})
