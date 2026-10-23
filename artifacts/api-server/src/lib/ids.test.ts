import { describe, expect, it } from "vitest";
import { parsePositiveIntParam } from "./ids";

describe("parsePositiveIntParam", () => {
  it("accepts a canonical positive integer", () => {
    expect(parsePositiveIntParam("12")).toBe(12);
    expect(parsePositiveIntParam(["7"])).toBe(7);
  });

  it("rejects partial, decimal, exponent, zero, and negative ids", () => {
    expect(parsePositiveIntParam("12abc")).toBeNull();
    expect(parsePositiveIntParam("1.5")).toBeNull();
    expect(parsePositiveIntParam("1e2")).toBeNull();
    expect(parsePositiveIntParam("0")).toBeNull();
    expect(parsePositiveIntParam("-3")).toBeNull();
    expect(parsePositiveIntParam(" 4")).toBeNull();
  });
});
