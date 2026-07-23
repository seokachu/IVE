import { expect, test } from "@playwright/test";

test.describe("login flow guards", () => {
  test("redirects /login?form=signup to /login when the signup cookie is missing", async ({ page }) => {
    await page.goto("/login?form=signup");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });

  test("renders the first-login variant when the signup cookie exists", async ({ context, page }) => {
    await context.addCookies([
      {
        name: "firstSignup",
        value: "true",
        domain: "127.0.0.1",
        path: "/",
      },
    ]);

    await page.goto("/login?form=signup");

    await expect(page).toHaveURL(/\/login\?form=signup$/);
    await expect(page.getByRole("heading", { name: "회원이 되신 것을 축하드립니다!" })).toBeVisible();
    await expect(page.getByPlaceholder("example@example.com")).toBeVisible();
  });
});
