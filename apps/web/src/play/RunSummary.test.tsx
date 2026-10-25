import { defaultContent } from '@survival/content'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { newRun } from './run.ts'
import { RunSummary } from './RunSummary.tsx'

afterEach(cleanup)

describe('run summary base health chart', () => {
  it('each bar says its round and base health in words to screen readers', () => {
    const run = newRun(defaultContent.config, 1)
    render(<RunSummary run={run} baseCurve={[10, 7]} onNewRun={() => {}} />)
    const items = within(screen.getByRole('list', { name: 'Base health by round' })).getAllByRole(
      'listitem',
    )
    expect(items).toHaveLength(2)
    expect(items[1]?.querySelector('small')?.getAttribute('aria-hidden')).toBe('true')
    expect(items[1]?.querySelector('small')?.textContent).toBe('2: 7')
    expect(items[1]?.querySelector('.visually-hidden')?.textContent).toBe('Round 2: base health 7')
  })
})
