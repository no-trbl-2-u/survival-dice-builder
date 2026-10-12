import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False while a prerendered page is rendered at build time and hydrated, true after. A page
 * that reads this browser's storage renders the build's view (the defaults) until then, so the
 * first client render matches the served HTML; a page rendered fresh is true from the start.
 */
export function useClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
