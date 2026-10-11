/** Set at build time by `vite.config.ts`. */
declare const __APP_COMMIT__: string | undefined

/** The commit this build is from, or "unknown". */
export const APP_COMMIT: string = typeof __APP_COMMIT__ === 'string' ? __APP_COMMIT__ : 'unknown'
