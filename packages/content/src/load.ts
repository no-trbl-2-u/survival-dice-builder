import type { z } from 'zod'
import { configReferenceProblems } from './configRefs.ts'
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

  if (config && cards && skills && tiles)
    for (const p of configReferenceProblems(config, { cards, skills, tiles }))
      errors.push(
        p.file
          ? { file: p.file, path: 'tiles', message: p.message }
          : { file: 'config.default.json', path: formatPath(p.path), message: p.message },
      )

  if (errors.length || !config || !cards || !skills || !enemies || !defenses || !upgrades || !tiles)
    return { ok: false, errors }
  return { ok: true, content: { config, cards, skills, enemies, defenses, upgrades, tiles } }
}
