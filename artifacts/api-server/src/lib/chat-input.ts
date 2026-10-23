import { z } from "zod";

export const COACH_MODEL = "meta-llama/llama-4-scout";
export const COACH_MAX_TOKENS = 1024;
export const COACH_HISTORY_LIMIT = 20;

export const createConversationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
});

export function asChatRole(role: string): "user" | "assistant" {
  return role === "assistant" ? "assistant" : "user";
}
