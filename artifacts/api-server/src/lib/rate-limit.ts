/**
 * Rate limits apply in production and whenever NODE_ENV is unset.
 * Tests opt out unless ENFORCE_RATE_LIMIT=1, so a missing NODE_ENV
 * cannot silently disable abuse protection.
 */
export function shouldSkipRateLimit(): boolean {
  if (process.env.ENFORCE_RATE_LIMIT === "1") return false;
  const env = process.env.NODE_ENV;
  return env === "development" || env === "test";
}
