# Build Brief — Survival Dice-Builder Prototype (Spec v1)

## Purpose

Build a playable web prototype of the game in Spec v1 so the designer can play runs, feel the pacing, and collect real timing data. Rules come from the "Spec v1 — Rules" tab. Where this brief and the rules disagree, the rules win.

- **Players:** 1–4 on one machine (solo first, then hot-seat co-op).
- **Platform:** web app first (desktop browser). Desktop packaging (Tauri) comes later and must not need engine changes.
- **Success:** a full solo run is playable start to finish with every Spec v1 rule enforced, a run summary is exported, and the designer can change the configuration options in rules section 18 without code changes.

## Non-goals for v1

- Networked multiplayer, accounts, cloud saves.
- AI teammates (an autoplay bot exists only for testing, Phase 7).
- Final art. Placeholder and open-license art only.
- Scenarios with win conditions (rules section 19).

## Reference implementation

The visual simulator on the spec page contains a working rules engine (`SIM.simulate`) for an earlier issue of the rules. Use it as a reference for pathing, dice keep logic, Skill assignment, and the time model. Do not port it as-is: it predates the central base, defenses, upgrades, and the wave track, and it mixes bot decisions with rules.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Language | TypeScript, `strict: true` | Shared types between engine and UI |
| Build | Vite | Fast dev server, simple static build |
| UI | React 18+ | Agent familiarity, component model |
| Map rendering | SVG first (2D hex map) | Matches the simulator; easy to inspect and test |
| Optional 3D | Dice only, in Phase 8 (see Phase A for libraries) | Keep the core 2D and testable |
| State | Engine state is plain immutable data; UI holds it in one store (useReducer or Zustand) | Replays, undo, save/load for free |
| Validation | Zod schemas for content and save files | Catch content errors at load time |
| Tests | Vitest + fast-check (property tests) | Unit, property, and golden-replay tests |
| Lint/format | ESLint + Prettier | Consistency across agents |

## Coding standards (designer preferences)

- **Functional core.** The engine is pure functions over plain data: no classes, no mutation of inputs, no I/O, no `Date`/`Math.random` inside the engine.
- **Explicit documentation.** Every exported type and function has a TSDoc comment that says what it does, its inputs, its outputs, and which rules section it implements (for example `@rule 7.8`). Non-obvious lines get inline comments.
- **Each module has a README** stating its purpose, its public API, and its tests.
- **Rules traceability.** Each rule in Spec v1 maps to at least one test. Keep a `RULES-COVERAGE.md` table: rule id → function → test.

## Architecture

```
/packages/content   JSON data + Zod schemas (cards, Skills, enemies, tiles, upgrades, defenses, config)
/packages/engine    Pure rules engine (no DOM). Depends on content types only.
/packages/bot       Autoplay bot for tests and batch runs (Phase 7). Depends on engine.
/apps/web           React app. Depends on engine + content.
/tools/sim          Node CLI: batch runs, tuning reports (Phase 7).
```

### Engine API (contract)

```ts
/** Creates a new run. Same config + seed = same run. @rule 4 */
createGame(config: GameConfig, seed: number): GameState

/** What the current decision-maker may do now. Empty when the engine is resolving automatic steps. */
legalActions(state: GameState): Action[]

/** Applies one player action, then resolves automatic steps until the next decision. Pure. */
applyAction(state: GameState, action: Action): { state: GameState; events: GameEvent[] }

/** Serialize / restore a run for save, load, bug reports, and golden tests. */
serialize(state: GameState): string
deserialize(text: string): GameState
```

- The engine pauses only at **decisions**: choose a card to play, choose a move path, choose dice to keep, roll again or stop, assign dice to Skills, choose a build target, choose an upgrade, buy or skip an offer, choose a draft Skill, choose a tile position.
- Everything else (spawns, enemy movement, Tower attacks, structure attacks, wave step, experience, level-ups) resolves automatically and appears as **events**.
- The RNG state lives inside `GameState` (seeded, for example mulberry32 or xoshiro), so every run replays exactly from `seed + actions[]`.
- Events are the only input the UI needs for animation. Each event has a `type`, a payload, and the rule id that produced it.

### Core data model (outline)

```ts
type Phase = "setup" | "prepare" | "combat" | "explore" | "ended";
type Face = "Sword" | "Wand" | "Bow" | "Shield" | "Star" | "Blank";
type Axial = { q: number; r: number };

interface GameState {
  config: GameConfig; rng: RngState; round: number; phase: Phase;
  map: { tiles: PlacedTile[]; hexes: Record<string, Hex> };   // key = "q,r"
  base: { hex: Axial; health: number; maxHealth: number; upgrades: { shop: 0|1|2|3; training: 0|1|2|3 } };
  defenses: Defense[];            // Barricade | Tower with health
  enemies: Enemy[];               // grunt | elite, health, hex, spawnNodeId
  players: Player[];              // hex, health, deck/hand/discard, orientation, dice count, skills, materials, currency
  supplies: { cards: [string[], string[], string[]]; skills: [string[], string[], string[]]; tiles: TileDef[] };
  shopOffers: string[]; xp: number; level: number; waveTrack: number;
  pending: Decision | null;       // what the engine is waiting for
  log: GameEvent[];               // optional, can be trimmed
  milestones: string[]; endedBecause?: "base" | "player";
}
```

### Configuration (rules section 18 + tuning)

All numbers in the rules live in `content/config.default.json`, not in code: health values, costs, enemy stats, XP step, starter deck, hand size, miniature limit, tile counts, wave rules, and the option flags (exploration rule, bought-card mode, max level, Skill uses). The app has a configuration panel that edits a copy and starts a new run with it.

## UI (web)

| Area | Must show |
| --- | --- |
| Map | Hex tiles with terrain, sites, base (health bar), defenses (health), enemies (health pips), players. Pan and zoom. Click a hex to move or build. Legal targets highlighted. |
| Player panel | Health, materials, currency, guard, dice count, level and XP bar. |
| Hand | Cards drawn with the correct half up; the deck visibly rotates 180° between phases. Click to play. |
| Dice tray | Rolled dice with face icons; click to keep; roll button with "roll 2 of 3". |
| Skill board | All Skills; highlight Skills the current dice can fire (Star wild); drag or click dice onto Skills. |
| Base panel | Upgrade tracks (Shop I–III, Training I–III) with costs, Shop offers, draft choice dialog. |
| Phase bar | Round, phase, wave track, tile deck count, miniature count. |
| Log | Human-readable event log with rule ids. |
| Run summary | Rounds, cause of end, milestones, real elapsed time per phase, export button (JSON). |

Accessibility: keyboard-operable decisions, visible focus, `prefers-reduced-motion` respected, colour never the only signal.

## Telemetry and timing (important for tuning)

The simulator's time model is an estimate. The prototype must **measure real time**: record wall-clock time spent in each phase and on each decision type, and include it in the run export. This replaces the simulator's estimates in later tuning.

## Testing strategy

- **Unit tests** for every rule function, tagged with rule ids.
- **Property tests:** card count is conserved (deck + hand + discard = owned cards); health never exceeds maximum; enemies never stand on lake, mountain, or Barricade hexes; miniatures never exceed the limit; Stars are never counted twice.
- **Golden replays:** stored `seed + actions[]` files with the expected final state hash. Any rules change that alters a replay must update the file on purpose.
- **Batch sanity (Phase 7):** 200 bot runs with the default config must end (base or player) with a median round between 8 and 14. This checks for regressions, not balance.

## Open questions to raise, not guess

If a rule is unclear while building, add it to `OPEN-QUESTIONS.md` with the rule id and a proposed reading, choose the proposed reading behind a config flag, and continue. Known open items:

1. Exact tile designs (terrain and site positions per tile). Phase 1 proposes 10 tile layouts for review.
2. Whether a player can build a defense on a gathering node hex (proposal: yes, the node still works).
3. Tie-breaks when several targets are equally near an enemy (proposal: player, then Tower, then Barricade, then base; then lowest health).
