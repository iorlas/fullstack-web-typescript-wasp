import { expect, test } from "@playwright/test";

test.describe("Tasks page (authenticated)", () => {
  // NOTE: These tests require a running Wasp app with a seeded user.
  // For a full e2e flow, sign up + verify email first.
  // The Dummy email provider logs verification links to the server console.
  //
  // For now, these tests verify the unauthenticated redirect behavior.
  // Extend with authenticated tests once you have a test user setup strategy.

  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page has correct title", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/fullstack-web-typescript-wasp/i);
  });
});
