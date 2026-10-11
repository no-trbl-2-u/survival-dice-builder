/** Set at build time by `vite.config.ts`. */
declare const __APP_COMMIT__: string | undefined
declare const __APP_VERSION__: string | undefined

/** The commit this build is from, or "unknown". */
export const APP_COMMIT: string = typeof __APP_COMMIT__ === 'string' ? __APP_COMMIT__ : 'unknown'

/** The release version (root `package.json`), or "unknown". */
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'unknown'
