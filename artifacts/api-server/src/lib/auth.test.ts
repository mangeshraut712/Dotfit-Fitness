import { describe, expect, it } from "vitest";
import { bearerToken, tokensMatch } from "./auth";

describe("admin token comparison", () => {
  it("matches identical bearer secrets", () => {
    expect(tokensMatch("correct horse", "correct horse")).toBe(true);
  });

  it("rejects a different secret of another length without throwing", () => {
    expect(tokensMatch("short", "correct horse")).toBe(false);
    expect(tokensMatch("correct horse!", "correct horse")).toBe(false);
  });

  it("reads only a bearer token", () => {
    expect(bearerToken("Bearer secret-value")).toBe("secret-value");
    expect(bearerToken("Basic secret-value")).toBeNull();
    expect(bearerToken(undefined)).toBeNull();
  });
});
