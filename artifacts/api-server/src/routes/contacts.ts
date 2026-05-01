import { Router } from "express";
import { db, contactsTable } from "@workspace/db";
import { CreateContactBody } from "@workspace/api-zod";

const contactsRouter = Router();

contactsRouter.post("/contacts", async (req, res) => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const contact = await db
    .insert(contactsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json({
    ...contact[0],
    createdAt: contact[0].createdAt.toISOString(),
  });
});

contactsRouter.get("/contacts", async (req, res) => {
  const contacts = await db.select().from(contactsTable).orderBy(contactsTable.createdAt);
  res.json(contacts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

export default contactsRouter;
