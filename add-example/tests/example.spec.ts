import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("http://localhost:3000/examples");

	await expect(page).toHaveTitle(/Example/);
});
