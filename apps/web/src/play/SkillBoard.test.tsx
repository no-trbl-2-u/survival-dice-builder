import { botChoice } from '@survival/bot'
import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions, type GameState } from '@survival/engine'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SkillBoard } from './SkillBoard.tsx'

const config = defaultContent.config

/** An engagement at its Use dice step with Sword, Wand, Sword; Strike already fired with die 1. */
function strikeFiredOnce(): GameState {
  const cfg = {
    ...config,
    player: { ...config.player, startingDice: 3, starterSkills: ['cleave', 'strike'] },
    combat: { ...config.combat, model: 'engage' as const },
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
    const state = strikeFiredOnce()
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
    const state = strikeFiredOnce()
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
})

describe('SkillBoard: a Skill with more slots than the player has dice', () => {
  function game(startingDice: number): GameState {
    return createGame(
      {
        ...config,
        player: { ...config.player, startingDice, starterSkills: ['strike', 'spark-burst'] },
      },
      4,
    )
  }
  const renderBoard = (state: GameState) =>
    render(
      <SkillBoard
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        actAll={() => {}}
        selected={[]}
      />,
    )

  it('at 1 die, a 2-slot Skill says it needs 2 dice and how to get more', () => {
    renderBoard(game(1))
    const spark = screen.getByText('Spark Burst:').closest('li')!
    expect(
      within(spark).getByText(
        'Needs 2 dice, you have 1. A level up or a card that adds a die gives you more.',
      ),
    ).toBeTruthy()
    const strike = screen.getByText('Strike:').closest('li')!
    expect(within(strike).queryByText(/Needs \d dice/)).toBeNull()
  })

  it('at 2 dice, no Skill says it needs more', () => {
    renderBoard(game(2))
    expect(screen.queryByText(/Needs \d dice/)).toBeNull()
  })
})

describe('SkillBoard: enemies in range against the engaged ones', () => {
  /** Strike's engagement with 1 engaged enemy on the player's hex, plus `extra` that did not roll. */
  function engagedWith(extra: number): GameState {
    const s = strikeFiredOnce()
    const hex = s.players[s.current]!.hex
    const base = s.enemies[0]!
    const foes = ['foe', ...Array.from({ length: extra }, (_, i) => `bystander-${i}`)]
    return {
      ...s,
      enemies: foes.map((id) => ({ ...base, id, hex })),
      exchange: { ...s.exchange!, engage: { enemyDice: [{ enemy: 'foe', face: 'hit' }] } },
    } as GameState
  }
  const renderBoard = (state: GameState) =>
    render(
      <SkillBoard
        state={state}
        legal={legalActions(state)}
        act={() => {}}
        actAll={() => {}}
        selected={[]}
      />,
    )

  it('enemies in range that did not roll: the line says how many of them are engaged', () => {
    renderBoard(engagedWith(2))
    expect(strikeTile().textContent).toContain('3 enemies in range, 1 of them engaged')
    expect(strikeTile().textContent).toContain('3 in range, 1 engaged')
  })

  it('every enemy in range is engaged: the line gives the count alone', () => {
    renderBoard(engagedWith(0))
    expect(strikeTile().textContent).toContain('1 enemy in range')
    expect(strikeTile().textContent).not.toMatch(/engaged/)
  })
})
