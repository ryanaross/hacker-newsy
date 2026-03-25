import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), ".playwright-data");
const savedUrlsPath = path.join(dataDir, "saved-urls.txt");

test.describe("API", () => {
	test("read round-trip", async ({ request }) => {
		const id = 9_001_355;
		const post = await request.post("/api/read", {
			data: { id }
		});
		expect(post.ok()).toBeTruthy();
		const get = await request.get("/api/read");
		expect(get.ok()).toBeTruthy();
		const body = (await get.json()) as { ids: number[] };
		expect(body.ids).toContain(id);
	});

	test("highlights CRUD", async ({ request }) => {
		const post = await request.post("/api/highlights", {
			data: { pattern: "playwright-pattern-xyz" }
		});
		expect(post.ok()).toBeTruthy();
		const get = await request.get("/api/highlights");
		const body = (await get.json()) as { patterns: { id: number; pattern: string }[] };
		const row = body.patterns.find((p) => p.pattern === "playwright-pattern-xyz");
		expect(row).toBeTruthy();
		const del = await request.delete(`/api/highlights/${row!.id}`);
		expect(del.ok()).toBeTruthy();
	});

	test("saved writes text file", async ({ request }) => {
		const url = "https://example.com/playwright-saved";
		const post = await request.post("/api/saved", {
			data: { id: 42_424, url, title: "Playwright save" }
		});
		expect(post.ok()).toBeTruthy();
		const txt = readFileSync(savedUrlsPath, "utf8");
		expect(txt).toContain(url);
		const del = await request.delete("/api/saved/42424");
		expect(del.ok()).toBeTruthy();
	});
});

test.describe("Settings UI", () => {
	test("add highlight pattern", async ({ page }) => {
		await page.goto("/news");
		await page.getByRole("button", { name: "Open settings" }).click();
		await page.getByRole("tab", { name: "highlights" }).click();
		const input = page.getByPlaceholder(/rust, AI/i);
		await input.fill("unique-playwright-highlight");
		await page.getByRole("button", { name: "Add" }).click();
		await expect(page.getByText("unique-playwright-highlight")).toBeVisible();
	});
});
