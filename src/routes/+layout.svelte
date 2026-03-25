<script lang="ts">
	import { browser } from "$app/environment";
	import "../app.pcss";
	import { syncUserStateFromServer } from "$lib/stores/userState";
	import { theme, fontFamily } from "$lib/stores/features";
	import Header from "./header.svelte";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	$: syncUserStateFromServer({
		readIds: data.readIds,
		savedIds: data.savedIds,
		highlightPatterns: data.highlightPatterns
	});

	const fontClassMap = { system: "", serif: "font-serif", mono: "font-mono" } as const;

	$: if (browser) {
		const html = document.documentElement;
		html.classList.remove("dark", "dark-blue");
		if ($theme !== "light") html.classList.add($theme);

		html.classList.remove("font-serif", "font-mono");
		const fc = fontClassMap[$fontFamily];
		if (fc) html.classList.add(fc);
	}
</script>

<Header />
<div
	class="container mx-auto mb-12 max-w-[80ch] px-6 pb-[env(safe-area-inset-bottom)]"
>
	<slot />
</div>
