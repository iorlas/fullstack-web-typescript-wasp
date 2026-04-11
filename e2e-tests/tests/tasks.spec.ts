import { expect, test } from "@playwright/test";
import { logIn, signUp, uniqueEmail } from "./helpers";

test.describe("Tasks page (unauthenticated)", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Tasks CRUD (authenticated)", () => {
  const email = uniqueEmail();
  const password = "TestPassword123!";
  const username = "testuser123";

  test.beforeEach(async ({ page }) => {
    // Sign up, then log in. With SKIP_EMAIL_VERIFICATION_IN_DEV=true, signup auto-verifies.
    // If user already exists from a previous test, signup page will show an error — skip to login.
    await signUp(page, email, password, username);
    const signupFailed = await page
      .getByText(/already exists|already registered/i)
      .isVisible()
      .catch(() => false);
    if (!signupFailed) {
      // Fresh signup — navigate to login
      await page.goto("/login");
    }
    await logIn(page, email, password);
  });

  test("should show tasks page after login", async ({ page }) => {
    await expect(page).toHaveURL("/");
    // Should see the task creation form or empty state
    await expect(
      page.getByText(/no tasks found|add a task/i).or(page.getByRole("textbox")),
    ).toBeVisible();
  });

  test("should create a task", async ({ page }) => {
    const taskDescription = `Test task ${Date.now()}`;
    const input = page.getByPlaceholder(/what do i need to do/i).or(page.getByRole("textbox"));
    await input.fill(taskDescription);
    await page.getByRole("button", { name: /add|create/i }).click();

    // Task should appear in the list
    await expect(page.getByText(taskDescription)).toBeVisible({ timeout: 5000 });
  });

  test("should toggle task completion", async ({ page }) => {
    // Create a task first
    const taskDescription = `Toggle task ${Date.now()}`;
    const input = page.getByPlaceholder(/what do i need to do/i).or(page.getByRole("textbox"));
    await input.fill(taskDescription);
    await page.getByRole("button", { name: /add|create/i }).click();
    await expect(page.getByText(taskDescription)).toBeVisible({ timeout: 5000 });

    // Toggle completion via checkbox
    const taskItem = page.getByText(taskDescription).locator("..");
    const checkbox = taskItem.getByRole("checkbox");
    await checkbox.click();

    // Should show as completed (checked)
    await expect(checkbox).toBeChecked({ timeout: 5000 });
  });
});
