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
