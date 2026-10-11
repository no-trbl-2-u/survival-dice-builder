import { defaultContent } from '@survival/content'
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
  })
})
