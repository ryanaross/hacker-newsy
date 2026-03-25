import { describe, expect, it } from "vitest";
import { matchesHighlight } from "./matchHighlight";

describe("matchesHighlight", () => {
	it("matches title case-insensitively", () => {
		expect(matchesHighlight("Why Rust wins", undefined, ["rust"])).toBe(true);
	});

	it("matches domain", () => {
		expect(matchesHighlight("Hello", "github.com", ["hub"])).toBe(true);
	});

	it("returns false when no patterns", () => {
		expect(matchesHighlight("x", "y", [])).toBe(false);
	});
});
