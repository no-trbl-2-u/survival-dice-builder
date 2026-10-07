import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage.tsx'

describe('HomePage', () => {
  it('says that a revealed tile adds enemies at every Combat', () => {
    render(<HomePage />)
    expect(
      screen.getByText(/new tile's spawn nodes add enemies at every Combat, and enemies go for/),
    ).toBeTruthy()
  })
})
