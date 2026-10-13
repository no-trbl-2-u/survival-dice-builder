import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import type { Assignment, Die } from '../state/types.ts'
import { firedUses, legalPlacements } from './assign.ts'

const skill = (id: string) => defaultContent.skills.find((s) => s.id === id)!
const dice = (...faces: Die['face'][]): Die[] => faces.map((face) => ({ face, kept: false }))

describe('Skill assignment', () => {
  it('7.8 step 6 a die fits a slot of its own face', () => {
    const p = legalPlacements(dice('Sword'), [skill('strike'), skill('shot')], [])
    expect(p).toEqual([{ die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' }])
  })

  it('2.4 a Star fits any slot and counts as that slot face', () => {
    const p = legalPlacements(dice('Star'), [skill('strike'), skill('mend')], [])
    expect(p.map((a) => a.asFace)).toEqual(['Sword', 'Wand'])
  })

  it('2.5 a Blank fits nothing', () => {
    expect(legalPlacements(dice('Blank'), [skill('strike')], [])).toEqual([])
  })

  it('7.8 step 6 each die is used 1 time only', () => {
    const placed: Assignment[] = [{ die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' }]
    expect(
      legalPlacements(dice('Sword'), [skill('strike'), skill('cleave')], placed),
    ).toEqual([])
  })

  it('Spec v2 7.8 step 5 a Skill fires again when dice fill it again (no once-per-engagement option)', () => {
    const placed: Assignment[] = [{ die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' }]
    const p = legalPlacements(dice('Sword', 'Sword'), [skill('strike')], placed)
    expect(p).toEqual([{ die: 1, skill: 'strike', use: 1, slot: 0, asFace: 'Sword' }])
  })

  it('equivalent slots of the same face are offered once', () => {
    const p = legalPlacements(dice('Sword'), [skill('cleave')], [])
    expect(p).toHaveLength(1)
  })

  it('7.8 step 7 only Skills with all their faces fire', () => {
    const placed: Assignment[] = [
      { die: 0, skill: 'cleave', use: 0, slot: 0, asFace: 'Sword' },
      { die: 1, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' },
    ]
    expect(firedUses([skill('strike'), skill('cleave')], placed)).toEqual([
      { skill: 'strike', use: 0 },
    ])
  })
})
