import { afterEach, describe, expect, it } from "vitest";
import {
  conversationTokenMatches,
  getConversationSecret,
  signConversationId,
} from "./conversation-access";

const original = {
  NODE_ENV: process.env.NODE_ENV,
  CONVERSATION_SECRET: process.env.CONVERSATION_SECRET,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

afterEach(() => {
  process.env.NODE_ENV = original.NODE_ENV;
  if (original.CONVERSATION_SECRET == null) delete process.env.CONVERSATION_SECRET;
  else process.env.CONVERSATION_SECRET = original.CONVERSATION_SECRET;
  if (original.ADMIN_PASSWORD == null) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = original.ADMIN_PASSWORD;
});

describe("conversation access tokens", () => {
  it("rejects a token minted for a different conversation", () => {
    const secret = "test-secret";
    const token = signConversationId(4, secret);
    expect(conversationTokenMatches(4, token, secret)).toBe(true);
    expect(conversationTokenMatches(5, token, secret)).toBe(false);
    expect(conversationTokenMatches(4, undefined, secret)).toBe(false);
  });

  it("fails closed in production when no secret is configured", () => {
    process.env.NODE_ENV = "production";
    delete process.env.CONVERSATION_SECRET;
    delete process.env.ADMIN_PASSWORD;
    expect(getConversationSecret()).toBeNull();
  });

  it("uses the admin password when a dedicated secret is absent", () => {
    delete process.env.CONVERSATION_SECRET;
    process.env.ADMIN_PASSWORD = "staff-only";
    expect(getConversationSecret()).toBe("staff-only");
  });
});
