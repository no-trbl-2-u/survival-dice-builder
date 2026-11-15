import { act, cleanup, render } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import { useClient } from './useClient.ts'

afterEach(cleanup)

function Probe({ seen }: Readonly<{ seen: boolean[] }>) {
  const client = useClient()
  seen.push(client)
  return <p>{client ? 'client' : 'build'}</p>
}

describe('useClient', () => {
  it('is false on the build render', () => {
    const seen: boolean[] = []
    expect(renderToString(<Probe seen={seen} />)).toBe('<p>build</p>')
    expect(seen).toEqual([false])
  })

  it('is true from the start on a page rendered fresh', () => {
    const seen: boolean[] = []
    const { container } = render(<Probe seen={seen} />)
    expect(container.textContent).toBe('client')
    expect(seen).toEqual([true])
  })

  it('hydrates as false, matching the served HTML, then turns true', async () => {
    const container = document.createElement('div')
    container.innerHTML = renderToString(<Probe seen={[]} />)
    document.body.appendChild(container)
    const errors: unknown[] = []
    const seen: boolean[] = []
    const root = await act(() =>
      hydrateRoot(container, <Probe seen={seen} />, {
        onRecoverableError: (error) => errors.push(error),
      }),
    )
    expect(seen[0]).toBe(false)
    expect(seen.at(-1)).toBe(true)
    expect(container.textContent).toBe('client')
    expect(errors).toEqual([])
    act(() => root.unmount())
    container.remove()
  })
})
