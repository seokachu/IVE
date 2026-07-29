import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the layout chrome", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  //swiper 메이저 업데이트 회귀 감지용 — 앨범·굿즈 캐러셀이 슬라이드를 렌더링하는지
  test("renders carousel slides", async ({ page }) => {
    await page.goto("/");

    const slides = page.locator(".swiper-slide");
    await expect(slides.first()).toBeVisible({ timeout: 15000 });
    await expect(slides.nth(1)).toBeVisible();
  });
});
