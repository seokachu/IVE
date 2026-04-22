import { expect, test } from "@playwright/test";

test.describe("auth pages", () => {
  test("renders login form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    await expect(page.getByPlaceholder("example@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인", exact: true })).toBeDisabled();
  });

  test("renders signup form", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.getByRole("heading", { name: "회원가입" })).toBeVisible();
    await expect(page.getByPlaceholder("example@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호", { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호 확인")).toBeVisible();
    await expect(page.getByRole("button", { name: "가입하기" })).toBeDisabled();
  });
});
