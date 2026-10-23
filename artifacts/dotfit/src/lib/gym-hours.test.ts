import { describe, expect, it } from "vitest";
import { getDailyBanner, getGymStatus } from "./gym-hours";

describe("gym hours in IST", () => {
  it("treats Sunday morning as open and Sunday afternoon as closed", () => {
    const morning = new Date("2026-10-25T02:30:00.000Z");
    const afternoon = new Date("2026-10-25T07:30:00.000Z");
    expect(getGymStatus(morning)).toEqual({ open: true, sub: "Closes 12 PM" });
    expect(getDailyBanner(morning)).toBe("Open Sunday 6 AM – 12 PM");
    expect(getGymStatus(afternoon).open).toBe(false);
    expect(getDailyBanner(afternoon)).toContain("Sunday hours are 6 AM – 12 PM");
  });

  it("does not call the weekday midday break open", () => {
    const breakTime = new Date("2026-10-26T07:30:00.000Z");
    const evening = new Date("2026-10-26T12:30:00.000Z");
    expect(getGymStatus(breakTime)).toEqual({ open: false, sub: "Opens at 4:00 PM" });
    expect(getDailyBanner(breakTime)).toBe("Midday break · Reopens at 4 PM");
    expect(getDailyBanner(breakTime)).not.toContain("Open daily 6 AM – 10 PM");
    expect(getGymStatus(evening).open).toBe(true);
    expect(getDailyBanner(evening)).not.toContain("Book Free Trial");
  });
});
