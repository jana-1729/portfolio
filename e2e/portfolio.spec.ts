import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home renders all main sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero")).toBeVisible({ timeout: 10_000 });
  for (const id of ["about", "metrics", "experience", "projects", "skills", "awards", "github", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible({ timeout: 10_000 });
  }
});

test("⌘K opens command palette", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  await expect(page.getByPlaceholder(/Type a command/i)).toBeVisible({ timeout: 5_000 });
});

test("project card opens modal", async ({ page }) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  const firstCard = page.getByRole("button", { name: /Open .* case study/i }).first();
  await firstCard.click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
});

test("a11y violations on home (serious/critical only)", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  if (serious.length > 0) {
    console.log("AXE VIOLATIONS:", JSON.stringify(serious, null, 2));
  }
  expect(serious).toEqual([]);
});

test("reduced motion still renders hero", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#hero")).toBeVisible();
});
