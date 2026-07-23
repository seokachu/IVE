import { expect, test } from "@playwright/test";

test("navigates from board list to board detail", async ({ page }) => {
  test.setTimeout(60000);

  await page.goto("/board");

  await expect(page.getByRole("heading", { name: "자유게시판" })).toBeVisible();

  const firstBoardItem = page.getByTestId("board-item").first();
  await expect(firstBoardItem).toBeVisible({ timeout: 15000 });
  const detailPath = await firstBoardItem.getAttribute("data-detail-path");

  expect(detailPath).toBeTruthy();
  await page.goto(detailPath!, { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/board\/\d+$/);
  await expect(page.getByTestId("board-comments")).toBeVisible({ timeout: 20000 });
  await expect(page.getByText(/댓글\s+\d+개/)).toBeVisible();
});
