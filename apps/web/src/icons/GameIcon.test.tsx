import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { GameIcon } from './GameIcon.tsx'
import { gameIcons, ICON_VIEWBOX } from './gameIcons.ts'

afterEach(cleanup)

const svgOf = (container: HTMLElement) => {
  const svg = container.querySelector('svg')
  if (!svg) throw new Error('no svg')
  return svg
}

describe('GameIcon', () => {
  it('draws the named icon in the 512 box, sized 1.1em by default', () => {
    const svg = svgOf(render(<GameIcon name="health" />).container)
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`)
    expect(svg.getAttribute('width')).toBe('1.1em')
    expect(svg.getAttribute('height')).toBe('1.1em')
    expect(svg.getAttribute('data-icon')).toBe('health')
    // The markup is the icon file's shapes; the DOM writes self-closing tags out in full.
    const d = gameIcons['health']?.match(/ d="([^"]+)"/)?.[1]
    expect(d).toBeTruthy()
    expect(svg.querySelector('path')?.getAttribute('d')).toBe(d)
  })

  it('is decorative: hidden from screen readers and out of the tab order', () => {
    const svg = svgOf(render(<GameIcon name="guard" />).container)
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.getAttribute('focusable')).toBe('false')
  })

  it('takes a size and a class', () => {
    const svg = svgOf(render(<GameIcon name="materials" size="2rem" className="big" />).container)
    expect(svg.getAttribute('width')).toBe('2rem')
    expect(svg.getAttribute('height')).toBe('2rem')
    expect(svg.getAttribute('class')).toBe('big')
  })

  it('draws an empty icon for a name with no file', () => {
    const svg = svgOf(render(<GameIcon name="no-such-icon" />).container)
    expect(svg.innerHTML).toBe('')
    expect(svg.getAttribute('data-icon')).toBe('no-such-icon')
  })
})
