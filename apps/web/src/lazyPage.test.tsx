// @vitest-environment node
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { lazyPage } from './lazyPage.tsx'

function Hello({ name }: Readonly<{ name: string }>) {
  return <p>Hello {name}</p>
}

describe('lazyPage', () => {
  it('imports the page once, however often it is loaded', async () => {
    const importPage = vi.fn(() => Promise.resolve(Hello))
    const page = lazyPage(importPage)
    expect(importPage).not.toHaveBeenCalled()
    await Promise.all([page.load(), page.load()])
    await page.load()
    expect(importPage).toHaveBeenCalledTimes(1)
  })

  it('renders the page at once after load, with its props', async () => {
    const page = lazyPage(() => Promise.resolve(Hello))
    await page.load()
    expect(renderToString(<page.Page name="table" />)).toBe('<p>Hello <!-- -->table</p>')
  })
})
