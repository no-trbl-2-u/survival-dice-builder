import { defaultContent } from '@survival/content'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { bottomText, CardView, topText } from './CardView.tsx'

const card = (id: string) => defaultContent.cards.find((c) => c.id === id)!

describe('CardView', () => {
  it('shows both halves with their bands and names the active half', () => {
    render(<CardView def={card('sprint')} up="bottom" />)
    expect(screen.getByText('Top · Prepare')).toBeTruthy()
    expect(screen.getByText('Bottom · Combat')).toBeTruthy()
    expect(screen.getByText(/Active half: Combat, Reroll 2 dice/)).toBeTruthy()
  })

  it('writes effects in plain text', () => {
    expect(topText(card('blink').top)).toBe('Move 5, no extra cost next to enemies')
    expect(topText(card('architect').top)).toBe('Build 2 times')
    expect(topText({ kind: 'gather', amount: 2 })).toBe(
      'Gather 2 on an unspent gathering node (the node is spent)',
    )
    expect(bottomText({ kind: 'reroll', dice: 'all' })).toBe('Reroll all dice')
    expect(bottomText({ kind: 'reroll', dice: 1 })).toBe('Reroll 1 die')
  })
})
