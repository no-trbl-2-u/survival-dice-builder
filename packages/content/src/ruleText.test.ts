import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { defaultConfigMeta } from './configMeta.ts'
import { defaultContent } from './content.ts'
import { defaultProposals } from './proposals.ts'
import {
  cardStepText,
  combatEndText,
  combatText,
  defenseText,
  enemyDieText,
  enemyMoveText,
  rollsText,
  moveCostText,
  enemyHitText,
  draftFullText,
  draftSlotsText,
  draftPoolText,
  draftTitle,
  gatherText,
  knockoutText,
  levelText,
  materialsText,
  milestoneIds,
  milestoneLabel,
  milestoneOutOfReach,
  miniatureLimitText,
  playersText,
  returnStarterText,
  boughtCardsText,
  figuresPerHexText,
  blockedPathText,
  forcedRevealText,
  revealText,
  roundText,
  configRuleNote,
  ruleCitation,
  replaceSkillText,
  ruleLineFor,
  shopText,
  siegeText,
  siteText,
  skillEffectText,
  spawnText,
  startText,
  targetOrderText,
  targetText,
  trainingText,
  upgradesReachable,
  upgradesReachNote,
} from './ruleText.ts'
import type { GameConfig } from './schemas/config.ts'

const base = defaultContent.config
const m = base.milestones
const With = (patch: (c: GameConfig) => GameConfig) => patch(structuredClone(base))

describe('rule text from config', () => {
  it('levels: the experience steps and the new die follow config (Spec v2 8.1-8.5)', () => {
    expect(levelText(base, defaultContent)).toBe(
      'Each defeated enemy gives experience to all players (a grunt 1, an elite 4). Level 2 needs 3 experience, level 3 needs 6 more, level 4 needs 9 more and each next step grows by 3. At each new level, every player gets 1 more action die.',
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
    expect(ruleLineFor('shop.offers', base, defaultContent)).toBe(shopText(base, defaultContent))
    expect(ruleLineFor('rulings.shopTiming', prepare, defaultContent)).toMatch(
      /in the Prepare phase\.$/,
    )
  })

  it('training: the draft round, the Skills shown and where the rest go follow config (10.8, 11.6, 11.7)', () => {
    expect(trainingText(base, defaultContent)).toBe(
      'Stand on the Base tile and buy Training I (a Build card and 3 materials) to open the Training Ground: in rounds 2, 4, 6 and so on, each player looks at 2 new Skills plus their own pool and keeps 1 for free. The Skills you do not keep go to your pool. Later drafts offer them again.',
    )
    const supply = With((c) => ({ ...c, draft: { ...c.draft, unpicked: 'supply' } }))
    expect(trainingText(supply, defaultContent)).toMatch(
      /each player looks at 2 Skills and keeps 1 for free\. The Skills you do not keep go back to the supply\.$/,
    )
    const often = With((c) => ({ ...c, draft: { ...c.draft, everyNRounds: 1, reveal: 3 } }))
    expect(trainingText(often, defaultContent)).toMatch(
      /every round, each player looks at 3 new Skills plus their own pool/,
    )
    const rarely = With((c) => ({ ...c, draft: { ...c.draft, everyNRounds: 3 } }))
    expect(trainingText(rarely, defaultContent)).toMatch(/in rounds 3, 6, 9 and so on,/)
    expect(ruleLineFor('draft.everyNRounds', base, defaultContent)).toBe(
      trainingText(base, defaultContent),
    )
    expect(ruleLineFor('draft.everyNRounds', rarely, defaultContent)).toMatch(
      /in rounds 3, 6, 9 and so on,/,
    )
    expect(ruleLineFor('draft.reveal', often, defaultContent)).toBe(
      trainingText(often, defaultContent),
    )
  })

  it('knockout: the return share and the losses follow config (Spec v2 14.2, 14.4)', () => {
    expect(knockoutText(base)).toBe(
      'A player at 0 health is knocked out and comes back at the start of the next round on a free base hex, with half of their maximum health, rounded up. If no base hex is free, they stay out 1 more round. They lose all their materials and currency.',
    )
    const kept = With((c) => ({
      ...c,
      knockout: { returnHealthDivisor: 3, loseMaterials: false, loseCurrency: false },
    }))
    expect(knockoutText(kept)).toBe(
      'A player at 0 health is knocked out and comes back at the start of the next round on a free base hex, with 1/3 of their maximum health, rounded up. If no base hex is free, they stay out 1 more round.',
    )
  })

  it('start: health, dice, starter Skills, deck and hand size follow config (4.7-4.10, 6.1)', () => {
    expect(startText(base, defaultContent)).toBe(
      'Each player starts with 15 health, 1 action die and 4 Skills your dice can fire: ' +
        'Strike (Sword: 2 damage to 1 enemy within 1 hex), Shot (Bow: 1 damage to 1 enemy within 2 hexes), Mend (Wand: heal 1 health) and Guard (Shield: gain 2 guard). ' +
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
    for (const path of [
      'player.maxHealth',
      'player.startingDice',
      'player.starterSkills',
      'deck.preset',
    ])
      expect(ruleLineFor(path, base, defaultContent)).toBe(startText(base, defaultContent))
    expect(ruleLineFor('player.startingDice', two, defaultContent)).toMatch(/2 action dice/)
    expect(ruleLineFor('base.startingHealth', base, defaultContent)).toBe(
      'The base starts with 20 health. Each base upgrade adds 5 to its maximum health and to its health.',
    )
    const weak = With((c) => ({ ...c, base: { startingHealth: 9, healthPerUpgrade: 3 } }))
    for (const path of ['base.startingHealth', 'base.healthPerUpgrade'])
      expect(ruleLineFor(path, weak, defaultContent)).toBe(
        'The base starts with 9 health. Each base upgrade adds 3 to its maximum health and to its health.',
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
    expect(ruleLineFor('rulings.coopPrepareOrder', full, defaultContent)).toBe(roundText(full))
  })

  it('reveal: the step cost follows tiles.revealMoveCost', () => {
    expect(revealText(base)).toMatch(/costs 1 movement\./)
    const two = With((c) => ({ ...c, tiles: { ...c.tiles, revealMoveCost: 2 } }))
    expect(revealText(two)).toMatch(/costs 2 movement\./)
  })

  it('spawning: a new tile delay is named (row 66)', () => {
    expect(spawnText(base)).toBe("Each new tile's spawn nodes get enemies at each Combat.")
    const late = With((c) => ({ ...c, spawn: { ...c.spawn, newTileDelay: 2 } }))
    expect(spawnText(late)).toMatch(/from 2 rounds after it is revealed/)
  })

  it('sites: Table 1 functions, with spawn options named (rows 64, 66, 68, 70)', () => {
    expect(siteText('base', base, defaultContent)).toBe(
      'the players defend it; stand on the Base tile and play a Build card to buy upgrades, and buy cards once Shop I is built',
    )
    expect(siteText('gathering-node', base, defaultContent)).toBe(
      "a card's Gather option played here with no enemy on the node gets its materials once; then the node is spent for the rest of the run",
    )
    expect(
      siteText(
        'gathering-node',
        With((c) => ({ ...c, rulings: { ...c.rulings, gatherNeedsNode: false } })),
        defaultContent,
      ),
    ).toBe('the first Gather option played here with no enemy on the node spends it')
    expect(siteText('spawn-node', base, defaultContent)).toBe('gets 1 grunt at each Combat')
    expect(siteText('elite-spawn-node', base, defaultContent)).toBe('gets 1 elite at each Combat')
    const varied = With((c) => ({
      ...c,
      spawn: { ...c.spawn, perSeat: true, newTileDelay: 1, nodeRange: 3 },
    }))
    expect(siteText('spawn-node', varied, defaultContent)).toBe(
      'gets 1 grunt for each 2 seats, rounded up, at each Combat, from 1 round after its tile is revealed, if a player figure, a Barricade, a Tower or the base is within 3 hexes',
    )
    const ramped = With((c) => ({ ...c, spawn: { ...c.spawn, rampEvery: 3 } }))
    expect(siteText('elite-spawn-node', ramped, defaultContent)).toBe(
      'gets 1 elite at each Combat, and 1 more for every 3 rounds after round 1',
    )
    const both = With((c) => ({ ...c, spawn: { ...c.spawn, rampEvery: 1, perSeat: true } }))
    expect(siteText('spawn-node', both, defaultContent)).toBe(
      'gets 1 grunt for each 2 seats, rounded up, at each Combat, and 1 more each round after round 1',
    )
    for (const path of ['spawn.rampEvery', 'spawn.perSeat', 'spawn.nodeRange'])
      expect(ruleLineFor(path, base, defaultContent)).toBe(
        'A spawn node gets 1 grunt at each Combat; an elite spawn node gets 1 elite at each Combat.',
      )
    expect(ruleLineFor('spawn.nodeRange', varied, defaultContent)).toMatch(
      /^A spawn node gets 1 grunt for each 2 seats, rounded up, at each Combat, .* within 3 hexes; an elite spawn node gets 1 elite for each 2 seats, /,
    )
  })

  it('Gather: node rule and off-node amount follow config, and an enemy on the hex blocks it (6.9, rows 59, 67)', () => {
    expect(gatherText(2, base)).toBe(
      'Gather 2 on an unspent gathering node with no enemy on it (the node is spent)',
    )
    const off = With((c) => ({ ...c, gather: { offNodeAmount: 1 } }))
    expect(gatherText(2, off)).toMatch(/; 1 on any other hex with no enemy on it$/)
    const free = With((c) => ({ ...c, rulings: { ...c.rulings, gatherNeedsNode: false } }))
    expect(gatherText(2, free)).toBe(
      'Gather 2 on any hex with no enemy on it (an unspent gathering node is spent)',
    )
    for (const config of [base, off, free]) {
      expect(gatherText(2, config)).toContain('with no enemy on it')
      expect(materialsText(config, defaultContent)).toContain('with no enemy on it')
      expect(siteText('gathering-node', config, defaultContent)).toContain(
        'with no enemy on the node',
      )
    }
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
      'When you choose End engagement or no dice are left, the enemy dice hit you at once, even the dice of an enemy you defeated. Your guard takes the damage first, then your health.',
    )
    const cancelled = With((c) => ({
      ...c,
      combat: { ...c.combat, engage: { ...c.combat.engage, defeatedDice: 'cancelled' } },
    }))
    expect(enemyHitText(cancelled)).toMatch(/except the dice of an enemy you defeated/)
    expect(combatText(base, 'engage', defaultContent)).toContain(enemyHitText(base))
    expect(ruleLineFor('combat.engage.defeatedDice', cancelled, defaultContent)).toBe(
      enemyHitText(cancelled),
    )
  })

  it('enemy die: the faces and the damage of each follow config (Table 4)', () => {
    expect(enemyDieText(base)).toBe(
      'An enemy die has 2 Hit faces, 3 Miss faces and 1 Special face. A Hit deals 1 damage, a Special 2, a Miss none.',
    )
    const harsh = With((c) => ({
      ...c,
      combat: {
        ...c.combat,
        engage: {
          ...c.combat.engage,
          enemyDie: ['hit', 'hit', 'hit', 'special', 'special', 'special'],
          hitDamage: 2,
          specialDamage: 3,
        },
      },
    }))
    expect(enemyDieText(harsh)).toBe(
      'An enemy die has 3 Hit faces and 3 Special faces. A Hit deals 2 damage, a Special 3, a Miss none.',
    )
    for (const path of [
      'combat.engage.enemyDie',
      'combat.engage.hitDamage',
      'combat.engage.specialDamage',
    ])
      expect(ruleLineFor(path, harsh, defaultContent)).toBe(
        `${enemyDieText(harsh)} ${enemyHitText(harsh)}`,
      )
  })

  it('Combat: the Engage line names the enemy die faces before the dice hit (Table 4, 7.8)', () => {
    expect(combatText(base, 'engage', defaultContent)).toContain(
      `one at a time. ${enemyDieText(base)} ${enemyHitText(base)} `,
    )
    expect(combatText(base, 'exchange', defaultContent)).not.toContain(enemyDieText(base))
  })

  it("siege: when Combat ends, structures take each enemy record's siege damage (7.10-7.12)", () => {
    expect(siegeText(defaultContent)).toBe(
      'When Combat ends, each enemy next to a Barricade, a Tower or the base hits one of them (a Barricade first, then a Tower, then the base), even when it is next to a player too: a grunt deals 1 damage, an elite 3.',
    )
    const elite = { enemies: { enemies: [{ ...defaultContent.enemies.enemies[1]!, siege: 5 }] } }
    expect(siegeText(elite)).toMatch(/: an elite deals 5 damage\.$/)
  })

  it('defenses: each cost, health, and effect from defenses.json, a Tower kill paying its builder, and the base health (Table 7, 12.3, 8.2)', () => {
    expect(defenseText(base, defaultContent)).toBe(
      'A Barricade costs 2 materials and has 4 health; enemies cannot enter its hex. A Tower costs 4 materials and has 3 health; at the start of each Combat it deals 2 damage to the nearest enemy within 2 hexes. When a Tower defeats an enemy, the player who built it gets the currency. The base starts with 20 health.',
    )
    const tower = defaultContent.defenses[1]!
    const cheap = { defenses: [{ ...tower, cost: 1, attack: { damage: 3, range: 1 } }] }
    expect(defenseText({ ...base, base: { ...base.base, startingHealth: 9 } }, cheap)).toBe(
      'A Tower costs 1 material and has 3 health; at the start of each Combat it deals 3 damage to the nearest enemy within 1 hex. When a Tower defeats an enemy, the player who built it gets the currency. The base starts with 9 health.',
    )
  })

  it('materials: any card gathers, the starter Gather amount as the example, where Gather works, and a node giving its materials once (6.7, rows 59, 67)', () => {
    expect(materialsText(base, defaultContent)).toBe(
      "Play a card's Gather option on a gathering node with no enemy on it to get its materials (2 materials for the starter Gather card); each node gives its materials once, then it is spent for the rest of the run.",
    )
    expect(
      materialsText(
        With((c) => ({ ...c, gather: { offNodeAmount: 1 } })),
        defaultContent,
      ),
    ).toBe(
      "Play a card's Gather option on a gathering node with no enemy on it to get its materials (2 materials for the starter Gather card); each node gives its materials once, then it is spent for the rest of the run. On any other hex with no enemy on it, a Gather option gets 1 material.",
    )
    expect(
      materialsText(
        With((c) => ({ ...c, rulings: { ...c.rulings, gatherNeedsNode: false } })),
        defaultContent,
      ),
    ).toBe(
      "Play a card's Gather option on any hex with no enemy on it to get its materials (2 materials for the starter Gather card); a gathering node it is played on gives materials once.",
    )
    const one = {
      cards: defaultContent.cards.map((c) =>
        c.top.kind === 'gather' ? { ...c, top: { ...c.top, amount: 1 } } : c,
      ),
    }
    expect(materialsText(base, one)).toMatch(/\(1 material for the starter Gather card\);/)
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
      'Play each card: Engage (roll to attack from where you stand), another option or discard it',
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

  it('enemy move: the hexes each enemy moves follow config, and the field shows the target order (7.5)', () => {
    expect(enemyMoveText(base)).toBe(
      'At each Combat, before the spawn nodes spawn, each enemy, oldest first, moves up to 2 hexes toward its target and stops next to it.',
    )
    const slow = With((c) => ({ ...c, combat: { ...c.combat, enemyMoveHexes: 1 } }))
    expect(enemyMoveText(slow)).toMatch(/moves up to 1 hex toward/)
    expect(ruleLineFor('combat.enemyMoveHexes', slow, defaultContent)).toBe(
      `${enemyMoveText(slow)} ${targetOrderText(slow)}`,
    )
  })

  it('rolls: the rolls per engagement follow config, and the field shows the line (7.8 steps 3, 6)', () => {
    expect(rollsText(base)).toBe(
      "In an engagement you roll all your dice, then keep the dice you want and roll the others again, up to 3 rolls in all. The enemy dice roll only once, and a card's Reroll does not count as a roll.",
    )
    const two = With((c) => ({ ...c, combat: { ...c.combat, maxRolls: 2 } }))
    expect(rollsText(two)).toMatch(/up to 2 rolls in all/)
    const one = With((c) => ({ ...c, combat: { ...c.combat, maxRolls: 1 } }))
    expect(rollsText(one)).toMatch(
      /^In an engagement you roll all your dice once and do not roll them again\./,
    )
    expect(ruleLineFor('combat.maxRolls', two, defaultContent)).toBe(rollsText(two))
  })

  it('move cost: a step next to an enemy follows config, and the field shows the line (6.9, row 76)', () => {
    expect(moveCostText(base, defaultContent)).toBe(
      'You cannot move into a hex that has an enemy, and a step onto a hex next to an enemy costs 1, the same as each step.',
    )
    const two = With((c) => ({ ...c, combat: { ...c.combat, moveCostNextToEnemy: 2 } }))
    expect(moveCostText(two, defaultContent)).toBe(
      'You cannot move into a hex that has an enemy, and a step onto a hex next to an enemy costs 2 movement instead of 1; Blink ignores that cost.',
    )
    expect(ruleLineFor('combat.moveCostNextToEnemy', two, defaultContent)).toBe(
      moveCostText(two, defaultContent),
    )
  })

  it('target: the short form / prints names the player pull (9.3, row 56)', () => {
    expect(targetText(base)).toBe(
      'Enemies head for the nearest structure, and turn to a player only when the player is at least 2 hexes nearer.',
    )
    expect(targetOrderText(base).startsWith(targetText(base))).toBe(true)
  })

  it('bought cards: the line names the smallest deck in replace-starter mode (13.1, 18.1)', () => {
    expect(boughtCardsText(base)).toBe(
      'A card you buy goes to your discard pile and adds to your deck; no starter card leaves it.',
    )
    const replace = With((c) => ({
      ...c,
      options: { ...c.options, boughtCards: 'replace-starter' as const },
      deck: { ...c.deck, minimumSize: 8 },
    }))
    expect(boughtCardsText(replace)).toBe(
      'A card you buy goes to your discard pile; then, if you have more than 8 cards, you return a starter card from your deck or discard pile and it leaves the game.',
    )
    expect(ruleLineFor('deck.minimumSize', replace, defaultContent)).toBe(boughtCardsText(replace))
    expect(ruleLineFor('options.boughtCards', base, defaultContent)).toBe(boughtCardsText(base))
  })

  it('figures per hex: the line names the limit, on the base too (3.8, 4.6)', () => {
    expect(figuresPerHexText(base)).toBe(
      'A hex holds at most 1 player figure, on the base too: you cannot move into a hex where another figure stands, and a knocked-out player who finds no free base hex stays out until the next round start.',
    )
    const two = With((c) => ({ ...c, rulings: { ...c.rulings, figuresPerHex: 2 } }))
    expect(figuresPerHexText(two)).toBe(
      'A hex holds at most 2 player figures, on the base too: you cannot move into a hex where 2 other figures stand, and a knocked-out player who finds no free base hex stays out until the next round start.',
    )
    expect(ruleLineFor('rulings.figuresPerHex', two, defaultContent)).toBe(figuresPerHexText(two))
  })

  it('blocked enemy: the line names the blockers and what a blocked enemy does (9.7)', () => {
    expect(blockedPathText(base)).toBe(
      'Enemies, player figures, Barricades, Towers, lakes and mountains block an enemy. If every path to its target is blocked, the enemy moves toward the next nearest target; if no path reaches any target, it does not move.',
    )
    const wait = With((c) => ({
      ...c,
      rulings: { ...c.rulings, blockedPathRule: 'wait' as const },
    }))
    expect(blockedPathText(wait)).toBe(
      'Enemies, player figures, Barricades, Towers, lakes and mountains block an enemy. If every path to its target is blocked, the enemy waits where it is.',
    )
    expect(ruleLineFor('rulings.blockedPathRule', wait, defaultContent)).toBe(blockedPathText(wait))
  })

  it('forced reveal: off reveals only on a step; on names the round-end reveal (6.7, row 63)', () => {
    expect(forcedRevealText(base)).toBe(
      'A tile is revealed only when a player steps off the edge of the map.',
    )
    const three = With((c) => ({ ...c, clock: { forcedRevealEvery: 3 } }))
    expect(forcedRevealText(three)).toBe(
      'At round end, if no tile was revealed in the last 3 rounds and the tile deck is not empty, the top tile is revealed in the open slot nearest the base.',
    )
    const one = With((c) => ({ ...c, clock: { forcedRevealEvery: 1 } }))
    expect(forcedRevealText(one)).toMatch(/in the last 1 round and/)
    expect(ruleLineFor('clock.forcedRevealEvery', three, defaultContent)).toBe(
      forcedRevealText(three),
    )
  })

  it('starter return: one fixed line, read by the dialog', () => {
    expect(returnStarterText()).toMatch(/starter card leaves your deck/)
    expect(returnStarterText('Player 2')).toBe(
      "Player 2 bought a card, so a starter card leaves Player 2's deck for good.",
    )
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
    expect(configRuleNote('6.9')).toBe('Rule 6.9.')
    expect(configRuleNote('7.8, Combat v3')).toBe('Rule 7.8.')
    expect(configRuleNote('6.7 (core loop v2)')).toBe('Rule 6.7.')
    expect(configRuleNote('9.3, core loop v2 (open question 56)', new Set([56]))).toBe(
      'Rule 9.3 (rule reading 56).',
    )
    expect(configRuleNote('9.7 (open questions 2, 39)', new Set([56]))).toBe('Rule 9.7.')
    expect(configRuleNote('6.8 (open questions 11, 43)', new Set([11, 43]))).toBe(
      'Rule 6.8 (rule readings 11, 43).',
    )
    expect(configRuleNote('Core loop v2 (open question 55)', new Set([55]))).toBe(
      'Not in the written rules (rule reading 55).',
    )
    expect(configRuleNote('Table 4')).toBe('Rule Table 4.')
    expect(configRuleNote('Combat v3')).toBe('Not in the written rules.')
    expect(configRuleNote('4.10, Table 3')).toBe('Rules 4.10, Table 3.')
    expect(configRuleNote('18.1, 13.1 (open question 44)')).toBe('Rules 18.1, 13.1.')
  })

  it('draft: slots and pool follow config (11.8)', () => {
    expect(draftTitle()).toBe('Skill draft: keep a Skill')
    const two = With((c) => ({ ...c, draft: { ...c.draft, unpicked: 'supply' } }))
    expect(draftFullText(base, 'Fireball')).toBe(
      `Your ${base.player.draftSlots} draft slots are full: Fireball replaces a Skill`,
    )
    expect(draftFullText(base, 'Fireball', 'Player 2')).toBe(
      `Player 2's ${base.player.draftSlots} draft slots are full: Fireball replaces a Skill`,
    )
    expect(draftPoolText(base)).toMatch(/go to your pool/)
    expect(draftPoolText(two)).toMatch(/back to the supply/)
    expect(draftPoolText(base, 'Player 2')).toBe(
      "The Skills Player 2 does not keep go to Player 2's pool. Later drafts offer them again.",
    )
    expect(draftPoolText(two, 'Player 2')).toBe(
      'The Skills Player 2 does not keep go back to the supply.',
    )
  })

  it('draft slots: the /config line states the full-slots rule (11.9)', () => {
    const n = base.player.draftSlots
    const swap = `With all ${n} draft slots full, a newly kept Skill replaces one of your drafted Skills, which goes to the bottom of its supply.`
    expect(draftSlotsText(base)).toBe(swap)
    expect(ruleLineFor('player.draftSlots', base, defaultContent)).toBe(swap)
    const skip = With((c) => ({ ...c, rulings: { ...c.rulings, fullBoardDraft: 'skip' } }))
    expect(ruleLineFor('rulings.fullBoardDraft', skip, defaultContent)).toBe(
      `With all ${n} draft slots full, a player has no Skill draft.`,
    )
    const slots = (k: number) => With((c) => ({ ...c, player: { ...c.player, draftSlots: k } }))
    expect(draftSlotsText(slots(1))).toMatch(/^With the 1 draft slot full, /)
    expect(draftSlotsText(slots(0))).toBe('With 0 draft slots, no player drafts a Skill.')
    expect(replaceSkillText()).toBe('The Skill you replace goes to the bottom of its supply.')
    expect(replaceSkillText('Player 3')).toBe(
      'The Skill Player 3 replaces goes to the bottom of its supply.',
    )
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
    expect(upgradesReachNote(base, defaultContent)).toBe(
      'Build cards can buy only Shop I and Training I',
    )
    expect(upgradesReachNote(any, defaultContent)).toBeNull()
    expect(milestoneOutOfReach('buy-upgrades', any, defaultContent)).toBeNull()
    const two = With((c) => ({ ...c, milestones: { ...c.milestones, upgradesBought: 2 } }))
    expect(milestoneOutOfReach('buy-upgrades', two, defaultContent)).toBeNull()
    const marked = ['buy-upgrades', 'reveal-tiles', `fire-${m.skillFired}`]
    for (const id of milestoneIds(m).filter((i) => !marked.includes(i)))
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

  it('milestones: "Reach level 5" is marked out of reach when the maximum level is lower (18.1)', () => {
    const cap = (maxLevel: number | null) =>
      With((c) => ({ ...c, options: { ...c.options, maxLevel } }))
    const out = 'out of reach: the level stops at 4'
    expect(milestoneOutOfReach('reach-level', cap(4), defaultContent)).toBe(out)
    expect(ruleLineFor('milestones.level', cap(4), defaultContent)).toBe(`Reach level 5 (${out}).`)
    expect(milestoneOutOfReach('reach-level', cap(5), defaultContent)).toBeNull()
    expect(milestoneOutOfReach('reach-level', cap(null), defaultContent)).toBeNull()
  })

  it('milestones: "Fire Arcane Rain" is marked out of reach while Build cards buy only Training I (11.8, row 78)', () => {
    const out =
      'out of reach: a level 3 Skill needs Training III, and Build cards can buy only Training I'
    expect(milestoneOutOfReach('fire-arcane-rain', base, defaultContent)).toBe(out)
    expect(ruleLineFor('milestones.skillFired', base, defaultContent)).toBe(
      `Fire Arcane Rain (${out}).`,
    )
    expect(milestoneOutOfReach('fire-cleave', base, defaultContent)).toBeNull()
    expect(milestoneOutOfReach('fire-strike', base, defaultContent)).toBeNull()
    const any = With((c) => ({ ...c, rulings: { ...c.rulings, buildLevels: 'any' } }))
    expect(milestoneOutOfReach('fire-arcane-rain', any, defaultContent)).toBeNull()
  })

  it('milestones: every kind is always within reach or has a config that puts it out of reach (17)', () => {
    const kind = (id: string) =>
      id.replace(/^survive-round-\d+$/, 'survive-round').replace(/^fire-.+$/, 'fire')
    const always = ['survive-round', 'defeat-elite']
    const out: Record<string, [string, GameConfig]> = {
      fire: ['fire-arcane-rain', base],
      'buy-upgrades': ['buy-upgrades', base],
      'reveal-tiles': ['reveal-tiles', base],
      'reach-level': [
        'reach-level',
        With((c) => ({ ...c, options: { ...c.options, maxLevel: 4 } })),
      ],
    }
    expect([...new Set(milestoneIds(m).map(kind))].sort()).toEqual(
      [...always, ...Object.keys(out)].sort(),
    )
    for (const [id, config] of Object.values(out))
      expect(milestoneOutOfReach(id, config, defaultContent)).toMatch(/^out of reach: /)
    const worst = With((c) => ({ ...c, options: { ...c.options, maxLevel: 1 } }))
    for (const id of milestoneIds(m).filter((i) => always.includes(kind(i))))
      for (const config of [base, worst, ...Object.values(out).map(([, c]) => c)])
        expect(milestoneOutOfReach(id, config, defaultContent)).toBeNull()
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
    expect(line('player.maxHealth')).toBe(startText(base, defaultContent))
    const capped = With((c) => ({ ...c, options: { ...c.options, maxLevel: 4 } }))
    expect(ruleLineFor('options.maxLevel', capped, defaultContent)).toBe(
      levelText(capped, defaultContent),
    )
    expect(ruleLineFor('options.maxLevel', capped, defaultContent)).toMatch(
      /The level stops at 4\.$/,
    )
    expect(line('supplies.copiesPerCard')).toBeNull()
  })
})

describe('Skill effect text', () => {
  it('names what each effect changes: damage, guard, health, enemy hits (Table 3)', () => {
    expect(skillEffectText({ kind: 'heal', amount: 1 }, 'engage')).toBe('Heal 1 health')
    expect(skillEffectText({ kind: 'guard', amount: 2 }, 'engage')).toBe('Gain 2 guard')
  })
})

describe('player copy drops the serial comma', () => {
  /** A comma before the "or" that ends a list: "a Barricade, a Tower, or the base". */
  const SERIAL = /,[^,;:.()]*, or\b/

  it('no ruleText phrase writes ", or"; code comments are not shown', () => {
    const source = fs.readFileSync(new URL('./ruleText.ts', import.meta.url), 'utf-8')
    const code = source
      .split('\n')
      .filter((line) => !/^\s*(?:\/\/|\/\*\*?|\*)/.test(line))
      .filter((line) => SERIAL.test(line))
    expect(code).toEqual([])
    expect(siegeText(defaultContent)).not.toMatch(SERIAL)
    expect(cardStepText(base, 'engage')).not.toMatch(SERIAL)
  })

  it('catches a planted serial comma, not a comma before an "or" clause', () => {
    expect('a Barricade, a Tower, or the base').toMatch(SERIAL)
    expect('Engage (roll), another option, or discard it').toMatch(SERIAL)
    expect('Gather on a spent node, or off any node, still gives materials').not.toMatch(SERIAL)
  })

  it('no proposal label or about text, and no /config label, help or option, writes ", or"', () => {
    const proposals = defaultProposals
      .flatMap((p) => [p.label, p.about])
      .filter((text) => SERIAL.test(text))
    const meta = Object.values(defaultConfigMeta)
      .flatMap((e) => [e.label, e.help ?? '', e.empty ?? '', ...Object.values(e.options ?? {})])
      .filter((text) => SERIAL.test(text))
    expect([...proposals, ...meta]).toEqual([])
  })

  it('the /config deck preset and draft help end their "and" lists without a comma', () => {
    expect(defaultConfigMeta['deck.presets']?.help).toContain(
      'an id, a hand size and its starter cards',
    )
    expect(defaultConfigMeta['draft.everyNRounds']?.help).toContain('rounds 2, 4, 6 and so on.')
    const lists = Object.values(defaultConfigMeta)
      .map((e) => e.help ?? '')
      .filter((text) => /\w+, \w+, and \w+\b/.test(text))
    expect(lists).toEqual([])
  })
})

describe('player copy speaks of the screen, not a tabletop', () => {
  /** Board-game phrasing that does not fit a game played on one screen. */
  const TABLETOP = /\bat the table\b|\bminiatures to place\b/i

  it('catches a planted tabletop phrase', () => {
    expect('when more players sit at the table').toMatch(TABLETOP)
    expect('so there are fewer miniatures to place').toMatch(TABLETOP)
    expect('so fewer enemies are on the map').not.toMatch(TABLETOP)
  })

  it('no proposal label or about text, and no /config label or help, talks of a table', () => {
    const proposals = defaultProposals
      .flatMap((p) => [p.label, p.about])
      .filter((text) => TABLETOP.test(text))
    const meta = Object.values(defaultConfigMeta)
      .flatMap((e) => [e.label, e.help ?? '', e.empty ?? '', ...Object.values(e.options ?? {})])
      .filter((text) => TABLETOP.test(text))
    expect([...proposals, ...meta]).toEqual([])
  })
})
