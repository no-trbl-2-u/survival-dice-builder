import { defaultProposals, measuredText } from '@survival/content'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ProposalList } from './ProposalList.tsx'

afterEach(cleanup)

describe('ProposalList', () => {
  it('shows each measured result as text and names it as the Apply button description', () => {
    render(<ProposalList draft={{}} onApply={() => undefined} />)
    const shown = defaultProposals.filter((p) => p.measured)
    expect(shown.length).toBeGreaterThan(0)
    for (const p of shown) {
      const button = screen.getByRole('button', { name: `Apply ${p.label}` })
      expect(button.getAttribute('title')).toBeNull()
      const id = button.getAttribute('aria-describedby')
      expect(id).toBeTruthy()
      const line = document.getElementById(id ?? '')
      expect(line?.textContent).toBe(measuredText(p))
    }
  })
})
