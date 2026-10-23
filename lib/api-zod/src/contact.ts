import { z } from "zod";

/** Plans the public site and staff can attach to a lead. */
export const CONTACT_PLANS = [
  "Free Trial",
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "Personal Training",
  "Zumba / Yoga Classes",
  "General Inquiry",
  "7-Day Trial",
  "Single Session",
] as const;

export type ContactPlan = (typeof CONTACT_PLANS)[number];

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

/** Accepts a phone that contains 10–15 digits and no other characters. */
export function isValidPhone(input: string): boolean {
  const trimmed = input.trim();
  if (!/^[+0-9()\s.-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long")
    .regex(NAME_PATTERN, "Name contains invalid characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .refine(isValidPhone, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Enter a valid email address"),
  plan: z.enum(CONTACT_PLANS, { message: "Select a valid plan" }),
  message: z
    .union([
      z.string().trim().max(1000, "Message must be 1000 characters or fewer"),
      z.null(),
    ])
    .optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export function normalizeContactMessage(
  message: string | null | undefined,
): string | null {
  if (message == null) return null;
  const trimmed = message.trim();
  return trimmed.length > 0 ? trimmed : null;
}
