import { expect, test } from "@playwright/test";

test.describe("payment route guards", () => {
  test("redirects unauthenticated users from /payment/fail to /login", async ({ page }) => {
    await page.goto("/payment/fail?orderId=test-order&message=test", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });

  test("redirects /payment/success without orderId for unauthenticated users to /login first", async ({ page }) => {
    await page.goto("/payment/success", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });
});
