import { expect, test } from "@playwright/test";

test.describe("cart actions", () => {
  test("moves from the empty cart to the shop page", async ({ page }) => {
    await page.goto("/cart");

    await page.getByRole("link", { name: "쇼핑하기" }).click();

    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("heading", { name: "Goods Shop" })).toBeVisible();
  });

  test("shows a login-required toast when an unauthenticated user tries to pay", async ({ page }) => {
    await page.goto("/cart");

    await page.getByRole("button", { name: /결제하기$/ }).click();

    await expect(page.getByText("로그인이 필요합니다.", { exact: true })).toBeVisible();
    await expect(page.getByText("로그인 후 결제할 수 있습니다.", { exact: true })).toBeVisible();
  });
});
