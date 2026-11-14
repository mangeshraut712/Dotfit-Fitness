import { describe, expect, it } from "vitest";
import {
  parseStoredChat,
  serializeStoredChat,
  parsePendingDeletions,
  serializePendingDeletions,
  PendingDeletionQueue,
} from "./chat-session";
import { getOfflineReply } from "./coach-offline";
import { applyCoachEvent, finishCoachDraft, takeSseEvents } from "./sse";

describe("stored coach sessions", () => {
  it("ignores a legacy numeric id that has no access token", () => {
    expect(parseStoredChat("15")).toBeNull();
    expect(parseStoredChat(null)).toBeNull();
  });

  it("round-trips an id and token", () => {
    const raw = serializeStoredChat({ id: 4, token: "abc" });
    expect(parseStoredChat(raw)).toEqual({ id: 4, token: "abc" });
  });
});

describe("pending coach session deletions", () => {
  it("parses and serializes pending deletions safely", () => {
    expect(parsePendingDeletions(null)).toEqual([]);
    expect(parsePendingDeletions("invalid-json")).toEqual([]);
    expect(parsePendingDeletions(JSON.stringify([{ id: -1, token: "" }, { id: 2, token: "t2" }]))).toEqual([
      { id: 2, token: "t2" },
    ]);
    const serialized = serializePendingDeletions([{ id: 7, token: "tok-7" }]);
    expect(parsePendingDeletions(serialized)).toEqual([{ id: 7, token: "tok-7" }]);
  });

  it("retains failed deletions and retries them with original credentials on next clear", async () => {
    const queue = new PendingDeletionQueue();
    queue.enqueue(23, "cred-23");
    expect(queue.size).toBe(1);

    const calls: { id: number; token: string }[] = [];
    let serviceDown = true;

    const mockDeleter = async (id: number, token: string) => {
      calls.push({ id, token });
      if (serviceDown) {
        throw new Error("503 Service Unavailable");
      }
    };

    // First attempt fails: credentials remain in queue
    const firstResult = await queue.flush(mockDeleter);
    expect(firstResult).toBe(false);
    expect(queue.size).toBe(1);
    expect(calls).toEqual([{ id: 23, token: "cred-23" }]);

    // Service recovers; second clear attempt retries with original credentials
    serviceDown = false;
    const secondResult = await queue.flush(mockDeleter);
    expect(secondResult).toBe(true);
    expect(queue.size).toBe(0);
    expect(calls).toEqual([
      { id: 23, token: "cred-23" },
      { id: 23, token: "cred-23" },
    ]);
  });
});

describe("coach stream reducer", () => {
  it("appends chunks and finishes when the socket closes without done", () => {
    const first = takeSseEvents('data: {"content":"Hello"}\n\n');
    expect(first.events).toEqual([{ content: "Hello" }]);
    let draft = applyCoachEvent({ role: "assistant", content: "", streaming: true }, first.events[0]).draft;
    draft = finishCoachDraft(draft);
    expect(draft).toEqual({ role: "assistant", content: "Hello", streaming: false });
  });

  it("surfaces a stream error and stops", () => {
    const applied = applyCoachEvent(
      { role: "assistant", content: "", streaming: true },
      { error: "busy" },
    );
    expect(applied.stop).toBe(true);
    expect(applied.streaming).toBe(false);
    expect(applied.draft.content).toBe("busy");
  });
});

describe("offline coach", () => {
  it("includes safety guidance for a squat question", () => {
    expect(getOfflineReply("Fix my squat")).toContain("sharp pain");
  });
});
