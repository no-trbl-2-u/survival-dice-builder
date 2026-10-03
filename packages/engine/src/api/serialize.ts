import type { GameState } from '../state/types.ts'

/** Recursively sorts object keys so equal states serialize to equal strings. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    )
  }
  return value
}

/**
 * Serializes a run for save, load, bug reports, and golden tests. Keys are sorted, so the same
 * state always gives the same text (and the same hash).
 */
export function serialize(state: GameState): string {
  return JSON.stringify(sortKeys(state))
}

/**
 * Restores a run from `serialize` output.
 *
 * @throws Error when the text is not a version 1 game state.
 */
export function deserialize(text: string): GameState {
  const parsed: unknown = JSON.parse(text)
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    (parsed as { version?: unknown }).version !== 1 ||
    !Array.isArray((parsed as { players?: unknown }).players)
  ) {
    throw new Error('deserialize: not a version 1 Survival Dice-Builder game state')
  }
  return parsed as GameState
}
