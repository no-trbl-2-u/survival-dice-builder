import { defaultContent } from '@survival/content'
import { createGame } from '@survival/engine'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DecisionDialog } from './DecisionDialog.tsx'

describe('DecisionDialog', () => {
  it('names starter returns by card and text, says why, and hides engine ids', () => {
    const state = createGame(defaultContent.config, 1)
    const player = state.players[state.current]!
    const owned = [...player.deck, ...player.discard]
    const first = owned[0]!
    const def = defaultContent.cards.find((c) => c.id === first.def)!
    const copies = owned.filter((c) => c.def === first.def)
    render(
      <DecisionDialog
        state={state}
        legal={copies.map((c) => ({ type: 'returnStarter', card: c.id }))}
        act={() => {}}
      />,
    )
    expect(screen.getByText(/leaves your deck for good/)).toBeTruthy()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]!.textContent).toContain(`Return ${def.name}`)
    expect(buttons[0]!.textContent).toContain('Prepare:')
    expect(buttons[0]!.textContent).not.toContain(first.id)
  })

  it('says unkept Skills go to the pool only when the config pools them', () => {
    const skills = defaultContent.skills.slice(0, 2).map((s) => s.id)
    const legal = skills.map((skill) => ({ type: 'draftSkill' as const, skill }))
    const state = createGame(defaultContent.config, 1)
    const { unmount } = render(
      <DecisionDialog
        state={{
          ...state,
          config: { ...state.config, draft: { ...state.config.draft, unpicked: 'pool' } },
        }}
        legal={legal}
        act={() => {}}
      />,
    )
    expect(screen.getByText(/do not keep go to your pool/)).toBeTruthy()
    unmount()
    render(
      <DecisionDialog
        state={{
          ...state,
          config: { ...state.config, draft: { ...state.config.draft, unpicked: 'supply' } },
        }}
        legal={legal}
        act={() => {}}
      />,
    )
    expect(screen.queryByText(/do not keep go to your pool/)).toBeNull()
  })
})
