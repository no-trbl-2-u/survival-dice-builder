import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { issuesUrl } from '../decisions/Inline.tsx'
import { SEED_ERROR } from '../play/seed.ts'
import { DebugPage } from './DebugPage.tsx'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

const seedField = () => screen.getByRole('textbox', { name: 'Seed' })
const newRun = () => screen.getByRole('button', { name: 'New run' })

describe('/debug intro', () => {
  it('says where to file the bug report a copied replay goes into', () => {
    render(<DebugPage />)
    const link = screen.getByRole('link', { name: 'open an issue' })
    expect(link.getAttribute('href')).toBe(issuesUrl)
    expect(link.parentElement?.textContent).toContain(
      'to paste into a bug report: open an issue (on GitHub).',
    )
  })
})

describe('/debug seed field', () => {
  it('starts on seed 1 with New run enabled and no hint', () => {
    render(<DebugPage />)
    expect(seedField()).toHaveProperty('value', '1')
    expect(newRun()).toHaveProperty('disabled', false)
    expect(screen.queryByText(SEED_ERROR)).toBeNull()
  })

  it('shows the hint quietly and disables New run while the field is blank', () => {
    render(<DebugPage />)
    fireEvent.change(seedField(), { target: { value: '  ' } })
    expect(newRun()).toHaveProperty('disabled', true)
    const hint = screen.getByText(SEED_ERROR)
    expect(hint.getAttribute('role')).toBeNull()
    expect(seedField().getAttribute('aria-invalid')).toBe('false')
    expect(seedField().getAttribute('aria-describedby')).toBe(hint.id)
  })

  it('announces the hint as an alert and marks the field invalid for text that is not a number', () => {
    render(<DebugPage />)
    fireEvent.change(seedField(), { target: { value: '12a' } })
    expect(newRun()).toHaveProperty('disabled', true)
    expect(screen.getByRole('alert').textContent).toBe(SEED_ERROR)
    expect(seedField().getAttribute('aria-invalid')).toBe('true')
  })

  it('starts a new run on a valid seed: the action count goes back to 0', () => {
    render(<DebugPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Bot step' }))
    expect(screen.getByText('1 action', { exact: true })).toBeTruthy()
    fireEvent.change(seedField(), { target: { value: ' 7 ' } })
    expect(seedField().getAttribute('aria-describedby')).toBeNull()
    fireEvent.click(newRun())
    expect(screen.getByText('0 actions', { exact: true })).toBeTruthy()
    expect(screen.getByTestId('step-status').textContent).toBe('')
  })
})

describe('/debug Copy replay', () => {
  it('says "Copy failed" when the clipboard refuses, until the next step', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    render(<DebugPage />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy replay' }))
    })
    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Bot step' }))
    expect(screen.getByRole('button', { name: 'Copy replay' })).toBeTruthy()
  })

  it('copies the seed and the actions taken as JSON', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<DebugPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Bot step' }))
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy replay' }))
    })
    const replay = JSON.parse(writeText.mock.calls[0]![0] as string) as {
      seed: number
      actions: unknown[]
    }
    expect(replay.seed).toBe(1)
    expect(replay.actions).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Replay copied' })).toBeTruthy()
  })
})
