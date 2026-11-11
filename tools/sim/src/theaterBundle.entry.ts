import { defaultContent, GameConfigSchema, withConfigDefaults } from '@survival/content'
import { playRun, summarize } from './run.ts'
import { playTheater } from './theater.ts'

/** Browser entry for the Run Theater page: the real engine, bot and config schema as `SDB`. */
export { defaultContent, GameConfigSchema, playRun, playTheater, summarize, withConfigDefaults }
