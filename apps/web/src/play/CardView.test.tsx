import { defaultContent } from '@survival/content'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  bottomText,
  cardLevelText,
  cardPriceText,
  CardView,
  optionText,
  topText,
} from './CardView.tsx'

const config = defaultContent.config
const card = (id: string) => defaultContent.cards.find((c) => c.id === id)!

describe('CardView', () => {
  it('shows both halves with their bands and names the active half', () => {
    render(<CardView def={card('sprint')} up="bottom" config={config} />)
    expect(screen.getByText('Top · Prepare')).toBeTruthy()
    expect(screen.getByText('Bottom · Combat')).toBeTruthy()
    expect(screen.getByText(/Active half: Combat, Reroll 2 dice/)).toBeTruthy()
  })

  it('names the price unit, currency, on a bought card (Table 8)', () => {
    const { container } = render(<CardView def={card('haul')} up="top" config={config} />)
    expect(container.textContent).toContain('Cost 3 currency')
    expect(cardPriceText(8)).toBe('Cost 8 currency')
  })

  it('prints a card level as a number, as /config does (critique pass 45)', () => {
    expect(cardLevelText(0)).toBe('Starter')
    expect(cardLevelText(2)).toBe('Level 2')
    const { container } = render(<CardView def={card('haul')} up="top" config={config} />)
    expect(container.textContent).toContain(`Level ${card('haul').level}`)
    expect(container.textContent).not.toMatch(/Level I/)
  })

  it('writes effects in plain text', () => {
    expect(topText(card('blink').top, config)).toBe('Move 5, no extra cost next to enemies')
    expect(topText(card('architect').top, config)).toBe('Build I 2 times')
    expect(topText({ kind: 'gather', amount: 2 }, config)).toBe(
      'Gather 2 on an unspent gathering node with no enemy on it (the node is spent)',
    )
    expect(bottomText({ kind: 'reroll', dice: 'all' })).toBe('Reroll all dice')
    expect(bottomText({ kind: 'reroll', dice: 1 })).toBe('Reroll 1 die')
  })
})

describe('optionText', () => {
  it('names what a Repair option gives: health (critique pass 45)', () => {
    expect(optionText({ kind: 'repair', amount: 2 })).toBe('Repair 2 health')
  })
})
