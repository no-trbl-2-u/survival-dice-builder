import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Dice3D from './Dice3D.tsx'

const props = { faces: ['Sword', 'Shield'], kept: [false, true], roll: 100 } as const

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Dice3D', () => {
  it('without WebGL says so and points to the 2D dice, with no canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<Dice3D {...props} />)
    expect(container.textContent).toBe(
      '3D dice need WebGL, which this browser does not offer. The 2D dice are below.',
    )
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('checks for WebGL once, not on every render', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { rerender } = render(<Dice3D {...props} />)
    const calls = spy.mock.calls.length
    rerender(<Dice3D {...props} roll={200} />)
    expect(spy.mock.calls.length).toBe(calls)
  })

  it('with WebGL draws one canvas hidden from screen readers, the 2D dice carry the meaning', () => {
    // A stand-in context: enough for the check; the renderer cannot start on it and is skipped.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(<Dice3D {...props} />)
    const canvas = container.querySelectorAll('canvas')
    expect(canvas).toHaveLength(1)
    expect(canvas[0]!.getAttribute('aria-hidden')).toBe('true')
    expect(canvas[0]!.dataset['testid']).toBe('dice-3d')
    expect(canvas[0]!.hasAttribute('data-frame-ms')).toBe(false)
    expect(container.textContent).not.toContain('need WebGL')
  })
})
