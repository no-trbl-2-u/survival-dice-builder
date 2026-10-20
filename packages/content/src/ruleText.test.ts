import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import {
  cardStepText,
  combatEndText,
  combatText,
  defenseText,
  enemyHitText,
  draftFullText,
  draftPoolText,
  draftTitle,
  gatherText,
  knockoutText,
  levelText,
  milestoneIds,
  milestoneLabel,
  milestoneOutOfReach,
  miniatureLimitText,
  playersText,
  returnStarterText,
  revealText,
  roundText,
  configRuleNote,
  ruleCitation,
  ruleLineFor,
  shopText,
  siegeText,
  siteText,
  spawnText,
  startText,
  targetOrderText,
  targetText,
  trainingText,
  upgradesReachable,
} from './ruleText.ts'
import type { GameConfig } from './schemas/config.ts'

const base = defaultContent.config
const m = base.milestones
const With = (patch: (c: GameConfig) => GameConfig) => patch(structuredClone(base))

describe('rule text from config', () => {
  it('levels: the experience steps and the new die follow config (Spec v2 8.1-8.5)', () => {
    expect(levelText(base, defaultContent)).toBe(
      'Each defeated enemy gives experience to all players (a grunt 1, an elite 4). Level 2 needs 3 experience, level 3 needs 6 more, level 4 needs 9 more, and each next step grows by 3. At each new level, every player gets 1 more action die.',
    )
    const flat = With((c) => ({ ...c, experience: { ...c.experience, stepIncrease: 0 } }))
    const bonus = With((c) => ({ ...c, experience: { ...c.experience, eliteBonus: 2 } }))
    expect(levelText(bonus, defaultContent)).toMatch(/\(a grunt 1, an elite 6\)/)
    expect(levelText(flat, defaultContent)).toMatch(
      /Level 2 needs 3 experience, and each next level needs 3 more\./,
    )
    const elite = With((c) => ({
      ...c,
      experience: { ...c.experience, levelPerEliteSpawn: true },
      options: { ...c.options, maxLevel: 4 },
    }))
    expect(levelText(elite, defaultContent)).toBe(
      'The level rises by 1 each time an elite spawns. At each new level, every player gets 1 more action die. The level stops at 4.',
    )
  })

  it('shop: the opening upgrade, offers and timing follow content and config (6.8, Table 6)', () => {
    expect(shopText(base, defaultContent)).toBe(
      'Stand on the Base tile and buy Shop I (a Build card and 4 materials) to open the Shop with 3 card offers. Pay for cards with currency, which you get for each enemy you defeat (a grunt 1, an elite 4); buy at any time you stand on the Base tile.',
    )
    const prepare = With((c) => ({ ...c, rulings: { ...c.rulings, shopTiming: 'prepare-only' } }))
    expect(shopText(prepare, defaultContent)).toMatch(/in the Prepare phase\.$/)
    const rich = {
      ...defaultContent,
      enemies: {
        ...defaultContent.enemies,
        enemies: defaultContent.enemies.enemies.map((e) => ({ ...e, currency: e.currency + 1 })),
      },
    }
    expect(shopText(base, rich)).toMatch(/\(a grunt 2, an elite 5\)/)
  })

  it('training: the draft round and the Skills shown follow config (10.8, 11.6)', () => {
    expect(trainingText(base, defaultContent)).toBe(
      'Stand on the Base tile and buy Training I (a Build card and 3 materials) to open the Training Ground: in rounds 2, 4, 6 and so on, each player looks at 2 Skills and keeps 1 for free.',
    )
    const often = With((c) => ({ ...c, draft: { ...c.draft, everyNRounds: 1, reveal: 3 } }))
    expect(trainingText(often, defaultContent)).toMatch(
      /every round, each player looks at 3 Skills/,
    )
    const rarely = With((c) => ({ ...c, draft: { ...c.draft, everyNRounds: 3 } }))
    expect(trainingText(rarely, defaultContent)).toMatch(/in rounds 3, 6, 9 and so on,/)
  })

  it('knockout: the return share and the losses follow config (Spec v2 14.2, 14.4)', () => {
    expect(knockoutText(base)).toBe(
      'A player at 0 health is knocked out and comes back next round with half of their maximum health, rounded up. They lose all their materials and currency.',
    )
    const kept = With((c) => ({
      ...c,
      knockout: { returnHealthDivisor: 3, loseMaterials: false, loseCurrency: false },
    }))
    expect(knockoutText(kept)).toBe(
      'A player at 0 health is knocked out and comes back next round with 1/3 of their maximum health, rounded up.',
    )
  })

  it('start: health, dice, starter Skills, deck and hand size follow config (4.7-4.10, 6.1)', () => {
    expect(startText(base, defaultContent)).toBe(
      'Each player starts with 15 health, 1 action die and 4 Skills your dice can fire: ' +
        'Strike (Sword: 2 damage to 1 enemy within 1 hex), Shot (Bow: 1 damage to 1 enemy within 2 hexes), Mend (Wand: heal 1) and Guard (Shield: gain 2 guard). ' +
        'Guard comes from the Guard Skill; it takes enemy damage before your health. ' +
        'Your deck holds 10 cards: 4 Move, 4 Gather, 1 Build and 1 Rest. You draw 5 at a time. ' +
        'Each card has two halves: the top half is for Prepare, the bottom half for Combat.',
    )
    const two = With((c) => ({
      ...c,
      player: { ...c.player, maxHealth: 12, startingDice: 2, starterSkills: ['strike'] },
    }))
    expect(startText(two, defaultContent)).toMatch(
      /12 health, 2 action dice and 1 Skill your dice can fire: Strike \(Sword: 2 damage to 1 enemy within 1 hex\)\. Your deck/,
    )
    const exchange = With((c) => ({ ...c, combat: { ...c.combat, model: 'exchange' as const } }))
    expect(startText(exchange, defaultContent)).toMatch(
      /Guard comes from the Guard Skill and your cards' bottom halves; it takes enemy damage before your health\./,
    )
  })

  it('round: Prepare then Combat, and the co-op turn order follows rulings (5.1, 16.4, 16.8)', () => {
    expect(roundText(base)).toMatch(/^Each round is Prepare, then Combat/)
    expect(roundText(base)).toMatch(
      /in Prepare you take turns one hand at a time, and in Combat you take turns too\./,
    )
    const full = With((c) => ({ ...c, rulings: { ...c.rulings, coopPrepareOrder: 'full-turn' } }))
    expect(roundText(full)).toMatch(/each player plays a whole deck in turn/)
    const solo = With((c) => ({ ...c, players: { min: 1, max: 1 } }))
    expect(roundText(solo)).not.toMatch(/take turns/)
  })

  it('reveal: the step cost follows tiles.revealMoveCost', () => {
    expect(revealText(base)).toMatch(/costs 1 hex of movement/)
    const two = With((c) => ({ ...c, tiles: { ...c.tiles, revealMoveCost: 2 } }))
    expect(revealText(two)).toMatch(/costs 2 hexes of movement/)
  })

  it('spawning: a new tile delay is named (row 66)', () => {
    expect(spawnText(base)).toBe("Each new tile's spawn nodes add enemies at every Combat.")
    const late = With((c) => ({ ...c, spawn: { ...c.spawn, newTileDelay: 2 } }))
    expect(spawnText(late)).toMatch(/from 2 rounds after it is revealed/)
  })

  it('sites: Table 1 functions, with spawn options named (rows 64, 66, 68, 70)', () => {
    expect(siteText('base', base, defaultContent)).toBe(
      'the players defend it; stand on the Base tile to buy upgrades, and cards once Shop I is built',
    )
    expect(siteText('gathering-node', base, defaultContent)).toBe(
      'a Gather card here gets its materials, once',
    )
    expect(siteText('spawn-node', base, defaultContent)).toBe('gets 1 grunt at each Combat')
    expect(siteText('elite-spawn-node', base, defaultContent)).toBe('gets 1 elite at each Combat')
    const varied = With((c) => ({
      ...c,
      spawn: { ...c.spawn, perSeat: true, newTileDelay: 1, nodeRange: 3 },
    }))
    expect(siteText('spawn-node', varied, defaultContent)).toBe(
      'gets grunts at each Combat, from 1 round after its tile is revealed, if a figure or structure is within 3 hexes',
    )
  })

  it('Gather: node rule and off-node amount follow config (rows 59, 67)', () => {
    expect(gatherText(2, base)).toBe('Gather 2 on an unspent gathering node (the node is spent)')
    const off = With((c) => ({ ...c, gather: { offNodeAmount: 1 } }))
    expect(gatherText(2, off)).toMatch(/; 1 anywhere else$/)
    const free = With((c) => ({ ...c, rulings: { ...c.rulings, gatherNeedsNode: false } }))
    expect(gatherText(2, free)).toMatch(/^Gather 2 anywhere/)
  })

  it('Combat: each model has its own text; enemy dice come from each record (Spec v2 9.6)', () => {
    expect(combatText(base, 'engage', defaultContent)).toMatch(
      /^Play a card's Engage option \(on Move and Gather\) to roll your dice from where you stand, plus the enemy dice of each enemy next to you \(a grunt rolls 1, an elite 2\)\. /,
    )
    const elite = {
      cards: [],
      enemies: { enemies: [{ ...defaultContent.enemies.enemies[1]!, dice: 3 }] },
    }
    expect(combatText(base, 'engage', elite)).toMatch(/next to you \(an elite rolls 3\)\. /)
    expect(combatText(base, 'engage', elite)).toMatch(/^Play a card's Engage option to roll/)
    expect(combatText(base, 'engage', defaultContent)).toMatch(
      /Combat ends when every hand and deck is empty/,
    )
    expect(combatText(base, 'exchange', defaultContent)).toBe(
      'In each exchange you roll, play cards and fire Skills. Then each enemy next to you that targets you rolls its enemy dice at you.',
    )
  })

  it('enemy dice: one phrase for when they hit, whose dice, and guard first (7.8 steps 7-8, row 72)', () => {
    expect(enemyHitText(base)).toBe(
      'When you choose End engagement or no dice are left, every enemy die hits you at once, even the dice of an enemy you defeated. Your guard takes the damage first, then your health.',
    )
    const cancelled = With((c) => ({
      ...c,
      combat: { ...c.combat, engage: { ...c.combat.engage, defeatedDice: 'cancelled' } },
    }))
    expect(enemyHitText(cancelled)).toMatch(/except the dice of an enemy you defeated/)
    expect(combatText(base, 'engage', defaultContent)).toContain(enemyHitText(base))
    expect(ruleLineFor('combat.engage.hitDamage', base, defaultContent)).toBe(enemyHitText(base))
    expect(ruleLineFor('combat.engage.defeatedDice', cancelled, defaultContent)).toBe(
      enemyHitText(cancelled),
    )
  })

  it("siege: when Combat ends, structures take each enemy record's siege damage (7.10-7.12)", () => {
    expect(siegeText(defaultContent)).toBe(
      'When Combat ends, each enemy next to a Barricade, a Tower, or the base hits one of them (a Barricade first, then a Tower, then the base), even when it is next to a player too: a grunt deals 1 damage, an elite 3.',
    )
    const elite = { enemies: { enemies: [{ ...defaultContent.enemies.enemies[1]!, siege: 5 }] } }
    expect(siegeText(elite)).toMatch(/: an elite deals 5 damage\.$/)
  })

  it('defenses: each cost, health, and effect from defenses.json, and the base health (Table 7, 12.3)', () => {
    expect(defenseText(base, defaultContent)).toBe(
      'A Barricade costs 2 materials and has 4 health; enemies cannot enter its hex. A Tower costs 4 materials and has 3 health; at the start of each Combat it deals 2 damage to the nearest enemy within 2 hexes. The base starts with 20 health.',
    )
    const tower = defaultContent.defenses[1]!
    const cheap = { defenses: [{ ...tower, cost: 1, attack: { damage: 3, range: 1 } }] }
    expect(defenseText({ ...base, base: { ...base.base, startingHealth: 9 } }, cheap)).toBe(
      'A Tower costs 1 material and has 3 health; at the start of each Combat it deals 3 damage to the nearest enemy within 1 hex. The base starts with 9 health.',
    )
  })

  it('Combat end: discarding is named unless every card must be played (row 10)', () => {
    expect(combatEndText(base)).toBe(
      'Play or discard each card. Cards you do not play yet stay in your hand between engagements, and Combat ends when every hand and deck is empty.',
    )
    const must = With((c) => ({ ...c, rulings: { ...c.rulings, mandatoryPlays: true } }))
    expect(combatEndText(must)).toMatch(/^Play each card\. /)
    expect(combatText(must, 'engage', defaultContent)).toContain(combatEndText(must))
  })

  it('card step: the discard choice follows rulings.mandatoryPlays under both models', () => {
    expect(cardStepText(base, 'exchange')).toBe('Play or discard each card in your hand')
    expect(cardStepText(base, 'engage')).toBe(
      'Play each card: Engage (roll to attack from where you stand), another option, or discard it',
    )
    const must = With((c) => ({ ...c, rulings: { ...c.rulings, mandatoryPlays: true } }))
    expect(cardStepText(must, 'exchange')).toBe('Play each card in your hand')
    expect(cardStepText(must, 'engage')).not.toMatch(/discard/)
  })

  it('target order: nearest structure first, pull distance, tie-break only for ties (9.3)', () => {
    expect(targetOrderText(base)).toBe(
      'Enemies head for the nearest structure, and turn to a player only when the player is at least 2 hexes nearer. Between equally near targets they pick a player, then a Tower, then a Barricade, then the base.',
    )
    const plain = With((c) => ({
      ...c,
      rulings: {
        ...c.rulings,
        playerPullDistance: 0,
        targetTieBreak: ['base', 'tower', 'barricade', 'player'],
      },
    }))
    expect(targetOrderText(plain)).toBe(
      'Enemies head for the nearest structure or player. Between equally near targets they pick the base, then a Tower, then a Barricade, then a player.',
    )
  })

  it('target: the short form / prints names the player pull (9.3, row 56)', () => {
    expect(targetText(base)).toBe(
      'Enemies head for the nearest structure, and turn to a player only when the player is at least 2 hexes nearer.',
    )
    expect(targetOrderText(base).startsWith(targetText(base))).toBe(true)
  })

  it('starter return: one fixed line, read by the dialog', () => {
    expect(returnStarterText()).toMatch(/starter card leaves your deck/)
  })

  it('rule citations: design-document tags become plain words; sections pass through', () => {
    expect(ruleCitation('Combat v3')).toBe('engagements')
    expect(ruleCitation('Combat v3 (siege)')).toBe('engagements (siege)')
    expect(ruleCitation('9.3, core loop v2 (open question 56)')).toBe(
      '9.3, core loop (open question 56)',
    )
    expect(ruleCitation('Core loop v2 (open question 55)')).toBe('core loop (open question 55)')
    expect(ruleCitation('7.8 step 8')).toBe('7.8 step 8')
  })

  it('config rules note: sections only; a field with none is not in the written rules (18.1)', () => {
    expect(configRuleNote('6.9')).toBe('Rules 6.9.')
    expect(configRuleNote('7.8, Combat v3')).toBe('Rules 7.8.')
    expect(configRuleNote('10.1 (core loop v2)')).toBe('Rules 10.1.')
    expect(configRuleNote('9.3, core loop v2 (open question 56)', new Set([56]))).toBe(
      'Rules 9.3 (rule reading 56).',
    )
    expect(configRuleNote('9.7 (open questions 2, 39)', new Set([56]))).toBe('Rules 9.7.')
    expect(configRuleNote('6.8 (open questions 11, 43)', new Set([11, 43]))).toBe(
      'Rules 6.8 (rule readings 11, 43).',
    )
    expect(configRuleNote('Core loop v2 (open question 55)', new Set([55]))).toBe(
      'Not in the written rules (rule reading 55).',
    )
    expect(configRuleNote('Table 4')).toBe('Rules Table 4.')
    expect(configRuleNote('Combat v3')).toBe('Not in the written rules.')
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

  it('milestones: "Buy 3 base upgrades" is marked out of reach while every Build is Build I (row 78)', () => {
    expect(upgradesReachable(base, defaultContent).map((u) => u.id)).toEqual([
      'shop-1',
      'training-1',
    ])
    const out = 'out of reach: Build cards can buy only Shop I and Training I'
    expect(milestoneOutOfReach('buy-upgrades', base, defaultContent)).toBe(out)
    expect(ruleLineFor('milestones.upgradesBought', base, defaultContent)).toBe(
      `Buy 3 base upgrades (${out}).`,
    )
    const any = With((c) => ({ ...c, rulings: { ...c.rulings, buildLevels: 'any' } }))
    expect(upgradesReachable(any, defaultContent)).toHaveLength(defaultContent.upgrades.length)
    expect(milestoneOutOfReach('buy-upgrades', any, defaultContent)).toBeNull()
    const two = With((c) => ({ ...c, milestones: { ...c.milestones, upgradesBought: 2 } }))
    expect(milestoneOutOfReach('buy-upgrades', two, defaultContent)).toBeNull()
    for (const id of milestoneIds(m).filter((i) => i !== 'buy-upgrades' && i !== 'reveal-tiles'))
      expect(milestoneOutOfReach(id, base, defaultContent)).toBeNull()
  })

  it('milestones: "Reveal 10 tiles" is marked out of reach with 8 tiles in the tile deck (row 4)', () => {
    const out = 'out of reach: the tile deck holds 8 tiles'
    expect(milestoneOutOfReach('reveal-tiles', base, defaultContent)).toBe(out)
    expect(ruleLineFor('milestones.tilesRevealed', base, defaultContent)).toBe(
      `Reveal 10 tiles (${out}).`,
    )
    const eight = With((c) => ({ ...c, milestones: { ...c.milestones, tilesRevealed: 8 } }))
    expect(milestoneOutOfReach('reveal-tiles', eight, defaultContent)).toBeNull()
    expect(ruleLineFor('milestones.tilesRevealed', eight, defaultContent)).toBe('Reveal 8 tiles.')
  })

  it('/config: the fields a phrase reads get that phrase; others get none', () => {
    const line = (path: string) => ruleLineFor(path, base, defaultContent)
    expect(line('miniatureLimit')).toBe(miniatureLimitText(base))
    expect(line('knockout.loseMaterials')).toBe(knockoutText(base))
    expect(line('experience.stepIncrease')).toBe(levelText(base, defaultContent))
    expect(line('experience.eliteBonus')).toBe(levelText(base, defaultContent))
    expect(line('draft.unpicked')).toBe(draftPoolText(base))
    expect(line('milestones.tilesRevealed')).toBe(
      'Reveal 10 tiles (out of reach: the tile deck holds 8 tiles).',
    )
    expect(line('milestones.surviveRounds')).toBe(
      'Survive to round 5; Survive to round 10; Survive to round 15.',
    )
    expect(line('combat.model')).toBe(
      `${combatText(base, 'engage', defaultContent)} ${siegeText(defaultContent)}`,
    )
    expect(line('rulings.mandatoryPlays')).toBe(combatEndText(base))
    expect(line('rulings.targetTieBreak')).toBe(targetOrderText(base))
    expect(line('rulings.playerPullDistance')).toBe(targetOrderText(base))
    expect(line('player.maxHealth')).toBeNull()
  })
})
