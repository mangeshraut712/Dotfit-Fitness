import { Router } from "express";
import { db, contactsTable } from "@workspace/db";
import { CreateContactBody } from "@workspace/api-zod";

const contactsRouter = Router();

contactsRouter.post("/contacts", async (req, res) => {
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

contactsRouter.get("/contacts", async (req, res) => {
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

export default contactsRouter;
