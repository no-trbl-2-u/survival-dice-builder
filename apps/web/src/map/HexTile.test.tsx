import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HexTile } from './HexTile.tsx'

describe('HexTile', () => {
  it('3.1 renders exactly 7 hex polygons', () => {
    const { container } = render(<HexTile center={{ q: 0, r: 0 }} />)
    expect(container.querySelectorAll('polygon[data-hex]')).toHaveLength(7)
  })
})
