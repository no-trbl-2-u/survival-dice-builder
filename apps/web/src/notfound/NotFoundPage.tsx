/** Any unknown path: names the path that matched no page and links to the two ways in. */
export function NotFoundPage({ path }: Readonly<{ path: string }>) {
  return (
    <div>
      <p>
        There is no page at <code>{path}</code>.
      </p>
      <p>
        Go to <a href="/">the home page</a> or <a href="/play">start a run</a>.
      </p>
    </div>
  )
}
