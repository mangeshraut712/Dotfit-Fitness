import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/** Constant-time string compare. Length mismatches still run a compare. */
export function tokensMatch(provided: string, expected: string): boolean {
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  if (providedBytes.length !== expectedBytes.length) {
    timingSafeEqual(expectedBytes, expectedBytes);
    return false;
  }
  return timingSafeEqual(providedBytes, expectedBytes);
}

export function bearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

/**
 * Admin routes fail closed. A missing password is a misconfiguration,
 * not an invitation to read lead data.
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access is not configured" });
    return;
  }
  const token = bearerToken(req.header("authorization"));
  if (!token || !tokensMatch(token, adminPassword)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
