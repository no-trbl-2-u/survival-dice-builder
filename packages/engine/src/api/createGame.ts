import { defaultContent, type Content, type GameConfig } from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import { BASE_HEX, EMPTY_MAP, placeTile } from '../map/tiles.ts'
import { advance } from '../phases/advance.ts'
import { buildSupplies } from '../progression/supplies.ts'
import { seedRng, shuffle } from '../rng/rng.ts'
import { withLog } from '../state/helpers.ts'
import type { CardInstance, GameState, Player } from '../state/types.ts'

/** Run options chosen at setup. @rule 16 */
export type GameSetup = Readonly<{ players: number }>

/**
 * Creates a new run. Same config + seed (+ content) = same run.
 *
 * Setup (core loop v2): the Base tile alone goes in the center (4.1); the shuffled countryside
 * tiles go on top of the shuffled core tiles to make the tile deck (4.3). Each player then puts
 * their figure on a free Base tile hex, in seat order (4.6, 3.8; the first decisions).
 *
 * @param config - the game configuration (rule numbers and options).
 * @param seed - any integer; it seeds the engine RNG.
 * @param content - cards, Skills, enemies, defenses, and tiles; defaults to the default content.
 * @param setup - the player count (`config.players.min`-`max`, default 1); seats p1, p2, ...
 * @returns the state at the first decision (`setup`: player 1 chooses a start hex).
 * @rule 4.1-4.13, 16.1, core loop v2 (setup)
 */
export function createGame(
  config: GameConfig,
  seed: number,
  content: Content = defaultContent,
  setup: GameSetup = { players: 1 },
): GameState {
  const count = setup.players
  if (!Number.isInteger(count) || count < config.players.min || count > config.players.max) {
    throw new Error(`Player count ${count} is outside ${config.players.min}-${config.players.max}`)
  }
  let rng = seedRng(seed)
  const preset = config.deck.presets.find((p) => p.id === config.deck.preset)
  if (!preset) throw new Error(`Unknown deck preset "${config.deck.preset}"`)

  // 4.8: the starter deck, shuffled, top half up. Instance ids are stable: c1, c2, ...
  const cards: CardInstance[] = preset.cards
    .flatMap((entry) => Array.from({ length: entry.quantity }, () => entry.card))
    .map((def, i) => ({ id: `c${i + 1}`, def }))
  const [deck, afterDeck] = shuffle(rng, cards)
  rng = afterDeck

  // 4.1, 4.3, core loop v2: the Base tile alone; countryside on top of core in the tile deck.
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
  const tileDeck = [...countryside, ...core]

  // 4.12: shuffle each card supply and Skill supply.
  const [supplies, afterSupplies] = buildSupplies(content, config, rng)
  rng = afterSupplies

  // 16.1: each other player gets an own shuffled starter deck (after the shared shuffles, so a
  // solo run's randomness is the same as before co-op existed). Instance ids stay unique.
  const decks: (readonly CardInstance[])[] = [deck]
  for (let i = 1; i < count; i++) {
    const own = cards.map((c, k) => ({ id: `c${i * cards.length + k + 1}`, def: c.def }))
    const [shuffled, next] = shuffle(rng, own)
    decks.push(shuffled)
    rng = next
  }

  const makePlayer = (i: number): Player => ({
    id: `p${i + 1}`,
    hex: BASE_HEX,
    health: config.player.maxHealth,
    maxHealth: config.player.maxHealth,
    dice: config.player.startingDice,
    skills: [...config.player.starterSkills],
    deck: decks[i] ?? [],
    hand: [],
    discard: [],
    inPlay: [],
    orientation: 'top',
    guard: 0,
    materials: 0,
    currency: 0,
  })
  const players = Array.from({ length: count }, (_, i) => makePlayer(i))

  const state: GameState = {
    version: 2,
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
    phase: 'setup',
    players,
    current: 0,
    map: placeTile(EMPTY_MAP, baseTile, BASE_HEX),
    tileDeck,
    unplaced: players.map((p) => p.id),
    spentNodes: [],
    enemies: [],
    nextEnemyId: 1,
    defenses: [],
    nextDefenseId: 1,
    active: null,
    base: { health: config.base.startingHealth, maxHealth: config.base.startingHealth },
    waveTrack: config.waveTrackStart,
    vacantNodes: [],
    exchange: null,
    experience: 0,
    level: 1,
    upgrades: [],
    supplies,
    shopOffers: [],
    nextCardId: cards.length * count + 1,
    pendingReturn: null,
    draft: null,
    draftedPlayers: [],
    turnFresh: true,
    roundEnding: false,
    progress: { elitesDefeated: 0, firedSkills: [], tilesRevealed: 0, cardsBought: 0 },
    milestones: [],
    log: [],
    endedBecause: null,
  }

  const setupEvents: GameEvent[] = [
    { type: 'gameCreated', rule: '4', seed },
    { type: 'tilePlaced', rule: '4.1', tile: baseTile.id, center: BASE_HEX },
    ...players.map((p): GameEvent => ({
      type: 'deckShuffled',
      rule: '4.8',
      player: p.id,
      cards: p.deck.length,
    })),
  ]
  const [ready, events] = advance(state)
  return withLog(ready, [...setupEvents, ...events])
}
