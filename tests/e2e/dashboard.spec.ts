import { expect, test } from "@playwright/test";

test("renders the empty dashboard bootstrap", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /base pronta para construir o finance-ai/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /dashboard inicial vazio/i })).toBeVisible();
});
