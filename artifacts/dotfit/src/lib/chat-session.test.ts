import { describe, expect, it } from "vitest";
import { parseStoredChat, serializeStoredChat } from "./chat-session";
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
