import type { Cue } from './cues.ts'

/** A synthesized note: oscillator type, start and end pitch (Hz), length (s), delay (s). */
type Note = Readonly<{
  wave: OscillatorType
  from: number
  to: number
  length: number
  at?: number
}>

/** Each cue as 1-3 short notes (no audio files, nothing to download or credit). */
export const VOICES: Readonly<Record<Cue, readonly Note[]>> = {
  roll: [
    { wave: 'square', from: 520, to: 380, length: 0.04 },
    { wave: 'square', from: 480, to: 340, length: 0.04, at: 0.06 },
    { wave: 'square', from: 440, to: 300, length: 0.05, at: 0.12 },
  ],
  card: [{ wave: 'triangle', from: 700, to: 900, length: 0.08 }],
  hit: [{ wave: 'sawtooth', from: 300, to: 120, length: 0.1 }],
  hurt: [{ wave: 'sawtooth', from: 200, to: 70, length: 0.18 }],
  defeat: [
    { wave: 'triangle', from: 400, to: 200, length: 0.1 },
    { wave: 'triangle', from: 300, to: 100, length: 0.15, at: 0.1 },
  ],
  tower: [{ wave: 'square', from: 900, to: 300, length: 0.09 }],
  build: [
    { wave: 'triangle', from: 260, to: 260, length: 0.06 },
    { wave: 'triangle', from: 390, to: 390, length: 0.08, at: 0.08 },
  ],
  base: [{ wave: 'sawtooth', from: 120, to: 60, length: 0.25 }],
  tile: [{ wave: 'sine', from: 330, to: 440, length: 0.12 }],
  levelUp: [
    { wave: 'triangle', from: 523, to: 523, length: 0.1 },
    { wave: 'triangle', from: 659, to: 659, length: 0.1, at: 0.1 },
    { wave: 'triangle', from: 784, to: 784, length: 0.18, at: 0.2 },
  ],
  end: [
    { wave: 'sine', from: 392, to: 392, length: 0.2 },
    { wave: 'sine', from: 311, to: 311, length: 0.35, at: 0.22 },
  ],
}

/** Master volume (0-1): quiet, a table game is not an arcade. */
const VOLUME = 0.12

let context: AudioContext | null = null

/** The shared audio context, created on first use (after a user gesture). Null without audio. */
function audio(): AudioContext | null {
  if (context) return context
  const Ctor = typeof window === 'undefined' ? undefined : window.AudioContext
  if (!Ctor) return null
  context = new Ctor()
  return context
}

/** Plays cues now. Safe to call anywhere: without Web Audio it does nothing. */
export function play(cues: readonly Cue[]): void {
  if (cues.length === 0) return
  const ctx = audio()
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()
  cues.forEach((cue, i) => {
    for (const n of VOICES[cue]) {
      const start = ctx.currentTime + (n.at ?? 0) + i * 0.05
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = n.wave
      osc.frequency.setValueAtTime(n.from, start)
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, n.to), start + n.length)
      gain.gain.setValueAtTime(VOLUME, start)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + n.length)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + n.length + 0.02)
    }
  })
}
