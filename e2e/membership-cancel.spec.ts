import { expect, test } from "@playwright/test";

// 실제 빌링(구독 → 해지 → 해지 취소)은 토스 결제창과 구독 중인 계정이 필요해 자동화 대상이 아니다.
// 여기서는 로그인 없이 상태를 되돌릴 수 없다는 것과, 라우트가 JSON 계약대로 응답하는지만 검증한다.
test.describe("membership cancel API guards", () => {
  test("rejects 해지 without a session", async ({ request }) => {
    const response = await request.post("/api/membership/cancel");

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: "로그인이 필요합니다." });
  });

  test("rejects 해지 취소 without a session", async ({ request }) => {
    const response = await request.delete("/api/membership/cancel");

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: "로그인이 필요합니다." });
  });

  test("redirects unauthenticated users from /mypage/membership to /login", async ({ page }) => {
    await page.goto("/mypage/membership");

    await expect(page).toHaveURL(/\/login$/);
  });
});
