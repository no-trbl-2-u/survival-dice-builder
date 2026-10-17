import { use, type ComponentType } from 'react'

/** A page whose code is its own chunk: `load` fetches it once, `Page` renders it. */
export type LazyPage<P extends object> = Readonly<{
  load: () => Promise<ComponentType<P>>
  Page: ComponentType<P>
}>

/**
 * A page split out of the main script, so the home page does not carry the design tools.
 * The client calls `load` before its first render and the prerender before it renders, so
 * `Page` has its component at once and both render the same tree; a `Page` rendered before
 * `load` finishes suspends until it does.
 *
 * @param importPage - imports the page module and returns its component.
 */
export function lazyPage<P extends object>(
  importPage: () => Promise<ComponentType<P>>,
): LazyPage<P> {
  let loaded: ComponentType<P> | undefined
  let pending: Promise<ComponentType<P>> | undefined
  const load = () =>
    (pending ??= importPage().then((c) => {
      loaded = c
      return c
    }))
  function Page(props: P) {
    const Loaded = loaded ?? use(load())
    return <Loaded {...props} />
  }
  return { load, Page }
}
