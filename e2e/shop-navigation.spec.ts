import { expect, test } from "@playwright/test";

test("navigates from shop list to product detail", async ({ page }) => {
  test.setTimeout(60000);

  await page.goto("/shop");

  await expect(page.getByRole("heading", { name: "Goods Shop" })).toBeVisible();

  const firstProduct = page.getByTestId("shop-item").first();
  await expect(firstProduct).toBeVisible({ timeout: 15000 });
  const detailPath = await firstProduct.getAttribute("data-detail-path");

  expect(detailPath).toBeTruthy();
  await page.goto(detailPath!, { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/shop\/[^/]+$/);
  await expect(page.getByRole("heading", { name: "궁금한 점이 있나요?" })).toBeVisible({ timeout: 20000 });
});
