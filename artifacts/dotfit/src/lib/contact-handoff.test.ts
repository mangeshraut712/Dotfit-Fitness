import { describe, expect, it } from "vitest";
import { contactApiErrorMessage, whatsappHandoffUrl } from "./contact-handoff";

describe("contact API errors", () => {
  it("prefers a field error over the generic message", () => {
    expect(
      contactApiErrorMessage({
        error: "Invalid request body",
        details: { phone: ["Enter a valid phone number"] },
      }),
    ).toBe("Enter a valid phone number");
  });

  it("uses the API error when there are no field details", () => {
    expect(contactApiErrorMessage({ error: "Too many submissions. Please try again later." })).toBe(
      "Too many submissions. Please try again later.",
    );
  });

  it("returns null for an HTML or empty failure", () => {
    expect(contactApiErrorMessage(null)).toBeNull();
    expect(contactApiErrorMessage("405 Not Allowed")).toBeNull();
  });
});

describe("WhatsApp handoff", () => {
  it("includes the lead and skips a blank note", () => {
    const url = whatsappHandoffUrl({
      name: "Asha Patil",
      phone: "9527237213",
      email: "asha@example.com",
      plan: "Free Trial",
      message: "   ",
    });
    const text = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(url.startsWith("https://wa.me/919527237213?text=")).toBe(true);
    expect(text).toContain("Name: Asha Patil");
    expect(text).toContain("Plan: Free Trial");
    expect(text).not.toContain("Note:");
  });
});
