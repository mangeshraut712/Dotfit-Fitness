export type SseEvent = {
  content?: string;
  done?: boolean;
  error?: string;
};

export type AssistantDraft = {
  role: "assistant";
  content: string;
  streaming: boolean;
};

export function takeSseEvents(buffer: string): { events: SseEvent[]; rest: string } {
  const lines = buffer.split("\n");
  const rest = lines.pop() ?? "";
  const events: SseEvent[] = [];
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const raw = line.slice(6).trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as SseEvent;
      if (parsed && typeof parsed === "object") events.push(parsed);
    } catch {
      // Ignore a truncated or corrupt chunk; the next read may complete it.
    }
  }
  return { events, rest };
}

export function applyCoachEvent(
  draft: AssistantDraft,
  event: SseEvent,
): { draft: AssistantDraft; streaming: boolean; stop: boolean } {
  if (event.error) {
    return {
      draft: { role: "assistant", content: event.error, streaming: false },
      streaming: false,
      stop: true,
    };
  }
  const content = event.content ? draft.content + event.content : draft.content;
  const streaming = event.done ? false : true;
  return {
    draft: { role: "assistant", content, streaming },
    streaming,
    stop: false,
  };
}

/** A closed stream without `{ done: true }` must not leave the composer disabled. */
export function finishCoachDraft(draft: AssistantDraft): AssistantDraft {
  return { ...draft, streaming: false };
}
