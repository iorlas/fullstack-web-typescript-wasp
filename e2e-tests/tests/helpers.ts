import { expect, type Page } from "@playwright/test";

/**
 * Sign up a new user via the UI.
 * Uses the Dummy email provider so no real email is sent.
 */
export async function signUp(
  page: Page,
  email: string,
  password: string,
  username: string,
): Promise<void> {
  await page.goto("/signup");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign up/i }).click();
}

/**
 * Log in an existing user via the UI.
 */
export async function logIn(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /log in/i }).click();
  // Wait for redirect to main page
  await expect(page).toHaveURL("/", { timeout: 10000 });
}

/**
 * Generate a unique email for test isolation.
 */
export function uniqueEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}
