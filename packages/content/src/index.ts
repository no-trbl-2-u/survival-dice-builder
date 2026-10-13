/**
 * @survival/content — game content and every rule number, as JSON validated by Zod.
 * No rule number lives in code: the engine reads them from `Content.config`.
 */
export const CONTENT_VERSION = 'spec-v1-issue-006-draft'

export { defaultContent, defaultRawContent } from './content.ts'
export {
  formatContentError,
  loadContent,
  type Content,
  type ContentError,
  type LoadResult,
  type RawContent,
} from './load.ts'
export { CardDefSchema, type CardDef, type DeckEntry } from './schemas/cards.ts'
export { GameConfigSchema, type GameConfig } from './schemas/config.ts'
export { withConfigDefaults } from './configDefaults.ts'
export {
  configReferenceProblems,
  type ConfigRefContent,
  type ConfigRefProblem,
} from './configRefs.ts'
export type { CombatEffect, CombatOption, PrepareEffect, SkillEffect } from './schemas/effects.ts'
export { EnemyDefSchema, type EnemiesFile, type EnemyDef } from './schemas/enemies.ts'
export {
  FaceSchema,
  SkillFaceSchema,
  type Face,
  type Level,
  type SkillFace,
} from './schemas/primitives.ts'
export { SkillDefSchema, type SkillDef } from './schemas/skills.ts'
export type { DefenseDef, UpgradeDef } from './schemas/structures.ts'
export {
  IMPASSABLE,
  TileDefSchema,
  type Site,
  type Terrain,
  type TileDef,
  type TileHex,
  type TileKind,
} from './schemas/tiles.ts'
export {
  combatModelLine,
  combatModelNote,
  combatModelTag,
  decidedDate,
  decisionsMarkdown,
  flagSettings,
  openQuestions,
  parseQuestions,
  parseUserCalls,
  RECENT_DATES,
  recentDecisions,
  settingsCombatModel,
  statusLabel,
  type FlagSetting,
  type QuestionRow,
  type UserCall,
} from './decisions.ts'
export {
  configMetaPaths,
  configMetaProblems,
  defaultConfigMeta,
  metaFor,
  type ConfigMetaPath,
} from './configMeta.ts'
export { ConfigMetaSchema, type ConfigMeta, type ConfigMetaEntry } from './schemas/configMeta.ts'
export {
  cardStepText,
  combatEndText,
  combatText,
  enemyHitText,
  draftFullText,
  draftPoolText,
  draftTitle,
  gatherText,
  goalText,
  knockoutText,
  levelText,
  milestoneIds,
  milestoneLabel,
  miniatureLimitText,
  playersText,
  returnStarterText,
  revealText,
  ruleCitation,
  ruleLineFor,
  shopText,
  siegeText,
  spawnText,
  targetOrderText,
  trainingText,
} from './ruleText.ts'
export {
  parseSpec,
  plainRuleText,
  rowsFor,
  SPEC_V2_SIGNED,
  rulesAsPlayed,
  rulesAsPlayedMarkdown,
  type PlayStatus,
  type RuleAsPlayed,
  type SpecRule,
  type SpecSection,
} from './rulesAsPlayed.ts'
export { fillKit, KIT_BLOCKS, kitBlock, surveyQuestions, type KitFile } from './playtestKit.ts'
export {
  CONFIG_HISTORY,
  CONFIG_VERSION,
  changedFields,
  defaultsAt,
  migrateConfig,
  type ConfigStep,
} from './configVersions.ts'
export {
  adviceText,
  applyProposal,
  defaultProposals,
  measuredText,
  proposalForRow,
  proposalProblems,
  proposalsIn,
  withProposal,
} from './proposals.ts'
export {
  ProposalSchema,
  ProposalsFileSchema,
  type Measured,
  type Proposal,
} from './schemas/proposals.ts'
