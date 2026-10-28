import { defaultContent } from '@survival/content'
import { legalActions, type GameState } from '@survival/engine'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DiceTray, EnemyDice } from './DiceTray.tsx'
import { forceEngagement } from './devEngage.ts'
import { newRun } from './run.ts'

/** An engagement whose enemy dice are 1 grunt and 1 elite, showing every enemy face. */
function engagedState(): GameState {
  const config = {
    ...defaultContent.config,
    combat: { ...defaultContent.config.combat, model: 'engage' as const },
  }
  const run = forceEngagement(newRun(config, 5))
  if (!run?.state.exchange) throw new Error('no engagement came up')
  const { state } = run
  const enemies = [
    { id: 'g1', kind: 'grunt', health: 3, hex: { q: 9, r: 9 } },
    { id: 'x1', kind: 'elite', health: 6, hex: { q: 9, r: 8 } },
  ]
  const enemyDice = [
    { enemy: 'g1', face: 'hit' as const },
    { enemy: 'g1', face: 'miss' as const },
    { enemy: 'x1', face: 'special' as const },
  ]
  return {
    ...state,
    enemies: [...state.enemies, ...enemies],
    exchange: { ...state.exchange!, engage: { enemyDice } },
  }
}

describe('DiceTray enemy dice', () => {
  it('draws each enemy die as a black die with its face glyph, grunt and elite apart', () => {
    const state = engagedState()
    const { hitDamage, specialDamage } = state.config.combat.engage
    render(
      <DiceTray
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        selected={[]}
        toggle={() => {}}
      />,
    )
    const hit = screen.getByLabelText(
      new RegExp(`^Enemy die of grunt, \\d+ hex(es)? [a-z-]+: Hit ${hitDamage}$`),
    )
    expect(hit.dataset.kind).toBe('grunt')
    expect(hit.querySelector('svg')?.dataset.icon).toBe('face-enemy-hit')
    expect(
      screen.getByLabelText(/^Enemy die of grunt, \d+ hex(es)? [a-z-]+: Miss$/).querySelector('svg')
        ?.dataset.icon,
    ).toBe('face-enemy-miss')
    const special = screen.getByLabelText(
      new RegExp(`^Enemy die of elite, \\d+ hex(es)? [a-z-]+: Special ${specialDamage}$`),
    )
    expect(special.dataset.kind).toBe('elite')
    expect(special.querySelector('svg')?.dataset.icon).toBe('face-enemy-special')
  })

  /** The engaged state with g1 defeated (gone) under the given `defeatedDice`. */
  const withDefeated = (defeatedDice: 'hit' | 'cancelled'): GameState => {
    const state = engagedState()
    return {
      ...state,
      config: {
        ...state.config,
        combat: {
          ...state.config.combat,
          engage: { ...state.config.combat.engage, defeatedDice },
        },
      },
      enemies: state.enemies.filter((e) => e.id !== 'g1'),
    }
  }
  const tray = (state: GameState) =>
    render(
      <DiceTray
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        selected={[]}
        toggle={() => {}}
      />,
    )

  it('Combat v3 "cancelled": the die of a defeated enemy is marked and says so', () => {
    const state = withDefeated('cancelled')
    const { hitDamage } = state.config.combat.engage
    const { container, unmount } = tray(state)
    expect(container.querySelectorAll('[data-cancelled]')).toHaveLength(2)
    expect(
      screen.getByLabelText(
        `Enemy die of enemy: Hit ${hitDamage}, cancelled: its enemy was defeated`,
      ),
    ).toBeTruthy()
    unmount()
  })

  it('Combat v3 "hit" (default): nothing is marked', () => {
    const { container } = tray(withDefeated('hit'))
    expect(container.querySelectorAll('[data-cancelled]')).toHaveLength(0)
  })

  it('the result marks the dice of the enemies the engagement defeated', () => {
    const state = withDefeated('hit')
    const { hitDamage } = state.config.combat.engage
    const rolls = engagedState().exchange!.engage!.enemyDice
    const { container } = render(
      <EnemyDice state={state} heading={false} rolls={rolls} defeated={['g1']} />,
    )
    expect(container.querySelectorAll('[data-defeated]')).toHaveLength(2)
    const view = within(container)
    expect(
      view.getByLabelText(`Enemy die of enemy: Hit ${hitDamage}, its enemy was defeated`),
    ).toBeTruthy()
    expect(view.getAllByText('enemy, defeated')).toHaveLength(2)
    expect(
      view.getByLabelText(/^Enemy die of elite, \d+ hex(es)? [a-z-]+: Special \d+$/).dataset
        .defeated,
    ).toBeUndefined()
  })
})

describe('the Dice headings name whose dice they are (16.3)', () => {
  const headings = (state: GameState) => {
    const { container } = render(
      <DiceTray state={state} legal={[]} act={() => {}} selected={[]} toggle={() => {}} />,
    )
    return [...container.querySelectorAll('h2, h3')].map((h) => h.textContent)
  }

  it('reads "Your dice" solo', () => {
    const [title, enemy, own] = headings(engagedState())
    expect(title).toMatch(/^Your dice — roll \d+ of \d+/)
    expect(enemy).toMatch(/^Enemy dice/)
    expect(own).toBe('Your dice')
  })

  it('reads "Player 2\'s dice" on the second player\'s turn in co-op', () => {
    const state = engagedState()
    const coop = { ...state, players: [state.players[0]!, state.players[0]!], current: 1 }
    const [title, , own] = headings(coop)
    expect(title).toMatch(/^Player 2's dice — roll \d+ of \d+/)
    expect(own).toBe("Player 2's dice")
  })
})

describe('the engagement dice list names whose dice they are (16.3)', () => {
  const name = (state: GameState) => {
    const { container } = render(
      <DiceTray
        state={state}
        legal={[]}
        act={() => {}}
        selected={[]}
        toggle={() => {}}
        enemyDice={false}
        controls={false}
        bare
      />,
    )
    return container.querySelector('ul')?.getAttribute('aria-label')
  }

  it('reads "Your dice" solo', () => {
    expect(name(engagedState())).toBe('Your dice')
  })

  it('reads "Player 2\'s dice" on the second player\'s turn in co-op', () => {
    const state = engagedState()
    expect(name({ ...state, players: [state.players[0]!, state.players[0]!], current: 1 })).toBe(
      "Player 2's dice",
    )
  })
})

describe('the all-placed note names whose dice they are (16.3)', () => {
  const note = (state: GameState, bare: boolean) => {
    const ex = state.exchange!
    const assignments = ex.dice.map((_, die) => ({
      die,
      skill: 's',
      use: 0,
      slot: die,
      asFace: 'Sword' as const,
    }))
    const placed = { ...state, exchange: { ...ex, assignments } }
    const { container } = render(
      <DiceTray
        state={placed}
        legal={[]}
        act={() => {}}
        selected={[]}
        toggle={() => {}}
        enemyDice={false}
        controls={false}
        bare={bare}
      />,
    )
    return within(container).getByText(/dice are on Skills\.$/).textContent
  }

  it('reads "All your dice" solo, in and out of the engagement window', () => {
    expect(note(engagedState(), false)).toBe('All your dice are on Skills.')
    expect(note(engagedState(), true)).toBe('All your dice are on Skills.')
  })

  it('reads "All Player 2\'s dice" on the second player\'s turn in co-op', () => {
    const state = engagedState()
    const coop = { ...state, players: [state.players[0]!, state.players[0]!], current: 1 }
    expect(note(coop, false)).toBe("All Player 2's dice are on Skills.")
    expect(note(coop, true)).toBe("All Player 2's dice are on Skills.")
  })
})
