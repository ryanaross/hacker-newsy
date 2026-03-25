import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "tests", ".playwright-data");
const dbPath = path.join(dataDir, "hn.db");

export default defineConfig({
	testDir: "tests",
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	globalSetup: "./tests/global-setup.ts",
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry",
		...devices["Desktop Chrome"]
	},
	webServer: {
		command: "yarn build && yarn preview --host 127.0.0.1 --port 4173",
		port: 4173,
		reuseExistingServer: !process.env.CI,
		env: {
			...process.env,
			DB_PATH: dbPath,
			NODE_ENV: "production"
		}
	}
});
