import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
	addHighlightPattern,
	clearAllForTests,
	closeDb,
	getAllReadIds,
	getAllSavedIds,
	getHighlightPatterns,
	markArticleRead,
	removeSavedArticle,
	saveArticle
} from "./db";

beforeEach(() => {
	closeDb();
});

afterAll(() => {
	closeDb();
});

describe("db", () => {
	it("marks articles read", () => {
		markArticleRead(101);
		expect(getAllReadIds()).toContain(101);
	});

	it("manages highlight patterns", () => {
		expect(addHighlightPattern("  alpha  ")).toEqual(
			expect.objectContaining({ id: expect.any(Number) })
		);
		expect(addHighlightPattern("alpha")).toBeNull();
		const rows = getHighlightPatterns();
		expect(rows.some((r) => r.pattern === "alpha")).toBe(true);
	});

	it("saves articles and lists ids", () => {
		saveArticle(202, "https://example.com/a", "A");
		expect(getAllSavedIds()).toContain(202);
		removeSavedArticle(202);
		expect(getAllSavedIds()).not.toContain(202);
	});

	it("clearAllForTests wipes tables", () => {
		markArticleRead(999);
		clearAllForTests();
		expect(getAllReadIds()).toEqual([]);
	});
});
