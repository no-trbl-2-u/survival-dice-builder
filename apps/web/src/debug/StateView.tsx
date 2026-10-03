import type { GameState } from '@survival/engine'
import { MapView } from './MapView.tsx'

type Props = Readonly<{ state: GameState }>

/** Plain-text view of the engine state for the debug console. */
export function StateView({ state }: Props) {
  const cardName = (def: string) => state.content.cards.find((c) => c.id === def)?.name ?? def
  const skillName = (id: string) => state.content.skills.find((s) => s.id === id)?.name ?? id
  const ex = state.exchange
  const at = (h: { q: number; r: number }) => `(${h.q},${h.r})`
  const active = state.active
  return (
    <section aria-labelledby="state-heading">
      <h2 id="state-heading">State</h2>
      <MapView state={state} />
      <dl data-testid="state">
        <dt>Round / phase</dt>
        <dd>
          {state.round} / {state.phase}
          {ex ? ` / ${ex.skirmish ? 'skirmish' : 'exchange'}: ${ex.step}` : ''}
          {state.endedBecause ? ` (ended: ${state.endedBecause})` : ''}
        </dd>
        <dt>Base</dt>
        <dd>
          {state.base.health} / {state.base.maxHealth} health, wave track {state.waveTrack}
        </dd>
        <dt>Enemies</dt>
        <dd>
          {state.enemies.length === 0
            ? 'none'
            : state.enemies
                .map((e) => `${e.id} ${e.kind} (${e.health}) at ${at(e.hex)}`)
                .join(', ')}
        </dd>
        <dt>Defenses</dt>
        <dd>
          {state.defenses.length === 0
            ? 'none'
            : state.defenses
                .map((d) => `${d.id} ${d.kind} (${d.health}) at ${at(d.hex)}`)
                .join(', ')}
        </dd>
        <dt>Tiles</dt>
        <dd>
          {state.map.tiles.length} placed, {state.tileDeck.length} in the tile deck
          {state.revealed.length > 0 ? `, waiting to place: ${state.revealed.join(', ')}` : ''}
        </dd>
        {active ? (
          <>
            <dt>In progress</dt>
            <dd>
              {active.kind === 'move'
                ? `Move: ${active.hexesLeft} hexes left`
                : `Build: ${active.buildsLeft} left, cost -${active.costReduction}`}
            </dd>
          </>
        ) : null}
        {state.players.map((p) => (
          <div key={p.id}>
            <dt>Player {p.id}</dt>
            <dd>
              at {at(p.hex)}, {p.health}/{p.maxHealth} health, {p.guard} guard, {p.dice} dice,{' '}
              {p.materials} materials, orientation {p.orientation}
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
