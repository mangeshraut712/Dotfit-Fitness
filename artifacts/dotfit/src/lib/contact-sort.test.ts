import { describe, expect, it } from "vitest";
import { compareLeads, type SortableLead } from "./contact-sort";

const older: SortableLead = {
  id: 2,
  name: "B",
  phone: "919527237213",
  email: "b@example.com",
  plan: "1 Month",
  status: "New",
  createdAt: "2026-01-02T00:00:00.000Z",
};
const newer: SortableLead = {
  id: 10,
  name: "A",
  phone: "919000000000",
  email: "a@example.com",
  plan: "1 Year",
  status: "New",
  createdAt: "2026-02-02T00:00:00.000Z",
};

describe("compareLeads", () => {
  it("sorts ids numerically so 2 comes before 10", () => {
    expect(compareLeads(newer, older, "id", true)).toBeGreaterThan(0);
    expect([newer, older].sort((a, b) => compareLeads(a, b, "id", true)).map((lead) => lead.id)).toEqual([2, 10]);
  });

  it("sorts submission time chronologically", () => {
    expect([older, newer].sort((a, b) => compareLeads(a, b, "createdAt", false)).map((lead) => lead.id)).toEqual([10, 2]);
  });
});
