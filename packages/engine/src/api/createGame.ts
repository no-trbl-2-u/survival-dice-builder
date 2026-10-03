import { defaultContent, type Content, type GameConfig } from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import { advance } from '../phases/advance.ts'
import { seedRng, shuffle } from '../rng/rng.ts'
import { withLog } from '../state/helpers.ts'
import type { CardInstance, Enemy, GameState, Player } from '../state/types.ts'

/**
 * Creates a new run. Same config + seed (+ content) = same run.
 *
 * Phase 5 scope: 1 player and an abstract enemy list (no map). The setup countryside tile is
 * drawn from the shuffled countryside tiles (4.2) and 1 grunt is put on each of its spawn
 * nodes (4.4); the tile itself is placed on the map in phase 6.
 *
 * @param config - the game configuration (rule numbers and options).
 * @param seed - any integer; it seeds the engine RNG.
 * @param content - cards, Skills, enemies, and tiles; defaults to the validated default content.
 * @returns the state at the first decision (Prepare, round 1, first hand drawn).
 * @rule 4.1-4.13
 */
export function createGame(
  config: GameConfig,
  seed: number,
  content: Content = defaultContent,
): GameState {
  let rng = seedRng(seed)
  const preset = config.deck.presets.find((p) => p.id === config.deck.preset)
  if (!preset) throw new Error(`Unknown deck preset "${config.deck.preset}"`)

  // 4.8: the starter deck, shuffled, top half up. Instance ids are stable: c1, c2, ...
  const cards: CardInstance[] = preset.cards
    .flatMap((entry) => Array.from({ length: entry.quantity }, () => entry.card))
    .map((def, i) => ({ id: `c${i + 1}`, def }))
  const [deck, afterDeck] = shuffle(rng, cards)
  rng = afterDeck

  const player: Player = {
    id: 'p1',
    health: config.player.maxHealth,
    maxHealth: config.player.maxHealth,
    dice: config.player.startingDice,
    skills: [...config.player.starterSkills],
    deck,
    hand: [],
    discard: [],
    inPlay: [],
    orientation: 'top',
    guard: 0,
    materials: 0,
    currency: 0,
  }

  // 4.2-4.4: draw the setup countryside tile(s) and put 1 grunt on each spawn node.
  const [countryside, afterTiles] = shuffle(
    rng,
    content.tiles.filter((t) => t.kind === 'countryside'),
  )
  rng = afterTiles
  const setupTiles = countryside.slice(0, config.tiles.setupCountryside)
  const spawnNodes = setupTiles
    .flatMap((t) => t.hexes)
    .filter((h) => h.site === 'spawn-node').length
  const grunt = content.enemies.enemies.find((e) => e.id === 'grunt')
  const enemies: Enemy[] = grunt
    ? Array.from({ length: spawnNodes }, (_, i) => ({
        id: `e${i + 1}`,
        kind: grunt.id,
        health: grunt.health,
      }))
    : []

  const state: GameState = {
    version: 1,
    seed,
    config,
    content: {
      cards: content.cards,
      skills: content.skills,
      enemies: content.enemies,
      tiles: content.tiles,
    },
    rng,
    round: 1,
    phase: 'prepare',
    players: [player],
    current: 0,
    enemies,
    nextEnemyId: enemies.length + 1,
    base: { health: config.base.startingHealth, maxHealth: config.base.startingHealth },
    exchange: null,
    log: [],
    endedBecause: null,
  }

  const setupEvents: GameEvent[] = [
    { type: 'gameCreated', rule: '4', seed },
    { type: 'deckShuffled', rule: '4.8', player: player.id, cards: deck.length },
    { type: 'phaseStarted', rule: '5.1', phase: 'prepare', round: 1 },
  ]
  const [ready, events] = advance(state)
  return withLog(ready, [...setupEvents, ...events])
}
