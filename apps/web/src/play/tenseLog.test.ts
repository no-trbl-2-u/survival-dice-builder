import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const card = defaultContent.cards[0]!
const skill = defaultContent.skills[0]!
const upgrade = defaultContent.upgrades[0]!

/** One event of every kind a player does, as the log gets it. */
const actions = [
  { type: 'cardsDrawn', rule: '6.2', player: 'p1', cards: ['c1', 'c2'] },
  { type: 'cardPlayed', rule: '6.3', player: 'p1', card: card.id, half: 'top' },
  { type: 'cardDiscarded', rule: '6.9', player: 'p1', card: card.id },
  { type: 'healed', rule: '6.4', player: 'p1', amount: 1, health: 5 },
  { type: 'guardGained', rule: '6.4', player: 'p1', amount: 1, guard: 1 },
  { type: 'moved', rule: '6.5', player: 'p1', to: { q: 1, r: 0 }, cost: 1, hexesLeft: 2 },
  { type: 'gathered', rule: '6.7', player: 'p1', amount: 2, materials: 2 },
  { type: 'defenseBuilt', rule: '6.6', player: 'p1', kind: 'tower', hex: { q: 1, r: 0 }, cost: 3 },
  { type: 'currencyGained', rule: '8.2', player: 'p1', amount: 3, currency: 3 },
  {
    type: 'upgradeBought',
    rule: '11.4',
    player: 'p1',
    upgrade: upgrade.id,
    cost: 2,
    baseHealth: 12,
  },
  { type: 'cardBought', rule: '13.1', player: 'p1', card: card.id, cost: 3 },
  { type: 'skillDrafted', rule: '12.2', player: 'p1', skill: skill.id },
  { type: 'experienceGained', rule: '8.1', amount: 2, experience: 5 },
]

const lines = (players: number) =>
  actions.map((event) =>
    describeEvent(
      event as never,
      {
        content: defaultContent,
        players: Array.from({ length: players }, (_, i) => ({
          id: `p${i + 1}`,
          hand: [],
          deck: [],
          discard: [],
          inPlay: [],
        })),
      } as never,
    ),
  )

describe('player actions in the log', () => {
  it('are in the present tense, as the enemy lines are', () => {
    expect(lines(1).map((line) => line.split(' ').slice(0, 2).join(' '))).toEqual([
      'You draw',
      'You play',
      'You discard',
      'You heal',
      'You gain',
      'You move',
      'You gather',
      'You build',
      'You gain',
      'You buy',
      'You buy',
      'You draft',
      'You gain',
    ])
  })

  it('agree with a named player in co-op', () => {
    expect(lines(2).map((line) => line.split(' ').slice(0, 3).join(' '))).toEqual([
      'Player 1 draws',
      'Player 1 plays',
      'Player 1 discards',
      'Player 1 heals',
      'Player 1 gains',
      'Player 1 moves',
      'Player 1 gathers',
      'Player 1 builds',
      'Player 1 gains',
      'Player 1 buys',
      'Player 1 buys',
      'Player 1 drafts',
      'All players gain',
    ])
  })
})
