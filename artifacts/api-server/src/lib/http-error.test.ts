import { describe, expect, it } from "vitest";
import { clientErrorMessage, clientErrorStatus } from "./http-error";

describe("client error mapping", () => {
  it("turns malformed JSON into a 400 instead of a 500", () => {
    const err = new SyntaxError("Unexpected token");
    expect(clientErrorStatus(err)).toBe(400);
    expect(clientErrorMessage(400)).toBe("Invalid JSON");
  });

  it("turns an oversized body into a 413", () => {
    expect(clientErrorStatus({ type: "entity.too.large", status: 413 })).toBe(413);
    expect(clientErrorMessage(413)).toBe("Request body is too large");
  });

  it("leaves unknown failures unclassified", () => {
    expect(clientErrorStatus(new Error("db down"))).toBeNull();
  });
});
