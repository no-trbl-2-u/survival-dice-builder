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
