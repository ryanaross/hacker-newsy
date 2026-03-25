import { expect, test } from "@playwright/test";

test("root redirects to /news", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveURL(/\/news$/);
});

test("news list shows numbered rows", async ({ page }) => {
	await page.goto("/news");
	await expect(page.getByRole("link", { name: "top", exact: true })).toBeVisible();
	await expect(page.getByText(/^1\.$/).first()).toBeVisible();
});
