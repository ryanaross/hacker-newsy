<script lang="ts">
	import { browser } from "$app/environment";
	import { goto, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import * as Sheet from "$lib/components/ui/sheet";
	import { Switch } from "$lib/components/ui/switch";
	import * as Tabs from "$lib/components/ui/tabs";
	import {
		infiniteScroll,
		theme,
		fontFamily,
		type ThemeOption,
		type FontOption
	} from "$lib/stores/features";
	import { items } from "$lib/stores/items";
	import { Download, Equal, Trash2 } from "lucide-svelte";

	if (browser) {
		infiniteScroll.subscribe((infiniteScroll) => {
			if (infiniteScroll) {
				$items = $items.slice(0, 30);
			} else {
				goto($page.url.pathname);
			}
		});
	}

	const themes: { value: ThemeOption; label: string }[] = [
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
		{ value: "dark-blue", label: "Navy" }
	];

	const fonts: { value: FontOption; label: string }[] = [
		{ value: "system", label: "System" },
		{ value: "serif", label: "Serif" },
		{ value: "mono", label: "Mono" }
	];

	let newPattern = "";
	let patternError = "";
	let busy = false;
	let exportMsg = "";
	let activeTab: "settings" | "highlights" = "settings";

	$: highlightRows = $page.data.highlightPatterns ?? [];

	async function addPattern() {
		patternError = "";
		busy = true;
		try {
			const res = await fetch("/api/highlights", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pattern: newPattern })
			});
			if (!res.ok) {
				try {
					const j = (await res.json()) as { error?: string };
					patternError = j.error ?? `HTTP ${res.status}`;
				} catch {
					patternError = `HTTP ${res.status}`;
				}
				return;
			}
			newPattern = "";
			await invalidateAll();
		} finally {
			busy = false;
		}
	}

	async function removePattern(id: number) {
		busy = true;
		try {
			await fetch(`/api/highlights/${id}`, { method: "DELETE" });
			await invalidateAll();
		} finally {
			busy = false;
		}
	}

	async function exportSavedUrls() {
		exportMsg = "";
		busy = true;
		try {
			const res = await fetch("/api/saved/export", { method: "POST" });
			const j = (await res.json()) as { ok: boolean; count?: number };
			exportMsg = j.ok ? `Exported ${j.count} URLs` : "Export failed";
		} catch {
			exportMsg = "Export failed";
		} finally {
			busy = false;
		}
	}
</script>

<Sheet.Root>
	<Sheet.Trigger aria-label="Open settings"><Equal strokeWidth={1.55} /></Sheet.Trigger>
	<Sheet.Content>
		<Tabs.Root bind:value={activeTab} class="w-full max-w-[400px] standalone:pt-12">
			<Tabs.List>
				<Tabs.Trigger value="settings">settings</Tabs.Trigger>
				<Tabs.Trigger value="highlights">highlights</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="settings" class="space-y-6 pt-2">
				<div>
					<Label class="mb-2 block">theme</Label>
					<div class="flex gap-2">
						{#each themes as t}
							<Button
								variant={$theme === t.value ? "default" : "outline"}
								size="sm"
								on:click={() => ($theme = t.value)}
							>
								{t.label}
							</Button>
						{/each}
					</div>
				</div>
				<div>
					<Label class="mb-2 block">font</Label>
					<div class="flex gap-2">
						{#each fonts as f}
							<Button
								variant={$fontFamily === f.value ? "default" : "outline"}
								size="sm"
								on:click={() => ($fontFamily = f.value)}
							>
								{f.label}
							</Button>
						{/each}
					</div>
				</div>
				<div>
					<Label for="scroll" class="my-2 block">infinite scroll</Label>
					<Switch id="scroll" class="my-2 block" bind:checked={$infiniteScroll} />
				</div>
				<div>
					<Label class="mb-2 block">saved URLs</Label>
					<Button variant="outline" size="sm" disabled={busy} on:click={exportSavedUrls}>
						<Download class="mr-2 h-4 w-4" />
						Export to file
					</Button>
					{#if exportMsg}
						<p class="mt-1 text-sm text-muted-foreground">{exportMsg}</p>
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content value="highlights">
				<p class="mb-3 text-sm text-muted-foreground">
					Case-insensitive substring match on title or domain. Shown with a ring on the list.
				</p>
				<div class="flex gap-2">
					<input
						id="new-pattern"
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						placeholder="e.g. rust, AI, kubernetes"
						bind:value={newPattern}
						disabled={busy}
						on:keydown={(e) => e.key === "Enter" && addPattern()}
					/>
					<Button type="button" disabled={busy || !newPattern.trim()} on:click={addPattern}
						>Add</Button
					>
				</div>
				{#if patternError}
					<p class="mt-2 text-sm text-destructive">{patternError}</p>
				{/if}
				<ul class="mt-4 space-y-2">
					{#each highlightRows as row (row.id)}
						<li class="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
							<span class="truncate font-mono text-sm">{row.pattern}</span>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								class="h-8 w-8 shrink-0"
								disabled={busy}
								aria-label={`Remove pattern ${row.pattern}`}
								on:click={() => removePattern(row.id)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</li>
					{:else}
						<li class="text-sm text-muted-foreground">No patterns yet.</li>
					{/each}
				</ul>
			</Tabs.Content>
		</Tabs.Root>
	</Sheet.Content>
</Sheet.Root>
