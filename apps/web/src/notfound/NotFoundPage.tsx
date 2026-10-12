import { useClient } from '../useClient.ts'

/**
 * Any unknown path: names the path that matched no page and links to the two ways in. The
 * served `404.html` is built before anyone asks for a path, so it names the path only once the
 * page runs in the browser.
 */
export function NotFoundPage({ path }: Readonly<{ path: string }>) {
  const client = useClient()
  return (
    <div>
      <p>
        {client ? (
          <>
            There is no page at <code>{path}</code>.
          </>
        ) : (
          'There is no page at this address.'
        )}
      </p>
      <p>
        Go to <a href="/">the home page</a> or <a href="/play">start a run</a>.
      </p>
    </div>
  )
}
