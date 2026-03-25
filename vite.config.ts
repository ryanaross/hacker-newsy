import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		external: ["better-sqlite3"]
	},
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		environment: "node",
		env: {
			VITEST: "true",
			DB_PATH: ":memory:"
		}
	}
});
