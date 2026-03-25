import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		vi.stubEnv("DEBUG", "false");
		vi.stubEnv("NODE_ENV", "development");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	it("logs info with metadata", () => {
		logger.info("hello", { a: 1 });
		expect(logSpy).toHaveBeenCalled();
		const line = String(logSpy.mock.calls[0][0]);
		expect(line).toContain("hello");
	});

	it("skips debug when DEBUG is not true", () => {
		vi.stubEnv("DEBUG", "false");
		logger.debug("hidden");
		expect(logSpy).not.toHaveBeenCalled();
	});

	it("logs debug when DEBUG is true", () => {
		vi.stubEnv("DEBUG", "true");
		logger.debug("shown");
		expect(logSpy).toHaveBeenCalled();
	});
});
