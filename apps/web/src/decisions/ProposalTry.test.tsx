import { defaultProposals, type Proposal } from '@survival/content'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyProposalToStore, browserStorage, CONFIG_KEY } from '../config/configStore.ts'
import { ProposalTry } from './ProposalTry.tsx'

const forcedReveal = defaultProposals.find((p) => p.id === 'forced-reveal') as Proposal

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe('ProposalTry', () => {
  it('offers the Try button while this browser plays the standard rules', () => {
    const { container } = render(<ProposalTry proposal={forcedReveal} />)
    expect(container.querySelector('button')?.textContent).toBe('Try this on the Play page')
    expect(container.textContent).toContain('Saved in this browser only; no default changes.')
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })

  it('says the config already plays the proposal, with Play and Config links, instead of the button', () => {
    expect(applyProposalToStore(browserStorage(), forcedReveal)).toEqual([])
    const { container } = render(<ProposalTry proposal={forcedReveal} />)
    expect(container.querySelector('button')).toBeNull()
    expect(container.textContent).toContain('Your config plays with this proposal now.')
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(links).toEqual(['/play', '/config'])
  })

  it('has no button for a proposal that is not measured under the Combat model in play', () => {
    const unmeasured: Proposal = { ...forcedReveal, measured: undefined }
    const { container } = render(<ProposalTry proposal={unmeasured} />)
    expect(container.querySelector('button')).toBeNull()
    expect(container.textContent).toContain('Not measured with Engagements Combat')
  })

  it('says why and stays on the page when this browser does not allow saving', () => {
    const assign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, assign })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const { container, getByRole } = render(<ProposalTry proposal={forcedReveal} />)
    fireEvent.click(getByRole('button', { name: 'Try this on the Play page' }))
    expect(getByRole('alert').textContent).toBe('Not saved: This browser does not allow saving.')
    expect(assign).not.toHaveBeenCalled()
    expect(window.localStorage.getItem(CONFIG_KEY)).toBeNull()
    expect(container.querySelector('button')).not.toBeNull()
  })

  it('saves the proposal and opens the Play page when the save succeeds', () => {
    const assign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, assign })
    const { getByRole, queryByRole } = render(<ProposalTry proposal={forcedReveal} />)
    fireEvent.click(getByRole('button', { name: 'Try this on the Play page' }))
    expect(assign).toHaveBeenCalledWith('/play')
    expect(queryByRole('alert')).toBeNull()
    expect(window.localStorage.getItem(CONFIG_KEY)).not.toBeNull()
  })
})
