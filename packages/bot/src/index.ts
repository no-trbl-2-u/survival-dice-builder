/**
 * @survival/bot — a deterministic autoplay policy over `legalActions`, for tests, batch runs
 * (`tools/sim`), and the `/debug` Autoplay button. A floor, not a skilled player.
 */
export { botChoice, type BotOptions } from './policy.ts'
export { goal, type BotPolicy } from './goals.ts'
