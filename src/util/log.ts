/**
 * Structured console logging (ENGINEERING_PRACTICES: no silent failures;
 * fallback paths log which path ran). Never log tokens or record contents.
 */

type Ctx = Record<string, unknown>;

export const log = {
  info(scope: string, message: string, ctx?: Ctx): void {
    console.info(`[${scope}] ${message}`, ctx ?? '');
  },
  warn(scope: string, message: string, ctx?: Ctx): void {
    console.warn(`[${scope}] ${message}`, ctx ?? '');
  },
  error(scope: string, message: string, ctx?: Ctx): void {
    console.error(`[${scope}] ${message}`, ctx ?? '');
  },
};
