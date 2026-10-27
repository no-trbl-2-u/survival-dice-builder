import { defaultContent } from '@survival/content'
import { createGame } from '@survival/engine'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EngageVitals } from './EngagementModal.tsx'

const config = defaultContent.config

describe('the engagement vitals name whose they are (16.3)', () => {
  it('reads health and guard alone solo', () => {
    const { container } = render(<EngageVitals state={createGame(config, 1)} />)
    expect(container.textContent).toMatch(/^ Health \d+\/\d+ Guard \d+$/)
  })

  it('starts with "Player 2" on the second player\'s turn in co-op', () => {
    const game = { ...createGame(config, 1, defaultContent, { players: 3 }), current: 1 }
    const { container } = render(<EngageVitals state={game} />)
    expect(container.textContent).toMatch(/^Player 2 Health \d+\/\d+/)
  })
})
