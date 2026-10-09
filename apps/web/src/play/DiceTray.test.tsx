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
    const hit = screen.getByLabelText(`Enemy die of grunt g1: Hit ${hitDamage}`)
    expect(hit.dataset.kind).toBe('grunt')
    expect(hit.querySelector('svg')?.dataset.icon).toBe('face-enemy-hit')
    expect(
      screen.getByLabelText('Enemy die of grunt g1: Miss').querySelector('svg')?.dataset.icon,
    ).toBe('face-enemy-miss')
    const special = screen.getByLabelText(`Enemy die of elite x1: Special ${specialDamage}`)
    expect(special.dataset.kind).toBe('elite')
    expect(special.querySelector('svg')?.dataset.icon).toBe('face-enemy-special')
  })
})
