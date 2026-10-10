import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import {
  combatText,
  draftFullText,
  draftPoolText,
  draftTitle,
  gatherText,
  knockoutText,
  milestoneIds,
  milestoneLabel,
  miniatureLimitText,
  playersText,
  revealText,
  ruleLineFor,
  spawnText,
} from './ruleText.ts'
import type { GameConfig } from './schemas/config.ts'

const base = defaultContent.config
const m = base.milestones
const With = (patch: (c: GameConfig) => GameConfig) => patch(structuredClone(base))

describe('rule text from config', () => {
  it('knockout: the return share and lost materials follow config (row 55)', () => {
    expect(knockoutText(base)).toBe(
      'A player at 0 health is knocked out and comes back next round with half of their maximum health, rounded up. The materials they carry are lost.',
    )
    const kept = With((c) => ({ ...c, knockout: { returnHealthDivisor: 3, loseMaterials: false } }))
    expect(knockoutText(kept)).toBe(
      'A player at 0 health is knocked out and comes back next round with 1/3 of their maximum health, rounded up.',
    )
  })

  it('reveal: the step cost follows tiles.revealMoveCost', () => {
    expect(revealText(base)).toMatch(/costs 1 hex of movement/)
    const two = With((c) => ({ ...c, tiles: { ...c.tiles, revealMoveCost: 2 } }))
    expect(revealText(two)).toMatch(/costs 2 hexes of movement/)
  })

  it('spawning: a new tile delay is named (row 66)', () => {
    expect(spawnText(base)).toMatch(/add enemies at every Combat,/)
    const late = With((c) => ({ ...c, spawn: { ...c.spawn, newTileDelay: 2 } }))
    expect(spawnText(late)).toMatch(/from 2 rounds after it is revealed/)
  })

  it('Gather: node rule and off-node amount follow config (rows 59, 67)', () => {
    expect(gatherText(2, base)).toBe('Gather 2 on an unspent gathering node (the node is spent)')
    const off = With((c) => ({ ...c, gather: { offNodeAmount: 1 } }))
    expect(gatherText(2, off)).toMatch(/; 1 anywhere else$/)
    const free = With((c) => ({ ...c, rulings: { ...c.rulings, gatherNeedsNode: false } }))
    expect(gatherText(2, free)).toMatch(/^Gather 2 anywhere/)
  })

  it('Combat: each model has its own text; elite dice follow config', () => {
    expect(combatText(base, 'engage')).toMatch(/2 dice for each elite/)
    expect(combatText(base, 'engage')).toMatch(/Combat ends when every hand and deck is empty/)
    const one = With((c) => ({
      ...c,
      combat: { ...c.combat, engage: { ...c.combat.engage, eliteDice: 1 } },
    }))
    expect(combatText(one, 'engage')).toMatch(/1 die for each elite/)
    expect(combatText(base, 'exchange')).toMatch(/^In each exchange/)
  })

  it('draft: slots and pool follow config (11.8)', () => {
    expect(draftTitle()).toBe('Skill draft: keep a Skill')
    const two = With((c) => ({ ...c, draft: { ...c.draft, unpicked: 'supply' } }))
    expect(draftFullText(base, 'Fireball')).toBe(
      `Your ${base.player.draftSlots} draft slots are full: Fireball replaces a Skill`,
    )
    expect(draftPoolText(base)).toMatch(/go to your pool/)
    expect(draftPoolText(two)).toMatch(/back to the supply/)
  })

  it('miniature limit and players follow config', () => {
    expect(miniatureLimitText(base)).toMatch(/^At most 20 enemies stand on the map/)
    expect(miniatureLimitText(base)).toMatch(/new grunt or elite/)
    expect(playersText(base)).toBe('1 to 4 players')
    expect(playersText(With((c) => ({ ...c, players: { min: 1, max: 1 } })))).toBe('1 player')
  })

  it('milestones: every id has a label with its numbers from config (17)', () => {
    for (const id of milestoneIds(m)) {
      const label = milestoneLabel(id, m, defaultContent)
      expect(label).not.toBe(id)
      expect(label).not.toMatch(/-|undefined/)
    }
    const custom = { ...m, surviveRounds: [8], tilesRevealed: 7, upgradesBought: 1, level: 3 }
    expect(milestoneIds(custom)[0]).toBe('survive-round-8')
    expect(milestoneLabel('survive-round-8', custom, defaultContent)).toBe('Survive to round 8')
    expect(milestoneLabel('reveal-tiles', custom, defaultContent)).toBe('Reveal 7 tiles')
    expect(milestoneLabel('buy-upgrades', custom, defaultContent)).toBe('Buy 1 base upgrade')
    expect(milestoneLabel('reach-level', custom, defaultContent)).toBe('Reach level 3')
    const skill = defaultContent.skills.find((s) => s.id === m.skillFired)!
    expect(milestoneLabel(`fire-${m.skillFired}`, custom, defaultContent)).toBe(
      `Fire ${skill.name}`,
    )
  })

  it('/config: the fields a phrase reads get that phrase; others get none', () => {
    const line = (path: string) => ruleLineFor(path, base, defaultContent)
    expect(line('miniatureLimit')).toBe(miniatureLimitText(base))
    expect(line('knockout.loseMaterials')).toBe(knockoutText(base))
    expect(line('draft.unpicked')).toBe(draftPoolText(base))
    expect(line('milestones.tilesRevealed')).toBe('Reveal 10 tiles.')
    expect(line('milestones.surviveRounds')).toBe(
      'Survive to round 5; Survive to round 10; Survive to round 15.',
    )
    expect(line('player.maxHealth')).toBeNull()
  })
})
