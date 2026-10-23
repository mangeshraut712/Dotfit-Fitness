import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { contactSubmissionSchema, normalizeContactMessage } from "@workspace/api-zod";
import { db, contactsTable } from "@workspace/db";
import { requireAdminAuth } from "../lib/auth";
import { parsePositiveIntParam } from "../lib/ids";
import { shouldSkipRateLimit } from "../lib/rate-limit";

const contactsRouter = Router();

const ALLOWED_STATUSES = ["New", "Contacted", "Converted"] as const;
type ContactStatus = (typeof ALLOWED_STATUSES)[number];

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
  skip: shouldSkipRateLimit,
});

function isContactStatus(value: unknown): value is ContactStatus {
  return typeof value === "string" && ALLOWED_STATUSES.some((status) => status === value);
}

contactsRouter.post("/contacts", submitLimiter, async (req, res) => {
  const parsed = contactSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid request body",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const contact = await db
      .insert(contactsTable)
      .values({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        plan: parsed.data.plan,
        message: normalizeContactMessage(parsed.data.message),
      })
      .returning();
    const saved = contact[0];
    if (!saved) {
      res.status(500).json({ error: "Failed to save your request. Please try again or call +91 95272 37213." });
      return;
    }
    res.status(201).json({
      ...saved,
      createdAt: saved.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to insert contact into database");
    res.status(500).json({ error: "Failed to save your request. Please try again or call +91 95272 37213." });
  }
});

contactsRouter.get("/contacts", requireAdminAuth, async (req, res) => {
  try {
    const contacts = await db
      .select()
      .from(contactsTable)
      .orderBy(desc(contactsTable.createdAt));
    res.json(contacts.map((contact) => ({ ...contact, createdAt: contact.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch contacts from database");
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

contactsRouter.patch("/contacts/:id/status", requireAdminAuth, async (req, res) => {
  const id = parsePositiveIntParam(req.params["id"]);
  if (id == null) {
    res.status(400).json({ error: "Invalid contact id" });
    return;
  }

  const rawStatus = (req.body as Record<string, unknown> | undefined)?.status;
  if (!isContactStatus(rawStatus)) {
    res.status(400).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    return;
  }

  try {
    const updated = await db
      .update(contactsTable)
      .set({ status: rawStatus })
      .where(eq(contactsTable.id, id))
      .returning();
    const saved = updated[0];
    if (!saved) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }
    res.json({ ...saved, createdAt: saved.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update contact status");
    res.status(500).json({ error: "Failed to update status." });
  }
});

export default contactsRouter;
