import { IMPASSABLE, milestoneLabel } from '@survival/content'
import type { GameState } from '@survival/engine'
import { MapView } from './MapView.tsx'
import { PHASE_WORDS } from './stepStatus.ts'

type Props = Readonly<{ state: GameState }>

/** "1 material", "4 materials". */
const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

type ExchangeStep = NonNullable<GameState['exchange']>['step']

/** Each exchange step in words, in play order. */
const STEP_WORDS: Record<ExchangeStep, string> = {
  roll: 'Roll',
  cards: 'Add cards',
  reroll: 'Reroll',
  assign: 'Place dice on Skills',
  targets: 'Pick targets',
  resolve: 'Resolve',
}

/** "Lake", "Mountain", "Tower". */
const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

/** Plain-text view of the engine state for the debug console. */
export function StateView({ state }: Props) {
  const cardName = (def: string) => state.content.cards.find((c) => c.id === def)?.name ?? def
  const skillName = (id: string) => state.content.skills.find((s) => s.id === id)?.name ?? id
  const upgradeName = (id: string) => state.content.upgrades.find((u) => u.id === id)?.name ?? id
  const milestone = (id: string) => milestoneLabel(id, state.config.milestones, state.content)
  const ex = state.exchange
  const at = (h: { q: number; r: number }) => `(${h.q},${h.r})`
  const active = state.active
  const impassable = Object.entries(state.map.hexes)
    .filter(([, hex]) => IMPASSABLE.includes(hex.terrain))
    .map(([key, hex]) => `${capital(hex.terrain)} at (${key})`)
  const unplaced = state.players.flatMap((p, index) =>
    state.unplaced.includes(p.id) ? [`Player ${index + 1}`] : [],
  )
  return (
    <section aria-labelledby="state-heading">
      <h2 id="state-heading">State</h2>
      <MapView state={state} />
      <dl data-testid="state">
        <dt>Round / phase</dt>
        <dd>
          {state.round} / {PHASE_WORDS[state.phase]}
          {ex ? ` / ${ex.engage ? 'Engagement' : 'Exchange'}: ${STEP_WORDS[ex.step]}` : ''}
          {state.endedBecause ? ' (the base fell)' : ''}
        </dd>
        <dt>Base</dt>
        <dd>
          {state.base.health} / {state.base.maxHealth} health
        </dd>
        <dt>Experience / level</dt>
        <dd>
          {state.experience} / {state.level}
        </dd>
        <dt>Upgrades</dt>
        <dd>{state.upgrades.map(upgradeName).join(', ') || 'none'}</dd>
        <dt>Shop offers</dt>
        <dd>{state.shopOffers.map(cardName).join(', ') || 'closed'}</dd>
        {state.draft ? (
          <>
            <dt>Draft</dt>
            <dd>
              {state.draft.options.map(skillName).join(', ')}
              {state.draft.kept ? ` (kept ${skillName(state.draft.kept)}: choose a slot)` : ''}
            </dd>
          </>
        ) : null}
        <dt>Milestones</dt>
        <dd>{state.milestones.map(milestone).join(', ') || 'none'}</dd>
        <dt>Enemies</dt>
        <dd>
          {state.enemies.length === 0
            ? 'none'
            : state.enemies
                .map((e) => `${e.id} ${e.kind}, ${e.health} health, at ${at(e.hex)}`)
                .join(', ')}
        </dd>
        <dt>Defenses</dt>
        <dd>
          {state.defenses.length === 0
            ? 'none'
            : state.defenses
                .map((d) => `${d.id} ${capital(d.kind)}, ${d.health} health, at ${at(d.hex)}`)
                .join(', ')}
        </dd>
        <dt>Tiles</dt>
        <dd>
          {state.map.tiles.length} placed, {state.tileDeck.length} in the tile deck,{' '}
          {state.spentNodes.length} gathering {state.spentNodes.length === 1 ? 'node' : 'nodes'}{' '}
          spent
        </dd>
        {unplaced.length > 0 ? (
          <>
            <dt>Figures to place</dt>
            <dd>{unplaced.join(', ')}</dd>
          </>
        ) : null}
        <dt>Impassable hexes</dt>
        <dd>{impassable.join(', ') || 'none'}</dd>
        {active ? (
          <>
            <dt>In progress</dt>
            <dd>
              {active.kind === 'move'
                ? `Move: ${active.hexesLeft} movement left`
                : `Build: ${active.buildsLeft} left, cost -${active.costReduction}`}
            </dd>
          </>
        ) : null}
        {state.players.map((p, index) => (
          <div key={p.id}>
            <dt>Player {index + 1}</dt>
            <dd>
              at {at(p.hex)}, {p.health}/{p.maxHealth} health, {p.guard} guard, {p.dice}{' '}
              {p.dice === 1 ? 'die' : 'dice'}, {count(p.materials, 'material', 'materials')},{' '}
              {p.currency} currency, {p.orientation} halves up
              {p.knockedOut ? ', knocked out' : ''}
            </dd>
            <dt>Hand</dt>
            <dd>{p.hand.map((c) => `${cardName(c.def)} [${c.id}]`).join(', ') || 'empty'}</dd>
            <dt>Deck / discard / in play</dt>
            <dd>
              {p.deck.length} / {p.discard.length} / {p.inPlay.length}
            </dd>
            <dt>Skills</dt>
            <dd>{p.skills.map(skillName).join(', ')}</dd>
          </div>
        ))}
        {ex ? (
          <>
            <dt>Dice</dt>
            <dd>
              {ex.dice.map((d, i) => `${i + 1}: ${d.face}${d.kept ? ' (kept)' : ''}`).join(', ') ||
                'none'}{' '}
              — roll {ex.rollsUsed} of {state.config.combat.maxRolls}
            </dd>
            <dt>Placed on Skills</dt>
            <dd>
              {ex.assignments
                .map((a) => `die ${a.die + 1} on ${skillName(a.skill)} as ${a.asFace}`)
                .join(', ') || 'none'}
            </dd>
            <dt>Damage bonus / ignore hits</dt>
            <dd>
              +{ex.bonusDamage} / {ex.ignoreHits}
            </dd>
          </>
        ) : null}
      </dl>
    </section>
  )
}
