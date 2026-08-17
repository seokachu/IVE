import { expect, test } from "@playwright/test";

test("renders the empty cart state for a new visitor", async ({ page }) => {
  await page.goto("/cart");

  await expect(page.getByRole("heading", { name: "장바구니", exact: true })).toBeVisible();
  await expect(page.getByText("장바구니가 비어 있어요")).toBeVisible();
  await expect(page.getByRole("link", { name: "굿즈샵 구경하러 가기" })).toHaveAttribute("href", "/shop");
});
