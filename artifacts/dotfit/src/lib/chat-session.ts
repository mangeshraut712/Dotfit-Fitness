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

export function parsePendingDeletions(raw: string | null): StoredChat[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const result: StoredChat[] = [];
    for (const item of parsed) {
      if (
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).id === "number" &&
        Number.isSafeInteger((item as Record<string, unknown>).id) &&
        ((item as Record<string, unknown>).id as number) > 0 &&
        typeof (item as Record<string, unknown>).token === "string" &&
        ((item as Record<string, unknown>).token as string).length > 0
      ) {
        result.push({
          id: (item as Record<string, unknown>).id as number,
          token: (item as Record<string, unknown>).token as string,
        });
      }
    }
    return result;
  } catch {
    return [];
  }
}

export function serializePendingDeletions(deletions: StoredChat[]): string {
  return JSON.stringify(deletions);
}

export class PendingDeletionQueue {
  private items = new Map<number, string>();

  constructor(initial: StoredChat[] = []) {
    for (const item of initial) {
      this.items.set(item.id, item.token);
    }
  }

  enqueue(id: number, token: string): void {
    this.items.set(id, token);
  }

  remove(id: number): void {
    this.items.delete(id);
  }

  has(id: number): boolean {
    return this.items.has(id);
  }

  get size(): number {
    return this.items.size;
  }

  toArray(): StoredChat[] {
    return Array.from(this.items.entries()).map(([id, token]) => ({ id, token }));
  }

  async flush(
    deleter: (id: number, token: string) => Promise<void>,
  ): Promise<boolean> {
    const entries = Array.from(this.items.entries());
    if (entries.length === 0) return true;
    let allSucceeded = true;
    for (const [id, token] of entries) {
      try {
        await deleter(id, token);
        this.items.delete(id);
      } catch {
        allSucceeded = false;
      }
    }
    return allSucceeded;
  }
}

