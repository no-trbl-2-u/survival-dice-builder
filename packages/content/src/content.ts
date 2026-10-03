import cards from '../data/cards.json'
import config from '../data/config.default.json'
import defenses from '../data/defenses.json'
import enemies from '../data/enemies.json'
import skills from '../data/skills.json'
import tiles from '../data/tiles.json'
import upgrades from '../data/upgrades.json'
import { formatContentError, loadContent, type Content, type RawContent } from './load.ts'

/** The raw default content files, before validation. Tests copy and edit this. */
export const defaultRawContent: RawContent = {
  'config.default.json': config,
  'cards.json': cards,
  'skills.json': skills,
  'enemies.json': enemies,
  'defenses.json': defenses,
  'upgrades.json': upgrades,
  'tiles.json': tiles,
}

/** Validates the default content at startup; throws with every error if any file is invalid. */
function loadDefault(): Content {
  const result = loadContent(defaultRawContent)
  if (!result.ok) {
    throw new Error(
      `Invalid game content:\n${result.errors.map((e) => `  - ${formatContentError(e)}`).join('\n')}`,
    )
  }
  return result.content
}

/** The validated default content (Spec v1, Issue 006 draft). */
export const defaultContent: Content = loadDefault()
