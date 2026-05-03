import { Router, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { db, contactsTable } from "@workspace/db";
import { CreateContactBody } from "@workspace/api-zod";

const contactsRouter = Router();

const ALLOWED_STATUSES = ["New", "Contacted", "Converted"] as const;

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
  skip: () => process.env.NODE_ENV !== "production",
});

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    next();
    return;
  }
  const auth = req.headers["authorization"];
  if (!auth || auth !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

contactsRouter.post("/contacts", submitLimiter, async (req, res) => {
  const parsed = CreateContactBody.safeParse(req.body);
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
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...contact[0],
      createdAt: contact[0].createdAt.toISOString(),
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
      .orderBy(contactsTable.createdAt);
    res.json(contacts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch contacts from database");
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

contactsRouter.patch("/contacts/:id/status", requireAdminAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"]), 10);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid contact id" });
    return;
  }

  const rawStatus = (req.body as Record<string, unknown>)?.status;
  if (typeof rawStatus !== "string" || !ALLOWED_STATUSES.includes(rawStatus as typeof ALLOWED_STATUSES[number])) {
    res.status(400).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    return;
  }
  const status = rawStatus as typeof ALLOWED_STATUSES[number];

  try {
    const updated = await db
      .update(contactsTable)
      .set({ status })
      .where(eq(contactsTable.id, id))
      .returning();
    if (!updated.length) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }
    res.json({ ...updated[0], createdAt: updated[0].createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update contact status");
    res.status(500).json({ error: "Failed to update status." });
  }
});

export default contactsRouter;
