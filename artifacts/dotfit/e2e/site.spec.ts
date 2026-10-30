import { expect, test } from "@playwright/test";

test("homepage exposes the trial form and rejects an invalid lead", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Raw Power/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeAttached();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel("Full Name").fill("A");
  await page.getByLabel("Phone / WhatsApp").fill("123");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: /Submit/i }).click();
  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Enter a valid phone number")).toBeVisible();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
});

test("mobile navigation includes the fitness guide", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("link", { name: "Guide", exact: true })).toBeVisible();
});

test("guide and unknown routes have their own titles", async ({ page }) => {
  await page.goto("/guide");
  await expect(page.getByRole("heading", { name: /Progression/i })).toBeVisible();
  await expect(page).toHaveTitle(/Fitness Progression Guide/);
  await page.getByRole("button", { name: "Level 2" }).click();
  await expect(page.getByText("Currently viewing Level 2")).toBeVisible();

  await page.goto("/missing-page");
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
  await expect(page).toHaveTitle(/Page Not Found/);
});

test("BMI calculator explains an empty submission", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Calculate My BMI" }).click();
  await expect(page.getByRole("alert")).toContainText("weight");
});

test("coach uses its local fallback when the conversation API is unavailable", async ({ page }) => {
  await page.route("**/api/openrouter/conversations", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Coach unavailable" }),
    }),
  );

  await page.goto("/");
  await page.getByRole("button", { name: "Open AI Fitness Coach" }).click();

  const dialog = page.getByRole("dialog", { name: "Dotfit AI Coach" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Message the AI coach").fill("Fix my squat");
  await dialog.getByRole("button", { name: "Send message" }).click();

  await expect(dialog.getByText(/progressive overload/i)).toBeVisible();
  await expect(dialog.getByText("Offline", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/Offline coach mode/i)).toBeVisible();
  await expect(dialog.getByText(/couldn't connect to the coaching service/i)).toHaveCount(0);
});

test("coach uses its local fallback when the streaming provider returns an error", async ({ page }) => {
  await page.route("**/api/openrouter/conversations", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: 22, accessToken: "test-conversation-token" }),
    }),
  );
  await page.route("**/api/openrouter/conversations/22/messages", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: 'data: {"error":"AI service temporarily unavailable"}\n\n',
    }),
  );

  await page.goto("/");
  await page.getByRole("button", { name: "Open AI Fitness Coach" }).click();

  const dialog = page.getByRole("dialog", { name: "Dotfit AI Coach" });
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("dotfit_chat_conv_id"))).not.toBeNull();
  await dialog.getByLabel("Message the AI coach").fill("Fix my squat");
  await dialog.getByRole("button", { name: "Send message" }).click();

  await expect(dialog.getByText(/progressive overload/i)).toBeVisible();
  await expect(dialog.getByText("Offline", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/AI service temporarily unavailable/i)).toHaveCount(0);
});

test("clearing a coach session deletes its server conversation without creating a replacement", async ({ page }) => {
  let createdCount = 0;
  let deletedToken: string | null = null;

  await page.route("**/api/openrouter/conversations", (route) => {
    if (route.request().method() === "POST") {
      createdCount += 1;
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: 23, accessToken: "test-conversation-token" }),
      });
    }
    return route.fallback();
  });
  await page.route("**/api/openrouter/conversations/23", (route) => {
    if (route.request().method() === "DELETE") {
      deletedToken = route.request().headers()["x-conversation-token"] ?? null;
      return route.fulfill({ status: 204 });
    }
    return route.fallback();
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Open AI Fitness Coach" }).click();
  await expect.poll(() => createdCount).toBe(1);

  const dialog = page.getByRole("dialog", { name: "Dotfit AI Coach" });
  await dialog.getByLabel("Message the AI coach").fill("Private draft");
  await dialog.getByRole("button", { name: "Clear conversation" }).click();

  await expect.poll(() => deletedToken).toBe("test-conversation-token");
  await expect(dialog.getByLabel("Message the AI coach")).toHaveValue("");
  expect(createdCount).toBe(1);
});

test("clearing while a conversation is being created discards the late server session", async ({ page }) => {
  let resolveCreation: (() => void) | undefined;
  let deletedToken: string | null = null;

  await page.route("**/api/openrouter/conversations", async (route) => {
    if (route.request().method() === "POST") {
      await new Promise<void>((resolve) => {
        resolveCreation = resolve;
      });
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: 24, accessToken: "late-conversation-token" }),
      });
    }
    return route.fallback();
  });
  await page.route("**/api/openrouter/conversations/24", (route) => {
    if (route.request().method() === "DELETE") {
      deletedToken = route.request().headers()["x-conversation-token"] ?? null;
      return route.fulfill({ status: 204 });
    }
    return route.fallback();
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Open AI Fitness Coach" }).click();
  await expect.poll(() => typeof resolveCreation).toBe("function");

  const dialog = page.getByRole("dialog", { name: "Dotfit AI Coach" });
  await dialog.getByRole("button", { name: "Clear conversation" }).click();
  resolveCreation!();

  await expect.poll(() => deletedToken).toBe("late-conversation-token");
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("dotfit_chat_conv_id")))
    .toBeNull();
});

test("clearing while a stored conversation loads deletes the stored server session", async ({ page }) => {
  let resolveLoad: (() => void) | undefined;
  let deletedToken: string | null = null;

  await page.addInitScript(() => {
    sessionStorage.setItem(
      "dotfit_chat_conv_id",
      JSON.stringify({ id: 25, token: "stored-conversation-token" }),
    );
  });
  await page.route("**/api/openrouter/conversations/25", async (route) => {
    if (route.request().method() === "GET") {
      await new Promise<void>((resolve) => {
        resolveLoad = resolve;
      });
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ messages: [] }),
      });
    }
    if (route.request().method() === "DELETE") {
      deletedToken = route.request().headers()["x-conversation-token"] ?? null;
      return route.fulfill({ status: 204 });
    }
    return route.fallback();
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Open AI Fitness Coach" }).click();
  await expect.poll(() => typeof resolveLoad).toBe("function");

  const dialog = page.getByRole("dialog", { name: "Dotfit AI Coach" });
  await dialog.getByRole("button", { name: "Clear conversation" }).click();
  resolveLoad!();

  await expect.poll(() => deletedToken).toBe("stored-conversation-token");
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("dotfit_chat_conv_id")))
    .toBeNull();
});
