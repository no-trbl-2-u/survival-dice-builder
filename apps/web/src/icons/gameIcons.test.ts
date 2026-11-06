import { defaultContent, FaceSchema } from '@survival/content'
import type { EnemyFace } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { faceIcon, gameIcons, SITE_ICON } from './gameIcons.ts'

// Every face the enemy dice roll; the record makes a new face a type error here.
const ENEMY_FACES = Object.keys({ hit: 0, miss: 0, special: 0 } satisfies Record<EnemyFace, 0>)

// The icons the panels name directly (BasePanel, PlayerPanel, EngagementModal).
const PANEL_ICONS = ['base', 'health', 'guard', 'materials', 'currency', 'experience']

describe('gameIcons', () => {
  // A name with no file draws nothing (the lookups fall back to empty markup), so a missing
  // icon would leave a blank die face or an invisible piece on the map. The blank and miss
  // faces are files with no shapes, so presence is checked, not content.
  const named = (names: readonly string[]) => names.filter((n) => !(n in gameIcons))

  it('has a face for every action die face and every enemy die face', () => {
    expect(named(FaceSchema.options.map(faceIcon))).toEqual([])
    expect(named(ENEMY_FACES.map((f) => `face-enemy-${f}`))).toEqual([])
  })

  it('has an icon for every enemy and defense in the content, which the map draws by id', () => {
    expect(named(defaultContent.enemies.enemies.map((e) => e.id))).toEqual([])
    expect(named(defaultContent.defenses.map((d) => d.id))).toEqual([])
  })

  it('has an icon for every printed site and every panel icon', () => {
    expect(named(Object.values(SITE_ICON))).toEqual([])
    expect(named(PANEL_ICONS)).toEqual([])
  })

  it('keeps only the shapes of each file, without the svg wrapper', () => {
    for (const markup of Object.values(gameIcons)) expect(markup).not.toMatch(/<\/?svg/)
    expect(gameIcons['face-blank']).toBe('')
  })
})
