function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function clientErrorStatus(err: unknown): number | null {
  if (!isRecord(err)) return null;
  if (err.type === "entity.too.large") return 413;
  if (err instanceof SyntaxError || err.name === "SyntaxError") return 400;
  if (typeof err.status === "number" && err.status >= 400 && err.status < 500) {
    return err.status;
  }
  return null;
}

export function clientErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid JSON";
    case 413:
      return "Request body is too large";
    default:
      return "Bad request";
  }
}
