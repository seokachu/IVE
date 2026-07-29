import { expect, test } from "@playwright/test";

test.describe("auth form interactions", () => {
  test("enables the login submit button after entering valid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("example@example.com").fill("test@example.com");
    await page.getByPlaceholder("비밀번호", { exact: true }).fill("Password1!");

    await expect(page.getByRole("button", { name: "로그인", exact: true })).toBeEnabled();
  });

  test("shows a password mismatch error on signup", async ({ page }) => {
    await page.goto("/signup");

    await page.getByPlaceholder("example@example.com").fill("test@example.com");
    await page.getByPlaceholder("비밀번호", { exact: true }).fill("Password1!");
    await page.getByPlaceholder("비밀번호 확인").fill("Password2!");
    await page.getByPlaceholder("비밀번호 확인").blur();

    await expect(page.getByText("비밀번호가 일치하지 않습니다.")).toBeVisible();
    await expect(page.getByRole("button", { name: "가입하기" })).toBeDisabled();
  });

  test("requires terms agreement before enabling signup", async ({ page }) => {
    await page.goto("/signup");

    await page.getByPlaceholder("example@example.com").fill("test@example.com");
    await page.getByPlaceholder("비밀번호", { exact: true }).fill("Password1!");
    await page.getByPlaceholder("비밀번호 확인").fill("Password1!");

    //필수 약관 미동의 상태에서는 비활성화
    await expect(page.getByRole("button", { name: "가입하기" })).toBeDisabled();

    await page.getByLabel("약관에 모두 동의합니다").check();

    await expect(page.getByRole("button", { name: "가입하기" })).toBeEnabled();
  });
});
