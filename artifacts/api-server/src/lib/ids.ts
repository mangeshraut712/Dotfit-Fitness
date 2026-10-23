/** Accept only a canonical positive integer, rejecting "12abc", "1.5", and "1e2". */
export function parsePositiveIntParam(value: unknown): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) return null;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed)) return null;
  return parsed;
}
