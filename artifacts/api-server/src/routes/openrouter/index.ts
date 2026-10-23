import { Router, type NextFunction, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { getOpenRouter } from "@workspace/integrations-openrouter-ai";
import { requireAdminAuth } from "../../lib/auth";
import {
  asChatRole,
  COACH_HISTORY_LIMIT,
  COACH_MAX_TOKENS,
  COACH_MODEL,
  createConversationSchema,
  sendMessageSchema,
} from "../../lib/chat-input";
import {
  conversationTokenMatches,
  getConversationSecret,
  signConversationId,
} from "../../lib/conversation-access";
import { parsePositiveIntParam } from "../../lib/ids";
import { shouldSkipRateLimit } from "../../lib/rate-limit";

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

const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many conversations. Please try again later." },
  skip: shouldSkipRateLimit,
});

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages. Please try again later." },
  skip: shouldSkipRateLimit,
});

function requireConversationAccess(req: Request, res: Response, next: NextFunction): void {
  const secret = getConversationSecret();
  if (!secret) {
    res.status(503).json({ error: "Coach access is not configured" });
    return;
  }
  const id = parsePositiveIntParam(req.params["id"]);
  if (id == null) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const token = req.header("x-conversation-token");
  if (!conversationTokenMatches(id, token, secret)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.locals.conversationId = id;
  next();
}

router.get("/conversations", requireAdminAuth, async (req, res) => {
  try {
    const all = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(all);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations", createLimiter, async (req, res) => {
  const secret = getConversationSecret();
  if (!secret) {
    res.status(503).json({ error: "Coach access is not configured" });
    return;
  }
  const parsed = createConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [conv] = await db
      .insert(conversations)
      .values({ title: parsed.data.title })
      .returning();
    if (!conv) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(201).json({
      ...conv,
      accessToken: signConversationId(conv.id, secret),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id", requireConversationAccess, async (req, res) => {
  const id = res.locals.conversationId as number;
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

router.delete("/conversations/:id", requireConversationAccess, async (req, res) => {
  const id = res.locals.conversationId as number;
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

router.get("/conversations/:id/messages", requireConversationAccess, async (req, res) => {
  const id = res.locals.conversationId as number;
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

router.post("/conversations/:id/messages", requireConversationAccess, messageLimiter, async (req, res) => {
  const id = res.locals.conversationId as number;

  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const openrouter = getOpenRouter();
  if (!openrouter) {
    res.status(503).json({ error: "AI coach is not configured" });
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

    const recentHistory = history.slice(-COACH_HISTORY_LIMIT);
    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...recentHistory.map((message) => ({
        role: asChatRole(message.role),
        content: message.content,
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
        model: COACH_MODEL,
        max_tokens: COACH_MAX_TOKENS,
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
