import { applyProposal, defaultContent, defaultProposals } from '@survival/content'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ConfigChanges, shortValue } from './ConfigChanges.tsx'

const config = defaultContent.config

afterEach(cleanup)

describe('ConfigChanges', () => {
  it('says when the standard rules are in play', () => {
    render(<ConfigChanges config={config} changes={[]} />)
    expect(screen.getByText('Playing with the standard rules.')).toBeTruthy()
  })

  it('lists each changed field by label and value, with a review link', () => {
    const changed = { ...config, miniatureLimit: 12 }
    render(<ConfigChanges config={changed} changes={['miniatureLimit']} reviewHref="/config" />)
    expect(screen.getByTestId('config-changes').textContent).toMatch(
      /Playing with 1 change from the standard rules/,
    )
    expect(screen.getByRole('listitem').textContent).toMatch(/: 12$/)
    expect(screen.getByRole('link', { name: 'review or reset' }).getAttribute('href')).toBe(
      '/config',
    )
  })

  it('names the proposals the config carries, linked to their rows (phase 39)', () => {
    const [reveal, ramp] = defaultProposals
    if (!reveal || !ramp) throw new Error('no proposals')
    const both = applyProposal(applyProposal(config, reveal), ramp)
    render(<ConfigChanges config={both} changes={['clock.forcedRevealEvery', 'spawn.rampEvery']} />)
    const line = screen.getByTestId('config-proposals')
    expect(line.textContent).toBe(`Playing with proposals: ${reveal.label}, ${ramp.label}.`)
    expect(screen.getByRole('link', { name: reveal.label }).getAttribute('href')).toBe(
      `/decisions#q-${reveal.row}`,
    )
    cleanup()
    render(<ConfigChanges config={config} changes={[]} />)
    expect(screen.queryByTestId('config-proposals')).toBeNull()
  })

  it('names the fields that took a new default after a rule change', () => {
    render(<ConfigChanges config={config} changes={[]} updated={['combat.model']} />)
    expect(screen.getByRole('status').textContent).toMatch(
      /The rules changed since this config was saved/,
    )
  })

  it('shortValue shows numbers, words, and on/off', () => {
    expect([
      shortValue(3),
      shortValue('pool'),
      shortValue(true),
      shortValue(null),
      shortValue([1]),
    ]).toEqual(['3', 'pool', 'on', 'off', 'changed'])
    expect(shortValue('pool', { pool: 'Your pool' })).toBe('Your pool')
  })

  it('gives a changed choice field its option phrase, not the stored key (audit pass 324)', () => {
    const changed = {
      ...config,
      calendar: { ...config.calendar, system: 'threat-dice' as const },
      rulings: { ...config.rulings, shopTiming: 'prepare-only' as const },
    }
    render(<ConfigChanges config={changed} changes={['calendar.system', 'rulings.shopTiming']} />)
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual([
      'Event Calendar: Threat dice (experiment)',
      'Shop timing: Only in the Prepare phase',
    ])
  })
})
