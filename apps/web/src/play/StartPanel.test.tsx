import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { defaultContent, type GameConfig } from '@survival/content'
import { StartPanel } from './StartPanel.tsx'

const panel = (config: GameConfig = defaultContent.config) =>
  render(
    <StartPanel
      config={config}
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

  it('reads its rule lines and player counts from the saved config, not the default (7.8, 9.7)', () => {
    const base = defaultContent.config
    const view = within(
      panel({
        ...base,
        players: { min: 2, max: 3 },
        knockout: { ...base.knockout, loseMaterials: true, loseCurrency: false },
      }).container,
    )
    const players = view.getByLabelText(/Players/) as HTMLSelectElement
    expect([...players.options].map((o) => o.textContent)).toEqual(['2', '3'])
    expect(players.value).toBe('2')
    const intro = view.getByTestId('start-panel').querySelector('p')?.textContent ?? ''
    expect(intro).toMatch(/They lose all their materials\./)
    expect(intro).not.toMatch(/currency/)
  })
})
