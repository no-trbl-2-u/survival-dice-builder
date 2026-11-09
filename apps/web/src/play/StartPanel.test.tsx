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

  it('says how far enemies move at each Combat, from the saved config, under both choices (7.5, critique pass 43)', () => {
    const base = defaultContent.config
    const { container } = panel({ ...base, combat: { ...base.combat, enemyMoveHexes: 1 } })
    const hint = () => container.querySelector('#combat-hint')?.textContent ?? ''
    const move =
      'At each Combat, before the spawn nodes spawn, each enemy, oldest first, moves up to 1 hex toward its target and stops next to it.'
    expect(hint()).toContain(move)
    fireEvent.change(within(container).getByLabelText(/Combat/), { target: { value: 'exchange' } })
    expect(hint()).toContain(move)
  })

  it('says how a round turns over before a run, so Prepare has an end too (5.1, critique pass 43)', () => {
    const base = defaultContent.config
    const intro = (config: GameConfig) =>
      panel(config).container.querySelector('p')?.textContent ?? ''
    expect(intro(base)).toContain(
      'Each round is Prepare, then Combat, and each phase goes once through your deck.',
    )
    const solo = intro({ ...base, players: { min: 1, max: 1 } })
    expect(solo).toContain('each phase goes once through your deck.')
    expect(solo).not.toMatch(/share one screen/)
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

  it('asks before the reset clears the saved config, with the /config labels', () => {
    const view = within(
      render(
        <StartPanel
          config={defaultContent.config}
          changes={['players.max']}
          updated={[]}
          store={undefined}
          combat="engage"
          onStart={() => {}}
          onLoad={() => {}}
        />,
      ).container,
    )
    fireEvent.click(view.getByRole('button', { name: 'Reset to the standard rules' }))
    expect(view.getByRole('group', { name: 'Reset to the standard rules?' }).textContent).toContain(
      'Reset every value to the standard rules?',
    )
    expect(view.getByRole('button', { name: 'Yes, reset every value' })).toBeTruthy()
    fireEvent.click(view.getByRole('button', { name: 'Keep my values' }))
    expect(view.queryByRole('group', { name: 'Reset to the standard rules?' })).toBeNull()
    expect(view.getByRole('button', { name: 'Reset to the standard rules' })).toBeTruthy()
  })

  it('does not start a run while the seed is not a whole number', () => {
    const starts: number[] = []
    const view = within(
      render(
        <StartPanel
          config={defaultContent.config}
          changes={[]}
          updated={[]}
          store={undefined}
          combat="engage"
          onStart={(_players, seed) => starts.push(seed)}
          onLoad={() => {}}
        />,
      ).container,
    )
    const input = view.getByLabelText(/Seed/)
    const start = view.getByRole('button', { name: 'Start run' }) as HTMLButtonElement
    fireEvent.change(input, { target: { value: '' } })
    expect(start.disabled).toBe(true)
    expect(view.queryByRole('alert')).toBeNull()
    expect(view.getByText('Type a whole number.')).toBeTruthy()
    expect(input.getAttribute('aria-invalid')).toBe('false')
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(start.disabled).toBe(true)
    expect(view.getByRole('alert').textContent).toBe('Type a whole number.')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    fireEvent.submit(start.closest('form') as HTMLFormElement)
    expect(starts).toEqual([])
    fireEvent.change(input, { target: { value: '42' } })
    expect(start.disabled).toBe(false)
    expect(view.queryByRole('alert')).toBeNull()
    fireEvent.click(start)
    expect(starts).toEqual([42])
  })
})
