import type { GameState } from '@survival/engine'

/** What one console step did: who stepped, how many actions it applied, how many events it logged. */
export type StepResult = Readonly<{
  by: 'action' | 'bot step' | 'autoplay'
  actions: number
  events: number
}>

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * One short line for the console's status region, so a screen reader hears a summary of the
 * step instead of every log line it added (one Autoplay can add hundreds).
 */
export function stepStatus(step: StepResult, state: GameState): string {
  const where =
    state.phase === 'ended'
      ? `The run ended in round ${state.round}.`
      : `Round ${state.round}, ${state.phase}.`
  if (step.by === 'autoplay') return `Autoplay: ${plural(step.actions, 'action')}. ${where}`
  const who = step.by === 'bot step' ? 'Bot step' : 'Action'
  return `${who}: ${plural(step.events, 'new event')}. ${where}`
}
