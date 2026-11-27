import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("replit.md matches the API", () => {
  const doc = readFileSync(new URL("../../../../replit.md", import.meta.url), "utf8");

  it("describes fail-closed admin auth and the real CORS allowlist", () => {
    expect(doc).toContain("return 503 when `ADMIN_PASSWORD` is unset");
    expect(doc).toContain("They are never open.");
    expect(doc).not.toContain("endpoints are open");
    expect(doc).toContain("https://dotfitfitness.in");
    expect(doc).toContain("https://www.dotfitfitness.in");
    expect(doc).toContain("http://localhost:3000");
    expect(doc).toContain("DELETE");
    expect(doc).not.toContain("*.replit.app");
    expect(doc).not.toContain("wildcard");
  });

  it("records the brand green and the Vite base placeholder", () => {
    expect(doc).toContain("#5c7e20");
    expect(doc).not.toContain("#6aaa14");
    expect(doc).toContain("`%BASE_URL%favicon.svg`");
    expect(doc).not.toContain("%BASE_URLfavicon.svg");
  });
});
