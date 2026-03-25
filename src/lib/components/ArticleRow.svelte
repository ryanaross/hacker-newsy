<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { matchesHighlight } from "$lib/matchHighlight";
	import {
		highlightPatternStrings,
		markReadClient,
		markUnreadClient,
		readArticleIds,
		saveArticleClient,
		savedArticleIds,
		unsaveArticleClient
	} from "$lib/stores/userState";
	import { Bookmark, Eye, EyeOff } from "lucide-svelte";

	export let item: {
		id: number;
		title: string;
		domain?: string;
		url?: string;
		points?: number;
		user?: string;
		time_ago?: string;
		comments_count: number;
	};
	export let rank: number;

	$: isRead = $readArticleIds.has(item.id);
	$: isSaved = $savedArticleIds.has(item.id);
	$: highlighted = matchesHighlight(item.title, item.domain, $highlightPatternStrings);

	async function toggleSave() {
		if (isSaved) {
			await unsaveArticleClient(item.id);
		} else {
			await saveArticleClient(item);
		}
	}
</script>

<div
	class="mt-2 flex rounded-md py-2"
	class:ring-2={highlighted}
	class:ring-primary={highlighted}
	class:ring-offset-2={highlighted}
	class:ring-offset-background={highlighted}
	role="listitem"
>
	<p class="text-xl text-muted-foreground">{rank}.</p>
	<div class="ms-4 min-w-0 flex-1">
		<a
			href={`/item/${item.id}`}
			class="block break-words text-xl font-semibold"
			class:opacity-50={isRead}
			on:click={() => markReadClient(item.id)}
		>
			<h2 class="inline">{item.title}</h2>
			{#if isSaved}
				<Bookmark
					class="ms-1 inline h-4 w-4 fill-primary align-[-0.125em] text-primary"
					aria-hidden="true"
				/>
			{/if}
		</a>
		<div class="flex flex-auto flex-wrap space-x-1">
			{#if item.domain}
				<a href={item.url} target="_blank" rel="noreferrer" class="text-sm text-primary"
					>{item.domain}</a
				>
				<p class="text-muted-foreground">・</p>
			{/if}
			{#if item.points != null}
				<p class="text-sm">{item.points} {item.points === 1 ? "point" : "points"}</p>
				<p class="text-sm text-muted-foreground">・</p>
			{/if}
			{#if item.user}
				<a href={`/user/${item.user}`} class="whitespace-nowrap text-sm font-bold underline"
					>{item.user}</a
				>
				<p class="text-muted-foreground">・</p>
			{/if}
			{#if item.time_ago}
				<p class="text-sm text-muted-foreground">{item.time_ago}</p>
				<p class="text-muted-foreground">・</p>
			{/if}
			{#if item.comments_count >= 0}
				<p class="text-sm text-muted-foreground">
					{item.comments_count}
					{item.comments_count === 1 ? "comment" : "comments"}
				</p>
			{/if}
		</div>
	</div>
	<div class="shrink-0 items-start pt-1">
		{#if isRead}
			<Button
				type="button"
				variant="ghost"
				size="icon"
				class="h-9 w-9"
				on:click={() => markUnreadClient(item.id)}
				aria-label="Mark as unread"
			>
				<EyeOff class="h-5 w-5 text-muted-foreground" />
			</Button>
		{/if}
		<Button
			type="button"
			variant="ghost"
			size="icon"
			class="h-9 w-9"
			on:click={toggleSave}
			aria-label={isSaved ? "Remove saved article URL" : "Save article URL"}
		>
			<Bookmark class={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
		</Button>
	</div>
</div>
