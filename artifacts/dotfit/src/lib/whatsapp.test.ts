import { describe, expect, it } from "vitest";
import { whatsappNumber } from "./whatsapp";

describe("whatsappNumber", () => {
  it("adds 91 to a 10-digit mobile that itself starts with 91", () => {
    expect(whatsappNumber("9123456789")).toBe("919123456789");
  });

  it("keeps a number that already has the 91 country code", () => {
    expect(whatsappNumber("+91 95272 37213")).toBe("919527237213");
  });

  it("drops a leading trunk zero before adding the country code", () => {
    expect(whatsappNumber("09527237213")).toBe("919527237213");
  });

  it("does not prefix 91 to another country's number", () => {
    expect(whatsappNumber("+1 415 555 0132")).toBe("14155550132");
  });
});
