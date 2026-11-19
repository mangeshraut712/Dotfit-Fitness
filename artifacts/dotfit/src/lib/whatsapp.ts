/**
 * Digits for a wa.me link. Stored numbers are mostly 10-digit Indian mobiles,
 * which can themselves start with "91", so add the country code by length
 * rather than by prefix, and leave other international numbers alone.
 */
export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  return digits.length === 10 ? `91${digits}` : digits;
}
