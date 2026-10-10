import type { GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import {
  asideNote,
  cancelledLine,
  engageHeadline,
  engageStage,
  lastEngagement,
} from './engageView.ts'

const r = 'Combat v3'

describe('engageView', () => {
  it('says what comes next while the modal steps aside', () => {
    expect(asideNote(true)).toBe('Engagement over. The result comes next.')
    expect(asideNote(false)).toBe('Back to the engagement in a moment.')
  })

  it('maps each exchange step to its stage', () => {
    expect(engageStage('roll')).toBe(0)
    expect(engageStage('cards')).toBe(1)
    expect(engageStage('reroll')).toBe(1)
    expect(engageStage('assign')).toBe(1)
    expect(engageStage('resolve')).toBe(2)
    expect(engageStage('targets')).toBe(2)
  })

  it('sums the latest engagement only, up to its end, and sees a knock-out', () => {
    const log: GameEvent[] = [
      { type: 'engaged', rule: r, player: 'p1', card: 'c1', enemyDice: [] },
      { type: 'enemyDamaged', rule: r, enemy: 'e1', amount: 9, health: 0 },
      { type: 'exchangeEnded', rule: r, player: 'p1' },
      {
        type: 'engaged',
        rule: r,
        player: 'p1',
        card: 'c2',
        enemyDice: [
          { enemy: 'e2', face: 'hit' },
          { enemy: 'e2', face: 'special' },
        ],
      },
      { type: 'skillFired', rule: r, player: 'p1', skill: 'strike' },
      { type: 'enemyDamaged', rule: r, enemy: 'e2', amount: 2, health: 1 },
      { type: 'enemyAttacked', rule: r, enemy: 'e2', player: 'p1', damage: 1 },
      { type: 'playerDamaged', rule: r, player: 'p1', toGuard: 1, toHealth: 0, health: 5 },
      { type: 'hitIgnored', rule: r, enemy: 'e2', player: 'p1' },
      { type: 'exchangeEnded', rule: r, player: 'p1' },
      { type: 'playerKnockedOut', rule: r, player: 'p1', materialsLost: 0 },
      { type: 'enemyDamaged', rule: r, enemy: 'e3', amount: 5, health: 0 },
    ]
    const s = lastEngagement(log)
    expect(s).toMatchObject({
      dealt: 2,
      hitsTaken: 1,
      toGuard: 1,
      toHealth: 0,
      ignored: 1,
      fired: ['strike'],
      knockedOut: true,
    })
    expect(s?.enemyDice).toHaveLength(2)
    expect(engageHeadline(s!)).toBe('You were knocked out.')
    expect(engageHeadline({ ...s!, knockedOut: false, defeated: 1 })).toBe(
      'You defeated 1 enemy and your guard stopped 1 damage.',
    )
    expect(engageHeadline({ ...s!, knockedOut: false, defeated: 1, toGuard: 0 })).toBe(
      'You defeated 1 enemy and took no damage.',
    )
    expect(engageHeadline({ ...s!, knockedOut: false, toHealth: 2, toGuard: 1 })).toBe(
      'You dealt 2 damage and took 2 damage.',
    )
  })

  it('counts cancelled enemy dice and names them only when there are some', () => {
    const log: GameEvent[] = [
      { type: 'engaged', rule: r, player: 'p1', card: 'c1', enemyDice: [] },
      { type: 'enemyDieCancelled', rule: r, enemy: 'e1', player: 'p1' },
      { type: 'enemyDieCancelled', rule: r, enemy: 'e1', player: 'p1' },
      { type: 'exchangeEnded', rule: r, player: 'p1' },
    ]
    const s = lastEngagement(log)!
    expect(s.cancelled).toBe(2)
    expect(cancelledLine(s)).toBe('2 dice of defeated enemies did not hit.')
    expect(cancelledLine({ ...s, cancelled: 1 })).toBe('1 die of defeated enemies did not hit.')
    expect(cancelledLine({ ...s, cancelled: 0 })).toBeNull()
  })

  it('is null with no engagement', () => {
    expect(lastEngagement([])).toBeNull()
  })
})
