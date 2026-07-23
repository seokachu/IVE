import { expect, test } from "@playwright/test";

test.describe("protected routes", () => {
  test("redirects unauthenticated users from /mypage to /login", async ({ page }) => {
    await page.goto("/mypage");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });

  test("redirects unauthenticated users from /payment/success to /login", async ({ page }) => {
    await page.goto("/payment/success?orderId=test-order");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });
});
