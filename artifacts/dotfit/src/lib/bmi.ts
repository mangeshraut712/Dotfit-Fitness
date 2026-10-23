export type BmiGender = "male" | "female";

export type BmiResult = {
  bmi: number;
  category: string;
  color: string;
  plan: string;
  tip: string;
  idealMin: number;
  idealMax: number;
  bmr: number;
  tdee: number;
  bodyFat: number;
};

export type BmiInput = {
  weightKg: string;
  heightCm: string;
  ageYears: string;
  gender: BmiGender;
};

export type BmiComputation =
  | { ok: true; result: BmiResult }
  | { ok: false; error: string };

function round(value: number, digits: number): number {
  return Number(value.toFixed(digits));
}

function parseStrictNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Hamwi ideal weight, falling back to the BMI 18.5–24.9 range when Hamwi goes below 20 kg. */
export function healthyWeightRange(heightCm: number, gender: BmiGender): { min: number; max: number } {
  const inchesOverFiveFeet = (heightCm - 152.4) / 2.54;
  const base =
    gender === "male"
      ? 48 + 2.7 * inchesOverFiveFeet
      : 45.5 + 2.2 * inchesOverFiveFeet;
  if (base >= 20) {
    const min = round(base, 1);
    return { min, max: round(min + 5, 1) };
  }
  const meters = heightCm / 100;
  return {
    min: round(18.5 * meters * meters, 1),
    max: round(24.9 * meters * meters, 1),
  };
}

export function computeBmi(input: BmiInput): BmiComputation {
  const weight = parseStrictNumber(input.weightKg);
  const heightCm = parseStrictNumber(input.heightCm);
  const ageProvided = input.ageYears.trim().length > 0;
  const age = ageProvided ? parseStrictNumber(input.ageYears) : 25;

  if (weight == null || weight < 20 || weight > 300) {
    return { ok: false, error: "Enter a weight between 20 and 300 kg." };
  }
  if (heightCm == null || heightCm < 100 || heightCm > 250) {
    return { ok: false, error: "Enter a height between 100 and 250 cm." };
  }
  if (age == null || age < 10 || age > 100) {
    return { ok: false, error: "Enter an age between 10 and 100, or leave it blank." };
  }

  const meters = heightCm / 100;
  const bmi = round(weight / (meters * meters), 1);
  const { min: idealMin, max: idealMax } = healthyWeightRange(heightCm, input.gender);
  const bmr = round(
    input.gender === "male"
      ? 10 * weight + 6.25 * heightCm - 5 * age + 5
      : 10 * weight + 6.25 * heightCm - 5 * age - 161,
    0,
  );
  const tdee = round(bmr * 1.375, 0);
  const rawBodyFat =
    input.gender === "male"
      ? 1.2 * bmi + 0.23 * age - 16.2
      : 1.2 * bmi + 0.23 * age - 5.4;
  const bodyFat = round(Math.min(70, Math.max(0, rawBodyFat)), 1);

  const category =
    bmi < 18.5
      ? {
          category: "Underweight",
          color: "text-blue-600",
          plan: "3 Months",
          tip: "Focus on progressive strength training + calorie surplus to build lean muscle.",
        }
      : bmi < 25
        ? {
            category: "Normal Weight",
            color: "text-primary",
            plan: "1 Year",
            tip: "Maintain your fitness with group classes, toning sessions, and active recovery.",
          }
        : bmi < 30
          ? {
              category: "Overweight",
              color: "text-amber-700",
              plan: "6 Months",
              tip: "Combine daily cardio, HIIT circuits, and a calorie-managed nutrition plan.",
            }
          : {
              category: "Obese",
              color: "text-red-700",
              plan: "1 Year",
              tip: "Structured fat-loss program with dedicated personal trainer and nutritionist support.",
            };

  return {
    ok: true,
    result: {
      bmi,
      idealMin,
      idealMax,
      bmr,
      tdee,
      bodyFat,
      ...category,
    },
  };
}
