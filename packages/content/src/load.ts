import type { z } from 'zod'
import { CardsFileSchema, type CardDef } from './schemas/cards.ts'
import { GameConfigSchema, type GameConfig } from './schemas/config.ts'
import { EnemiesFileSchema, type EnemiesFile } from './schemas/enemies.ts'
import { SkillsFileSchema, type SkillDef } from './schemas/skills.ts'
import {
  DefensesFileSchema,
  UpgradesFileSchema,
  type DefenseDef,
  type UpgradeDef,
} from './schemas/structures.ts'
import { TilesFileSchema, type TileDef } from './schemas/tiles.ts'

/** The raw JSON of every content file, keyed by file name. */
export type RawContent = {
  'config.default.json': unknown
  'cards.json': unknown
  'skills.json': unknown
  'enemies.json': unknown
  'defenses.json': unknown
  'upgrades.json': unknown
  'tiles.json': unknown
}

/** All validated game content. */
export type Content = Readonly<{
  config: GameConfig
  cards: readonly CardDef[]
  skills: readonly SkillDef[]
  enemies: EnemiesFile
  defenses: readonly DefenseDef[]
  upgrades: readonly UpgradeDef[]
  tiles: readonly TileDef[]
}>

/** One validation problem: the file, the field path inside it, and a plain message. */
export type ContentError = Readonly<{ file: keyof RawContent; path: string; message: string }>

/** Result of `loadContent`. */
export type LoadResult =
  { ok: true; content: Content } | { ok: false; errors: readonly ContentError[] }

/** Formats an error as `file: path: message` (path omitted when it is the file root). */
export function formatContentError(e: ContentError): string {
  return e.path ? `${e.file}: ${e.path}: ${e.message}` : `${e.file}: ${e.message}`
}

/** Turns a Zod path like `["skills", 3, "faces"]` into `skills[3].faces`. */
function formatPath(path: readonly PropertyKey[]): string {
  return path
    .map((p, i) => (typeof p === 'number' ? `[${p}]` : i === 0 ? String(p) : `.${String(p)}`))
    .join('')
}

function parse<S extends z.ZodType>(
  file: keyof RawContent,
  schema: S,
  raw: unknown,
  errors: ContentError[],
): z.infer<S> | undefined {
  const result = schema.safeParse(raw)
  if (result.success) return result.data
  for (const issue of result.error.issues) {
    errors.push({ file, path: formatPath(issue.path), message: issue.message })
  }
  return undefined
}

/** Reports an error when ids repeat inside one file. */
function checkUniqueIds(
  file: keyof RawContent,
  key: string,
  items: readonly { id: string }[],
  errors: ContentError[],
): void {
  const seen = new Set<string>()
  items.forEach((item, i) => {
    if (seen.has(item.id))
      errors.push({ file, path: `${key}[${i}].id`, message: `duplicate id "${item.id}"` })
    seen.add(item.id)
  })
}

/**
 * Validates every content file, then the references between files (deck cards exist, starter
 * Skills exist, tile counts match the config). Reports every error, not just the first, each
 * with its file and field path.
 *
 * @param raw - the parsed JSON of each content file.
 * @returns the validated content, or every error found.
 */
export function loadContent(raw: RawContent): LoadResult {
  const errors: ContentError[] = []
  const config = parse('config.default.json', GameConfigSchema, raw['config.default.json'], errors)
  const cards = parse('cards.json', CardsFileSchema, raw['cards.json'], errors)?.cards
  const skills = parse('skills.json', SkillsFileSchema, raw['skills.json'], errors)?.skills
  const enemies = parse('enemies.json', EnemiesFileSchema, raw['enemies.json'], errors)
  const defenses = parse(
    'defenses.json',
    DefensesFileSchema,
    raw['defenses.json'],
    errors,
  )?.defenses
  const upgrades = parse(
    'upgrades.json',
    UpgradesFileSchema,
    raw['upgrades.json'],
    errors,
  )?.upgrades
  const tiles = parse('tiles.json', TilesFileSchema, raw['tiles.json'], errors)?.tiles

  if (cards) checkUniqueIds('cards.json', 'cards', cards, errors)
  if (skills) checkUniqueIds('skills.json', 'skills', skills, errors)
  if (tiles) checkUniqueIds('tiles.json', 'tiles', tiles, errors)

  if (config && cards) {
    const cardIds = new Set(cards.map((c) => c.id))
    config.deck.presets.forEach((preset, p) =>
      preset.cards.forEach((entry, i) => {
        if (!cardIds.has(entry.card))
          errors.push({
            file: 'config.default.json',
            path: `deck.presets[${p}].cards[${i}].card`,
            message: `unknown card "${entry.card}" (not in cards.json)`,
          })
      }),
    )
    if (!config.deck.presets.some((p) => p.id === config.deck.preset))
      errors.push({
        file: 'config.default.json',
        path: 'deck.preset',
        message: `no preset with id "${config.deck.preset}"`,
      })
  }

  if (config && skills) {
    const skillIds = new Set(skills.map((s) => s.id))
    const refs = [
      ...config.player.starterSkills.map((id, i) => [`player.starterSkills[${i}]`, id] as const),
      ['milestones.skillFired', config.milestones.skillFired] as const,
    ]
    for (const [path, id] of refs)
      if (!skillIds.has(id))
        errors.push({
          file: 'config.default.json',
          path,
          message: `unknown Skill "${id}" (not in skills.json)`,
        })
  }

  if (config && tiles) {
    const count = (kind: TileDef['kind']) => tiles.filter((t) => t.kind === kind).length
    const checks = [
      ['base', 1, 'exactly 1 base tile'],
      ['countryside', config.tiles.countryside, `${config.tiles.countryside} countryside tiles`],
      ['core', config.tiles.core, `${config.tiles.core} core tiles`],
    ] as const
    for (const [kind, want, label] of checks)
      if (count(kind) !== want)
        errors.push({
          file: 'tiles.json',
          path: 'tiles',
          message: `config needs ${label}; found ${count(kind)}`,
        })
  }

  if (errors.length || !config || !cards || !skills || !enemies || !defenses || !upgrades || !tiles)
    return { ok: false, errors }
  return { ok: true, content: { config, cards, skills, enemies, defenses, upgrades, tiles } }
}
