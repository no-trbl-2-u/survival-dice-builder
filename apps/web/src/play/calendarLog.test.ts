import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const line = (event: object) =>
  describeEvent({ type: 'calendarDay', rule: '7.3', ...event } as never, {
    content: defaultContent,
    config: defaultContent.config,
  })

describe('Event Calendar text in the log (rule 7.3, Event Calendar experiment)', () => {
  it('gives units, plurals, capitals and the elite spawn node count', () => {
    expect(
      line({
        system: 'notoriety',
        day: 'notoriety rung 3',
        grunts: 2,
        elites: 2,
        extraElites: 2,
        boons: ['respite'],
        faces: [],
      }),
    ).toBe(
      'Event Calendar: Notoriety rung 3. Each spawn node spawns 2 enemies; each elite spawn node spawns 2 elites. 2 extra elites at the spawn node nearest the base. Boon: Respite.',
    )
  })

  it('uses the singular and capitalises the threat dice and both boons', () => {
    expect(
      line({
        system: 'threatDice',
        day: 'threat dice',
        grunts: 1,
        elites: 1,
        extraElites: 1,
        boons: ['respite', 'harvest'],
        faces: ['raid', 'elite', 'boon', 'boon'],
      }),
    ).toBe(
      'Event Calendar: Threat dice. Threat dice: Raid, Elite, Boon, Boon. Each spawn node spawns 1 enemy; each elite spawn node spawns 1 elite. 1 extra elite at the spawn node nearest the base. Boon: Respite and Harvest.',
    )
  })

  it('says 0 enemies on a quiet day', () => {
    expect(
      line({
        system: 'sundial',
        day: 'Dawn',
        grunts: 0,
        elites: 0,
        extraElites: 0,
        boons: [],
        faces: [],
      }),
    ).toBe(
      'Event Calendar: Dawn. Each spawn node spawns 0 enemies; each elite spawn node spawns 0 elites.',
    )
  })
})
