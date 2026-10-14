import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { defaultContent } from '@survival/content'
import { StartPanel } from './StartPanel.tsx'

const panel = () =>
  render(
    <StartPanel
      config={defaultContent.config}
      changes={[]}
      updated={[]}
      store={undefined}
      combat="engage"
      onStart={() => {}}
      onLoad={() => {}}
    />,
  )

describe('StartPanel', () => {
  it('calls Exchanges the older Combat, not the written rules (Spec v2 6.10)', () => {
    panel()
    const hint = () => document.getElementById('combat-hint')?.textContent ?? ''
    // The select is labelled Combat, so the hint starts with the rule, not a second "Combat:".
    expect(hint()).toMatch(/^Engagements: /)
    fireEvent.change(screen.getByLabelText(/Combat/), { target: { value: 'exchange' } })
    expect(hint()).toMatch(/^The older Combat, kept for playtests\./)
    expect(hint()).not.toMatch(/written rules/)
  })
})
