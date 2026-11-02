/** What the Seed field says while its text is not a whole number. */
export const SEED_ERROR = 'Type a whole number.'

/**
 * Reads the Seed field: a whole number (digits only, spaces around it allowed) gives the
 * seed; any other text gives null, so the page does not start a run on a seed the player
 * did not type.
 */
export function parseSeed(text: string): number | null {
  const trimmed = text.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const seed = Number(trimmed)
  return Number.isSafeInteger(seed) ? seed : null
}

/**
 * True while the Seed field holds no text (or only spaces): the player has cleared it to
 * type a new seed. The page keeps Start disabled and shows the hint quietly, not as an
 * alert, so clearing the field does not announce an error.
 */
export function isSeedBlank(text: string): boolean {
  return text.trim() === ''
}
