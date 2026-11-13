import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** A recording stand-in for the Web Audio API: notes are oscillators started at a time. */
function fakeAudio(state: 'running' | 'suspended' = 'running') {
  const log = { contexts: 0, resumed: 0, starts: [] as number[], waves: [] as string[] }
  const param = () => ({ setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() })
  class FakeContext {
    state = state
    currentTime = 10
    destination = {}
    constructor() {
      log.contexts += 1
    }
    resume() {
      log.resumed += 1
      return Promise.resolve()
    }
    createGain() {
      return { gain: param(), connect: (to: unknown) => to }
    }
    createOscillator() {
      const osc = {
        type: '',
        frequency: param(),
        connect: (to: unknown) => to,
        start: (at: number) => {
          log.starts.push(at)
          log.waves.push(osc.type)
        },
        stop: vi.fn(),
      }
      return osc
    }
  }
  return { log, FakeContext }
}

/** A fresh copy of the module, so its shared audio context starts empty. */
async function loadSound() {
  vi.resetModules()
  return import('./sound.ts')
}

describe('sound play', () => {
  beforeEach(() => vi.unstubAllGlobals())
  afterEach(() => vi.unstubAllGlobals())

  it('does nothing without Web Audio', async () => {
    vi.stubGlobal('AudioContext', undefined)
    const { play } = await loadSound()
    expect(() => play(['roll', 'hit'])).not.toThrow()
  })

  it('makes no audio context for an empty cue list', async () => {
    const { log, FakeContext } = fakeAudio()
    vi.stubGlobal('AudioContext', FakeContext)
    const { play } = await loadSound()
    play([])
    expect(log.contexts).toBe(0)
  })

  it('plays 1 oscillator per note, each cue 0.05 s after the one before', async () => {
    const { log, FakeContext } = fakeAudio()
    vi.stubGlobal('AudioContext', FakeContext)
    const { play, VOICES } = await loadSound()
    play(['card', 'build'])
    expect(log.starts).toHaveLength(VOICES.card.length + VOICES.build.length)
    expect(log.starts[0]).toBeCloseTo(10)
    expect(log.starts[1]).toBeCloseTo(10.05)
    expect(log.starts[2]).toBeCloseTo(10 + 0.08 + 0.05)
    expect(log.waves).toEqual(['triangle', 'triangle', 'triangle'])
    expect(log.resumed).toBe(0)
  })

  it('resumes a suspended context and keeps 1 context across calls', async () => {
    const { log, FakeContext } = fakeAudio('suspended')
    vi.stubGlobal('AudioContext', FakeContext)
    const { play } = await loadSound()
    play(['hit'])
    play(['hurt'])
    expect(log.contexts).toBe(1)
    expect(log.resumed).toBe(2)
  })
})
