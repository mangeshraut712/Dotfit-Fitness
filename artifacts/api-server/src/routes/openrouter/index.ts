import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { openrouter } from "@workspace/integrations-openrouter-ai";
import {
  CreateOpenrouterConversationBody,
  SendOpenrouterMessageBody,
} from "@workspace/api-zod";

const router = Router();

const SYSTEM_PROMPT = `You are the Dotfit AI Coach — an elite, world-class fitness professional at Dotfit Fitness, a premium gym located in Baner, Pune, India.

Your expertise covers:
- **Hypertrophy & Strength Training**: Progressive overload, RPE-based programming, periodization (linear, undulating, block), volume landmarks, and exercise selection for muscle development.
- **Nutritional Science**: Macronutrient partitioning, caloric surplus/deficit strategies, micronutrient density, meal timing, protein synthesis, and supplementation guidance.
- **Biomechanics & Technique**: Precise cue-based coaching for all major lifts (squat, deadlift, bench, overhead press, rows), joint mechanics, and movement quality.
- **Equipment Mastery**: Free weights (barbells, dumbbells, kettlebells), selectorized machines, cable systems (pulley angles, attachment variations), functional training tools, and cardio equipment available at Dotfit.
- **Injury Prevention & Modification**: Recognizing pain vs. discomfort, movement substitutions for common limitations (shoulder impingement, lower back issues, knee pain), and when to refer to a physiotherapist.
- **Goal-Setting & Programming**: Designing structured plans for fat loss, muscle gain, athletic performance, and general fitness.

Communication style:
- Motivating, precise, and evidence-based — cite training science when relevant.
- Ask clarifying questions to personalize advice (training age, goals, equipment available, injuries, schedule).
- Never provide medical diagnoses — recommend professional consultation for injuries.
- Keep responses focused and actionable. Use markdown formatting (bold, bullet points) for clarity.
- Occasionally reference Dotfit Fitness facilities and encourage members to book a session with a personal trainer for hands-on coaching.

Start every new conversation by briefly introducing yourself and asking the user's primary fitness goal.`;

router.get("/conversations", async (req, res) => {
  try {
    const all = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(all);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations", async (req, res) => {
  const parsed = CreateOpenrouterConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [conv] = await db
      .insert(conversations)
      .values({ title: parsed.data.title })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [deleted] = await db
      .delete(conversations)
      .where(eq(conversations.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = SendOpenrouterMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: parsed.data.content,
    });

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    let fullResponse = "";

    try {
      const stream = await openrouter.chat.completions.create({
        model: "meta-llama/llama-4-scout",
        max_tokens: 8192,
        messages: chatMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } catch (streamErr: unknown) {
      req.log.error({ streamErr }, "Stream error from OpenRouter");
      const isRateLimit =
        typeof streamErr === "object" &&
        streamErr !== null &&
        "status" in streamErr &&
        (streamErr as { status: number }).status === 429;
      const errMsg = isRateLimit
        ? "The AI coach is in high demand right now. Please wait a moment and try again."
        : "AI service temporarily unavailable. Please try again.";
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    if (fullResponse) {
      await db.insert(messages).values({
        conversationId: id,
        role: "assistant",
        content: fullResponse,
      });
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
