import { describe, expect, it } from "vitest";
import { computeBmi } from "./bmi";

describe("computeBmi", () => {
  it("classifies a known adult measurement", () => {
    const outcome = computeBmi({
      weightKg: "75",
      heightCm: "170",
      ageYears: "30",
      gender: "male",
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.bmi).toBe(26);
    expect(outcome.result.category).toBe("Overweight");
    expect(outcome.result.idealMin).toBeGreaterThan(0);
    expect(outcome.result.bodyFat).toBeGreaterThan(0);
  });

  it("does not return NaN or a negative ideal weight for short heights", () => {
    const outcome = computeBmi({
      weightKg: "40",
      heightCm: "100",
      ageYears: "18",
      gender: "female",
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(Number.isFinite(outcome.result.bmi)).toBe(true);
    expect(outcome.result.idealMin).toBeGreaterThan(0);
    expect(outcome.result.idealMax).toBeGreaterThan(outcome.result.idealMin);
    expect(outcome.result.bodyFat).toBeGreaterThanOrEqual(0);
  });

  it("rejects empty and non-numeric measurements instead of displaying NaN", () => {
    expect(computeBmi({ weightKg: "", heightCm: "170", ageYears: "30", gender: "male" }).ok).toBe(false);
    expect(computeBmi({ weightKg: "75abc", heightCm: "170", ageYears: "30", gender: "male" }).ok).toBe(false);
    const young = computeBmi({ weightKg: "40", heightCm: "190", ageYears: "10", gender: "male" });
    expect(young.ok).toBe(true);
    if (!young.ok) return;
    expect(young.result.bodyFat).toBeGreaterThanOrEqual(0);
  });
});
