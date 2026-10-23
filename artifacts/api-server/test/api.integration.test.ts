import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { resetMemoryDb } from "./memory-db";

const harness = vi.hoisted(() => {
  const createCompletion = vi.fn();
  return {
    createCompletion,
    enabled: { value: true },
  };
});

vi.mock("drizzle-orm", () => ({
  eq: (column: { name: string }, value: unknown) => ({ op: "eq", column: column.name, value }),
  desc: (column: { name: string }) => ({ op: "desc", column: column.name }),
}));

vi.mock("@workspace/db", async () => {
  const memory = await import("./memory-db");
  return memory.createDbModule();
});

vi.mock("@workspace/db/schema", async () => {
  const memory = await import("./memory-db");
  return {
    conversations: memory.conversations,
    messages: memory.messages,
    contactsTable: memory.contactsTable,
  };
});

vi.mock("@workspace/integrations-openrouter-ai", () => ({
  getOpenRouter: () =>
    harness.enabled.value
      ? { chat: { completions: { create: harness.createCompletion } } }
      : null,
  openrouter: {},
}));

const { default: app } = await import("../src/app");

const ADMIN = "test-admin-password";
const lead = {
  name: "Asha Patil",
  phone: "+91 95272 37213",
  email: "asha@example.com",
  plan: "Free Trial",
  message: "Morning batch",
};

async function* coachChunks() {
  yield { choices: [{ delta: { content: "Hello" } }] };
  yield { choices: [{ delta: { content: " coach" } }] };
}

beforeEach(() => {
  resetMemoryDb();
  process.env.NODE_ENV = "test";
  process.env.ADMIN_PASSWORD = ADMIN;
  process.env.CONVERSATION_SECRET = "test-conversation-secret";
  delete process.env.ENFORCE_RATE_LIMIT;
  harness.enabled.value = true;
  harness.createCompletion.mockReset();
  harness.createCompletion.mockImplementation(async () => coachChunks());
});

describe("API integration", () => {
  it("reports health and sends security headers", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await request(app)
      .post("/api/contacts")
      .set("Content-Type", "application/json")
      .send("{");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid JSON");
  });

  it("rejects an invalid phone and stores a valid lead as New", async () => {
    const invalid = await request(app).post("/api/contacts").send({ ...lead, phone: "abcdefghij" });
    expect(invalid.status).toBe(400);

    const created = await request(app).post("/api/contacts").send({ ...lead, status: "Converted" });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe("New");
    expect(created.body.name).toBe("Asha Patil");
  });

  it("hides leads unless the admin password matches", async () => {
    await request(app).post("/api/contacts").send(lead);

    const open = await request(app).get("/api/contacts");
    expect(open.status).toBe(401);

    const wrong = await request(app).get("/api/contacts").set("Authorization", "Bearer nope");
    expect(wrong.status).toBe(401);

    delete process.env.ADMIN_PASSWORD;
    const unconfigured = await request(app).get("/api/contacts").set("Authorization", `Bearer ${ADMIN}`);
    expect(unconfigured.status).toBe(503);
    process.env.ADMIN_PASSWORD = ADMIN;

    const allowed = await request(app).get("/api/contacts").set("Authorization", `Bearer ${ADMIN}`);
    expect(allowed.status).toBe(200);
    expect(allowed.body).toHaveLength(1);
  });

  it("lists newest leads first and refuses partial ids", async () => {
    await request(app).post("/api/contacts").send(lead);
    await request(app).post("/api/contacts").send({ ...lead, name: "Ravi Shah", email: "ravi@example.com" });
    const listed = await request(app).get("/api/contacts").set("Authorization", `Bearer ${ADMIN}`);
    expect(listed.body.map((row: { id: number }) => row.id)).toEqual([2, 1]);

    const partial = await request(app)
      .patch("/api/contacts/2abc/status")
      .set("Authorization", `Bearer ${ADMIN}`)
      .send({ status: "Converted" });
    expect(partial.status).toBe(400);

    const updated = await request(app)
      .patch("/api/contacts/2/status")
      .set("Authorization", `Bearer ${ADMIN}`)
      .send({ status: "Contacted" });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("Contacted");

    const missing = await request(app)
      .patch("/api/contacts/99/status")
      .set("Authorization", `Bearer ${ADMIN}`)
      .send({ status: "New" });
    expect(missing.status).toBe(404);
  });

  it("requires a conversation token to read, message, or delete a coach session", async () => {
    const created = await request(app).post("/api/openrouter/conversations").send({ title: "Session" });
    expect(created.status).toBe(201);
    const token = created.body.accessToken as string;
    expect(token).toEqual(expect.any(String));

    const hidden = await request(app).get(`/api/openrouter/conversations/${created.body.id}`);
    expect(hidden.status).toBe(401);

    const visible = await request(app)
      .get(`/api/openrouter/conversations/${created.body.id}`)
      .set("X-Conversation-Token", token);
    expect(visible.status).toBe(200);
    expect(visible.body.messages).toEqual([]);

    const empty = await request(app)
      .post(`/api/openrouter/conversations/${created.body.id}/messages`)
      .set("X-Conversation-Token", token)
      .send({ content: "   " });
    expect(empty.status).toBe(400);

    const streamed = await request(app)
      .post(`/api/openrouter/conversations/${created.body.id}/messages`)
      .set("X-Conversation-Token", token)
      .send({ content: "How do I squat?" });
    expect(streamed.status).toBe(200);
    expect(streamed.headers["content-type"]).toContain("text/event-stream");
    expect(streamed.text).toContain("Hello");
    expect(streamed.text).toContain("coach");
    expect(streamed.text).toContain('"done":true');

    const history = await request(app)
      .get(`/api/openrouter/conversations/${created.body.id}`)
      .set("X-Conversation-Token", token);
    expect(history.body.messages.map((row: { role: string }) => row.role)).toEqual(["user", "assistant"]);

    const listed = await request(app).get("/api/openrouter/conversations");
    expect(listed.status).toBe(401);
    const staff = await request(app)
      .get("/api/openrouter/conversations")
      .set("Authorization", `Bearer ${ADMIN}`);
    expect(staff.status).toBe(200);
    expect(staff.body).toHaveLength(1);

    const denied = await request(app).delete(`/api/openrouter/conversations/${created.body.id}`);
    expect(denied.status).toBe(401);
    const removed = await request(app)
      .delete(`/api/openrouter/conversations/${created.body.id}`)
      .set("X-Conversation-Token", token);
    expect(removed.status).toBe(204);
  });

  it("refuses to mint coach sessions in production without a secret", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.CONVERSATION_SECRET;
    delete process.env.ADMIN_PASSWORD;
    const res = await request(app).post("/api/openrouter/conversations").send({ title: "Session" });
    expect(res.status).toBe(503);
  });

  it("rate limits contact submissions when enforcement is on", async () => {
    process.env.ENFORCE_RATE_LIMIT = "1";
    let lastStatus = 0;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const res = await request(app).post("/api/contacts").send(lead);
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
