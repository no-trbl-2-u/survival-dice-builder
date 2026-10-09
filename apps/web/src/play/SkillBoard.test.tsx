import { botChoice } from '@survival/bot'
import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions, type GameState } from '@survival/engine'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SkillBoard } from './SkillBoard.tsx'

const config = defaultContent.config

/** An engagement at its Use dice step with Sword, Wand, Sword; Strike already fired with die 1. */
function strikeFiredOnce(skillUses: 'unlimited' | 'once-per-exchange'): GameState {
  const cfg = {
    ...config,
    player: { ...config.player, startingDice: 3, starterSkills: ['cleave', 'strike'] },
    combat: { ...config.combat, model: 'engage' as const },
    options: { ...config.options, skillUses },
  }
  let s = createGame(cfg, 4)
  for (let i = 0; i < 2000 && s.exchange?.step !== 'assign'; i++) {
    const engage = legalActions(s).find((a) => a.type === 'engage')
    const stop = legalActions(s).find((a) => a.type === 'stopRolling')
    s = applyAction(s, stop ?? engage ?? botChoice(s)!).state
  }
  const ex = s.exchange!
  const faces = ['Sword', 'Wand', 'Sword'] as const
  return {
    ...s,
    exchange: {
      ...ex,
      dice: ex.dice.map((d, i) => ({ ...d, face: faces[i] ?? d.face })),
      assignments: [{ die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' }],
    },
  } as GameState
}

afterEach(cleanup)

const strikeTile = () => screen.getByText('Strike:').closest('li')!

describe('SkillBoard: a Skill that fires more than once', () => {
  it('unlimited: a fired Skill says so and offers its next use to a fitting die', () => {
    const state = strikeFiredOnce('unlimited')
    render(
      <SkillBoard
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        actAll={() => {}}
        selected={[2]}
      />,
    )
    expect(within(strikeTile()).getByText('fired')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Put die 3 on Strike' })).toBeTruthy()
  })

  it('unlimited, nothing chosen: a fired Skill that the free dice fill again can fire again', () => {
    const state = strikeFiredOnce('unlimited')
    render(
      <SkillBoard
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        actAll={() => {}}
        selected={[]}
      />,
    )
    expect(within(strikeTile()).getByText('can fire again')).toBeTruthy()
  })

  it('once per exchange: a fired Skill takes no more dice', () => {
    const state = strikeFiredOnce('once-per-exchange')
    render(
      <SkillBoard
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        actAll={() => {}}
        selected={[2]}
      />,
    )
    expect(within(strikeTile()).getByText('fired')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Put die 3 on Strike' })).toBeNull()
  })
})
