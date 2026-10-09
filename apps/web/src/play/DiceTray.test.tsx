import { defaultContent } from '@survival/content'
import { legalActions, type GameState } from '@survival/engine'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DiceTray } from './DiceTray.tsx'
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
    { id: 'g1', kind: 'grunt', health: 3, hex: { q: 9, r: 9 }, attackedThisCombat: false },
    { id: 'x1', kind: 'elite', health: 6, hex: { q: 9, r: 8 }, attackedThisCombat: false },
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
})
