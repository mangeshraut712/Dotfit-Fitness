export type StoredChat = {
  id: number;
  token: string;
};

export function parseStoredChat(raw: string | null): StoredChat | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { id?: unknown; token?: unknown };
    if (
      typeof parsed.id === "number" &&
      Number.isSafeInteger(parsed.id) &&
      parsed.id > 0 &&
      typeof parsed.token === "string" &&
      parsed.token.length > 0
    ) {
      return { id: parsed.id, token: parsed.token };
    }
  } catch {
    return null;
  }
  return null;
}

export function serializeStoredChat(chat: StoredChat): string {
  return JSON.stringify(chat);
}
