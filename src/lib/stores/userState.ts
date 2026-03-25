import { derived, writable } from "svelte/store";

export type HighlightRow = { id: number; pattern: string };

export type UserStatePayload = {
	readIds: number[];
	savedIds: number[];
	highlightPatterns: HighlightRow[];
};

export const readArticleIds = writable<Set<number>>(new Set());
export const savedArticleIds = writable<Set<number>>(new Set());
export const highlightPatternRows = writable<HighlightRow[]>([]);

export const highlightPatternStrings = derived(highlightPatternRows, ($rows) =>
	$rows.map((r) => r.pattern)
);

export function syncUserStateFromServer(data: UserStatePayload) {
	readArticleIds.set(new Set(data.readIds));
	savedArticleIds.set(new Set(data.savedIds));
	highlightPatternRows.set(data.highlightPatterns);
}

export async function markReadClient(articleId: number) {
	readArticleIds.update((s) => {
		const next = new Set(s);
		next.add(articleId);
		return next;
	});
	try {
		await fetch("/api/read", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: articleId })
		});
	} catch {
		/* server logs failures; UI already optimistic */
	}
}

export async function markUnreadClient(articleId: number) {
	readArticleIds.update((s) => {
		const next = new Set(s);
		next.delete(articleId);
		return next;
	});
	try {
		await fetch(`/api/read/${articleId}`, { method: "DELETE" });
	} catch {
		/* server logs failures; UI already optimistic */
	}
}

export async function saveArticleClient(item: {
	id: number;
	url?: string | null;
	title?: string | null;
}) {
	const url = item.url?.trim() || `https://news.ycombinator.com/item?id=${item.id}`;
	const title = item.title ?? null;
	savedArticleIds.update((s) => {
		const next = new Set(s);
		next.add(item.id);
		return next;
	});
	await fetch("/api/saved", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: item.id, url, title })
	});
}

export async function unsaveArticleClient(articleId: number) {
	savedArticleIds.update((s) => {
		const next = new Set(s);
		next.delete(articleId);
		return next;
	});
	await fetch(`/api/saved/${articleId}`, { method: "DELETE" });
}
