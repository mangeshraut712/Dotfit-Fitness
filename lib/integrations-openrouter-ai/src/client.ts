import OpenAI from "openai";

let cachedClient: OpenAI | undefined;

/**
 * OpenRouter is optional at process start. Health checks and the lead form
 * must boot even when the coach integration is not provisioned.
 * Returns null until both integration env vars are present.
 */
export function getOpenRouter(): OpenAI | null {
  const baseURL = process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY;
  if (!baseURL || !apiKey) return null;
  if (!cachedClient) {
    cachedClient = new OpenAI({ baseURL, apiKey });
  }
  return cachedClient;
}

/** @deprecated Prefer getOpenRouter() so a missing integration does not crash import. */
export const openrouter = new Proxy({} as OpenAI, {
  get(_target, property, receiver) {
    const client = getOpenRouter();
    if (!client) {
      throw new Error(
        "AI_INTEGRATIONS_OPENROUTER_BASE_URL and AI_INTEGRATIONS_OPENROUTER_API_KEY must be set before using the OpenRouter client.",
      );
    }
    const value = Reflect.get(client, property, receiver) as unknown;
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});
