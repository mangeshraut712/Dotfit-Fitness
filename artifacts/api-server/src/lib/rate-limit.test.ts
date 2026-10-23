import { afterEach, describe, expect, it } from "vitest";
import { shouldSkipRateLimit } from "./rate-limit";

const original = {
  NODE_ENV: process.env.NODE_ENV,
  ENFORCE_RATE_LIMIT: process.env.ENFORCE_RATE_LIMIT,
};

afterEach(() => {
  process.env.NODE_ENV = original.NODE_ENV;
  if (original.ENFORCE_RATE_LIMIT == null) delete process.env.ENFORCE_RATE_LIMIT;
  else process.env.ENFORCE_RATE_LIMIT = original.ENFORCE_RATE_LIMIT;
});

describe("shouldSkipRateLimit", () => {
  it("does not skip when NODE_ENV is unset", () => {
    delete process.env.NODE_ENV;
    delete process.env.ENFORCE_RATE_LIMIT;
    expect(shouldSkipRateLimit()).toBe(false);
  });

  it("does not skip in production", () => {
    process.env.NODE_ENV = "production";
    expect(shouldSkipRateLimit()).toBe(false);
  });

  it("skips during tests unless enforcement is requested", () => {
    process.env.NODE_ENV = "test";
    delete process.env.ENFORCE_RATE_LIMIT;
    expect(shouldSkipRateLimit()).toBe(true);
    process.env.ENFORCE_RATE_LIMIT = "1";
    expect(shouldSkipRateLimit()).toBe(false);
  });
});
