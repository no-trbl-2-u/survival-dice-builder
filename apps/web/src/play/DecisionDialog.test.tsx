import { defaultContent } from '@survival/content'
import { createGame } from '@survival/engine'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DecisionDialog } from './DecisionDialog.tsx'

afterEach(cleanup)

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

  it('names the seat in co-op and speaks to "you" solo', () => {
    const coop = {
      ...createGame(defaultContent.config, 1, defaultContent, { players: 3 }),
      current: 1,
    }
    const player = coop.players[1]!
    const owned = [...player.deck, ...player.discard]
    const first = owned.find((c) => owned.filter((o) => o.def === c.def).length > 1)!
    const copies = owned.filter((c) => c.def === first.def)
    const legal = copies.map((c) => ({ type: 'returnStarter' as const, card: c.id }))
    const { unmount } = render(<DecisionDialog state={coop} legal={legal} act={() => {}} />)
    expect(screen.getByRole('dialog', { name: /^Player 2 Return a starter card$/ })).toBeTruthy()
    expect(screen.getByRole('button').textContent).toContain(`(Player 2 has ${copies.length})`)
    unmount()
    const solo = createGame(defaultContent.config, 1)
    const own = [...solo.players[0]!.deck, ...solo.players[0]!.discard]
    const twin = own.find((c) => own.filter((o) => o.def === c.def).length > 1)!
    render(
      <DecisionDialog
        state={solo}
        legal={own
          .filter((c) => c.def === twin.def)
          .map((c) => ({ type: 'returnStarter' as const, card: c.id }))}
        act={() => {}}
      />,
    )
    expect(screen.getByRole('dialog', { name: /^Return a starter card$/ })).toBeTruthy()
    expect(screen.getByRole('button').textContent).toContain('(you have')
  })

  it("marks a co-op seat's pooled draft options as theirs", () => {
    const skill = defaultContent.skills[0]!.id
    const coop = {
      ...createGame(defaultContent.config, 1, defaultContent, { players: 2 }),
      current: 1,
    }
    const state = {
      ...coop,
      draft: {
        player: coop.players[1]!.id,
        level: '1',
        options: [skill],
        kept: null,
        fromPool: [skill],
      },
    }
    render(<DecisionDialog state={state} legal={[{ type: 'draftSkill', skill }]} act={() => {}} />)
    expect(screen.getByRole('button').textContent).toContain("(from Player 2's pool)")
  })
})
