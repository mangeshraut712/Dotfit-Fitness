import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { parseStoredChat, serializeStoredChat } from "@/lib/chat-session";
import { getOfflineReply } from "@/lib/coach-offline";
import { applyCoachEvent, finishCoachDraft, takeSseEvents, type AssistantDraft } from "@/lib/sse";

const BASE_URL = import.meta.env.BASE_URL as string;

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

function getApiBase(): string {
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${base}/api/openrouter`;
}

function conversationHeaders(token: string): HeadersInit {
  return { "X-Conversation-Token": token };
}

async function createConversation(title: string): Promise<{ id: number; token: string }> {
  const res = await fetch(`${getApiBase()}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  const data = (await res.json()) as { id: number; accessToken?: string };
  if (typeof data.id !== "number" || !data.accessToken) {
    throw new Error("Conversation was created without an access token");
  }
  return { id: data.id, token: data.accessToken };
}

async function loadConversation(
  id: number,
  token: string,
): Promise<{ role: string; content: string }[] | null> {
  const res = await fetch(`${getApiBase()}/conversations/${id}`, {
    headers: conversationHeaders(token),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    messages: { role: string; content: string }[];
  };
  return data.messages ?? [];
}

async function deleteConversation(id: number, token: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/conversations/${id}`, {
    method: "DELETE",
    headers: conversationHeaders(token),
  });
  if (!res.ok && res.status !== 404) {
    throw new Error("Failed to delete conversation");
  }
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      elements.push(
        <p key={key++} className="font-bold text-primary mt-2 mb-1">
          {renderInline(line.slice(4))}
        </p>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <p key={key++} className="font-bold text-white mt-2 mb-1 text-sm">
          {renderInline(line.slice(3))}
        </p>
      );
    } else if (line.match(/^[-*] /)) {
      elements.push(
        <div key={key++} className="flex gap-2 ml-1">
          <span className="text-primary mt-0.5 shrink-0">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-1" />);
    } else {
      elements.push(<p key={key++}>{renderInline(line)}</p>);
    }
  }

  return <div className="space-y-0.5 text-sm leading-relaxed">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-primary font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-primary/70 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

const STORAGE_KEY = "dotfit_chat_conv_id";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const [convToken, setConvToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [clearNotice, setClearNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const clearEpochRef = useRef(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (open && messages.length > 0) {
      scrollToBottom("instant");
    }
  }, [open, scrollToBottom, messages.length]);

  useEffect(() => {
    if (streaming) scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || initialized) return;
    setInitialized(true);

    const stored = parseStoredChat(sessionStorage.getItem(STORAGE_KEY));
    const clearEpoch = clearEpochRef.current;
    if (!stored) {
      sessionStorage.removeItem(STORAGE_KEY);
      void startNewConversation();
      return;
    }
    loadConversation(stored.id, stored.token)
      .then((msgs) => {
        if (clearEpoch !== clearEpochRef.current) {
          void discardConversation(stored.id, stored.token);
          return undefined;
        }
        if (msgs == null) {
          sessionStorage.removeItem(STORAGE_KEY);
          return startNewConversation();
        }
        setConvId(stored.id);
        setConvToken(stored.token);
        setMessages(
          msgs
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
        );
        return undefined;
      })
      .catch(() => {
        if (clearEpoch !== clearEpochRef.current) {
          void discardConversation(stored.id, stored.token);
          return undefined;
        }
        return startNewConversation();
      });
  }, [open, initialized]);

  function rememberChat(id: number, token: string) {
    sessionStorage.setItem(STORAGE_KEY, serializeStoredChat({ id, token }));
    setConvId(id);
    setConvToken(token);
  }

  function reportClearFailure() {
    setOfflineMode(true);
    setClearNotice(
      "This browser session was cleared, but the server copy could not be removed. Please try again when the coach service is available.",
    );
  }

  async function discardConversation(id: number, token: string) {
    try {
      await deleteConversation(id, token);
    } catch {
      reportClearFailure();
    }
  }

  async function startNewConversation() {
    const clearEpoch = clearEpochRef.current;
    try {
      const created = await createConversation("Dotfit Coaching Session");
      if (clearEpoch !== clearEpochRef.current) {
        void discardConversation(created.id, created.token);
        return;
      }
      rememberChat(created.id, created.token);
      setMessages([]);
      setOfflineMode(false);
    } catch {
      if (clearEpoch === clearEpochRef.current) setOfflineMode(true);
    }
  }

  function showOfflineReply(text: string, includeUserMessage = false) {
    setOfflineMode(true);
    setMessages((prev) => {
      const copy = [...prev];
      const reply: Message = {
        role: "assistant",
        content: getOfflineReply(text),
        streaming: false,
      };
      const last = copy[copy.length - 1];
      if (last?.role === "assistant" && last.streaming) {
        copy[copy.length - 1] = reply;
        return copy;
      }
      if (includeUserMessage) {
        copy.push({ role: "user", content: text });
      }
      copy.push(reply);
      return copy;
    });
  }

  function writeAssistant(next: AssistantDraft) {
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last?.role === "assistant") {
        copy[copy.length - 1] = next;
      }
      return copy;
    });
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;

    let activeConvId = convId;
    let activeToken = convToken;
    if (!activeConvId || !activeToken) {
      const clearEpoch = clearEpochRef.current;
      try {
        const created = await createConversation("Dotfit Coaching Session");
        if (clearEpoch !== clearEpochRef.current) {
          void discardConversation(created.id, created.token);
          return;
        }
        rememberChat(created.id, created.token);
        activeConvId = created.id;
        activeToken = created.token;
      } catch {
        if (clearEpoch !== clearEpochRef.current) return;
        setInput("");
        showOfflineReply(text, true);
        return;
      }
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setStreaming(true);
    setOfflineMode(false);

    const placeholder: Message = { role: "assistant", content: "", streaming: true };
    setMessages((prev) => [...prev, placeholder]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(
        `${getApiBase()}/conversations/${activeConvId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...conversationHeaders(activeToken),
          },
          body: JSON.stringify({ content: text }),
          signal: ctrl.signal,
        }
      );

      if (!res.ok || !res.body) {
        throw new Error("Stream failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let draft: AssistantDraft = { role: "assistant", content: "", streaming: true };
      let stopped = false;
      let useOfflineReply = false;

      while (!stopped) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parsed = takeSseEvents(buffer);
        buffer = parsed.rest;
        for (const event of parsed.events) {
          if (event.error) {
            useOfflineReply = true;
            stopped = true;
            break;
          }
          const applied = applyCoachEvent(draft, event);
          draft = applied.draft;
          writeAssistant(draft);
          setStreaming(applied.streaming);
          if (applied.stop) {
            stopped = true;
            break;
          }
        }
      }

      if (buffer.trim()) {
        const flushed = takeSseEvents(`${buffer}\n`);
        for (const event of flushed.events) {
          if (event.error) {
            useOfflineReply = true;
            stopped = true;
            break;
          }
          const applied = applyCoachEvent(draft, event);
          draft = applied.draft;
          writeAssistant(draft);
          if (applied.stop) stopped = true;
        }
      }

      if (useOfflineReply) {
        showOfflineReply(text);
      } else if (!stopped) {
        draft = finishCoachDraft(draft);
        writeAssistant(draft);
      }
      setStreaming(false);
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        showOfflineReply(text);
      }
      setStreaming(false);
    }
  }

  function clearChat() {
    const activeConvId = convId;
    const activeToken = convToken;
    clearEpochRef.current += 1;
    abortRef.current?.abort();
    sessionStorage.removeItem(STORAGE_KEY);
    setConvId(null);
    setConvToken(null);
    setMessages([]);
    setInput("");
    setStreaming(false);
    setInitialized(true);
    setClearNotice(null);
    if (activeConvId && activeToken) {
      void discardConversation(activeConvId, activeToken);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        type="button"
        aria-label={open ? "Close AI Coach" : "Open AI Fitness Coach"}
        aria-expanded={open}
        aria-controls="dotfit-coach-panel"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-5 z-50 w-14 h-14 bg-gray-950 text-white rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.45)] border border-white/10"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            id="dotfit-coach-panel"
            role="dialog"
            aria-label="Dotfit AI Coach"
            className="fixed z-50 flex flex-col inset-x-3 bottom-24 h-[min(70dvh,540px)] md:inset-x-auto md:right-5 md:bottom-36 md:w-[370px] md:h-[540px] bg-gray-950 rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-white/10 shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  Dotfit AI Coach
                </p>
                <p className="text-gray-200 text-xs">
                  Fitness &amp; Nutrition Expert
                </p>
              </div>
              <div className="flex items-center gap-1" role="status" aria-live="polite">
                <div className={`w-2 h-2 rounded-full ${offlineMode ? "bg-amber-400" : "bg-green-400"} animate-pulse`} />
                <span className={`text-xs ${offlineMode ? "text-amber-400" : "text-green-400"}`}>
                  {offlineMode ? "Offline" : "Online"}
                </span>
              </div>
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear conversation"
                className="ml-2 p-1.5 text-gray-200 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
            >
              {messages.length === 0 && !streaming && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Your AI Fitness Coach
                    </p>
                    <p className="text-gray-200 text-xs mt-1 max-w-[260px]">
                      Ask me anything about training, nutrition, equipment, or
                      injury prevention.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-1">
                    {[
                      "Build muscle",
                      "Lose fat",
                      "Fix my squat",
                      "Meal plan",
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setInput(s);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 rounded-full bg-gray-800 text-gray-100 text-xs border border-white/10 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2.5 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-gray-800 text-gray-100 rounded-tl-sm border border-white/5"
                    }`}
                  >
                    {msg.role === "assistant" && msg.streaming && !msg.content ? (
                      <TypingDots />
                    ) : msg.role === "assistant" ? (
                      <MarkdownText text={msg.content} />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
                    {msg.role === "assistant" && msg.streaming && msg.content && (
                      <motion.span
                        className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  aria-label="Scroll to latest messages"
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 p-1.5 bg-gray-800 border border-white/10 rounded-full text-gray-200 hover:text-white shadow-lg z-10"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 bg-gray-900 shrink-0">
              <div className="flex items-end gap-2">
                <label htmlFor="coach-input" className="sr-only">
                  Message the AI coach
                </label>
                <textarea
                  id="coach-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about training, nutrition…"
                  rows={1}
                  disabled={streaming}
                  className="flex-1 bg-gray-800 text-white placeholder:text-gray-300 text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:border-primary/60 focus:outline-none resize-none leading-relaxed disabled:opacity-50 max-h-28 overflow-y-auto"
                  style={{ height: "auto", minHeight: "40px" }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
                  }}
                />
                <motion.button
                  type="button"
                  aria-label="Send message"
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || streaming}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  {streaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              {clearNotice && (
                <p role="alert" className="mt-1.5 text-center text-[10px] text-amber-300">
                  {clearNotice}
                </p>
              )}
              <p className="text-gray-200 text-[10px] mt-1.5 text-center">
                {offlineMode
                  ? "Offline coach mode · Local knowledge only · Not a substitute for medical advice"
                  : "Powered by Dotfit AI · Not a substitute for medical advice"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
