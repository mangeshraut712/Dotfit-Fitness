import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_SECRET = "dotfit-dev-conversation-secret";

/**
 * Production refuses to mint or accept conversation tokens without a secret.
 * Development and tests use a fixed fallback so local chat still works.
 */
export function getConversationSecret(): string | null {
  const configured = process.env.CONVERSATION_SECRET || process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return null;
  return DEV_SECRET;
}

export function signConversationId(id: number, secret: string): string {
  return createHmac("sha256", secret).update(String(id)).digest("base64url");
}

export function conversationTokenMatches(
  id: number,
  token: string | undefined,
  secret: string,
): boolean {
  if (!token) return false;
  const expected = signConversationId(id, secret);
  const providedBytes = Buffer.from(token);
  const expectedBytes = Buffer.from(expected);
  if (providedBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(providedBytes, expectedBytes);
}
