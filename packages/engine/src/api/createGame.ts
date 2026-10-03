import { defaultContent, type Content, type GameConfig } from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import { BASE_HEX, EMPTY_MAP, placeTile } from '../map/tiles.ts'
import { advance } from '../phases/advance.ts'
import { buildSupplies } from '../progression/supplies.ts'
import { seedRng, shuffle } from '../rng/rng.ts'
import { withLog } from '../state/helpers.ts'
import type { CardInstance, GameState, Player } from '../state/types.ts'

/**
 * Creates a new run. Same config + seed (+ content) = same run.
 *
 * Setup: the Base tile goes in the center (4.1); the countryside tiles are shuffled, 1 waits
 * for the player to choose its slot next to the base (4.2 [006]; the first decision), and the
 * others go on top of the shuffled core tiles to make the tile deck (4.3 [006]). The figure
 * starts on the base (4.6).
 *
 * @param config - the game configuration (rule numbers and options).
 * @param seed - any integer; it seeds the engine RNG.
 * @param content - cards, Skills, enemies, defenses, and tiles; defaults to the default content.
 * @returns the state at the first decision (`setup`: choose the setup tile's slot).
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

  // 4.1-4.3 [006]: base in the center; setup countryside tile(s); tile deck.
  const baseTile = content.tiles.find((t) => t.kind === 'base')
  if (!baseTile) throw new Error('Content has no base tile')
  const [countryside, afterCountry] = shuffle(
    rng,
    content.tiles.filter((t) => t.kind === 'countryside').map((t) => t.id),
  )
  const [core, afterCore] = shuffle(
    afterCountry,
    content.tiles.filter((t) => t.kind === 'core').map((t) => t.id),
  )
  rng = afterCore
  const setupCount = config.tiles.setupCountryside
  const setupTiles = countryside.slice(0, setupCount)
  const tileDeck = [...countryside.slice(setupCount), ...core]

  // 4.12: shuffle each card supply and Skill supply.
  const [supplies, afterSupplies] = buildSupplies(content, config, rng)
  rng = afterSupplies

  const player: Player = {
    id: 'p1',
    hex: BASE_HEX,
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

  const state: GameState = {
    version: 1,
    seed,
    config,
    content: {
      cards: content.cards,
      skills: content.skills,
      enemies: content.enemies,
      defenses: content.defenses,
      tiles: content.tiles,
      upgrades: content.upgrades,
    },
    rng,
    round: 1,
    phase: setupTiles.length > 0 ? 'setup' : 'prepare',
    players: [player],
    current: 0,
    map: placeTile(EMPTY_MAP, baseTile, BASE_HEX),
    tileDeck,
    revealed: setupTiles,
    enemies: [],
    nextEnemyId: 1,
    defenses: [],
    nextDefenseId: 1,
    active: null,
    base: { health: config.base.startingHealth, maxHealth: config.base.startingHealth },
    waveTrack: config.waveTrackStart,
    vacantNodes: [],
    revealOffer: false,
    exchange: null,
    experience: 0,
    level: 1,
    upgrades: [],
    supplies,
    shopOffers: [],
    nextCardId: cards.length + 1,
    pendingReturn: null,
    draft: null,
    lastDraftRound: 0,
    progress: { elitesDefeated: 0, firedSkills: [], tilesRevealed: 0, cardsBought: 0 },
    milestones: [],
    log: [],
    endedBecause: null,
  }

  const setupEvents: GameEvent[] = [
    { type: 'gameCreated', rule: '4', seed },
    { type: 'tilePlaced', rule: '4.1', tile: baseTile.id, center: BASE_HEX },
    { type: 'deckShuffled', rule: '4.8', player: player.id, cards: deck.length },
  ]
  const [ready, events] = advance(state)
  return withLog(ready, [...setupEvents, ...events])
}
