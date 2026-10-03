/**
 * The engine's seeded random number generator (mulberry32). Its state is one uint32 stored in
 * `GameState.rng`; every function returns the next state, so a run replays exactly from
 * `seed + actions[]`.
 */

/** Normalises any integer seed to a uint32 RNG state. */
export function seedRng(seed: number): number {
  return seed >>> 0
}

/**
 * Returns a float in [0, 1) and the next RNG state.
 *
 * @param rng - the current RNG state.
 */
export function nextFloat(rng: number): readonly [number, number] {
  const next = (rng + 0x6d2b79f5) >>> 0
  let t = next
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next]
}

/**
 * Returns an integer in [0, n) and the next RNG state.
 *
 * @param rng - the current RNG state.
 * @param n - the exclusive upper bound (1 or more).
 */
export function nextInt(rng: number, n: number): readonly [number, number] {
  const [f, next] = nextFloat(rng)
  return [Math.floor(f * n), next]
}

/**
 * Returns a shuffled copy of a list (Fisher-Yates) and the next RNG state. The input is not
 * changed.
 *
 * @rule 4.2, 4.8, 4.12, 7.1
 * @param rng - the current RNG state.
 * @param items - the list to shuffle.
 */
export function shuffle<T>(rng: number, items: readonly T[]): readonly [T[], number] {
  const out = [...items]
  let state = rng
  for (let i = out.length - 1; i > 0; i--) {
    const [j, next] = nextInt(state, i + 1)
    state = next
    const tmp = out[i] as T
    out[i] = out[j] as T
    out[j] = tmp
  }
  return [out, state]
}
