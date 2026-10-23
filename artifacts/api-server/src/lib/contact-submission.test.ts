import { describe, expect, it } from "vitest";
import { contactSubmissionSchema, isValidPhone, normalizeContactMessage } from "@workspace/api-zod";

const valid = {
  name: "Asha Patil",
  phone: "+91 95272 37213",
  email: "asha@example.com",
  plan: "Free Trial",
  message: "Morning batch",
};

describe("contact submission validation", () => {
  it("accepts a real lead and trims fields", () => {
    const parsed = contactSubmissionSchema.parse({
      ...valid,
      name: "  Asha Patil  ",
      email: " asha@example.com ",
    });
    expect(parsed.name).toBe("Asha Patil");
    expect(parsed.email).toBe("asha@example.com");
    expect(parsed.plan).toBe("Free Trial");
  });

  it("rejects letters that only look like a long phone number", () => {
    expect(isValidPhone("abcdefghij")).toBe(false);
    const parsed = contactSubmissionSchema.safeParse({ ...valid, phone: "abcdefghij" });
    expect(parsed.success).toBe(false);
  });

  it("rejects markup in the name", () => {
    const parsed = contactSubmissionSchema.safeParse({ ...valid, name: "<script>alert(1)</script>" });
    expect(parsed.success).toBe(false);
  });

  it("rejects an unknown plan and a client-supplied status is not part of the schema", () => {
    expect(contactSubmissionSchema.safeParse({ ...valid, plan: "Lifetime" }).success).toBe(false);
    const parsed = contactSubmissionSchema.parse({ ...valid, status: "Converted" });
    expect(parsed).not.toHaveProperty("status");
  });

  it("drops blank messages", () => {
    expect(normalizeContactMessage("   ")).toBeNull();
    expect(normalizeContactMessage(null)).toBeNull();
    expect(normalizeContactMessage("Hello")).toBe("Hello");
  });
});
