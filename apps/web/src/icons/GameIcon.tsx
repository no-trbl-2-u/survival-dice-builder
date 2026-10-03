import { gameIcons, ICON_VIEWBOX } from './gameIcons.ts'

type Props = Readonly<{ name: string; className?: string | undefined; size?: string }>

/**
 * An inline icon for HTML (decorative: the text next to it carries the meaning). Colour comes
 * from `currentColor`.
 */
export function GameIcon({ name, className, size = '1.1em' }: Props) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      data-icon={name}
      // Trusted local markup from assets/icons (license-checked, see ASSETS.md).
      dangerouslySetInnerHTML={{ __html: gameIcons[name] ?? '' }}
    />
  )
}
