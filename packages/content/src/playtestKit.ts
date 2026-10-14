import {
  combatText,
  draftPoolText,
  gatherText,
  goalText,
  knockoutText,
  revealText,
  spawnText,
  targetText,
} from './ruleText.ts'
import type { Content } from './load.ts'
import type { GameConfig } from './schemas/config.ts'

/**
 * The rule lines of the playtest kit (`docs/playtests/PROTOCOL.md`, `SURVEY.md`, `REPORT.md`),
 * built from config through `ruleText` so the kit teaches the game the engine runs. The prose
 * around them stays hand-written; these blocks sit between `<!-- kit:<name> -->` markers.
 * Pure: no I/O.
 */

/** The generated block names, by kit file. */
export const KIT_BLOCKS = {
  'PROTOCOL.md': ['teach'],
  'SURVEY.md': ['questions', 'answers'],
  'REPORT.md': ['bot', 'survey-summary'],
} as const

export type KitFile = keyof typeof KIT_BLOCKS

/** The default deck preset: card count and hand size. */
function deckOf(config: GameConfig): { cards: number; hand: number } {
  const preset = config.deck.presets.find((p) => p.id === config.deck.preset)
  const cards = preset ? preset.cards.reduce((n, c) => n + c.quantity, 0) : config.deck.minimumSize
  return { cards, hand: preset?.handSize ?? 5 }
}

/** One survey question: the rating label the answer block and the report reuse. */
type Question = Readonly<{ text: string; answer: string; label: string; rated: boolean }>

/** The survey, in order. Rule-dependent items read config. */
export function surveyQuestions(config: GameConfig): Question[] {
  const { cards, hand } = deckOf(config)
  const engage = config.combat.model === 'engage'
  return [
    {
      text: 'The trip out to gather and back to the base felt **tense** (not tedious).',
      answer: '1-5 + one line',
      label: 'Base trip tense',
      rated: true,
    },
    {
      text: `The ${cards}-card deck with a hand of ${hand} gave a good number of turns in each phase.`,
      answer: '1-5 + one line',
      label: 'Deck and hand right',
      rated: true,
    },
    {
      text: 'Stepping off the edge to reveal a tile was a real choice: I weighed the new enemies against what I could gather.',
      answer: '1-5 + one line',
      label: 'Reveal a real choice',
      rated: true,
    },
    {
      text: 'Single-use gathering nodes pushed me out to new tiles at a good pace.',
      answer: '1-5 + one line',
      label: 'Nodes pace right',
      rated: true,
    },
    engage
      ? {
          text: 'Engagements were a good gamble: I chose where to engage from, and the enemy dice felt fair.',
          answer: '1-5 + one line',
          label: 'Engagements fair',
          rated: true,
        }
      : {
          text: 'Exchanges were fair: I saw the enemy attacks coming.',
          answer: '1-5 + one line',
          label: 'Exchanges fair',
          rated: true,
        },
    {
      text: 'Which Skill felt best? Which felt useless?',
      answer: 'one line each',
      label: '',
      rated: false,
    },
    {
      text: 'Rolling and keeping dice was fun, not fiddly.',
      answer: '1-5',
      label: 'Dice fun',
      rated: true,
    },
    {
      text: 'I always knew what I could do next.',
      answer: '1-5 + the moment you did not',
      label: 'Knew what to do',
      rated: true,
    },
    {
      text: 'A knockout felt like a setback I could recover from, not the end.',
      answer: '1-5 + one line',
      label: 'Knockout fair',
      rated: true,
    },
    { text: 'Which rule confused you, and when?', answer: 'one line', label: '', rated: false },
    { text: 'The run was the right length.', answer: '1-5', label: 'Length right', rated: true },
    {
      text: "Co-op only: turns moved at a good pace, and I had real choices on other players' turns.",
      answer: '1-5 + one line',
      label: 'Co-op pace',
      rated: true,
    },
    { text: 'I would play again tomorrow.', answer: '1-5', label: 'Play again', rated: true },
    { text: 'The one thing you would change.', answer: 'one line', label: '', rated: false },
  ]
}

/** The Gather amount of the default deck's first Gather card. */
function starterGather(content: Content): number {
  const preset = content.config.deck.presets.find((p) => p.id === content.config.deck.preset)
  for (const entry of preset?.cards ?? []) {
    const top = content.cards.find((c) => c.id === entry.card)?.top
    if (top?.kind === 'gather') return top.amount
  }
  return 0
}

/** The PROTOCOL teach list. */
function teach(content: Content): string[] {
  const config = content.config
  const { cards, hand } = deckOf(config)
  return [
    `- ${goalText()}`,
    `- Your ${cards}-card deck is played twice each round: top halves in Prepare, then bottom halves in Combat. Draw ${hand} at a time.`,
    `- ${revealText(config)} ${spawnText(config)} ${targetText(config)}`,
    `- ${gatherText(starterGather(content), config)}. Each node gives materials once.`,
    `- Combat: ${combatText(config, config.combat.model, content)}`,
    `- ${knockoutText(config)}`,
    `- Every ${config.draft.everyNRounds} rounds, once the Training Ground is open, each player drafts a Skill. ${draftPoolText(config)}`,
  ]
}

function questionsTable(qs: readonly Question[]): string[] {
  return [
    '| # | Question | Answer |',
    '| --- | --- | --- |',
    ...qs.map((q, i) => `| ${i + 1} | ${q.text} | ${q.answer} |`),
  ]
}

function answerBlock(qs: readonly Question[]): string[] {
  const lines = qs.map((q, i) => {
    const n = `${i + 1} `
    if (q.label)
      return (
        `${n}${q.label.toLowerCase()}:`.padEnd(24) + (q.answer === '1-5' ? '_ / 5' : '_ / 5  ...')
      )
    if (q.text.startsWith('Which Skill')) return `${n}best skill: ...       useless skill: ...`
    if (q.text.startsWith('Which rule')) return `${n}confusing rule: ...`
    return `${n}change: ...`
  })
  return [
    '```text',
    'session: YYYY-MM-DD-<who>   seed: <n>   players: <n>   teach: <m:ss>',
    ...lines,
    '```',
  ]
}

function surveySummary(qs: readonly Question[]): string[] {
  return [
    '| Question | Median (1-5) | Notable answers |',
    '| --- | --- | --- |',
    ...qs.filter((q) => q.rated).map((q) => `| ${q.label} | | |`),
  ]
}

/** The body of one generated block. */
export function kitBlock(name: string, content: Content): string {
  const qs = surveyQuestions(content.config)
  switch (name) {
    case 'teach':
      return teach(content).join('\n')
    case 'questions':
      return questionsTable(qs).join('\n')
    case 'answers':
      return answerBlock(qs).join('\n')
    case 'bot':
      return 'Bot baseline (median end round): run the default batch with `pnpm sim -- --runs 200`; the pinned summary is in `tools/sim/src/run.test.ts`.'
    case 'survey-summary':
      return surveySummary(qs).join('\n')
    default:
      throw new Error(`unknown kit block: ${name}`)
  }
}

/**
 * Replaces each `<!-- kit:<name> -->` ... `<!-- /kit:<name> -->` block of a kit file with its
 * generated body. Throws when a marker pair is missing, so a hand edit cannot drop one.
 */
export function fillKit(file: KitFile, text: string, content: Content): string {
  let out = text.replace(/\r\n/g, '\n')
  for (const name of KIT_BLOCKS[file]) {
    const open = `<!-- kit:${name} -->`
    const close = `<!-- /kit:${name} -->`
    const a = out.indexOf(open)
    const b = out.indexOf(close)
    if (a === -1 || b === -1 || b < a) throw new Error(`${file}: missing the ${open} block`)
    out = `${out.slice(0, a + open.length)}\n${kitBlock(name, content)}\n${out.slice(b)}`
  }
  return out
}
