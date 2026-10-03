import type { ReactNode } from 'react'

/**
 * Renders the inline markdown the plan files use: **bold** and `code`. Everything else is text.
 *
 * @param text - one cell or line of markdown.
 */
export function Inline({ text }: Readonly<{ text: string }>) {
  const parts: ReactNode[] = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return <code key={i}>{part.slice(1, -1)}</code>
    return part
  })
  return <>{parts}</>
}
