import type { CardDef } from './schemas/cards.ts'
import type { GameConfig } from './schemas/config.ts'
import type { SkillDef } from './schemas/skills.ts'
import type { TileDef } from './schemas/tiles.ts'

/** One reference problem in a config: the path of the bad value and a plain message. */
export type ConfigRefProblem = Readonly<{
  path: readonly (string | number)[]
  message: string
  /** The content file the problem is really about, when it is not the config. */
  file?: 'tiles.json'
}>

/** The content a config refers to. */
export type ConfigRefContent = Readonly<{
  cards: readonly CardDef[]
  skills: readonly SkillDef[]
  tiles: readonly TileDef[]
}>

/**
 * Every value in a config that the shape check cannot catch but that would break a run: a
 * card, Skill, or deck preset that does not exist, a tile count the tile set cannot fill, a
 * duplicate preset id, and a smallest value above its largest (players, draft keep/reveal).
 * The default config is checked with this at load; /config checks a config with it on save.
 *
 * @rule 1.5, 4.10, 11.9, 18.1
 * @param config - a config that already passed `GameConfigSchema`.
 * @param content - the cards, Skills, and tiles it refers to.
 */
export function configReferenceProblems(
  config: GameConfig,
  content: ConfigRefContent,
): ConfigRefProblem[] {
  const problems: ConfigRefProblem[] = []
  const cardIds = new Set(content.cards.map((c) => c.id))
  const skillIds = new Set(content.skills.map((s) => s.id))

  const presetIds = new Set<string>()
  config.deck.presets.forEach((preset, p) => {
    if (presetIds.has(preset.id))
      problems.push({
        path: ['deck', 'presets', p, 'id'],
        message: `duplicate preset id "${preset.id}"`,
      })
    presetIds.add(preset.id)
    preset.cards.forEach((entry, i) => {
      if (!cardIds.has(entry.card))
        problems.push({
          path: ['deck', 'presets', p, 'cards', i, 'card'],
          message: `unknown card "${entry.card}" (not in cards.json)`,
        })
    })
  })
  if (!presetIds.has(config.deck.preset))
    problems.push({
      path: ['deck', 'preset'],
      message: `no preset with id "${config.deck.preset}"`,
    })

  config.player.starterSkills.forEach((id, i) => {
    if (!skillIds.has(id))
      problems.push({
        path: ['player', 'starterSkills', i],
        message: `unknown Skill "${id}" (not in skills.json)`,
      })
  })
  if (!skillIds.has(config.milestones.skillFired))
    problems.push({
      path: ['milestones', 'skillFired'],
      message: `unknown Skill "${config.milestones.skillFired}" (not in skills.json)`,
    })

  const count = (kind: TileDef['kind']) => content.tiles.filter((t) => t.kind === kind).length
  const tileChecks = [
    ['base', 1, 'exactly 1 base tile', null],
    [
      'countryside',
      config.tiles.countryside,
      `${config.tiles.countryside} countryside tiles`,
      'countryside',
    ],
    ['core', config.tiles.core, `${config.tiles.core} core tiles`, 'core'],
  ] as const
  for (const [kind, want, label, field] of tileChecks)
    if (count(kind) !== want)
      problems.push({
        path: field ? ['tiles', field] : ['tiles'],
        file: 'tiles.json',
        message: `config needs ${label}; the tile set has ${count(kind)}`,
      })

  if (config.players.min > config.players.max)
    problems.push({
      path: ['players', 'min'],
      message: `fewest players (${config.players.min}) is more than most players (${config.players.max})`,
    })
  if (config.draft.keep > config.draft.reveal)
    problems.push({
      path: ['draft', 'keep'],
      message: `keeps ${config.draft.keep} of only ${config.draft.reveal} revealed Skills`,
    })
  return problems
}
