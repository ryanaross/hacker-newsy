import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		files: ["**/*.svelte", "**/*.svelte.ts"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".svelte"]
			}
		}
	},
	{
		ignores: ["build/**", ".svelte-kit/**", "node_modules/**", "dist/**", "package/**"]
	},
	{
		rules: {
			// App uses string paths and HN-sourced HTML; stricter SvelteKit rules are noisy here.
			"svelte/no-navigation-without-resolve": "off",
			"svelte/require-each-key": "off",
			"svelte/no-at-html-tags": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^\\$\\$",
					caughtErrorsIgnorePattern: "^_"
				}
			]
		}
	}
);
