import { expect, test } from "@playwright/test";

test.describe("payment route guards", () => {
  test("redirects unauthenticated users from /payment/fail to /login", async ({ page }) => {
    await page.goto("/payment/fail?orderId=test-order&message=test", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });

  // /payment/* 서버 인증 체크는 PG 복귀 시 쿠키 누락 때문에 클라이언트 AuthGuard로
  // 이관됨(306038c) — orderId가 없으면 proxy가 인증과 무관하게 홈으로 보낸다.
  test("redirects /payment/success without orderId to the home page", async ({ page }) => {
    await page.goto("/payment/success", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(/\/$/);
  });
});
