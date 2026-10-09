import { defaultContent, type GameConfig } from '@survival/content'

/**
 * The default config with Combat played as exchanges (Spec v1 7.8). Engagements are the default
 * since phase 23 (designer 2026-10-09); tests that walk the exchange steps use this config.
 */
export const exchangeConfig: GameConfig = {
  ...defaultContent.config,
  combat: { ...defaultContent.config.combat, model: 'exchange' },
}
