<script lang="ts">
	import { page } from "$app/stores";
	import { theme } from "$lib/stores/features";
	import Settings from "./settings.svelte";

	$: isDarkish = $theme === "dark" || $theme === "dark-blue";
</script>

<header
	class="w-full border-b bg-background standalone:pt-[env(safe-area-inset-top)]"
	class:bg-[rgb(2,4,8)]={isDarkish}
>
	<nav class="flex items-center justify-between px-4 py-6 md:px-6 lg:px-12">
		<div class="rounded-md bg-primary px-2 py-1.5">
			<a href="/" class="font-semibold text-primary-foreground">hn</a>
		</div>
		<div class="flex space-x-2 text-xl sm:space-x-4 md:space-x-8">
			<a href="/news" class={`${$page.url.pathname === "/news" ? "font-semibold" : ""}`}>top</a>
			<a href="/newest" class={`${$page.url.pathname === "/newest" ? "font-semibold" : ""}`}>new</a>
			<a href="/ask" class={`${$page.url.pathname === "/ask" ? "font-semibold" : ""}`}>ask</a>
			<a href="/show" class={`${$page.url.pathname === "/show" ? "font-semibold" : ""}`}>show</a>
			<a href="/jobs" class={`${$page.url.pathname === "/jobs" ? "font-semibold" : ""}`}>jobs</a>
		</div>
		<Settings />
	</nav>
</header>
